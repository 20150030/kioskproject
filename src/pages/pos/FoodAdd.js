import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const FoodAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "BURGER", // 기본값으로 BURGER 선택
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 입력 값 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 파일 변경 처리
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append(
      "foodItemDTO",
      JSON.stringify({
        name: formData.name,
        price: formData.price,
        description: formData.description,
        category: formData.category,
      })
    );
    if (formData.image) {
      data.append("image", formData.image);
    }
  
    try {
      const response = await axiosInstance.post("/pos/food", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      alert("상품이 성공적으로 추가되었습니다!");
      navigate("/pos/food");
    } catch (error) {
      console.error("상품 추가 중 오류 발생:", error);
      alert("상품 추가에 실패했습니다.");
    }
  };


    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">상품 추가</h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg w-full mx-auto bg-white p-6 rounded shadow space-y-4"
          >
          <div>
            <label className="block mb-1 font-semibold">이름:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">가격:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">설명:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">카테고리:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="BURGER">버거</option>
              <option value="SIDE">사이드</option>
              <option value="BEVERAGE">음료</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">이미지:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            disabled={loading}
          >
            {loading ? "등록 중..." : "등록"}
          </button>
          {error && <p className="text-red-500 mt-2">오류: {error}</p>}
        </form>
      </div>
    );
};

export default FoodAdd;