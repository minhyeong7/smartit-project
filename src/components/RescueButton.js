import React, { useState } from "react";
import { postrescue } from "../service/rescue";
import { getalert } from "../service/alert";
import ReportModal from "./ReportModal";
import AlertModal from "./AlertModal";
import LaunchModal from "./LaunchModal";
import { getlaunch } from "../service/launch";


// 가짜 postrescue 함수
// const fakePostRescue = async ({ cctv_id }) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           message: `구조 신고가 접수되었습니다!`,
//           cctv_id: cctv_id,
//           status: "success",
//           timestamp: new Date().toLocaleString(),
//         });
//       }, 1000); // 1초 후 응답 반환
//     });
//   };

// // 가짜 getalert 함수
// const fakeGetAlert = async ({ cctv_id }) => {
//   return new Promise((resolve) => {
//       setTimeout(() => {
//           resolve({
//               message: `구조 알림이 전송되었습니다!`,
//               cctv_id: cctv_id,
//               status: "success",
//               timestamp: new Date().toLocaleString(),
//           });
//       }, 1000); // 1초 후 응답 반환
//   });
// };

// 가짜 launch 함수
// const fakeGetlaunch = async ({ cctv_id }) => {
//   return new Promise((resolve) => {
//       setTimeout(() => {
//           resolve({
//               message: `정상적으로 발사되었습니다`,
//               cctv_id: cctv_id,
//               status: "success",
//               timestamp: new Date().toLocaleString(),
//           });
//       }, 1000); // 1초 후 응답 반환
//   });
// };








export default function RescueButton() {
  const [reportResult, setreportResult] = useState(null);
  const [alertResult, setalertResult] = useState(null);
  const [launchResult, setlaunchResult] = useState(null);

  // 구조 신고 요청 함수
  const submitRescue = async (cctv_id) => {
    try {
      const response = await postrescue({ cctv_id });
      setreportResult(response);
    } catch (err) {
      console.error("Error posting rescue data:", err);
    }
  };

  // 구조 알림 요청 함수
  // const submitAlert= async (cctv_id) =>{
  //   try{
  //     const response = await getalert({cctv_id})
  //     setalertResult(response);
  //   }catch(err){
  //     console.error("Error posting rescue data:", err);
  //   }
  // }

  // 구조 발사 요청 함수
  // const submitLaunch= async (cctv_id) =>{
  //  try{
  //   const response =await getlaunch({cctv_id})
  //   setlaunchResult(response);
  //  }catch(err){
  //   console.error("Error posting rescue data:", err)
  //  }
  // }

  
 

  // CCTV 리스트
  const cctvIds = ["CCTV001", "CCTV002"];
  

  return (
    <div className="p-6 bg-gray-100 h-full flex flex-col items-center gap-6">
      {cctvIds.map((id) => (
        <div key={id} className="bg-white border rounded-lg p-4 shadow-md w-80 flex flex-col items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-700">{id}</h3>
          <button
            onClick={() => submitRescue(id)}
            className="text-lg text-black hover:bg-gray-200 px-4 py-2 rounded-md transition w-full flex items-center gap-4"
          >
            <img src="https://cdn-icons-png.flaticon.com/128/2785/2785693.png" loading="lazy" alt="Siren" width="28" height="24" />
            구조 신고하기
          </button>
          <button
            onClick={() => getalert(id)}
            className="text-lg text-black hover:bg-gray-200 px-4 py-2 rounded-md transition w-full flex items-center gap-4"
          >
            <img src="https://cdn-icons-png.flaticon.com/128/9019/9019234.png" loading="lazy" alt="Megaphone" width="28" height="24" />
            구조 알리기
          </button>
          <button
            onClick={() => getlaunch(id)}
            className="text-lg text-black hover:bg-gray-200 px-4 py-2 rounded-md transition w-full flex items-center gap-4"
          >
            <img src="https://cdn-icons-png.flaticon.com/128/1067/1067357.png" loading="lazy" alt="Startup " title="Startup " width="26" height="64"></img>
            구조 발사하기
          </button>
        </div>
      ))}

      {/* 모달 표시 */}
      <ReportModal reportResult={reportResult} onClose={() => setreportResult(null)} />
      <AlertModal alertResult={alertResult} onClose={() => setalertResult(null)}   />
      <LaunchModal launchResult={launchResult} onClose={() => setlaunchResult(null)} />
    </div>
  );
}
