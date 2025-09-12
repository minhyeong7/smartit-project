import { server } from "./header";

export async function getalert(cctvId) {
  console.log("getalert called with:", cctvId, typeof cctvId); // 추가
  const res = await fetch(`${server}/alert/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cctv_id: cctvId }),
  });

  if (!res.ok) {
    throw new Error(res.statusText + " Error");
  }

  return await res.json();
}

// 기상 위험 알림 전송 함수
export async function sendWeatherDangerAlert(data) {
  console.log("sendWeatherDangerAlert called with:", data);
  const res = await fetch(`${server}/alert-danger/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // { cctv_id, danger_level }
  });

  if (!res.ok) {
    throw new Error(res.statusText + " Error");
  }

  return await res.json();
}
