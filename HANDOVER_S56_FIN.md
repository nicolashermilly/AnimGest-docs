# PetSuite — Handover fin de session S55/S56
**Date :** 27 mars 2026
**Sprint :** S55/S56 → passe à S57
**Auteur :** Session Claude S55/S56

---

## ⚡ PREMIERE ACTION S57

Le build API S56 est en cours au moment de ce handover. Après sa fin :

```powershell
$root = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"

# 1. Tester les routes critiques :
# http://localhost/api/roles/1/permissions  -> [{RPM_MODULE, RPM_CAN_READ...}]
# http://localhost/api/user-permissions?usr_id=4  -> {role_code, can_read:[...]}

# 2. Rebuild frontend (si pas fait)
cd $root
.\COPIER_TOUTES_PAGES_v2.ps1
cd "$root\deploy"
docker compose build frontend --no-cache && docker compose up -d frontend && docker compose restart nginx

# 3. Git push
cd C:\petsuite-docs
git add -A && git commit -m "doc: S55/S56 - db.ts, BDD 241 colonnes, Sidebar roles, admin Edit, editions" && git pull --rebase && git push
```

---

## ✅ Accompli en S55/S56

### Backend — custom-routes.ts
| Action | Résultat |
|---|---|
| `api/src/lib/db.ts` créé | Helper `getDb()` — 87 usages, 0 `createConnection` |
| Catch vides corrigés | 10 → `res.status(500).json({ error: e.message })` |
| Routes `/roles` réordonnées | `/roles/:id/permissions` AVANT `/roles` (fix prefix-match) |
| Route `/user-permissions` | Ajoutée — retourne `{ role_code, can_read, can_write }` |
| Route `PUT /parametres/editions` | Ajoutée — pointe vers `param_edition` (sans s) |
| `param_editions` → `param_edition` | Corrigé dans toutes les routes |
| 9 modules routes squelettes | `api/src/routes/*.ts` — à alimenter progressivement |

### Frontend
| Fichier | Description |
|---|---|
| `src/lib/helpers.ts` | `fmtDate`, `fmtMontant`, `fmtTel`, `statusClass` |
| `src/components/DataTable.tsx` | Tableau générique tri/recherche/pagination |
| `src/components/KpiCard.tsx` | Carte KPI avec évolution |
| `src/components/StatusBadge.tsx` | Badge statut sémantique centralisé |
| `src/components/PageHeader.tsx` | En-tête standard avec actions |
| `src/app/app/admin/page.tsx` | Bouton ✏️ Modifier + modale rôle/statut |
| `src/components/Sidebar.tsx` | Filtrage par `can_read` du rôle |
| `src/app/app/parametres/editions/page.tsx` | Logo, entête, CGV, filigrane, couleurs |
| 133 fichiers TSX | En-têtes JSDoc ajoutés |
| 21 fichiers TSX | `fmtDate` local → `@/lib/helpers` |

### BDD
| Action | Résultat |
|---|---|
| `DROP TABLE param_editions` | ✅ Table doublon supprimée |
| `param_edition` colonnes ajoutées | `PE_ENTETE`, `PE_CGV_URI`, `PE_WATERMARK_*`, `PE_NUMERO_PAGE` |
| **241 colonnes commentées** | ✅ 18 tables — script `s55_commentaires_bdd_v4.py` |

---

## 📊 Score revue de code — S56

| Critère | Avant S55 | Après S56 | Delta |
|---|---|---|---|
| `getDb()` centralisé (87 usages, 0 createConnection) | ❌ | ✅ | +8 |
| Catch vides corrigés (10) | ❌ | ✅ | +5 |
| En-têtes JSDoc (133/137 TSX) | ❌ | ✅ | +6 |
| `fmtDate` centralisé (21 locaux supprimés) | ❌ | ✅ | +4 |
| Composants génériques (4) | ❌ | ✅ | +4 |
| BDD commentée (241 colonnes, 18 tables) | ❌ | ✅ | +5 |
| **Score estimé** | **53/100** | **~80/100** | **+27** |

### Pour aller à 85/100 en S57
| Action | Points | Effort |
|---|---|---|
| Déplacer les routes dans `api/src/routes/` | +5 | 1 sprint |
| Services frontend `src/services/*.ts` | +3 | moyen |
| Supprimer code mort (console.log, inject_*.js) | +2 | facile |
| Validation des entrées POST/PUT | +3 | moyen |

---

## 🗺️ Roadmap S57

### ROUGE — À faire en premier

| Prio | Action |
|---|---|
| 1 | Vérifier `/api/roles/1/permissions` → doit retourner permissions |
| 2 | Vérifier `/api/user-permissions?usr_id=4` → doit retourner can_read |
| 3 | Tester `/app/admin` → bouton ✏️ Modifier opérationnel |
| 4 | Tester `/app/parametres/editions` → logo/couleurs/CGV |
| 5 | Git push commit S55/S56 |

### ORANGE — Fonctionnel

| Prio | Sujet | Détails |
|---|---|---|
| 6 | Bug stats KPIs | Séances/Clients/Animaux = 0 |
| 7 | Suivi CAC comportementaliste | Redirige vers mauvais écran |
| 8 | Module Formules/Abonnements | Essentiel/Professionnel/Expert |
| 9 | Module Claude IA | Widget flottant + chat |
| 10 | PDF toujours Modal/Popup | Audit + remplacer window.open() |

### ORANGE — Revue de code

| Prio | Sujet |
|---|---|
| 11 | Déplacer routes dans `api/src/routes/` (commencer par `factures.ts`) |
| 12 | Services frontend `src/services/` |
| 13 | Supprimer code mort |

### JAUNE — Backlog

| Sujet | Détails |
|---|---|
| `/app/elevage/declarations` | Page manquante — route API présente |
| `devis_ligne` inexistante | `/api/devis/:id/lignes` retourne [] |
| Export CSV règlements | Bouton manquant |
| Yousign end-to-end | Clé sandbox dans param_yousign |
| Drag & Drop agenda | `/app/planning-seances` — non fonctionnel |

### VERT — Nouveaux modules (S58+)

| Sprint | Module |
|---|---|
| S58–S59 | **Portail Client** — espace séances/CAC avec login client |
| S60–S62 | **Carte d'Identité Animale** — page publique liée à la puce |

---

## URLs & chemins essentiels

| Ressource | Valeur |
|---|---|
| **App locale** | http://localhost/app/ |
| **Docs GitHub** | https://github.com/nicolashermilly/petsuite-docs |
| **GitHub Pages** | https://nicolashermilly.github.io/petsuite-docs/ |
| **Racine frontend** | D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs |
| **API source** | ...\api\src\custom-routes.ts |
| **Repo docs local** | C:\petsuite-docs |
| **BDD** | 192.168.1.62:3307 user=optimbtp pwd=optimbtp |
| **Script commentaires BDD** | C:\Users\AdminPC\Downloads\s55_commentaires_bdd_v4.py |

---

## Règles critiques

```powershell
$root = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"

# Deploy API
cd "$root\deploy"
docker compose build api --no-cache && docker compose up -d api && docker compose restart nginx

# Deploy frontend
cd $root && .\COPIER_TOUTES_PAGES_v2.ps1
cd "$root\deploy"
docker compose build frontend --no-cache && docker compose up -d frontend && docker compose restart nginx

# Scripts Python
python "C:\Users\AdminPC\Downloads\mon_script.py"
# NE JAMAIS coller du code Python dans PowerShell

# BDD connexion directe
# host: 192.168.1.62  port: 3307  user: optimbtp  pwd: optimbtp

# Git docs
cd C:\petsuite-docs
git add -A && git commit -m "..." && git pull --rebase && git push
```

---

## État custom-routes.ts au 27/03/2026

```
Lignes           : 2720
getDb()          : 87   ✅
createConnection : 0    ✅
catch vides      : 0    ✅
param_editions   : 0    ✅ (corrigé → param_edition)
Ordre /roles     : ✅  (/roles/:id/permissions AVANT /roles)
/user-permissions: ✅  (injectée)
```

---

## Backup propre
`C:\Backup\micro_logiciel\20260315_0002`
**ATTENTION** : Backups à partir de `20260315_0042` = code corrompu.

Backup S56 : `...\api\src\custom-routes.ts.bak_roles_final_20260327_015723`

---

## Chiffres clés au 27/03/2026

| Métrique | Valeur |
|---|---|
| Pages UI compilées | 100 |
| Routes API custom | ~90 — 2720 lignes |
| `getDb()` | 87 |
| `createConnection` | **0** |
| TSX avec JSDoc | 133/137 |
| Composants génériques | 4 |
| BDD colonnes commentées | **241** (18 tables) |
| Factures | 279 — CA 12 mois : 48 014 EUR |
| Clients/tiers | 167 — Séances : 159 |

---

## Nouvelles formules commerciales

| Formule | Prix | Contenu clé |
|---|---|---|
| Essentiel | 39€/mois | Agenda, clients, animaux, facturation simple |
| Professionnel | 69€/mois | + EC, élevage, GED, BI, multi-métiers |
| Expert | 119€/mois | + Multi-utilisateurs, inventaires, réseaux sociaux |

Specs complètes Portail Client + CIA : `spec_portail_client_CIA.md`

---

## Règle PDF (rappel)
**TOUTES** les générations PDF en **Modal/Popup** — jamais `window.open()`.
