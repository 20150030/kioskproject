import axios from "axios";

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "http://localhost:8083/api", // 백엔드 API 기본 URL
  timeout: 10000, // 요청 제한 시간 (10초)
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt"); // 로컬 스토리지에서 JWT 토큰 가져오기

    if (token) {
      console.log("JWT 토큰:", token);
      config.headers.Authorization = `Bearer ${token}`; // 모든 요청에 Authorization 헤더 추가
    } else {
      console.warn("JWT 토큰이 없습니다. 인증이 필요한 요청일 수 있습니다.");
    }

    // 추가 로그: 요청 URL 확인
    console.log("요청 URL:", config.url);

    return config;
  },
  (error) => {
    // 요청 전에 발생한 에러 처리
    console.error("요청 인터셉터 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => {
    // 성공적인 응답 처리
    return response;
  },
  (error) => {
    // 오류 응답 처리
    if (error.response) {
      console.error("응답 에러 상태 코드:", error.response.status);
      console.error("응답 데이터:", error.response.data);

      // 예: 토큰 만료 시 처리
      if (error.response.status === 401) {
        console.warn("인증 오류: 로그인 페이지로 리디렉션해야 할 수 있습니다.");
        // 로그아웃 처리 또는 로그인 페이지로 리디렉션 추가 가능
        // window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("서버로부터 응답이 없습니다. 네트워크를 확인하세요.");
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    return Promise.reject(error); // 오류를 호출한 곳으로 전달
  }
);

export default axiosInstance;