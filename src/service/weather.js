import {server } from "./header";
import rainfallData from '../mockData/mockRainfallData.json';
import weatherIconData from '../mockData/mockWeatherIcon.json'
import flowStatusData from '../mockData/mockFlowData.json'
import tempData from '../mockData/mockTempData.json'


//------------------------------------------------------------------


// 날씨 아이콘과 온도 서버에서 불러오기 
export async function getweather(cctvId) {
  const res = await fetch(`${server}/weather/icon/${cctvId}/`)

  if(!res.ok){
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

// 목데이터로 날씨아이콘 가져오기
// export async function getweather(cctvId) {
//   // CCTV ID에 맞는 데이터 찾기
//   const result = weatherIconData.find(item => item.cctvId === cctvId);

//   return result;
// }



//------------------------------------------------------------------


// //강수량 목데이터 불러오기
export async function getrain() {
  // 목데이터를 사용하므로 fetch 호출은 필요 없고 직접 반환할 수 있습니다.
  return rainfallData; // 목데이터를 반환
}


// 해당 CCTV 위치 강수량 불러오기
//  export async function getrain(cctvId) {
//    const res = await fetch(`${server}/rainfall/${cctvId}/`);

//    if(!res.ok){
//      throw new Error(res.statusText + "Error");
//    }

//    return await res.json();

//  }


//------------------------------------------------------------------



// 수위/유속 예측 데이터 가져오기  
// export async function getflowstatus(cctvId) {
//   const res = await fetch(`${server}/valley-flow/`, {  // ← valley-flow/로 수정
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ cctv_id: cctvId }),
//   });

//   if (!res.ok) {
//     throw new Error(res.statusText + " Error");
//   }

//   return await res.json();
// }

// 수위/유속 목 데이터 불러오기
export async function getflowstatus(cctvId){
  const result = flowStatusData.find(item => item.cctvId === cctvId);

  return result;
}

// ------------------------------------------------------------------------------

// 온도 데이터 불러오기
// export async function gettemperature(cctvId) {
//   const res =await fetch(`${server}/weather/temperature/${cctvId}`,)
//   if (!res.ok){
//      throw new Error(res.statusText + "Error");
//   }
//    return await res.json();
// }

//  온도 목데이터 불러오기
export async function gettemperature(cctvId){
  const result = tempData.find(item => item.cctvId === cctvId);

  return result
}




