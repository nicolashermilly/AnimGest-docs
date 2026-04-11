# HANDOVER S74 — FIN DE SESSION COMPLÈTE
**Date :** 09/04/2026
**Sprint :** S74
**Conversations :** Conv1 (Docs + Module AC + Eliot) + Conv2 (PDF BL/BR/DAF/AC + BDD) — fusionnées

---

## ⚠️ VÉRIFICATION OBLIGATOIRE EN DÉBUT DE S75

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
| `/app/avoir-client` | Charger | Liste AC, AVC_NUMERO cliquable |
| `/app/avoir-client/1` | Charger | Fiche AC-2604-0001 + section lignes + bouton PDF |
| `/app/avoir-client/1` | Clic PDF | Modal srcdoc avec lignes (Remboursement consultation 85€ HT) |
| `POST /api/avoir-client/1/lignes` | Test | Ligne créée, totaux mis à jour par trigger |
| `GET /api/editions/avoir-client/1` | Test | HTML avec section lignes avoir_client_ligne |
| `GET /api/editions/bon-retour/1` | Test | HTML BR-2604-0001, Croquettes Premium, TTC 60€ |
| `GET /api/editions/bon-livraison/1` | Test | HTML BL-2604-0001, Catherine Deneuve |
| `GET /api/editions/demande-avoir-fourn/1` | Test | HTML DAF-2604-0001 |
| `/app/bon-retour/1` | Bouton PDF | Modal iframe src URL |
| `/app/bon-livraison/1` | Bouton PDF | Modal iframe src URL |
| `/app/demande-avoir-fourn/1` | Bouton PDF | Modal iframe src URL |
| Eliot `/ia/chat` | "liste moi les avoirs client" + COMPORTEMENTALISTE | Réponse avec AC-2604-0001 |
| Eliot `/ia/chat` | `bonjour` + COMPORTEMENTALISTE | Réponse sans erreur Anthropic |

---

## 1. Accompli en S74

### Fix docs GitHub Pages S73 (Conv1) — commit `a0cb396`
- `docs-changelog.html` — onglet S73 ajouté actif, S72 désactivé, badge nav S73
- `06-roadmap.html` — S74 en cours, S73 livré, tâches ORANGE S74 à jour
- `20-pilotage-projet.html` — bloc S73 injecté dans historique, scores BDD 93/100

### Module AC Avoir Client complet (Conv1) — commit `5e56674`
- **Guards R-26/R-32** sur GET /avoir-client liste + GET /avoir-client/:id
- **PUT /avoir-client/:id** — whitelist 6 champs
- **Routes lignes** GET + POST `/avoir-client/:id/lignes` — avant POST liste (ordre R-26)
- **Page `/app/avoir-client/[id]/page.tsx`** — section lignes + formulaire ajout + totaux + lien facture
- **AVC_NUMERO cliquable** dans page liste → `/app/avoir-client/:id`
- Suite BL→BR→DAF→**AC** complète ✅

### BDD — avoir_client_ligne + triggers (Conv1) — HeidiSQL
- Table `avoir_client_ligne` créée (ACL_ID, AVC_ID, ACL_DESIGNATION, ACL_QTE, ACL_PU_HT, ACL_TVA_TAUX, ACL_TOTAL_HT, ACL_TOTAL_TTC, ACL_CREE_LE)
- 3 triggers MariaDB : `trg_acl_after_insert`, `trg_acl_after_update`, `trg_acl_after_delete` → recalcul `AVC_TOTAL_HT` / `AVC_TOTAL_TTC`

### PDF éditions BL/BR/DAF/AC (Conv2) — commit `62fc49f`
- `GET /editions/bon-livraison/:id` — HTML PDF avec lignes (sans prix, doc transport) · violet `#4F46E5`
- `GET /editions/bon-retour/:id` — HTML PDF avec lignes + totaux HT/TVA/TTC · amber `#F59E0B`
- `GET /editions/demande-avoir-fourn/:id` — HTML PDF avec lignes + BR lié · violet `#8B5CF6`
- `GET /editions/avoir-client/:id` — HTML PDF avec lignes `avoir_client_ligne` + totaux · vert `#10B981`
- Boutons PDF + modals `<iframe src="/api/editions/...">` sur pages BL/BR/DAF/[id]
- Fix SQL : `f.FAC_NUM` (pas `f.FAC_NUMERO`)

### PDF AC amélioré avec lignes (Conv1) — commit `16fbcfd`
- Route `GET /editions/avoir-client/:id` enrichie : requête `avoir_client_ligne` + tableau HTML complet
- Bouton PDF + modal `srcDoc` (fetch HTML) dans page `/app/avoir-client/[id]`

### Eliot tool get_avoirs_client (Conv1) — commit `16fbcfd`
- Tool 22 ajouté : liste avoirs client avec filtres `statut` + `tie_id`
- Retourne : `total`, `total_ttc`, `avoirs[]` (numéro, client, montant, statut, motif, facture origine)
- Format one-liner R-33 ✅

### Commentaires colonnes BDD (Conv2) — HeidiSQL (pas de commit code)
- **1791 colonnes commentées** sur **171 tables** `micro_logiciel`
- Convention FK : `Relation table_liee - description attendue`
- Convention PK : `Identifiant unique de l enregistrement [table]`
- Fix `DEFAULT NULL` (keyword) vs `DEFAULT 'NULL'` (string) sur datetime/varchar nullable
- Dette technique BDD soldée — score BDD 98/100 ✅

---

## 2. Commits S74

### Code source (`micro_logiciel`)
| Commit | Hash | Conv | Description |
|---|---|---|---|
| S74 | `a0cb396` | Conv1 | docs(S74): fix docs-changelog + roadmap + pilotage — patches S73 non pris |
| S74 | `5e56674` | Conv1 | feat(S74): module AC avoir_client — guards + PUT + routes lignes + page [id] + lien liste |
| S74 | `62fc49f` | Conv2 | feat(S74): routes PDF editions BL/BR/DAF/AC + boutons modal srcdoc |
| S74 | `16fbcfd` | Conv1 | feat(S74): Eliot tool get_avoirs_client (tool 22) + route PDF AC avec lignes |

### Docs (`petsuite-docs`)
| Commit | Hash | Description |
|---|---|---|
| S74 | `a0cb396` | docs(S74): fix docs-changelog + roadmap + pilotage S73 |

### BDD (`micro_logiciel`)
| Action | Détail |
|---|---|
| Table `avoir_client_ligne` | Créée via HeidiSQL — Conv1 |
| 3 triggers `trg_acl_*` | AFTER INSERT/UPDATE/DELETE — Conv1 |
| 1791 `ALTER TABLE` | Commentaires colonnes 171 tables — Conv2 |

---

## 3. Fichiers modifiés S74

| Fichier | Modification |
|---|---|
| `api/src/custom-routes.ts` | Guards R-26/R-32 AC + PUT AC + routes lignes AC + 4 routes PDF + PDF AC lignes + tool 22 |
| `src/app/app/avoir-client/page.tsx` | AVC_NUMERO cliquable + useRouter |
| `src/app/app/avoir-client/[id]/page.tsx` | NOUVEAU — section lignes + formulaire + totaux + bouton PDF + modal |
| `src/app/app/bon-livraison/[id]/page.tsx` | +bouton PDF + modal srcdoc |
| `src/app/app/bon-retour/[id]/page.tsx` | +bouton PDF + modal srcdoc |
| `src/app/app/demande-avoir-fourn/[id]/page.tsx` | +bouton PDF + modal srcdoc |
| `C:\AnimGest_Sav\docs-changelog.html` | +onglet S73 actif |
| `C:\AnimGest_Sav\06-roadmap.html` | S74 en cours, S73 livré |
| `C:\AnimGest_Sav\20-pilotage-projet.html` | +bloc S73 historique |

---

## 4. BDD — Modifications S74

```sql
-- Table créée (Conv1)
CREATE TABLE micro_logiciel.avoir_client_ligne (
  ACL_ID INT AUTO_INCREMENT PRIMARY KEY,
  AVC_ID INT NOT NULL,
  ACL_DESIGNATION VARCHAR(255) NOT NULL,
  ACL_QTE DECIMAL(10,2) DEFAULT 1.00,
  ACL_PU_HT DECIMAL(10,2) DEFAULT 0.00,
  ACL_TVA_TAUX DECIMAL(5,2) DEFAULT 20.00,
  ACL_TOTAL_HT DECIMAL(10,2) DEFAULT 0.00,
  ACL_TOTAL_TTC DECIMAL(10,2) DEFAULT 0.00,
  ACL_CREE_LE DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Triggers créés (Conv1)
trg_acl_after_insert  → recalcul AVC_TOTAL_HT/TTC
trg_acl_after_update  → recalcul AVC_TOTAL_HT/TTC
trg_acl_after_delete  → recalcul AVC_TOTAL_HT/TTC

-- Commentaires BDD (Conv2)
1791 colonnes commentées sur 171 tables via ALTER TABLE MODIFY COLUMN COMMENT
```

---

## 5. Dette technique S75

### ROUGE
*(aucun)*

### ORANGE
*(aucun)*

### JAUNE
| Item | Action |
|---|---|
| Supprimer `micro_logiciel_ged` | Après validation GED complète |
| Vue Carte `/app/clients` | Réactiver si accès réseau externe disponible (WireGuard VPN ?) |
| Tarification UI | Appliquer les 3 méthodes au devis côté frontend (page + routes existent depuis S64) |
| Modal PDF AC | Aligner sur pattern `src` URL (comme BL/BR/DAF) au lieu de `srcDoc` inline |

---

## 6. Score qualité S74

| Axe | S73 | S74 |
|---|---|---|
| Backend | 98/100 | **99/100** (+6 routes PDF + PUT AC + 2 routes lignes + tool 22) |
| Frontend | 99/100 | **99/100** (+page AC[id] + 4 boutons PDF + liste cliquable) |
| BDD | 93/100 | **98/100** (+table ACL + 3 triggers + 1791 colonnes commentées) |
| Global | 98/100 | **99/100** |

> Routes API : ~189 (+8) | Pages UI : **121** (+1) | Eliot tools : **22** (+1) | JSDoc : 240/240 ✅
> app.use() : **0** | Colonnes BDD commentées : **1791/1791** ✅
> Docs : 113 pages · 22 groupes API · Changelogs S30→S73

---

## 7. Démarrage S75

```powershell
$root   = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
$deploy = "$root\deploy"

# 0. Vérif stack
Set-Location $deploy
docker compose ps
Invoke-RestMethod "http://localhost/api/bilan"

# 1. Test Eliot immédiat
Invoke-RestMethod -Uri "http://localhost/api/ia/chat" -Method POST `
  -ContentType "application/json" `
  -Body '{"message":"bonjour","metier":"COMPORTEMENTALISTE"}'

# 2. Aucun ROUGE ni ORANGE — attaquer les chantiers fonctionnels S75

# 3. Séquence deploy API si rebuild nécessaire
Set-Location $deploy
docker compose build api --no-cache
docker compose up -d api
docker compose restart nginx

# 4. Séquence deploy frontend si rebuild nécessaire
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
getDb() + db.end() dans finally
(db as any).execute() — jamais [rows] = await db.execute()
PDF : modal iframe src="/api/editions/[type]/[id]" — jamais window.open()
cd deploy OBLIGATOIRE avant docker compose
COPIER_TOUTES_PAGES_v2.ps1 AVANT build frontend
Scripts Python : $env:USERPROFILE\Downloads\ (jamais OneDrive)
-LiteralPath pour chemins contenant [id]
Table animaux : 'animal' (singulier) · TIE_RAISON_SOCIALE · FAC_NUM · FAC_TOTAL_TTC
R-22 : ANI_NOM · ANI_CLI · ANI_ESP_1 · TIE_TEL
R-23 : Éléments flottants → .dropdown-panel / .modal-panel / .modal-overlay
R-24 : Scripts Python TS → vérifier named imports avant injection
R-25 : Thème clair CSS = html.light .ma-classe (pas [data-theme])
R-26 : Routes spécifiques (/export-csv, /lignes) AVANT routes paramétriques (/:id)
       Guard filtre urlParts.length dans routes /:id pour rejeter /:id/sous-chemin
R-27 : FAC_TOTAL_TTC (pas FAC_TOTAL_HT) · FAC_NUM (pas FAC_NUMERO)
R-28 : Composants React — déclarer tous les états utilisés dans le JSX
R-29 : Leaflet → mapReady state + setMapReady(true) dans onload
R-30 : Code propre — tolérance zéro dette technique — JSDoc obligatoire sur toute nouvelle route
R-31 : instance.use() avale TOUTES les méthodes — toujours ajouter next() + filtre méthode
R-32 : Routes avec sous-chemins (/:id/lignes) — ajouter filtre urlParts.length dans routes /:id
R-33 : Eliot tools tableau — JAMAIS ,{ en début de ligne (crée undefined dans tableau JS)
       Format correct : }, en fin de ligne précédente OU { one-liner sur nouvelle ligne
R-34 : Commentaires BDD FK → "Relation table_liee - description"
       Commentaires BDD PK → "Identifiant unique de l enregistrement [table]"
       DEFAULT NULL (keyword SQL) — jamais DEFAULT 'NULL' (string)
git pull --rebase avant push sur petsuite-docs
Frimousse : ANI_ID=22, CHIEN, ANI_CLI=8 (Jean Dujardin) — NE PAS SUPPRIMER
portail_client_acces : préfixe PCA_ (pas PCT_) — PCA_ID, PCA_TOKEN, PCA_ACTIF
portail_client_notification : pas de PCT_ID ni PCN_CORPS — colonnes PCN_* + TIE_ID
demande_avoir_fourn : BR_ID nullable — liaison optionnelle vers bon_retour
avoir_client_ligne : ACL_ID, AVC_ID, ACL_DESIGNATION, ACL_QTE, ACL_PU_HT, ACL_TVA_TAUX
```

---

## 9. Données de test préservées

| Donnée | Valeur |
|---|---|
| Frimousse | `ANI_ID=22`, Malinois CHIEN, `ANI_CLI=8` (Jean Dujardin) — NE PAS SUPPRIMER |
| Jean Dujardin | `TIE_ID=8` |
| Catherine Deneuve (portail) | `TIE_ID=1`, `PCA_ID=1`, email=`nicolashermilly@gmail.com`, token actif |
| Mémoire Eliot | Seeds : `langue_reponse=français` + `metier_principal=Comportementaliste canin` |
| BL test | `BL_ID=1`, BL-2604-0001, Catherine Deneuve |
| BR test | `BR_ID=1`, BR-2604-0001, 1 ligne (Croquettes Premium 2x25€), total HT=50, TTC=60 |
| DAF test | `DAF_ID=1`, DAF-2604-0001, BR_ID=1, 1 ligne (Collier anti-puce), HT=15, TTC=18 |
| DAF test 2 | `DAF_ID=2`, DAF-2604-0002, BR_ID=1 |
| AC test | `AVC_ID=1`, AC-2604-0001, TIE_ID=1 (Catherine Deneuve), statut EMIS |
| AC ligne test | `ACL_ID=1`, AVC_ID=1, Remboursement consultation, 85€ HT / 102€ TTC |
| Déclarations | 18 entrées (17 seeds + 1 créé en S73), types SCC/LOOF |
| Historique notifs | `PCN_ID` 1-5, `TIE_ID=1`, statuts ENVOYE |

---

*Anim'Gest — NoSage's Editor — Handover S74 COMPLET (Conv1+Conv2) — 09/04/2026*
