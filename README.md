# RankFit 🏋️

Site qui attribue un **rang** (Bronze → Olympien) à chaque utilisateur sur chaque exercice,
en fonction de son **sexe**, son **poids** et sa **taille**. La page d'accueil affiche un
**personnage** dont chaque muscle se colore selon ton rang.

100 % HTML / CSS / JavaScript. Hébergement **Netlify** (gratuit) + base **Supabase** (gratuit).

---

## 🚀 Tester tout de suite (mode démo, sans rien configurer)

Le site fonctionne immédiatement en **mode démo** : les comptes et performances sont
stockés dans ton navigateur. Aucune configuration nécessaire.

- **Le plus simple** : double-clique sur `index.html`.
- **Recommandé** (évite les blocages navigateur) : lance un petit serveur local depuis le dossier :
  ```bash
  python -m http.server 8000
  ```
  puis ouvre http://localhost:8000

---

## 🗄️ Étape 1 — Configurer Supabase (base de données + comptes)

1. Crée un compte sur https://supabase.com (plan **Free**) et un nouveau projet.
2. Dans le menu **SQL Editor** → *New query*, colle tout le contenu du fichier
   [`supabase-schema.sql`](./supabase-schema.sql) puis clique **Run**.
   (Cela crée les tables `profiles` et `performances`, la sécurité, et le profil auto à l'inscription.)
3. Va dans **Project Settings → API** et récupère :
   - **Project URL**
   - la clé **anon public**
4. Ouvre `js/config.js` et remplace les deux valeurs :
   ```js
   window.APP_CONFIG = {
     SUPABASE_URL: "https://ton-projet.supabase.co",
     SUPABASE_ANON_KEY: "ta_cle_anon_public",
   };
   ```
   Dès que ces valeurs sont renseignées, le mode démo se désactive automatiquement.

### (Option) Confirmation d'email
Par défaut Supabase peut demander une confirmation par email à l'inscription.
Pour aller plus vite pendant les tests : **Authentication → Providers → Email**,
désactive *Confirm email*.

---

## 🌐 Étape 2 — Déployer sur Netlify

### Méthode A — glisser-déposer (la plus rapide)
1. Va sur https://app.netlify.com → **Add new site → Deploy manually**.
2. Glisse le dossier complet du projet (celui qui contient `index.html`).
3. C'est en ligne. ✅

### Méthode B — via GitHub (mises à jour automatiques)
1. Pousse ce dossier sur un dépôt GitHub.
2. Sur Netlify : **Add new site → Import from Git** → choisis le dépôt.
3. Laisse les réglages par défaut (pas de build, c'est un site statique).
   - *Build command* : (vide)
   - *Publish directory* : `.` (la racine)
4. Deploy.

> ⚠️ Pense à ajouter l'URL Netlify dans Supabase :
> **Authentication → URL Configuration → Site URL / Redirect URLs**.

---

## 🧠 Comment le rang est calculé

Pour chaque exercice, on compare ta performance à une valeur **« Olympien »** de référence :

- **Exercices avec charge** : on regarde le ratio `charge soulevée / poids de corps`.
- **Exercices au poids du corps** (pompes, tractions, dips…) : on compte les répétitions.
- **Gainage** : la durée en secondes.

Cette référence est **ajustée** :
- au **sexe** (barèmes féminins recalibrés par rapport aux masculins),
- à la **taille** (légère correction : une grande amplitude de mouvement est un désavantage mécanique).

Le score obtenu (0–100) donne le rang :

| Rang | Score | Couleur |
|------|-------|---------|
| Bronze | 0–17 | bronze |
| Argent | 18–34 | argent |
| Or | 35–54 | or |
| Platine | 55–74 | turquoise |
| Diamant | 75–91 | bleu |
| Olympien | 92+ | violet |

> Les barèmes sont **facilement ajustables** : chaque exercice a une valeur `elite`
> dans `js/exercises.js`. Augmente-la pour durcir le barème, baisse-la pour l'assouplir.

---

## 📁 Structure des fichiers

```
index.html              Page unique (charge les scripts)
css/styles.css          Thème sombre et sobre
js/config.js            ← tes clés Supabase ici
js/ranks.js             Moteur de calcul des rangs
js/exercises.js         Base des exercices + barèmes
js/body.js              Personnage SVG (muscles colorables)
js/store.js             Accès données (Supabase ou démo local)
js/app.js               Interface et navigation
supabase-schema.sql     À exécuter dans Supabase
```

---

## ✏️ Personnaliser

- **Ajouter un exercice** : ajoute une ligne dans `js/exercises.js` (mets le bon `muscle` pour
  qu'il colore la bonne zone du personnage).
- **Changer les couleurs / noms de rangs** : `js/ranks.js` (tableau `RANKS`).
- **Modifier un barème** : change la valeur `elite` de l'exercice concerné.
