import React, { useState, useEffect } from 'react';
import { getrescue, getallrescue } from '../service/rescue';

export default function RescueList(){

  const [data, setData] = useState([]);
  const [selectedCCTV, setSelectedCCTV] = useState("전체");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRescue = async () => {
      setLoading(true); // 로딩 시작
      try {
        let rescueData;
        if (selectedCCTV === "전체") {
          rescueData = await getallrescue(); // 전체 기록 불러오기
        } else {
          rescueData = await getrescue(selectedCCTV); // 특정 CCTV 기록 불러오기
        }
        setData(rescueData);
      } catch (err) {
        console.error("Error fetching rescue data:", err);
      }
      setLoading(false); // 로딩 종료
    };

    fetchRescue();
  }, [selectedCCTV]);

  return (
   
      <div className=" p-6 shadow-md w-1/2 h-[25rem] bg-white  rounded-lg relative overflow-auto">
        {/* CCTV 선택 */}
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg font-semibold">신고 목록</label>
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
        <div className="bg-gray-50 p-4 rounded-md border ">
          {loading ? (
            <div className="text-center text-gray-500 py-4">🚀 신고 목록을 불러오는 중...</div>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">위치</th>
                  <th className="border border-gray-300 px-4 py-2">날짜</th>
                  <th className="border border-gray-300 px-4 py-2">수신자</th>
                  <th className="border border-gray-300 px-4 py-2">메시지</th>
                  <th className="border border-gray-300 px-4 py-2">상태</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td> {/* 순차적 ID */}
                      <td className="border border-gray-300 px-4 py-2">{item.location || '알 수 없음'}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.date || '날짜 없음'}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.receiver || '미지정'}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.message || '메시지 없음'}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.status || '알 수 없음'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                      신고 내역이 없습니다.
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