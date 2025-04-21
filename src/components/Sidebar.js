import React from "react";
import { Link } from "react-router-dom";
export default function Sidebar({ isOpen, toggleSidebar }) {
    return (
        <>
            {/* 오버레이 */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-30"
                    onClick={toggleSidebar} 
                ></div>
            )}

            {/* 사이드바 */}
            <div
                className={`fixed top-0 left-0 z-30 w-64 h-full bg-white shadow-lg transform transition-transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-4">
                    
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-200 rounded-full" onClick={toggleSidebar}>
                            <svg className="w-6 h-6 text-gray-700" aria-hidden="true" data-prefix="fal" data-icon="bars" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M0 80c0-8.8 7.2-16 16-16h416c8.8 0 16 7.2 16 16s-7.2 16-16 16H16C7.2 96 0 88.8 0 80zm0 160c0-8.8 7.2-16 16-16h416c8.8 0 16 7.2 16 16s-7.2 16-16 16H16c-8.8 0-16-7.2-16-16zm448 160c0 8.8-7.2 16-16 16H16c-8.8 0-16-7.2-16-16s7.2-16 16-16h416c8.8 0 16 7.2 16 16z"></path>
                            </svg>
                        </button>
                        <h2 className="text-xl font-semibold">메뉴</h2>
                    </div>
                    <ul className="mt-8 space-y-2">
                        <Link to="/" className="block p-2 hover:bg-gray-200 flex items-center gap-4" onClick={toggleSidebar}>
                        <svg className="w-6 h-6 fill-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>
                        대시보드
                        </Link>

                        <Link to="/cctvs" className="block p-2 hover:bg-gray-200 flex items-center gap-4" onClick={toggleSidebar}>
                        <svg className="w-6 h-6 fill-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
                        모니터링</Link>

                        <Link to="/weathers" className="block p-2 hover:bg-gray-200 flex items-center gap-4" onClick={toggleSidebar}>
                        <svg  className="w-6 h-6 fill-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M0 336c0 79.5 64.5 144 144 144l368 0c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z"/></svg>
                        날씨</Link>

                        <Link to="/rescues" className="block p-2 hover:bg-gray-200 flex items-center gap-4  " onClick={toggleSidebar}>
                        <svg className="w-6 h-6 fill-gray-500  " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M192 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32.2c0 54.1 23.5 104 62.2 138.3l-21 146.7c7.8 2.1 15.5 3.3 22.8 3.3c21.1 0 42-8.5 59.2-20.3c22.1-15.5 51.6-15.5 73.7 0c12.4 8.5 26.1 14.8 39.7 18l17.7-97.6c10.7-1.2 21.3-3.1 31.9-5.5l105-23.9c17.2-3.9 28-21.1 24.1-38.3s-21.1-28-38.3-24.1L400 216.6c-41 9.3-83.7 7.5-123.7-5.2c-50.2-16-84.3-62.6-84.3-115.3L192 64zM320 192a64 64 0 1 0 0-128 64 64 0 1 0 0 128zM306.5 389.9c-11.1-7.9-25.9-7.9-37 0C247 405.4 219.5 416 192 416c-26.9 0-55.3-10.8-77.4-26.1c0 0 0 0 0 0c-11.9-8.5-28.1-7.8-39.2 1.7c-14.4 11.9-32.5 21-50.6 25.2c-17.2 4-27.9 21.2-23.9 38.4s21.2 27.9 38.4 23.9c24.5-5.7 44.9-16.5 58.2-25C126.5 469.7 159 480 192 480c31.9 0 60.6-9.9 80.4-18.9c5.8-2.7 11.1-5.3 15.6-7.7c4.5 2.4 9.7 5.1 15.6 7.7c19.8 9 48.5 18.9 80.4 18.9c33 0 65.5-10.3 94.5-25.8c13.4 8.4 33.7 19.3 58.2 25c17.2 4 34.4-6.7 38.4-23.9s-6.7-34.4-23.9-38.4c-18.1-4.2-36.2-13.3-50.6-25.2c-11.1-9.4-27.3-10.1-39.2-1.7c0 0 0 0 0 0C439.4 405.2 410.9 416 384 416c-27.5 0-55-10.6-77.5-26.1z"/></svg>
                        구조</Link>
                    </ul>
                </div>
            </div>
        </>
    );
}
