import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 주문번호의 앞 3자리를 기준으로 그룹화
  const groupOrdersByPrefix = (orders) => {
    const grouped = orders.reduce((acc, order) => {
      const prefix = order.orderNumber.slice(0, 3); // 앞 3자리 추출
      if (!acc[prefix]) {
        acc[prefix] = [];
      }
      acc[prefix].push(order);
      return acc;
    }, {});
    return Object.entries(grouped).map(([prefix, foods]) => ({
      prefix,
      foods,
    }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/pos/orders");
        setOrders(groupOrdersByPrefix(response.data));
        setLoading(false);
      } catch (error) {
        console.error("주문 목록을 가져오는 데 실패했습니다:", error);
        setError("주문 목록을 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (prefix, newStatus) => {
    try {
      // 같은 그룹(prefix)의 모든 음식의 상태를 업데이트
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

      alert("주문 상태가 업데이트되었습니다.");
    } catch (error) {
      console.error("주문 상태 업데이트 실패:", error);
      alert("주문 상태를 업데이트하는 데 실패했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">주문 목록</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">현재 주문이 없습니다.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">주문번호</th>
              <th className="border border-gray-300 px-4 py-2">상품목록</th>
              <th className="border border-gray-300 px-4 py-2">상태</th>
              <th className="border border-gray-300 px-4 py-2">액션</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((group) => (
              <tr key={group.prefix}>
                <td className="border border-gray-300 px-4 py-2">{group.prefix}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {group.foods.map((food) => (
                    <div key={food.foodItemId}>
                      {food.foodName} (x{food.quantity})
                    </div>
                  ))}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {group.foods[0].status} {/* 모든 음식의 상태는 동일 */}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleUpdateStatus(group.prefix, "READY")}
                    className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-700"
                  >
                    READY
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(group.prefix, "COMPLETED")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
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