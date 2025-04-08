import React, { useState, useEffect, useRef } from 'react';
import { wsProtocol, wsHost } from '../service/header';

function WebSocketVideoTest() {
  const [videoStreams, setVideoStreams] = useState({});
  const wsConnectionsRef = useRef({});
  const blobUrlsRef = useRef({});  // Blob URL 추적을 위한 ref
  
  const cameras = [
    { id: 'CCTV001', name: '고양시청', type: 'original' },
    { id: 'CCTV001', name: '고양시청', type: 'ai' },
    { id: 'CCTV002', name: '제주시청', type: 'original' },
    { id: 'CCTV002', name: '제주시청', type: 'ai' },
  ];
  
  const connectToCamera = (camera) => {
    const streamId = `${camera.id}-${camera.type}`;
    
    // 기존 연결이 있으면 닫기
    if (wsConnectionsRef.current[streamId]) {
      wsConnectionsRef.current[streamId].close();
    }
    
    const wsUrl = `${wsProtocol}${wsHost}/ws/camera/${camera.id}/${camera.type}/`;
    console.log(`Connecting to: ${wsUrl}`);
    
    const socket = new WebSocket(wsUrl);
    socket.binaryType = 'arraybuffer';  // 바이너리 타입 설정
    
    socket.onmessage = (event) => {
      try {
        if (event.data instanceof ArrayBuffer) {
          // 이전 Blob URL이 있으면 해제
          if (blobUrlsRef.current[streamId]) {
            URL.revokeObjectURL(blobUrlsRef.current[streamId]);
          }
          
          // 바이너리 데이터에서 Blob 생성
          const blob = new Blob([event.data], { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          
          // Blob URL 저장
          blobUrlsRef.current[streamId] = url;
          
          // 상태 업데이트
          setVideoStreams((prev) => ({
            ...prev,
            [streamId]: url,
          }));
        } else {
          // 텍스트 메시지 처리 (에러 메시지 등)
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'error') {
              console.error(`Error from server (${streamId}):`, data.error);
            } else if (data.type === 'camera_info') {
              console.log(`Camera info (${streamId}):`, data);
            }
          } catch (parseError) {
            console.error(`Message parsing error (${streamId}):`, parseError);
          }
        }
      } catch (error) {
        console.error(`Message processing error (${streamId}):`, error);
      }
    };
    
    socket.onclose = () => {
      console.log(`Connection closed (${streamId})`);
      delete wsConnectionsRef.current[streamId];
    };
    
    socket.onerror = (error) => {
      console.error(`WebSocket error (${streamId}):`, error);
    };
    
    wsConnectionsRef.current[streamId] = socket;
  };
  
  useEffect(() => {
    cameras.forEach(connectToCamera);
    
    // 정리 함수
    return () => {
      // WebSocket 연결 종료
      Object.values(wsConnectionsRef.current).forEach((socket) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      });
      
      // Blob URL 정리
      Object.values(blobUrlsRef.current).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []); // cameras가 정적이라면 빈 배열로 두기
  
  return (
    <div className='grid grid-cols-2 grid-rows-2 gap-2 mr-8'>
      {Object.entries(videoStreams).map(([streamId, frameData], index) => {
        const camera = cameras[index]; // 현재 인덱스에 해당하는 카메라 정보
        return (
          <div key={streamId} className='bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg relative aspect-[16/9] flex items-center justify-center transition-all duration-300'>
            {/* 카메라 정보 표시 */}
            <div className='absolute top-0 left-0 p-2 bg-gray-900 text-white rounded-br-lg'>
              {camera.name} - {camera.type}
            </div>
            <img 
              src={frameData} 
              alt={`Stream ${streamId}`} 
              className='w-full h-full object-cover' // object-cover로 비율 유지
            />
          </div>
        );
      })}
      {Object.keys(videoStreams).length === 0 && (
        <div className='w-full h-full flex items-center justify-center col-span-2 row-span-2'>
          <p className='text-gray-400'>카메라가 연결되지 않았습니다. 네트워크 상태를 확인하세요.</p>
        </div>
      )}
    </div>
  );
}

export default WebSocketVideoTest;