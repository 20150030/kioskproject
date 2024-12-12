import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode"; // jwtDecode는 기본 내보내기이므로 수정

const initialState = {
  isLoggedIn: false,
  userRole: "", // 사용자 권한 ('ROLE_ADMIN', 'ROLE_STAFF' 등)
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkAuth: (state) => {
      console.log("checkAuth 실행 중...");
      const token = localStorage.getItem("jwt"); // 로컬스토리지에서 JWT 가져오기
      if (token) {
        try {
          const decoded = jwtDecode(token); // JWT 디코딩
          console.log("JWT 디코딩 결과:", decoded);
          state.isLoggedIn = true;
          state.userRole = decoded.roles || ""; // roles 값 저장
        } catch (error) {
          console.error("JWT 디코딩 실패:", error);
          state.isLoggedIn = false;
          state.userRole = ""; // 오류 발생 시 초기화
          localStorage.removeItem("jwt"); // 잘못된 토큰 제거
        }
      } else {
        console.warn("JWT가 없습니다. 로그아웃 상태로 처리합니다.");
        state.isLoggedIn = false; // 토큰이 없으면 로그아웃 상태로 처리
        state.userRole = "";
      }
    },
    logout: (state) => {
      // 로그아웃 액션
      console.log("로그아웃 실행 중...");
      state.isLoggedIn = false;
      state.userRole = "";
      localStorage.removeItem("jwt"); // 로컬스토리지에서 토큰 삭제
      console.log("로그아웃: 상태와 로컬스토리지가 초기화되었습니다.");
    },
  },
});

export const { checkAuth, logout } = authSlice.actions;
export default authSlice.reducer;