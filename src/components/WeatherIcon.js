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
  const scheduleNextFetch = () => {
    const nextTime = getNextScheduledTime();
    const delay = nextTime.getTime() - new Date().getTime();
    
    setTimeout(() => {
      fetchWeather();
      scheduleNextFetch(); // 다음 스케줄 설정
    }, delay);
  };

  useEffect(() => {
    // 초기 로드 시 날씨 정보 가져오기
    fetchWeather();
    
    // 첫 번째 스케줄 시작
    scheduleNextFetch();
    
    // cleanup 함수는 더 이상 필요없음 (interval 대신 setTimeout 사용)
    return () => {
      // 필요시 cleanup 로직 추가
    };
  }, [cctvId]);

  return (
    <div className="flex items-center justify-center w-full relative p-2">
      <h3 className="text-lg font-semibold text-gray-700 absolute">{cctvId}</h3>
      {weatherData[cctvId] !== undefined && weatherData[cctvId] !== null && (
        <div className="ml-48 w-20">{iconLists[weatherData[cctvId]]}</div>
      )}
    </div>
  );
}