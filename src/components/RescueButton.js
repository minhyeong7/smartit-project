import React, { useState, useEffect } from "react";
import { postrescue } from "../service/rescue";
import { getalert } from "../service/alert";
import { getlaunch } from "../service/launch";
import { getweather } from "../service/weather";
import ReportModal from "./ReportModal";
import AlertModal from "./AlertModal";
import LaunchModal from "./LaunchModal";

export default function RescueButton() {
  const [reportResult, setreportResult] = useState(null);
  const [alertResult, setalertResult] = useState(null);
  const [launchResult, setlaunchResult] = useState(null);
  const [weatherData, setWeatherData] = useState({}); // CCTV별 날씨 인덱스

  const cctvIds = ["CCTV001", "CCTV002"];

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

  useEffect(() => {
    const fetchWeather = async () => {
      const updated = {};
      for (let id of cctvIds) {
        try {
          const res = await getweather(id); // ⚠ 문자열로 호출
          const code = res.weather.toLowerCase();
          updated[id] = weatherToIndex[code] ?? null;
        } catch (err) {
          console.error(`${id} 날씨 가져오기 실패:`, err);
        }
      }
      setWeatherData(updated);
    };
    fetchWeather();
  }, []);

  const submitRescue = async (cctv_id) => {
    try {
      const response = await postrescue({ cctv_id });
      setreportResult(response);
    } catch (err) {
      console.error("Error posting rescue data:", err);
    }
  };

  const submitAlert = async (cctv_id) => {
    try {
      const response = await getalert({ cctv_id });
      setalertResult(response);
    } catch (err) {
      console.error("Error getting alert data:", err);
    }
  };

  const submitLaunch = async (cctv_id) => {
    try {
      const response = await getlaunch({ cctv_id });
      setlaunchResult(response);
    } catch (err) {
      console.error("Error getting launch data:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 h-full flex flex-col items-center gap-6">
      {cctvIds.map((id) => (
        <div
          key={id}
          className="bg-white border rounded-lg p-4 shadow-md w-80 flex flex-col items-center gap-3"
        >
          <div className="flex items-center justify-center w-full relative ">
            <h3 className="text-lg font-semibold text-gray-700 absolute">{id}</h3>
            {weatherData[id] !== undefined && weatherData[id] !== null && (
              <div className="ml-48" >{iconLists[weatherData[id]]}</div>
            )}
          </div>

          <button
            onClick={() => submitRescue(id)}
            className="text-lg text-black hover:bg-gray-200 px-4 py-2 rounded-md transition w-full flex items-center gap-4"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/2785/2785693.png"
              alt="Siren"
              width="28"
              height="24"
            />
            구조 신고하기
          </button>

          <button
            onClick={() => submitAlert(id)}
            className="text-lg text-black hover:bg-gray-200 px-4 py-2 rounded-md transition w-full flex items-center gap-4"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/9019/9019234.png"
              alt="Megaphone"
              width="28"
              height="24"
            />
            구조 알리기
          </button>

          <button
            onClick={() => submitLaunch(id)}
            className="text-lg text-black hover:bg-gray-200 px-4 py-2 rounded-md transition w-full flex items-center gap-4"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/1067/1067357.png"
              alt="Launch"
              width="26"
              height="26"
            />
            구조 발사하기
          </button>
        </div>
      ))}

      {/* 모달 */}
      <ReportModal reportResult={reportResult} onClose={() => setreportResult(null)} />
      <AlertModal alertResult={alertResult} onClose={() => setalertResult(null)} />
      <LaunchModal launchResult={launchResult} onClose={() => setlaunchResult(null)} />
    </div>
  );
}
