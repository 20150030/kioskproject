import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/users/register", formData);
      setShowSuccess(true); // 회원가입 성공 메시지 표시
    } catch (error) {
      console.error(error);
      alert("회원가입 실패: " + (error.response?.data || "알 수 없는 오류"));
    }
  };

  const handleConfirm = () => {
    setShowSuccess(false);
    navigate("/pos/login"); // 로그인 화면으로 이동
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        {showSuccess ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              회원가입 성공!
            </h1>
            <p className="text-gray-600 mb-6">로그인 화면으로 이동합니다.</p>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              확인
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
              회원가입
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  사용자명
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="사용자명을 입력하세요"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                회원가입
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;