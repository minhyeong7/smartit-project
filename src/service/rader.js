import { server } from "./header";


// 발사버튼
export async function getrader(cctvId) {
    const res= await fetch(`${server}/shoots/${cctvId}/`);
  
    if(!res.ok){
      throw new Error(res.statusText + " Error");
    }
  
    return await res.json();
  }
