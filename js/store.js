// ============================================================
//  COUCHE DE DONNÉES
//  Abstrait Supabase. Si les clés ne sont pas configurées
//  (DEMO_MODE), tout est stocké dans le navigateur (localStorage)
//  pour pouvoir tester l'app immédiatement.
// ============================================================

let DEMO = window.APP_CONFIG.DEMO_MODE;
let sb = null;

// Nettoie l'URL : on ne garde que la base https://xxxx.supabase.co
// (au cas où on aurait collé l'URL de l'API REST .../rest/v1/).
function cleanUrl(u) {
  const m = String(u).match(/^(https:\/\/[^\/]+)/);
  return m ? m[1] : String(u).replace(/\/+$/, "");
}

if (!DEMO) {
  try {
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error("La librairie Supabase n'a pas pu être chargée (connexion bloquée ?).");
    }
    sb = window.supabase.createClient(
      cleanUrl(window.APP_CONFIG.SUPABASE_URL),
      window.APP_CONFIG.SUPABASE_ANON_KEY
    );
  } catch (e) {
    console.error("Init Supabase échouée, bascule en mode démo :", e);
    DEMO = true; // on ne laisse jamais un écran noir : repli sur le mode local
    window.__SUPABASE_ERROR__ = e.message;
  }
}

// ---------- Stockage local (mode démo) ----------
const LS = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
};

function demoUserKey() { return "ranke_demo_user"; }
function demoProfileKey(uid) { return "ranke_profile_" + uid; }
function demoPerfKey(uid) { return "ranke_perfs_" + uid; }
function demoAllUsersKey() { return "ranke_all_users"; }

// ============================================================
//  AUTH
// ============================================================
const Auth = {
  async signUp(email, password, pseudo) {
    if (DEMO) {
      const uid = "demo-" + btoa(email).slice(0, 12);
      const user = { id: uid, email, pseudo };
      LS.set(demoUserKey(), user);
      const all = LS.get(demoAllUsersKey(), {});
      all[uid] = { email, pseudo };
      LS.set(demoAllUsersKey(), all);
      return { user };
    }
    const { data, error } = await sb.auth.signUp({
      email, password, options: { data: { pseudo } },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    if (DEMO) {
      const uid = "demo-" + btoa(email).slice(0, 12);
      let user = LS.get(demoUserKey());
      if (!user || user.id !== uid) {
        user = { id: uid, email, pseudo: email.split("@")[0] };
        LS.set(demoUserKey(), user);
      }
      return { user };
    }
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (DEMO) { localStorage.removeItem(demoUserKey()); return; }
    await sb.auth.signOut();
  },

  async current() {
    if (DEMO) return LS.get(demoUserKey());
    const { data } = await sb.auth.getUser();
    if (!data.user) return null;
    return {
      id: data.user.id,
      email: data.user.email,
      pseudo: data.user.user_metadata?.pseudo || data.user.email.split("@")[0],
    };
  },
};

// ============================================================
//  PROFIL  { sex, weight, height, pseudo }
// ============================================================
const Profiles = {
  async get(uid) {
    if (DEMO) return LS.get(demoProfileKey(uid), null);
    const { data, error } = await sb.from("profiles").select("*").eq("id", uid).maybeSingle();
    if (error) throw error;
    return data;
  },

  async save(uid, profile) {
    if (DEMO) {
      LS.set(demoProfileKey(uid), profile);
      const all = LS.get(demoAllUsersKey(), {});
      all[uid] = { ...(all[uid] || {}), pseudo: profile.pseudo };
      LS.set(demoAllUsersKey(), all);
      return profile;
    }
    const row = {
      id: uid,
      pseudo: profile.pseudo,
      sex: profile.sex,
      weight: profile.weight,
      height: profile.height,
      updated_at: new Date().toISOString(),
    };
    const { error } = await sb.from("profiles").upsert(row);
    if (error) throw error;
    return profile;
  },
};

// ============================================================
//  PERFORMANCES  { exercise_id, value, score }
// ============================================================
const Perfs = {
  async list(uid) {
    if (DEMO) return LS.get(demoPerfKey(uid), {});
    const { data, error } = await sb.from("performances").select("*").eq("user_id", uid);
    if (error) throw error;
    const map = {};
    (data || []).forEach((r) => { map[r.exercise_id] = { value: r.value, score: r.score }; });
    return map;
  },

  async save(uid, exerciseId, value, score) {
    if (DEMO) {
      const map = LS.get(demoPerfKey(uid), {});
      map[exerciseId] = { value, score };
      LS.set(demoPerfKey(uid), map);
      return;
    }
    const row = {
      user_id: uid,
      exercise_id: exerciseId,
      value,
      score,
      updated_at: new Date().toISOString(),
    };
    const { error } = await sb.from("performances").upsert(row, { onConflict: "user_id,exercise_id" });
    if (error) throw error;
  },

  // Classement : meilleures performances par exercice, tous utilisateurs.
  async leaderboard(exerciseId) {
    if (DEMO) {
      const all = LS.get(demoAllUsersKey(), {});
      const rows = [];
      Object.keys(all).forEach((uid) => {
        const perfs = LS.get(demoPerfKey(uid), {});
        if (perfs[exerciseId]) {
          rows.push({
            pseudo: all[uid].pseudo || "Anonyme",
            value: perfs[exerciseId].value,
            score: perfs[exerciseId].score,
          });
        }
      });
      return rows.sort((a, b) => b.score - a.score).slice(0, 50);
    }
    const { data, error } = await sb
      .from("performances")
      .select("value, score, profiles(pseudo)")
      .eq("exercise_id", exerciseId)
      .order("score", { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data || []).map((r) => ({
      pseudo: r.profiles?.pseudo || "Anonyme",
      value: r.value,
      score: r.score,
    }));
  },
};

window.Store = { get DEMO() { return DEMO; }, Auth, Profiles, Perfs };
