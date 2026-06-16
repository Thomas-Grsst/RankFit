// ============================================================
//  APPLICATION PRINCIPALE
// ============================================================
const { Auth, Profiles, Perfs, DEMO } = window.Store;
const { computePerformance, aggregateScores, RANKS, rankForScore } = window.RankEngine;

const state = {
  user: null,
  profile: null,
  perfs: {},      // { exerciseId: {value, score} }
  view: "home",
};

const $ = (sel) => document.querySelector(sel);
const app = () => $("#app");

// ---------- utilitaires ----------
function rankBadge(rank, score) {
  return `<span class="badge" style="--c:${rank.color}">
    <span class="badge-dot"></span>${rank.name}${score != null ? ` · ${score}` : ""}
  </span>`;
}

function muscleRanks() {
  const out = {};
  window.MUSCLES.forEach((m) => {
    const exos = window.EXERCISES_BY_MUSCLE[m.key] || [];
    const scores = exos
      .map((e) => state.perfs[e.id]?.score)
      .filter((s) => typeof s === "number");
    const agg = aggregateScores(scores);
    if (agg) out[m.key] = { color: agg.rank.color, name: agg.rank.name, score: agg.score };
  });
  return out;
}

// Score global = moyenne de tous les muscles classés.
function globalRank() {
  const mr = muscleRanks();
  const scores = Object.values(mr).map((x) => x.score);
  return aggregateScores(scores);
}

// ============================================================
//  NAVIGATION
// ============================================================
function nav(view) {
  state.view = view;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function header() {
  const g = globalRank();
  return `
  <header class="topbar">
    <div class="brand" onclick="nav('home')">
      <span class="brand-mark">▲</span> RankFit
    </div>
    <nav class="menu">
      <button class="${state.view === "home" ? "active" : ""}" onclick="nav('home')">Accueil</button>
      <button class="${state.view === "calc" ? "active" : ""}" onclick="nav('calc')">Mes exercices</button>
      <button class="${state.view === "ranking" ? "active" : ""}" onclick="nav('ranking')">Classement</button>
      ${state.user
        ? `<button class="${state.view === "profile" ? "active" : ""}" onclick="nav('profile')">Profil</button>
           <button class="ghost" onclick="doSignOut()">Déconnexion</button>`
        : `<button class="primary" onclick="nav('auth')">Connexion</button>`}
    </nav>
  </header>`;
}

// ============================================================
//  VUE : ACCUEIL (personnage)
// ============================================================
function viewHome() {
  const g = globalRank();
  const hasData = Object.keys(muscleRanks()).length > 0;

  app().innerHTML = `
    ${header()}
    <main class="container home">
      <section class="hero">
        <div class="hero-text">
          <h1>Quel est ton <span class="grad">rang</span> ?</h1>
          <p class="lead">Entre tes performances et découvre ton niveau sur chaque exercice,
          ajusté à ton sexe, ton poids et ta taille. Chaque muscle de ton avatar se colore
          selon ton rang.</p>
          ${g
            ? `<div class="global-rank">Rang global : ${rankBadge(g.rank, g.score)}</div>`
            : `<p class="muted">Renseigne tes performances pour colorer ton avatar.</p>`}
          <div class="hero-actions">
            <button class="primary lg" onclick="nav('calc')">${hasData ? "Mettre à jour mes perfs" : "Commencer"}</button>
            <button class="ghost lg" onclick="nav('ranking')">Voir le classement</button>
          </div>
          ${renderLegend()}
        </div>
        <div class="hero-figure">
          <div id="bodyHost" class="body-host"></div>
        </div>
      </section>
    </main>
    ${footer()}`;

  const host = $("#bodyHost");
  window.BodyFigure.renderBody(host);
  window.BodyFigure.colorBody(host, muscleRanks(), (key) => nav("calc"));
}

function renderLegend() {
  return `<div class="legend">
    ${RANKS.map((r) => `<span class="legend-item"><i style="background:${r.color}"></i>${r.name}</span>`).join("")}
    <span class="legend-item"><i style="background:#3a404a"></i>Non classé</span>
  </div>`;
}

// ============================================================
//  VUE : MES EXERCICES (calculateur)
// ============================================================
function viewCalc() {
  if (!state.user) return viewAuth("Connecte-toi pour enregistrer tes performances.");
  if (!state.profile) return viewProfile(true);

  const groups = window.MUSCLES.map((m) => {
    const exos = window.EXERCISES_BY_MUSCLE[m.key] || [];
    const rows = exos.map((e) => {
      const p = state.perfs[e.id];
      const unit = window.UNIT_LABELS[e.unit];
      const badge = p ? rankBadge(rankForScore(p.score), p.score) : `<span class="muted small">—</span>`;
      return `
        <div class="exo-row">
          <div class="exo-name">${e.name}</div>
          <div class="exo-input">
            <input type="number" min="0" step="0.5" inputmode="decimal"
              id="inp-${e.id}" value="${p ? p.value : ""}"
              placeholder="0" onchange="savePerf('${e.id}')"/>
            <span class="unit">${unit.suffix}</span>
          </div>
          <div class="exo-rank" id="rank-${e.id}">${badge}</div>
        </div>`;
    }).join("");

    const mr = muscleRanks()[m.key];
    return `
      <details class="muscle-card" open>
        <summary>
          <span class="muscle-title">${m.label}</span>
          ${mr ? rankBadge(rankForScore(mr.score), mr.score) : `<span class="muted small">Non classé</span>`}
        </summary>
        <div class="exo-list">
          <div class="exo-row head">
            <div>Exercice</div><div>Ta perf</div><div>Rang</div>
          </div>
          ${rows}
        </div>
      </details>`;
  }).join("");

  app().innerHTML = `
    ${header()}
    <main class="container">
      <div class="page-head">
        <h2>Mes exercices</h2>
        <p class="muted">${state.profile.sex === "F" ? "Femme" : "Homme"} · ${state.profile.weight} kg · ${state.profile.height} cm
          <button class="link" onclick="nav('profile')">modifier</button></p>
      </div>
      ${groups}
    </main>
    ${footer()}`;
}

async function savePerf(exId) {
  const exo = window.EXERCISE_BY_ID[exId];
  const inp = $("#inp-" + exId);
  const val = parseFloat(inp.value);
  const cell = $("#rank-" + exId);

  if (!val || val <= 0) {
    delete state.perfs[exId];
    cell.innerHTML = `<span class="muted small">—</span>`;
    return;
  }
  const res = computePerformance(val, exo, state.profile);
  if (!res) return;
  state.perfs[exId] = { value: val, score: res.score };
  cell.innerHTML = rankBadge(res.rank, res.score);
  try { await Perfs.save(state.user.id, exId, val, res.score); }
  catch (e) { toast("Erreur d'enregistrement : " + e.message); }
}

// ============================================================
//  VUE : PROFIL
// ============================================================
function viewProfile(forced) {
  if (!state.user) return viewAuth();
  const p = state.profile || { pseudo: state.user.pseudo, sex: "M", weight: 75, height: 178 };

  app().innerHTML = `
    ${header()}
    <main class="container narrow">
      <div class="card form-card">
        <h2>${forced ? "Complète ton profil" : "Mon profil"}</h2>
        <p class="muted">Ces informations servent à calculer tes rangs (barèmes ajustés au sexe, poids et taille).</p>
        <label>Pseudo
          <input id="f-pseudo" value="${p.pseudo || ""}" placeholder="Ton pseudo"/></label>
        <label>Sexe
          <select id="f-sex">
            <option value="M" ${p.sex === "M" ? "selected" : ""}>Homme</option>
            <option value="F" ${p.sex === "F" ? "selected" : ""}>Femme</option>
          </select></label>
        <div class="row2">
          <label>Poids (kg)
            <input id="f-weight" type="number" min="30" max="250" value="${p.weight}"/></label>
          <label>Taille (cm)
            <input id="f-height" type="number" min="120" max="230" value="${p.height}"/></label>
        </div>
        <button class="primary lg" onclick="saveProfile()">Enregistrer</button>
        <p id="profile-msg" class="msg"></p>
      </div>
    </main>
    ${footer()}`;
}

async function saveProfile() {
  const profile = {
    pseudo: $("#f-pseudo").value.trim() || state.user.pseudo,
    sex: $("#f-sex").value,
    weight: parseFloat($("#f-weight").value),
    height: parseFloat($("#f-height").value),
  };
  if (!profile.weight || !profile.height) {
    $("#profile-msg").textContent = "Renseigne ton poids et ta taille.";
    return;
  }
  try {
    await Profiles.save(state.user.id, profile);
    state.profile = profile;
    // Recalcule les scores existants avec le nouveau profil.
    await recomputeAll();
    toast("Profil enregistré.");
    nav("calc");
  } catch (e) {
    $("#profile-msg").textContent = "Erreur : " + e.message;
  }
}

async function recomputeAll() {
  for (const exId of Object.keys(state.perfs)) {
    const exo = window.EXERCISE_BY_ID[exId];
    const res = computePerformance(state.perfs[exId].value, exo, state.profile);
    if (res) {
      state.perfs[exId].score = res.score;
      try { await Perfs.save(state.user.id, exId, state.perfs[exId].value, res.score); } catch {}
    }
  }
}

// ============================================================
//  VUE : CLASSEMENT
// ============================================================
let rankingExo = "bench_barbell";
function viewRanking() {
  const options = window.MUSCLES.map((m) => {
    const exos = (window.EXERCISES_BY_MUSCLE[m.key] || [])
      .map((e) => `<option value="${e.id}" ${e.id === rankingExo ? "selected" : ""}>${e.name}</option>`)
      .join("");
    return `<optgroup label="${m.label}">${exos}</optgroup>`;
  }).join("");

  app().innerHTML = `
    ${header()}
    <main class="container narrow">
      <div class="page-head"><h2>Classement</h2>
        <p class="muted">Meilleurs scores par exercice (tous niveaux confondus).</p></div>
      <label class="select-wrap">Exercice
        <select id="rk-select" onchange="changeRankingExo()">${options}</select></label>
      <div id="rk-list" class="board">Chargement…</div>
    </main>
    ${footer()}`;
  loadLeaderboard();
}

function changeRankingExo() {
  rankingExo = $("#rk-select").value;
  loadLeaderboard();
}

async function loadLeaderboard() {
  const host = $("#rk-list");
  try {
    const rows = await Perfs.leaderboard(rankingExo);
    const exo = window.EXERCISE_BY_ID[rankingExo];
    const unit = window.UNIT_LABELS[exo.unit].suffix;
    if (!rows.length) { host.innerHTML = `<p class="muted">Aucune performance enregistrée pour cet exercice.</p>`; return; }
    host.innerHTML = rows.map((r, i) => {
      const rank = rankForScore(r.score);
      return `<div class="board-row">
        <span class="pos">${i + 1}</span>
        <span class="who">${escapeHtml(r.pseudo)}</span>
        <span class="val">${r.value} ${unit}</span>
        ${rankBadge(rank, r.score)}
      </div>`;
    }).join("");
  } catch (e) {
    host.innerHTML = `<p class="msg">Erreur : ${e.message}</p>`;
  }
}

// ============================================================
//  VUE : AUTH
// ============================================================
let authMode = "in";
function viewAuth(note) {
  app().innerHTML = `
    ${header()}
    <main class="container narrow">
      <div class="card form-card">
        <div class="tabs">
          <button class="${authMode === "in" ? "active" : ""}" onclick="setAuthMode('in')">Connexion</button>
          <button class="${authMode === "up" ? "active" : ""}" onclick="setAuthMode('up')">Inscription</button>
        </div>
        ${note ? `<p class="muted">${note}</p>` : ""}
        ${authMode === "up" ? `<label>Pseudo<input id="a-pseudo" placeholder="Ton pseudo"/></label>` : ""}
        <label>Email<input id="a-email" type="email" placeholder="toi@email.com"/></label>
        <label>Mot de passe<input id="a-pass" type="password" placeholder="••••••••"/></label>
        <button class="primary lg" onclick="doAuth()">${authMode === "in" ? "Se connecter" : "Créer mon compte"}</button>
        <p id="auth-msg" class="msg"></p>
        ${DEMO ? `<p class="demo-note">⚙️ Mode démo actif : tes données restent dans ce navigateur.
          Configure Supabase dans <code>js/config.js</code> pour activer les comptes en ligne.</p>` : ""}
      </div>
    </main>
    ${footer()}`;
}
function setAuthMode(m) { authMode = m; viewAuth(); }

async function doAuth() {
  const email = $("#a-email").value.trim();
  const pass = $("#a-pass").value;
  const msg = $("#auth-msg");
  if (!email || !pass) { msg.textContent = "Email et mot de passe requis."; return; }
  try {
    if (authMode === "up") {
      const pseudo = ($("#a-pseudo")?.value || email.split("@")[0]).trim();
      await Auth.signUp(email, pass, pseudo);
      // En production Supabase peut exiger une confirmation email.
      if (!DEMO) { msg.textContent = "Compte créé. Vérifie ton email si la confirmation est activée, puis connecte-toi."; authMode = "in"; viewAuth("Compte créé, connecte-toi."); return; }
    } else {
      await Auth.signIn(email, pass);
    }
    await loadSession();
    nav(state.profile ? "calc" : "profile");
  } catch (e) {
    msg.textContent = "Erreur : " + e.message;
  }
}

async function doSignOut() {
  await Auth.signOut();
  state.user = null; state.profile = null; state.perfs = {};
  nav("home");
}

// ============================================================
//  COMMUN
// ============================================================
function footer() {
  return `<footer class="foot">
    <span>RankFit · barèmes de force ajustés ${DEMO ? "· <b>mode démo</b>" : ""}</span>
  </footer>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function toast(text) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 2600);
}

function render() {
  switch (state.view) {
    case "calc": return viewCalc();
    case "profile": return viewProfile();
    case "ranking": return viewRanking();
    case "auth": return viewAuth();
    default: return viewHome();
  }
}

async function loadSession() {
  state.user = await Auth.current();
  if (state.user) {
    state.profile = await Profiles.get(state.user.id);
    state.perfs = await Perfs.list(state.user.id);
  }
}

// ---------- démarrage ----------
(async function init() {
  try { await loadSession(); } catch (e) { console.warn(e); }
  render();
})();

// expose pour les onclick inline
Object.assign(window, {
  nav, savePerf, saveProfile, doAuth, doSignOut,
  setAuthMode, changeRankingExo,
});
