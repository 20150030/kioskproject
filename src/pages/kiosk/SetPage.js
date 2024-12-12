import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const SetPage = ({ cartFoods, setCartFoods }) => {
  const [menu, setMenu] = useState({ burger: [], side: [], beverage: [] });
  const [selection, setSelection] = useState({ burger: null, side: null, beverage: null });
  const [openfoodId, setOpenfoodId] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axiosInstance.get("/kiosk/menu");
        setMenu({
          burger: response.data.filter((food) => food.category === "BURGER" && food.kioskAvailable),
          side: response.data.filter((food) => food.category === "SIDE" && food.kioskAvailable),
          beverage: response.data.filter((food) => food.category === "BEVERAGE" && food.kioskAvailable),
        });
      } catch (error) {
        console.error("메뉴를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchMenu();
  }, []);

  const toggleDescription = (id) => {
    setOpenfoodId((prevId) => (prevId === id ? null : id));
  };

  const handleSelection = (category, food) => {
    setSelection((prev) => ({ ...prev, [category]: food }));
  };

  const handleAddSetToCart = () => {
    if (!selection.burger || !selection.side || !selection.beverage) {
      alert("모든 항목을 선택해야 세트를 추가할 수 있습니다.");
      return;
    }

    const randomAlphabet = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randomNumber = String(Math.floor(Math.random() * 100)).padStart(2, "0");
    const orderNumber = randomAlphabet + randomNumber;

    const setItem = {
      id: orderNumber,
      name: `세트: ${selection.burger.name}, ${selection.side.name}, ${selection.beverage.name}`,
      price: selection.burger.price + selection.side.price + selection.beverage.price,
      quantity: 1,
      description: `버거: ${selection.burger.name}, 사이드: ${selection.side.name}, 음료: ${selection.beverage.name}`,
      imageUrl: selection.burger.imageUrl,
      foodItemIds: [selection.burger.id, selection.side.id, selection.beverage.id],
    };

    setCartFoods((prevCart) => [...prevCart, setItem]);
    setSelection({ burger: null, side: null, beverage: null });
    alert("세트가 장바구니에 추가되었습니다.");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">세트 메뉴</h1>
      {["burger", "side", "beverage"].map((category) => (
        <div key={category} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {category === "burger" ? "버거" : category === "side" ? "사이드" : "음료"}를 선택하세요
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {menu[category].map((food) => (
              <div
                key={food.id}
                className={`border p-4 rounded shadow-md text-center ${
                  selection[category]?.id === food.id ? "border-blue-500 border-4" : ""
                }`}
                onClick={() => handleSelection(category, food)}
              >
                <img
                  src={`http://localhost:8083/uploads${food.imageUrl}`}
                  alt={food.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h2 className="text-lg font-semibold">{food.name}</h2>
                <p>{food.price.toLocaleString()} 원</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDescription(food.id);
                  }}
                  className="mt-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  {openfoodId === food.id ? "▲ 설명 닫기" : "▼ 설명 보기"}
                </button>
                {openfoodId === food.id && <p className="mt-2 text-gray-600">{food.description}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="text-center">
        <button
          onClick={handleAddSetToCart}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          세트 추가하기
        </button>
      </div>
    </div>
  );
};

export default SetPage;