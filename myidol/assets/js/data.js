/* =========================================================
   MY IDOL — demo dataset
   모든 인물·수치는 데모용 가상 데이터입니다.
   날짜는 접속일 기준으로 자동 계산되어 항상 "최신"으로 보입니다.
========================================================= */
window.MD = (function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const iso = (d) => {
    const x = new Date(d);
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  };
  const daysAgo = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return iso(d);
  };
  const daysFromNow = (n) => daysAgo(-n);

  // deterministic pseudo random
  function rand(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  }

  function series(target, totalDelta, n, seed, spread) {
    const r = rand(seed);
    const out = [];
    for (let i = 0; i < n; i++) {
      const p = i / (n - 1);
      const base = target - totalDelta * (1 - p);
      const noise = (r() - 0.5) * (spread || 2.2) * (i === n - 1 ? 0 : 1);
      out.push(Math.round((base + noise) * 10) / 10);
    }
    out[n - 1] = target;
    return out;
  }

  function heatmap(seed, base) {
    const r = rand(seed);
    const days = [];
    for (let i = 125; i >= 0; i--) {
      const off = r() > 0.16 ? 1 + Math.floor(r() * 3) : 0; // 0~3 intensity
      days.push({ date: daysAgo(i), level: off, hours: off === 0 ? 0 : base + off * 0.7 + r() * 0.8 });
    }
    return days;
  }

  const skillKeys = ["vocal", "dance", "rap", "expression", "stamina", "attitude"];
  const skillLabels = {
    vocal: "보컬",
    dance: "댄스",
    rap: "랩",
    expression: "표현",
    stamina: "체력",
    attitude: "성실성",
  };

  const trainees = [
    {
      id: "harin",
      name: "서하린",
      en: "SEO HARIN",
      initials: "SH",
      age: 19,
      position: "보컬",
      positions: ["보컬", "작사"],
      agency: "스타라이트 Ent.",
      years: 3,
      egi: 87.4,
      egiDelta: 4.2,
      fans: 12480,
      fansDelta: 820,
      colorA: "#D8FF4A",
      colorB: "#1B6B4F",
      art: 0,
      tagline: "3년의 새벽을, 소리로 증명하다.",
      bio: "매일 새벽 5시 보컬 룸에서 시작하는 연습생. 고음의 불안정을 3년간의 기록으로 하나씩 지워왔습니다. 지금은 데뷔를 앞두고 첫 자작 곡을 준비하고 있습니다.",
      tags: ["발라드", "고음", "자작곡", "새벽형"],
      skills: { vocal: 92, dance: 74, rap: 48, expression: 86, stamina: 79, attitude: 95 },
      fanSplit: [46, 31, 14, 9],
      milestones: [
        { d: 12, title: "월말평가 A등급", desc: "보컬 파트 1위 · 안정성 94점" },
        { d: 46, title: "첫 자작곡 데모 완성", desc: "‘새벽 5시’ 작사·작곡 참여" },
        { d: 98, title: "EGI 80 돌파", desc: "성장률 부문 상위 8%" },
      ],
    },
    {
      id: "doyun",
      name: "김도윤",
      en: "KIM DOYUN",
      initials: "DY",
      age: 21,
      position: "댄스",
      positions: ["댄스", "안무"],
      agency: "뉴웨이브 Ent.",
      years: 4,
      egi: 91.2,
      egiDelta: 2.1,
      fans: 18920,
      fansDelta: 1240,
      colorA: "#8B6CFF",
      colorB: "#241159",
      art: 1,
      tagline: "몸으로 말하는 사람. 무대의 0.5초를 설계합니다.",
      bio: "4년차 메인댄스 지망생. 직접 안무를 짜고 팀원의 동선까지 조율합니다. 카메라 앞에서의 표정과 호흡을 집요하게 연구하는 타입.",
      tags: ["힙합", "안무창작", "직캠", "리더형"],
      skills: { vocal: 68, dance: 96, rap: 71, expression: 88, stamina: 93, attitude: 90 },
      fanSplit: [38, 39, 15, 8],
      milestones: [
        { d: 8, title: "안무 크루전 우승", desc: "팀 ‘NOK’ · 8인 부문" },
        { d: 54, title: "직캠 100만 뷰", desc: "‘MIDNIGHT’ 1절 직캠" },
        { d: 120, title: "댄스 스킬 95 돌파", desc: "트레이너 평가 만장일치" },
      ],
    },
    {
      id: "chaewon",
      name: "이채원",
      en: "LEE CHAEWON",
      initials: "CW",
      age: 18,
      position: "랩",
      positions: ["랩", "작사"],
      agency: "스타라이트 Ent.",
      years: 2,
      egi: 78.6,
      egiDelta: 6.8,
      fans: 6140,
      fansDelta: 960,
      colorA: "#FF7A5C",
      colorB: "#421218",
      art: 2,
      tagline: "가장 빠르게 크는 중. 이번 분기 최고 상승폭.",
      bio: "랩을 시작한 지 2년. 노트 한 권을 항상 들고 다니며 일상의 문장을 벌스로 바꿉니다. 최근 EGI 상승폭이 전체 1위입니다.",
      tags: ["붐뱁", "작사", "다이어리", "성장주"],
      skills: { vocal: 64, dance: 82, rap: 90, expression: 79, stamina: 75, attitude: 88 },
      fanSplit: [52, 30, 12, 6],
      milestones: [
        { d: 5, title: "EGI +6.8 상승", desc: "전체 연습생 중 1위 상승폭" },
        { d: 33, title: "자작 랩 벌스 공개", desc: "‘골목의 온도’ 8마디" },
        { d: 88, title: "첫 랩 평가 1위", desc: "플로우·전달력 부문" },
      ],
    },
    {
      id: "sion",
      name: "박시온",
      en: "PARK SION",
      initials: "SI",
      age: 20,
      position: "댄스·보컬",
      positions: ["댄스", "보컬"],
      agency: "하이퍼리듬",
      years: 3,
      egi: 84.1,
      egiDelta: 3.4,
      fans: 9870,
      fansDelta: 540,
      colorA: "#7ED7FF",
      colorB: "#0D2A44",
      art: 3,
      tagline: "두 개의 언어로 무대를 채우는 올라운더.",
      bio: "춤과 노래를 동시에 다듬는 올라운더. 라이브에서 흔들리지 않는 호흡을 만들기 위해 인터벌 트레이닝을 병행합니다.",
      tags: ["올라운더", "라이브", "R&B", "체력왕"],
      skills: { vocal: 83, dance: 91, rap: 62, expression: 87, stamina: 88, attitude: 89 },
      fanSplit: [31, 41, 18, 10],
      milestones: [
        { d: 14, title: "듀엣 무대 공개", desc: "‘Slow Motion’ 라이브" },
        { d: 61, title: "체력 평가 1위", desc: "3분 무대 호흡 유지율 97%" },
        { d: 133, title: "보컬 파트 승격", desc: "서브 → 메인 보컬 후보" },
      ],
    },
    {
      id: "yujin",
      name: "한유진",
      en: "HAN YUJIN",
      initials: "YJ",
      age: 17,
      position: "보컬",
      positions: ["보컬"],
      agency: "뉴웨이브 Ent.",
      years: 2,
      egi: 82.0,
      egiDelta: 5.1,
      fans: 8320,
      fansDelta: 740,
      colorA: "#FFD166",
      colorB: "#3F2903",
      art: 0,
      tagline: "17세의 목소리로, 오래된 노래를 다시 씁니다.",
      bio: "고등학교와 연습을 병행하는 2년차. 매일 아침 30분씩 발성 워밍업을 기록합니다. 목소리의 결이 가장 또렷하다는 평가를 받습니다.",
      tags: ["R&B", "저음", "고등학생", "꾸준함"],
      skills: { vocal: 90, dance: 70, rap: 54, expression: 83, stamina: 74, attitude: 92 },
      fanSplit: [55, 27, 12, 6],
      milestones: [
        { d: 10, title: "‘봄의 끝’ 라이브 공개", desc: "무편집 원테이크" },
        { d: 42, title: "보컬 평가 2위", desc: "톤·감정 전달 부문" },
        { d: 105, title: "연습 300일 연속", desc: "하루 평균 4.2시간" },
      ],
    },
    {
      id: "haram",
      name: "정하람",
      en: "JUNG HARAM",
      initials: "HR",
      age: 22,
      position: "프로듀싱",
      positions: ["프로듀싱", "보컬"],
      agency: "하이퍼리듬",
      years: 5,
      egi: 88.9,
      egiDelta: 1.2,
      fans: 11050,
      fansDelta: 310,
      colorA: "#9BFFCE",
      colorB: "#0C3A31",
      art: 2,
      tagline: "5년의 기록을 트랙 위에 올립니다.",
      bio: "연습생이자 프로듀서. 다른 연습생의 데모 트랙을 편곡해주는 ‘팀의 스튜디오’. 데뷔보다 좋은 곡을 먼저 만들고 싶다고 말합니다.",
      tags: ["프로듀싱", "편곡", "신스", "5년차"],
      skills: { vocal: 81, dance: 66, rap: 73, expression: 84, stamina: 77, attitude: 94 },
      fanSplit: [24, 44, 22, 10],
      milestones: [
        { d: 20, title: "트랙 ‘미로’ 공개", desc: "편곡·믹싱 직접 참여" },
        { d: 74, title: "사내 프로듀싱상", desc: "하이퍼리듬 신인 트랙 부문" },
        { d: 150, title: "누적 편곡 20곡", desc: "동료 연습생 데모 포함" },
      ],
    },
    {
      id: "serin",
      name: "오세린",
      en: "OH SERIN",
      initials: "SR",
      age: 19,
      position: "연기·비주얼",
      positions: ["연기", "비주얼"],
      agency: "스타라이트 Ent.",
      years: 3,
      egi: 80.3,
      egiDelta: 2.7,
      fans: 7460,
      fansDelta: 450,
      colorA: "#FF9BC2",
      colorB: "#3C0E28",
      art: 1,
      tagline: "표정으로 말하는 법을 연습합니다.",
      bio: "카메라 앞에서의 표정과 시선을 연구하는 연기 지망생. 대본 리딩 영상을 꾸준히 올려 감정의 변화를 기록합니다.",
      tags: ["연기", "표정", "카메라", "모놀로그"],
      skills: { vocal: 72, dance: 68, rap: 51, expression: 94, stamina: 76, attitude: 87 },
      fanSplit: [34, 36, 20, 10],
      milestones: [
        { d: 7, title: "모놀로그 영상 공개", desc: "‘겨울 손님’ 3분" },
        { d: 49, title: "연기 평가 1위", desc: "표정·호흡 부문" },
        { d: 112, title: "단편 캠페인 출연", desc: "브랜드 웹 필름" },
      ],
    },
    {
      id: "iden",
      name: "최이든",
      en: "CHOI IDEN",
      initials: "ID",
      age: 20,
      position: "댄스",
      positions: ["댄스", "랩"],
      agency: "뉴웨이브 Ent.",
      years: 3,
      egi: 85.7,
      egiDelta: 3.9,
      fans: 10280,
      fansDelta: 670,
      colorA: "#C9B6FF",
      colorB: "#211046",
      art: 3,
      tagline: "에너지로 기억되는 무대를 만듭니다.",
      bio: "파워풀한 퍼포먼스가 강점. 최근에는 랩을 더해 무대의 폭을 넓히고 있습니다. 팀 분위기를 띄우는 역할을 맡습니다.",
      tags: ["파워댄스", "랩", "팀플레이어", "에너지"],
      skills: { vocal: 66, dance: 93, rap: 78, expression: 85, stamina: 91, attitude: 86 },
      fanSplit: [40, 34, 17, 9],
      milestones: [
        { d: 16, title: "릴레이 댄스 챌린지", desc: "팀 합동 · 12만 뷰" },
        { d: 58, title: "랩 파트 합류", desc: "‘RUN IT’ 2절" },
        { d: 126, title: "퍼포먼스 평가 1위", desc: "에너지·표현력 부문" },
      ],
    },
  ];

  const positions = ["전체", "보컬", "댄스", "랩", "프로듀싱", "연기"];

  trainees.forEach((t, i) => {
    t.egiSeries = series(t.egi, Math.max(3, t.egiDelta + 4.5), 12, 11 + i * 37, 2.1);
    t.fanSeries = series(t.fans, t.fansDelta * 4.2, 12, 93 + i * 13, t.fans * 0.012);
    t.heat = heatmap(5 + i * 19, 2.4 + (i % 3));
    t.milestones = t.milestones.map((m) => ({ ...m, date: daysAgo(m.d) }));
  });

  /* ---------------- posts ---------------- */
  const rawPosts = [
    ["harin", 1, "photo", "새벽 5시, 보컬 룸", "오늘도 가장 먼저 불을 켰습니다. 고음 구간 3번째 수정, 이제 흔들리지 않아요.", 3, ["보컬", "새벽연습"], 963],
    ["harin", 2, "video", "‘미스트’ 고음 파트 3차 수정", "0.5초 호흡을 바꿨더니 훨씬 편해졌습니다. 선생님 피드백 반영본.", 9, ["보컬", "피드백"], 2140, "00:42"],
    ["harin", 3, "photo", "월말평가 D-3, 스케줄 정리", "이번 주는 발성 2시간 + 곡 해석 1시간. 체력 관리를 위해 수면도 기록 중.", 15, ["루틴", "월말평가"], 741],
    ["doyun", 1, "video", "메인댄스 직캠 · 1절", "카메라 각도까지 계산해서 짠 동선입니다. 시선 처리 봐주세요.", 2, ["댄스", "직캠"], 4820, "01:12"],
    ["doyun", 2, "photo", "안무 회의실, 7시간째", "팀원들과 프리 chorus를 다시 짰습니다. 더 단순하게, 더 강하게.", 6, ["안무", "팀"], 1830],
    ["doyun", 3, "photo", "체력 훈련 후", "무대 3분을 버티는 건 결국 심폐지구력. 오늘도 완주.", 20, ["체력", "루틴"], 1102],
    ["chaewon", 1, "video", "자작 랩 벌스 공개", "골목에서 들은 소리들을 8마디로 옮겼습니다. 피드백 환영해요.", 4, ["랩", "작사"], 1670, "00:58"],
    ["chaewon", 2, "photo", "작사 노트 12페이지", "버려진 문장이 아깝지 않을 만큼 많이 썼습니다.", 11, ["작사", "노트"], 920],
    ["chaewon", 3, "photo", "첫 녹음, 첫 테이크", "긴장해서 목소리가 올라갔지만 그게 오늘의 기록.", 24, ["녹음", "첫경험"], 688],
    ["sion", 1, "photo", "듀엣 화음 맞추기", "서로의 숨소리까지 맞춰보는 중. 라이브에서 티가 안 났으면.", 5, ["보컬", "듀엣"], 704],
    ["sion", 2, "video", "프리스타일 댄스 세션", "정해진 안무 없이 4분. 몸이 기억하는 것들.", 12, ["댄스", "프리스타일"], 1520, "01:04"],
    ["sion", 3, "photo", "스튜디오 B의 오후", "인터벌 3세트 후 마지막 녹음. 목소리가 젖어 있어요.", 18, ["스튜디오", "루틴"], 611],
    ["yujin", 1, "photo", "고음 워밍업 30분", "매일 같은 시간, 같은 루틴. 이게 제일 어렵습니다.", 2, ["보컬", "루틴"], 1230],
    ["yujin", 2, "video", "‘봄의 끝’ 라이브", "무편집 원테이크입니다. 숨소리까지 들어보세요.", 8, ["라이브", "R&B"], 2890, "00:39"],
    ["yujin", 3, "photo", "레슨 노트", "선생님이 남긴 한 줄 — ‘힘을 빼고, 문장을 말하듯이.’", 16, ["레슨", "노트"], 840],
    ["haram", 1, "photo", "편곡 작업실", "신스를 지우고 기타를 남겼더니 훨씬 따뜻해졌습니다.", 3, ["프로듀싱", "편곡"], 1360],
    ["haram", 2, "video", "트랙 ‘미로’ 프리뷰", "후렴만 먼저 공개합니다. 보컬은 유진이 불러줬어요.", 10, ["프로듀싱", "신곡"], 2210, "00:33"],
    ["haram", 3, "photo", "신디사이저 세팅", "밤 11시, 제일 집중이 잘 되는 시간.", 21, ["스튜디오", "야간"], 990],
    ["serin", 1, "photo", "대본 리딩, 세 번째", "같은 장면을 세 번 다르게 읽어봤습니다. 어느 게 저일까요.", 4, ["연기", "리딩"], 730],
    ["serin", 2, "video", "모놀로그 ‘겨울 손님’", "3분간 카메라를 한 번도 피하지 않았습니다.", 9, ["연기", "모놀로그"], 1580, "00:47"],
    ["serin", 3, "photo", "촬영장 비하인드", "조명 아래서 표정 근육 하나하나 확인하는 중.", 19, ["촬영", "비하인드"], 640],
    ["iden", 1, "video", "릴레이 댄스 챌린지", "팀원 5명이서 하루 만에 완성. 마지막에 다 같이 넘어졌습니다.", 1, ["댄스", "챌린지"], 3120, "00:51"],
    ["iden", 2, "photo", "팀 연습, 거울 앞에서", "동선이 겹치는 구간을 30번 넘게 반복했어요.", 7, ["팀", "연습"], 980],
    ["iden", 3, "photo", "개인 연습 후", "에너지를 아끼는 법도 연습이더라고요.", 17, ["루틴", "체력"], 755],
  ];

  const posts = rawPosts.map(([traineeId, n, type, title, caption, ago, tags, likes, duration], idx) => ({
    id: `${traineeId}-${n}`,
    traineeId,
    type,
    title,
    caption,
    date: daysAgo(ago),
    tags,
    likes: likes + idx * 3,
    duration: duration || null,
    media: null, // user uploaded data url
  }));

  /* ---------------- comments (seed) ---------------- */
  const seedComments = {
    "harin-1": [
      { author: "민지", role: "fan", text: "새벽 5시라니… 이 기록이 제 하루의 시작이 됩니다.", date: daysAgo(2) },
      { author: "스타라이트 A&R", role: "ent", text: "3번째 테이크의 톤이 좋습니다. 다음 곡도 기대할게요.", date: daysAgo(1) },
    ],
    "harin-2": [
      { author: "윤슬", role: "fan", text: "호흡 바뀐 게 들려요. 고음이 훨씬 편안해졌어요!", date: daysAgo(7) },
      { author: "민지", role: "fan", text: "이 영상 100번 봤습니다. 월말평가 응원할게요 🔥", date: daysAgo(6) },
    ],
    "doyun-1": [
      { author: "댄스리듬", role: "fan", text: "시선 처리가 진짜 미쳤다… 0.5초 설계 맞네요.", date: daysAgo(1) },
    ],
    "yujin-2": [
      { author: "봄", role: "fan", text: "숨소리까지 감정이라니. 원테이크 최고예요.", date: daysAgo(7) },
      { author: "민지", role: "fan", text: "17살이 이걸 부른다고? 내일도 응원할게요.", date: daysAgo(6) },
    ],
    "chaewon-1": [
      { author: "골목", role: "fan", text: "벌스 진짜 좋아요. 다음 화도 기다립니다.", date: daysAgo(3) },
    ],
    "haram-2": [
      { author: "스타라이트 A&R", role: "ent", text: "편곡 방향성 좋습니다. 풀 버전 받아볼 수 있을까요?", date: daysAgo(8) },
    ],
    "iden-1": [
      { author: "파워", role: "fan", text: "마지막에 다 같이 넘어진 거 웃기고 좋아요 ㅋㅋ", date: daysAgo(1) },
    ],
  };

  /* ---------------- events ---------------- */
  const events = [
    {
      id: "next-stage",
      badge: "LIVE",
      title: "NEXT STAGE · 12월 월말평가",
      date: daysFromNow(12),
      offset: 12,
      desc: "연습생 24명의 3개월 성장을 한 무대에서 확인하세요. 팬 투표 30%가 최종 평가에 반영됩니다.",
      meta: "온라인 생중계 · 20:00",
      accent: "lime",
      featured: true,
    },
    {
      id: "setlist",
      badge: "VOTE",
      title: "첫 무대 셋리스트 팬 투표",
      date: daysFromNow(5),
      offset: 5,
      desc: "데뷔 쇼케이스에서 보고 싶은 무대를 골라주세요. 관심 연습생에게 투표할 수 있습니다.",
      meta: "팬 멤버십 전용",
      accent: "coral",
    },
    {
      id: "scout-day",
      badge: "B2B",
      title: "SCOUT DAY 2026",
      date: daysFromNow(30),
      offset: 30,
      desc: "38개 기획사 A&R이 참여하는 스카우트 매칭 데이. 성장 리포트와 팬 데이터를 함께 검토합니다.",
      meta: "파트너 기획사 · 초청제",
      accent: "violet",
    },
    {
      id: "audition",
      badge: "OPEN",
      title: "신규 연습생 공개 오디션",
      date: daysFromNow(21),
      offset: 21,
      desc: "보컬·댄스·랩 전 포지션. 데뷔 전의 기록을 함께 쌓을 12기를 찾습니다.",
      meta: "온라인 접수 · 11월 30일 마감",
      accent: "sky",
    },
  ];

  /* ---------------- plans ---------------- */
  const plans = [
    {
      id: "fan",
      role: "fan",
      name: "FAN",
      kr: "팬 멤버십",
      desc: "데뷔 전부터 응원하고, 가장 먼저 기록을 봅니다.",
      monthly: 4900,
      yearly: 49000,
      features: ["관심 연습생 무제한", "사진·영상 전체 열람", "응원 하트·댓글", "멤버십 전용 비하인드", "월간 응원 배지"],
      cta: "팬으로 시작하기",
      accent: "plain",
    },
    {
      id: "grow",
      role: "trainee",
      name: "GROW PRO",
      kr: "연습생",
      desc: "매일의 기록이 하나의 성장 포트폴리오가 됩니다.",
      monthly: 9900,
      yearly: 99000,
      features: ["사진·영상 무제한 보관", "성장 포트폴리오 PDF", "주간 EGI 리포트", "공개 범위 세밀 설정", "팬 댓글·응원 수신"],
      cta: "연습생으로 시작하기",
      accent: "featured",
      badge: "가장 많이 선택",
    },
    {
      id: "partner",
      role: "ent",
      name: "PARTNER",
      kr: "기획사",
      desc: "소속 연습생의 성장과 팬 반응을 한 화면에서.",
      monthly: 190000,
      yearly: 1900000,
      features: ["연습생 20명 관리", "통합 대시보드·팬 지표", "성장 리포트 자동 생성", "권한 기반 공개 관리", "담당 매니저 배정"],
      cta: "기획사 문의하기",
      accent: "plain",
    },
    {
      id: "scout",
      role: "ent",
      name: "SCOUT",
      kr: "스카우트",
      desc: "감이 아니라 데이터로, 데뷔 전 인재를 찾습니다.",
      monthly: 290000,
      yearly: 2900000,
      features: ["프로필 검색 무제한", "상세 열람 20건 / 월", "EGI 원점수·성장 곡선", "스카우트 메모·PDF", "매칭 추천 알고리즘"],
      cta: "스카우트 시작하기",
      accent: "plain",
    },
  ];

  /* ---------------- faq ---------------- */
  const faqs = [
    {
      q: "연습생이 아니어도 둘러볼 수 있나요?",
      a: "네. 메인과 연습생 둘러보기, 공개 프로필은 로그인 없이 볼 수 있습니다. 응원·댓글·관심 등록은 팬 계정이 필요합니다.",
    },
    {
      q: "연습 기록의 공개 범위는 어떻게 정하나요?",
      a: "기록마다 ‘팬 공개 / 소속사만 / 비공개’를 선택할 수 있습니다. EGI 원점수는 소속사에만 제공되고, 팬에게는 구간으로만 노출됩니다.",
    },
    {
      q: "동영상은 얼마나 보관되나요?",
      a: "GROW PRO 기준 원본 화질로 무제한 보관됩니다. 데모 사이트에서는 브라우저 저장 공간을 사용하므로 대용량 파일을 계속 보관하려면 실제 서비스가 필요합니다.",
    },
    {
      q: "기획사는 어떤 데이터를 볼 수 있나요?",
      a: "성장 곡선, 연습량, 스킬 변화, 팬 수·연령 분포, 응원 반응을 볼 수 있습니다. 민감 속성(외모·체형 등)은 평가 지표에서 제외됩니다.",
    },
    {
      q: "데모 계정과 실제 결제는 어떻게 되나요?",
      a: "이 사이트는 포트폴리오용 데모입니다. 모든 계정은 가상이며 결제가 발생하지 않습니다.",
    },
  ];

  const stats = { trainees: 1284, agencies: 38, records: 92410, fans: 184200 };

  return {
    today,
    iso,
    daysAgo,
    daysFromNow,
    trainees,
    posts,
    seedComments,
    events,
    plans,
    faqs,
    stats,
    positions,
    skillKeys,
    skillLabels,
    getTrainee(id) {
      return trainees.find((t) => t.id === id) || trainees[0];
    },
    postsOf(id) {
      return posts.filter((p) => p.traineeId === id);
    },
  };
})();
