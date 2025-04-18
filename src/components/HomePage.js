import Cctv from "./Cctv";
import RescueButton from "./RescueButton";
import RainfallChart from "./RainfallChart";
import RescueList from "./RescueList";



export default function HomePage() {
  // 테스트

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full h-[42rem] flex justify-center">
        <Cctv />
        <RescueButton />
       
      </div>

      {/* 대시보드 */}
      <div className="border-t w-full mt-12 flex justify-center">
        {/* 강수량 예측 그래프 */}
        <div className="mt-8 flex gap-8 w-full ">
          <RainfallChart />
          <RescueList />
        </div>
      </div>

      {/* 긴 내용 */}
      {/* <div className="h-80 overflow-y-auto">
       
      </div> */}
    </div>
  );
}
