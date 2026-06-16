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
  SUPABASE_URL: "https://gycyqlzllcdzgevqymjx.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5Y3lxbHpsbGNkemdldnF5bWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MzQ2NDEsImV4cCI6MjA5NzIxMDY0MX0.dvnVWz8VtjLKmTC8tRwt04fHykdgYQFKhicbmmbCZBw",
};

// Mode démo : si les clés ne sont pas configurées, l'app fonctionne
// en local (données stockées dans le navigateur) pour que tu puisses
// tester immédiatement sans Supabase.
window.APP_CONFIG.DEMO_MODE =
  window.APP_CONFIG.SUPABASE_URL.includes("VOTRE-PROJET") ||
  window.APP_CONFIG.SUPABASE_ANON_KEY.includes("VOTRE_CLE");
