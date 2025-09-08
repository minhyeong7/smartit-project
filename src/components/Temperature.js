import { useState, useEffect } from "react";
import { gettemperature } from "../service/weather";

export default function Temperature({ cctvId }) {
  const [tempData, setTempData] = useState(null); // 숫자 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemp = async () => {
    try {
      setLoading(true);
      const data = await gettemperature(cctvId); // { cctvId, temperature }
      setTempData(data.temperature); // 숫자만 저장
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cctvId) {
      fetchTemp();
    }
  }, [cctvId]);

  if (loading) {
    return (
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    );
  }

  if (error) {
    return <div className="text-red-500">에러: {error}</div>;
  }

  return (
    <div className="text-lg font-semibold text-gray-800 border border-black">
       {tempData}°C
    </div>
  );
}
