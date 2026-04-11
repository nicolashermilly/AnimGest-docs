# HANDOVER S75 — FIN DE SESSION COMPLÈTE
**Date :** 10/04/2026
**Sprint :** S75
**Conversations :** Conv1 (Tarification UI + Modal PDF AC + Migration GED) + Conv2 (Docs S74 + Vue Carte + BC)

---

## ⚠️ VÉRIFICATION OBLIGATOIRE EN DÉBUT DE S76

```powershell
$root   = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
$deploy = "$root\deploy"
Set-Location $deploy
docker compose ps
Invoke-RestMethod "http://localhost/api/bilan"
```

### Tests de validation à effectuer immédiatement

| Page / Route | Test | Attendu |
|---|---|---|
| `/app/parametres/tarification` | Charger | Sélecteur méthode + formules calculées + coefs |
| `/app/devis/129` | Section 🧮 | Boutons M1/M2/M3 visibles (BROUILLON) |
| `/app/devis/129` | Clic M2 + Appliquer | `✅ Tarification COEF_VTE appliquée — 2 ligne(s) recalculée(s)` |
| `/app/avoir-client/1` | Bouton 🖨 PDF | Modal iframe `src="/api/editions/avoir-client/1"` visible |
| `/app/clients` | Onglet Carte | Carte Leaflet visible avec marqueurs |
| `/app/seances/edc` | Charger | Titre "Bilans Comportementaux", sidebar actif seul |
| `GET /api/tarification` | Test | `METHODE_TARIF, COEF_FG_DEFAUT, COEF_VTE_DEFAUT` |
| `POST /api/devis/129/appliquer-tarif` | Body `{"methode":"COEF_VTE"}` | `success:true, lignes_recalculees:2` |
| `GET /api/editions/logo` | Test | `base64: "data:image/svg+xml..."` (200, pas de crash) |

---

## 1. Accompli en S75

### Conv1 — Tarification UI — commit `0bf81ea`

**Page `/app/parametres/tarification` (NOUVELLE — 117e page)**
- Sélecteur radio méthode globale : M1 CoefFG+Marge / M2 CoefVte / M3 Prix direct
- Formules de calcul avec exemples dynamiques (PAUHT=100€ → PVHT en temps réel)
- Champs coefficients désactivés si méthode inactive
- Sauvegarde `PUT /api/tarification` + feedback succès/erreur
- Tableau historique `GET /api/tarification/historique`
- Fix import `{ PageHeader }` (named export — R-35)

**Composant `TarificationSection` dans `/app/devis/[id]`**
- Visible uniquement si `DCE_STATUT === 'BROUILLON'` et `DCE_VERROUILLE !== 1`
- 3 boutons méthode avec tooltip formule + exemple calculé
- `POST /api/devis/:id/appliquer-tarif` + feedback `✅ Tarification X appliquée — N ligne(s) recalculée(s)`

**Fix route `POST /devis/:id/appliquer-tarif`**
- Route S64 remplacée : restait `pending` sans jamais répondre
- Cause racine : `const db = getDb()` → `const db = await getDb()`
- Gestion PAUHT=0 : snapshot méthode sans blocage

### Conv1 — Migration GED complète — commit `86def62`

- `getDbGed()` et toutes références à `micro_logiciel_ged` supprimées de `custom-routes.ts`
- Routes simplifiées : `upload-logo`, `upload-filigrane`, `upload-cgv` stockent directement en base64 dans `param_edition` (ED_LOGO_BASE64, ED_FILIGRANE_BASE64, PE_CGV_BASE64) — l'INSERT dans `ged_document` était redondant
- `DROP DATABASE micro_logiciel_ged` — BDD était vide (0 tables), aucune donnée perdue
- Architecture BDD : `micro_logiciel` uniquement désormais

### Conv1 — Fix modal PDF AC — commit `294bbfd`

- `srcDoc` (fetch inline HTML) → `<iframe src="/api/editions/avoir-client/${id}">`
- `handlePdf` simplifié : `const handlePdf = () => setShowPdf(true)`
- `useState showPdf` ajouté, état `pdfHtml` + fonction async supprimés
- Aligné sur pattern BL/BR/DAF (R-39) ✅

### Conv2 — Docs GitHub Pages S74 — commit `b2cb497`

- `changelog-sprint-S74.html` — NOUVEAU avec charte graphique correcte (feature-blocks, summary-grid, scores)
- `docs-changelog.html` — onglet S74 actif, KPIs 36 sprints / 121 pages / ~189 routes / 99 global
- `06-roadmap.html` — S75 en cours, S74 livré
- `20-pilotage-projet.html` — scores 99/99/98/99, bloc S74 en tête d'historique
- `17-api-reference.html` — groupe 23 (10 routes/tools S74 : AC + PDF + get_avoirs_client)

### Conv1 — Docs GitHub Pages S75 — commit `06a048d`

- `changelog-sprint-S75.html` — NOUVEAU release notes S75
- `docs-changelog.html` — onglet S75 actif, S74 désactivé
- `06-roadmap.html` — S75 en cours, S74 livré ✅
- `20-pilotage-projet.html` — ligne S75 dans historique

### Conv2 — Vue Carte `/app/clients` réactivée

- Leaflet chargé via script tag `window.L` (R-35)
- Interval retry 50ms pour attendre `mapRef.current` disponible
- Hauteur fixe `calc(100vh - 210px)`
- Dropdown suggestions fond opaque hardcodé `#1E293B` (R-36)
- `map.invalidateSize()` après init

### Conv2 — Dropdown `/app/carte`

- z-index dropdown `z-[2000]` (au-dessus contrôles Leaflet z-1000)
- Fond opaque `#1E293B` hardcodé (variable CSS non résolue dans ce contexte)

### Conv2 — Page Bilans Comportementaux + Sidebar

- `/app/seances/edc` : EDC → BC dans tous les libellés UI (R-37)
- Sidebar COMPORTEMENTALISTE : lien "Bilans comportementaux" → `/app/seances/edc`
- Fix double sélection sidebar : `startsWith(href + '/')` avec exclusion (R-38)

---

## 2. Commits S75

### Code source (`micro_logiciel`)
| Commit | Conv | Description |
|---|---|---|
| `0bf81ea` | Conv1 | feat(S75): tarification UI — page paramètres + boutons M1/M2/M3 sur devis + fix route appliquer-tarif |
| `86def62` | Conv1 | feat(S75): migration GED — suppression getDbGed() + micro_logiciel_ged, routes editions simplifiées |
| `294bbfd` | Conv1 | feat(S75): fix modal PDF AC — iframe src URL + handlePdf + showPdf |
| à pusher | Conv2 | feat(S75): vue carte clients réactivée + page BC + sidebar fix |

### Docs (`petsuite-docs`)
| Commit | Description |
|---|---|
| `b2cb497` | docs(S74): changelog S74 + tabs changelog + roadmap S75 + pilotage scores S74 + API ref groupe 23 |
| `06a048d` | docs(S75): changelog S75 + roadmap + pilotage + docs-changelog |

---

## 3. Fichiers modifiés S75

| Fichier | Modification |
|---|---|
| `api/src/custom-routes.ts` | Fix appliquer-tarif (await getDb) + suppression getDbGed() + simplification routes editions |
| `src/app/app/parametres/tarification/page.tsx` | NOUVEAU — page tarification complète |
| `src/app/app/devis/[id]/page.tsx` | +TarificationSection + useCallback import |
| `src/app/app/avoir-client/[id]/page.tsx` | srcDoc→src URL, handlePdf simplifié, showPdf ajouté |
| `src/app/app/clients/page.tsx` | Vue Carte réactivée (Conv2) |
| `src/app/app/carte/page.tsx` | z-index 2000 + fond opaque dropdown (Conv2) |
| `src/app/app/seances/edc/page.tsx` | EDC → BC libellés UI (Conv2) |
| `src/components/Sidebar.tsx` | Lien BC + fix double sélection (Conv2) |
| `C:\AnimGest_Sav\changelog-sprint-S74.html` | NOUVEAU |
| `C:\AnimGest_Sav\changelog-sprint-S75.html` | NOUVEAU |
| `C:\AnimGest_Sav\docs-changelog.html` | +onglets S74+S75 |
| `C:\AnimGest_Sav\06-roadmap.html` | S75 en cours, S74 livré |
| `C:\AnimGest_Sav\20-pilotage-projet.html` | +blocs S74+S75 |
| `C:\AnimGest_Sav\17-api-reference.html` | +groupe 23 |

---

## 4. BDD — Modifications S75

```sql
-- BDD legacy GED supprimée
DROP DATABASE micro_logiciel_ged;
-- Était vide (0 tables) — aucune donnée perdue
-- Architecture BDD : micro_logiciel uniquement
```

---

## 5. Dette technique S76

### ROUGE
*(aucun)*

### ORANGE
| Item | Page | Action |
|---|---|---|
| Liste devis — affiche ID | `/app/devis` | Remplacer colonne ID par `DCE_NUMERO` (DEV-YYMM-0001) cliquable |
| Liste factures — affiche ID | `/app/factures` | Remplacer colonne ID par `FAC_NUM` (FAC-YYMM-0001) cliquable |
| Page avoirs crash | `/app/avoirs` | Application error — API OK, bug TSX (AVC_NUMERO probablement) |
| Règlements — clic FAC_NUM | `/app/reglements` | Le numéro de facture ne navigue pas → ajouter `onClick → /app/factures/:FAC_ID` |
| Modal PDF BL illisible | `/app/bon-livraison/[id]` | Revoir template HTML `GET /editions/bon-livraison/:id` — CSS manquant |
| Modal PDF BR non conforme | `/app/bon-retour/[id]` | Harmoniser sur format devis/factures |
| Modal PDF DAF non conforme | `/app/demande-avoir-fourn/[id]` | Harmoniser sur format devis/factures |
| Fusion CGV factures | `/app/factures/[id]` | Ajouter fusion CGV dans route `GET /editions/facture/:id` (comme devis) |
| Édition PDF inventaire | `/app/inventaires/[id]` | Créer route `GET /editions/inventaire/:id` + bouton PDF + modal |

### JAUNE
| Item | Action |
|---|---|
| Inventaires — montant stock valorisé | Valeur en haut à gauche incorrecte — vérifier calcul/colonne |
| Page création BC | `/app/seances/new?type=EDC` → formulaire BC complet dédié |
| Docs S75 — api-reference | Ajouter note migration GED dans groupe existant |

---

## 6. Score qualité S75

| Axe | S74 | S75 |
|---|---|---|
| Backend | 99/100 | **99/100** (fix appliquer-tarif + GED migration + routes editions simplifiées) |
| Frontend | 99/100 | **99/100** (+page tarification +modal AC src URL +carte +BC +sidebar) |
| BDD | 98/100 | **98/100** (micro_logiciel_ged supprimée — architecture allégée) |
| Global | 99/100 | **99/100** |

> Routes API : ~190 | Pages UI : **117** (+1) | Eliot tools : **22** | JSDoc : 240/240 ✅
> app.use() : **0** | BDD : `micro_logiciel` uniquement ✅ | GED legacy supprimée ✅
> Docs : 114 pages · 22 groupes API · Changelogs S30→S75

---

## 7. Démarrage S76

```powershell
$root   = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
$deploy = "$root\deploy"

# 0. Vérif stack
Set-Location $deploy
docker compose ps
Invoke-RestMethod "http://localhost/api/bilan"

# 1. Priorité S76 — attaquer les ORANGE en premier :
#    - Fix listes devis/factures (ID → numéro)
#    - Fix page avoirs (crash)
#    - Harmoniser modals PDF BL/BR/DAF
#    - Fusion CGV factures

# 2. Séquence deploy API si rebuild nécessaire
Set-Location $deploy
docker compose build api --no-cache
docker compose up -d api
docker compose restart nginx

# 3. Séquence deploy frontend si rebuild nécessaire
Set-Location $root
.\COPIER_TOUTES_PAGES_v2.ps1
Set-Location "$root\deploy"
docker compose build frontend --no-cache
docker compose up -d frontend
docker compose restart nginx
```

---

## 8. Règles critiques (rappel complet)

```
instance.use() UNIQUEMENT — jamais app.use()
POST/PUT → _readBody() obligatoire
getDb() : TOUJOURS await getDb() — retourne Promise<Connection>
(db as any).execute() — jamais [rows] = await db.execute()
PDF : modal iframe src="/api/editions/[type]/[id]" — jamais window.open() ni srcDoc fetch inline
cd deploy OBLIGATOIRE avant docker compose
COPIER_TOUTES_PAGES_v2.ps1 AVANT build frontend
Scripts Python : $env:USERPROFILE\Downloads\ (jamais OneDrive)
-LiteralPath pour chemins contenant [id]
Table animaux : 'animal' (singulier) · TIE_RAISON_SOCIALE · FAC_NUM · FAC_TOTAL_TTC
R-22 : ANI_NOM · ANI_CLI · ANI_ESP_1 · TIE_TEL
R-23 : Éléments flottants → .dropdown-panel / .modal-panel / .modal-overlay
R-24 : Scripts Python TS → vérifier named imports avant injection
R-25 : Thème clair CSS = html.light .ma-classe (pas [data-theme])
R-26 : Routes spécifiques AVANT routes paramétriques
R-27 : FAC_TOTAL_TTC · FAC_NUM (pas FAC_NUMERO)
R-28 : Composants React — déclarer tous les états utilisés dans le JSX
R-29 : Leaflet → mapReady state + setMapReady(true) dans onload
R-30 : Code propre — JSDoc obligatoire sur toute nouvelle route
R-31 : instance.use() — next() + filtre méthode
R-32 : Routes /:id — filtre urlParts.length pour rejeter /:id/sous-chemin
R-33 : Eliot tools — JAMAIS ,{ en début de ligne
R-34 : BDD — FK "Relation table - desc", PK "Identifiant unique", DEFAULT NULL (pas 'NULL')
R-35 : Leaflet dans Next.js — script tag (window.L), interval retry 50ms, invalidateSize()
       PageHeader → import { PageHeader } (named export, pas default)
R-36 : Dropdown carte — fond hardcodé #1E293B, z-index: 2000 (au-dessus Leaflet z-1000)
R-37 : Terminologie UI — "BC Bilan Comportemental" (jamais EDC dans labels utilisateur)
       Route API interne conservée /seances/edc
R-38 : Sidebar active — pathname === href OU startsWith(href + '/') avec exclusion + '/'
       (jamais startsWith(href) sans '/' → double sélection)
R-39 : Modal PDF — TOUJOURS <iframe src="/api/editions/[type]/[id]">
       handlePdf = () => setShowPdf(true) / showPdf = useState(false)
       Jamais srcDoc ni fetch inline pour charger le PDF dans une modal
git pull --rebase avant push sur petsuite-docs
Frimousse : ANI_ID=22, CHIEN, ANI_CLI=8 (Jean Dujardin) — NE PAS SUPPRIMER
portail_client_acces : PCA_ID, PCA_TOKEN, PCA_ACTIF
avoir_client_ligne : ACL_ID, AVC_ID, ACL_DESIGNATION, ACL_QTE, ACL_PU_HT, ACL_TVA_TAUX
Tarification : param_tarification — METHODE_TARIF, COEF_FG_DEFAUT, PCT_MARGE_DEFAUT, COEF_VTE_DEFAUT
               DCE_METHODE_TARIF / DCE_COEF_FG / DCE_PCT_MARGE / DCE_COEF_VTE / DCE_VERROUILLE
```

---

## 9. Données de test préservées

| Donnée | Valeur |
|---|---|
| Frimousse | `ANI_ID=22`, Malinois CHIEN, `ANI_CLI=8` (Jean Dujardin) — NE PAS SUPPRIMER |
| Jean Dujardin | `TIE_ID=8` |
| Catherine Deneuve (portail) | `TIE_ID=1`, `PCA_ID=1`, email=`nicolashermilly@gmail.com`, token actif |
| Devis BROUILLON test tarif | `DCE_ID=129` (DCE-2604-0003, Frimousse) + `DCE_ID=128` |
| Devis ACCEPTE | `DCE_ID=118` (DCE-2604-0001) — TarificationSection non visible |
| Param tarification | `ID=1`, METHODE=COEF_VTE, CoefFG=0.15, PctMarge=0.30, CoefVte=2.50 |
| BL test | `BL_ID=1`, BL-2604-0001, Catherine Deneuve |
| BR test | `BR_ID=1`, BR-2604-0001, Croquettes Premium, TTC=60€ |
| DAF test | `DAF_ID=1`, DAF-2604-0001, BR_ID=1 |
| AC test | `AVC_ID=1`, AC-2604-0001, TIE_ID=1, statut EMIS |
| AC ligne test | `ACL_ID=1`, Remboursement consultation, 85€ HT / 102€ TTC |
| BC test | `SEA_ID=1`, EDC Frimousse — Dujardin Jean, REALISEE, 120€ |
| Clients géocodés | 14 clients avec latitude/longitude (sur 167 total) |
| Règlements | 183 règlements en BDD |
| Factures | 279 factures en BDD |
| Mémoire Eliot | Seeds : `langue_reponse=français` + `metier_principal=Comportementaliste canin` |

---

*Anim'Gest — NoSage's Editor — Handover S75 COMPLET (Conv1+Conv2) — 10/04/2026*
