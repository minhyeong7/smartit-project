import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getrain } from "../service/weather";

export default function RainfallChart() {
  const [rainfallData, setRainfallData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 오류 상태 추가
  const [cctvId, setCctvId] = useState("CCTV001"); // 기본 CCTV ID

  const fetchRainfall = useCallback(async () => {
    setLoading(true);
    setError(null); // 오류 초기화
    try {
      const response = await getrain(cctvId);
      console.log("불러온 강수량 데이터:", response);

      const formattedData = response.map((item) => ({
        time: item.fcst_time,
        rainValue: item.rainfall_value,
        rainText:
          item.rainfall_value === 0
            ? "강수 없음"
            : item.rainfall_value === 0.5
            ? "1mm 미만"
            : item.rainfall_value === 40
            ? "30~50mm"
            : "50mm 이상",
      }));

      console.log("형식화된 데이터:", formattedData);
      setRainfallData(formattedData);
    } catch (error) {
      console.error("강수량 데이터를 불러오는 중 오류 발생:", error);
      setError("서버에서 데이터를 불러오는 데 실패했습니다."); // 오류 메시지 설정
    }
    setLoading(false);
  }, [cctvId]);

  useEffect(() => {
    fetchRainfall();
  }, [fetchRainfall]);

  return (
    <div className="w-1/2 h-[25rem] bg-white p-6 shadow-lg rounded-lg relative">
      <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">🌧️ 강수량 그래프</h2>
      <Link className="absolute top-6 right-6 text-blue-500 hover:underline" to="/weathers">더보기</Link>

      {/* CCTV 선택 리스트 박스 */}
      <div className="mb-4 text-center">
        <label htmlFor="cctv-select" className="mr-2">CCTV 선택:</label>
        <select
          id="cctv-select"
          value={cctvId}
          onChange={(e) => setCctvId(e.target.value)}
          className="border border-gray-300 rounded p-1"
        >
          <option value="CCTV001">CCTV001</option>
          <option value="CCTV002">CCTV002</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader"></div>
        </div>
      ) : error ? ( // 오류가 있을 때 메시지 표시
        <div className="text-red-500 text-center">
          {error}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={rainfallData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip 
              formatter={(value, name, props) => {
                const data = rainfallData[props.active ? props.index : 0];
                return [data.rainValue, data.rainText];
              }}
            />
            <Line type="monotone" dataKey="rainValue" stroke="#3182CE" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* 스피너 스타일 */}
      <style>
        {`
          .loader {
            border: 8px solid #e0e0e0; /* Light gray */
            border-top: 8px solid #999; /* Darker gray */
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            position: absolute; /* 절대 위치 지정 */
            top: 50%; /* 위쪽으로 위치 조정 */
            left: 50%; /* 중앙 정렬 */
            transform: translate(-50%, -50%); /* 중앙 정렬 */
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
