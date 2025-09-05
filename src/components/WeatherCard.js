 import WeatherIcon from "./WeatherIcon"
 import FlowStatus from "./FlowStatus"
 import { useState } from "react";


  const cctvData = [
    { id: "CCTV001", name: "중부대계곡" },
    { id: "CCTV002", name: "백운계곡" }
  ];

 export default function WeatherCard(){
    const [selectedCctv, setSelectedCctv] = useState("CCTV001");
    const selectedCctvData = cctvData.find(cctv => cctv.id === selectedCctv);

    

    return(
        <>
            {/* WeatherIcon과 FlowStatus를 함께 배치 */}
            <div className="border h-full w-full">
                {/* CCTV 선택 리스트박스 */}
                <div className="w-full ">
                    <select
                        id="cctv-select"
                        value={selectedCctv}
                        onChange={(e) => setSelectedCctv(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white "
                    >
                        {cctvData.map((cctv) => (
                            <option key={cctv.id} value={cctv.id}>
                                {cctv.name}
                            </option>
                        ))}
                    </select>
                </div>



                <WeatherIcon cctvId={selectedCctv} displayName={selectedCctvData?.name} />
                <FlowStatus cctvId={selectedCctv} />

               

            </div>
        </>
    )
 }
 
