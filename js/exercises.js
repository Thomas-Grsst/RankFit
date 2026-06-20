// ============================================================
//  BASE D'EXERCICES
//   id     : identifiant unique
//   name   : nom affiché
//   group  : catégorie affichée dans le calculateur
//   muscle : zone du corps colorée sur l'avatar (région SVG)
//   zone   : 'upper' | 'lower' | 'core' (ajustement force H/F)
//   type   : 'load' (charge) | 'reps' | 'time'
//   unit   : 'kg' | 'kg_db' (par haltère) | 'reps' | 'sec'
//   elite  : valeur "Olympien" de référence (homme)
//            - load : ratio charge / poids de corps
//            - reps/time : nombre de reps ou secondes
//  Barèmes ajustables : modifie "elite" pour durcir/assouplir.
// ============================================================

// --- Régions musculaires de l'avatar (ordre = légende) ---
window.MUSCLES = [
  { key: "epaules_av",  label: "Épaules (avant/latéral)" },
  { key: "epaules_post",label: "Épaules (arrière)" },
  { key: "pectoraux",   label: "Pectoraux" },
  { key: "grand_dorsal",label: "Grand dorsal" },
  { key: "milieu_dos",  label: "Milieu du dos" },
  { key: "biceps",      label: "Biceps" },
  { key: "triceps",     label: "Triceps" },
  { key: "avantbras",   label: "Avant-bras" },
  { key: "abdominaux",  label: "Abdominaux" },
  { key: "quadriceps",  label: "Quadriceps" },
  { key: "adducteurs",  label: "Adducteurs" },
  { key: "abducteurs",  label: "Abducteurs" },
  { key: "ischio",      label: "Ischio-jambiers" },
  { key: "mollets",     label: "Mollets" },
];

// --- Ordre des catégories dans le calculateur ---
window.GROUP_ORDER = [
  "Pectoraux", "Triceps", "Biceps", "Avant-bras",
  "Épaules — antérieur", "Épaules — moyen", "Épaules — postérieur",
  "Grand dorsal", "Milieu du dos",
  "Quadriceps", "Adducteurs", "Abducteurs", "Ischio-jambiers",
  "Abdominaux",
];

window.EXERCISES = [
  // ---------------- PECTORAUX ----------------
  { id: "pec_fly",          name: "Pec fly",                 group: "Pectoraux", muscle: "pectoraux", zone: "upper", type: "load", unit: "kg", elite: 1.00 },
  { id: "bench_press",      name: "Développé couché",        group: "Pectoraux", muscle: "pectoraux", zone: "upper", type: "load", unit: "kg", elite: 1.80 },
  { id: "chest_press",      name: "Chest press",             group: "Pectoraux", muscle: "pectoraux", zone: "upper", type: "load", unit: "kg", elite: 1.60 },
  { id: "conv_chest_press", name: "Converging chest press",  group: "Pectoraux", muscle: "pectoraux", zone: "upper", type: "load", unit: "kg", elite: 1.60 },

  // ---------------- TRICEPS ----------------
  { id: "rope_pushdown",    name: "Cable rope pushdown",     group: "Triceps", muscle: "triceps", zone: "upper", type: "load", unit: "kg", elite: 0.70 },
  { id: "overhead_triceps", name: "Overhead triceps",        group: "Triceps", muscle: "triceps", zone: "upper", type: "load", unit: "kg", elite: 0.60 },
  { id: "skull_crusher",    name: "Skull crusher",           group: "Triceps", muscle: "triceps", zone: "upper", type: "load", unit: "kg", elite: 0.70 },

  // ---------------- BICEPS ----------------
  { id: "arm_curl",         name: "Arm curl",                group: "Biceps", muscle: "biceps", zone: "upper", type: "load", unit: "kg", elite: 0.80 },
  { id: "preacher_curl",    name: "Curl banc (pupitre)",     group: "Biceps", muscle: "biceps", zone: "upper", type: "load", unit: "kg", elite: 0.60 },

  // ---------------- AVANT-BRAS ----------------
  { id: "handgrip",         name: "Handgrip",                group: "Avant-bras", muscle: "avantbras", zone: "upper", type: "reps", unit: "reps", elite: 50, femaleFactor: 0.70 },
  { id: "reverse_curl",     name: "Curl inversé",            group: "Avant-bras", muscle: "avantbras", zone: "upper", type: "load", unit: "kg", elite: 0.45 },

  // ---------------- ÉPAULES — ANTÉRIEUR ----------------
  { id: "front_raises",     name: "Front raises",            group: "Épaules — antérieur", muscle: "epaules_av", zone: "upper", type: "load", unit: "kg_db", elite: 0.16, femaleFactor: 0.58 },

  // ---------------- ÉPAULES — MOYEN ----------------
  { id: "lateral_raises",   name: "Lateral raises (poulie)", group: "Épaules — moyen", muscle: "epaules_av", zone: "upper", type: "load", unit: "kg", elite: 0.18, femaleFactor: 0.58 },
  { id: "conv_shoulder_press", name: "Converging shoulder press", group: "Épaules — moyen", muscle: "epaules_av", zone: "upper", type: "load", unit: "kg", elite: 1.00 },

  // ---------------- ÉPAULES — POSTÉRIEUR ----------------
  { id: "rear_delt",        name: "Rear delt",               group: "Épaules — postérieur", muscle: "epaules_post", zone: "upper", type: "load", unit: "kg", elite: 0.70, femaleFactor: 0.62 },

  // ---------------- GRAND DORSAL ----------------
  { id: "pullups",          name: "Tractions",               group: "Grand dorsal", muscle: "grand_dorsal", zone: "upper", type: "reps", unit: "reps", elite: 32 },
  { id: "lat_pulldown",     name: "Lat pulldown",            group: "Grand dorsal", muscle: "grand_dorsal", zone: "upper", type: "load", unit: "kg", elite: 1.30 },

  // ---------------- MILIEU DU DOS ----------------
  { id: "seated_row",       name: "Diverging seated row",    group: "Milieu du dos", muscle: "milieu_dos", zone: "upper", type: "load", unit: "kg", elite: 1.40 },

  // ---------------- QUADRICEPS ----------------
  { id: "leg_extension",    name: "Leg extension",           group: "Quadriceps", muscle: "quadriceps", zone: "lower", type: "load", unit: "kg", elite: 1.20 },

  // ---------------- ADDUCTEURS ----------------
  { id: "hip_adduction",    name: "Hip adduction",           group: "Adducteurs", muscle: "adducteurs", zone: "lower", type: "load", unit: "kg", elite: 1.20 },

  // ---------------- ABDUCTEURS ----------------
  { id: "hip_abduction",    name: "Hip abduction",           group: "Abducteurs", muscle: "abducteurs", zone: "lower", type: "load", unit: "kg", elite: 1.30 },

  // ---------------- ISCHIO-JAMBIERS ----------------
  { id: "leg_press",        name: "Leg press",               group: "Ischio-jambiers", muscle: "ischio", zone: "lower", type: "load", unit: "kg", elite: 4.50 },

  // ---------------- ABDOMINAUX ----------------
  { id: "crunch",           name: "Crunch",                  group: "Abdominaux", muscle: "abdominaux", zone: "core", type: "reps", unit: "reps", elite: 90 },
];

// Libellés d'unité
window.UNIT_LABELS = {
  kg:    { input: "Charge totale (kg)",      suffix: "kg" },
  kg_db: { input: "Charge par haltère (kg)", suffix: "kg/halt." },
  reps:  { input: "Répétitions max",         suffix: "reps" },
  sec:   { input: "Durée tenue (secondes)",  suffix: "s" },
};

// Index pratiques
window.EXERCISE_BY_ID = Object.fromEntries(window.EXERCISES.map((e) => [e.id, e]));
window.EXERCISES_BY_MUSCLE = window.MUSCLES.reduce((acc, m) => {
  acc[m.key] = window.EXERCISES.filter((e) => e.muscle === m.key);
  return acc;
}, {});
window.EXERCISES_BY_GROUP = window.GROUP_ORDER.reduce((acc, g) => {
  acc[g] = window.EXERCISES.filter((e) => e.group === g);
  return acc;
}, {});
