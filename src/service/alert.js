import {server } from "./header";



export async function getalert(cctvId) {
  const res = await fetch(`${server}/alert/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cctv_id: cctvId }),
  });

  if (!res.ok) {
    throw new Error(res.statusText + " Error");
  }

  return await res.json();
}



