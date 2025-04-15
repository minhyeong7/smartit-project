import { useEffect, useRef } from 'react';
import { wsProtocol, wsHost } from '../service/header';  // header.js에서 가져온 웹소켓 설정

export default function Controlbutton() {
    const socketRef = useRef(null);

    useEffect(() => {
        // WebSocket 연결 생성
        const wsUrl = `${wsProtocol}${wsHost}/ws/control/`; // 서버에 맞게 경로 수정 가능
        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => {
            console.log("WebSocket 연결됨!");
        };

        socketRef.current.onclose = () => {
            console.log("WebSocket 연결 종료");
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket 에러:", error);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const sendDirection = (direction) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(direction);
            console.log(`보낸 메시지: ${direction}`);
        } else {
            console.log("WebSocket이 아직 연결되지 않았어요.");
        }
    };

    return (
        <div className="flex justify-center items-center space-x-4">
            {/* 왼쪽 버튼 */}
            <button
                onClick={() => sendDirection("left")}
                className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-600 transition"
            >
                ◀
            </button>

            {/* 오른쪽 버튼 */}
            <button
                onClick={() => sendDirection("right")}
                className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-600 transition"
            >
                ▶
            </button>
        </div>
    );
}
