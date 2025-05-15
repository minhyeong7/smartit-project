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
            : item.rainfall_value >= 50
            ? "50mm 이상"
            : `${item.rainfall_value}mm`,
      }));

      console.log("형식화된 데이터:", formattedData);
      setRainfallData(formattedData);
    } catch (error) {
      console.error("강수량 데이터를 불러오는 중 오류 발생:", error);
      setError("서버에서 데이터를 불러오는 데 실패했습니다."); // 오류 메시지 설정
    }
    setLoading(false);
  }, [cctvId]);

  // 다음 실행 시간 계산 함수
  const getNextScheduledTime = () => {
    const now = new Date();
    const currentMinute = now.getMinutes();
    
    // 실행할 분: 1, 11, 21, 31, 41, 51
    const scheduledMinutes = [1, 11, 21, 31, 41, 51];
    
    // 현재 시간 이후의 다음 스케줄 시간 찾기
    for (const minute of scheduledMinutes) {
      if (minute > currentMinute) {
        const nextTime = new Date(now);
        nextTime.setMinutes(minute);
        nextTime.setSeconds(0);
        nextTime.setMilliseconds(0);
        return nextTime;
      }
    }
    
    // 현재 시간이 51분을 넘었다면 다음 시간의 1분
    const nextTime = new Date(now);
    nextTime.setHours(now.getHours() + 1);
    nextTime.setMinutes(1);
    nextTime.setSeconds(0);
    nextTime.setMilliseconds(0);
    return nextTime;
  };

  // 스케줄링 함수
  const scheduleNextFetch = useCallback(() => {
    const nextTime = getNextScheduledTime();
    const delay = nextTime.getTime() - new Date().getTime();
    
    const timeoutId = setTimeout(() => {
      fetchRainfall();
      scheduleNextFetch(); // 다음 스케줄 설정
    }, delay);
    
    return timeoutId;
  }, [fetchRainfall]);

  useEffect(() => {
    // 초기 로드 시 강수량 데이터 가져오기
    fetchRainfall();
    
    // 첫 번째 스케줄 시작
    const timeoutId = scheduleNextFetch();
    
    // cleanup 함수 - 컴포넌트 언마운트 시 timeout 클리어
    return () => {
      clearTimeout(timeoutId);
    };
  }, [fetchRainfall, scheduleNextFetch]);

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
              content={({ active, payload, label }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border border-gray-300 rounded shadow">
                      <p className="font-semibold">{`시간: ${label}`}</p>
                      <p>{`강수량: ${data.rainValue}mm`}</p>
                    </div>
                  );
                }
                return null;
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