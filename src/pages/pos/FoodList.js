import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance";
import FoodImage from "../../components/FoodImage";
import { Link } from "react-router-dom";

const FoodList = () => {
  const [foods, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 데이터 가져오기 함수
  const fetchFoodItems = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/pos/food");
      console.log("API 응답 데이터:", response.data);
      setFoodItems(response.data);
    } catch (error) {
      console.error("데이터 요청 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  // 로딩 상태 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">등록된 상품</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {foods.map((food) => (
          <div
            key={food.id}
            className="border rounded-lg shadow hover:shadow-lg transition p-4"
          >
            <div className="w-full h-40 overflow-hidden rounded">
              {/* Link로 FoodRead 페이지로 이동 */}
              <Link to={`/pos/food/${food.id}`}>
                <FoodImage
                  imageUrl={`http://localhost:8083/uploads${food.imageUrl}`} // 서버에서 제공하는 이미지 URL
                  altText={food.name} // 이미지 대체 텍스트
                  style={{ borderRadius: '10px' }} // 스타일 적용
                />
              </Link>
            </div>
            <h3 className="mt-2 text-lg font-semibold">{food.name}</h3>
            <p className="text-gray-600">{food.price.toLocaleString()} 원</p>
            <p className="text-sm text-gray-500 mt-1">
              등록자: {food.createdBy || "알 수 없음"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodList;