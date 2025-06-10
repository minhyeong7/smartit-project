// RescueList.js 수정
import React, { useState, useEffect } from 'react';
import { getrescue, getallrescue } from '../service/rescue';

export default function RescueList() {
  const [data, setData] = useState([]);
  const [selectedCCTV, setSelectedCCTV] = useState("전체");
  const [loading, setLoading] = useState(false);

  // CCTV ID와 표시명 매핑
  const cctvOptions = [
    { id: "전체", name: "전체" },
    { id: "CCTV001", name: "백운계곡" },
    { id: "CCTV002", name: "안덕계곡" }
  ];

  // ID를 이름으로 변환하는 함수
  const getCctvName = (cctvId) => {
    const found = cctvOptions.find(option => option.id === cctvId);
    return found ? found.name : cctvId;
  };

  useEffect(() => {
    const fetchRescue = async () => {
      setLoading(true);
      try {
        let rescueData;
        if (selectedCCTV === "전체") {
          rescueData = await getallrescue();
        } else {
          rescueData = await getrescue(selectedCCTV);
        }
        setData(rescueData);
      } catch (err) {
        console.error("Error fetching rescue data:", err);
      }
      setLoading(false);
    };

    fetchRescue();
  }, [selectedCCTV]);

  return (
    <div className="p-6 shadow-md w-full max-w-4xl bg-white rounded-lg relative overflow-auto">
      {/* CCTV 선택 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">신고 리스트</h2>
        <select
          value={selectedCCTV}
          onChange={(e) => setSelectedCCTV(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          {cctvOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {/* 신고 목록 */}
      <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-8">🚀 신고 목록을 불러오는 중...</div>
        ) : (
          <table className="w-full text-xm text-left text-gray-700">
            <thead className="text-xs text-gray-500 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">위치</th>
                <th className="px-4 py-3">날짜</th>
                <th className="px-8 py-3">수신자</th>
                <th className="px-4 py-3">메시지</th>
                <th className="px-4 py-3">상태</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 text-blue-600">
                      {item.location ? getCctvName(item.location) : '위치 알 수 없음'}
                    </td>
                    <td className="px-4 py-3">{item.date || '날짜 없음'}</td>
                    <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis min-w-[80px] w-[120px]">
                      {item.receiver || '수신자 알 수 없음'}
                    </td>
                    <td className="px-4 py-3">{item.message || '메시지 알 수 없음'}</td>
                    <td className="px-4 py-3">{item.status || '상태 알 수 없음'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-5 text-center text-gray-400">
                    신고 내역을 알 수 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}