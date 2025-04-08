import { server } from "./header";


// 발사버튼
export async function getlaunch(cctvId) {
    const res= await fetch(`${server}/shoot/${cctvId}/`);
  
    if(!res.ok){
      throw new Error(res.statusText + " Error");
    }
  
    return await res.json();
  }
