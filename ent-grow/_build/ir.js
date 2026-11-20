const pptxgen = require("pptxgenjs");

const BG = "0B1020";
const CARD = "161C33";
const CARD2 = "1E2542";
const TEXT = "EDF0FF";
const MUTED = "8B94B8";
const V = "7C5CFF";
const M = "00E0B8";
const P = "FF5C8A";
const Y = "FFC857";
const FONT = "Malgun Gothic";

const W = 13.333;
const H = 7.5;

const pres = new pptxgen();
pres.defineLayout({ name: "W16x9", width: W, height: H });
pres.layout = "W16x9";
pres.author = "ENT GROW";
pres.title = "ENT GROW IR Deck";

function base(title, kicker, no) {
  const s = pres.addSlide();
  s.background = { color: BG };
  // top accent line
  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.06, fill: { color: V }, line: { color: V },
  });
  if (kicker) {
    s.addText(kicker, {
      x: 0.72, y: 0.42, w: 8, h: 0.3,
      fontSize: 11, color: M, bold: true, charSpacing: 2, fontFace: FONT,
    });
  }
  s.addText(title, {
    x: 0.72, y: 0.72, w: 11.9, h: 0.75,
    fontSize: 30, color: TEXT, bold: true, fontFace: FONT,
  });
  // footer
  s.addText("ENT GROW  ·  IR DECK  ·  CONFIDENTIAL", {
    x: 0.72, y: 7.02, w: 8, h: 0.3,
    fontSize: 9, color: "5A6386", fontFace: FONT, charSpacing: 1,
  });
  s.addText(String(no).padStart(2, "0"), {
    x: 11.9, y: 6.98, w: 0.7, h: 0.35,
    fontSize: 12, color: V, bold: true, align: "right", fontFace: FONT,
  });
  return s;
}

function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: fill || CARD }, line: { color: "242C4D", width: 1 },
  });
}

/* ---------------- 01 COVER ---------------- */
{
  const s = pres.addSlide();
  s.background = { color: BG };

  // ambient shapes
  s.addShape(pres.ShapeType.ellipse, {
    x: 9.4, y: -2.2, w: 6.4, h: 6.4,
    fill: { color: V, transparency: 82 }, line: { color: V, transparency: 100 },
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: 11.2, y: 3.4, w: 3.6, h: 3.6,
    fill: { color: M, transparency: 88 }, line: { color: M, transparency: 100 },
  });
  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.14, h: H, fill: { color: V }, line: { color: V },
  });

  s.addText("ENT GROW", {
    x: 0.95, y: 1.75, w: 8, h: 1.1,
    fontSize: 62, bold: true, color: TEXT, fontFace: FONT, charSpacing: 1,
  });
  s.addText("엔터 그로우  |  IDOL TRAINEE DATA PLATFORM", {
    x: 0.98, y: 2.85, w: 9, h: 0.35,
    fontSize: 12, color: M, bold: true, fontFace: FONT, charSpacing: 2,
  });

  s.addText("연습생의 노력을 기록하고,\n그 기록을 데뷔의 기회로 바꿉니다.", {
    x: 0.95, y: 3.42, w: 9.6, h: 1.15,
    fontSize: 22, color: "C9D0EB", fontFace: FONT, lineSpacing: 34,
  });

  const chips = ["B2B2C", "성장 포트폴리오", "프리데뷔 데이터"];
  chips.forEach((c, i) => {
    const x = 0.95 + i * 2.25;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 4.95, w: 2.05, h: 0.42, rectRadius: 0.2,
      fill: { color: CARD }, line: { color: "2E3760", width: 1 },
    });
    s.addText(c, {
      x, y: 4.95, w: 2.05, h: 0.42,
      fontSize: 10.5, color: "A9B3D6", align: "center", valign: "middle", fontFace: FONT,
    });
  });

  s.addText("Grow in the dark.  Shine with data.", {
    x: 0.95, y: 5.85, w: 8, h: 0.4,
    fontSize: 15, italic: true, color: M, fontFace: FONT,
  });

  s.addText("사업계획서 v0.9   ·   2026. 11.", {
    x: 0.95, y: 6.55, w: 8, h: 0.3,
    fontSize: 10, color: "5A6386", fontFace: FONT,
  });
}

/* ---------------- 02 PROBLEM ---------------- */
{
  const s = base("데뷔까지 3~7년, 남는 기록은 0", "PROBLEM", 2);

  const stats = [
    ["3~7년", "데뷔까지 걸리는 연습 기간"],
    ["0건", "체계적으로 남는 성장 기록"],
    ["0명", "데뷔 전 확보 가능한 팬"],
  ];
  stats.forEach((st, i) => {
    const x = 0.72 + i * 4.1;
    card(s, x, 1.78, 3.8, 1.5);
    s.addText(st[0], {
      x: x + 0.32, y: 1.88, w: 3.2, h: 0.68,
      fontSize: 34, bold: true, color: [P, Y, M][i], fontFace: FONT,
    });
    s.addText(st[1], {
      x: x + 0.32, y: 2.62, w: 3.2, h: 0.4,
      fontSize: 11, color: MUTED, fontFace: FONT,
    });
  });

  const cols = [
    ["연습생", "노력의 비가시성", ["매일 6~10시간 연습, 기록은 남지 않음", "사진·영상은 폰과 메신저에 흩어져 유실", "평가는 단발성, 성장은 확인 불가"], P],
    ["팬", "응원할 대상의 부재", ["데뷔 전 연습생은 공식 채널이 없음", "응원하고 싶어도 방법과 피드백이 없음", "데뷔 후에는 초기 팬이 될 기회를 상실"], Y],
    ["엔터", "데이터 없는 스카우팅", ["연습생 정보가 엑셀·카톡에 분산", "스카우트는 인맥과 감에 의존", "이탈·번아웃 징후를 사전 감지 불가"], M],
  ];
  cols.forEach((c, i) => {
    const x = 0.72 + i * 4.1;
    card(s, x, 3.62, 3.8, 2.95, CARD);
    s.addShape(pres.ShapeType.rect, {
      x, y: 3.62, w: 0.07, h: 2.95, fill: { color: c[3] }, line: { color: c[3] },
    });
    s.addText(c[0], {
      x: x + 0.3, y: 3.82, w: 3.2, h: 0.35,
      fontSize: 11, bold: true, color: c[3], fontFace: FONT, charSpacing: 1,
    });
    s.addText(c[1], {
      x: x + 0.3, y: 4.16, w: 3.3, h: 0.4,
      fontSize: 15, bold: true, color: TEXT, fontFace: FONT,
    });
    c[2].forEach((t, j) => {
      s.addText("· " + t, {
        x: x + 0.3, y: 4.72 + j * 0.55, w: 3.3, h: 0.5,
        fontSize: 10.5, color: "A9B3D6", fontFace: FONT, lineSpacing: 15,
      });
    });
  });

  s.addText("노력은 존재하지만, 증명되지 않는다.", {
    x: 0.72, y: 6.72, w: 11.9, h: 0.3,
    fontSize: 12, bold: true, color: MUTED, align: "right", fontFace: FONT,
  });
}

/* ---------------- 03 SOLUTION ---------------- */
{
  const s = base("기록이 성장이 되고, 성장이 기회가 되는 구조", "SOLUTION", 3);

  const layers = [
    ["GROW", "연습생", ["연습 일지 · 사진/영상 보관", "스킬 트래킹 · 성장 포트폴리오"], V],
    ["FAN", "팬", ["공개 프로필 · 성장 타임라인", "응원 · 멤버십 · 후원"], P],
    ["PARTNER / SCOUT", "엔터테인먼트사", ["연습생 통합 관리 · 성장 리포트", "스카우트 검색 · 오디션 운영"], M],
  ];

  layers.forEach((l, i) => {
    const x = 0.72 + i * 4.1;
    card(s, x, 1.85, 3.8, 2.55);
    s.addShape(pres.ShapeType.roundRect, {
      x: x + 0.3, y: 2.05, w: 1.55, h: 0.36, rectRadius: 0.18,
      fill: { color: l[3], transparency: 78 }, line: { color: l[3], transparency: 40 },
    });
    s.addText(l[0], {
      x: x + 0.3, y: 2.05, w: 1.55, h: 0.36,
      fontSize: 10, bold: true, color: l[3], align: "center", valign: "middle", fontFace: FONT,
    });
    s.addText(l[1], {
      x: x + 0.3, y: 2.55, w: 3.2, h: 0.45,
      fontSize: 17, bold: true, color: TEXT, fontFace: FONT,
    });
    l[2].forEach((t, j) => {
      s.addText("· " + t, {
        x: x + 0.3, y: 3.12 + j * 0.52, w: 3.25, h: 0.45,
        fontSize: 11, color: "A9B3D6", fontFace: FONT,
      });
    });
  });

  // flow
  const flow = ["매일의 기록", "정량 지표", "성장 곡선", "스카우트 리포트"];
  flow.forEach((f, i) => {
    const x = 0.72 + i * 3.0;
    s.addShape(pres.ShapeType.chevron, {
      x, y: 4.85, w: 2.75, h: 0.72,
      fill: { color: i === 3 ? M : CARD2 },
      line: { color: i === 3 ? M : "2E3760", width: 1 },
    });
    s.addText(f, {
      x: x + 0.15, y: 4.85, w: 2.4, h: 0.72,
      fontSize: 12, bold: true, color: i === 3 ? BG : "C9D0EB",
      align: "center", valign: "middle", fontFace: FONT,
    });
  });

  card(s, 0.72, 5.95, 11.9, 0.72, CARD2);
  s.addText("데이터가 쌓일수록 스카우트 정확도와 팬 충성도가 함께 올라가는 양면 네트워크", {
    x: 0.98, y: 5.95, w: 11.4, h: 0.72,
    fontSize: 12.5, color: "C9D0EB", valign: "middle", fontFace: FONT,
  });
}

/* ---------------- 04 PRODUCT ---------------- */
{
  const s = base("성장 포트폴리오 + EGI 성장지수", "PRODUCT", 4);

  s.addText("파편이 자산이 되는 구조", {
    x: 0.72, y: 1.72, w: 5.5, h: 0.35,
    fontSize: 12, color: MUTED, fontFace: FONT,
  });

  const steps = [
    ["01", "매일의 기록", "사진 · 30초 영상 · 일지"],
    ["02", "정량 지표", "연습시간 · 스킬 · 팬 반응"],
    ["03", "성장 곡선", "기간별 변화율 · 마일스톤"],
    ["04", "스카우트 리포트", "PDF 포트폴리오 · 매칭 추천"],
  ];
  steps.forEach((st, i) => {
    const y = 2.18 + i * 1.12;
    card(s, 0.72, y, 5.0, 0.94);
    s.addText(st[0], {
      x: 0.95, y: y + 0.16, w: 0.6, h: 0.6,
      fontSize: 18, bold: true, color: V, fontFace: FONT,
    });
    s.addText(st[1], {
      x: 1.62, y: y + 0.13, w: 3.9, h: 0.36,
      fontSize: 13, bold: true, color: TEXT, fontFace: FONT,
    });
    s.addText(st[2], {
      x: 1.62, y: y + 0.49, w: 3.9, h: 0.32,
      fontSize: 10, color: MUTED, fontFace: FONT,
    });
  });

  // right panel EGI
  card(s, 6.15, 1.72, 6.45, 4.9, CARD2);
  s.addText("EGI  ·  ENT GROW Index", {
    x: 6.45, y: 1.92, w: 5.9, h: 0.35,
    fontSize: 12, bold: true, color: M, fontFace: FONT, charSpacing: 1,
  });
  s.addText("성장 가능성을 보여주는 합성 지수", {
    x: 6.45, y: 2.28, w: 5.9, h: 0.4,
    fontSize: 15, bold: true, color: TEXT, fontFace: FONT,
  });

  const egi = [
    ["성장률", 30, V],
    ["연습량", 25, "9A7CFF"],
    ["코치빌리티", 20, P],
    ["다양성", 15, Y],
    ["팬 반응", 10, M],
  ];
  egi.forEach((e, i) => {
    const y = 2.92 + i * 0.62;
    s.addText(e[0], {
      x: 6.45, y, w: 1.55, h: 0.32,
      fontSize: 10.5, color: "C9D0EB", fontFace: FONT,
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: 8.05, y: y + 0.08, w: 3.4, h: 0.16, rectRadius: 0.08,
      fill: { color: "2A3255" }, line: { color: "2A3255" },
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: 8.05, y: y + 0.08, w: 3.4 * (e[1] / 30), h: 0.16, rectRadius: 0.08,
      fill: { color: e[2] }, line: { color: e[2] },
    });
    s.addText(e[1] + "%", {
      x: 11.55, y, w: 0.8, h: 0.32,
      fontSize: 10, color: MUTED, align: "right", fontFace: FONT,
    });
  });

  s.addText("절대 실력 순위가 아닌 ‘성장 가능성’ 지표 · 팬에게는 구간으로만 노출", {
    x: 6.45, y: 6.05, w: 5.9, h: 0.4,
    fontSize: 9.5, color: MUTED, fontFace: FONT,
  });
}

/* ---------------- 05 MARKET ---------------- */
{
  const s = base("국내 연습생 데이터 시장은 아직 비어 있습니다", "MARKET", 5);

  const mk = [
    ["TAM", "3조 원", "글로벌 K-pop 팬덤 플랫폼 + 아티스트 관리 SaaS", 1.0, V],
    ["SAM", "2,000억 원", "국내 연습생 관리 + 프리데뷔 팬덤 + 스카우트", 0.55, "9A7CFF"],
    ["SOM", "300억 원", "3년 내 확보 가능 시장 (기획사 100곳 중심)", 0.25, M],
  ];
  mk.forEach((m, i) => {
    const y = 1.85 + i * 1.35;
    s.addText(m[0], {
      x: 0.72, y, w: 0.8, h: 0.4,
      fontSize: 13, bold: true, color: m[4], fontFace: FONT, charSpacing: 1,
    });
    s.addText(m[1], {
      x: 1.62, y: y - 0.06, w: 2.3, h: 0.5,
      fontSize: 20, bold: true, color: TEXT, fontFace: FONT,
    });
    s.addText(m[2], {
      x: 3.95, y: y + 0.04, w: 3.4, h: 0.5,
      fontSize: 9.5, color: MUTED, fontFace: FONT, lineSpacing: 13,
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: 7.5, y: y + 0.05, w: 5.1 * m[3], h: 0.34, rectRadius: 0.17,
      fill: { color: m[4], transparency: 25 }, line: { color: m[4], transparency: 100 },
    });
  });

  card(s, 0.72, 5.92, 11.9, 0.85, CARD2);
  s.addText("연습생 5,000~10,000명  ·  기획사 100~200곳  ·  프리데뷔 팬 50만~100만 명 (추정)", {
    x: 0.98, y: 5.92, w: 11.4, h: 0.85,
    fontSize: 12, color: "C9D0EB", valign: "middle", fontFace: FONT,
  });
}

/* ---------------- 06 BUSINESS MODEL ---------------- */
{
  const s = base("B2B2C — 기획사가 비용을 내고, 팬이 규모를 만든다", "BUSINESS MODEL", 6);

  const rows = [
    [{ text: "수익원", options: { bold: true, color: M, fontSize: 10 } },
     { text: "과금 방식", options: { bold: true, color: M, fontSize: 10 } },
     { text: "Y3 비중", options: { bold: true, color: M, fontSize: 10 } }],
    ["기획사 구독", "월정액 · 연습생 수 티어", "27%"],
    ["스카우트 열람·매칭", "열람권 / 성사 수수료", "12%"],
    ["팬 멤버십", "월 4,900원 구독", "35%"],
    ["후원·응원 수수료", "건별 10~15%", "17%"],
    ["커머스·광고·리포트", "수수료 / 광고비", "9%"],
  ];
  s.addTable(rows, {
    x: 0.72, y: 1.85, w: 5.9,
    colW: [2.2, 2.55, 1.15],
    rowH: 0.5,
    border: { type: "solid", color: "242C4D", pt: 1 },
    fill: { color: CARD },
    fontFace: FONT, fontSize: 10.5, color: "C9D0EB",
    valign: "middle",
  });

  const tiers = [
    ["PARTNER Pro", "월 49만 원", "연습생 100명 · 오디션 운영"],
    ["SCOUT", "월 29만 원", "검색 · 열람 20건"],
    ["FAN 멤버십", "월 4,900원", "전용 콘텐츠 · 응원 배지"],
  ];
  tiers.forEach((t, i) => {
    const y = 1.85 + i * 1.05;
    card(s, 6.95, y, 5.65, 0.9);
    s.addText(t[0], {
      x: 7.2, y: y + 0.13, w: 2.3, h: 0.32,
      fontSize: 12, bold: true, color: TEXT, fontFace: FONT,
    });
    s.addText(t[1], {
      x: 9.5, y: y + 0.1, w: 2.9, h: 0.36,
      fontSize: 15, bold: true, color: M, align: "right", fontFace: FONT,
    });
    s.addText(t[2], {
      x: 7.2, y: y + 0.52, w: 5.1, h: 0.28,
      fontSize: 9, color: MUTED, fontFace: FONT,
    });
  });

  const kpi = [["LTV/CAC", "4.0~4.9x"], ["회수 기간", "1.6~7.5개월"], ["Y3 ARR", "12억 원"]];
  kpi.forEach((k, i) => {
    const x = 6.95 + i * 1.9;
    card(s, x, 5.25, 1.8, 1.15, CARD2);
    s.addText(k[1], {
      x: x + 0.12, y: 5.42, w: 1.56, h: 0.42,
      fontSize: 14, bold: true, color: Y, align: "center", fontFace: FONT,
    });
    s.addText(k[0], {
      x: x + 0.12, y: 5.85, w: 1.56, h: 0.3,
      fontSize: 8.5, color: MUTED, align: "center", fontFace: FONT,
    });
  });

  s.addText("기획사는 관리 비용을, 팬은 응원을 지불한다. 기록은 무료로 쌓인다.", {
    x: 0.72, y: 5.55, w: 5.9, h: 0.8,
    fontSize: 12, color: "A9B3D6", fontFace: FONT, lineSpacing: 18,
  });
}

/* ---------------- 07 GTM ---------------- */
{
  const s = base("파일럿 → 확산 → 표준화 → 글로벌", "GO-TO-MARKET", 7);

  const phases = [
    ["2027 H1", "파일럿", "기획사 3곳\n연습생 100명", V],
    ["2027 H2", "검증", "기획사 10곳\n팬 1만 명", "9A7CFF"],
    ["2028", "확산", "기획사 40곳\n팬 8만 명", P],
    ["2029", "표준화", "기획사 100곳\n팬 30만 명", Y],
    ["2030~", "글로벌", "해외 레이블\n글로벌 팬", M],
  ];
  phases.forEach((p, i) => {
    const x = 0.72 + i * 2.42;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 2.0, w: 2.25, h: 2.35, rectRadius: 0.06,
      fill: { color: CARD }, line: { color: p[3], width: 1, transparency: 45 },
    });
    s.addText(p[0], {
      x: x + 0.2, y: 2.18, w: 1.9, h: 0.3,
      fontSize: 10, bold: true, color: p[3], fontFace: FONT, charSpacing: 1,
    });
    s.addText(p[1], {
      x: x + 0.2, y: 2.55, w: 1.9, h: 0.45,
      fontSize: 17, bold: true, color: TEXT, fontFace: FONT,
    });
    s.addText(p[2], {
      x: x + 0.2, y: 3.15, w: 1.9, h: 0.9,
      fontSize: 10, color: "A9B3D6", fontFace: FONT, lineSpacing: 15,
    });
    if (i < 4) {
      s.addShape(pres.ShapeType.triangle, {
        x: x + 2.28, y: 2.95, w: 0.12, h: 0.2, rotate: 90,
        fill: { color: "3A4470" }, line: { color: "3A4470" },
      });
    }
  });

  const ch = [
    ["기획사", "무료 파일럿 → 데이터 리포트 → 유료 전환"],
    ["연습생", "‘무료 포트폴리오 제작’ 훅 · 오디션 시즌 캠페인"],
    ["팬", "숏폼 성장 타임라인 · 응원 랭킹 이벤트"],
  ];
  ch.forEach((c, i) => {
    const x = 0.72 + i * 4.1;
    card(s, x, 4.72, 3.8, 1.15, CARD2);
    s.addText(c[0], {
      x: x + 0.25, y: 4.85, w: 1.2, h: 0.3,
      fontSize: 10, bold: true, color: M, fontFace: FONT,
    });
    s.addText(c[1], {
      x: x + 0.25, y: 5.18, w: 3.35, h: 0.55,
      fontSize: 10, color: "C9D0EB", fontFace: FONT, lineSpacing: 14,
    });
  });

  s.addText("첫 3곳의 레퍼런스가 나머지 97곳을 데려온다.", {
    x: 0.72, y: 6.35, w: 11.9, h: 0.35,
    fontSize: 12, bold: true, color: MUTED, align: "right", fontFace: FONT,
  });
}

/* ---------------- 08 COMPETITION ---------------- */
{
  const s = base("데뷔 ‘이전’을 다루는 곳은 없습니다", "COMPETITION", 8);

  // 2x2
  const ox = 0.72, oy = 1.95, ow = 6.1, oh = 4.6;
  s.addShape(pres.ShapeType.rect, {
    x: ox, y: oy, w: ow, h: oh,
    fill: { color: "10162B" }, line: { color: "2E3760", width: 1 },
  });
  s.addShape(pres.ShapeType.line, {
    x: ox + ow / 2, y: oy, w: 0, h: oh, line: { color: "2E3760", dashType: "dash" },
  });
  s.addShape(pres.ShapeType.line, {
    x: ox, y: oy + oh / 2, w: ow, h: 0, line: { color: "2E3760", dashType: "dash" },
  });

  s.addText("데뷔 이전", { x: ox - 0.05, y: oy + oh + 0.05, w: 2, h: 0.3, fontSize: 9, color: MUTED, fontFace: FONT });
  s.addText("데뷔 이후", { x: ox + ow - 1.3, y: oy + oh + 0.05, w: 1.3, h: 0.3, fontSize: 9, color: MUTED, align: "right", fontFace: FONT });
  s.addText("데이터·관리", { x: ox - 0.02, y: oy - 0.32, w: 1.6, h: 0.3, fontSize: 9, color: MUTED, fontFace: FONT });
  s.addText("관계·커뮤니티", { x: ox, y: oy + oh - 0.3, w: 2, h: 0.3, fontSize: 9, color: MUTED, fontFace: FONT });

  const dots = [
    ["위버스 · 버블", ox + 4.6, oy + 1.55, MUTED],
    ["유튜브 · 인스타", ox + 1.55, oy + 3.25, MUTED],
    ["오디션 앱", ox + 1.1, oy + 1.05, MUTED],
  ];
  dots.forEach((d) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: d[1], y: d[2], w: 0.12, h: 0.12, fill: { color: d[3] }, line: { color: d[3] },
    });
    s.addText(d[0], {
      x: d[1] + 0.18, y: d[2] - 0.1, w: 1.5, h: 0.3,
      fontSize: 8.5, color: "7F88AB", fontFace: FONT,
    });
  });

  s.addShape(pres.ShapeType.ellipse, {
    x: ox + 0.95, y: oy + 0.85, w: 0.2, h: 0.2, fill: { color: V }, line: { color: V },
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: ox + 0.79, y: oy + 0.69, w: 0.52, h: 0.52,
    fill: { color: V, transparency: 75 }, line: { color: V, transparency: 100 },
  });
  s.addText("ENT GROW", {
    x: ox + 1.4, y: oy + 0.8, w: 1.8, h: 0.36,
    fontSize: 12, bold: true, color: TEXT, fontFace: FONT,
  });

  // moat list
  card(s, 7.1, 1.95, 5.5, 4.85, CARD2);
  s.addText("방어 전략  ·  MOAT", {
    x: 7.35, y: 2.12, w: 5.0, h: 0.3,
    fontSize: 10, bold: true, color: M, fontFace: FONT, charSpacing: 2,
  });
  const moat = [
    ["데이터 복리", "1인 3년 기록은 후발주자가 복제 불가"],
    ["양면 네트워크", "연습생 ↑ → 팬 ↑ → 기획사 ↑"],
    ["승인 기반 공개", "무단 스카우트가 아닌 소속사 승인 모델"],
    ["표준화", "EGI가 업계 표준이 되면 전환 비용 급증"],
  ];
  moat.forEach((m, i) => {
    const y = 2.55 + i * 1.02;
    s.addText("0" + (i + 1), {
      x: 7.35, y, w: 0.55, h: 0.35,
      fontSize: 12, bold: true, color: V, fontFace: FONT,
    });
    s.addText(m[0], {
      x: 7.95, y: y - 0.02, w: 4.4, h: 0.32,
      fontSize: 12, bold: true, color: TEXT, fontFace: FONT,
    });
    s.addText(m[1], {
      x: 7.95, y: y + 0.3, w: 4.4, h: 0.4,
      fontSize: 9, color: MUTED, fontFace: FONT,
    });
  });
}

/* ---------------- 09 FINANCIALS ---------------- */
{
  const s = base("2031년 매출 71억 · 영업이익률 32%", "FINANCIALS", 9);

  const head = ["(백만 원)", "2027", "2028", "2029", "2030", "2031"];
  const rows = [
    ["매출", "50", "370", "1,200", "3,200", "7,100"],
    ["B2B", "32", "165", "480", "1,100", "2,200"],
    ["B2C", "18", "205", "720", "2,100", "4,900"],
    ["영업이익", "-450", "-900", "-1,300", "-460", "2,280"],
    ["누적 손익", "-450", "-1,350", "-2,650", "-3,110", "-830"],
  ];
  const trows = [
    head.map((h, i) => ({
      text: h,
      options: { bold: true, color: M, fontSize: 9.5, align: i === 0 ? "left" : "right" },
    })),
  ];
  rows.forEach((r, ri) => {
    trows.push(r.map((c, ci) => ({
      text: c,
      options: {
        color: ri === 0 ? TEXT : ri === 3 ? (ci === 0 ? P : P) : "C9D0EB",
        bold: ri === 0 || ri === 3,
        fontSize: 9.5,
        align: ci === 0 ? "left" : "right",
      },
    })));
  });
  s.addTable(trows, {
    x: 0.72, y: 1.95, w: 6.15,
    colW: [1.55, 0.92, 0.92, 0.92, 0.92, 0.92],
    rowH: 0.46,
    border: { type: "solid", color: "242C4D", pt: 1 },
    fill: { color: CARD },
    fontFace: FONT, valign: "middle",
  });

  s.addChart(pres.ChartType.bar, [{
    name: "매출",
    labels: ["2027", "2028", "2029", "2030", "2031"],
    values: [50, 370, 1200, 3200, 7100],
  }], {
    x: 7.0, y: 1.85, w: 5.7, h: 3.3,
    barDir: "col",
    chartColors: [V],
    showLegend: false,
    showValue: false,
    catAxisLabelColor: MUTED,
    valAxisLabelColor: MUTED,
    catAxisLabelFontSize: 9,
    valAxisLabelFontSize: 8,
    valGridLine: { color: "242C4D", size: 1 },
    catGridLine: { style: "none" },
    barGapWidthPct: 55,
    dataLabelColor: TEXT,
    dataLabelFontSize: 8,
  });
  s.addText("매출 추이 (백만 원)", {
    x: 7.0, y: 5.15, w: 5.6, h: 0.3,
    fontSize: 9, color: MUTED, align: "center", fontFace: FONT,
  });

  const fun = [
    ["Seed", "3억", "2027 Q1"],
    ["Pre-A", "14억", "2027 Q4"],
    ["Series A", "15억", "2029 Q1"],
  ];
  fun.forEach((f, i) => {
    const x = 0.72 + i * 2.05;
    card(s, x, 5.7, 1.9, 1.0, CARD2);
    s.addText(f[0], {
      x: x + 0.15, y: 5.8, w: 1.6, h: 0.26,
      fontSize: 8.5, color: MUTED, fontFace: FONT,
    });
    s.addText(f[1], {
      x: x + 0.15, y: 6.05, w: 1.6, h: 0.35,
      fontSize: 17, bold: true, color: Y, fontFace: FONT,
    });
    s.addText(f[2], {
      x: x + 0.15, y: 6.4, w: 1.6, h: 0.24,
      fontSize: 8, color: "7F88AB", fontFace: FONT,
    });
  });
  s.addText("총 32억 · 2031년 BEP 도달", {
    x: 7.0, y: 5.65, w: 5.7, h: 0.4,
    fontSize: 11, bold: true, color: MUTED, align: "right", fontFace: FONT,
  });
}

/* ---------------- 10 ASK ---------------- */
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.ShapeType.ellipse, {
    x: 8.8, y: -2.0, w: 6.2, h: 6.2,
    fill: { color: V, transparency: 84 }, line: { color: V, transparency: 100 },
  });
  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.06, fill: { color: M }, line: { color: M },
  });

  s.addText("ASK", {
    x: 0.95, y: 0.55, w: 4, h: 0.3,
    fontSize: 11, bold: true, color: M, fontFace: FONT, charSpacing: 3,
  });
  s.addText("32억 원으로\n3년의 데이터를 쌓겠습니다.", {
    x: 0.95, y: 0.95, w: 8.2, h: 1.5,
    fontSize: 32, bold: true, color: TEXT, fontFace: FONT, lineSpacing: 46,
  });

  const ms = [
    ["2027", "기획사 10곳 · 연습생 100명 · 팬 1만"],
    ["2028", "기획사 40곳 · 연습생 800명 · 팬 8만"],
    ["2029", "기획사 100곳 · 연습생 3,000명 · 팬 30만"],
  ];
  ms.forEach((m, i) => {
    const y = 2.85 + i * 0.72;
    s.addText(m[0], {
      x: 0.98, y, w: 0.85, h: 0.35,
      fontSize: 11, bold: true, color: V, fontFace: FONT,
    });
    s.addText(m[1], {
      x: 1.9, y, w: 6.0, h: 0.35,
      fontSize: 12, color: "C9D0EB", fontFace: FONT,
    });
  });

  card(s, 0.95, 5.3, 8.0, 0.95, CARD2);
  s.addText("“K-pop의 다음 3년은 데이터로 증명될 것입니다.”", {
    x: 1.2, y: 5.3, w: 7.5, h: 0.95,
    fontSize: 14, italic: true, color: M, valign: "middle", fontFace: FONT,
  });

  s.addText("ENT GROW  ·  엔터 그로우", {
    x: 9.5, y: 5.55, w: 3.2, h: 0.4,
    fontSize: 13, bold: true, color: TEXT, align: "right", fontFace: FONT,
  });
  s.addText("Grow in the dark. Shine with data.", {
    x: 9.5, y: 5.95, w: 3.3, h: 0.3,
    fontSize: 9, color: MUTED, align: "right", fontFace: FONT,
  });
  s.addText("감사합니다", {
    x: 9.5, y: 6.45, w: 3.3, h: 0.4,
    fontSize: 12, color: "7F88AB", align: "right", fontFace: FONT,
  });
}

pres.writeFile({ fileName: "IR_덱_ENT_GROW.pptx" }).then(() => {
  console.log("PPTX generated");
});
