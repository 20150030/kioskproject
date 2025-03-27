import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null); // WebSocket 객체 추가

  // 주문번호를 그룹화하는 함수
  const groupOrdersByPrefix = (orders) => {
    const grouped = orders.reduce((acc, order) => {
      const prefix = order.orderNumber.slice(0, 3);
      if (!acc[prefix]) acc[prefix] = [];
      acc[prefix].push(order);
      return acc;
    }, {});
    return Object.entries(grouped).map(([prefix, foods]) => ({
      prefix,
      foods,
    }));
  };

  // 주문 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/pos/orders");
        setOrders(groupOrdersByPrefix(response.data));
        setLoading(false);
      } catch (error) {
        console.error("주문 목록 가져오기 실패:", error);
        setError("주문 목록을 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchOrders();

    // WebSocket 연결 설정
    const newSocket = new WebSocket("ws://localhost:8083/ws");
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket 연결 성공!");
    };

    newSocket.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket 에러:", error);
    };

    return () => {
      newSocket.close();
    };
  }, []);

  // 상태를 업데이트하는 함수
  const handleUpdateStatus = async (prefix, newStatus) => {
    try {
      const promises = orders
        .find((group) => group.prefix === prefix)
        .foods.map((food) =>
          axiosInstance.put(
            `/pos/orders/${food.orderNumber}/${food.foodItemId}/status`,
            null,
            { params: { status: newStatus } }
          )
        );

      await Promise.all(promises);

      // 상태가 "READY"로 변경된 경우 WebSocket 메시지 전송
      if (newStatus === "READY" && socket) {
        socket.send(
          JSON.stringify({
            action: "READY_ORDER",
            orderNumber: prefix,
            message: `주문번호 ${prefix}번이 준비되었습니다.`,
          })
        );
      }

      // 상태 업데이트 후 목록 갱신
      setOrders((prevOrders) =>
        prevOrders.map((group) =>
          group.prefix === prefix
            ? {
                ...group,
                foods: group.foods.map((food) => ({
                  ...food,
                  status: newStatus,
                })),
              }
            : group
        )
      );

      alert("주문 상태 업데이트 성공");
    } catch (error) {
      console.error("주문 상태 업데이트 실패:", error);
      alert("주문 상태 업데이트 실패");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">주문 목록</h1>
      {orders.length === 0 ? (
        <p>현재 주문이 없습니다.</p>
      ) : (
        <table className="table-auto w-full border-collapse border">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>상품목록</th>
              <th>상태</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((group) => (
              <tr key={group.prefix}>
                <td>{group.prefix}</td>
                <td>
                  {group.foods.map((food) => (
                    <div key={food.foodItemId}>
                      {food.foodName} (x{food.quantity})
                    </div>
                  ))}
                </td>
                <td>{group.foods[0].status}</td>
                <td>
                  <button
                    onClick={() => handleUpdateStatus(group.prefix, "READY")}
                    className="bg-blue-500 px-4 py-2 rounded"
                  >
                    READY
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(group.prefix, "COMPLETED")}
                    className="bg-green-500 px-4 py-2 rounded"
                  >
                    COMPLETED
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;