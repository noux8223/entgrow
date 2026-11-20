/* =========================================================
   MY IDOL — role dashboards
   연습생 / 팬 / 엔터 화면을 하나의 해시 라우터로 구성합니다.
======================================================== */
(function () {
  const { $, $$, esc, num, fans, art, icon, dateKo, rel, dday, roleName, initial, weekLabels, DEMO } = U;

  const ROLE = document.body.dataset.app || "";
  const ROLE_LABEL = { trainee: "연습생", fan: "팬", ent: "엔터" };
  const ROLE_SUB = { trainee: "GROW PRO", fan: "FAN MEMBERSHIP", ent: "PARTNER · SCOUT" };

  const NAVS = {
    trainee: [
      { id: "overview", icon: "grid", label: "오버뷰" },
      { id: "growth", icon: "trend", label: "성장 리포트" },
      { id: "posts", icon: "layers", label: "내 기록" },
      { id: "upload", icon: "upload", label: "기록 올리기" },
      { id: "comments", icon: "comment", label: "응원 · 댓글" },
      { id: "profile", icon: "user", label: "프로필 설정" },
    ],
    fan: [
      { id: "feed", icon: "activity", label: "피드" },
      { id: "favorites", icon: "heart", label: "관심 연습생" },
      { id: "discover", icon: "search", label: "연습생 찾기" },
      { id: "membership", icon: "star", label: "멤버십" },
    ],
    ent: [
      { id: "overview", icon: "grid", label: "스카우트 보드" },
      { id: "watchlist", icon: "users", label: "관심 후보" },
      { id: "analytics", icon: "chart", label: "팬 · 성장 분석" },
      { id: "report", icon: "file", label: "리포트" },
    ],
  };

  const HEADS = {
    trainee: { eyebrow: "TRAINEE WORKSPACE", sub: "매일의 기록이 포트폴리오가 됩니다" },
    fan: { eyebrow: "FAN WORKSPACE", sub: "데뷔 전의 순간을 가장 가까이" },
    ent: { eyebrow: "PARTNER WORKSPACE", sub: "감이 아니라 데이터로 찾는 인재" },
  };

  const state = {
    view: "",
    q: "",
    pos: "전체",
    sort: "egi",
    filter: "all",
    selected: null,
    billing: "monthly",
    upload: { dataUrl: null, type: "photo", duration: null, fileName: "", tags: [] },
    profileTab: "profile",
  };

  let session = null;

  /* =======================================================
     shared helpers
  ======================================================= */
  const todayIso = () => MD.iso(new Date());
  const nowStamp = () => new Date().toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

  function up(n, suffix) {
    return `<span class="up">▲ ${num(n)}${suffix || ""}</span>`;
  }

  function pageHead(o) {
    return `<div class="page-head">
      <div class="ttl">
        <span class="eyebrow">${esc(o.eyebrow || "")}</span>
        <h2>${o.title}</h2>
        <p>${o.desc || ""}</p>
      </div>
      ${o.actions ? `<div class="page-actions">${o.actions}</div>` : ""}
    </div>`;
  }

  function kpi(o) {
    return `<div class="kpi">
      <div class="k-label">${o.icon ? icon(o.icon) : ""}${esc(o.label)}</div>
      <b class="k-val">${o.value}${o.unit ? `<small>${esc(o.unit)}</small>` : ""}</b>
      <div class="k-foot">${o.foot || ""}</div>
      ${o.spark ? `<div class="k-spark">${U.spark(o.spark, o.color)}</div>` : ""}
    </div>`;
  }

  function card(o) {
    return `<section class="card${o.cls ? " " + o.cls : ""}">
      ${o.title ? `<div class="card-head">
        <div class="ch-txt"><h3>${o.title}</h3>${o.sub ? `<span>${o.sub}</span>` : ""}</div>
        ${o.actions ? `<div class="ch-actions">${o.actions}</div>` : ""}
      </div>` : ""}
      ${o.body}
      ${o.foot ? `<div class="card-foot">${o.foot}</div>` : ""}
    </section>`;
  }

  function chipRow(items, active) {
    return items.map((i) => `<button class="chip ${i.value === active ? "on" : ""}" data-chip="${esc(i.key)}" data-value="${esc(i.value)}">${esc(i.label)}</button>`).join("");
  }

  function empty(b, span, action) {
    return `<div class="empty"><b>${esc(b)}</b><span>${esc(span || "")}</span>${action || ""}</div>`;
  }

  function postCards(list, opts = {}) {
    if (!list.length) return "";
    return `<div class="post-grid">${list.map((p) => U.postCard(p, opts)).join("")}</div>`;
  }

  function milestoneList(t) {
    return `<div class="mile-list">${t.milestones
      .map((m) => `<div class="mile"><div class="m-date">${dateKo(m.date).slice(5)}</div><div class="m-txt"><b>${esc(m.title)}</b><span>${esc(m.desc)}</span></div></div>`)
      .join("")}</div>`;
  }

  function skillBars(t, keys) {
    return (keys || MD.skillKeys)
      .map((k) => `<div class="bar-row"><span>${MD.skillLabels[k]}</span><div class="track"><div class="fill" style="width:${t.skills[k]}%"></div></div><b>${t.skills[k]}</b></div>`)
      .join("");
  }

  function rowAvatar(t, round) {
    return `<div class="row-avatar${round ? " round" : ""}">${art(t, { name: false, meta: false })}</div>`;
  }

  function favRole() {
    return ROLE === "ent" ? "ent" : "fan";
  }

  function myTrainee() {
    return Store.trainee((session && session.traineeId) || "harin");
  }

  function totalHours(t) {
    return Math.round(t.heat.reduce((a, b) => a + b.hours, 0));
  }

  function nextEvent() {
    return MD.events
      .slice()
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .filter((e) => e.date >= todayIso())[0] || MD.events[0];
  }

  function artThumb(t, cls) {
    return `<div class="${cls || "st-art"}">${art(t, { name: false, meta: false })}</div>`;
  }

  function countFor(id) {
    if (ROLE === "trainee") {
      if (id === "posts") return Store.postsOf(myTrainee().id).length;
      if (id === "comments") return Store.myComments().length;
    }
    if (ROLE === "fan" && id === "favorites") return Store.favorites("fan").length;
    if (ROLE === "ent" && id === "watchlist") return Store.favorites("ent").length;
    return null;
  }

  function syncSidebarCounts() {
    $$(".side-link[data-view]").forEach((a) => {
      const n = countFor(a.dataset.view);
      const c = a.querySelector(".count");
      if (n == null) {
        if (c) c.remove();
      } else if (!c) {
        a.insertAdjacentHTML("beforeend", `<span class="count">${n}</span>`);
      } else {
        c.textContent = n;
      }
    });
  }

  /* =======================================================
     boot / auth gate
  ======================================================= */
  function boot() {
    const s = Store.session();
    if (!s || s.role !== ROLE) {
      showGate(s);
      return;
    }
    session = s;
    $("#authGate").classList.remove("show");
    buildSidebar();
    buildTopbar();
    initShell();
    window.addEventListener("hashchange", route);
    route();
  }

  function showGate(s) {
    const gate = $("#authGate");
    if (!gate) return;
    const demo = DEMO[ROLE];
    const mismatch = s && s.role !== ROLE;
    gate.innerHTML = `<div class="gate-card">
      <div class="gate-ic">${icon(mismatch ? "lock" : ROLE === "trainee" ? "spark" : ROLE === "fan" ? "heart" : "building")}</div>
      <h2>${mismatch ? "다른 역할로 로그인되어 있어요" : ROLE_LABEL[ROLE] + " 대시보드"}</h2>
      <p>${
        mismatch
          ? `현재 <b style="color:var(--fg)">${esc(s.name)}</b>님은 ${esc(roleName(s.role))} 계정입니다.<br>이 화면은 ${esc(ROLE_LABEL[ROLE])} 전용입니다.`
          : `${esc(ROLE_LABEL[ROLE])} 계정으로 로그인하면<br>${esc(HEADS[ROLE].sub)}<br>데모 계정으로 바로 체험할 수 있어요.`
      }</p>
      <div class="gate-actions">
        <button class="btn btn-primary btn-block" id="gateDemo">${esc(demo.name)} · ${esc(ROLE_LABEL[ROLE])} 데모로 입장</button>
        <button class="btn btn-ghost btn-block" id="gateLogin">다른 계정으로 로그인</button>
      </div>
      <div class="gate-note">DEMO ONLY · 결제·개인정보 수집 없음</div>
      ${mismatch ? `<div class="gate-alt">내 대시보드로 <a href="${s.role}.html">이동하기</a></div>` : `<div class="gate-alt"><a href="index.html">메인으로 돌아가기</a></div>`}
    </div>`;
    gate.classList.add("show");
    $("#gateDemo").addEventListener("click", () => {
      const d = DEMO[ROLE];
      Store.login({ role: ROLE, name: d.name, email: d.email, org: d.org, traineeId: d.traineeId || null, demo: true });
      location.reload();
    });
    $("#gateLogin").addEventListener("click", () => {
      U.openAuth({ role: ROLE, signup: true, onSuccess: () => location.reload() });
    });
  }

  function buildSidebar() {
    const el = $("#sidebar");
    const nav = NAVS[ROLE];
    const counts = {};
    nav.forEach((n) => (counts[n.id] = countFor(n.id)));
    el.innerHTML = `
      <a class="logo" href="index.html"><span class="logo-mark">✦</span> MY IDOL <small>마이아이돌</small></a>
      <div class="side-role">
        <span class="sr-avatar">${esc(initial(session.name))}</span>
        <div style="min-width:0">
          <b>${esc(session.name)}</b>
          <span>${esc(ROLE_SUB[ROLE])}${session.demo ? " · DEMO" : ""}</span>
        </div>
      </div>
      <div class="side-label">WORKSPACE</div>
      <nav class="side-nav" aria-label="대시보드 메뉴">
        ${nav
          .map((n) => {
            const c = counts[n.id];
            return `<a class="side-link" href="#${n.id}" data-view="${n.id}">
              ${icon(n.icon, "ic")}<span>${esc(n.label)}</span>${c != null ? `<span class="count">${c}</span>` : ""}
            </a>`;
          })
          .join("")}
      </nav>
      <div class="side-label">PUBLIC</div>
      <nav class="side-nav">
        <a class="side-link" href="explore.html">${icon("search", "ic")}<span>연습생 둘러보기</span></a>
        <a class="side-link" href="profile.html?id=${esc((session && session.traineeId) || "harin")}">${icon("eye", "ic")}<span>공개 프로필</span></a>
        <a class="side-link" href="index.html">${icon("external", "ic")}<span>메인 페이지</span></a>
      </nav>
      <div class="side-foot">
        <div class="side-note">${icon("spark")}<br><b>데모 안내</b><br>모든 기록은 브라우저에만 저장됩니다. 업로드 이미지는 이 기기에서만 보입니다.</div>
        <div class="side-actions">
          <button class="btn btn-ghost" id="sideLogout">${icon("logout")} 로그아웃</button>
        </div>
      </div>`;
    $("#sideLogout").addEventListener("click", U.logout);
  }

  function buildTopbar() {
    const q = ROLE === "fan" || ROLE === "ent";
    $("#topbarActions").innerHTML = `
      ${q ? `<label class="search">${icon("search")}<input class="input" id="globalSearch" placeholder="${ROLE === "fan" ? "연습생 검색" : "후보 검색"}" aria-label="검색"><kbd>/</kbd></label>` : ""}
      <button class="icon-btn" id="bellBtn" title="알림" aria-label="알림">${icon("bell")}<span class="dot"></span></button>
      <div class="topbar-user" style="display:flex;align-items:center">
        <button class="user-btn" id="userBtn" aria-haspopup="true" aria-expanded="false">
          <span class="u-avatar">${esc(initial(session.name))}</span>
          <span class="u-name">${esc(session.name)}</span>
          ${icon("chev")}
        </button>
      </div>`;
    const header = $(".topbar");
    if (!$("#userPop")) {
      header.insertAdjacentHTML(
        "beforeend",
        `<div class="user-pop" id="userPop">
          <div class="up-head"><b>${esc(session.name)}</b><span>${esc(session.email || "")}</span></div>
          <a href="profile.html?id=${esc((session && session.traineeId) || "harin")}">${icon("eye")} 공개 프로필 보기</a>
          <a href="#${ROLE === "trainee" ? "profile" : ROLE === "fan" ? "membership" : "report"}">${icon(ROLE === "trainee" ? "edit" : ROLE === "fan" ? "star" : "file")} ${ROLE === "trainee" ? "프로필 설정" : ROLE === "fan" ? "내 멤버십" : "스카우트 리포트"}</a>
          <a href="index.html#pricing">${icon("star")} 요금제 보기</a>
          <button id="popLogout">${icon("logout")} 로그아웃</button>
        </div>`
      );
    }
    $("#popLogout").addEventListener("click", U.logout);
    const pop = $("#userPop");
    $("#userBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      pop.classList.toggle("open");
      $("#userBtn").setAttribute("aria-expanded", pop.classList.contains("open") ? "true" : "false");
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#userPop") && !e.target.closest("#userBtn")) pop.classList.remove("open");
    });
    $("#bellBtn").addEventListener("click", () => {
      const ev = nextEvent();
      U.toast(`${ev.title} · ${dday(ev.date)}`);
    });
    const search = $("#globalSearch");
    if (search) {
      search.value = state.q;
      search.addEventListener("input", () => {
        state.q = search.value.trim();
        const target = ROLE === "fan" ? "discover" : "watchlist";
        if (state.view !== target) location.hash = target;
        else route();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
          e.preventDefault();
          search.focus();
        }
      });
    }
  }

  function initShell() {
    const menu = $("#menuBtn");
    const side = $("#sidebar");
    const backdrop = $("#sidebarBackdrop");
    const close = () => {
      side.classList.remove("open");
      backdrop.classList.remove("show");
    };
    menu.addEventListener("click", () => {
      side.classList.toggle("open");
      backdrop.classList.toggle("show", side.classList.contains("open"));
    });
    backdrop.addEventListener("click", close);
    window.closeSidebar = close;
  }

  /* =======================================================
     router
  ======================================================= */
  function route() {
    const nav = NAVS[ROLE];
    let v = location.hash.replace(/^#\/?/, "").split("?")[0];
    if (!nav.some((n) => n.id === v)) v = nav[0].id;
    state.view = v;
    const item = nav.find((n) => n.id === v);
    document.title = `${item.label} — MY IDOL ${ROLE_SUB[ROLE]}`;
    $("#topbarTitle").innerHTML = `<div class="eyebrow">${esc(HEADS[ROLE].eyebrow)}</div><h1>${esc(item.label)}</h1>`;
    $$(".side-link[data-view]").forEach((a) => a.classList.toggle("on", a.dataset.view === v));
    syncSidebarCounts();
    const view = VIEWS[ROLE][v];
    const body = $("#appBody");
    body.innerHTML = view.html();
    if (view.bind) view.bind(body);
    U.initReveal(body);
    window.scrollTo(0, 0);
    if (typeof window.closeSidebar === "function") window.closeSidebar();
  }

  /* =======================================================
     TRAINEE
  ======================================================= */
  const TRAINEE = {};

  TRAINEE.overview = {
    html() {
      const t = myTrainee();
      const posts = Store.postsOf(t.id);
      const comments = Store.myComments();
      const hrs = totalHours(t);
      const incoming = posts.reduce((a, p) => a + Store.commentCount(p.id), 0);
      return `
        ${pageHead({
          eyebrow: "TRAINEE / " + t.en,
          title: `${esc(t.name)}님, 오늘도 기록됐어요`,
          desc: `${dateKo(todayIso())} 기준 · <b>${esc(t.agency)}</b> · ${t.years}년차 ${esc(t.position)}`,
          actions: `<button class="btn btn-ghost btn-sm" id="goGrowth">${icon("trend")} 성장 리포트</button><a class="btn btn-primary btn-sm" href="#upload">${icon("plus")} 기록 올리기</a>`,
        })}
        <div class="kpi-grid">
          ${kpi({ icon: "trend", label: "EGI GROWTH INDEX", value: t.egi, unit: "", foot: `${up(t.egiDelta)} 이번 주`, spark: t.egiSeries, color: "#d8ff4a" })}
          ${kpi({ icon: "heart", label: "FANS", value: fans(t.fans), foot: `${up(t.fansDelta)} 이번 주`, spark: t.fanSeries, color: "#ff7a5c" })}
          ${kpi({ icon: "layers", label: "RECORDS", value: posts.length, unit: "건", foot: `최근 ${rel(posts[0] ? posts[0].date : todayIso())} 업데이트` })}
          ${kpi({ icon: "clock", label: "PRACTICE HOURS", value: hrs, unit: "h", foot: `최근 18주 · 댓글 ${incoming}개` })}
        </div>
        <div class="dash-grid">
          ${card({
            title: "EGI 성장 곡선",
            sub: "최근 12주 · 소속사 검증 지표",
            actions: `<span class="badge lime">+${t.egiDelta} THIS WEEK</span>`,
            body: U.lineChart(t.egiSeries, { height: 200, labels: weekLabels(12), footLeft: "12 WEEKS AGO", footRight: "NOW" }),
            foot: `<span>${icon("eye")} 원점수는 소속사에만 공개됩니다</span><a class="link-more" href="#growth">자세히 ${icon("arrow")}</a>`,
          })}
          ${card({
            title: "이번 주 루틴",
            sub: "연습 시간 · 최근 18주",
            body: `${U.heatmap(t.heat)}`,
            foot: `<span class="mono">${Math.round(t.heat.reduce((a, b) => a + b.hours, 0))} HOURS TOTAL</span><span>꾸준함이 곧 데이터</span>`,
          })}
        </div>
        <div class="dash-grid">
          ${card({
            title: "최근 기록",
            sub: `${posts.length}개의 사진·영상`,
            actions: `<a class="link-more" href="#posts">전체 보기 ${icon("arrow")}</a>`,
            body: posts.length ? postCards(posts.slice(0, 3), {}) : empty("아직 기록이 없어요", "첫 기록을 올려보세요", `<a class="btn btn-primary btn-sm" href="#upload">기록 올리기</a>`),
          })}
          ${card({
            title: "마일스톤",
            sub: "성장의 변곡점",
            body: milestoneList(t),
            foot: `<span>공개 프로필에 함께 노출됩니다</span><button class="link-more" id="copyPublic">${icon("copy")} 링크</button>`,
          })}
        </div>
        <div class="dash-grid even">
          ${card({
            title: "받은 응원",
            sub: "내 기록에 달린 최근 댓글",
            actions: `<a class="link-more" href="#comments">전체 ${icon("arrow")}</a>`,
            body: incoming
              ? `<div class="row-list">${posts
                  .flatMap((p) => Store.comments(p.id).map((c) => ({ ...c, post: p })))
                  .sort((a, b) => ((a.ts || 0) < (b.ts || 0) ? 1 : -1))
                  .slice(0, 4)
                  .map(
                    (c) => `<div class="row-item">
                      <div class="cr-avatar">${esc(initial(c.author))}</div>
                      <div class="row-txt"><b>${esc(c.author)} <span style="font-weight:400;color:var(--faint)">· ${esc(roleName(c.role))}</span></b><span>${esc(c.text)}</span></div>
                      <button class="link-more" data-open-post="${esc(c.post.id)}">${icon("arrow")}</button>
                    </div>`
                  )
                  .join("")}</div>`
              : empty("아직 응원이 없어요", "기록을 꾸준히 올리면 팬들이 찾아옵니다"),
          })}
          ${card({
            title: "다음 일정",
            sub: "다가오는 평가 · 이벤트",
            body: `<div class="row-list">${MD.events
              .slice()
              .sort((a, b) => (a.date < b.date ? -1 : 1))
              .slice(0, 3)
              .map((e) => `<div class="row-item">
                <div class="row-avatar round" style="display:grid;place-items:center;background:rgba(216,255,74,.1);color:var(--lime)">${icon("calendar")}</div>
                <div class="row-txt"><b>${esc(e.title)}</b><span>${dateKo(e.date)} · ${esc(e.meta)}</span></div>
                <div class="row-right"><b style="color:var(--lime)">${dday(e.date)}</b></div>
              </div>`)
              .join("")}</div>`,
            foot: `<span>일정은 자동으로 최신 날짜에 맞춰집니다</span><a class="link-more" href="index.html#events">전체 일정 ${icon("arrow")}</a>`,
          })}
        </div>`;
    },
    bind(root) {
      U.bindPostOpeners(root, () => route());
      $$("[data-open-post]", root).forEach((b) => b.addEventListener("click", () => U.openPost(b.dataset.openPost, { onChange: route })));
      const g = $("#goGrowth", root);
      if (g) g.addEventListener("click", () => (location.hash = "growth"));
      const c = $("#copyPublic", root);
      if (c) c.addEventListener("click", () => U.copy(location.origin + location.pathname.replace(/[^/\\]+$/, "") + "profile.html?id=" + myTrainee().id));
    },
  };

  TRAINEE.growth = {
    html() {
      const t = myTrainee();
      const posts = Store.postsOf(t.id);
      const hrs = totalHours(t);
      const weeks = weekLabels(12);
      const best = t.egiSeries.indexOf(Math.max(...t.egiSeries));
      return `
        ${pageHead({
          eyebrow: "GROWTH REPORT",
          title: "성장 리포트",
          desc: "12주 EGI·스킬·연습량을 한 장의 포트폴리오로 정리합니다.",
          actions: `<button class="btn btn-ghost btn-sm" id="printReport">${icon("file")} 인쇄</button><button class="btn btn-primary btn-sm" id="downloadReport">${icon("download")} 포트폴리오 저장</button>`,
        })}
        <div class="kpi-grid">
          ${kpi({ icon: "trend", label: "CURRENT EGI", value: t.egi, foot: `최고 ${Math.max(...t.egiSeries)} · ${weeks[best]}`, spark: t.egiSeries })}
          ${kpi({ icon: "activity", label: "12W GROWTH", value: "+" + (t.egi - t.egiSeries[0]).toFixed(1), unit: "", foot: "12주 전 대비", spark: t.egiSeries, color: "#8b6cff" })}
          ${kpi({ icon: "clock", label: "PRACTICE", value: hrs, unit: "h", foot: "최근 18주 누적" })}
          ${kpi({ icon: "layers", label: "RECORDS", value: posts.length, unit: "건", foot: `사진 ${posts.filter((p) => p.type === "photo").length} · 영상 ${posts.filter((p) => p.type === "video").length}` })}
        </div>
        <div class="dash-grid">
          ${card({
            title: "EGI · 12주 추이",
            sub: "검증된 성장 지수",
            body: U.lineChart(t.egiSeries, { height: 230, labels: weeks, footLeft: "12 WEEKS AGO", footRight: "THIS WEEK" }),
            foot: `<span>${icon("check")} 소속사 검증 완료</span><span class="mono">TOP ${Math.max(4, 100 - Math.round(t.egi))}%</span>`,
          })}
          ${card({
            title: "스킬 레이더",
            sub: "6개 평가 축",
            body: U.radar(t.skills, MD.skillLabels),
            foot: `<span>가장 높은 축 · ${MD.skillLabels[Object.keys(t.skills).sort((a, b) => t.skills[b] - t.skills[a])[0]]}</span>`,
          })}
        </div>
        <div class="dash-grid">
          ${card({
            title: "연습 히트맵",
            sub: "최근 18주 · 색이 진할수록 긴 연습",
            body: U.heatmap(t.heat),
            foot: `<span class="mono">AVG ${(hrs / 126).toFixed(1)}H / DAY</span><span>기록 ${t.heat.filter((d) => d.level).length}일</span>`,
          })}
          ${card({
            title: "스킬 상세",
            sub: "100점 환산",
            body: `<div class="skill-bars">${skillBars(t)}</div>`,
            foot: `<span>성실성 · 표현력은 월말평가에 반영</span>`,
          })}
        </div>
        <div class="dash-grid even">
          ${card({
            title: "팬 성장",
            sub: "응원 팬 · 12주",
            body: U.lineChart(t.fanSeries, { height: 190, labels: weeks, color: "#ff7a5c", footLeft: "12 WEEKS AGO", footRight: "NOW" }),
            foot: `<span>현재 ${num(t.fans)}명</span>${up(t.fansDelta, "명")}`,
          })}
          ${card({ title: "마일스톤", sub: "최근 6개월", body: milestoneList(t) })}
        </div>`;
    },
    bind() {
      const t = myTrainee();
      $("#printReport").addEventListener("click", () => {
        const w = window.open("", "_blank");
        if (!w) {
          U.toast("팝업이 차단되었습니다. 포트폴리오 저장을 이용해주세요");
          return;
        }
        w.document.open();
        w.document.write(portfolioHtml(t));
        w.document.close();
        w.focus();
        setTimeout(() => w.print(), 350);
      });
      $("#downloadReport").addEventListener("click", () => buildPortfolio(t));
    },
  };

  TRAINEE.posts = {
    html() {
      const t = myTrainee();
      const posts = Store.postsOf(t.id).filter((p) => state.filter === "all" || p.type === state.filter);
      const all = Store.postsOf(t.id);
      return `
        ${pageHead({
          eyebrow: "MY RECORDS",
          title: "내 기록",
          desc: `사진과 영상으로 쌓인 <b>${all.length}개</b>의 기록. 삭제는 내가 올린 기록에만 적용됩니다.`,
          actions: `<a class="btn btn-primary btn-sm" href="#upload">${icon("plus")} 새 기록</a>`,
        })}
        <div class="card">
          <div class="card-head">
            <div class="ch-txt"><h3>사진 · 영상</h3><span>${posts.length} RECORDS</span></div>
            <div class="ch-actions">
              ${chipRow([{ key: "filter", value: "all", label: "전체" }, { key: "filter", value: "photo", label: "사진" }, { key: "filter", value: "video", label: "영상" }], state.filter)}
            </div>
          </div>
          ${posts.length ? postCards(posts, { deletable: true }) : empty("해당하는 기록이 없어요", "다른 필터를 선택하거나 새 기록을 올려보세요", `<a class="btn btn-primary btn-sm" href="#upload">기록 올리기</a>`)}
          <div class="flex items-center gap-8" style="margin-top:18px;padding-top:14px;border-top:1px solid var(--line);flex-wrap:wrap">
            <span class="mono" style="font-size:9px;color:var(--faint)">${icon("eye")} 공개 범위는 업로드할 때 기록별로 선택할 수 있습니다.</span>
            <a class="link-more" style="margin-left:auto" href="profile.html?id=${t.id}">공개 프로필에서 보기 ${icon("external")}</a>
          </div>
        </div>`;
    },
    bind(root) {
      $$("[data-del]", root).forEach((b) => {
        if (MD.posts.some((p) => p.id === b.dataset.del)) b.remove();
      });
      U.bindPostOpeners(root, () => route());
      $$("[data-chip]", root).forEach((b) =>
        b.addEventListener("click", () => {
          state.filter = b.dataset.value;
          route();
        })
      );
      $$("[data-del]", root).forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = btn.dataset.del;
          U.openModal(
            `<h3>기록을 삭제할까요?</h3><p class="sub">삭제한 기록은 되돌릴 수 없습니다.</p>
             <div class="flex gap-8" style="justify-content:flex-end;margin-top:20px">
               <button class="btn btn-ghost" data-close>취소</button>
               <button class="btn btn-primary" id="confirmDel">삭제</button>
             </div>`,
            {
              onOpen(box) {
                box.querySelector("#confirmDel").addEventListener("click", () => {
                  Store.removePost(id);
                  U.closeModal();
                  U.toast("기록을 삭제했습니다");
                  route();
                });
              },
            }
          );
        })
      );
    },
  };

  TRAINEE.upload = {
    html() {
      const t = myTrainee();
      const u = state.upload;
      return `
        ${pageHead({
          eyebrow: "NEW RECORD",
          title: "기록 올리기",
          desc: "오늘의 연습을 사진 또는 영상으로 남겨보세요. 이미지는 자동으로 최적화됩니다.",
          actions: `<a class="btn btn-ghost btn-sm" href="#posts">${icon("layers")} 내 기록</a>`,
        })}
        <div class="upload-grid">
          <div>
            <div class="drop-zone" id="dropZone" tabindex="0" role="button" aria-label="파일 선택">
              <div class="dz-icon">${icon("upload")}</div>
              <b>사진 또는 영상을 끌어다 놓으세요</b>
              <span>JPG · PNG · MP4 · MOV<br>이미지는 최대 1400px로 자동 축소됩니다.</span>
              <span class="dz-hint">CLICK TO BROWSE / DRAG &amp; DROP</span>
              <div class="dz-preview ${u.dataUrl ? "show" : ""}" id="dzPreview">
                ${u.dataUrl ? `<img src="${u.dataUrl}" alt="업로드 미리보기">` : ""}
                <button class="dz-clear" id="dzClear" aria-label="선택 취소">${icon("close")}</button>
                <span class="dz-name">${esc(u.fileName || "")}</span>
              </div>
            </div>
            <input type="file" id="fileInput" accept="image/*,video/*" hidden>
            <div class="side-note" style="margin-top:12px">${icon("lock")} <b>공개 범위</b> · 기록별로 팬 공개 / 소속사만 / 비공개를 선택할 수 있습니다. 데모에서는 이미지가 브라우저에만 저장됩니다.</div>
            <div class="card" style="margin-top:12px">
              <div class="card-head"><div class="ch-txt"><h3>업로드 팁</h3><span>더 좋은 포트폴리오를 위해</span></div></div>
              <div class="mile-list">
                <div class="mile"><div class="m-date">01</div><div class="m-txt"><b>변화가 보이는 컷</b><span>같은 구도로 찍은 전/후 사진은 성장을 가장 잘 보여줍니다.</span></div></div>
                <div class="mile"><div class="m-date">02</div><div class="m-txt"><b>짧은 캡션</b><span>무엇을 고쳤고 무엇을 느꼈는지 한두 문장이면 충분합니다.</span></div></div>
                <div class="mile"><div class="m-date">03</div><div class="m-txt"><b>태그 2~3개</b><span>보컬·댄스·루틴 등 검색과 리포트에 활용됩니다.</span></div></div>
              </div>
            </div>
          </div>
          <form class="upload-form" id="uploadForm" novalidate>
            <div class="field">
              <label for="upTitle">제목</label>
              <input class="input" id="upTitle" maxlength="60" placeholder="예: 새벽 5시, 고음 파트 4차 수정" value="">
            </div>
            <div class="field">
              <label for="upCaption">설명</label>
              <textarea class="textarea" id="upCaption" rows="4" maxlength="300" placeholder="오늘 무엇을 배웠는지 기록해보세요."></textarea>
            </div>
            <div class="form-grid-2">
              <div class="field">
                <label for="upDate">기록 날짜</label>
                <input class="input" id="upDate" type="date" value="${todayIso()}" max="${todayIso()}">
              </div>
              <div class="field">
                <label for="upType">유형</label>
                <select class="select" id="upType">
                  <option value="photo" ${u.type === "photo" ? "selected" : ""}>사진</option>
                  <option value="video" ${u.type === "video" ? "selected" : ""}>영상</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>태그</label>
              <div class="tag-input" id="tagInput">
                ${u.tags.map((x) => `<span class="tag">#${esc(x)}<button type="button" data-tag="${esc(x)}">${icon("close")}</button></span>`).join("")}
                <input id="tagField" maxlength="14" placeholder="입력 후 Enter (최대 4개)">
              </div>
            </div>
            <div class="field">
              <label>공개 범위</label>
              <div class="vis-options" id="visOptions">
                <button type="button" class="vis-option on" data-vis="fan"><b>팬 공개</b><span>누구나 열람</span></button>
                <button type="button" class="vis-option" data-vis="agency"><b>소속사만</b><span>검증용</span></button>
                <button type="button" class="vis-option" data-vis="private"><b>비공개</b><span>나만 보기</span></button>
              </div>
            </div>
            <div class="upload-actions">
              <span class="note" id="upNote">${u.dataUrl ? "미리보기 준비 완료" : "파일 없이도 텍스트 기록 가능"}</span>
              <button type="button" class="btn btn-ghost" id="upCancel">취소</button>
              <button type="submit" class="btn btn-primary" id="upSubmit">${icon("upload")} 기록 저장</button>
            </div>
          </form>
        </div>`;
    },
    bind(root) {
      const zone = $("#dropZone", root);
      const input = $("#fileInput", root);
      const preview = $("#dzPreview", root);
      const u = state.upload;
      const t = myTrainee();

      const setPreview = (file, dataUrl, type) => {
        u.dataUrl = dataUrl;
        u.type = type;
        u.fileName = file ? file.name : "";
        preview.innerHTML = `${dataUrl ? `<img src="${dataUrl}" alt="업로드 미리보기">` : ""}
          <button class="dz-clear" id="dzClear" type="button" aria-label="선택 취소">${icon("close")}</button>
          <span class="dz-name">${esc(u.fileName || "")}</span>`;
        preview.classList.toggle("show", !!dataUrl);
        $("#upNote", root).textContent = dataUrl ? "미리보기 준비 완료" : "파일 없이도 텍스트 기록 가능";
        $("#upType", root).value = type;
        preview.querySelector("#dzClear").addEventListener("click", (e) => {
          e.stopPropagation();
          u.dataUrl = null;
          u.fileName = "";
          preview.classList.remove("show");
          preview.innerHTML = "";
          input.value = "";
          $("#upNote", root).textContent = "파일 없이도 텍스트 기록 가능";
        });
      };

      const handleFile = (file) => {
        if (!file) return;
        if (!/^image\//.test(file.type) && !/^video\//.test(file.type)) {
          U.toast("이미지 또는 영상 파일만 올릴 수 있어요");
          return;
        }
        if (/^video\//.test(file.type)) {
          const url = URL.createObjectURL(file);
          setPreview(file, url, "video");
          $("#upNote", root).textContent = "영상은 데모에서 재생 미리보기만 제공됩니다";
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const max = 1400;
            const scale = Math.min(1, max / Math.max(img.width, img.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            let dataUrl = canvas.toDataURL("image/jpeg", 0.82);
            if (dataUrl.length > 1600000) dataUrl = canvas.toDataURL("image/jpeg", 0.62);
            setPreview(file, dataUrl, "photo");
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      };

      zone.addEventListener("click", (e) => {
        if (e.target.closest("#dzClear")) return;
        input.click();
      });
      zone.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          input.click();
        }
      });
      input.addEventListener("change", () => handleFile(input.files[0]));
      ["dragenter", "dragover"].forEach((ev) => zone.addEventListener(ev, (e) => {
        e.preventDefault();
        zone.classList.add("over");
      }));
      ["dragleave", "drop"].forEach((ev) => zone.addEventListener(ev, (e) => {
        e.preventDefault();
        zone.classList.remove("over");
      }));
      zone.addEventListener("drop", (e) => handleFile(e.dataTransfer.files[0]));

      let vis = "fan";
      $$("[data-vis]", root).forEach((b) =>
        b.addEventListener("click", () => {
          vis = b.dataset.vis;
          $$("[data-vis]", root).forEach((x) => x.classList.toggle("on", x === b));
        })
      );

      const tagField = $("#tagField", root);
      const drawTags = () => {
        const box = $("#tagInput", root);
        const tags = u.tags.map((x) => `<span class="tag">#${esc(x)}<button type="button" data-tag="${esc(x)}">${icon("close")}</button></span>`).join("");
        box.innerHTML = tags + tagField.outerHTML;
        const f = $("#tagField", root);
        f.focus();
        f.addEventListener("keydown", onTag);
        $$("[data-tag]", box).forEach((b) =>
          b.addEventListener("click", () => {
            state.upload.tags = state.upload.tags.filter((x) => x !== b.dataset.tag);
            drawTags();
          })
        );
      };
      function onTag(e) {
        if (e.key !== "Enter" && e.key !== ",") return;
        e.preventDefault();
        const v = e.target.value.trim().replace(/^#/, "");
        if (!v) return;
        if (u.tags.length >= 4) {
          U.toast("태그는 최대 4개까지 추가할 수 있어요");
          return;
        }
        if (!u.tags.includes(v)) u.tags.push(v);
        e.target.value = "";
        drawTags();
      }
      if (tagField) tagField.addEventListener("keydown", onTag);
      $$("[data-tag]", root).forEach((b) =>
        b.addEventListener("click", () => {
          state.upload.tags = state.upload.tags.filter((x) => x !== b.dataset.tag);
          drawTags();
        })
      );

      $("#upCancel", root).addEventListener("click", () => (location.hash = "posts"));

      $("#uploadForm", root).addEventListener("submit", (e) => {
        e.preventDefault();
        const title = $("#upTitle", root);
        const caption = $("#upCaption", root);
        const date = $("#upDate", root).value || todayIso();
        [title, caption].forEach((x) => x.classList.remove("invalid"));
        if (title.value.trim().length < 2) {
          title.classList.add("invalid");
          title.focus();
          U.toast("제목을 2자 이상 입력해주세요");
          return;
        }
        if (caption.value.trim().length < 5) {
          caption.classList.add("invalid");
          caption.focus();
          U.toast("설명을 5자 이상 입력해주세요");
          return;
        }
        const type = $("#upType", root).value;
        const post = {
          id: "up-" + Date.now(),
          traineeId: t.id,
          type,
          title: title.value.trim(),
          caption: caption.value.trim(),
          date,
          tags: u.tags.slice(),
          likes: 0,
          duration: type === "video" ? "00:00" : null,
          media: type === "photo" ? u.dataUrl : null,
          visibility: vis,
        };
        const ok = Store.addPost(post);
        if (!ok) U.toast("저장 공간이 부족해 이번 세션에만 표시됩니다");
        U.toast("기록을 저장했습니다");
        state.upload = { dataUrl: null, type: "photo", duration: null, fileName: "", tags: [] };
        if (location.hash === "#posts") route();
        else location.hash = "posts";
      });
    },
  };

  TRAINEE.comments = {
    html() {
      const t = myTrainee();
      const posts = Store.postsOf(t.id);
      const incoming = posts
        .flatMap((p) => Store.comments(p.id).map((c) => ({ ...c, post: p })))
        .sort((a, b) => ((a.ts || 0) < (b.ts || 0) ? 1 : -1));
      const mine = Store.myComments();
      return `
        ${pageHead({
          eyebrow: "SUPPORT & COMMENT",
          title: "응원 · 댓글",
          desc: "내 기록에 도착한 응원과 내가 남긴 피드백을 한 곳에서 확인합니다.",
          actions: `<a class="btn btn-ghost btn-sm" href="profile.html?id=${t.id}">${icon("eye")} 공개 프로필</a>`,
        })}
        <div class="dash-grid even">
          ${card({
            title: "내 기록에 달린 응원",
            sub: `${incoming.length}개의 댓글`,
            body: incoming.length
              ? `<div class="row-list">${incoming
                  .slice(0, 12)
                  .map(
                    (c) => `<div class="comment-row ${c.role === "ent" ? "ent" : ""}">
                      <div class="cr-avatar">${esc(initial(c.author))}</div>
                      <div class="cr-body">
                        <div class="cr-top"><b>${esc(c.author)}</b><span>${esc(roleName(c.role))}</span>${c.role === "ent" ? `<span class="badge violet" style="height:18px;font-size:7px;padding:0 5px">기획사</span>` : ""}</div>
                        <p>${esc(c.text)}</p>
                        <button class="cr-post" data-open-post="${esc(c.post.id)}">${icon("layers")} ${esc(c.post.title)} · ${rel(c.date)}</button>
                      </div>
                    </div>`
                  )
                  .join("")}</div>`
              : empty("아직 응원이 없어요", "기록을 올리면 팬과 기획사의 응원이 도착합니다"),
          })}
          ${card({
            title: "내가 남긴 댓글",
            sub: `${mine.length}개의 기록`,
            body: mine.length
              ? `<div class="row-list">${mine
                  .slice(0, 10)
                  .map((c) => {
                    const p = Store.post(c.postId);
                    return `<div class="comment-row trainee">
                      <div class="cr-avatar">${esc(initial(session.name))}</div>
                      <div class="cr-body">
                        <div class="cr-top"><b>${esc(c.author)}</b><span>${dateKo(c.date)}</span></div>
                        <p>${esc(c.text)}</p>
                        ${p ? `<button class="cr-post" data-open-post="${esc(p.id)}">${icon("layers")} ${esc(p.title)}</button>` : ""}
                      </div>
                    </div>`;
                  })
                  .join("")}</div>`
              : empty("남긴 댓글이 없어요", "다른 연습생의 기록에 응원을 남겨보세요"),
          })}
        </div>
        <div class="card" style="margin-top:12px">
          <div class="card-head"><div class="ch-txt"><h3>응원 키워드</h3><span>최근 댓글에서 자주 언급된 단어</span></div><span class="badge">DEMO ANALYSIS</span></div>
          <div class="flex gap-8" style="flex-wrap:wrap">
            ${["고음", "루틴", "새벽", "호흡", "라이브", "표정", "꾸준함", "월말평가"].map((k, i) => `<span class="tag" style="font-size:${13 - i * 0.5}px">#${k}</span>`).join("")}
          </div>
          <p style="font-size:10.5px;color:var(--faint);line-height:1.7;margin-top:14px">응원 키워드는 기록의 강점을 팬에게 설명하는 데 활용됩니다. 부정적·민감한 표현은 집계에서 제외됩니다.</p>
        </div>`;
    },
    bind(root) {
      $$("[data-open-post]", root).forEach((b) => b.addEventListener("click", () => U.openPost(b.dataset.openPost, { onChange: route })));
    },
  };

  TRAINEE.profile = {
    html() {
      const t = myTrainee();
      const vis = t.visibility || { public: true, records: true, egi: false, comments: true };
      const on = (k) => (vis[k] ? " on" : "");
      const pressed = (k) => (vis[k] ? "true" : "false");
      return `
        ${pageHead({
          eyebrow: "PROFILE SETTINGS",
          title: "프로필 설정",
          desc: "공개 프로필과 기록의 노출 범위를 관리합니다.",
          actions: `<a class="btn btn-ghost btn-sm" href="profile.html?id=${t.id}">${icon("external")} 공개 프로필</a>`,
        })}
        <div class="dash-grid wide-right">
          ${card({
            title: "공개 링크",
            sub: "이 링크를 기획사·팬에게 공유하세요",
            body: `<div class="pub-link">${icon("external")}<span>profile.html?id=${t.id}</span><button id="copyLink">복사</button></div>
              <div style="margin-top:16px">
                <div class="avatar-edit">
                  <div class="ae-art">${art(t)}</div>
                  <div class="ae-txt"><b>${esc(t.name)}</b><span>${esc(t.position)} · ${esc(t.agency)}</span><button class="btn btn-ghost btn-sm" id="shuffleArt">커버 아트 변경</button></div>
                </div>
              </div>
              <div style="margin-top:16px">
                <div class="card-head"><div class="ch-txt"><h3>공개 범위</h3><span>민감 정보는 기본 비공개입니다</span></div></div>
                <div class="toggle-row"><div><b>공개 프로필</b><span>이름·포지션·대표 기록을 누구나 열람</span></div><button class="switch${on("public")}" data-switch="public" aria-pressed="${pressed("public")}"></button></div>
                <div class="toggle-row"><div><b>기록 전체 공개</b><span>사진·영상을 팬에게 공개</span></div><button class="switch${on("records")}" data-switch="records" aria-pressed="${pressed("records")}"></button></div>
                <div class="toggle-row"><div><b>EGI 원점수</b><span>소속사에만 제공 (팬은 구간만)</span></div><button class="switch${on("egi")}" data-switch="egi" aria-pressed="${pressed("egi")}"></button></div>
                <div class="toggle-row"><div><b>댓글 허용</b><span>팬·기획사의 응원 댓글 받기</span></div><button class="switch${on("comments")}" data-switch="comments" aria-pressed="${pressed("comments")}"></button></div>
              </div>`,
          })}
          <form class="card profile-form" id="profileForm">
            <div class="card-head" style="margin:0"><div class="ch-txt"><h3>기본 정보</h3><span>공개 프로필에 즉시 반영됩니다</span></div><span class="badge lime">${t.years}년차</span></div>
            <div class="form-grid-2">
              <div class="field"><label for="pfName">활동명</label><input class="input" id="pfName" value="${esc(t.name)}" maxlength="20"></div>
              <div class="field"><label for="pfPosition">포지션</label><input class="input" id="pfPosition" value="${esc(t.position)}" maxlength="20"></div>
            </div>
            <div class="form-grid-2">
              <div class="field"><label for="pfAgency">소속사</label><input class="input" id="pfAgency" value="${esc(t.agency)}" maxlength="30"></div>
              <div class="field"><label for="pfYears">연습 기간</label><input class="input" id="pfYears" type="number" min="1" max="12" value="${t.years}"></div>
            </div>
            <div class="field"><label for="pfTagline">한 줄 소개</label><input class="input" id="pfTagline" value="${esc(t.tagline)}" maxlength="60"></div>
            <div class="field"><label for="pfBio">소개</label><textarea class="textarea" id="pfBio" rows="5" maxlength="420">${esc(t.bio)}</textarea></div>
            <div class="field"><label for="pfTags">태그 <span style="color:var(--faint);font-weight:400">(쉼표로 구분)</span></label><input class="input" id="pfTags" value="${esc((t.tags || []).join(", "))}"></div>
            <div class="upload-actions">
              <span class="note">${icon("lock")} 이름·소속사 변경은 데모에만 반영됩니다</span>
              <button class="btn btn-ghost" type="reset">되돌리기</button>
              <button class="btn btn-primary" type="submit">${icon("check")} 저장</button>
            </div>
          </form>
        </div>`;
    },
    bind(root) {
      $$("[data-switch]", root).forEach((b) =>
        b.addEventListener("click", () => {
          const on = !b.classList.contains("on");
          b.classList.toggle("on", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
          const t = myTrainee();
          Store.saveProfile(t.id, { visibility: { ...(t.visibility || {}), [b.dataset.switch]: on } });
          U.toast(on ? "공개로 설정했습니다" : "비공개로 설정했습니다");
        })
      );
      let seed = Math.floor(Math.random() * 8);
      $("#shuffleArt", root).addEventListener("click", () => {
        seed = (seed + 1) % 8;
        Store.saveProfile(myTrainee().id, { art: seed });
        route();
        U.toast("커버 아트를 변경했습니다");
      });
      $("#copyLink", root).addEventListener("click", () => U.copy(location.href.replace(/[^/\\]+$/, "profile.html?id=" + myTrainee().id)));
      $("#profileForm", root).addEventListener("submit", (e) => {
        e.preventDefault();
        const name = $("#pfName", root).value.trim();
        if (name.length < 2) {
          U.toast("활동명을 2자 이상 입력해주세요");
          return;
        }
        Store.saveProfile(myTrainee().id, {
          name,
          position: $("#pfPosition", root).value.trim(),
          agency: $("#pfAgency", root).value.trim(),
          years: Number($("#pfYears", root).value) || 1,
          tagline: $("#pfTagline", root).value.trim(),
          bio: $("#pfBio", root).value.trim(),
          tags: $("#pfTags", root)
            .value.split(",")
            .map((x) => x.trim())
            .filter(Boolean)
            .slice(0, 6),
        });
        const updated = myTrainee();
        $$(".side-role b").forEach((el) => (el.textContent = updated.name));
        $$(".side-role .sr-avatar").forEach((el) => (el.textContent = initial(updated.name)));
        $$(".u-name").forEach((el) => (el.textContent = updated.name));
        $$(".u-avatar").forEach((el) => (el.textContent = initial(updated.name)));
        U.toast("프로필을 저장했습니다");
        route();
      });
    },
  };

  /* =======================================================
     FAN
  ======================================================= */
  const FAN = {};

  FAN.feed = {
    html() {
      const favs = Store.favorites("fan").map((id) => Store.trainee(id));
      const ids = favs.map((t) => t.id);
      let posts = Store.allPosts().filter((p) => ids.includes(p.traineeId));
      if (state.filter !== "all") posts = posts.filter((p) => p.type === state.filter);
      const totalLikes = posts.reduce((a, p) => a + Store.likeCount(p), 0);
      const ev = nextEvent();
      return `
        ${pageHead({
          eyebrow: "FAN / " + esc(session.name),
          title: "관심 연습생의 새 기록",
          desc: `${dateKo(todayIso())} · 응원 중인 연습생 <b>${favs.length}명</b>의 최신 소식입니다.`,
          actions: `<a class="btn btn-ghost btn-sm" href="#discover">${icon("search")} 연습생 찾기</a><a class="btn btn-primary btn-sm" href="#membership">${icon("star")} 멤버십</a>`,
        })}
        <div class="card" style="margin-bottom:12px">
          <div class="card-head">
            <div class="ch-txt"><h3>최신 피드</h3><span>${posts.length} POSTS · 관심 연습생만</span></div>
            <div class="ch-actions">${chipRow([{ key: "filter", value: "all", label: "전체" }, { key: "filter", value: "photo", label: "사진" }, { key: "filter", value: "video", label: "영상" }], state.filter)}</div>
          </div>
          ${posts.length ? postCards(posts, {}) : empty("표시할 기록이 없어요", "관심 연습생을 추가하거나 필터를 바꿔보세요", `<a class="btn btn-ghost btn-sm" href="#discover">연습생 찾기</a>`)}
        </div>
        <div class="kpi-grid">
          ${kpi({ icon: "heart", label: "관심 연습생", value: favs.length, unit: "명", foot: "무제한 등록 가능" })}
          ${kpi({ icon: "layers", label: "새 기록", value: posts.length, unit: "건", foot: "최근 3주" })}
          ${kpi({ icon: "activity", label: "응원 하트", value: num(totalLikes), foot: "내가 누른 하트 포함" })}
          ${kpi({ icon: "calendar", label: "다음 이벤트", value: dday(ev.date), foot: ev.title })}
        </div>
        <div class="dash-grid">
          ${card({
            title: "관심 연습생",
            sub: "최근 업데이트 순",
            actions: `<a class="link-more" href="#favorites">관리 ${icon("arrow")}</a>`,
            body: favs.length
              ? `<div class="fav-strip">${favs
                  .slice(0, 3)
                  .map((t) => `<a class="fav-card" href="profile.html?id=${t.id}">
                    <div class="fav-art">${art(t, { name: false, meta: false })}</div>
                    <div class="fav-txt"><b>${esc(t.name)}</b><span>${esc(t.position)} · ${esc(t.agency)}</span><div class="mini-metric"><i>EGI ${t.egi}</i><span>팬 ${fans(t.fans)}</span></div></div>
                  </a>`)
                  .join("")}${favs.length < 3 ? `<a class="fav-add" href="#discover">${icon("plus")} 관심 연습생 추가</a>` : ""}</div>`
              : empty("아직 관심 연습생이 없어요", "마음에 드는 연습생을 찾아 응원을 시작해보세요", `<a class="btn btn-primary btn-sm" href="#discover">연습생 찾기</a>`),
            foot: `<span>관심 등록은 응원·알림의 기준이 됩니다</span><span class="mono">${Store.favorites("fan").length} / ∞</span>`,
          })}
          ${card({
            title: "이번 주 응원 리포트",
            sub: "내 관심사 기반 성장 신호",
            body: favs.length
              ? `<div class="fan-compare">${favs
                  .slice()
                  .sort((a, b) => b.egiDelta - a.egiDelta)
                  .map(
                    (t, i) => `<div class="fc-row">
                      <span class="fc-rank">0${i + 1}</span>
                      <div class="fc-main"><div class="fc-top"><b>${esc(t.name)}</b><span>EGI ${t.egi}</span></div><div class="fc-bar"><i style="width:${Math.min(100, t.egi)}%"></i></div></div>
                      <div class="up">+${t.egiDelta}<br><span style="color:var(--faint);font-size:8px">팬 +${num(t.fansDelta)}</span></div>
                    </div>`
                  )
                  .join("")}</div>`
              : empty("데이터가 없어요", "연습생을 등록하면 성장 신호를 보여드려요"),
            foot: `<span>팬 반응은 EGI의 10%만 반영됩니다</span>`,
          })}
        </div>
      `;
    },
    bind(root) {
      U.bindPostOpeners(root, () => route());
      $$("[data-chip]", root).forEach((b) =>
        b.addEventListener("click", () => {
          state.filter = b.dataset.value;
          route();
        })
      );
    },
  };

  FAN.favorites = {
    html() {
      const favs = Store.favorites("fan").map((id) => Store.trainee(id));
      return `
        ${pageHead({
          eyebrow: "MY TRAINEES",
          title: "관심 연습생",
          desc: `응원 중인 <b>${favs.length}명</b>. 관심 목록은 피드·알림·응원 리포트에 반영됩니다.`,
          actions: `<a class="btn btn-primary btn-sm" href="#discover">${icon("plus")} 연습생 추가</a>`,
        })}
        ${
          favs.length
            ? `<div class="explore-grid">${favs
                .map(
                  (t) => `<article class="t-card">
                    <div class="t-card-art">
                      <a href="profile.html?id=${t.id}" style="position:absolute;inset:0;z-index:1" aria-label="${esc(t.name)} 프로필">${art(t, { meta: false })}</a>
                      <button class="t-card-fav on" data-fav="${t.id}" aria-label="관심 해제" aria-pressed="true">${icon("heart")}</button>
                      <span class="t-card-egi">EGI <b>${t.egi}</b></span>
                    </div>
                    <a class="t-card-body" href="profile.html?id=${t.id}">
                      <div class="line"><h3>${esc(t.name)}</h3><span class="en">${esc(t.en)}</span></div>
                      <div class="meta">${esc(t.position)} <i></i> ${esc(t.agency)} <i></i> ${t.age}세</div>
                      <div class="bottom"><span class="fan">${icon("heart")} 팬 <b>${fans(t.fans)}</b></span><span class="up">+${num(t.fansDelta)}</span></div>
                    </a>
                  </article>`
                )
                .join("")}
                <a class="fav-add" href="#discover" style="min-height:100%">${icon("plus")} 새 연습생 찾기</a>
              </div>`
            : empty("관심 연습생이 없어요", "둘러보기에서 마음에 드는 연습생을 찾아보세요", `<a class="btn btn-primary btn-sm" href="explore.html">연습생 둘러보기</a>`)
        }
        <div class="card" style="margin-top:14px">
          <div class="card-head"><div class="ch-txt"><h3>응원 알림 설정</h3><span>관심 연습생의 새 기록을 놓치지 마세요</span></div><span class="badge lime">FAN</span></div>
          <div class="toggle-row"><div><b>새 기록 알림</b><span>사진·영상 업로드 시 알림</span></div><button class="switch on" data-switch aria-pressed="true"></button></div>
          <div class="toggle-row"><div><b>주간 성장 리포트</b><span>매주 월요일 EGI 변화 요약</span></div><button class="switch on" data-switch aria-pressed="true"></button></div>
          <div class="toggle-row"><div><b>이벤트 · 투표 알림</b><span>팬 투표와 생중계 일정</span></div><button class="switch" data-switch aria-pressed="false"></button></div>
        </div>`;
    },
    bind(root) {
      U.bindFavs(root, "fan", () => route());
      $$("[data-switch]", root).forEach((b) =>
        b.addEventListener("click", () => {
          const on = !b.classList.contains("on");
          b.classList.toggle("on", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
          U.toast(on ? "알림을 켰습니다" : "알림을 껐습니다");
        })
      );
    },
  };

  FAN.discover = {
    html() {
      return `
        ${pageHead({
          eyebrow: "DISCOVER TRAINEES",
          title: "연습생 찾기",
          desc: "포지션·성장률·팬 규모로 데뷔 전 연습생을 찾아보세요.",
          actions: `<a class="btn btn-ghost btn-sm" href="explore.html">${icon("external")} 공개 페이지</a>`,
        })}
        <div class="card">
          <div class="card-head" style="flex-wrap:wrap">
            <div class="ch-actions" id="posFilters">${MD.positions.map((p) => `<button class="chip ${state.pos === p ? "on" : ""}" data-pos="${esc(p)}">${esc(p)}</button>`).join("")}</div>
            <div class="ch-actions">
              <select class="select" id="sortSelect" style="height:34px;min-height:34px;font-size:11px">
                <option value="egi" ${state.sort === "egi" ? "selected" : ""}>EGI 높은 순</option>
                <option value="growth" ${state.sort === "growth" ? "selected" : ""}>성장률 순</option>
                <option value="fans" ${state.sort === "fans" ? "selected" : ""}>팬 많은 순</option>
                <option value="name" ${state.sort === "name" ? "selected" : ""}>이름 순</option>
              </select>
              <span class="label" id="discoverCount">${MD.trainees.length} TRAINEES</span>
            </div>
          </div>
          <div id="discoverGrid"></div>
        </div>`;
    },
    bind(root) {
      const grid = $("#discoverGrid", root);
      const draw = () => {
        let list = Store.allTrainees();
        if (state.pos !== "전체") list = list.filter((t) => t.positions.includes(state.pos) || t.position.includes(state.pos));
        if (state.q) {
          const q = state.q.toLowerCase();
          list = list.filter((t) => [t.name, t.en, t.position, ...(t.positions || []), ...(t.tags || []), t.agency].join(" ").toLowerCase().includes(q));
        }
        list.sort({ egi: (a, b) => b.egi - a.egi, growth: (a, b) => b.egiDelta - a.egiDelta, fans: (a, b) => b.fans - a.fans, name: (a, b) => a.name.localeCompare(b.name, "ko") }[state.sort]);
        $("#discoverCount", root).textContent = list.length + " TRAINEES";
        if (!list.length) {
          grid.innerHTML = empty("조건에 맞는 연습생이 없어요", "검색어나 필터를 바꿔보세요", `<button class="btn btn-ghost btn-sm" id="resetDiscover">필터 초기화</button>`);
          $("#resetDiscover", root).addEventListener("click", () => {
            state.q = "";
            state.pos = "전체";
            const s = $("#globalSearch");
            if (s) s.value = "";
            route();
          });
          return;
        }
        grid.innerHTML = `<div class="explore-grid">${list
          .map(
            (t) => `<article class="t-card">
              <div class="t-card-art">
                <a href="profile.html?id=${t.id}" style="position:absolute;inset:0;z-index:1" aria-label="${esc(t.name)} 프로필">${art(t, { meta: false })}</a>
                <button class="t-card-fav ${Store.isFav("fan", t.id) ? "on" : ""}" data-fav="${t.id}" aria-label="${esc(t.name)} 관심 등록" aria-pressed="${Store.isFav("fan", t.id)}">${icon("heart")}</button>
                <span class="t-card-egi">EGI <b>${t.egi}</b></span>
              </div>
              <a class="t-card-body" href="profile.html?id=${t.id}">
                <div class="line"><h3>${esc(t.name)}</h3><span class="en">${esc(t.en)}</span></div>
                <div class="meta">${esc(t.position)} <i></i> ${esc(t.agency)} <i></i> ${t.age}세</div>
                <div class="bottom"><span class="fan">${icon("heart")} 팬 <b>${fans(t.fans)}</b></span><span class="up">+${num(t.fansDelta)}</span></div>
              </a>
            </article>`
          )
          .join("")}</div>`;
        U.bindFavs(grid, "fan");
      };
      draw();
      $$("[data-pos]", root).forEach((b) =>
        b.addEventListener("click", () => {
          state.pos = b.dataset.pos;
          route();
        })
      );
      $("#sortSelect", root).addEventListener("change", (e) => {
        state.sort = e.target.value;
        route();
      });
    },
  };

  FAN.membership = {
    html() {
      const plan = MD.plans.find((p) => p.id === "fan");
      const favs = Store.favorites("fan").length;
      const monthly = state.billing === "monthly";
      return `
        ${pageHead({
          eyebrow: "MEMBERSHIP",
          title: "팬 멤버십",
          desc: "데뷔 전부터 응원하고, 가장 먼저 기록을 받아보세요.",
          actions: `<a class="btn btn-ghost btn-sm" href="index.html#pricing">${icon("star")} 요금제 비교</a>`,
        })}
        <div class="dash-grid">
          ${card({
            cls: "flush",
            body: `<div class="member-card" style="border-radius:16px;min-height:100%">
              <div class="mc-top"><span class="mc-plan">MY IDOL · FAN</span><span class="badge" style="background:rgba(10,10,12,.1);border-color:rgba(10,10,12,.2);color:#0c0d08">ACTIVE</span></div>
              <h3>${esc(session.name)}님의<br>응원 멤버십</h3>
              <p>관심 연습생 ${favs}명 · 다음 결제일 ${dateKo(MD.daysFromNow(30))} · 언제든 해지 가능</p>
              <div class="mc-foot"><span class="mc-num">NO. ${String(1024 + favs).padStart(4, "0")} · DEMO</span><a class="btn" href="#feed">피드로 이동 ${icon("arrow")}</a></div>
            </div>`,
          })}
          ${card({
            title: "현재 플랜",
            sub: "FAN MEMBERSHIP",
            actions: `<div class="billing-toggle" style="height:28px"><button data-billing="monthly" class="${monthly ? "on" : ""}">월간</button><button data-billing="yearly" class="${!monthly ? "on" : ""}">연간</button></div>`,
            body: `<div style="font-family:var(--font-mono)"><b style="font-size:34px;font-weight:500;letter-spacing:-.05em">${num(monthly ? plan.monthly : plan.yearly)}</b><span style="font-size:11px;color:var(--muted)"> 원 / ${monthly ? "월" : "년"}</span></div>
              <p style="font-size:11px;color:var(--muted);line-height:1.7;margin-top:6px">${esc(plan.desc)}</p>
              <ul class="plan-features" style="margin-top:14px;border-top:1px solid var(--line);padding-top:14px">
                ${plan.features.map((f) => `<li>${esc(f)}</li>`).join("")}
              </ul>`,
            foot: `<span>${monthly ? "연간 결제 시 2개월 무료" : "연간 결제 적용 중"}</span><button class="btn btn-primary btn-sm" id="changePlan">${icon("refresh")} 플랜 변경</button>`,
          })}
        </div>
        <div class="dash-grid even">
          ${card({
            title: "이번 달 응원 활동",
            sub: "내가 만든 팬 신호",
            body: `<div class="data-grid">
              <div class="data-cell"><span>응원 하트</span><b>${num(96 + favs * 12)}</b></div>
              <div class="data-cell"><span>남긴 댓글</span><b>${Store.myComments().length}</b></div>
              <div class="data-cell"><span>관심 연습생</span><b>${favs}</b></div>
              <div class="data-cell"><span>연속 응원</span><b>12<em>일</em></b></div>
            </div>
            <p style="font-size:10.5px;color:var(--faint);line-height:1.7;margin-top:14px">응원 활동은 연습생의 팬 반응 지표에 반영됩니다. 스팸성 반복 활동은 집계에서 제외됩니다.</p>`,
          })}
          ${card({
            title: "멤버십 혜택",
            sub: "FAN 전용",
            body: `<div class="row-list">
              ${[
                ["heart", "관심 연습생 무제한", "피드·알림·응원"],
                ["layers", "전체 사진·영상 열람", "공개 기록 무제한"],
                ["comment", "응원 하트·댓글", "직접 응원 메시지"],
                ["star", "월간 응원 배지", "프로필에 표시"],
                ["calendar", "팬 투표 우선 참여", "월말평가 30% 반영"],
              ]
                .map(([ic, ttl, sub]) => `<div class="row-item"><div class="row-avatar round" style="display:grid;place-items:center;color:var(--lime);background:rgba(216,255,74,.08)">${icon(ic)}</div><div class="row-txt"><b>${ttl}</b><span>${sub}</span></div>${icon("check")}</div>`)
                .join("")}
            </div>`,
            foot: `<span>데모에서는 결제가 발생하지 않습니다</span><button class="link-more" id="cancelPlan">해지</button>`,
          })}
        </div>`;
    },
    bind(root) {
      $$("[data-billing]", root).forEach((b) =>
        b.addEventListener("click", () => {
          state.billing = b.dataset.billing;
          route();
        })
      );
      const change = $("#changePlan", root);
      if (change) change.addEventListener("click", () => U.toast("데모에서는 플랜이 즉시 변경됩니다"));
      const cancel = $("#cancelPlan", root);
      if (cancel)
        cancel.addEventListener("click", () =>
          U.openModal(
            `<h3>멤버십을 해지할까요?</h3><p class="sub">다음 결제일까지 혜택이 유지됩니다. 데모에서는 실제 결제가 없습니다.</p>
             <div class="flex gap-8" style="justify-content:flex-end;margin-top:20px"><button class="btn btn-ghost" data-close>유지</button><button class="btn btn-primary" id="doCancel">해지</button></div>`,
            {
              onOpen(box) {
                box.querySelector("#doCancel").addEventListener("click", () => {
                  U.closeModal();
                  U.toast("데모 멤버십은 유지됩니다");
                });
              },
            }
          )
        );
    },
  };

  /* =======================================================
     ENT
  ======================================================= */
  const ENT = {};

  function entList() {
    let list = Store.allTrainees();
    if (state.pos !== "전체") list = list.filter((t) => t.positions.includes(state.pos) || t.position.includes(state.pos));
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter((t) => [t.name, t.en, t.position, ...(t.positions || []), ...(t.tags || []), t.agency].join(" ").toLowerCase().includes(q));
    }
    list.sort({ egi: (a, b) => b.egi - a.egi, growth: (a, b) => b.egiDelta - a.egiDelta, fans: (a, b) => b.fans - a.fans, name: (a, b) => a.name.localeCompare(b.name, "ko") }[state.sort]);
    return list;
  }

  function selectedTrainee() {
    const favs = Store.favorites("ent");
    if (!state.selected) state.selected = favs[0] || "doyun";
    return Store.trainee(state.selected);
  }

  function scoutRow(t) {
    const fav = Store.isFav("ent", t.id);
    return `<tr data-pick="${t.id}" class="${state.selected === t.id ? "on" : ""}">
      <td><div class="st-cell">${artThumb(t)}<div><b>${esc(t.name)}</b><span>${esc(t.position)} · ${t.years}년차</span></div></div></td>
      <td class="num"><span class="num egi-val">${t.egi}<em>+${t.egiDelta}</em></span></td>
      <td><div class="mini-bar"><div class="track"><div class="fill" style="width:${Math.min(100, (t.egiDelta / 8) * 100)}%"></div></div><b>${t.egiDelta}</b></div></td>
      <td class="num">${fans(t.fans)}</td>
      <td class="num" style="color:var(--lime)">+${num(t.fansDelta)}</td>
      <td>${esc(t.agency)}</td>
      <td style="text-align:right"><button class="star-btn ${fav ? "on" : ""}" data-fav="${t.id}" aria-label="${esc(t.name)} 관심" aria-pressed="${fav}">${icon("star")}</button></td>
    </tr>`;
  }

  function scoutTable(list) {
    if (!list.length) return empty("조건에 맞는 후보가 없어요", "검색어나 포지션 필터를 바꿔보세요");
    return `<div class="scout-table-wrap"><table class="scout-table">
      <thead><tr><th>TRAINEE</th><th class="num">EGI</th><th>12W GROWTH</th><th class="num">FANS</th><th class="num">FAN +7D</th><th>AGENCY</th><th></th></tr></thead>
      <tbody>${list.map(scoutRow).join("")}</tbody>
    </table></div>`;
  }

  function bindScout(root) {
    U.bindFavs(root, "ent", () => route());
    $$("[data-pick]", root).forEach((tr) =>
      tr.addEventListener("click", (e) => {
        if (e.target.closest("[data-fav]")) return;
        state.selected = tr.dataset.pick;
        route();
      })
    );
  }

  ENT.overview = {
    html() {
      const favs = Store.favorites("ent").map((id) => Store.trainee(id));
      const list = Store.allTrainees().sort((a, b) => b.egi - a.egi);
      const sel = selectedTrainee();
      const avg = list.reduce((a, t) => a + t.egi, 0) / list.length;
      const totalFans = list.reduce((a, t) => a + t.fans, 0);
      const ev = nextEvent();
      return `
        ${pageHead({
          eyebrow: "SCOUT BOARD / " + esc(session.org || "PARTNER"),
          title: "스카우트 보드",
          desc: `${dateKo(todayIso())} · 관심 후보 <b>${favs.length}명</b> · 전체 ${list.length}명 비교`,
          actions: `<a class="btn btn-ghost btn-sm" href="#report">${icon("file")} 리포트</a><a class="btn btn-primary btn-sm" href="#watchlist">${icon("users")} 관심 후보</a>`,
        })}
        <div class="kpi-grid">
          ${kpi({ icon: "star", label: "WATCHLIST", value: favs.length, unit: "명", foot: "스카우트 관심 등록" })}
          ${kpi({ icon: "trend", label: "AVG EGI", value: avg.toFixed(1), foot: `최고 ${list[0].name} ${list[0].egi}`, spark: list[0].egiSeries })}
          ${kpi({ icon: "heart", label: "TOTAL FANS", value: fans(totalFans), foot: `주간 +${num(list.reduce((a, t) => a + t.fansDelta, 0))}` })}
          ${kpi({ icon: "calendar", label: "SCOUT DAY", value: dday(ev.date), foot: ev.title })}
        </div>
        <div class="dash-grid">
          ${card({
            title: "후보 비교",
            sub: "관심 후보 · EGI / 팬 규모",
            actions: `<span class="badge violet">ENT ONLY</span>`,
            body: favs.length
              ? `<div class="fan-compare">${favs
                  .slice()
                  .sort((a, b) => b.egi - a.egi)
                  .map(
                    (t, i) => `<button class="fc-row" data-pick="${t.id}" style="text-align:left">
                      <span class="fc-rank">0${i + 1}</span>
                      <div class="fc-main"><div class="fc-top"><b>${esc(t.name)} <span class="badge" style="height:18px;font-size:7px;padding:0 5px">${esc(t.positions[0])}</span></b><span>${fans(t.fans)}</span></div><div class="fc-bar"><i style="width:${Math.min(100, t.egi)}%"></i></div></div>
                      <div class="up">${t.egi}<br><span style="color:var(--faint);font-size:8px">+${t.egiDelta}</span></div>
                    </button>`
                  )
                  .join("")}</div>`
              : empty("관심 후보가 없어요", "스카우트 테이블에서 별을 눌러 후보를 등록하세요"),
            foot: `<span>EGI는 성장·기록·검증 지표의 가중 합산</span><a class="link-more" href="#watchlist">전체 비교 ${icon("arrow")}</a>`,
          })}
          ${card({
            title: sel.name,
            sub: `${sel.position} · ${sel.agency}`,
            actions: `<a class="link-more" href="profile.html?id=${sel.id}">프로필 ${icon("external")}</a>`,
            body: `<div style="display:flex;gap:14px;align-items:flex-start">
              <div style="width:96px;flex:none;border-radius:10px;overflow:hidden;aspect-ratio:3/4">${art(sel, { name: false, meta: false })}</div>
              <div style="min-width:0;flex:1">
                <div class="data-grid">
                  <div class="data-cell"><span>EGI</span><b>${sel.egi}<em>+${sel.egiDelta}</em></b></div>
                  <div class="data-cell"><span>FANS</span><b>${fans(sel.fans)}</b></div>
                </div>
                <div class="skill-bars" style="margin-top:14px">${skillBars(sel, ["vocal", "dance", "expression"])}</div>
              </div>
            </div>
            <div class="field" style="margin-top:16px"><label for="ovMemo">스카우트 메모</label><textarea class="memo-box" id="ovMemo" placeholder="검토 메모를 남겨주세요">${esc(Store.memo(sel.id))}</textarea></div>
            <div class="flex items-center gap-8" style="margin-top:10px"><button class="btn btn-primary btn-sm" id="ovMemoSave">${icon("check")} 메모 저장</button><span class="mono" style="font-size:8px;color:var(--faint)">나에게만 보입니다</span></div>`,
          })}
        </div>
        <div class="card">
          <div class="card-head"><div class="ch-txt"><h3>전체 후보</h3><span>EGI 높은 순 · 행을 클릭하면 상세 메모</span></div><div class="ch-actions"><a class="link-more" href="#analytics">팬 분석 ${icon("arrow")}</a></div></div>
          ${scoutTable(list.slice(0, 6))}
        </div>`;
    },
    bind(root) {
      bindScout(root);
      const save = $("#ovMemoSave", root);
      if (save)
        save.addEventListener("click", () => {
          Store.setMemo(state.selected, $("#ovMemo", root).value);
          U.toast("스카우트 메모를 저장했습니다");
        });
    },
  };

  ENT.watchlist = {
    html() {
      const list = entList();
      const favs = Store.favorites("ent").length;
      return `
        ${pageHead({
          eyebrow: "WATCHLIST",
          title: "관심 후보",
          desc: `등록 <b>${favs}명</b> · 전체 ${list.length}명 중 검색 결과`,
          actions: `<button class="btn btn-ghost btn-sm" id="compareBtn">${icon("chart")} 비교 보기</button><a class="btn btn-primary btn-sm" href="#report">${icon("file")} 리포트</a>`,
        })}
        <div class="card">
          <div class="card-head" style="flex-wrap:wrap">
            <div class="ch-actions">${MD.positions.map((p) => `<button class="chip ${state.pos === p ? "on" : ""}" data-pos="${esc(p)}">${esc(p)}</button>`).join("")}</div>
            <div class="ch-actions">
              <select class="select" id="sortSelect" style="height:34px;min-height:34px;font-size:11px">
                <option value="egi" ${state.sort === "egi" ? "selected" : ""}>EGI 순</option>
                <option value="growth" ${state.sort === "growth" ? "selected" : ""}>성장률 순</option>
                <option value="fans" ${state.sort === "fans" ? "selected" : ""}>팬 순</option>
                <option value="name" ${state.sort === "name" ? "selected" : ""}>이름 순</option>
              </select>
              <span class="label">${list.length} CANDIDATES</span>
            </div>
          </div>
          ${scoutTable(list)}
          <div class="card-foot"><span>${icon("star")} 별 버튼으로 관심 후보 등록 · 행 클릭으로 선택</span><span class="mono">EGI VERIFIED</span></div>
        </div>
        <div class="dash-grid even" style="margin-top:12px">
          ${card({
            title: "선택 후보 요약",
            sub: selectedTrainee().name,
            body: (() => {
              const t = selectedTrainee();
              return `<div class="row-item" style="border:0;padding:0">
                <div class="row-avatar">${art(t, { name: false, meta: false })}</div>
                <div class="row-txt"><b>${esc(t.name)}</b><span>${esc(t.position)} · ${esc(t.agency)} · ${t.years}년차</span></div>
                <div class="row-right"><b>${t.egi}</b><span>EGI</span></div>
              </div>
              <div class="data-grid" style="margin-top:14px">
                <div class="data-cell"><span>주간 성장</span><b>+${t.egiDelta}</b></div>
                <div class="data-cell"><span>팬</span><b>${fans(t.fans)}</b></div>
                <div class="data-cell"><span>주간 팬</span><b>+${num(t.fansDelta)}</b></div>
                <div class="data-cell"><span>기록</span><b>${Store.postsOf(t.id).length}</b></div>
              </div>`;
            })(),
            foot: `<span>${esc(selectedTrainee().tagline)}</span><a class="link-more" href="profile.html?id=${selectedTrainee().id}">프로필 ${icon("external")}</a>`,
          })}
          ${card({
            title: "검토 메모",
            sub: "선택 후보 · 비공개",
            body: `<textarea class="memo-box" id="wlMemo">${esc(Store.memo(selectedTrainee().id))}</textarea><div class="flex gap-8" style="margin-top:10px"><button class="btn btn-ghost btn-sm" id="wlMemoSave">${icon("check")} 저장</button><span class="mono" style="font-size:8px;color:var(--faint)">PDF 리포트에 포함됩니다</span></div>`,
          })}
        </div>`;
    },
    bind(root) {
      bindScout(root);
      $$("[data-pos]", root).forEach((b) =>
        b.addEventListener("click", () => {
          state.pos = b.dataset.pos;
          route();
        })
      );
      $("#sortSelect", root).addEventListener("change", (e) => {
        state.sort = e.target.value;
        route();
      });
      const save = $("#wlMemoSave", root);
      if (save)
        save.addEventListener("click", () => {
          Store.setMemo(selectedTrainee().id, $("#wlMemo", root).value);
          U.toast("메모를 저장했습니다");
        });
      $("#compareBtn", root).addEventListener("click", () => (location.hash = "analytics"));
    },
  };

  ENT.analytics = {
    html() {
      const list = Store.allTrainees().sort((a, b) => b.fans - a.fans);
      const sel = selectedTrainee();
      const maxFans = list[0].fans;
      const posGroups = MD.positions
        .filter((p) => p !== "전체")
        .map((p) => ({ p, n: Store.allTrainees().filter((t) => t.positions.includes(p)).length }));
      const totalPos = posGroups.reduce((a, b) => a + b.n, 0);
      const split = sel.fanSplit || [40, 30, 18, 12];
      return `
        ${pageHead({
          eyebrow: "FAN & GROWTH ANALYTICS",
          title: "팬 · 성장 분석",
          desc: "후보의 팬 규모·증가율·구성을 비교합니다. 민감 속성은 제외됩니다.",
          actions: `<a class="btn btn-ghost btn-sm" href="#report">${icon("file")} 리포트</a><button class="btn btn-primary btn-sm" id="exportCsv">${icon("download")} CSV</button>`,
        })}
        <div class="kpi-grid">
          ${kpi({ icon: "heart", label: "TOTAL FANS", value: fans(list.reduce((a, t) => a + t.fans, 0)), foot: "전체 후보 합산" })}
          ${kpi({ icon: "activity", label: "WEEKLY ADD", value: "+" + num(list.reduce((a, t) => a + t.fansDelta, 0)), foot: "주간 신규 팬" })}
          ${kpi({ icon: "trend", label: "AVG EGI", value: (list.reduce((a, t) => a + t.egi, 0) / list.length).toFixed(1), foot: "전체 후보 평균" })}
          ${kpi({ icon: "star", label: "TOP GROWTH", value: list.slice().sort((a, b) => b.egiDelta - a.egiDelta)[0].name, foot: "+" + list.slice().sort((a, b) => b.egiDelta - a.egiDelta)[0].egiDelta + " EGI" })}
        </div>
        <div class="dash-grid">
          ${card({
            title: "팬 규모 비교",
            sub: "전체 후보 · 주간 증가",
            body: `<div class="fan-compare">${list
              .map(
                (t, i) => `<div class="fc-row">
                  <span class="fc-rank">${String(i + 1).padStart(2, "0")}</span>
                  <div class="fc-main"><div class="fc-top"><b>${esc(t.name)}</b><span>${num(t.fans)}</span></div><div class="fc-bar"><i style="width:${(t.fans / maxFans) * 100}%"></i></div></div>
                  <div class="up">+${num(t.fansDelta)}</div>
                </div>`
              )
              .join("")}</div>`,
            foot: `<span>팬 수는 응원 계정 기준</span><span class="mono">N=${list.length}</span>`,
          })}
          ${card({
            title: "선택 후보 · " + esc(sel.name),
            sub: "팬 증가 추이 · 12주",
            actions: `<span class="badge violet">EGI ${sel.egi}</span>`,
            body: U.lineChart(sel.fanSeries, { height: 180, labels: weekLabels(12), color: "#8b6cff", footLeft: "12 WEEKS AGO", footRight: "NOW" }),
            foot: `<span>총 팬 ${num(sel.fans)}</span>${up(sel.fansDelta, "명")}`,
          })}
        </div>
        <div class="dash-grid even">
          ${card({
            title: "팬 구성 · " + esc(sel.name),
            sub: "자발적 공개 기준",
            body: ["10대", "20대", "30대", "40대+"]
              .map((lab, i) => `<div class="demo-row" style="margin-bottom:12px"><span class="d-label">${lab}</span><div class="d-track"><i style="width:${split[i]}%"></i></div><b>${split[i]}%</b></div>`)
              .join(""),
            foot: `<span>성별·외모·체형은 수집하지 않습니다</span>`,
          })}
          ${card({
            title: "포지션 분포",
            sub: "전체 후보 기준",
            body: posGroups
              .map((g) => `<div class="demo-row" style="margin-bottom:12px"><span class="d-label">${esc(g.p)}</span><div class="d-track"><i style="width:${(g.n / totalPos) * 100}%"></i></div><b>${g.n}</b></div>`)
              .join(""),
            foot: `<span>중복 포지션 포함</span>`,
          })}
        </div>
        <div class="card">
          <div class="card-head"><div class="ch-txt"><h3>성장 신호 테이블</h3><span>클릭으로 후보 선택</span></div><span class="label">WEEKLY</span></div>
          ${scoutTable(list)}
        </div>`;
    },
    bind(root) {
      bindScout(root);
      $("#exportCsv", root).addEventListener("click", () => {
        const rows = [["name", "position", "agency", "egi", "egiDelta", "fans", "fansDelta", "years"]];
        Store.allTrainees().forEach((t) => rows.push([t.name, t.position, t.agency, t.egi, t.egiDelta, t.fans, t.fansDelta, t.years]));
        const csv = "\ufeff" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        downloadFile("myidol-scout-data.csv", csv, "text/csv");
        U.toast("CSV를 내려받았습니다");
      });
    },
  };

  ENT.report = {
    html() {
      const t = selectedTrainee();
      const posts = Store.postsOf(t.id);
      const hrs = totalHours(t);
      const split = t.fanSplit || [40, 30, 18, 12];
      return `
        ${pageHead({
          eyebrow: "SCOUT REPORT",
          title: "스카우트 리포트",
          desc: "선택한 후보를 한 장의 검토 문서로 정리합니다. 인쇄하거나 HTML로 저장할 수 있습니다.",
          actions: `<select class="select" id="reportPick" style="height:38px;min-height:38px;font-size:12px;max-width:180px">
            ${Store.allTrainees().map((x) => `<option value="${x.id}" ${x.id === t.id ? "selected" : ""}>${esc(x.name)} · ${esc(x.position)}</option>`).join("")}
          </select><button class="btn btn-ghost btn-sm" id="printRpt">${icon("file")} 인쇄</button><button class="btn btn-primary btn-sm" id="saveRpt">${icon("download")} HTML 저장</button>`,
        })}
        <div class="report-preview" id="reportPreview">
          <div class="rp-top">
            <div><div class="rp-logo">MY<span>IDOL</span> / SCOUT REPORT</div><div style="font-family:var(--font-mono);font-size:8px;color:#6c6a63;margin-top:4px;letter-spacing:.08em">PRE-DEBUT TRAINEE EVALUATION</div></div>
            <div class="rp-meta">REPORT NO. ${String(1240 + t.id.length * 7).padStart(4, "0")}<br>${dateKo(todayIso())}<br>CONFIDENTIAL</div>
          </div>
          <h3>${esc(t.name)} <span style="font-size:13px;color:#6c6a63;font-weight:500">${esc(t.en)}</span></h3>
          <p class="rp-sub">${esc(t.position)} · ${esc(t.agency)} · ${t.years}년차 · ${t.age}세</p>
          <div class="rp-stats">
            <div class="rp-stat"><span>EGI SCORE</span><b>${t.egi}</b></div>
            <div class="rp-stat"><span>12W GROWTH</span><b>+${(t.egi - t.egiSeries[0]).toFixed(1)}</b></div>
            <div class="rp-stat"><span>TOTAL FANS</span><b>${num(t.fans)}</b></div>
          </div>
          <div style="display:grid;grid-template-columns:1.15fr .85fr;gap:20px;margin-top:20px">
            <div>
              <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.14em;color:#6c6a63;margin-bottom:8px">SKILL PROFILE</div>
              <div class="rp-bars">
                ${MD.skillKeys.map((k) => `<div class="rp-bar"><span>${MD.skillLabels[k]}</span><div class="t"><div class="f" style="width:${t.skills[k]}%"></div></div><b>${t.skills[k]}</b></div>`).join("")}
              </div>
              <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.14em;color:#6c6a63;margin:18px 0 8px">EGI · 12 WEEKS</div>
              ${U.lineChart(t.egiSeries, { height: 130, color: "#8a0f2e" })}
            </div>
            <div>
              <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.14em;color:#6c6a63;margin-bottom:8px">FAN DEMOGRAPHICS</div>
              ${["10대", "20대", "30대", "40대+"]
                .map((lab, i) => `<div class="rp-bar" style="grid-template-columns:32px 1fr 24px;margin-bottom:7px"><span>${lab}</span><div class="t"><div class="f" style="width:${split[i]}%;background:#8a0f2e"></div></div><b>${split[i]}%</b></div>`)
                .join("")}
              <div style="margin-top:18px;font-family:var(--font-mono);font-size:7px;letter-spacing:.14em;color:#6c6a63">RECENT ACTIVITY</div>
              <div style="font-size:8px;color:#444;line-height:1.8;margin-top:6px">
                ${posts
                  .slice(0, 4)
                  .map((p) => `· ${dateKo(p.date).slice(5)} ${esc(p.title)}`)
                  .join("<br>")}
              </div>
              <div style="margin-top:16px;font-family:var(--font-mono);font-size:7px;letter-spacing:.14em;color:#6c6a63">PRACTICE</div>
              <div style="font-family:var(--font-mono);font-size:17px;margin-top:3px">${hrs}<span style="font-size:8px">h / 18W</span></div>
            </div>
          </div>
          <div style="margin-top:20px;padding-top:12px;border-top:1px solid rgba(10,10,12,.12);font-size:9px;line-height:1.7;color:#444">
            <b style="color:#141416">검토 메모 —</b> ${esc(Store.memo(t.id) || "등록된 메모가 없습니다.")}
          </div>
          <div class="rp-foot"><span>MY IDOL · GROW IN THE DARK, SHINE WITH DATA</span><span>DEMO DATA · NOT FOR DISTRIBUTION</span></div>
        </div>
        <div class="flex items-center gap-8 no-print" style="margin-top:12px;flex-wrap:wrap">
          <span class="mono" style="font-size:9px;color:var(--faint)">${icon("lock")} 리포트에는 민감 속성(외모·체형)이 포함되지 않습니다.</span>
          <button class="link-more" style="margin-left:auto" id="copyRpt">${icon("copy")} 링크 복사</button>
        </div>`;
    },
    bind(root) {
      const pick = $("#reportPick", root);
      if (pick)
        pick.addEventListener("change", (e) => {
          state.selected = e.target.value;
          route();
        });
      $("#printRpt", root).addEventListener("click", () => window.print());
      $("#saveRpt", root).addEventListener("click", () => {
        const t = selectedTrainee();
        const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><title>MY IDOL Scout Report — ${esc(t.name)}</title>
          <style>
            body{margin:0;background:#e8e5dd;font-family:-apple-system,"Segoe UI","Malgun Gothic",sans-serif;padding:32px;color:#141416}
            .report-preview{background:#f4f1e9;max-width:820px;margin:0 auto;padding:44px;position:relative;min-height:900px}
            .rp-top{display:flex;justify-content:space-between;border-bottom:1px solid rgba(10,10,12,.15);padding-bottom:14px}
            .rp-logo{font-weight:900;font-size:20px;letter-spacing:-.05em}.rp-logo span{color:#6d8a00}
            .rp-meta{font-family:monospace;font-size:9px;text-align:right;color:#6c6a63;line-height:1.7}
            h3{font-size:32px;margin:24px 0 4px;letter-spacing:-.045em}.rp-sub{font-size:12px;color:#6c6a63;margin:0}
            .rp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:20px}
            .rp-stat{border:1px solid rgba(10,10,12,.12);border-radius:8px;padding:12px}
            .rp-stat span{font-family:monospace;font-size:8px;color:#6c6a63;display:block;letter-spacing:.1em}
            .rp-stat b{font-family:monospace;font-size:22px;font-weight:500;display:block;margin-top:4px}
            .rp-bars{display:grid;gap:9px;margin-top:8px}
            .rp-bar{display:grid;grid-template-columns:46px 1fr 30px;gap:8px;align-items:center;font-size:10px;color:#444}
            .rp-bar .t{height:4px;background:rgba(10,10,12,.1);border-radius:99px;overflow:hidden}
            .rp-bar .f{height:100%;background:#8a0f2e;border-radius:99px}
            .chart svg{width:100%;height:auto;overflow:visible}
            .chart-line{fill:none;stroke:var(--line-color,#d8ff4a);stroke-width:2}
            .chart-grid-line{stroke:rgba(10,10,12,.1)}
            .chart-axis-label,.chart-foot{display:none}
            .chart-dot{fill:#f4f1e9;stroke:#8a0f2e;stroke-width:1.6}
            .chart-dot.hot{fill:#8a0f2e}
            .rp-foot{position:absolute;left:44px;right:44px;bottom:24px;display:flex;justify-content:space-between;font-family:monospace;font-size:8px;color:#8a8880;border-top:1px solid rgba(10,10,12,.1);padding-top:8px}
            @media print{body{background:#fff;padding:0}.report-preview{max-width:none}}
          </style></head><body><div class="report-preview">${$("#reportPreview", root).innerHTML}</div></body></html>`;
        downloadFile(`myidol-report-${t.id}.html`, html, "text/html");
        U.toast("리포트 HTML을 저장했습니다");
      });
      $("#copyRpt", root).addEventListener("click", () => U.copy(location.origin + location.pathname + "#report"));
    },
  };

  /* =======================================================
     downloads
  ======================================================= */
  function downloadFile(name, content, type) {
    const blob = new Blob([content], { type: type + ";charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function buildPortfolio(t) {
    downloadFile(`myidol-portfolio-${t.id}.html`, portfolioHtml(t), "text/html");
    U.toast("성장 포트폴리오를 저장했습니다");
  }

  function portfolioHtml(t) {
    const posts = Store.postsOf(t.id);
    const hrs = totalHours(t);
    return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><title>${esc(t.name)} · GROW PORTFOLIO</title>
      <style>
        :root{--lime:#d8ff4a;--ink:#0a0a0c;--line:rgba(255,255,255,.1)}
        *{box-sizing:border-box}body{margin:0;background:#0a0a0c;color:#f2f0ea;font-family:-apple-system,"Segoe UI","Malgun Gothic",sans-serif;padding:48px 28px}
        .wrap{max-width:880px;margin:0 auto}.top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--line);padding-bottom:20px}
        .logo{font-weight:900;letter-spacing:-.05em;font-size:18px}.logo span{color:var(--lime)}
        .meta{font-family:monospace;font-size:9px;color:#7c7b83;text-align:right;line-height:1.8;letter-spacing:.08em}
        h1{font-size:52px;letter-spacing:-.06em;margin:30px 0 4px;line-height:1}h1 small{font-size:13px;color:#7c7b83;font-weight:400;letter-spacing:.06em;margin-left:10px}
        .sub{color:#a4a3ab;font-size:13px}.tagline{font-size:18px;color:#d8d6d0;margin:22px 0;letter-spacing:-.02em}
        .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:24px 0}
        .stat{border:1px solid var(--line);border-radius:10px;padding:14px}
        .stat span{font-family:monospace;font-size:8px;letter-spacing:.12em;color:#7c7b83;display:block}
        .stat b{font-family:monospace;font-size:24px;font-weight:500;display:block;margin-top:6px}
        h2{font-size:13px;letter-spacing:.02em;margin:34px 0 12px;padding-bottom:8px;border-bottom:1px solid var(--line);font-weight:600}
        .bars{display:grid;gap:8px}.bar{display:grid;grid-template-columns:60px 1fr 32px;gap:10px;align-items:center;font-size:11px;color:#a4a3ab}
        .bar i{display:block;height:5px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden}
        .bar i b{display:block;height:100%;background:var(--lime);border-radius:99px}
        .bar em{font-family:monospace;font-style:normal;color:#f2f0ea;font-size:10px;text-align:right}
        .rows{display:grid;gap:0}.row{display:flex;gap:12px;padding:10px 0;border-top:1px solid var(--line);font-size:11.5px;align-items:baseline}
        .row:first-child{border-top:0}.row time{font-family:monospace;font-size:9px;color:#7c7b83;flex:none;width:64px}
        .row b{font-weight:600}.row span{color:#a4a3ab;margin-left:auto;font-size:10px}
        .mile{padding:9px 0;border-top:1px solid var(--line);font-size:11.5px}.mile:first-child{border-top:0}.mile span{color:#7c7b83;font-family:monospace;font-size:9px;margin-right:10px}
        .foot{margin-top:36px;border-top:1px solid var(--line);padding-top:12px;display:flex;justify-content:space-between;font-family:monospace;font-size:8px;color:#6d6d77;letter-spacing:.06em}
        @media print{body{background:#fff;color:#0a0a0c;padding:20px}.logo span{color:#6d8a00}h1,h2{color:#0a0a0c}.stat{border-color:#ddd}.bar i{background:#eee}.bar i b{background:#0a0a0c}.bar em,.row b{color:#0a0a0c}.foot{border-color:#ddd;color:#777}}
      </style></head><body><div class="wrap">
        <div class="top"><div class="logo">MY<span>IDOL</span> / GROW PORTFOLIO</div><div class="meta">GENERATED ${dateKo(todayIso())}<br>CONFIDENTIAL · DEMO<br>${esc(t.agency)}</div></div>
        <h1>${esc(t.name)}<small>${esc(t.en)}</small></h1>
        <div class="sub">${esc(t.position)} · ${t.years}년차 · ${t.age}세</div>
        <p class="tagline">“${esc(t.tagline)}”</p>
        <p style="font-size:12.5px;line-height:1.9;color:#b9b7b1;max-width:620px">${esc(t.bio)}</p>
        <div class="stats">
          <div class="stat"><span>EGI</span><b>${t.egi}</b></div>
          <div class="stat"><span>12W GROWTH</span><b>+${(t.egi - t.egiSeries[0]).toFixed(1)}</b></div>
          <div class="stat"><span>FANS</span><b>${num(t.fans)}</b></div>
          <div class="stat"><span>PRACTICE</span><b>${hrs}h</b></div>
        </div>
        <h2>SKILL PROFILE</h2>
        <div class="bars">${MD.skillKeys.map((k) => `<div class="bar"><span>${MD.skillLabels[k]}</span><i><b style="width:${t.skills[k]}%"></b></i><em>${t.skills[k]}</em></div>`).join("")}</div>
        <h2>RECENT RECORDS</h2>
        <div class="rows">${posts
          .slice(0, 10)
          .map((p) => `<div class="row"><time>${dateKo(p.date)}</time><b>${esc(p.title)}</b><span>${p.type === "video" ? "영상" : "사진"} · ♥ ${num(Store.likeCount(p))}</span></div>`)
          .join("") || `<div class="row"><span>기록이 없습니다.</span></div>`}</div>
        <h2>MILESTONES</h2>
        <div>${t.milestones.map((m) => `<div class="mile"><span>${dateKo(m.date)}</span><b>${esc(m.title)}</b> — ${esc(m.desc)}</div>`).join("")}</div>
        <div class="foot"><span>MY IDOL · GROW IN THE DARK, SHINE WITH DATA</span><span>DEMO DATA · ${esc(t.id.toUpperCase())}</span></div>
      </div></body></html>`;
  }

  /* =======================================================
     views + boot
  ======================================================= */
  const VIEWS = { trainee: TRAINEE, fan: FAN, ent: ENT };

  document.addEventListener("DOMContentLoaded", boot);
})();
