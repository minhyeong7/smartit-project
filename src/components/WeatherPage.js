import React, { useEffect, useState } from "react";
import { getweather } from "../service/weather";
import { Link } from "react-router-dom";

export default function WeatherPage() {
  const [apiData, setApiData] = useState(null); // 전체 데이터를 저장할 상태
  const [loading, setLoading] = useState(true);
  const [selectedCctv, setSelectedCctv] = useState("CCTV001"); // 기본값으로 CCTV001 설정

  useEffect(() => {
    async function fetchWeather() {
      try {
        const data = await getweather(selectedCctv); // 선택된 CCTV ID 전달
        setApiData(data); // API에서 반환된 전체 데이터 저장
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [selectedCctv]); // selectedCctv가 변경될 때마다 데이터를 다시 가져옴

  // CCTV 선택 핸들러
  const handleCctvChange = (e) => {
    setSelectedCctv(e.target.value);
  };

  if (loading) {
    return <div className="text-center text-lg font-medium mt-8">Loading...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-5xl font-bold mb-6 text-center">날씨 전체 데이터 출력</h1>
        
        {/* CCTV 선택 옵션 추가 */}
        <div className="mb-4 flex justify-center">
          <div className="inline-block">
            <label htmlFor="cctvSelect" className="block text-lg font-medium mb-2">CCTV 선택:</label>
            <select
              id="cctvSelect"
              value={selectedCctv}
              onChange={handleCctvChange}
              className="p-2 border rounded-md"
            >
              <option value="CCTV001">CCTV001</option>
              <option value="CCTV002">CCTV002</option>
            </select>
          </div>
        </div>
        
        {/* 전체 API 데이터 출력 */}
        <div className="bg-gray-50 p-4 rounded-lg border overflow-auto">
          <pre className="text-sm text-gray-700">
            {JSON.stringify(apiData, null, 2)} {/* JSON 형태로 보기 좋게 출력 */}
          </pre>
        </div>

        {/* Navigation Button */}
        <div className="text-center mt-8">
          <Link to="/">
            <button className="text-xl bg-yellow-300 border px-4 py-2 rounded-md hover:bg-yellow-400">
              메인 페이지로 넘어가기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}