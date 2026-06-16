// ============================================================
//  CONFIGURATION SUPABASE
//  Remplace les deux valeurs ci-dessous par celles de ton
//  projet Supabase (Settings > API).
//  - SUPABASE_URL  : "Project URL"
//  - SUPABASE_ANON_KEY : "anon public" key
//  Ces clés sont publiques (côté client) : c'est normal.
//  La sécurité est assurée par les règles RLS (voir supabase-schema.sql).
// ============================================================

window.APP_CONFIG = {
  SUPABASE_URL: "https://VOTRE-PROJET.supabase.co",
  SUPABASE_ANON_KEY: "VOTRE_CLE_ANON_PUBLIC",
};

// Mode démo : si les clés ne sont pas configurées, l'app fonctionne
// en local (données stockées dans le navigateur) pour que tu puisses
// tester immédiatement sans Supabase.
window.APP_CONFIG.DEMO_MODE =
  window.APP_CONFIG.SUPABASE_URL.includes("VOTRE-PROJET") ||
  window.APP_CONFIG.SUPABASE_ANON_KEY.includes("VOTRE_CLE");
