import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SplitLayout from "../layouts/SplitLayout";
import KioskRouter from "./KioskRouter";
import POSRouter from "./POSRouter";

const AppRouter = () => {
  const [cartFoods, setCartFoods] = useState([]);

  const KioskRouterWithProps = KioskRouter.map((route) => ({
    ...route,
    element: React.cloneElement(route.element, { cartFoods, setCartFoods }), // 상태 전달
  }));

  const router = createBrowserRouter([
    {
      path: "/",
      element: <SplitLayout cartFoods={cartFoods} setCartFoods={setCartFoods} />, // SplitLayout에 상태 전달
      children: [
        {
          path: "kiosk/*",
          children: KioskRouterWithProps, // KioskRouter로 상태 전달
        },
        {
          path: "pos/*",
          children: POSRouter, // POSRouter에는 별도 상태 전달 X
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;