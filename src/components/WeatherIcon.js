import { useState, useEffect } from "react";
import { getweather, getweatherMock } from "../service/weather";

export default function WeatherIcon({ cctvId }) {
  const [weatherData, setWeatherData] = useState({}); // CCTV별 날씨 인덱스

  const iconLists = [
    <img src="https://cdn-icons-png.flaticon.com/128/1163/1163662.png" alt="맑음" width="32" height="48" />,
    <img src="https://cdn-icons-png.flaticon.com/128/1163/1163661.png" alt="구름 많음" width="32" height="48" />,
    <img src="https://cdn-icons-png.flaticon.com/128/1163/1163624.png" alt="흐림" width="32" height="48" />,
    <img src="https://cdn-icons-png.flaticon.com/128/3262/3262929.png" alt="진눈깨비" width="32" height="48" />,
    <img src="https://cdn-icons-png.flaticon.com/128/1163/1163629.png" alt="눈" width="32" height="48" />,
    <img src="https://cdn-icons-png.flaticon.com/128/3313/3313966.png" alt="비" width="32" height="48" />,
  ];

  const weatherToIndex = {
    clear: 0,
    cloudy: 1,
    overcast: 2,
    rainsnow: 3,
    snow: 4,
    rain: 5,
  };

  const fetchWeather = async () => {
    try {
      const res = await getweather(cctvId); // cctvId로 날씨 정보 가져오기
      const code = res.weather.toLowerCase();
      setWeatherData((prevData) => ({
        ...prevData,
        [cctvId]: weatherToIndex[code] ?? null,
      }));
    } catch (err) {
      console.error(`${cctvId} 날씨 가져오기 실패:`, err);
    }
  };

  useEffect(() => {
    fetchWeather(); // 초기 로드 시 날씨 정보 가져오기

    // 매 5분(300,000밀리초)마다 날씨 정보 업데이트
    const interval = setInterval(() => {
      fetchWeather();
    }, 60000); // 1분마다 실행

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(interval);
  }, [cctvId]);

  return (
    <div className="flex items-center justify-center w-full relative p-2">
      <h3 className="text-lg font-semibold text-gray-700 absolute">{cctvId}</h3>
      {weatherData[cctvId] !== undefined && weatherData[cctvId] !== null && (
        <div className="ml-48">{iconLists[weatherData[cctvId]]}</div>
      )}
    </div>
  );
}