import Cctv from "./Cctv";
import RescueButton from "./RescueButton";
import RainfallChart from "./RainfallChart";
import RescueList from "./RescueList";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full h-[42rem] flex justify-center">
        <Cctv />
        <RescueButton />
      </div>

      {/* 대시보드 */}
      <div className="border-t w-full mt-12 flex justify-center">
        <div className="mt-8 flex gap-8 w-full">
          <RainfallChart />
          <RescueList />
        </div>
      </div>
    </div>
  );
}
