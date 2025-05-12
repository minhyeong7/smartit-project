import {server } from "./header";
// import rescueData from '../mockData/mockRescueData.json';


// 선택된 해당 CCTV ID의 구조 로그 기록 불러오기
export async function getrescue(cctvId) {
  const res = await fetch(`${server}/sms/list/${cctvId}/`);

  if (!res.ok) {
    throw new Error(res.statusText + " Error");
  }

  return await res.json();
}

// 모든 구조 로그 기록 불러오기
export async function getallrescue() {
  const res= await fetch(`${server}/sms/list-all/`);

  if(!res.ok){
    throw new Error(res.statusText + " Error");
  }

  return await res.json();
}

// 목업 데이터 구조 로그 기록 불러오기
// export async function getallrescue() {
//   return rescueData;
// }

// 구조 신고하기
export async function postrescue(rescuedata) {
  const res = await fetch(`${server}/emergency-sms/`,{
    method:'POST',
    body: JSON.stringify(rescuedata),
    headers:{
      'Content-Type': 'application/json',
    },

  });

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}