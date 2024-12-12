import React, { useEffect } from "react";
import KioskHeader from "../components/Header/KioskHeader";
import KioskFooter from "../components/Footer/KioskFooter";
import KioskMenu from "../components/menus/KioskMenu";

const KioskBasicLayout = ({ children,cartFoods,setCartFoods }) => {
  useEffect(() => {
    console.log("KioskBasicLayout cartFoods:", cartFoods);
  }, [cartFoods]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* 키오스크 전용 헤더 */}
      <KioskHeader />
      {/* 키오스크 전용 네브바 */}
      <KioskMenu cartFoods={cartFoods} setCartFoods={setCartFoods} />
      {/* 페이지 콘텐츠 */}
      <main className="flex-grow container mx-auto p-4">{children}</main>
      {/* 키오스크 전용 푸터 */}
      <KioskFooter />
    </div>
  );
};

export default KioskBasicLayout;