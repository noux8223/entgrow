/* =========================================================
   MY IDOL — marketing / explore / public profile
========================================================= */
(function () {
  const { $, $$, esc, num, fans, art, icon, dateKo, rel, dday, weekLabels, roleName } = U;
  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  /* =======================================================
     LANDING
  ======================================================= */
  function initIndex() {
    renderTicker();
    renderHero();
    initSpotlight();
    renderEgi();
    renderEvents();
    renderPlans("monthly");
    renderFaq();
    initContact();
    initCountUp();
  }

  function renderTicker() {
    const track = $("#tickerTrack");
    if (!track) return;
    const items = [
      ["NEW", "서하린 주간 EGI +4.2 · 전체 8위"],
      ["LIVE", "NEXT STAGE 12월 월말평가 · 팬 투표 30% 반영"],
      ["OPEN", "신규 연습생 12기 공개 오디션 접수 중"],
      ["B2B", "SCOUT DAY 2026 · 파트너 기획사 38곳"],
      ["DATA", "누적 연습 기록 92,410건"],
    ];
    const set = items
      .map(([k, v]) => `<span class="ticker-item"><span class="star">✦</span><span class="k">${k}</span>${v}</span>`)
      .join("");
    const brand = `<span class="ticker-item"><span class="star">✦</span>GROW IN THE DARK, SHINE WITH DATA</span>`;
    track.innerHTML = `<div class="ticker-set">${set}${brand}</div><div class="ticker-set" aria-hidden="true">${set}${brand}</div>`;
  }

  function renderHero() {
    const el = $("#heroSpot");
    if (!el) return;
    const t = Store.trainee(MD.trainees[Math.floor(Math.random() * MD.trainees.length)].id);
    el.innerHTML = `<div class="hero-card-wrap">
      <div class="hero-orbit" aria-hidden="true"></div>
      <a class="hero-card" href="profile.html?id=${t.id}" aria-label="${esc(t.name)} 프로필 보기">
        ${art(t, { name: false, meta: false })}
        <div class="hero-card-foot">
          <div>
            <div class="name">${esc(t.name)}</div>
            <div class="pos">${esc(t.position)} · ${esc(t.agency)}</div>
          </div>
          <div class="egi"><span>EGI</span>${t.egi}</div>
        </div>
      </a>
      <div class="float-chip chip-egi"><span class="dot"></span><div><b>${t.egi}</b><span>GROWTH INDEX</span></div></div>
      <div class="float-chip chip-fans">${icon("heart")}<div><b>${fans(t.fans)}</b><span>응원 팬</span></div></div>
      <div class="float-chip chip-rec">${icon("trend")}<div><b>+${t.egiDelta}</b><span>이번 주 EGI</span></div></div>
    </div>`;
    const chips = el.querySelectorAll(".float-chip svg");
    chips.forEach((s) => { s.style.width = "16px"; s.style.height = "16px"; s.style.color = "#d8ff4a"; });
    const heartSvg = el.querySelector(".chip-fans svg");
    if (heartSvg) heartSvg.style.color = "#ff7a5c";
  }

  let spotIndex = Math.floor(Math.random() * MD.trainees.length);
  function initSpotlight() {
    const mount = $("#spotlightCard");
    if (!mount) return;
    const draw = () => {
      const t = Store.trainee(MD.trainees[spotIndex].id);
      mount.innerHTML = spotlightMarkup(t);
      const support = mount.querySelector("#spotSupport");
      if (support) bindSupport(support, t, "응원하기");
      const prof = mount.querySelector("#spotProfile");
      if (prof) prof.addEventListener("click", () => (location.href = "profile.html?id=" + t.id));
    };
    draw();

    $("#shuffleSpot").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      btn.classList.add("spin");
      setTimeout(() => btn.classList.remove("spin"), 650);
      let next = spotIndex;
      while (next === spotIndex) next = Math.floor(Math.random() * MD.trainees.length);
      spotIndex = next;
      draw();
    });
  }

  function spotlightMarkup(t) {
    return `<div class="spot-card spot-fade">
      <div class="spot-art">${art(t, { name: false, meta: false })}</div>
      <div class="spot-body">
        <div class="spot-topline">
          <span>TRAINEE / ${esc(t.initials)}</span>
          <span class="badge lime">${esc(t.position)}</span>
        </div>
        <div class="spot-name">
          <h3>${esc(t.name)}</h3>
          <span>${esc(t.en)}</span>
        </div>

        <dl class="spot-facts">
          <div><dt>분야</dt><dd>${(t.positions || []).map(esc).join(" · ")}</dd></div>
          <div><dt>소속</dt><dd>${esc(t.agency)}</dd></div>
          <div><dt>연차</dt><dd>${t.years}년차</dd></div>
        </dl>

        <p class="spot-bio">${esc(t.bio)}</p>
        <div class="spot-tags">${(t.tags || []).map((x) => `<span class="tag">#${esc(x)}</span>`).join("")}</div>

        <div class="spot-actions">
          <button class="btn btn-primary" id="spotSupport">응원하기</button>
          <button class="btn btn-ghost" id="spotProfile">프로필 보기</button>
        </div>
      </div>
    </div>`;
  }

  function bindSupport(btn, t, baseLabel) {
    const s = Store.session();
    const role = s && s.role === "ent" ? "ent" : "fan";
    const sync = () => {
      if (!Store.session()) {
        btn.innerHTML = baseLabel;
        return;
      }
      const on = Store.isFav(role, t.id);
      btn.innerHTML = on ? (role === "ent" ? "스카우트 관심 등록됨" : "응원 중") : baseLabel;
      btn.classList.toggle("btn-primary", !on || role === "fan");
    };
    sync();
    btn.addEventListener("click", () => {
      const sess = Store.session();
      if (!sess) {
        U.openAuth({ role: "fan" });
        return;
      }
      if (sess.role === "trainee") {
        U.toast("연습생 계정에서는 응원 기능을 사용할 수 없어요");
        return;
      }
      const added = Store.toggleFav(sess.role, t.id);
      U.toast(added ? (sess.role === "ent" ? "스카우트 관심 목록에 추가했습니다" : "관심 연습생에 추가했습니다") : "관심 목록에서 제외했습니다");
      sync();
      const label = sess.role === "ent" ? "스카우트 관심" : "응원";
      btn.innerHTML = Store.isFav(sess.role, t.id) ? (sess.role === "ent" ? "스카우트 관심 등록됨" : "응원 중") : baseLabel;
    });
  }

  function renderEgi() {
    const el = $("#egiPanel");
    if (!el) return;
    const t = Store.trainee("harin");
    el.innerHTML = `
      <div class="egi-head">
        <div>
          <span class="label">EGI · GROWTH INDEX</span>
          <b>${t.egi}<em>+${t.egiDelta}</em></b>
        </div>
        <div class="egi-range">${icon("trend")} TOP 8%</div>
      </div>
      ${U.lineChart(t.egiSeries, { height: 178, labels: weekLabels(12), footLeft: "12 WEEKS AGO", footRight: "THIS WEEK" })}
      <div class="egi-skills">
        ${MD.skillKeys
          .map(
            (k) => `<div class="bar-row"><span>${MD.skillLabels[k]}</span><div class="track"><div class="fill" style="width:${t.skills[k]}%"></div></div><b>${t.skills[k]}</b></div>`
          )
          .join("")}
      </div>
      <div class="egi-foot">
        <span class="live"><i></i>LIVE DATA · 2H AGO</span>
        <span>${esc(t.name)} · ${esc(t.agency)}</span>
      </div>`;
  }

  function renderEvents() {
    const mount = $("#eventsMount");
    if (!mount) return;
    const [f, ...rest] = MD.events;
    const fd = new Date(f.date + "T00:00:00");
    mount.innerHTML = `
      <article class="event-feature" data-day="${fd.getDate()}" data-reveal>
        <div class="topline">
          <span class="badge lime">${esc(f.badge)}</span>
          <span class="event-dday">${dday(f.date)}</span>
        </div>
        <div class="event-date-block"><b>${String(fd.getDate()).padStart(2, "0")}</b>${MONTHS[fd.getMonth()]} ${fd.getFullYear()} · ${esc(f.meta)}</div>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.desc)}</p>
        <div class="actions">
          <button class="btn btn-primary btn-sm" data-auth data-role="fan">참여하기</button>
          <a class="btn btn-ghost btn-sm" href="#pricing">팬 멤버십 보기</a>
        </div>
      </article>
      <div class="event-list">
        ${rest
          .map((ev) => {
            const d = new Date(ev.date + "T00:00:00");
            return `<a class="event-row" href="#" data-auth data-role="fan" data-reveal>
              <div class="event-date"><b>${String(d.getDate()).padStart(2, "0")}</b><span>${MONTHS[d.getMonth()]}</span></div>
              <div><h4>${esc(ev.title)}</h4><p>${esc(ev.desc)}</p></div>
              <div class="right"><span class="badge ${ev.accent}">${esc(ev.badge)}</span><span class="dday">${dday(ev.date)} · ${esc(ev.meta)}</span></div>
            </a>`;
          })
          .join("")}
      </div>`;
  }

  function renderPlans(billing) {
    const grid = $("#planGrid");
    if (!grid) return;
    grid.innerHTML = MD.plans
      .map((p) => {
        const yearly = billing === "yearly";
        const price = yearly ? p.yearly : p.monthly;
        return `<article class="plan ${p.accent === "featured" ? "featured" : ""}" data-reveal>
          <div class="plan-top">
            <span class="plan-name">${p.name}</span>
            ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
          </div>
          <span class="plan-kr">${esc(p.kr)}</span>
          <div class="plan-price"><b>${num(price)}</b><span>원 / ${yearly ? "년" : "월"}</span></div>
          <p class="plan-desc">${esc(p.desc)}</p>
          <button class="btn ${p.accent === "featured" ? "btn-primary" : "btn-ghost"}" data-plan="${p.role}">${esc(p.cta)}</button>
          <ul class="plan-features">${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
        </article>`;
      })
      .join("");

    grid.querySelectorAll("[data-plan]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const role = btn.dataset.plan;
        const s = Store.session();
        if (s && s.role === role) location.href = role + ".html";
        else U.openAuth({ role });
      });
    });

    $("#billingToggle")
      .querySelectorAll("button")
      .forEach((b) => b.classList.toggle("on", b.dataset.billing === billing));
  }

  function renderFaq() {
    const mount = $("#faqList");
    if (!mount) return;
    mount.innerHTML = MD.faqs
      .map(
        (f, i) => `<details class="faq" ${i === 0 ? "open" : ""}>
          <summary>${esc(f.q)}</summary>
          <div class="a">${esc(f.a)}</div>
        </details>`
      )
      .join("");
  }

  function initContact() {
    const form = $("#contactForm");
    const success = $("#contactSuccess");
    if (!form) return;
    const err = $("#cError");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#cname");
      const email = $("#cemail");
      const msg = $("#cmsg");
      const agree = $("#cagree");
      const fail = (m, el) => {
        err.textContent = m;
        err.style.display = "block";
        if (el) el.classList.add("invalid");
        el && el.focus();
        return false;
      };
      [name, email, msg].forEach((el) => el.classList.remove("invalid"));
      if (name.value.trim().length < 2) return fail("이름을 2자 이상 입력해주세요.", name);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) return fail("이메일 형식을 확인해주세요.", email);
      if (msg.value.trim().length < 10) return fail("메시지를 10자 이상 입력해주세요.", msg);
      if (!agree.checked) return fail("개인정보 수집·이용에 동의해주세요.", null);
      err.style.display = "none";
      const btn = $("#cSubmit");
      btn.textContent = "보내는 중…";
      btn.disabled = true;
      setTimeout(() => {
        Store.addInquiry({ type: $("#ctype").value, name: name.value.trim(), email: email.value.trim(), message: msg.value.trim() });
        form.style.display = "none";
        success.style.display = "grid";
        U.toast("문의가 접수되었습니다");
        form.reset();
        btn.textContent = "문의 보내기";
        btn.disabled = false;
      }, 600);
    });
    $("#contactReset").addEventListener("click", () => {
      success.style.display = "none";
      form.style.display = "grid";
      err.style.display = "none";
    });
  }

  function initCountUp() {
    const els = $$("[data-count]");
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          const target = Number(el.dataset.count);
          el.textContent = "0";
          U.countUp(el, target);
          io.unobserve(el);
        });
      },
      { threshold: 0.7 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* =======================================================
     EXPLORE
  ======================================================= */
  function initExplore() {
    const grid = $("#exploreGrid");
    if (!grid) return;
    const state = { q: "", pos: "전체", sort: "egi" };

    const filters = $("#positionFilters");
    filters.innerHTML = MD.positions
      .map((p) => `<button class="chip ${p === "전체" ? "on" : ""}" data-pos="${esc(p)}">${esc(p)}</button>`)
      .join("");
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pos]");
      if (!b) return;
      state.pos = b.dataset.pos;
      $$("[data-pos]", filters).forEach((x) => x.classList.toggle("on", x === b));
      draw();
    });

    $("#exploreSearch").addEventListener("input", (e) => {
      state.q = e.target.value.trim().toLowerCase();
      draw();
    });

    $("#exploreSort").addEventListener("change", (e) => {
      state.sort = e.target.value;
      draw();
    });

    const favRole = (Store.session() || {}).role === "ent" ? "ent" : "fan";

    function draw() {
      let list = Store.allTrainees();
      if (state.pos !== "전체") list = list.filter((t) => t.positions.includes(state.pos) || t.position.includes(state.pos));
      if (state.q) {
        list = list.filter((t) =>
          [t.name, t.en, t.position, ...(t.positions || []), ...(t.tags || []), t.agency]
            .join(" ")
            .toLowerCase()
            .includes(state.q)
        );
      }
      const sorters = {
        egi: (a, b) => b.egi - a.egi,
        fans: (a, b) => b.fans - a.fans,
        growth: (a, b) => b.egiDelta - a.egiDelta,
        name: (a, b) => a.name.localeCompare(b.name, "ko"),
      };
      list.sort(sorters[state.sort] || sorters.egi);

      $("#resultCount").innerHTML = `<b>${list.length}</b>명`;
      if (!list.length) {
        grid.innerHTML = `<div class="explore-empty empty">
          <b>조건에 맞는 연습생이 없어요</b>
          <span>검색어나 포지션 필터를 바꿔보세요.</span>
          <button class="btn btn-ghost btn-sm" id="resetFilters">필터 초기화</button>
        </div>`;
        $("#resetFilters").addEventListener("click", () => {
          state.q = "";
          state.pos = "전체";
          $("#exploreSearch").value = "";
          $$("[data-pos]", filters).forEach((x) => x.classList.toggle("on", x.dataset.pos === "전체"));
          draw();
        });
        return;
      }

      grid.innerHTML = list
        .map(
          (t) => `<article class="t-card" data-reveal>
            <div class="t-card-art">
              <a href="profile.html?id=${t.id}" aria-label="${esc(t.name)} 프로필 보기" style="position:absolute;inset:0;z-index:1">${art(t, { meta: false })}</a>
              <button class="t-card-fav ${Store.isFav(favRole, t.id) ? "on" : ""}" data-fav="${t.id}" aria-label="${esc(t.name)} 관심 등록" aria-pressed="${Store.isFav(favRole, t.id)}">
                ${icon("heart")}
              </button>
              <span class="t-card-egi">EGI <b>${t.egi}</b></span>
            </div>
            <a class="t-card-body" href="profile.html?id=${t.id}">
              <div class="line"><h3>${esc(t.name)}</h3><span class="en">${esc(t.en)}</span></div>
              <div class="meta">${esc(t.position)} <i></i> ${esc(t.agency)} <i></i> ${t.age}세</div>
              <div class="bottom">
                <span class="fan">${icon("heart")} 팬 <b>${fans(t.fans)}</b></span>
                <span class="up">+${num(t.fansDelta)}</span>
              </div>
            </a>
          </article>`
        )
        .join("");

      U.bindFavs(grid, favRole);
      U.initReveal(grid);
    }

    draw();
  }

  /* =======================================================
     PROFILE
  ======================================================= */
  let recordFilter = "all";

  function initProfile() {
    const root = $("#profileRoot");
    if (!root) return;
    const qid = new URLSearchParams(location.search).get("id");
    const t = Store.trainee(qid || MD.trainees[0].id);
    document.title = `${t.name} · MY IDOL`;

    const posts = Store.postsOf(t.id);
    const totalHours = t.heat.reduce((a, b) => a + b.hours, 0);
    const engagement = posts.reduce((a, p) => a + Store.likeCount(p) + Store.commentCount(p.id), 0);
    const validTabs = ["profile", "records", "growth", "scout"];

    const favRole = (Store.session() || {}).role === "ent" ? "ent" : "fan";

    root.innerHTML = `
      <section class="profile-cover">
        <div class="wrap">
          <div class="crumbs"><a href="index.html">HOME</a><i>/</i><a href="explore.html">TRAINEES</a><i>/</i><span>${esc(t.en)}</span></div>
          <div class="profile-grid">
            <div class="profile-poster">${art(t)}</div>
            <div class="profile-info">
              <div class="agency">${icon("building")} ${esc(t.agency)} <span class="badge">${t.years}년차</span></div>
              <h1>${esc(t.name)}</h1>
              <span class="en">${esc(t.en)}</span>
              <p class="profile-tagline">${esc(t.tagline)}</p>
              <div class="profile-tags">${(t.tags || []).map((x) => `<span class="tag">#${esc(x)}</span>`).join("")}</div>

              <div class="profile-stats">
                <div><span>EGI</span><b>${t.egi}<em>+${t.egiDelta}</em></b></div>
                <div><span>FANS</span><b>${fans(t.fans)}</b></div>
                <div><span>RECORDS</span><b>${posts.length}</b></div>
                <div><span>PRACTICE</span><b>${Math.round(totalHours)}<em>h</em></b></div>
              </div>

              <div class="profile-cta">
                <button class="btn btn-primary" id="pfSupport">응원하기</button>
                <button class="btn btn-ghost" id="pfShare">${icon("copy")} 링크 복사</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="profile-tabs">
        <div class="wrap tabs-inner">
          <a class="tab-btn" href="#profile" data-tab="profile">프로필</a>
          <a class="tab-btn" href="#records" data-tab="records">기록 <span class="lock">${posts.length}</span></a>
          <a class="tab-btn" href="#growth" data-tab="growth">성장 데이터</a>
          <a class="tab-btn" href="#scout" data-tab="scout">스카우트${(Store.session() || {}).role === "ent" ? "" : ' <span class="lock">🔒</span>'}</a>
          <span class="tabs-right">PROFILE VERIFIED · ${dateKo(MD.iso(MD.today))}</span>
        </div>
      </div>
      <section class="profile-body"><div class="wrap" id="tabBody"></div></section>`;

    const support = $("#pfSupport");
    const syncSupport = () => {
      const s = Store.session();
      if (!s) {
        support.innerHTML = "응원하기";
        return;
      }
      if (s.role === "trainee") {
        support.innerHTML = "응원하기";
        return;
      }
      const on = Store.isFav(s.role, t.id);
      support.innerHTML = on ? (s.role === "ent" ? "스카우트 관심 등록됨" : "응원 중") : s.role === "ent" ? "스카우트 관심" : "응원하기";
    };
    syncSupport();
    support.addEventListener("click", () => {
      const s = Store.session();
      if (!s) {
        U.openAuth({ role: "fan" });
        return;
      }
      if (s.role === "trainee") {
        U.toast("연습생 계정에서는 응원 기능을 사용할 수 없어요");
        return;
      }
      const added = Store.toggleFav(s.role, t.id);
      U.toast(added ? "관심 목록에 추가했습니다" : "관심 목록에서 제외했습니다");
      syncSupport();
    });
    $("#pfShare").addEventListener("click", () => U.copy(location.href));

    const renderTab = () => {
      let tab = (location.hash || "").replace("#", "");
      if (!validTabs.includes(tab)) tab = "profile";
      $$(".tab-btn").forEach((a) => a.classList.toggle("on", a.dataset.tab === tab));
      $("#tabBody").innerHTML = tabBody(tab, t, posts, totalHours, engagement);
      bindTabEvents(tab, t, posts);
      U.initReveal($("#tabBody"));
    };

    if (!validTabs.includes((location.hash || "").replace("#", ""))) {
      history.replaceState(null, "", "#profile");
    }
    renderTab();
    window.addEventListener("hashchange", renderTab);
  }

  function tabBody(tab, t, posts, totalHours, engagement) {
    if (tab === "profile") {
      return `<div class="panel-grid">
        <div>
          <div class="p-block">
            <div class="p-block-head"><h3>연습생 소개</h3><span class="label">ABOUT</span></div>
            <p class="bio-text">${esc(t.bio)}</p>
            <div class="profile-tags" style="margin-top:18px">${(t.tags || []).map((x) => `<span class="tag">#${esc(x)}</span>`).join("")}</div>
          </div>
          <div class="p-block">
            <div class="p-block-head"><h3>최근 마일스톤</h3><span class="label">MILESTONES</span></div>
            ${milestoneList(t)}
          </div>
          <div class="p-block">
            <div class="p-block-head"><h3>최근 기록</h3><span class="label">${posts.length} RECORDS</span></div>
            <div class="post-grid">${posts.slice(0, 3).map((p) => U.postCard(p, { showAuthor: false })).join("")}</div>
            <div style="margin-top:16px"><a class="link-more" href="#records">전체 기록 보기 ${icon("arrow")}</a></div>
          </div>
        </div>
        <div>
          <div class="p-block">
            <div class="p-block-head"><h3>기본 정보</h3><span class="label">INFO</span></div>
            <div class="info-list">
              <div><span>소속사</span><b>${esc(t.agency)}</b></div>
              <div><span>포지션</span><b>${esc(t.positions.join(" · "))}</b></div>
              <div><span>나이</span><b>${t.age}세</b></div>
              <div><span>연습 기간</span><b>${t.years}년차</b></div>
              <div><span>공개 범위</span><b>팬 공개 · 검증 완료</b></div>
            </div>
          </div>
          <div class="p-block">
            <div class="p-block-head"><h3>스킬 프로필</h3><span class="label">SKILLS</span></div>
            ${MD.skillKeys.map((k) => `<div class="skill-row"><div class="top"><span>${MD.skillLabels[k]}</span><b>${t.skills[k]}</b></div><div class="track"><div class="fill" style="width:${t.skills[k]}%"></div></div></div>`).join("")}
          </div>
          <div class="p-block">
            <div class="p-block-head"><h3>팬 반응</h3><span class="label">SIGNAL</span></div>
            <div class="data-grid">
              <div class="data-cell"><span>응원 하트</span><b>${num(engagement)}</b></div>
              <div class="data-cell"><span>주간 팬 증가</span><b>+${num(t.fansDelta)}</b></div>
            </div>
            <p style="font-size:10.5px;color:var(--faint);line-height:1.6;margin-top:12px">팬 반응은 EGI의 10%만 반영됩니다. 절대적 인기 순위가 아닌 성장 신호로 사용됩니다.</p>
          </div>
        </div>
      </div>`;
    }

    if (tab === "records") {
      const filtered = recordFilter === "all" ? posts : posts.filter((p) => p.type === recordFilter);
      return `<div class="p-block">
        <div class="p-block-head" style="flex-wrap:wrap">
          <h3>사진 · 영상 기록</h3>
          <div class="ch-actions">
            ${["all", "photo", "video"].map((k) => `<button class="chip ${recordFilter === k ? "on" : ""}" data-rfilter="${k}">${k === "all" ? "전체" : k === "photo" ? "사진" : "영상"}</button>`).join("")}
            <span class="label" style="margin-left:8px">${filtered.length} RECORDS</span>
          </div>
        </div>
        ${filtered.length ? `<div class="post-grid">${filtered.map((p) => U.postCard(p, { showAuthor: false })).join("")}</div>` : `<div class="empty"><b>아직 기록이 없어요</b><span>다른 필터를 선택해보세요.</span></div>`}
        <div class="flex items-center gap-8" style="margin-top:22px;padding-top:16px;border-top:1px solid var(--line)">
          <span class="mono" style="font-size:9px;color:var(--faint)">${icon("eye")} 기록 열람은 누구나 가능하며, 댓글·응원은 팬 계정이 필요합니다.</span>
          <button class="btn btn-ghost btn-sm" style="margin-left:auto" data-auth data-role="fan">팬으로 응원하기</button>
        </div>
      </div>`;
    }

    if (tab === "growth") {
      return `<div class="panel-grid">
        <div>
          <div class="p-block">
            <div class="p-block-head"><h3>EGI 성장 곡선</h3><span class="label">12 WEEKS</span></div>
            <div class="data-grid" style="margin-bottom:20px">
              <div class="data-cell"><span>현재 EGI</span><b>${t.egi}<em>+${t.egiDelta}</em></b></div>
              <div class="data-cell"><span>팬</span><b>${fans(t.fans)}<em>+${num(t.fansDelta)}</em></b></div>
            </div>
            ${U.lineChart(t.egiSeries, { height: 210, labels: weekLabels(12), footLeft: "12 WEEKS AGO", footRight: "NOW" })}
          </div>
          <div class="p-block">
            <div class="p-block-head"><h3>연습 히트맵</h3><span class="label">${Math.round(totalHours)} HOURS</span></div>
            ${U.heatmap(t.heat)}
          </div>
        </div>
        <div>
          <div class="p-block">
            <div class="p-block-head"><h3>스킬 레이더</h3><span class="label">6 AXIS</span></div>
            ${U.radar(t.skills, MD.skillLabels)}
          </div>
          <div class="p-block">
            <div class="p-block-head"><h3>마일스톤</h3><span class="label">TIMELINE</span></div>
            ${milestoneList(t)}
          </div>
        </div>
      </div>`;
    }

    const s = Store.session();
    if (s && s.role === "ent") {
      const fanSplit = t.fanSplit || [40, 30, 18, 12];
      return `<div class="panel-grid">
        <div>
          <div class="p-block">
            <div class="p-block-head"><h3>스카우트 데이터</h3><span class="badge violet">ENT ONLY</span></div>
            <div class="data-grid">
              <div class="data-cell"><span>EGI 원점수</span><b>${t.egi}</b></div>
              <div class="data-cell"><span>주간 성장</span><b>+${t.egiDelta}</b></div>
              <div class="data-cell"><span>총 팬</span><b>${num(t.fans)}</b></div>
              <div class="data-cell"><span>주간 팬 증가</span><b>+${num(t.fansDelta)}</b></div>
            </div>
          </div>
          <div class="p-block">
            <div class="p-block-head"><h3>팬 증가 추이</h3><span class="label">12 WEEKS</span></div>
            ${U.lineChart(t.fanSeries, { height: 190, labels: weekLabels(12), color: "#8b6cff", footLeft: "12 WEEKS AGO", footRight: "NOW" })}
          </div>
          <div class="p-block">
            <div class="p-block-head"><h3>스카우트 메모</h3><span class="label">PRIVATE</span></div>
            <textarea class="memo-box" id="pfMemo" placeholder="이 연습생에 대한 검토 메모를 남겨주세요.">${esc(Store.memo(t.id))}</textarea>
            <div class="flex items-center gap-8" style="margin-top:10px">
              <button class="btn btn-ghost btn-sm" id="pfMemoSave">메모 저장</button>
              <span class="mono" style="font-size:8.5px;color:var(--faint)">나에게만 보이는 메모입니다.</span>
            </div>
          </div>
        </div>
        <div>
          <div class="p-block">
            <div class="p-block-head"><h3>팬 구성</h3><span class="label">DEMOGRAPHICS</span></div>
            ${["10대", "20대", "30대", "40대+"]
              .map((lab, i) => `<div class="demo-row" style="margin-bottom:10px"><span class="d-label">${lab}</span><div class="d-track"><i style="width:${fanSplit[i]}%"></i></div><b>${fanSplit[i]}%</b></div>`)
              .join("")}
            <p style="font-size:10px;color:var(--faint);line-height:1.6;margin-top:14px">민감 속성(외모·체형·성별)은 평가 지표에서 제외됩니다. 팬 구성은 응원 계정의 자발적 정보 기준입니다.</p>
          </div>
          <div class="p-block">
            <div class="p-block-head"><h3>검증 상태</h3><span class="label">VERIFIED</span></div>
            <div class="info-list">
              <div><span>소속사</span><b>${esc(t.agency)}</b></div>
              <div><span>기록 검증</span><b>소속사 승인 완료</b></div>
              <div><span>공개 범위</span><b>기획사 전체 공개</b></div>
              <div><span>최근 업데이트</span><b>${rel(posts[0] ? posts[0].date : MD.iso(MD.today))}</b></div>
            </div>
            <button class="btn btn-primary btn-sm btn-block" id="pfReport" style="margin-top:16px">${icon("download")} 스카우트 리포트</button>
            <p class="mono" style="font-size:8.5px;color:var(--faint);text-align:center;margin-top:8px">PDF 내보내기는 PARTNER 대시보드에서 제공됩니다.</p>
          </div>
        </div>
      </div>`;
    }

    const split = t.fanSplit || [40, 30, 18, 12];
    return `<div class="scout-lock">
      <div class="blurred">
        <div class="data-grid">
          <div class="data-cell"><span>EGI 원점수</span><b>${t.egi}</b></div>
          <div class="data-cell"><span>주간 성장</span><b>+${t.egiDelta}</b></div>
          <div class="data-cell"><span>총 팬</span><b>${num(t.fans)}</b></div>
          <div class="data-cell"><span>주간 팬 증가</span><b>+${num(t.fansDelta)}</b></div>
        </div>
        <div style="margin-top:20px">
          ${["10대", "20대", "30대", "40대+"]
            .map((lab, i) => `<div class="demo-row" style="margin-bottom:10px"><span class="d-label">${lab}</span><div class="d-track"><i style="width:${split[i]}%"></i></div><b>${split[i]}%</b></div>`)
            .join("")}
        </div>
      </div>
      <div class="overlay">
        <div class="lock-ic">${icon("lock")}</div>
        <h3>엔터 계정 전용 데이터</h3>
        <p>EGI 원점수, 팬 증가 추이, 팬 구성, 스카우트 메모는 파트너 기획사에만 제공됩니다.</p>
        <div class="flex gap-8" style="flex-wrap:wrap;justify-content:center">
          <button class="btn btn-primary" data-auth data-role="ent">엔터 계정으로 로그인</button>
          <a class="btn btn-ghost" href="index.html#pricing">PARTNER 요금</a>
        </div>
      </div>
    </div>`;
  }

  function milestoneList(t) {
    return `<div class="timeline">${t.milestones
      .map((m) => `<div class="timeline-item"><span class="date">${dateKo(m.date)}</span><div><h4>${esc(m.title)}</h4><p>${esc(m.desc)}</p></div></div>`)
      .join("")}</div>`;
  }

  function bindTabEvents(tab, t, posts) {
    U.bindPostOpeners($("#tabBody"));

    $$("[data-rfilter]").forEach((b) => {
      b.addEventListener("click", () => {
        recordFilter = b.dataset.rfilter;
        $("#tabBody").innerHTML = tabBody("records", t, posts, 0, 0);
        bindTabEvents("records", t, posts);
      });
    });

    const save = $("#pfMemoSave");
    if (save) {
      save.addEventListener("click", () => {
        Store.setMemo(t.id, $("#pfMemo").value);
        U.toast("스카우트 메모를 저장했습니다");
      });
    }
    const report = $("#pfReport");
    if (report) {
      report.addEventListener("click", () => {
        U.toast("리포트 PDF는 PARTNER 대시보드에서 생성됩니다");
        setTimeout(() => (location.href = "ent.html#report"), 700);
      });
    }
  }

  /* =======================================================
     BOOT
  ======================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    U.initNav();
    const page = document.body.dataset.page;
    if (page === "index") initIndex();
    if (page === "explore") initExplore();
    if (page === "profile") initProfile();
    U.initReveal();
  });
})();
