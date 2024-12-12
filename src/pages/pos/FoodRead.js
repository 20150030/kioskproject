import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const FoodRead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axiosInstance.get(`/pos/food/${id}`);
        setFood(response.data);
      } catch (error) {
        console.error("음식 상세 정보 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/auth/role");
        setUserRole(response.data.role);
      } catch (error) {
        console.error("사용자 역할 정보를 가져오지 못했습니다:", error);
      }
    };

    fetchUserRole();
  }, []);

  if (loading || userRole === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-xl font-custom">로딩 중...</div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl font-custom">음식을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const formatDateTime = (datetime) => {
    if (!datetime) return "정보 없음";
    const date = new Date(datetime);
    return `${date.toLocaleDateString("ko-KR")} ${date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleAddToKiosk = async (id) => {
    try {
      await axiosInstance.patch(`/pos/food/${id}/add-to-kiosk`);
      alert("키오스크에 성공적으로 추가되었습니다.");
    } catch (error) {
      console.error("키오스크 추가 실패:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const confirmed = window.confirm("정말로 삭제하시겠습니까?");
      if (!confirmed) return;

      await axiosInstance.delete(`/pos/food/${id}`);
      alert("삭제되었습니다.");
      navigate("/pos/food");
    } catch (error) {
      console.error("음식 삭제 실패:", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen font-custom">
      <div className="bg-white shadow-md rounded-lg w-full max-w-lg p-6 text-center">
        <h2 className="text-3xl font-bold mb-6">{food.name}</h2>
        <img
          src={`http://localhost:8083/uploads${food.imageUrl}`}
          alt={food.name}
          className="w-full h-auto rounded-lg mb-4"
        />
        <p className="text-lg text-gray-700">{food.description}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-4">
          {food.price.toLocaleString()} 원
        </p>
        <p className="text-lg text-gray-500 mt-2">
          카테고리: <span className="font-medium text-gray-800">{food.category}</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          작성일: {formatDateTime(food.onCreatedAt)}
        </p>
        <p className="text-sm text-gray-500">
          최종 수정일: {formatDateTime(food.onUpdatedAt)}
        </p>

        {userRole?.includes("ROLE_ADMIN") && (
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => navigate(`/pos/food/modify/${food.id}`)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              삭제
            </button>
          </div>
        )}

        {userRole && !userRole.includes("ROLE_ADMIN") && (
          <p className="text-gray-500 mt-6">이 작업은 관리자만 가능합니다.</p>
        )}
      </div>
      <button onClick={() => handleAddToKiosk(food.id)}>키오스크에 추가</button>
    </div>
  );
};

export default FoodRead;