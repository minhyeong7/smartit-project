import {server } from "./header";



export async function getalert(cctvId) {
    const res= await fetch(`${server}/alert/${cctvId}/`);
  
    if(!res.ok){
      throw new Error(res.statusText + " Error");
    }
  
    return await res.json();
  }

