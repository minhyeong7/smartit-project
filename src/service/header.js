<<<<<<< HEAD
// 서버 설정
//const SERVER_IP = 'localhost:8000'; // 로컬 주소
//const SERVER_IP = '172.20.10.6:8000'; // 핫스팟 서버 주소
//const SERVER_IP = '192.168.192.2:8000'; // zerotier 서버 주소
const SERVER_IP = '192.168.0.145:8000'; // CCIT 서버 주소
//const SERVER_IP = '10.80.13.56:8000'; // JBU-WLAN 서버 주소
=======
// API호출
//export const server = "http://172.20.10.6:8000/api"; // 핫스팟 서버 주소
//export const server = "http://192.168.192.2:8000/api"; // zerotier 서버 주소
export const server = "http://192.168.0.1451:8000/api"; // CCIT 서버 주소
//export const server = "http://10.80.13.56:8000/api"; // JBU-WLAN 서버 주소
>>>>>>> 267eddbef3ef0f3f70edf43937690db6a739086a

// API 호출 URL 생성
export const server = `http://${SERVER_IP}/api`;

// 웹소켓 설정
export const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
<<<<<<< HEAD
export const wsHost = SERVER_IP;
=======
//export const wsHost = '172.20.10.6:8000'; // 핫스팟 서버 주소
//export const wsHost = '192.168.192.2:8000'; // zerotier 서버 주소
export const wsHost = '192.168.01.145:8000'; // CCIT 서버 주소
//export const wsHost = '10.80.13.56:8000'; // JBU-WL


>>>>>>> 267eddbef3ef0f3f70edf43937690db6a739086a
