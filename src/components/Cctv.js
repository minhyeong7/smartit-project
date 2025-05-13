import React, { useState, useEffect, useRef, useCallback } from 'react';
import { wsProtocol, wsHost } from '../service/header';

function WebSocketVideoTest() {
  const [videoStreams, setVideoStreams] = useState({});
  const [fullScreenStream, setFullScreenStream] = useState(null); // 전체화면용 상태
  const [focusedSlot, setFocusedSlot] = useState(null);
  const [activeControls, setActiveControls] = useState({});
  const [selectedCamera, setSelectedCamera] = useState(null); // 선택된 카메라 상태 추가
  
  const wsConnectionsRef = useRef({});
  const blobUrlsRef = useRef({});
  const connectionsInitializedRef = useRef(false);
  
  const cameras = [
    { id: 'CCTV001', name: '고양시청', type: 'original' },
    { id: 'CCTV001', name: '고양시청', type: 'ai' },
    { id: 'CCTV002', name: '제주시청', type: 'original' },
    { id: 'CCTV002', name: '제주시청', type: 'ai' },
  ];

  // 디버그 로그 함수
  const debugLog = useCallback((message) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
  }, []);

  // 카메라 제어 함수 - 방향 명령 한 번만 보내기
  const controlCamera = useCallback((streamId, direction) => {
    const socket = wsConnectionsRef.current[streamId];
    const camera = cameras.find(cam => 
      `${cam.id}-${cam.type}` === streamId
    );

    // 이미 같은 방향의 컨트롤이 활성화되어 있는지 확인
    if (activeControls[streamId] === direction) {
      debugLog(`컨트롤 무시: 슬롯 ${streamId}에 이미 ${direction} 방향이 활성화됨`);
      return;
    }

    // 웹소켓 연결 확인
    if (socket && socket.readyState === WebSocket.OPEN) {
      // 명령 전송 (한 번만)
      const controlMessage = {
        type: 'camera_control',
        direction: direction
      };

      socket.send(JSON.stringify(controlMessage));
      console.log(`전송한 메시지: ${JSON.stringify(controlMessage)}`);
      debugLog(`카메라 제어 명령 전송: ${camera?.name} - ${direction}`);

      // 활성화된 컨트롤 상태 업데이트
      setActiveControls(prev => ({
        ...prev,
        [streamId]: direction
      }));
    } else {
      debugLog(`웹소켓 연결 상태 오류: ${streamId}`);
    }
  }, [cameras, activeControls, debugLog]);

  // 카메라 정지 함수
  const stopCamera = useCallback((streamId) => {
    const socket = wsConnectionsRef.current[streamId];
    const camera = cameras.find(cam => 
      `${cam.id}-${cam.type}` === streamId
    );

    if (socket && socket.readyState === WebSocket.OPEN) {
      // 정지 명령 전송
      const stopMessage = {
        type: 'camera_control',
        direction: 'stop'
      };

      socket.send(JSON.stringify(stopMessage));
      console.log(`전송한 정지 메시지: ${JSON.stringify(stopMessage)}`);
      debugLog(`카메라 정지 명령 전송: ${camera?.name}`);

      // 활성화된 컨트롤 상태 제거
      setActiveControls(prev => {
        const newControls = {...prev};
        delete newControls[streamId];
        return newControls;
      });
    } else {
      debugLog(`웹소켓 연결 상태 오류: ${streamId}`);
    }
  }, [cameras, debugLog]);
  
  // 카메라 선택 처리 함수
  const handleCameraSelect = (streamId) => {
    if (videoStreams[streamId]) { // 연결된 카메라만 선택 가능
      setSelectedCamera(streamId);
      debugLog(`카메라 선택됨: ${streamId}`);
    }
  };

  // 영역 경계와 관련된 표시
  const renderCameraInfo = (camera) => (
    <div className='absolute top-0 left-0 p-2 bg-gray-900 text-white rounded-br-lg z-10'>
      {camera.name} - {camera.type}
    </div>
  );
  
  // 키보드 이벤트 핸들러 추가
  useEffect(() => {
    const handleKeyDown = (event) => {
      // 선택된 카메라가 있을 때만 키보드 제어 활성화
      if (selectedCamera) {
        // 방향키 처리 - 키 반복 이벤트는 무시
        if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && !event.repeat) {
          const direction = event.key === 'ArrowLeft' ? 'left' : 'right';
          controlCamera(selectedCamera, direction);
          debugLog(`키보드 단일 명령: ${direction} (${selectedCamera})`);
        }
        
        // F키 누를 시 전체화면 전환
        if (event.key.toLowerCase() === 'f' && !event.repeat) {
          if (fullScreenStream === selectedCamera) {
            // 이미 전체화면이면 그리드 모드로 복귀
            setFullScreenStream(null);
            debugLog(`전체화면 모드 해제: ${selectedCamera}`);
          } else {
            // 그리드 모드면 전체화면으로 전환
            setFullScreenStream(selectedCamera);
            debugLog(`전체화면 모드 활성화: ${selectedCamera}`);
          }
        }
      }
    };
    
    const handleKeyUp = (event) => {
      // 선택된 카메라가 있고 방향키를 뗐을 때
      if (selectedCamera && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        // 정지 명령 전송
        stopCamera(selectedCamera);
        debugLog(`키보드 정지 명령 (${selectedCamera})`);
      }
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // 클린업 함수
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedCamera, fullScreenStream, controlCamera, stopCamera, debugLog]);

  const connectToCamera = useCallback((camera) => {
    const streamId = `${camera.id}-${camera.type}`;
    
    // 이미 연결이 존재하고 열려있으면 재연결하지 않음
    if (wsConnectionsRef.current[streamId] && 
        wsConnectionsRef.current[streamId].readyState !== WebSocket.CLOSED) {
      debugLog(`이미 연결이 활성화됨: ${streamId}`);
      return;
    }
    
    const wsUrl = `${wsProtocol}${wsHost}/ws/camera/${camera.id}/${camera.type}/`;
    debugLog(`웹소켓 연결 시도: ${wsUrl}`);
    
    const socket = new WebSocket(wsUrl);
    socket.binaryType = 'arraybuffer';  // 바이너리 타입 설정
    
    socket.onopen = () => {
      debugLog(`웹소켓 연결 성공: ${streamId}`);
      // 연결 확인을 위한 간단한 메시지만 전송
      socket.send(JSON.stringify({
        type: 'connection_init'
      }));
    };
    
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
          // 텍스트 메시지 처리
          try {
            const data = JSON.parse(event.data);
            debugLog(`서버 메시지 수신 (${streamId}): ${JSON.stringify(data)}`);

            // 제어 응답 처리
            if (data.type === 'camera_control_response') {
              debugLog(`카메라 제어 응답: 방향=${data.direction}, 성공=${data.success}`);
              
              // 제어 실패 시 상태 초기화
              if (!data.success) {
                setActiveControls(prev => {
                  const newControls = {...prev};
                  delete newControls[streamId];
                  return newControls;
                });
              }
            }
          } catch (parseError) {
            debugLog(`메시지 파싱 오류: ${parseError.message}`);
          }
        }
      } catch (error) {
        debugLog(`메시지 처리 오류: ${error.message}`);
      }
    };
    
    socket.onclose = (event) => {
      debugLog(`웹소켓 연결 종료: 코드=${event.code}, 이유=${event.reason || '없음'}`);
      
      // 연결이 정상적으로 종료된 경우에만 참조에서 제거
      if (event.code === 1000 || event.code === 1001) {
        delete wsConnectionsRef.current[streamId];
      } else {
        // 비정상 종료시 재연결 시도 (단, 컴포넌트가 마운트된 상태일 때만)
        setTimeout(() => {
          if (connectionsInitializedRef.current) {
            debugLog(`5초 후 재연결 시도: ${streamId}`);
            connectToCamera(camera);
          }
        }, 5000);
      }
    };
    
    socket.onerror = (error) => {
      debugLog(`웹소켓 오류: ${streamId}, ${error.message || '알 수 없는 오류'}`);
    };
    
    wsConnectionsRef.current[streamId] = socket;
  }, [debugLog]);
  
  // 카메라 연결 설정 - 딱 한 번만 실행되도록 보장
  useEffect(() => {
    // 이미 초기화되었으면 아무것도 하지 않음
    if (connectionsInitializedRef.current) {
      return;
    }
    
    debugLog('카메라 연결 초기화...');
    connectionsInitializedRef.current = true;
    
    // 각 카메라에 한 번씩만 연결
    cameras.forEach(connectToCamera);
    
    // 정리 함수
    return () => {
      connectionsInitializedRef.current = false;
      
      // WebSocket 연결 종료
      Object.entries(wsConnectionsRef.current).forEach(([id, socket]) => {
        debugLog(`정리: WebSocket 연결 종료 (${id})`);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close(1000, "컴포넌트 언마운트");
        }
      });
      
      // Blob URL 정리
      Object.values(blobUrlsRef.current).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [connectToCamera]); // connectToCamera 함수를 의존성 배열에 추가
  
  // 선택된 카메라 표시 - 상태 정보 제거
  useEffect(() => {
    // 바탕화면(여백) 클릭 시 선택 해제 처리
    const handleBackgroundClick = (event) => {
      // 클릭된 요소가 카메라 컨테이너가 아닌 경우에만 선택 해제
      const isClickOnCamera = event.target.closest('.camera-container');
      if (!isClickOnCamera && selectedCamera) {
        setSelectedCamera(null);
        debugLog('카메라 선택 해제됨 (배경 클릭)');
      }
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('click', handleBackgroundClick);
    
    // 클린업 함수
    return () => {
      window.removeEventListener('click', handleBackgroundClick);
    };
  }, [selectedCamera, debugLog]);
  
  return (
    <div className={`mr-8 ${fullScreenStream ? '' : 'grid grid-cols-2 grid-rows-2 gap-2'}`}>
      {/* 키보드 사용 안내 메시지 제거 */}
      {/* 전체화면 */}
      {fullScreenStream ? (
  <div
    className={`
      w-full h-full bg-gray-800 border-2 rounded-lg relative aspect-[16/9]
      flex items-center justify-center transition-all duration-300 overflow-hidden camera-container
      ${selectedCamera === fullScreenStream ? 'border-green-500' : 'border-gray-600'}
    `}
  >
    {/* 카메라 정보 표시 */}
    {renderCameraInfo(
      cameras.find(cam => `${cam.id}-${cam.type}` === fullScreenStream)
    )}

    {/* 클릭 시 카메라 선택 (선택된 경우엔 무반응) */}
    <div
      className="absolute inset-0 cursor-pointer"
      onClick={() =>
        selectedCamera !== fullScreenStream && handleCameraSelect(fullScreenStream)
      }
    ></div>

    {/* 실시간 스트림 영상 */}
    <img
      src={videoStreams[fullScreenStream]}
      alt={`Full Screen ${fullScreenStream}`}
      className="w-full h-full object-cover"
    />

    {/* 중앙 십자가 오버레이 */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="48" y="20" width="4" height="60" fill="red" />
        <rect x="20" y="48" width="60" height="4" fill="red" />
      </svg>
    </div>
  </div>
) : (
        // 그리드 레이아웃 모드 - 고정 위치에 카메라 표시
        <>
          {/* 고정 위치에 카메라 표시 */}
          {cameras.map((camera, index) => {
            const streamId = `${camera.id}-${camera.type}`;
            const isSelected = selectedCamera === streamId;
            const hasStream = videoStreams[streamId] !== undefined;
            
            return (
              <div 
                key={streamId} 
                className={`bg-gray-800 border-2 ${
                  isSelected ? 'border-green-500' : 'border-gray-600'
                } rounded-lg relative aspect-[16/9] flex items-center justify-center transition-all duration-300 overflow-hidden camera-container`}
              >
                {renderCameraInfo(camera)}
                
                 {/* 전체화면 안내 텍스트 제거 */}
                
                {hasStream ? (
                  <>
                    <div
                      className="w-full h-full absolute top-0 left-0 cursor-pointer"
                      onClick={() => selectedCamera !== streamId ? handleCameraSelect(streamId) : null}
                    ></div>

                    {/* 영상 스트림 */}
                    <img
                      src={videoStreams[streamId]}
                      alt={`Stream ${streamId}`}
                      className='w-full h-full object-cover'
                    />

                    {/* 중앙 십자가 오버레이 */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <rect x="48" y="20" width="4" height="60" fill="red" />
                        <rect x="20" y="48" width="60" height="4" fill="red" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className='flex flex-col items-center justify-center text-gray-400'>
                    <div className='text-3xl mb-2'>⚠️</div>
                    <p>카메라 연결 중...</p>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default WebSocketVideoTest;