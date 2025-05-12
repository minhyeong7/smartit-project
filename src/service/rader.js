import { server } from "./header";


// 레이더 발사버튼
export async function getrader(cctvId) {
    const res= await fetch(`${server}/rader/`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',

      },
      body:JSON.stringify({ cctv_id: cctvId })
    });
  
    if(!res.ok){
      throw new Error(res.statusText + " Error");
    }
  
    return await res.json();
  }
