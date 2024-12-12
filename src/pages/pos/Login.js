import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch } from "react-redux";
import { checkAuth } from "../../redux/authSlice";
import store from "../../redux/store";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axiosInstance.post("/users/login", { username, password });
  
      const token = response.data.token;
      console.log("JWT 토큰:", token);
  
      // 로컬스토리지에 토큰 저장
      localStorage.setItem("jwt", token);
  
      // Redux 상태 업데이트
      dispatch(checkAuth());
      console.log("Redux 상태:", store.getState()); // Redux 상태 확인
  
      // localStorage 저장 후 인터셉터에서 사용 가능 여부 확인
    console.log("LocalStorage에서 JWT:", localStorage.getItem("jwt"));

      // 로그인 후 POS 주문 목록으로 바로 이동
      console.log("navigate 실행 중..."); 
      navigate("/pos/orders");
    } catch (error) {
      console.error("로그인 실패", error);
      alert("로그인 실패!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          로그인
        </button>
      </form>
       {/* 회원가입 링크 추가 */}
       <p className="mt-4">
        계정이 없으신가요?{" "}
        <Link to="/pos/signup" className="text-blue-500 hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
};

export default Login;