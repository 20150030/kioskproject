import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const SidePage = ({ cartFoods, setCartFoods }) => {
  const [sideMenu, setSideMenu] = useState([]);
  const [openfoodId, setOpenfoodId] = useState(null); // 열려 있는 항목 ID 상태

  useEffect(() => {
    const fetchSideMenu = async () => {
      try {
        const response = await axiosInstance.get("/kiosk/menu");
        const filteredMenu = response.data.filter(
          (food) =>
            (food.category === "SIDE" || food.category === "BEVERAGE") &&
            food.kioskAvailable === true
        );
        setSideMenu(filteredMenu);
      } catch (error) {
        console.error("사이드 메뉴를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchSideMenu();
  }, []);

  const toggleDescription = (id) => {
    setOpenfoodId((prevId) => (prevId === id ? null : id));
  };

  const handleAddToCart = (food) => {
    setCartFoods((prevCart) => [...prevCart, food]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">사이드 & 음료 메뉴</h1>
      <div className="grid grid-cols-3 gap-4">
        {sideMenu.map((food) => (
          <div key={food.id} className="border p-4 rounded shadow-md text-center">
            <img
              src={`http://localhost:8083/uploads${food.imageUrl}`}
              alt={food.name}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-semibold">{food.name}</h2>
            <p>{food.price.toLocaleString()} 원</p>
            <button
              onClick={() => toggleDescription(food.id)}
              className="mt-2 text-sm text-gray-700 hover:text-gray-900"
            >
              {openfoodId === food.id ? "▲ 설명 닫기" : "▼ 설명 보기"}
            </button>
            {openfoodId === food.id && (
              <p className="mt-2 text-gray-600">{food.description}</p>
            )}
            <button
              onClick={() => handleAddToCart(food)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              담기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidePage;