import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-5xl font-bold text-red-500 mb-6">404 - 존재하지 않는 페이지입니다</h1>
        <p className="text-lg text-gray-700 mb-6">요청하신 페이지를 찾을 수 없습니다. URL을 확인해 주세요.</p>
        <Link to="/">
          <button className="text-xl bg-yellow-300 border px-4 py-2 rounded-md hover:bg-yellow-400">홈으로 가기</button>
        </Link>
      </div>
    </div>
  );
}
