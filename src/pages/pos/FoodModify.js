import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const FoodModify = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null); // 새로 업로드할 이미지 파일

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axiosInstance.get(`/pos/food/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("음식 정보 조회 실패:", error);
      }
    };

    fetchFoodDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // 새로 업로드할 파일 설정
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 객체 생성
    const data = new FormData();
    data.append("foodItemDTO", new Blob([JSON.stringify(formData)], { type: "application/json" }));
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      await axiosInstance.put(`/food/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("음식이 수정되었습니다.");
      navigate(`/pos/food/${id}`); // 상세보기 페이지로 이동
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">음식 수정</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block mb-2 font-medium">이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">설명</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">가격</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">카테고리</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="BURGER">버거</option>
            <option value="SIDE">사이드</option>
            <option value="SET">세트</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">이미지</label>
          {formData.imageUrl && (
            <div className="mb-2">
              <img
                src={`http://localhost:8083/uploads${formData.imageUrl}`}
                alt="현재 이미지"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          저장
        </button>
      </form>
    </div>
  );
};

export default FoodModify;