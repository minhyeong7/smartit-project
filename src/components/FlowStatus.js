import React, { useState, useEffect } from "react";
import { getflowstatus } from "../service/weather"; // weather.js에서 import

export default function FlowStatus({ cctvId }) {
  const [flowData, setFlowData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // 수위/유속 데이터 가져오기
  const fetchFlowData = async () => {
    setLoading(true);
    try {
      const data = await getflowstatus(cctvId); // weather.js의 함수 사용
      setFlowData(data);
    } catch (error) {
      console.error('Flow data fetch error:', error);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    // 초기 로드
    fetchFlowData();
    
    // 30초마다 업데이트
    const interval = setInterval(fetchFlowData, 30000);
    return () => clearInterval(interval);
  }, [cctvId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div class="w-5 h-5 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!flowData) {
    return (

       <div className="flex items-center gap-2 text-gray-500">
        <div class="w-5 h-5 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
      // <div className="flex items-center gap-2 text-gray-400">
      //   <span className="text-sm">데이터 없음</span>
      // </div>
    );
  }

  const statusStyle = getStatusStyle(flowData.status);

  return (
    <div className="relative -ml-10">
      <div
        className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full transition-all duration-200 hover:shadow-md border"
        style={{ 
          backgroundColor: statusStyle.bg,
          color: statusStyle.color,
          borderColor: statusStyle.color 
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="text-sm font-bold whitespace-nowrap inline-block">
          {statusStyle.text}
        </div>
      </div>

      {/* 툴팁 */}
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