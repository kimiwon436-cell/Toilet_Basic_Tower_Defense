const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'trades.json');

// 저장된 거래 글 불러오기
function loadTrades() {
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
        return [];
    }
}

// 거래 글 영구 저장하기
function saveTrades(trades) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(trades, null, 2), 'utf8');
}

// 1. 거래 글 목록 조회 API
app.get('/api/trades', (req, res) => {
    const trades = loadTrades();
    res.json(trades);
});

// 2. 새 거래 글 작성 API
app.post('/api/trades', (req, res) => {
    const { username, avatar, profileUrl, offerUnits, requestUnits, note } = req.body;

    if (!username || !profileUrl) {
        return res.status(400).json({ error: "로블록스 정보가 부족합니다." });
    }

    const trades = loadTrades();
    const newTrade = {
        id: Date.now(),
        username,
        avatar: avatar || "https://tr.rbxcdn.com/15053a479bba760317e08cdce013143c/150/150/AvatarHeadshot/Png",
        profileUrl, // 로블록스 팔로우/프로필 링크
        offerUnits: offerUnits || [],
        requestUnits: requestUnits || [],
        note: note || "",
        time: "방금 전"
    };

    trades.unshift(newTrade);
    if (trades.length > 100) trades.pop(); // 최대 100개 유지
    saveTrades(trades);

    res.status(201).json({ message: "성공적으로 등록되었습니다.", ad: newTrade });
});

app.listen(3000, () => {
    console.log('백엔드 서버가 3000번 포트에서 실행 중입니다.');
});
