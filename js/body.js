// ============================================================
//  PERSONNAGE ANATOMIQUE (SVG)
//  Deux silhouettes (face + dos). Chaque muscle est une zone
//  séparée que l'on colore avec la couleur du rang de la personne.
// ============================================================

// --- Silhouette de FACE ---
function frontFigure() {
  return `
  <svg viewBox="0 0 200 530" class="figure" role="img" aria-label="Vue de face">
    <!-- base neutre -->
    <circle class="body-base" cx="100" cy="42" r="26"/>
    <rect   class="body-base" x="89" y="64" width="22" height="20" rx="7"/>
    <!-- avant-bras (non classés) -->
    <rect class="body-base" x="34"  y="176" width="20" height="64" rx="10"/>
    <rect class="body-base" x="146" y="176" width="20" height="64" rx="10"/>
    <circle class="body-base" cx="44"  cy="252" r="11"/>
    <circle class="body-base" cx="156" cy="252" r="11"/>
    <!-- bassin -->
    <rect class="body-base" x="70" y="214" width="60" height="80" rx="18"/>
    <!-- genoux + pieds -->
    <circle class="body-base" cx="82"  cy="416" r="11"/>
    <circle class="body-base" cx="118" cy="416" r="11"/>
    <ellipse class="body-base" cx="80"  cy="516" rx="15" ry="9"/>
    <ellipse class="body-base" cx="120" cy="516" rx="15" ry="9"/>

    <!-- muscles -->
    <ellipse class="muscle" data-muscle="epaules" cx="60"  cy="100" rx="19" ry="17"/>
    <ellipse class="muscle" data-muscle="epaules" cx="140" cy="100" rx="19" ry="17"/>

    <path class="muscle" data-muscle="pectoraux"
      d="M72,90 Q100,84 128,90 L130,140 Q100,156 70,140 Z"/>

    <rect class="muscle" data-muscle="biceps" x="38"  y="106" width="24" height="70" rx="12"/>
    <rect class="muscle" data-muscle="biceps" x="138" y="106" width="24" height="70" rx="12"/>

    <rect class="muscle" data-muscle="abdominaux" x="80" y="150" width="40" height="64" rx="9"/>

    <path class="muscle" data-muscle="quadriceps"
      d="M70,300 Q84,296 97,300 L94,412 Q82,420 71,412 Z"/>
    <path class="muscle" data-muscle="quadriceps"
      d="M103,300 Q116,296 130,300 L129,412 Q118,420 106,412 Z"/>

    <rect class="muscle" data-muscle="mollets" x="69"  y="424" width="25" height="78" rx="12"/>
    <rect class="muscle" data-muscle="mollets" x="106" y="424" width="25" height="78" rx="12"/>
  </svg>`;
}

// --- Silhouette de DOS ---
function backFigure() {
  return `
  <svg viewBox="0 0 200 530" class="figure" role="img" aria-label="Vue de dos">
    <!-- base neutre -->
    <circle class="body-base" cx="100" cy="42" r="26"/>
    <rect   class="body-base" x="89" y="64" width="22" height="20" rx="7"/>
    <rect class="body-base" x="34"  y="176" width="20" height="64" rx="10"/>
    <rect class="body-base" x="146" y="176" width="20" height="64" rx="10"/>
    <circle class="body-base" cx="44"  cy="252" r="11"/>
    <circle class="body-base" cx="156" cy="252" r="11"/>
    <circle class="body-base" cx="82"  cy="416" r="11"/>
    <circle class="body-base" cx="118" cy="416" r="11"/>
    <ellipse class="body-base" cx="80"  cy="516" rx="15" ry="9"/>
    <ellipse class="body-base" cx="120" cy="516" rx="15" ry="9"/>

    <!-- muscles -->
    <ellipse class="muscle" data-muscle="epaules" cx="60"  cy="100" rx="19" ry="17"/>
    <ellipse class="muscle" data-muscle="epaules" cx="140" cy="100" rx="19" ry="17"/>

    <!-- dos (trapèzes + dorsaux) -->
    <path class="muscle" data-muscle="dos"
      d="M70,88 Q100,82 130,88 L134,150 Q100,182 66,150 Z"/>

    <rect class="muscle" data-muscle="triceps" x="38"  y="106" width="24" height="70" rx="12"/>
    <rect class="muscle" data-muscle="triceps" x="138" y="106" width="24" height="70" rx="12"/>

    <!-- fessiers -->
    <path class="muscle" data-muscle="ischio_fessiers"
      d="M72,212 Q100,206 128,212 Q132,250 100,258 Q68,250 72,212 Z"/>
    <!-- ischio-jambiers (arrière cuisses) -->
    <path class="muscle" data-muscle="ischio_fessiers"
      d="M70,300 Q84,296 97,300 L94,412 Q82,420 71,412 Z"/>
    <path class="muscle" data-muscle="ischio_fessiers"
      d="M103,300 Q116,296 130,300 L129,412 Q118,420 106,412 Z"/>

    <rect class="muscle" data-muscle="mollets" x="69"  y="424" width="25" height="78" rx="12"/>
    <rect class="muscle" data-muscle="mollets" x="106" y="424" width="25" height="78" rx="12"/>
  </svg>`;
}

// Construit le personnage complet dans un conteneur.
function renderBody(container) {
  container.innerHTML = `
    <div class="figure-pair">
      <div class="figure-wrap"><span class="figure-label">Face</span>${frontFigure()}</div>
      <div class="figure-wrap"><span class="figure-label">Dos</span>${backFigure()}</div>
    </div>`;
}

// Applique les couleurs de rang. ranksByMuscle = { muscleKey: {color, name, score} }
// Met aussi en place les infobulles + clic.
function colorBody(container, ranksByMuscle, onMuscleClick) {
  const muscles = container.querySelectorAll(".muscle");
  muscles.forEach((el) => {
    const key = el.getAttribute("data-muscle");
    const info = ranksByMuscle[key];
    const color = info ? info.color : "#3a404a";
    el.style.fill = color;
    el.classList.toggle("is-ranked", !!info);

    const label = (window.MUSCLES.find((m) => m.key === key) || {}).label || key;
    const title = info ? `${label} — ${info.name} (${info.score})` : `${label} — Non classé`;
    el.setAttribute("data-title", title);

    el.onmouseenter = (e) => showTip(container, e, title);
    el.onmousemove = (e) => moveTip(container, e);
    el.onmouseleave = () => hideTip(container);
    el.onclick = () => onMuscleClick && onMuscleClick(key);
    el.style.cursor = "pointer";
  });
}

// --- petite infobulle ---
function ensureTip(container) {
  let tip = container.querySelector(".muscle-tip");
  if (!tip) {
    tip = document.createElement("div");
    tip.className = "muscle-tip";
    container.appendChild(tip);
  }
  return tip;
}
function showTip(container, e, text) {
  const tip = ensureTip(container);
  tip.textContent = text;
  tip.style.opacity = "1";
  moveTip(container, e);
}
function moveTip(container, e) {
  const tip = container.querySelector(".muscle-tip");
  if (!tip) return;
  const rect = container.getBoundingClientRect();
  tip.style.left = e.clientX - rect.left + 12 + "px";
  tip.style.top = e.clientY - rect.top + 12 + "px";
}
function hideTip(container) {
  const tip = container.querySelector(".muscle-tip");
  if (tip) tip.style.opacity = "0";
}

window.BodyFigure = { renderBody, colorBody };
