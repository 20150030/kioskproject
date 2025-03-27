import React from "react";
import POSHeader from "../components/Header/POSHeader";
import POSMenu from "../components/menus/POSMenu";
import POSFooter from "../components/Footer/POSFooter";
import { useLocation } from "react-router-dom";


const POSBasicLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/pos/login";

  return (
<div className="flex flex-col h-full relative bg-gray-50">
        {/* POS 전용 헤더 */}
      <POSHeader />
      {/* Main Layout: POSMenu + Content */}
      <div className="flex flex-1">
        {/* 로그인 페이지가 아닐 때만 메뉴 보여주기 */}
        {!isLoginPage && <POSMenu />}
        {/* 콘텐츠 영역 */}
        <div className="flex-1 p-4 flex justify-center items-start">
            <div className="max-w-3xl w-full">{children}</div>
        </div>     
      </div>
      {/* POS 전용 푸터 */}
      <POSFooter />
    </div>
  );
};

export default POSBasicLayout;