import React from "react";
import { useNavigate } from "react-router-dom";

const POSHeader = () => {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("jwt");

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/pos/login"); // 로그아웃 후 로그인 화면으로 이동
  };

  const handleLogin = () => {
    navigate("/pos/login"); // 로그인 화면으로 이동
  };

  return (
    <header className="bg-gray-800 text-white flex justify-between items-center px-4 py-2">
      <h1 className="text-lg font-bold">POS System</h1>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
        >
          Login
        </button>
      )}
    </header>
  );
};

export default POSHeader;