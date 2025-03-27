import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const POSMenu = () => {
  const [isFoodMenuOpen, setFoodMenuOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const userRole = useSelector((state) => state.auth.userRole);

  const toggleFoodMenu = () => setFoodMenuOpen((prev) => !prev);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="relative w-full h-full"> {/* POS 영역 내부 기준 컨테이너 */}
      {/* 햄버거 버튼 - POS 내부 기준 좌측 상단에 고정 */}
      <button
        className="absolute top-4 left-4 z-50 text-white bg-gray-800 p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* 사이드바 - POS 영역 내부에서만 열리고 닫힘 */}
      <aside
        className={`absolute top-0 left-0 h-full bg-gray-900 text-gray-200 shadow-lg p-4 z-40 transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ width: "200px" }}
      >
        <h2 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">
          POS 메뉴
        </h2>
        <nav className="space-y-4">
          <Link
            to="/pos/orders"
            className="block py-2 px-3 rounded-lg hover:bg-gray-700 hover:text-white transition"
          >
            주문 목록
          </Link>

          <div>
            <button
              onClick={toggleFoodMenu}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-700 hover:text-white transition flex justify-between items-center"
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
              <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-700">
                <Link
                  to="/pos/food"
                  className="block py-1 px-2 rounded-lg hover:bg-gray-700 hover:text-white transition"
                >
                  메뉴 보기
                </Link>
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
    </div>
  );
};

export default POSMenu;