import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./Sidebar"; // Sidebar 컴포넌트를 가져옵니다.


export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // 사이드바 상태 관리
  const [isAlertOpen, setAlertOpen] =useState(false); // 알림창 상태 관리

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // 사이드바 토글 함수
  };

  return (
    <>
      {/* 헤더 영역 */}
      <header className="flex items-center justify-between border-b border-gray-300 p-4  w-full  bg-white z-30 sticky top-0">
        <div className="flex items-center">
          {/* 햄버거 메뉴 아이콘 */}
          <button className="p-2 hover:bg-gray-200 rounded-full" onClick={toggleSidebar}>
            <svg className="w-6 h-6 text-gray-700" aria-hidden="true" data-prefix="fal" data-icon="bars" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path fill="currentColor" d="M0 80c0-8.8 7.2-16 16-16h416c8.8 0 16 7.2 16 16s-7.2 16-16 16H16C7.2 96 0 88.8 0 80zm0 160c0-8.8 7.2-16 16-16h416c8.8 0 16 7.2 16 16s-7.2 16-16 16H16c-8.8 0-16-7.2-16-16zm448 160c0 8.8-7.2 16-16 16H16c-8.8 0-16-7.2-16-16s7.2-16 16-16h416c8.8 0 16 7.2 16 16z"></path>
            </svg>
          </button>

          {/* 로고 / 홈 링크 */}
          <Link to="/" className="text-blue-500 text-lg font-semibold ml-2">
            스마트 계곡 CCTV
          </Link>
        </div>

       
        <div className="flex items-center gap-4">
       
          {/* 알림 아이콘 */}
          <button className=" hover:bg-gray-200 rounded-full p-2" onClick={() => setAlertOpen(!isAlertOpen)}>

            <svg className="w-6 h-6 text-gray-700" aria-hidden="true" data-prefix="fal" data-icon="bell" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path fill="currentColor" d="M208 16c0-8.8 7.2-16 16-16s16 7.2 16 16v16.8c80.9 8 144 76.2 144 159.2v29.1c0 43.7 17.4 85.6 48.3 116.6l2.8 2.8c8.3 8.3 13 19.6 13 31.3 0 24.5-19.8 44.3-44.3 44.3H44.3C19.8 416 0 396.2 0 371.7c0-11.7 4.7-23 13-31.3l2.8-2.8C46.6 306.7 64 264.8 64 221.1V192c0-83 63.1-151.2 144-159.2V16zm16 48c-70.7 0-128 57.3-128 128v29.1c0 52.2-20.7 102.3-57.7 139.2L35.6 363c-2.3 2.3-3.6 5.4-3.6 8.7 0 6.8 5.5 12.3 12.3 12.3h359.4c6.8 0 12.3-5.5 12.3-12.3 0-3.3-1.3-6.4-3.6-8.7l-2.8-2.8c-36.9-36.9-57.7-87-57.7-139.2V192c0-70.7-57.3-128-128-128zm-14.2 410.7c4.4 12.4 16.3 21.3 30.2 21.3s25.8-8.9 30.2-21.3c2.9-8.3 12.1-12.7 20.4-9.8s12.7 12.1 9.8 20.4c-8.8 24.9-32.5 42.7-60.4 42.7s-51.6-17.8-60.4-42.7c-2.9-8.3 1.4-17.5 9.8-20.4s17.5 1.4 20.4 9.8z"></path>
            </svg>
          </button>

         

          {/* 설정 아이콘 */}
          <button className="hover:bg-gray-200 rounded-full p-2">
          <svg className="w-6 h-6 fill-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
          </button>
          {/* 프로필 */}
          <img className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm object-cover" alt="프로필 이미지" src="/default.png" />
        </div>
        
      </header>

      {/* 사이드바 */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* 본문 내용 */}
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}
