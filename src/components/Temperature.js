import { useState, useEffect } from "react";
import { getweather } from "../service/weather";

export default function Temperature({ cctvId }) {
  const [tempData, setTempData] = useState(null); // 숫자 데이터
  const [error, setError] = useState(null);

  const fetchTemp = async () => {
    try {
      const data = await getweather(cctvId); // 날씨 API에서 온도도 함께 받아옴
      setTempData(data.temperature); // 온도 데이터 저장
    } catch (err) {
      setError(err.message);
      
    } finally {
      
    }
  };

  useEffect(() => {
    if (cctvId) {
      fetchTemp();
    }
  }, [cctvId]);

  // 오늘 날짜 구하기
  const today = new Date();
  const formattedDate = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  return (
    <>
    {tempData &&
    <div className="text-center ">
     
      <div className="text-sm text-gray-500">{formattedDate}</div>
      <div className="text-xl font-semibold text-gray-800  inline-block px-4 ">
        {tempData}°C
      </div>
      
    </div>
    }
    </>
  );
}
