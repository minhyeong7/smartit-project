import {server } from "./header";
import rainfallData from '../mockData/mockRainfallData.json';
// import weatherData from '../mockData/mockWeatherData.json';

// 날씨 불러오기
export async function getweather() {
    const res = await fetch(`${server}/weather/?cctv_id=CCTV001`);
  
    if (!res.ok) {
      throw new Error(res.statusText + "Error");
    }
  
    return await res.json();
  }

//날씨 목데이터 불러오기
// export async function getweather() {
//   return weatherData;
// }

// 해당 CCTV 위치 강수량 불러오기
// export async function getrain(cctvId) {
//   const res = await fetch(`${server}/rainfall/${cctvId}/`);

//   if(!res.ok){
//     throw new Error(res.statusText + "Error");
//   }

//   return await res.json();
  
// }

//강수량 목데이터 불러오기
export async function getrain() {
  // 목데이터를 사용하므로 fetch 호출은 필요 없고 직접 반환할 수 있습니다.
  return rainfallData; // 목데이터를 반환
}


