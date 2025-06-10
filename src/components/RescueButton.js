// RescueButton.js 수정
import React, { useState } from "react";
import { postrescue } from "../service/rescue";
import { getalert } from "../service/alert";
import { getlaunch } from "../service/launch";
import { getrader } from "../service/rader";
import ReportModal from "./ReportModal";
import AlertModal from "./AlertModal";
import LaunchModal from "./LaunchModal";
import WeatherIcon from "./WeatherIcon";
import FlowStatus from "./FlowStatus";

export default function RescueButton() {
  const [reportResult, setreportResult] = useState(null);
  const [alertResult, setalertResult] = useState(null);
  const [launchResult, setlaunchResult] = useState(null);
  const [radarLoading, setRadarLoading] = useState({});
  
  // CCTV ID와 표시명 매핑
  const cctvData = [
    { id: "CCTV001", name: "백운계곡" },
    { id: "CCTV002", name: "안덕계곡" }
  ];

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
      const response = await getalert(cctv_id);
      setalertResult(response);
    } catch (err) {
      console.error("Error getting alert data:", err);
    }
  };

  const submitLaunch = async (cctv_id) => {
    try {
      const response = await getlaunch(cctv_id);
      setlaunchResult(response);
    } catch (err) {
      console.error("Error getting launch data:", err);
    }
  };

  const submitRader = async (cctv_id) => {
    try {
      setRadarLoading(prev => ({ ...prev, [cctv_id]: true }));
      const response = await getrader(cctv_id);
      
      window.dispatchEvent(new CustomEvent('radarResult', {
        detail: {
          cctv_id: cctv_id,
          result: response
        }
      }));
      
      console.log("레이더 결과를 CCTV 컴포넌트로 전송:", response);
    } catch (err) {
      console.error("Error getting radar data:", err);
      const errorResult = {
        success: false,
        error: true,
        message: '측정 실패'
      };
      
      window.dispatchEvent(new CustomEvent('radarResult', {
        detail: {
          cctv_id: cctv_id,
          result: errorResult
        }
      }));
    } finally {
      setRadarLoading(prev => ({ ...prev, [cctv_id]: false }));
    }
  };

  return (
    <div className="h-full flex flex-col items-center gap-6">
      {cctvData.map((cctv) => (
        <div
          key={cctv.id}
          className="bg-white border rounded-lg p-6 shadow-md w-80 flex flex-col items-center gap-3"
        >
          {/* WeatherIcon과 FlowStatus를 함께 배치 */}
          <div className="flex items-center justify-center gap-3 w-full">
            {/* cctvId 대신 name을 전달하고, 실제 API 호출에는 id 사용 */}
            <WeatherIcon cctvId={cctv.id} displayName={cctv.name} />
            <div className="inline-block">
              <FlowStatus cctvId={cctv.id} />
            </div>
          </div>
          
          <button
            onClick={() => submitRescue(cctv.id)}
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
            onClick={() => submitAlert(cctv.id)}
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
            onClick={() => submitLaunch(cctv.id)}
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

          <button
            onClick={() => submitRader(cctv.id)}
            disabled={radarLoading[cctv.id]}
            className={`text-lg px-4 py-2 rounded-md transition w-full flex items-center gap-4 ${
              radarLoading[cctv.id] 
                ? 'text-gray-500 bg-gray-100 cursor-not-allowed' 
                : 'text-black hover:bg-gray-200'
            }`}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/6989/6989458.png"
              alt="Radar"
              width="26"
              height="26"
              className={radarLoading[cctv.id] ? 'opacity-50' : ''}
            />
            {radarLoading[cctv.id] ? '거리 측정 중...' : '레이더 발사하기'}
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