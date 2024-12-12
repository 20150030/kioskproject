import React, { lazy } from "react";
import PrivateRoute from "./PrivateRouter"; // PrivateRoute 컴포넌트 가져오기
import { useSelector } from "react-redux"; // Redux에서 인증 상태 가져오기

// Lazy-loaded 컴포넌트
const OrderList = lazy(() => import("../pages/pos/OrderList"));
const FoodList = lazy(() => import("../pages/pos/FoodList"));
const FoodAdd = lazy(() => import("../pages/pos/FoodAdd"));
const FoodModify = lazy(() => import("../pages/pos/FoodModify"));
const FoodRead = lazy(() => import("../pages/pos/FoodRead"));
const Login = lazy(() => import("../pages/pos/Login"));
const Signup = lazy(() => import("../pages/pos/SignUp"));

const POSRouter = [
  // 로그인과 회원가입은 인증 없이 접근 가능
  { path: "login", element: <Login /> }, // 로그인 페이지
  { path: "signup", element: <Signup /> }, // 회원가입 페이지

  // 인증이 필요한 경로는 PrivateRoute로 보호
  {
    path: "orders",
    element: (
      <PrivateRoute>
        <OrderList />
      </PrivateRoute>
    ),
  }, // 주문 목록 페이지

  {
    path: "food",
    element: (
      <PrivateRoute>
        <FoodList />
      </PrivateRoute>
    ),
  }, // 음식 목록 페이지

  {
    path: "food/add",
    element: (
      <PrivateRoute>
        <FoodAdd />
      </PrivateRoute>
    ),
  }, // 음식 추가 페이지

  {
    path: "food/modify/:id",
    element: (
      <PrivateRoute>
        <FoodModify />
      </PrivateRoute>
    ),
  }, // 음식 수정 페이지

  {
    path: "food/:id",
    element: (
      <PrivateRoute>
        <FoodRead />
      </PrivateRoute>
    ),
  }, // 음식 상세보기 페이지

  // 기본 경로를 주문 목록으로 설정
  { index: true, element: <OrderList /> },
];

export default POSRouter;