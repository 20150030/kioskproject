import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; // Redux 상태 가져오기

const POSMenu = () => {
  const [isFoodMenuOpen, setFoodMenuOpen] = useState(false);
  const userRole = useSelector((state) => state.auth.userRole); // Redux에서 userRole 가져오기

  const toggleFoodMenu = () => {
    setFoodMenuOpen((prev) => !prev);
  };

  return (
    <aside className="w-64 bg-gray-900 text-gray-200 h-screen p-4 shadow-lg">
      <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">
        POS 메뉴
      </h2>
      <nav className="space-y-4">
        {/* 주문 목록 */}
        <Link
          to="/pos/orders"
          className="block py-2 px-4 rounded-lg hover:bg-gray-700 hover:text-white transition"
        >
          주문 목록
        </Link>

        {/* 메뉴 관리 */}
        <div>
          <button
            onClick={toggleFoodMenu}
            className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700 hover:text-white transition flex justify-between items-center"
          >
            메뉴 관리
            <span
              className={`transform transition-transform duration-300 ${
                isFoodMenuOpen ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
          </button>
          <div
            className={`overflow-hidden transition-[max-height] duration-300 ${
              isFoodMenuOpen ? "max-h-40" : "max-h-0"
            }`}
          >
            <div className="mt-2 space-y-2 pl-6 border-l-2 border-gray-700">
              <Link
                to="/pos/food"
                className="block py-1 px-2 rounded-lg hover:bg-gray-700 hover:text-white transition"
              >
                메뉴 보기
              </Link>

              {/* 추가 버튼 */}
              <Link
                to="/pos/food/add"
                className={`block py-1 px-2 rounded-lg transition ${
                  userRole === "ROLE_ADMIN"
                    ? "hover:bg-gray-700 hover:text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
                style={{
                  pointerEvents: userRole === "ROLE_ADMIN" ? "auto" : "none",
                }}
              >
                추가
              </Link>

            
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default POSMenu;