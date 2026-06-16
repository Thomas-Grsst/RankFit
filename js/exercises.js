// ============================================================
//  BASE D'EXERCICES
//  Chaque exercice possède :
//   id       : identifiant unique
//   name     : nom affiché
//   muscle   : zone du corps (sert à colorer le personnage)
//   zone     : 'upper' | 'lower' | 'core' (ajustement force H/F)
//   type     : 'load' (charge) | 'reps' (répétitions) | 'time' (secondes)
//   unit     : 'kg' total | 'kg_db' par haltère | 'reps' | 'sec'
//   elite    : valeur "Olympien" de référence (homme).
//              - type load : ratio charge / poids de corps
//              - type reps/time : nombre de reps ou secondes
//  Les seuils sont volontairement ajustables : modifie "elite"
//  pour durcir ou assouplir un barème.
// ============================================================

// Métadonnées des zones musculaires (ordre + libellé pour le personnage)
window.MUSCLES = [
  { key: "epaules",        label: "Épaules" },
  { key: "pectoraux",      label: "Pectoraux" },
  { key: "dos",            label: "Dos" },
  { key: "biceps",         label: "Biceps" },
  { key: "triceps",        label: "Triceps" },
  { key: "abdominaux",     label: "Abdominaux" },
  { key: "quadriceps",     label: "Quadriceps" },
  { key: "ischio_fessiers",label: "Ischios / Fessiers" },
  { key: "mollets",        label: "Mollets" },
];

window.EXERCISES = [
  // ---------------- PECTORAUX ----------------
  { id: "bench_barbell",   name: "Développé couché barre",     muscle: "pectoraux", zone: "upper", type: "load", unit: "kg",    elite: 1.80 },
  { id: "bench_db",        name: "Développé couché haltères",  muscle: "pectoraux", zone: "upper", type: "load", unit: "kg_db", elite: 0.62 },
  { id: "incline_barbell", name: "Développé incliné barre",    muscle: "pectoraux", zone: "upper", type: "load", unit: "kg",    elite: 1.50 },
  { id: "incline_db",      name: "Développé incliné haltères", muscle: "pectoraux", zone: "upper", type: "load", unit: "kg_db", elite: 0.55 },
  { id: "fly_db",          name: "Écarté haltères",            muscle: "pectoraux", zone: "upper", type: "load", unit: "kg_db", elite: 0.32 },
  { id: "pec_deck",        name: "Pec deck (butterfly)",       muscle: "pectoraux", zone: "upper", type: "load", unit: "kg",    elite: 1.00 },
  { id: "cable_fly",       name: "Écarté à la poulie",         muscle: "pectoraux", zone: "upper", type: "load", unit: "kg",    elite: 0.75 },
  { id: "pushups",         name: "Pompes",                     muscle: "pectoraux", zone: "upper", type: "reps", unit: "reps",  elite: 90 },

  // ---------------- DOS ----------------
  { id: "pullup_pro",      name: "Tractions pronation",        muscle: "dos", zone: "upper", type: "reps", unit: "reps",  elite: 32 },
  { id: "pullup_sup",      name: "Tractions supination",       muscle: "dos", zone: "upper", type: "reps", unit: "reps",  elite: 35 },
  { id: "lat_pulldown",    name: "Tirage vertical",            muscle: "dos", zone: "upper", type: "load", unit: "kg",    elite: 1.30 },
  { id: "row_barbell",     name: "Rowing barre",               muscle: "dos", zone: "upper", type: "load", unit: "kg",    elite: 1.50 },
  { id: "row_db",          name: "Rowing haltère un bras",     muscle: "dos", zone: "upper", type: "load", unit: "kg_db", elite: 0.70 },
  { id: "seated_row",      name: "Tirage horizontal poulie",   muscle: "dos", zone: "upper", type: "load", unit: "kg",    elite: 1.30 },
  { id: "tbar_row",        name: "T-Bar Row",                  muscle: "dos", zone: "upper", type: "load", unit: "kg",    elite: 1.40 },
  { id: "deadlift",        name: "Soulevé de terre",           muscle: "dos", zone: "lower", type: "load", unit: "kg",    elite: 2.80 },

  // ---------------- ÉPAULES ----------------
  { id: "ohp",             name: "Développé militaire",        muscle: "epaules", zone: "upper", type: "load", unit: "kg",    elite: 1.15 },
  { id: "seated_db_press", name: "Développé haltères assis",   muscle: "epaules", zone: "upper", type: "load", unit: "kg_db", elite: 0.42 },
  { id: "lateral_raise",   name: "Élévations latérales",       muscle: "epaules", zone: "upper", type: "load", unit: "kg_db", elite: 0.18, femaleFactor: 0.58 },
  { id: "front_raise",     name: "Élévations frontales",       muscle: "epaules", zone: "upper", type: "load", unit: "kg_db", elite: 0.16, femaleFactor: 0.58 },
  { id: "reverse_fly",     name: "Oiseau",                     muscle: "epaules", zone: "upper", type: "load", unit: "kg_db", elite: 0.16, femaleFactor: 0.60 },
  { id: "face_pull",       name: "Face pull",                  muscle: "epaules", zone: "upper", type: "load", unit: "kg",    elite: 0.60 },

  // ---------------- BICEPS ----------------
  { id: "curl_barbell",    name: "Curl barre",                 muscle: "biceps", zone: "upper", type: "load", unit: "kg",    elite: 0.85 },
  { id: "curl_ez",         name: "Curl EZ",                    muscle: "biceps", zone: "upper", type: "load", unit: "kg",    elite: 0.80 },
  { id: "curl_db_alt",     name: "Curl haltères alterné",      muscle: "biceps", zone: "upper", type: "load", unit: "kg_db", elite: 0.32 },
  { id: "curl_hammer",     name: "Curl marteau",               muscle: "biceps", zone: "upper", type: "load", unit: "kg_db", elite: 0.34 },
  { id: "curl_incline",    name: "Curl incliné",               muscle: "biceps", zone: "upper", type: "load", unit: "kg_db", elite: 0.28 },
  { id: "curl_cable",      name: "Curl poulie",                muscle: "biceps", zone: "upper", type: "load", unit: "kg",    elite: 0.60 },

  // ---------------- TRICEPS ----------------
  { id: "dips",            name: "Dips",                       muscle: "triceps", zone: "upper", type: "reps", unit: "reps",  elite: 45 },
  { id: "skull_crusher",   name: "Barre front (skull crusher)",muscle: "triceps", zone: "upper", type: "load", unit: "kg",    elite: 0.70 },
  { id: "triceps_pushdown",name: "Extension poulie (corde)",   muscle: "triceps", zone: "upper", type: "load", unit: "kg",    elite: 0.70 },
  { id: "triceps_overhead",name: "Extension au-dessus tête",   muscle: "triceps", zone: "upper", type: "load", unit: "kg_db", elite: 0.30 },
  { id: "close_grip_bench",name: "Développé couché prise serrée",muscle:"triceps", zone: "upper", type: "load", unit: "kg",   elite: 1.40 },

  // ---------------- QUADRICEPS ----------------
  { id: "squat",           name: "Squat",                      muscle: "quadriceps", zone: "lower", type: "load", unit: "kg",    elite: 2.30 },
  { id: "front_squat",     name: "Squat avant",                muscle: "quadriceps", zone: "lower", type: "load", unit: "kg",    elite: 1.80 },
  { id: "leg_press",       name: "Presse à cuisses",           muscle: "quadriceps", zone: "lower", type: "load", unit: "kg",    elite: 4.50 },
  { id: "leg_extension",   name: "Leg extension",              muscle: "quadriceps", zone: "lower", type: "load", unit: "kg",    elite: 1.20 },
  { id: "lunges",          name: "Fentes",                     muscle: "quadriceps", zone: "lower", type: "load", unit: "kg_db", elite: 0.60 },
  { id: "bulgarian",       name: "Bulgarian split squat",      muscle: "quadriceps", zone: "lower", type: "load", unit: "kg_db", elite: 0.55 },

  // ---------------- ISCHIO / FESSIERS ----------------
  { id: "rdl",             name: "Soulevé de terre roumain",   muscle: "ischio_fessiers", zone: "lower", type: "load", unit: "kg", elite: 2.00 },
  { id: "hip_thrust",      name: "Hip thrust",                 muscle: "ischio_fessiers", zone: "lower", type: "load", unit: "kg", elite: 3.00, femaleFactor: 0.85 },
  { id: "leg_curl",        name: "Leg curl",                   muscle: "ischio_fessiers", zone: "lower", type: "load", unit: "kg", elite: 1.00 },
  { id: "good_morning",    name: "Good morning",               muscle: "ischio_fessiers", zone: "lower", type: "load", unit: "kg", elite: 1.30 },
  { id: "glute_bridge",    name: "Glute bridge",               muscle: "ischio_fessiers", zone: "lower", type: "load", unit: "kg", elite: 2.50, femaleFactor: 0.85 },

  // ---------------- MOLLETS ----------------
  { id: "calf_standing",   name: "Mollets debout",             muscle: "mollets", zone: "lower", type: "load", unit: "kg", elite: 3.00, femaleFactor: 0.80 },
  { id: "calf_seated",     name: "Mollets assis",              muscle: "mollets", zone: "lower", type: "load", unit: "kg", elite: 1.80, femaleFactor: 0.80 },
  { id: "calf_press",      name: "Mollets à la presse",        muscle: "mollets", zone: "lower", type: "load", unit: "kg", elite: 4.00, femaleFactor: 0.80 },

  // ---------------- ABDOMINAUX ----------------
  { id: "crunch",          name: "Crunch",                     muscle: "abdominaux", zone: "core", type: "reps", unit: "reps", elite: 90 },
  { id: "leg_raises",      name: "Relevés de jambes",          muscle: "abdominaux", zone: "core", type: "reps", unit: "reps", elite: 35 },
  { id: "plank",           name: "Gainage (planche)",          muscle: "abdominaux", zone: "core", type: "time", unit: "sec",  elite: 240 },
  { id: "side_plank",      name: "Planche latérale",           muscle: "abdominaux", zone: "core", type: "time", unit: "sec",  elite: 150 },
  { id: "russian_twist",   name: "Russian twist",              muscle: "abdominaux", zone: "core", type: "reps", unit: "reps", elite: 80 },
  { id: "ab_wheel",        name: "Ab wheel",                   muscle: "abdominaux", zone: "core", type: "reps", unit: "reps", elite: 30 },

  // ---------------- FULL BODY / POLYARTICULAIRES ----------------
  { id: "farmer_walk",     name: "Farmer walk",                muscle: "dos", zone: "lower", type: "load", unit: "kg", elite: 2.00 },
  { id: "kb_swing",        name: "Kettlebell swing",           muscle: "ischio_fessiers", zone: "lower", type: "load", unit: "kg", elite: 0.60 },
];

// Libellés d'unité pour l'interface
window.UNIT_LABELS = {
  kg:    { input: "Charge totale (kg)",   suffix: "kg" },
  kg_db: { input: "Charge par haltère (kg)", suffix: "kg/haltère" },
  reps:  { input: "Répétitions max",      suffix: "reps" },
  sec:   { input: "Durée tenue (secondes)", suffix: "s" },
};

// Index pratique
window.EXERCISE_BY_ID = Object.fromEntries(window.EXERCISES.map((e) => [e.id, e]));
window.EXERCISES_BY_MUSCLE = window.MUSCLES.reduce((acc, m) => {
  acc[m.key] = window.EXERCISES.filter((e) => e.muscle === m.key);
  return acc;
}, {});
