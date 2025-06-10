// WeatherIcon.js 수정
import { useState, useEffect } from "react";
import { getweather, getweatherMock } from "../service/weather";

export default function WeatherIcon({ cctvId, displayName }) {
  const [weatherData, setWeatherData] = useState({});

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
      const res = await getweather(cctvId); // API 호출에는 여전히 cctvId 사용
      const code = res.weather.toLowerCase();
      setWeatherData((prevData) => ({
        ...prevData,
        [cctvId]: weatherToIndex[code] ?? null,
      }));
    } catch (err) {
      console.error(`${cctvId} 날씨 가져오기 실패:`, err);
    }
  };

  const getNextScheduledTime = () => {
    const now = new Date();
    const currentMinute = now.getMinutes();
    const scheduledMinutes = [1, 11, 21, 31, 41, 51];
    
    for (const minute of scheduledMinutes) {
      if (minute > currentMinute) {
        const nextTime = new Date(now);
        nextTime.setMinutes(minute);
        nextTime.setSeconds(0);
        nextTime.setMilliseconds(0);
        return nextTime;
      }
    }
    
    const nextTime = new Date(now);
    nextTime.setHours(now.getHours() + 1);
    nextTime.setMinutes(1);
    nextTime.setSeconds(0);
    nextTime.setMilliseconds(0);
    return nextTime;
  };

  const scheduleNextFetch = () => {
    const nextTime = getNextScheduledTime();
    const delay = nextTime.getTime() - new Date().getTime();
    
    setTimeout(() => {
      fetchWeather();
      scheduleNextFetch();
    }, delay);
  };

  useEffect(() => {
    fetchWeather();
    scheduleNextFetch();
    
    return () => {
      // cleanup 로직 필요시 추가
    };
  }, [cctvId]);

  return (
    <div className="flex items-center justify-center w-full relative p-2">
      {/* displayName이 있으면 사용, 없으면 cctvId 사용 */}
      <h3 className="text-lg font-semibold text-gray-700 absolute">
        {displayName || cctvId}
      </h3>
      {weatherData[cctvId] !== undefined && weatherData[cctvId] !== null && (
        <div className="ml-48 w-20">{iconLists[weatherData[cctvId]]}</div>
      )}
    </div>
  );
}