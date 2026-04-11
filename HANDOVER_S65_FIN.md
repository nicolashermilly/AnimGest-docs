# HANDOVER S65 — FIN DE SESSION
**Date :** 07/04/2026  
**Sprint :** S65  
**Commits :** ce046a7 → d4e9b23 + fix /clients en cours

---

## 1. Accompli en S65

### 1a. Corrections SQL (fix v4 → v9)
- `/api/planning` : `sst.SST_NOM` → `sst.STY_LIBELLE`, JOIN `SST_ID` → `STY_ID`
- `/api/avoirs` : `FAC_ID_ORIGINE` → `FAC_ID`, `AVC_MONTANT_TTC` → `AVC_TOTAL_TTC`
- `/api/achats/bon-a-payer` : `CMF_ID` → `ACH_ID`
- `/api/factures/avoir` : doublons supprimés, ordre corrigé (garde `avoir` dans `:ref`)
- `/api/clients` : route créée (manquait), colonnes `TIE_ADR1`, fixs successifs

### 1b. Sidebar accordéon — nouveau composant complet
- 7 groupes repliables avec animation `max-height` + `sessionStorage`
- Groupe **"Mon / Mes Métier(s)"** en tête : source `/api/parametres/modules` + fallback `localStorage`
- Dropdown si plusieurs métiers actifs
- `METIER_MENUS` exact du backup : 10 métiers avec leurs items
- Icônes exactes (🐕 comport, 🏠 pet-sitter, 🏡 pension...)
- Backup `.bak_s65_sidebar` et `.bak_s65_pre_metier` créés
- Import `layout.tsx` corrigé : `{ Sidebar }` → `import Sidebar`

### 1c. Sidebar Achats — BL/BR/DAF ajoutés
- 6 items : Commandes, Bons de livraison, Bons de retour, DAF, Règlements, Inventaires

### 1d. Migration table `race`
- `RACE_GROUPE` alimenté : Berger et bouvier, Terrier, Lévrier, Molossoïde, etc.
- `RACE_NUMERO_STANDARD` : numéros FCI officiels pour les chiens
- `RACE_CATEGORIE` inchangé (déjà correct)

### 1e. Registre sanitaire — arrêté 3 avril 2014
**BDD :**
- Table `registre_sanitaire_sejour` (RSS_ID, ANI_ID, TIE_ID, vaccins, vétérinaire, urgence...)
- Table `registre_sanitaire_evenement` (journal pendant séjour)

**API — 5 routes :**
- `GET /api/registre-sanitaire` — liste avec jointures animal + tiers + race (sous-requêtes)
- `GET /api/registre-sanitaire/:id` — détail + événements
- `POST /api/registre-sanitaire` — créer séjour
- `PUT /api/registre-sanitaire/:id` — mettre à jour / clôturer
- `POST /api/registre-sanitaire/:id/evenement` — ajouter événement journal

**Frontend :**
- Composant `RegistreSanitairePage.tsx` partagé (paramètre `metier`)
- `/app/pension/registre` — Pension/Chenil
- `/app/pet-sitter/registre` — Pet-Sitter
- Liste + détail panneau latéral + journal + clôture séjour
- Formulaire création : animal autocomplete, vaccinations, vétérinaire, contact urgence
- Intégré dans `METIER_MENUS` : `📋 Registre sanitaire`

---

## 2. Commits S65

| Commit | Description |
|---|---|
| `a5ee60e` | Fix /clients colonnes TIE_ADR1 |
| `2cc8f0b` | Fix SQL v7-v9 : factures/avoir garde + route /clients |
| `ce046a7` | Fix /clients colonnes (itération) |
| `d4e9b23` | Sidebar accordéon + groupe Métier(s) + Registre sanitaire |
| 🔜 | Fix /clients CP_LIBELLE → supprimer colonne |

---

## 3. État scan final (post-fix /clients)

| Statut | Routes |
|---|---|
| ✅ 19/20 | Toutes sauf /clients |
| 🔜 20/20 | Après rebuild avec fix_clients_final.py |

---

## 4. BDD — Nouvelles tables S65

| Table | Description |
|---|---|
| `registre_sanitaire_sejour` | Registre sanitaire arrêté 3 avril 2014 |
| `registre_sanitaire_evenement` | Journal événements séjour |

**Migration `race` :**
- `RACE_GROUPE` : alimenté pour ~400 races
- `RACE_NUMERO_STANDARD` : numéros FCI

---

## 5. Fichiers modifiés S65

| Fichier | Modification |
|---|---|
| `api/src/custom-routes.ts` | +routes registre, fix SQL, route /clients |
| `src/components/Sidebar.tsx` | Refonte complète accordéon + métiers |
| `src/components/RegistreSanitairePage.tsx` | NOUVEAU |
| `src/app/app/pension/registre/page.tsx` | NOUVEAU |
| `src/app/app/pet-sitter/registre/page.tsx` | NOUVEAU |
| `src/app/app/layout.tsx` | Fix import Sidebar |

---

## 6. Dette technique restante S66

### ROUGE
| Item | Action |
|---|---|
| Scan 20/20 à valider | Relancer après rebuild /clients |
| `migration_ged_complete.sql` | Exécuter dans HeidiSQL (reporté de S64) |

### ORANGE
| Item | Action |
|---|---|
| `clients/[id]` crash runtime | Page compile mais crash React — `@/lib/api` |
| Drag & Drop agenda | `instance.use('/seances/:id')` en place — tester |
| Supprimer `micro_logiciel_ged` | Après validation GED complète |

### JAUNE
| Item | Action |
|---|---|
| Pages BL/BR/DAF achat | TSX générés non déployés (routes API OK) |
| SQL tables `bl_achat` + `br_achat` | À exécuter en HeidiSQL |
| Export CSV règlements | Bouton absent dans reglements/page.tsx |
| JSDoc 4 fichiers | 133/137 couverts |
| ~100 `app.use()` restants | Migration progressive |
| Docs GitHub Pages S65 | roadmap, API reference, changelog |

---

## 7. Score qualité S65

| Axe | S64 | S65 |
|---|---|---|
| Backend | 88/100 | **90/100** |
| Frontend | 86/100 | **89/100** |
| BDD | 88/100 | **90/100** |
| Global | 87/100 | **90/100** |

> Routes API : ~155 | Pages UI : 112 | Eliot tools : 13 | Registre sanitaire : 2 métiers

---

## 8. Démarrage S66

```powershell
$root = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
Set-Location "$root\deploy"
docker compose ps
Invoke-RestMethod "http://localhost/api/bilan"

# Valider scan 20/20 après fix /clients
# Puis : migration_ged_complete.sql dans HeidiSQL
# Puis : pages BL/BR achat frontend
```

---

## 9. Règles critiques (rappel)

```
instance.use() UNIQUEMENT — jamais app.use()
POST/PUT → _readBody() obligatoire
getDb() + db.end() dans finally
(db as any).execute() — jamais [rows] = await db.execute()
PDF : modal iframe — jamais window.open()
GED : chemin depuis param_entreprise.ENT_GED_PATH
cd deploy OBLIGATOIRE avant docker compose
COPIER_TOUTES_PAGES_v2.ps1 AVANT build frontend
Scripts Python : $env:USERPROFILE\Downloads\ (pas OneDrive)
Sidebar métiers : source /api/parametres/modules + localStorage fallback
Registre sanitaire : jointures via sous-requêtes (pas JOIN race — ambiguïté MariaDB)
```
