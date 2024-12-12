import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// 비동기 액션: 메뉴 추가 요청
export const addFoodItem = createAsyncThunk(
  "food/addFoodItem",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/food", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // 파일 업로드를 위해 multipart/form-data 사용
        },
      });
      return response.data; // 서버에서 반환된 데이터
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add food item"); // 에러 처리
    }
  }
);

// 비동기 액션: 음식 리스트 가져오기
export const fetchFoodItems = createAsyncThunk(
  "food/fetchFoodItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/food"); // 음식 리스트 API 호출
      return response.data; // 서버에서 반환된 데이터
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch food items");
    }
  }
);

// 비동기 액션: 음식 수정 요청
export const updateFoodItem = createAsyncThunk(
  "food/updateFoodItem",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/food/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // 파일 업로드를 위해 multipart/form-data 사용
        },
      });
      return response.data; // 서버에서 반환된 데이터
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update food item"); // 에러 처리
    }
  }
);

// 비동기 액션: 음식 삭제 요청
export const deleteFoodItem = createAsyncThunk(
  "food/deleteFoodItem",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/food/${id}`); // 음식 삭제 API 호출
      return id; // 삭제된 음식 ID 반환
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete food item"); // 에러 처리
    }
  }
);

// 초기 상태
const initialState = {
  foodItems: [], // 음식 리스트
  loading: false, // 로딩 상태
  error: null, // 에러 상태
};

const foodSlice = createSlice({
  name: "food", // 슬라이스 이름
  initialState, // 초기 상태
  reducers: {}, // 동기 액션 필요 시 추가
  extraReducers: (builder) => {
    builder
      // 메뉴 추가 처리
      .addCase(addFoodItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFoodItem.fulfilled, (state, action) => {
        state.loading = false;
        state.foodItems.push(action.payload); // 추가된 메뉴 리스트에 반영
      })
      .addCase(addFoodItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 음식 리스트 가져오기 처리
    builder
      .addCase(fetchFoodItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoodItems.fulfilled, (state, action) => {
        state.loading = false;
        state.foodItems = action.payload; // 음식 리스트 저장
      })
      .addCase(fetchFoodItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 음식 수정 처리
    builder
      .addCase(updateFoodItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFoodItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.foodItems.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.foodItems[index] = action.payload; // 수정된 음식 업데이트
        }
      })
      .addCase(updateFoodItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 음식 삭제 처리
    builder
      .addCase(deleteFoodItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFoodItem.fulfilled, (state, action) => {
        state.loading = false;
        state.foodItems = state.foodItems.filter(
          (item) => item.id !== action.payload // 삭제된 음식 필터링
        );
      })
      .addCase(deleteFoodItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default foodSlice.reducer;