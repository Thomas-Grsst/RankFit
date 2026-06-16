// ============================================================
//  MOTEUR DE RANG
//  Calcule un rang (Bronze ... Olympien) pour une performance
//  en fonction du sexe, du poids et de la taille de la personne.
// ============================================================

// --- Définition des rangs (du plus bas au plus haut) ---
// min = seuil de score (0 à 100) pour atteindre ce rang.
const RANKS = [
  { key: "bronze",   name: "Bronze",   color: "#b08d57", min: 0 },
  { key: "argent",   name: "Argent",   color: "#b9c2cc", min: 18 },
  { key: "or",       name: "Or",       color: "#e6b54a", min: 35 },
  { key: "platine",  name: "Platine",  color: "#4fcabf", min: 55 },
  { key: "diamant",  name: "Diamant",  color: "#56a8ff", min: 75 },
  { key: "olympien", name: "Olympien", color: "#a877ff", min: 92 },
];

const RANK_UNRANKED = { key: "none", name: "Non classé", color: "#3a404a" };

// Tailles de référence (cm) servant de base à l'ajustement morphologique.
const REF_HEIGHT = { M: 178, F: 165 };

// Facteur force femme / homme par défaut selon la zone.
// (la force du haut du corps a un écart H/F plus marqué que le bas)
const DEFAULT_FEMALE_FACTOR = {
  upper: 0.60,
  lower: 0.72,
  core: 0.65,
};

// Renvoie le rang correspondant à un score (0-100).
function rankForScore(score) {
  let result = RANKS[0];
  for (const r of RANKS) {
    if (score >= r.min) result = r;
  }
  return result;
}

// Ajustement lié à la taille.
// Une personne plus grande a une amplitude de mouvement plus longue
// (léger désavantage mécanique) : on abaisse légèrement le seuil exigé.
// Effet volontairement modéré et borné à ±12 %.
function heightAdjust(profile) {
  const ref = REF_HEIGHT[profile.sex] || 175;
  const raw = 1 - ((profile.height - ref) / ref) * 0.6;
  return Math.max(0.88, Math.min(1.12, raw));
}

// Facteur femme/homme pour un exercice donné.
function femaleFactor(exercise) {
  if (typeof exercise.femaleFactor === "number") return exercise.femaleFactor;
  const zone = exercise.zone || "upper";
  return DEFAULT_FEMALE_FACTOR[zone] ?? 0.62;
}

// ----------------------------------------------------------------
//  Calcul principal
//  perf  : valeur entrée par l'utilisateur (kg, répétitions ou secondes)
//  exo   : objet exercice (voir exercises.js)
//  profile : { sex:'M'|'F', weight:Number(kg), height:Number(cm) }
//  Retour : { score(0-100), rank, ratio }
// ----------------------------------------------------------------
function computePerformance(perf, exo, profile) {
  if (!perf || perf <= 0) return null;

  // "elite" = valeur correspondant au sommet du barème (entrée Olympien).
  let elite = exo.elite;
  if (profile.sex === "F") elite *= femaleFactor(exo);

  // Ajustement morphologique (taille).
  elite *= heightAdjust(profile);

  let performed;
  if (exo.type === "load") {
    // On compare la charge soulevée au poids de corps (ratio).
    const bw = Math.max(30, profile.weight);
    performed = perf / bw;
  } else {
    // Répétitions ou secondes : valeur brute.
    performed = perf;
  }

  // score = 100 quand on atteint le niveau "Olympien".
  const score = Math.max(0, Math.round((performed / elite) * 100));
  const clamped = Math.min(100, score);

  return {
    score: clamped,
    rawScore: score, // peut dépasser 100 (au-delà du seuil olympien)
    rank: rankForScore(clamped),
    ratio: exo.type === "load" ? performed : null,
  };
}

// Agrège plusieurs performances (un groupe musculaire) en un score moyen.
function aggregateScores(scores) {
  const vals = scores.filter((s) => typeof s === "number");
  if (!vals.length) return null;
  const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  return { score: avg, rank: rankForScore(avg) };
}

window.RankEngine = {
  RANKS,
  RANK_UNRANKED,
  rankForScore,
  computePerformance,
  aggregateScores,
};
