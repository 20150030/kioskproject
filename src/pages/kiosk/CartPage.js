import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const CartPage = ({ cartFoods, setCartFoods }) => {
  const [step, setStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState("");

  // 장바구니 데이터를 음식별로 그룹화
  const groupedFoods = cartFoods.reduce((acc, food) => {
    const existingFood = acc.find((f) => f.id === food.id);
    if (existingFood) {
      existingFood.quantity += 1; // 수량 증가
    } else {
      acc.push({ ...food, quantity: 1 }); // 새로운 음식 추가
    }
    return acc;
  }, []);

  const totalPrice = groupedFoods.reduce(
    (sum, food) => sum + food.price * food.quantity,
    0
  );

  // 장바구니 항목 삭제
  const handleRemoveItem = (id) => {
    setCartFoods((prevCart) => prevCart.filter((food) => food.id !== id));
  };

  // 결제 완료 처리
  const handleCheckout = async () => {
    try {
      if (groupedFoods.length === 0) {
        alert("장바구니가 비어 있습니다.");
        return;
      }

      // 랜덤 주문번호 생성
      const randomAlphabet = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
      const randomNumber = String(Math.floor(Math.random() * 100)).padStart(2, "0"); // 00-99
      const generatedOrderNumber = randomAlphabet + randomNumber; // 예: "A12", "Z34"
      setOrderNumber(generatedOrderNumber);

      // 각 음식 데이터를 주문으로 백엔드에 전송
      const promises = groupedFoods.flatMap((food) => {
        if (food.foodItemIds) {
          // 세트 메뉴의 경우
          return food.foodItemIds.map((foodItemId) =>
            axiosInstance.post("/kiosk/orders", {
              orderNumber: `${generatedOrderNumber}-${foodItemId}`,
              foodItemId,
              quantity: 1, // 세트 구성은 항상 수량 1
            })
          );
        }
        // 단품 메뉴의 경우
        return axiosInstance.post("/kiosk/orders", {
          orderNumber: generatedOrderNumber,
          foodItemId: food.id,
          quantity: food.quantity,
        });
      });

      const responses = await Promise.all(promises);
      console.log("주문 응답 데이터:", responses);

      alert("결제가 완료되었습니다!");
      setCartFoods([]); // 장바구니 비우기
      setStep(2); // 결제 완료 화면으로 이동
    } catch (error) {
      console.error("결제 실패:", error);
      alert("결제 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="p-6">
      {step === 1 && (
        <div>
          <h1 className="text-3xl font-bold mb-6">장바구니</h1>
          {groupedFoods.length === 0 ? (
            <p className="text-center text-gray-500">장바구니가 비어 있습니다.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {groupedFoods.map((food) => (
                <div
                  key={food.id}
                  className="border rounded-lg p-4 bg-white shadow-md flex items-center"
                >
                  <img
                    src={`http://localhost:8083/uploads${food.imageUrl}`}
                    alt={food.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{food.name}</h2>
                    <p>{food.price.toLocaleString()} 원</p>
                    <p>수량: {food.quantity}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(food.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    삭제
                  </button>
                </div>
              ))}
              <div className="text-right text-xl font-bold mt-4">
                총 가격: {totalPrice.toLocaleString()} 원
              </div>
              <button
                onClick={handleCheckout}
                className="bg-green-500 text-white px-6 py-3 mt-6 rounded w-full hover:bg-green-700"
              >
                결제하기
              </button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 text-green-500">
            결제가 완료되었습니다!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            주문번호: <span className="font-bold">{orderNumber}</span>
          </p>
          <p className="text-lg text-gray-600 mb-6">
            이용해주셔서 감사합니다.
          </p>
          <button
            onClick={() => setStep(1)} // Step 초기화
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            메인 화면으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;