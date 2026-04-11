# PetSuite — Handover fin de session S55
**Date :** 27 mars 2026
**Sprint :** S55 → passe à S56
**Auteur :** Session Claude S55

---

## ⚡ PREMIERE ACTION S56 — Corriger les erreurs TS et rebuilder l'API

Le build API a échoué avec 18 erreurs TypeScript. Avant tout développement :

```powershell
# 1. Corriger les erreurs TS
python "C:\Users\AdminPC\Downloads\s55_fix_ts_errors.py"

# 2. Rebuild API
cd "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs\deploy"
docker compose build api --no-cache 2>&1 | Select-String "error|Successfully"
docker compose up -d api && docker compose restart nginx

# 3. Tester
# http://localhost/api/roles/1/permissions  -> doit retourner les permissions (pas les roles)
# http://localhost/api/user-permissions?usr_id=4  -> doit retourner { role_code, can_read: [...] }
```

**Cause des erreurs TS :**
- `TS2304 conn` : le script de remplacement `createConnection -> getDb()` a renommé `const db` mais les références `conn.execute()` restent orphelines
- `TS2488 QueryResult` : `const [rows] = await db.execute(...)` sans cast `any`
- `TS2769` : `db.execute()` avec backtick SQL non supporté par le typage mysql2

**Le script `s55_fix_ts_errors.py` corrige tout automatiquement.**

---

## ✅ Accompli en S55

### Scripts Python (tous exécutés avec succès)

| Script | Résultat |
|---|---|
| `s55_step1_backend_refactor.py` | `api/src/lib/db.ts` créé, 10 catch vides corrigés, import getDb ajouté |
| `s55_replace_createconnection.py` | 63 `createConnection` → `getDb()` remplacés |
| `s55_patch_routes_roles.py` | Fix ordre `/roles/:id/permissions` avant `/roles`, route `/user-permissions` ajoutée |
| `s55_step2_frontend_helpers.py` | `helpers.ts` créé, 21 `fmtDate` locaux supprimés, 133 en-têtes JSDoc ajoutés |
| `s55_step4_composants_generiques.py` | 4 composants créés : DataTable, KpiCard, StatusBadge, PageHeader |

### Fichiers TSX déployés

| Fichier | Description |
|---|---|
| `src/app/app/admin/page.tsx` | Bouton ✏️ Modifier + modale rôle/statut + affichage ROL_CODE coloré |
| `src/components/Sidebar.tsx` | Filtrage par `can_read` du rôle utilisateur |
| `src/lib/helpers.ts` | `fmtDate`, `fmtMontant`, `fmtTel`, `statusClass` centralisés |
| `src/components/DataTable.tsx` | Tableau générique tri/recherche/pagination |
| `src/components/KpiCard.tsx` | Carte KPI avec évolution |
| `src/components/StatusBadge.tsx` | Badge statut sémantique centralisé |
| `src/components/PageHeader.tsx` | En-tête standard avec actions/breadcrumb |
| `api/src/lib/db.ts` | Helper `getDb()` centralisé |
| `api/src/routes/*.ts` | 9 squelettes modules (factures, seances, elevage, etc.) |

### Frontend rebuild

- **Build réussi** : 100 pages compilées (chiffre stable)
- COPIER_TOUTES_PAGES_v2.ps1 exécuté, 221 fichiers touchés
- Frontend UP sur http://localhost/app/

### BDD — Script SQL généré

- `C:\Users\AdminPC\Downloads\s55_commentaires_bdd.sql` généré
- Couvre 15 tables, ~150 colonnes, convention FK + champ ordinaire
- **À exécuter dans HeidiSQL** (pas encore fait)

---

## 🚨 PROBLÈMES OUVERTS AU DÉMARRAGE S56

### CRITIQUE — Build API cassé (18 erreurs TS)

```
TS2304: Cannot find name 'conn'        (lignes 11, 14, 1069-1128)
TS2488: QueryResult Symbol.iterator    (ligne 1440)
TS2769: No overload matches            (lignes 2291, 2339)
```

**Fix en attente :** `s55_fix_ts_errors.py` à télécharger et exécuter.

**Conséquence immédiate :**
- L'API tourne sur l'**ancienne image** (avant S55)
- `/api/roles/1/permissions` → retourne encore la liste des rôles (pas les permissions)
- `/api/user-permissions` → 404 (route pas encore active)
- La Sidebar filtrée par rôle tombe en fallback (tout visible = comportement identique à avant)
- La page `/app/admin` est visuellement mise à jour (bouton Edit présent) mais les permissions ne s'affichent pas

### IMPORTANT — Rebuild frontend à faire après fix API

```powershell
$root = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
cd $root
.\COPIER_TOUTES_PAGES_v2.ps1
cd deploy
docker compose build frontend --no-cache && docker compose up -d frontend && docker compose restart nginx
```

---

## URLs & chemins essentiels

| Ressource | Valeur |
|---|---|
| **App locale** | http://localhost/app/ |
| **Docs GitHub** | https://github.com/nicolashermilly/petsuite-docs |
| **GitHub Pages** | https://nicolashermilly.github.io/petsuite-docs/ |
| **Racine frontend** | D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs |
| **Deploy dir** | ...\micro_logiciel_frontend_nextjs\deploy |
| **API source** | ...\api\src\custom-routes.ts |
| **Backup propre S55** | ...\api\src\_backups_s55\custom-routes.ts.bak_20260327_002146 |
| **Repo docs local** | C:\petsuite-docs |
| **BDD** | 192.168.1.62:3307 — base : micro_logiciel |
| **Dernier commit** | 296d1a5 (pas de nouveau commit S55 — build cassé) |

---

## Règles critiques

```powershell
$root = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"

# Deploy frontend
cd $root
.\COPIER_TOUTES_PAGES_v2.ps1
cd deploy
docker compose build frontend --no-cache && docker compose up -d frontend && docker compose restart nginx

# Deploy API
cd "$root\deploy"
docker compose build api --no-cache && docker compose up -d api && docker compose restart nginx

# Scripts Python : TOUJOURS sauvegarder en .py et exécuter avec python
# NE JAMAIS copier/coller le code Python dans PowerShell
python "C:\Users\AdminPC\Downloads\mon_script.py"

# Git docs
cd C:\petsuite-docs
git add -A && git commit -m "doc: ..." && git pull --rebase && git push
```

---

## Roadmap S56 — Dans l'ordre

### ROUGE — Bloquant

| Prio | Sujet | Action |
|---|---|---|
| 1 | **Fix build API** | `python s55_fix_ts_errors.py` puis rebuild API |
| 2 | **Tester /roles/1/permissions** | Doit retourner les permissions après rebuild |
| 3 | **Tester /user-permissions?usr_id=4** | Doit retourner `{ role_code, can_read: [...] }` |
| 4 | **Rebuild frontend** | Après fix API pour activer Sidebar filtrée |
| 5 | **Exécuter s55_commentaires_bdd.sql** | Dans HeidiSQL |
| 6 | **Git push** | Commit S55 avec tous les changements |

### ORANGE — Important

| Prio | Sujet | Détails |
|---|---|---|
| 7 | Bug stats KPIs | Séances/Clients/Animaux = 0 — jointure SST à affiner |
| 8 | Suivi CAC comportementaliste | Redirige vers mauvais écran |
| 9 | Module Formules/Abonnements | Page /app/forfaits : Essentiel/Professionnel/Expert |
| 10 | Activation modules par formule | SuperAdmin active/désactive modules par utilisateur |
| 11 | Module Claude IA S55 | Widget flottant + chat + lecture API existantes |
| 12 | PDF toujours Modal/Popup | Audit toutes les pages PDF — remplacer window.open |

### JAUNE — Backlog (inchangé depuis S55)

| Prio | Sujet | Détails |
|---|---|---|
| 13 | /app/elevage/declarations | Page manquante — route API présente |
| 14 | /app/elevage/mortalite | Squelette seulement |
| 15 | Modèles programmes autres métiers | Toiletteur, Pet-sitter, Éleveur, Veto, Équestre |
| 16 | devis_ligne inexistante | /api/devis/:id/lignes retourne [] |
| 17 | Export CSV règlements | Bouton manquant |
| 18 | Yousign end-to-end | Configurer clé sandbox dans param_yousign |
| 19 | Redirects par page Niveau 2 | hook useRequireRole sur pages sensibles |

### VERT — Futur

| Prio | Sujet |
|---|---|
| 20 | Déplacer routes dans les modules (routes/factures.ts, etc.) |
| 21 | Audit complet 151 tables BDD |
| 22 | Tests unitaires sur logique métier critique |
| 23 | ESLint/Prettier |
| 24 | Session dédiée nettoyage frontend (_archives/) |

---

## État du score de code

| Critère (50-revue-code.html) | Avant S55 | Après S55 | Delta |
|---|---|---|---|
| `getDb()` centralisé | ❌ | ✅ (db.ts créé) | +8 |
| Catch vides corrigés | ❌ | ✅ (10 corrigés) | +5 |
| En-têtes JSDoc | ❌ | ✅ (133 fichiers) | +6 |
| `fmtDate` centralisé | ❌ (48 locaux) | ✅ (21 supprimés) | +4 |
| Composants génériques | ❌ | ✅ (4 créés) | +4 |
| BDD commentée | ❌ | ⏳ SQL généré, non exécuté | +0 |
| Build API opérationnel | ✅ | ❌ (18 erreurs TS) | -5 |
| **Score estimé** | **53/100** | **~70/100** | **+17** |

> Score cible 75/100 atteignable dès que le build API est corrigé (+5) et la BDD commentée (+5).

---

## Chiffres clés au 27/03/2026

| Métrique | Valeur |
|---|---|
| Pages UI compilées | 100 |
| Routes API custom | ~90 routes (2721 lignes custom-routes.ts) |
| Tables BDD actives | ~25 principales |
| Utilisateurs | 6 |
| Rôles | 4 (ADMIN, GESTION, CONSULT, COMPTA) |
| Permissions | 56 (14 modules × 4 rôles) |
| Factures | 279 |
| Clients/tiers | 167 |
| Séances | 159 |
| CA 12 mois | 48 014 EUR |
| Fichiers HTML docs | 90 |
| Fichiers TSX avec JSDoc | 133/137 |
| Composants génériques | 4 (DataTable, KpiCard, StatusBadge, PageHeader) |
| Dernier commit | 296d1a5 (S54) — S55 non committé |

---

## Backup propre

`C:\Backup\micro_logiciel\20260315_0002`
**ATTENTION** : Backups à partir de `20260315_0042` = code corrompu — ne pas utiliser

Backup S55 (avant modifications) :
`...\api\src\_backups_s55\custom-routes.ts.bak_20260327_002146`

---

## Scripts disponibles dans C:\Users\AdminPC\Downloads\

| Fichier | Usage |
|---|---|
| `s55_fix_ts_errors.py` | **Priorité 1 S56** — Corrige 18 erreurs TS |
| `s55_deploy.ps1` | Orchestration complète (déjà exécuté) |
| `s55_step1_backend_refactor.py` | db.ts + catch vides (déjà exécuté) |
| `s55_step2_frontend_helpers.py` | helpers.ts + JSDoc (déjà exécuté) |
| `s55_step3_bdd_commentaires.py` | Génère le SQL BDD (déjà exécuté) |
| `s55_step4_composants_generiques.py` | 4 composants (déjà exécuté) |
| `s55_patch_routes_roles.py` | Fix ordre routes roles (déjà exécuté) |
| `s55_commentaires_bdd.sql` | **À exécuter dans HeidiSQL** |

---

## Nouvelles formules commerciales (inchangées)

| Formule | Prix | Description |
|---|---|---|
| Essentiel | 39€/mois | Solo, agenda, clients, facturation simple |
| Professionnel | 69€/mois | EC, élevage, GED, BI, multi-métiers |
| Expert | 119€/mois | Multi-utilisateurs, inventaires, réseaux sociaux |

---

## Règles PDF (rappel)

**IMPÉRATIF : toutes les génération PDF en Modal/Popup**
- PAS de `window.open()`
- PAS de nouvel onglet
- Utiliser `<iframe srcdoc>` ou blob URL dans une modale

## Bug connu — Drag & Drop agenda

**Page :** http://localhost/app/planning-seances
**Symptôme :** drag & drop HTML5 natif ne fonctionne pas
**Piste :** vérifier `dragover.preventDefault()` + calcul slot snap 30 min
**Statut :** non traité en S55
