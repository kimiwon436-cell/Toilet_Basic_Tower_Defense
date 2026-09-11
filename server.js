// server.js (Node.js 환경)
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // JSON 데이터 파싱

// 임시 데이터베이스 역할 (실제로는 MongoDB나 MySQL을 사용해야 함)
let activeTradeAds = []; 

// 1. 거래 글 불러오기 API (클라이언트가 피드를 새로고침 할 때 호출)
app.get('/api/trades', (req, res) => {
    res.json(activeTradeAds);
});

// 2. 새 거래 글 작성 API (클라이언트가 'Post Trade' 버튼을 누를 때 호출)
app.post('/api/trades', (req, res) => {
    const { robloxId, username, avatar, offerUnits, requestUnits, note } = req.body;

    // 데이터베이스에 저장할 새로운 거래 글 객체 생성
    const newTradeAd = {
        id: Date.now(), // 고유 ID
        robloxId: robloxId, // 로블록스 OAuth를 통해 검증된 실제 ID
        username: username,
        avatar: avatar,
        offerUnits: offerUnits,
        requestUnits: requestUnits,
        note: note,
        timestamp: new Date().toISOString()
    };

    activeTradeAds.unshift(newTradeAd); // 최신 글을 맨 앞으로 추가
    
    // 배열이 너무 커지지 않도록 오래된 글 100개 제한 (DB 사용시 만료시간 TTL 설정 권장)
    if (activeTradeAds.length > 100) {
        activeTradeAds.pop();
    }

    res.status(201).json({ message: "성공적으로 등록되었습니다.", ad: newTradeAd });
});

app.listen(3000, () => {
    console.log('서버가 3000번 포트에서 실행 중입니다.');
});
