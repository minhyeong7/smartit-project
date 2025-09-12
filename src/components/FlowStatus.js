import React, { useState, useEffect } from "react";
import { getflowstatus } from "../service/weather"; // weather.js에서 import
import { sendWeatherDangerAlert } from "../service/alert"; // 새로운 기상 위험 알림 함수


export default function FlowStatus({ cctvId }) {
  const [flowData, setFlowData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAlertSending, setIsAlertSending] = useState(false); // 알림 전송 중 상태

  // 수위/유속 데이터 가져오기
  const fetchFlowData = async () => {
    
    try {

      const data = await getflowstatus(cctvId); // weather.js의 함수 사용

      setFlowData(data);
    } catch (error) {
      console.error('Flow data fetch error:', error);
    } finally {
      
    }
  };

  // 상태별 색상 및 한글 텍스트
  const getStatusStyle = (status) => {
    switch (status) {
      case 'danger':
        return { color: '#dc2626', bg: '#fef2f2', text: '위험' };
      case 'warning':
        return { color: '#ea580c', bg: '#fff7ed', text: '경계' };
      case 'caution':
        return { color: '#ca8a04', bg: '#fefce8', text: '주의' };
      case 'attention':
        return { color: '#16a34a', bg: '#f0fdf4', text: '관심' };
      default:
        return { color: '#059669', bg: '#ecfdf5', text: '안전' };
    }
  };

  // 현장 위험 알림 전송 함수
  const handleWeatherAlert = async () => {
    if (isAlertSending) return; // 중복 전송 방지
    
    try {
      setIsAlertSending(true);
      
      // FlowStatus에서 받은 status를 danger_level로 변환
      const dangerLevelMap = {
        'danger': '위험',
        'warning': '경계', 
        'caution': '주의',
        'attention': '관심',
        'safe': '안전'
      };
      
      const result = await sendWeatherDangerAlert({
        cctv_id: cctvId,
        danger_level: dangerLevelMap[flowData.status] || '안전'
      });
      
      if (result.success) {
        console.log(`기상 위험 알림 전송 성공: ${result.message}`);
        // 성공 시 시각적 피드백 (선택사항)
      } else {
        console.error('기상 위험 알림 전송 실패:', result.message);
      }
      
    } catch (error) {
      console.error('기상 위험 알림 전송 오류:', error);
    } finally {
      setIsAlertSending(false);
    }
  };

  useEffect(() => {
    // 초기 로드
    fetchFlowData();
    
    // 30초마다 업데이트
    const interval = setInterval(fetchFlowData, 30000);
    return () => clearInterval(interval);
  }, [cctvId]);

  

  if (!flowData) {
    return null
  }

  const statusStyle = getStatusStyle(flowData.status);

  return (
    <div className="relative  w-full flex justify-center items-center gap-2 text-blue-400 mt-2">
      <span className="font-semibold text-lg">현재 수위:</span>
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-200 hover:shadow-md border ${
          isAlertSending ? 'cursor-wait opacity-75' : 'cursor-pointer hover:scale-105'
        }`}
        style={{ 
          backgroundColor: statusStyle.bg,
          color: statusStyle.color,
          borderColor: statusStyle.color 
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleWeatherAlert}
        title={isAlertSending ? '알림 전송 중...' : '클릭하여 현장 위험 알림 전송'}
      >
        <div className="text-sm font-bold whitespace-nowrap inline-block">
          {isAlertSending ? '전송 중...' : statusStyle.text}
        </div>
      </div>
        
      {/* 툴팁  커서올리면 나타나는 곳*/} 
      {showTooltip && (
        <div className="absolute z-50 bg-gray-800 text-white text-sm rounded-lg p-2 shadow-lg -top-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="space-y-1">
            <div>
              <span className="text-blue-300">수위:</span> {flowData.before_depth}cm → {flowData.after_depth}cm
              {flowData.depth_increase > 0 && (
                <span className="text-red-300"> (+{flowData.depth_increase}cm)</span>
              )}
            </div>
            <div>
              <span className="text-green-300">유속:</span> {flowData.before_velocity}m/s → {flowData.after_velocity}m/s
              {flowData.velocity_increase > 0 && (
                <span className="text-red-300"> (+{flowData.velocity_increase}m/s)</span>
              )}
            </div>
          </div>
          {/* 툴팁 화살표 */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
}