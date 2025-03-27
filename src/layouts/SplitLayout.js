import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import KioskBasicLayout from "../layouts/KioskBasicLayout";
import POSBasicLayout from "../layouts/POSBasicLayout";

const SplitLayout = ({ cartFoods, setCartFoods }) => {
  const location = useLocation();

  // 현재 경로가 키오스크 관련 경로인지 확인
  const isKioskRoute = location.pathname.startsWith("/kiosk");

  // 현재 경로가 POS 관련 경로인지 확인
  const isPOSRoute = location.pathname.startsWith("/pos");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 왼쪽 Kiosk 화면 */}
      <div style={{ flex: 1, borderRight: "1px solid #ccc", overflow: "auto" }}>
        <KioskBasicLayout cartFoods={cartFoods} setCartFoods={setCartFoods}>
          {isKioskRoute && <Outlet />} {/* Kiosk 관련 경로만 렌더링 */}
        </KioskBasicLayout>
      </div>

      {/* 오른쪽 POS 화면 */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <POSBasicLayout>
          {isPOSRoute && <Outlet />} {/* POS 관련 경로만 렌더링 */}
        </POSBasicLayout>
      </div>
    </div>
  );
};

export default SplitLayout;