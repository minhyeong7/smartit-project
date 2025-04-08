import React from "react";


 export default function ReportModal({reportResult,onClose}){

  return (
    <>
    {reportResult &&<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-100 p-4 rounded-md border shadow-lg w-full max-w-md relative">
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
        </button>
        {/* 구조 신고 결과 */}
        <h3 className="text-lg font-semibold mb-2 text-center">✅ 구조 신고 결과:</h3>
        <pre className="text-sm text-red-600 bg-white p-2 rounded-md font-semibold text-center ">
          구조 신고 완료되었습니다!
        </pre>
      </div>
    </div>
    }
    </>
  );
};


