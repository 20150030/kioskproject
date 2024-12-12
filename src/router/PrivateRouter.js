import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRouter = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn); // Redux에서 인증 상태 가져오기

  console.log("PrivateRoute - isAuthenticated:", isAuthenticated);

  // 인증되지 않았으면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/pos/login" />;
  }

  return children;
};

export default PrivateRouter;