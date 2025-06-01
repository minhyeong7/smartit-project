import React, { useState, useEffect } from 'react';
import { getrescue, getallrescue } from '../service/rescue';

export default function RescueList() {
  const [data, setData] = useState([]);
  const [selectedCCTV, setSelectedCCTV] = useState("전체");
  const [loading, setLoading] = useState(false);

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
          <option value="전체">전체</option>
          <option value="CCTV001">CCTV001</option>
          <option value="CCTV002">CCTV002</option>
        </select>
      </div>

      {/* 신고 목록 */}
      <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-8">🚀 신고 목록을 불러오는 중...</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-500 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">위치</th>
                <th className="px-4 py-3">날짜</th>
                <th className="px-4 py-3">수신자</th>
                <th className="px-4 py-3">메시지</th>
                <th className="px-4 py-3">상태</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 text-blue-600">{item.location || '위치 알 수 없음'}</td>
                    <td className="px-4 py-3">{item.date || '날짜 없음'}</td>
                    <td className="px-4 py-3">{item.receiver || '수신자 알 수 없음'}</td>
                    <td className="px-4 py-3">{item.message || '메시지 알 수 없음'}</td>
                     <td className="px-4 py-3">{item.status || '상태 알 수 없음'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-5 text-center text-gray-400">
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
