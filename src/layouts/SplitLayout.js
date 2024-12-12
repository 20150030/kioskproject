import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import KioskBasicLayout from "../layouts/KioskBasicLayout";
import POSBasicLayout from "../layouts/POSBasicLayout";

const SplitLayout = ({ cartFoods, setCartFoods }) => {
  const location = useLocation();
  const [kioskMessage, setKioskMessage] = useState("");

  useEffect(() => {
    // 기본 WebSocket 설정
    const socket = new WebSocket("ws://localhost:8083/ws");

    // WebSocket 연결 성공
    socket.onopen = () => {
      console.log("WebSocket 연결 성공!");
    };

    // WebSocket 메시지 수신
    socket.onmessage = (event) => {
      console.log("받은 메시지:", event.data);
      setKioskMessage(event.data);

      // 일정 시간 후 메시지 숨김
      setTimeout(() => setKioskMessage(""), 5000);
    };

    // WebSocket 연결 종료
    socket.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    // WebSocket 에러 발생
    socket.onerror = (error) => {
      console.error("WebSocket 에러:", error);
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      socket.close();
    };
  }, []);

  const isKioskRoute = location.pathname.startsWith("/kiosk");
  const isPOSRoute = location.pathname.startsWith("/pos");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Kiosk 화면 */}
      <div style={{ flex: 1, borderRight: "1px solid #ccc", overflow: "auto" }}>
        <KioskBasicLayout cartFoods={cartFoods} setCartFoods={setCartFoods}>
          {isKioskRoute || location.pathname === "/" ? (
            <div>
              {kioskMessage && (
                <div
                  style={{
                    position: "fixed",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(0, 128, 0, 0.8)",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    zIndex: 1000,
                  }}
                >
                  {kioskMessage}
                </div>
              )}
              <Outlet />
            </div>
          ) : (
            <div>Kiosk 기본 메시지: 버거 메뉴를 선택해주세요.</div>
          )}
        </KioskBasicLayout>
      </div>

      {/* POS 화면 */}
      <div style={{ flex: 1, borderRight: "1px solid #ccc", overflow: "auto" }}>
        <POSBasicLayout>
          {isPOSRoute || location.pathname === "/" ? (
            <Outlet />
          ) : (
            <div>POS 기본 메시지: Order List를 확인해주세요.</div>
          )}
        </POSBasicLayout>
      </div>
    </div>
  );
};

export default SplitLayout;