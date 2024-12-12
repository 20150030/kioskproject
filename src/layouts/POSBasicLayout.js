import React from "react";
import POSHeader from "../components/Header/POSHeader";
import POSMenu from "../components/menus/POSMenu";
import POSFooter from "../components/Footer/POSFooter";

const POSBasicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* POS 전용 헤더 */}
      <POSHeader />
      {/* Main Layout: POSMenu + Content */}
      <div className="flex flex-1">
        {/* 사이드바 메뉴 */}
        <POSMenu />
        {/* 콘텐츠 영역 */}
        <div className="flex-1 p-4">{children}</div>
      </div>
      {/* POS 전용 푸터 */}
      <POSFooter />
    </div>
  );
};

export default POSBasicLayout;