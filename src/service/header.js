// 서버 설정
//const SERVER_IP = 'localhost:8000'; // 로컬 주소
//const SERVER_IP = '172.20.10.6:8000'; // 핫스팟 서버 주소
//const SERVER_IP = '192.168.192.2:8000'; // zerotier 서버 주소
const SERVER_IP = '192.168.0.145:8000'; // CCIT 서버 주소
// const SERVER_IP = '10.80.13.56:8000'; // JBU-WLAN 서버 주소

// API 호출 URL 생성 // 수정해야됨
export const server = `http://${SERVER_IP}/api`;  // 백틱(`) 기호로 수정

// 웹소켓 설정
export const wsProtocol = window.location.protocol === 'http:' ? 'wss://' : 'ws://';
export const wsHost = SERVER_IP;