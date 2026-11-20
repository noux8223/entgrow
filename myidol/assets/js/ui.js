/* =========================================================
   MY IDOL — shared UI toolkit
========================================================= */
window.U = (function () {
  /* ---------------- helpers ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const num = (n) => Number(n || 0).toLocaleString("ko-KR");

  function fans(n) {
    n = Number(n || 0);
    if (n >= 10000) {
      const v = n / 10000;
      return (v >= 10 ? v.toFixed(0) : v.toFixed(1)) + "만";
    }
    return num(n);
  }

  const dateKo = (iso) => String(iso || "").replace(/-/g, ".");

  function rel(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const diff = Math.round((t - d) / 86400000);
    if (diff <= 0) return "오늘";
    if (diff === 1) return "어제";
    if (diff < 7) return diff + "일 전";
    if (diff < 30) return Math.floor(diff / 7) + "주 전";
    return dateKo(iso).slice(5);
  }

  function dday(iso) {
    const d = new Date(iso + "T00:00:00");
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const diff = Math.ceil((d - t) / 86400000);
    if (diff === 0) return "D-DAY";
    return diff > 0 ? "D-" + diff : "D+" + Math.abs(diff);
  }

  function weekLabels(n) {
    const arr = [];
    const d = new Date();
    d.setDate(d.getDate() - 7 * (n - 1));
    for (let i = 0; i < n; i++) {
      arr.push(`${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}`);
      d.setDate(d.getDate() + 7);
    }
    return arr;
  }

  const roleName = (r) => ({ trainee: "연습생", fan: "팬", ent: "엔터" }[r] || "게스트");
  const initial = (name) => (name || "?").trim().slice(0, 1);

  /* ---------------- icons ---------------- */
  const ICONS = {
    arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    down: '<path d="M12 4v15M6 13l6 6 6-6"/>',
    up: '<path d="M12 20V4M6 10l6-6 6 6"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
    comment: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.7-.8L3 21l1.9-5.4A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z"/>',
    play: '<path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>',
    spark: '<path d="M12 3l2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3z"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    download: '<path d="M12 3v12M7 11l5 5 5-5M4 21h16"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    upload: '<path d="M12 16V4M8 8l4-4 4 4"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M10.3 21a2 2 0 0 0 3.4 0"/>',
    users: '<circle cx="9" cy="8" r="3.4"/><path d="M2 21c0-3.6 3.2-6 7-6s7 2.4 7 6"/><path d="M17 4.5a3.4 3.4 0 0 1 0 7M18 15c2.4.7 4 2.7 4 5"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/>',
    external: '<path d="M14 3h7v7M10 14 21 3M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    video: '<rect x="2" y="5" width="14" height="14" rx="2"/><path d="m22 7-6 5 6 5z"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
    activity: '<path d="M22 12h-4l-3 8-6-16-3 8H2"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"/>',
  };

  function icon(name, cls = "") {
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
  }

  /* ---------------- cover artwork ---------------- */
  function hash(str) {
    let h = 0;
    str = String(str || "myidol");
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function art(t, opts = {}) {
    const post = opts.post || null;
    const variant = opts.variant != null ? opts.variant : t.art || 0;
    const rot = (variant * 21 + (post ? hash(post.id) % 46 : 0)) + "deg";
    const hasMedia = post && post.media;
    const name = opts.name === false ? "" : t.name;
    const meta = opts.meta === false ? "" : `
      <div class="art-top">
        <span>MY IDOL / ${post ? (post.type === "video" ? "MOTION" : "FRAME") : "TRAINEE"}</span>
        <span>${t.egi ? "EGI " + t.egi : ""}</span>
      </div>`;
    const bottom = opts.name === false ? "" : `
      <div class="art-bottom">
        <div>
          <div class="art-name">${esc(name)}</div>
          <div class="art-sub">${esc(t.position || "")} · ${t.years || 1}년차</div>
        </div>
        <div class="art-chip">
          <span>FANS</span>
          <b>${fans(t.fans)}</b>
        </div>
      </div>`;

    return `<div class="art${hasMedia ? " has-media" : ""}" style="--a:${t.colorA};--b:${t.colorB};--rot:${rot}">
      ${hasMedia ? `<img class="art-media" src="${post.media}" alt="${esc(post.title || "기록 이미지")}">` : ""}
      <div class="art-beam"></div>
      <div class="art-grid"></div>
      <div class="art-rings"><i></i><i></i><i></i></div>
      <div class="art-dots"></div>
      <div class="art-glyph ${variant % 2 ? "solid" : ""}">
        <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <text x="80" y="88" text-anchor="middle">${esc(t.initials || "")}</text>
        </svg>
      </div>
      <div class="art-noise"></div>
      <div class="art-scrim"></div>
      ${meta}
      ${bottom}
    </div>`;
  }

  /* ---------------- charts ---------------- */
  function smoothPath(pts) {
    if (!pts.length) return "";
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  }

  function lineChart(values, opts = {}) {
    const w = 600;
    const h = opts.height || 190;
    const padL = 6;
    const padR = 6;
    const padT = 18;
    const padB = opts.labels ? 26 : 10;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const id = "g" + Math.random().toString(36).slice(2, 8);
    const pts = values.map((v, i) => ({
      x: padL + (i / (values.length - 1)) * (w - padL - padR),
      y: padT + (1 - (v - min) / range) * (h - padT - padB),
      v,
    }));
    const d = smoothPath(pts);
    const area = `${d} L${pts[pts.length - 1].x},${h - padB} L${pts[0].x},${h - padB} Z`;
    const gridCount = 3;
    let grid = "";
    for (let i = 0; i <= gridCount; i++) {
      const y = padT + (i / gridCount) * (h - padT - padB);
      grid += `<line class="chart-grid-line" x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
    }
    let labels = "";
    if (opts.labels) {
      const step = Math.ceil(values.length / 6);
      opts.labels.forEach((lab, i) => {
        if (i % step && i !== values.length - 1) return;
        labels += `<text class="chart-axis-label" x="${pts[i].x}" y="${h - 6}" text-anchor="${i === 0 ? "start" : i === values.length - 1 ? "end" : "middle"}">${esc(lab)}</text>`;
      });
    }
    const last = pts[pts.length - 1];
    return `<div class="chart">
      <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="성장 지수 추이">
        <defs>
          <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${opts.color || "#d8ff4a"}" stop-opacity=".26"/>
            <stop offset="100%" stop-color="${opts.color || "#d8ff4a"}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${grid}
        <path d="${area}" fill="url(#${id})"/>
        <path class="chart-line draw" style="--line-color:${opts.color || "#d8ff4a"}" d="${d}"/>
        <circle class="chart-dot hot" cx="${last.x}" cy="${last.y}" r="3.6"/>
        <circle class="chart-dot" cx="${last.x}" cy="${last.y}" r="7" opacity=".28"/>
      </svg>
      ${labels ? `<div class="chart-foot"><span>${esc(opts.footLeft || "12 WEEKS AGO")}</span><span>${esc(opts.footRight || "NOW")}</span></div>` : ""}
    </div>`;
  }

  function spark(values, color) {
    const w = 120;
    const h = 40;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const pts = values.map((v, i) => ({ x: (i / (values.length - 1)) * w, y: 4 + (1 - (v - min) / range) * (h - 8) }));
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
      <path d="${smoothPath(pts)}" fill="none" stroke="${color || "#d8ff4a"}" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>
    </svg>`;
  }

  function radar(skills, labels) {
    const keys = Object.keys(skills);
    const cx = 160;
    const cy = 160;
    const R = 112;
    const n = keys.length;
    const angle = (i) => (-Math.PI / 2) + (i * 2 * Math.PI) / n;
    const point = (i, r) => ({ x: cx + Math.cos(angle(i)) * r, y: cy + Math.sin(angle(i)) * r });
    let rings = "";
    [0.25, 0.5, 0.75, 1].forEach((f) => {
      const pts = keys.map((_, i) => point(i, R * f));
      rings += `<polygon points="${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}" fill="none" stroke="rgba(255,255,255,.09)" stroke-width="1"/>`;
    });
    let axes = "";
    let labelsHtml = "";
    keys.forEach((k, i) => {
      const p = point(i, R);
      axes += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="rgba(255,255,255,.07)"/>`;
      const lp = point(i, R + 30);
      const anchor = Math.abs(lp.x - cx) < 8 ? "middle" : lp.x > cx ? "start" : "end";
      labelsHtml += `<text x="${lp.x}" y="${lp.y + 3}" text-anchor="${anchor}" fill="#9c9ca6" font-size="9" font-family="JetBrains Mono, monospace">${esc(labels[k] || k)}</text>`;
      const vp = point(i, (skills[k] / 100) * R);
      labelsHtml += `<text x="${vp.x}" y="${vp.y - 5}" text-anchor="middle" fill="#d8ff4a" font-size="8.5" font-family="JetBrains Mono, monospace">${skills[k]}</text>`;
    });
    const poly = keys.map((k, i) => point(i, (skills[k] / 100) * R));
    return `<div class="radar">
      <svg viewBox="0 0 320 320" role="img" aria-label="스킬 레이더">
        ${rings}${axes}
        <polygon points="${poly.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}" fill="rgba(216,255,74,.14)" stroke="#d8ff4a" stroke-width="1.6" stroke-linejoin="round"/>
        ${poly.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.4" fill="#0f0f13" stroke="#d8ff4a" stroke-width="1.4"/>`).join("")}
        ${labelsHtml}
      </svg>
    </div>`;
  }

  function heatmap(heat) {
    return `<div class="heat-wrap">
      <div class="heat">${heat.map((d) => `<i class="l${d.level}" title="${dateKo(d.date)} · ${d.hours ? d.hours.toFixed(1) + "시간" : "휴식"}"></i>`).join("")}</div>
    </div>
    <div class="heat-legend">
      <span>적음</span>
      <i style="background:rgba(255,255,255,.06)"></i>
      <i class="l1" style="background:rgba(216,255,74,.2)"></i>
      <i class="l2" style="background:rgba(216,255,74,.45)"></i>
      <i class="l3" style="background:rgba(216,255,74,.78)"></i>
      <span>많음</span>
      <span style="margin-left:auto">최근 18주</span>
    </div>`;
  }

  /* ---------------- post card ---------------- */
  function postCard(post, opts = {}) {
    if (!post) return "";
    const t = Store.trainee(post.traineeId);
    const isVideo = post.type === "video";
    return `<article class="post-card" data-post="${esc(post.id)}" tabindex="0" role="button" aria-label="${esc(post.title)} 열기">
      <div class="pc-art">
        ${art(t, { post })}
        <span class="pc-type-badge">${isVideo ? "VIDEO" : "PHOTO"}</span>
        ${isVideo ? `<span class="pc-play">${icon("play")}</span>` : ""}
        ${opts.deletable ? `<button class="pc-del" data-del="${esc(post.id)}" title="삭제" aria-label="기록 삭제">${icon("trash")}</button>` : ""}
      </div>
      <div class="pc-body">
        <span class="type">${opts.showAuthor === false ? (isVideo ? "영상" : "사진") : esc(t.name) + " · " + (isVideo ? "영상" : "사진")}</span>
        <b>${esc(post.title)}</b>
        <div class="pc-meta">
          <span>${icon("heart")}${num(Store.likeCount(post))}</span>
          <span>${icon("comment")}${Store.commentCount(post.id)}</span>
          <span style="margin-left:auto">${rel(post.date)}</span>
        </div>
      </div>
    </article>`;
  }

  /* ---------------- modal ---------------- */
  function modalRoot() {
    let root = $("#modalRoot");
    if (!root) {
      root = document.createElement("div");
      root.id = "modalRoot";
      root.className = "modal-root";
      root.innerHTML = `<div class="modal-backdrop" data-close></div><div class="modal" role="dialog" aria-modal="true"></div>`;
      document.body.appendChild(root);
      root.addEventListener("click", (e) => {
        if (e.target.closest("[data-close]")) closeModal();
      });
    }
    return root;
  }

  function openModal(html, opts = {}) {
    const root = modalRoot();
    const box = $(".modal", root);
    box.className = "modal" + (opts.className ? " " + opts.className : "");
    box.innerHTML = `<button class="modal-close" data-close aria-label="닫기">${icon("close")}</button>${html}`;
    root.classList.add("open");
    document.body.classList.add("no-scroll");
    if (opts.onOpen) opts.onOpen(box);
    setTimeout(() => {
      const f = box.querySelector("input, textarea, select, button:not(.modal-close)");
      if (f && opts.focus !== false) f.focus({ preventScroll: true });
    }, 120);
  }

  function closeModal() {
    const root = $("#modalRoot");
    if (!root) return;
    root.classList.remove("open");
    document.body.classList.remove("no-scroll");
    if (typeof root._onClose === "function") {
      const fn = root._onClose;
      root._onClose = null;
      fn();
    }
  }

  function toast(msg) {
    let root = $("#toastRoot");
    if (!root) {
      root = document.createElement("div");
      root.id = "toastRoot";
      root.className = "toast-root";
      document.body.appendChild(root);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<i></i><span>${esc(msg)}</span>`;
    root.appendChild(el);
    setTimeout(() => {
      el.classList.add("out");
      setTimeout(() => el.remove(), 320);
    }, 2800);
  }

  /* ---------------- auth ---------------- */
  const DEMO = {
    trainee: { name: "서하린", email: "harin@myidol.kr", traineeId: "harin", org: "스타라이트 Ent." },
    fan: { name: "김민지", email: "fan@myidol.kr", org: "FAN MEMBERSHIP" },
    ent: { name: "이준호", email: "scout@myidol.kr", org: "스타라이트 Ent. · A&R" },
  };

  const ROLES = [
    { id: "trainee", label: "연습생", desc: "기록·포트폴리오", icon: "spark" },
    { id: "fan", label: "팬", desc: "응원·소식 받기", icon: "heart" },
    { id: "ent", label: "엔터", desc: "스카우트·팬 분석", icon: "building" },
  ];

  function completeLogin(session) {
    toast(`${session.name}님, 환영합니다`);
    setTimeout(() => {
      const dest = session.role + ".html";
      location.href = dest;
    }, 380);
  }

  function loginDemo(role, dest) {
    const d = DEMO[role];
    const s = Store.login({ role, name: d.name, email: d.email, org: d.org, traineeId: d.traineeId || null, demo: true });
    if (dest) {
      toast(`${d.name}님으로 입장합니다`);
      setTimeout(() => (location.href = dest), 300);
      return s;
    }
    completeLogin(s);
    return s;
  }

  function openAuth(opts = {}) {
    let role = opts.role || "fan";
    let signup = !!opts.signup;

    const render = () => {
      const demo = DEMO[role];
      const html = `
        <h3>MY IDOL 시작하기</h3>
        <p class="sub">역할을 선택하면 맞춤 대시보드로 이동합니다.<br>데모 계정은 비밀번호 없이 바로 체험할 수 있어요.</p>
        <div class="auth-roles" id="authRoles">
          ${ROLES.map(
            (r) => `<button type="button" class="auth-role ${r.id === role ? "on" : ""}" data-role="${r.id}">
              ${icon(r.icon)}<b>${r.label}</b><span>${r.desc}</span>
            </button>`
          ).join("")}
        </div>
        <form class="auth-form" id="authForm" novalidate>
          ${signup ? `<div class="field"><label for="authName">이름</label><input id="authName" class="input" placeholder="활동명 또는 이름" autocomplete="name"></div>` : ""}
          <div class="field">
            <label for="authEmail">이메일</label>
            <input id="authEmail" class="input" type="email" value="${signup ? "" : demo.email}" placeholder="you@example.com" autocomplete="email">
          </div>
          <div class="field">
            <label for="authPw">비밀번호</label>
            <input id="authPw" class="input" type="password" value="demo1234" placeholder="4자 이상" autocomplete="current-password">
          </div>
          <p class="error" id="authError" style="display:none;margin-top:-4px"></p>
          <button class="btn btn-primary btn-block" type="submit" id="authSubmit">${signup ? "회원가입" : "로그인"}</button>
        </form>
        <button class="auth-switch" id="authSwitch">${signup ? "이미 계정이 있나요? 로그인" : "계정이 없나요? 회원가입"}</button>
        ${signup ? "" : `<div class="auth-note">${icon("spark")}<div><b>체험용 데모</b> · 결제·실제 계정 생성은 이루어지지 않습니다. 아래 계정을 눌러 바로 입장하세요.
          <div class="demo-list">
            ${ROLES.map((r) => `<button type="button" class="demo-account" data-demo="${r.id}"><span><b>${DEMO[r.id].name}</b> · ${r.label}</span><span>${DEMO[r.id].email} →</span></button>`).join("")}
          </div>
        </div></div>`}
      `;

      openModal(html, {
        onOpen(box) {
          box.querySelectorAll("[data-role]").forEach((b) => {
            b.addEventListener("click", () => {
              role = b.dataset.role;
              if (!signup) render();
              else {
                box.querySelectorAll("[data-role]").forEach((x) => x.classList.toggle("on", x === b));
              }
            });
          });
          box.querySelectorAll("[data-demo]").forEach((b) => {
            b.addEventListener("click", () => {
              const r = b.dataset.demo;
              const d = DEMO[r];
              Store.login({ role: r, name: d.name, email: d.email, org: d.org, traineeId: d.traineeId || null, demo: true });
              closeModal();
              if (opts.onSuccess) opts.onSuccess(Store.session());
              else completeLogin(Store.session());
            });
          });
          const sw = box.querySelector("#authSwitch");
          if (sw) sw.addEventListener("click", () => {
            signup = !signup;
            render();
          });
          const form = box.querySelector("#authForm");
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = box.querySelector("#authEmail");
            const pw = box.querySelector("#authPw");
            const nameEl = box.querySelector("#authName");
            const err = box.querySelector("#authError");
            const fail = (msg) => {
              err.textContent = msg;
              err.style.display = "block";
              return false;
            };
            err.style.display = "none";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
              email.classList.add("invalid");
              return fail("이메일 형식을 확인해주세요.");
            }
            email.classList.remove("invalid");
            if (pw.value.length < 4) {
              pw.classList.add("invalid");
              return fail("비밀번호는 4자 이상 입력해주세요.");
            }
            pw.classList.remove("invalid");
            if (signup && nameEl.value.trim().length < 2) {
              nameEl.classList.add("invalid");
              return fail("이름을 2자 이상 입력해주세요.");
            }
            const btn = box.querySelector("#authSubmit");
            btn.textContent = "확인 중…";
            btn.disabled = true;
            const d = DEMO[role];
            const user = {
              role,
              email: email.value.trim(),
              name: signup ? nameEl.value.trim() : d.name,
              org: signup ? (role === "trainee" ? "MY IDOL GROW" : role === "fan" ? "FAN MEMBERSHIP" : "MY IDOL PARTNER") : d.org,
              traineeId: role === "trainee" ? "harin" : null,
              demo: !signup,
            };
            setTimeout(() => {
              Store.login(user);
              closeModal();
              if (opts.onSuccess) opts.onSuccess(Store.session());
              else completeLogin(Store.session());
            }, 450);
          });
        },
      });
    };

    render();
  }

  /* ---------------- nav ---------------- */
  function navActions() {
    const el = $("#navActions");
    if (!el) return;
    const s = Store.session();
    if (s) {
      el.innerHTML = `
        <a class="nav-user" href="${s.role}.html" title="내 대시보드">
          <span class="nav-avatar">${esc(initial(s.name))}</span>
          <span class="nav-user-name">${esc(s.name)}</span>
          <span class="badge" style="height:22px;font-size:8px">${roleName(s.role)}</span>
        </a>
        <button class="icon-btn" id="navLogout" title="로그아웃" aria-label="로그아웃">${icon("logout")}</button>`;
      const out = $("#navLogout", el);
      if (out) out.addEventListener("click", () => {
        Store.logout();
        location.href = "index.html";
      });
    } else {
      el.innerHTML = `
        <button class="btn btn-sm btn-ghost" data-auth data-role="fan"><span class="hide-sm">로그인</span></button>
        <button class="btn btn-sm btn-primary" data-auth data-role="trainee">시작하기 ${icon("arrow", "arrow")}</button>`;
    }
  }

  function initNav() {
    const nav = $(".site-nav");
    if (!nav) return;
    const solid = nav.classList.contains("solid");
    const onScroll = () => {
      if (document.body.dataset.page === "index") {
        nav.classList.toggle("scrolled", window.scrollY > 24);
      } else if (!solid) nav.classList.add("solid");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = $(".nav-toggle");
    if (toggle) toggle.addEventListener("click", () => nav.classList.toggle("open"));
    $$(".nav-links a").forEach((a) => {
      if (a.getAttribute("href") === location.pathname.split("/").pop()) a.classList.add("active");
    });
    navActions();
  }

  /* ---------------- post modal ---------------- */
  function openPost(id, opts = {}) {
    const p = Store.post(id);
    if (!p) {
      toast("삭제되었거나 찾을 수 없는 기록입니다.");
      return;
    }
    const t = Store.trainee(p.traineeId);
    const s = Store.session();
    const isVideo = p.type === "video";

    const renderComments = () => {
      const list = Store.comments(p.id);
      if (!list.length) return `<div class="empty" style="border:0;padding:24px 0;font-size:11.5px">첫 번째 응원을 남겨보세요.</div>`;
      return list
        .map(
          (c) => `<div class="pm-comment ${c.role === "ent" ? "ent" : ""}">
          <div class="c-avatar">${esc(initial(c.author))}</div>
          <div class="c-body">
            <b>${esc(c.author)}</b>${c.role === "ent" ? `<span style="font-size:8px;color:#b9a8ff;border:1px solid rgba(139,108,255,.3);padding:1px 4px;border-radius:3px;margin-left:4px">기획사</span>` : ""}
            <p>${esc(c.text)}</p>
            <span>${dateKo(c.date)} · ${roleName(c.role)}</span>
          </div>
        </div>`
        )
        .join("");
    };

    const html = `<div class="post-modal">
      <div class="pm-media">
        ${p.media && !isVideo ? `<img class="pm-upload" src="${p.media}" alt="${esc(p.title)}">` : art(t, { post: p, name: false, meta: false })}
        ${isVideo ? `<button class="art-play pm-play" aria-label="영상 재생">${icon("play")}</button><div class="pm-progress"><i></i></div>` : ""}
      </div>
      <div class="pm-info">
        <div class="pm-head">
          <div class="pm-author">
            <span class="pm-avatar">${esc(t.initials)}</span>
            <div><b>${esc(t.name)}</b><span>${esc(t.position)} · ${esc(t.agency)}</span></div>
            <span class="badge" style="margin-left:auto;height:22px;font-size:8px">${isVideo ? "VIDEO" : "PHOTO"}</span>
          </div>
          <h4>${esc(p.title)}</h4>
          <p>${esc(p.caption)}</p>
          <div class="flex gap-8" style="margin-top:10px;flex-wrap:wrap">
            ${(p.tags || []).map((x) => `<span class="tag">#${esc(x)}</span>`).join("")}
            <span class="tag" style="margin-left:auto">${dateKo(p.date)}</span>
          </div>
        </div>
        <div class="pm-comments" id="pmComments">${renderComments()}</div>
        <div class="pm-foot">
          <div class="pm-actions">
            <button class="pm-like ${Store.isLiked(p.id) ? "on" : ""}" id="pmLike">${icon("heart")}<span id="pmLikeCount">${num(Store.likeCount(p))}</span></button>
            <span class="mono" style="font-size:9px;color:var(--faint)">댓글 <b id="pmCommentCount" style="color:var(--muted);font-weight:500">${Store.commentCount(p.id)}</b></span>
            <span class="mono" style="font-size:9px;color:var(--faint);margin-left:auto">${rel(p.date)}</span>
          </div>
          <form class="pm-comment-form" id="pmForm">
            <input class="input" id="pmInput" maxlength="140" placeholder="${s ? "응원 댓글을 남겨보세요" : "로그인 후 댓글을 남길 수 있어요"}" ${s ? "" : "disabled"}>
            <button class="btn btn-primary" type="submit" ${s ? "" : "disabled"}>등록</button>
          </form>
        </div>
      </div>
    </div>`;

    openModal(html, {
      className: "post-modal-shell",
      focus: false,
      onOpen(box) {
        const root = $("#modalRoot");
        root._onClose = opts.onClose || null;

        const likeBtn = box.querySelector("#pmLike");
        likeBtn.addEventListener("click", () => {
          if (!Store.session()) {
            closeModal();
            openAuth({ role: "fan" });
            return;
          }
          Store.toggleLike(p.id);
          const on = Store.isLiked(p.id);
          likeBtn.classList.toggle("on", on);
          box.querySelector("#pmLikeCount").textContent = num(Store.likeCount(p));
        });

        const form = box.querySelector("#pmForm");
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const sess = Store.session();
          if (!sess) {
            closeModal();
            openAuth({ role: "fan" });
            return;
          }
          const input = box.querySelector("#pmInput");
          const text = input.value.trim();
          if (!text) return;
          Store.addComment(p.id, { author: sess.name, role: sess.role, text });
          input.value = "";
          box.querySelector("#pmComments").innerHTML = renderComments();
          box.querySelector("#pmCommentCount").textContent = Store.commentCount(p.id);
          toast("댓글이 등록되었습니다");
          if (opts.onChange) opts.onChange();
          const scroller = box.querySelector(".pm-comments");
          scroller.scrollTop = scroller.scrollHeight;
        });

        const play = box.querySelector(".pm-play");
        if (play) {
          let timer = null;
          play.addEventListener("click", () => {
            const a = box.querySelector(".pm-media .art");
            const on = !a.classList.contains("playing");
            a.classList.toggle("playing", on);
            play.innerHTML = on ? icon("pause") : icon("play");
            const bar = box.querySelector(".pm-progress i");
            if (bar) {
              bar.style.transition = "none";
              bar.style.width = "0%";
              if (on) {
                requestAnimationFrame(() => {
                  bar.style.transition = "width 30s linear";
                  bar.style.width = "100%";
                });
              }
            }
          });
        }
      },
    });
  }

  /* ---------------- reveal ---------------- */
  function initReveal(root = document) {
    const items = $$("[data-reveal]", root).filter((el) => !el.classList.contains("revealed"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("revealed");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  function countUp(el, target, suffix = "") {
    const start = performance.now();
    const dur = 1300;
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("ko-KR") + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------------- misc ---------------- */
  function copy(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => toast("링크를 복사했습니다")).catch(() => toast("복사에 실패했습니다"));
    } else {
      toast("링크: " + text);
    }
  }

  function bindPostOpeners(root = document, onChange) {
    $$(".post-card[data-post]", root).forEach((card) => {
      if (card.dataset.bound) return;
      card.dataset.bound = "1";
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-del]")) return;
        openPost(card.dataset.post, { onChange });
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPost(card.dataset.post, { onChange });
        }
      });
    });
  }

  function bindFavs(root = document, role, onChange) {
    $$("[data-fav]", root).forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "1";
      const id = btn.dataset.fav;
      const on = Store.isFav(role, id);
      btn.classList.toggle("on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!Store.session()) {
          openAuth({ role, onSuccess: () => role && (location.href = role + ".html") });
          return;
        }
        const added = Store.toggleFav(role, id);
        btn.classList.toggle("on", added);
        toast(added ? "관심 연습생에 추가했습니다" : "관심 연습생에서 제외했습니다");
        if (onChange) onChange(id, added);
      });
    });
  }

  function logout() {
    Store.logout();
    location.href = "index.html";
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-auth]");
    if (trigger) {
      e.preventDefault();
      const role = trigger.dataset.role || "fan";
      openAuth({ role, signup: trigger.dataset.signup === "1" });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  return {
    $,
    $$,
    esc,
    num,
    fans,
    dateKo,
    rel,
    dday,
    weekLabels,
    roleName,
    initial,
    icon,
    art,
    lineChart,
    spark,
    radar,
    heatmap,
    postCard,
    openModal,
    closeModal,
    toast,
    openAuth,
    loginDemo,
    initNav,
    navActions,
    openPost,
    initReveal,
    countUp,
    copy,
    bindPostOpeners,
    bindFavs,
    logout,
    DEMO,
    ROLES,
  };
})();
