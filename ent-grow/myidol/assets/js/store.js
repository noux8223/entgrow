/* =========================================================
   MY IDOL — storage & state
   localStorage를 사용할 수 없는 환경에서는 메모리로 대체됩니다.
========================================================= */
window.Store = (function () {
  const NS = "myidol.v1.";
  const memory = {};
  let persistent = false;

  try {
    localStorage.setItem(NS + "__t", "1");
    localStorage.removeItem(NS + "__t");
    persistent = true;
  } catch (e) {
    persistent = false;
  }

  function read(key, fallback) {
    try {
      const raw = persistent ? localStorage.getItem(NS + key) : memory[key];
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      const raw = JSON.stringify(value);
      if (persistent) localStorage.setItem(NS + key, raw);
      else memory[key] = raw;
      return true;
    } catch (e) {
      memory[key] = JSON.stringify(value);
      return false;
    }
  }

  /* ---------------- session ---------------- */
  function session() {
    return read("session", null);
  }

  function login(user) {
    write("session", { ...user, at: Date.now() });
    return session();
  }

  function logout() {
    try {
      if (persistent) localStorage.removeItem(NS + "session");
      else delete memory.session;
    } catch (e) {}
  }

  /* ---------------- overrides / demo enrichment ---------------- */
  const overrides = () => read("profiles", {});

  function trainee(id) {
    const base = MD.getTrainee(id);
    const o = overrides()[id] || {};
    return { ...base, ...o, skills: { ...base.skills, ...(o.skills || {}) } };
  }

  function saveProfile(id, patch) {
    const all = overrides();
    all[id] = { ...(all[id] || {}), ...patch };
    write("profiles", all);
    return trainee(id);
  }

  function allTrainees() {
    return MD.trainees.map((t) => trainee(t.id));
  }

  /* ---------------- favorites ---------------- */
  function favorites(role) {
    const seed = {
      fan: ["harin", "yujin", "doyun"],
      ent: ["doyun", "harin", "serin", "haram"],
    };
    const data = read("favorites", null);
    if (!data) {
      write("favorites", seed);
      return role ? seed[role].slice() : seed;
    }
    return role ? (data[role] || []).slice() : data;
  }

  function isFav(role, id) {
    return favorites(role).includes(id);
  }

  function toggleFav(role, id) {
    const data = favorites();
    const list = data[role] || [];
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1);
    else list.unshift(id);
    data[role] = list;
    write("favorites", data);
    return i < 0;
  }

  /* ---------------- posts ---------------- */
  function extraPosts() {
    return read("extraPosts", []);
  }

  function allPosts() {
    const extra = extraPosts();
    return [...extra, ...MD.posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  function postsOf(traineeId) {
    return allPosts().filter((p) => p.traineeId === traineeId);
  }

  function post(id) {
    return allPosts().find((p) => p.id === id);
  }

  function addPost(p) {
    const list = extraPosts();
    list.unshift(p);
    const ok = write("extraPosts", list);
    return ok;
  }

  function removePost(id) {
    const list = extraPosts().filter((p) => p.id !== id);
    write("extraPosts", list);
  }

  /* ---------------- likes ---------------- */
  function likes() {
    return read("likes", ["yujin-2", "doyun-1"]);
  }

  function isLiked(id) {
    return likes().includes(id);
  }

  function likeCount(post) {
    if (!post) return 0;
    return post.likes + (isLiked(post.id) ? 1 : 0);
  }

  function toggleLike(id) {
    const list = likes();
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1);
    else list.push(id);
    write("likes", list);
    return i < 0;
  }

  /* ---------------- comments ---------------- */
  function comments(postId) {
    const user = read("comments", {});
    return [...(MD.seedComments[postId] || []), ...(user[postId] || [])];
  }

  function commentCount(postId) {
    return comments(postId).length;
  }

  function addComment(postId, c) {
    const all = read("comments", {});
    const list = all[postId] || [];
    list.push({ ...c, date: MD.iso(new Date()), ts: Date.now() });
    all[postId] = list;
    write("comments", all);
    return comments(postId);
  }

  function myComments() {
    const user = read("comments", {});
    const rows = [];
    Object.keys(user).forEach((pid) => {
      user[pid].forEach((c) => rows.push({ ...c, postId: pid }));
    });
    return rows.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  }

  /* ---------------- scout memos ---------------- */
  function memos() {
    return read("memos", {
      doyun: "12월 월말평가 무대 확인 완료. 메인댄스 포지션 적합도 높음.",
    });
  }

  function memo(id) {
    return memos()[id] || "";
  }

  function setMemo(id, text) {
    const all = memos();
    all[id] = text;
    return write("memos", all);
  }

  /* ---------------- inquiries ---------------- */
  function addInquiry(data) {
    const list = read("inquiries", []);
    list.push({ ...data, at: Date.now() });
    write("inquiries", list);
    return true;
  }

  /* ---------------- notifications count (demo) ---------------- */
  function badgeCount(role) {
    if (role === "fan") return favorites("fan").length;
    if (role === "trainee") return myComments().length;
    if (role === "ent") return favorites("ent").length;
    return 0;
  }

  return {
    get persistent() { return persistent; },
    session,
    login,
    logout,
    trainee,
    allTrainees,
    saveProfile,
    favorites,
    isFav,
    toggleFav,
    allPosts,
    postsOf,
    post,
    addPost,
    removePost,
    likes,
    isLiked,
    likeCount,
    toggleLike,
    comments,
    commentCount,
    addComment,
    myComments,
    memo,
    setMemo,
    addInquiry,
    badgeCount,
  };
})();
