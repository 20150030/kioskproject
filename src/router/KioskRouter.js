import React, { lazy } from "react";

const BurgerPage = lazy(() => import("../pages/kiosk/BurgerPage"));
const SetPage = lazy(() => import("../pages/kiosk/SetPage"));
const SidePage = lazy(() => import("../pages/kiosk/SidePage"));
const CartPage = lazy(() => import("../pages/kiosk/CartPage"));
const ReadyList = lazy(() => import("../pages/kiosk/ReadyList"))
const KioskRouter = [
  { path: "burger", element: <BurgerPage /> },
  { path: "set", element: <SetPage /> },
  { path: "side", element: <SidePage /> },
  { path: "cart", element: <CartPage /> },
  { path: "ready", element: <ReadyList /> }, // ReadyList 경로 추가
  { index: true, element: <BurgerPage /> }, // 기본 경로: BurgerPage
];

export default KioskRouter;