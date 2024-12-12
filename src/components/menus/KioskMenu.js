import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const KioskMenu = ({ cartFoods = [] }) => {
  useEffect(() => {
    console.log("KioskMenu가 리렌더링되었습니다.");
  });

  console.log("현재 장바구니 아이템 수:", cartFoods.length);

  return (
    <nav className="bg-red-400 text-white p-4 shadow-md">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="w-1/4"></div>
        <div className="flex justify-center space-x-12 text-xl font-bold">
          <Link to="/kiosk/burger" className="hover:text-gray-200 transition duration-300">
            버거
          </Link>
          <Link to="/kiosk/set" className="hover:text-gray-200 transition duration-300">
            세트
          </Link>
          <Link to="/kiosk/side" className="hover:text-gray-200 transition duration-300">
            사이드
          </Link>
        </div>
        <div className="w-1/4 flex justify-end">
          <Link to="/kiosk/cart" className="text-xl font-bold hover:text-gray-200 transition duration-300">
            장바구니 ({cartFoods?.length || 0})
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default KioskMenu;