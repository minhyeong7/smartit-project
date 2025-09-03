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
  const [radarLoading, setRadarLoading] = useState(false);
  const [selectedCctv, setSelectedCctv] = useState("CCTV001"); // 기본값: 중부대계곡
  
  // CCTV ID와 표시명 매핑
  const cctvData = [
    { id: "CCTV001", name: "중부대계곡" },
    { id: "CCTV002", name: "백운계곡" }
  ];

  // 선택된 CCTV 정보 가져오기
  const selectedCctvData = cctvData.find(cctv => cctv.id === selectedCctv);

  // 신고하기 api
  const submitRescue = async () => {
    try {
      const response = await postrescue({ cctv_id: selectedCctv });
      setreportResult(response);
    } catch (err) {
      console.error("Error posting rescue data:", err);
    }
  };

  // 구조 알리기 api
  const submitAlert = async () => {
    try {
      const response = await getalert(selectedCctv);
      setalertResult(response);
    } catch (err) {
      console.error("Error getting alert data:", err);
    }
  };

  // 튜브 발사 api
  const submitLaunch = async () => {
    try {
      const response = await getlaunch(selectedCctv);
      setlaunchResult(response);
    } catch (err) {
      console.error("Error getting launch data:", err);
    }
  };

  // 레이더발사 api
  const submitRader = async () => {
    try {
      setRadarLoading(true);
      const response = await getrader(selectedCctv);
      
      window.dispatchEvent(new CustomEvent('radarResult', {
        detail: {
          cctv_id: selectedCctv,
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
          cctv_id: selectedCctv,
          result: errorResult
        }
      }));
    } finally {
      setRadarLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center gap-6">
      <div className="bg-white border rounded-lg p-6 shadow-md w-80 flex flex-col items-center gap-4">
        {/* CCTV 선택 리스트박스 */}
        <div className="w-full">
          {/* <label htmlFor="cctv-select" className="block text-md font-semibold text-blue-500 mb-2">
            계곡 선택
          </label> */}
          <select
            id="cctv-select"
            value={selectedCctv}
            onChange={(e) => setSelectedCctv(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white "
          >
            {cctvData.map((cctv) => (
              <option key={cctv.id} value={cctv.id}>
                {cctv.name}
              </option>
            ))}
          </select>
        </div>

        {/* WeatherIcon과 FlowStatus를 함께 배치 */}
        <div className="flex items-center justify-center gap-3 w-full">
          <WeatherIcon cctvId={selectedCctv} displayName={selectedCctvData?.name} />
          <div className="inline-block">
            <FlowStatus cctvId={selectedCctv} />
          </div>
        </div>
        
        {/* 구조 기능 버튼들 */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={submitRescue}
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
            onClick={submitAlert}
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
            onClick={submitLaunch}
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
            onClick={submitRader}
            disabled={radarLoading}
            className={`text-lg px-4 py-2 rounded-md transition w-full flex items-center gap-4 ${
              radarLoading 
                ? 'text-gray-500 bg-gray-100 cursor-not-allowed' 
                : 'text-black hover:bg-gray-200'
            }`}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/6989/6989458.png"
              alt="Radar"
              width="26"
              height="26"
              className={radarLoading ? 'opacity-50' : ''}
            />
            {radarLoading ? '거리 측정 중...' : '레이더 발사하기'}
          </button>
        </div>
      </div>

      {/* 모달 */}
      <ReportModal reportResult={reportResult} onClose={() => setreportResult(null)} />
      <AlertModal alertResult={alertResult} onClose={() => setalertResult(null)} />
      <LaunchModal launchResult={launchResult} onClose={() => setlaunchResult(null)} />
    </div>
  );
}