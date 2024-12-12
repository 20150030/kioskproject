import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-red-500">오류 발생</h1>
          <p>{this.state.error?.message || "알 수 없는 오류가 발생했습니다."}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;