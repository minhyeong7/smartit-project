// API호출
//export const server = "http://172.20.10.6:8000/api"; // 핫스팟 서버 주소
//export const server = "http://192.168.192.2:8000/api"; // zerotier 서버 주소
//export const server = "http://192.168.0.145:8000/api"; // CCIT 서버 주소
//export const server = "http://10.80.13.56:8000/api"; // JBU-WLAN 서버 주소
export const server = "http://localhost:8000/api"; // 로컬 주소


// 웹소켓
export const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
//export const wsHost = '172.20.10.6:8000'; // 핫스팟 서버 주소
//export const wsHost = '192.168.192.2:8000'; // zerotier 서버 주소
//export const wsHost = '192.168.0.145:8000'; // CCIT 서버 주소
//export const wsHost = '10.80.13.56:8000'; // JBU-WLAN 서버 주소
export const wsHost = 'localhost:8000'; // 로컬 주소