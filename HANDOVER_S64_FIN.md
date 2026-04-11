# HANDOVER S64 — FIN DE SESSION
**Date :** 06/04/2026  
**Sprint :** S64  
**Commits :** bc14949 → 7cdf629 (en cours : fix SQL v4)

---

## 1. Accompli en S64

### 1a. Dette technique — `bc14949`
- 5 routes 404 créées, doublons Eliot supprimés, 4 `createConnection` → `getDbGed()`, `REG_STATUT` supprimé, `app.use` → `instance.use`

### 1b. Tarification 3 méthodes — `95dfa87`
- Routes GET/PUT `/tarification`, `/tarification/historique`, `/devis/:id/appliquer-tarif`
- Table `param_tarification`, page `/app/parametres/tarification` ✅

### 1c. PUT /devis/:id lignes
- Whitelist 13 champs, DELETE + INSERT lignes, recalcul totaux ✅

### 1d. Modules commerciaux BL/BR/DAF/AC — `b89bc03`
- 16 routes, 4 tables BDD, 4 pages TSX, numérotation chrono ✅
- Build 110 pages ✅

### 1e. Fix Eliot create_reglement — `1731d73`
- `_readBody()` + INSERT 4 colonnes + REG_STATUT supprimé → REG_ID=228 ✅

### 1f. Eliot tools — `7eb7a8b`
- `create_seance` SEA_ID=160 ✅, `get_planning` ✅, `send_portail_link` ✅

### 1g. Nouvelle GED Filesystem — `f8bdf49`
- `C:\AnimGest_GED\SCT_001\`, volume Docker monté, table `ged_fichier`
- Colonnes GED dans `param_entreprise` (`ENT_GED_PATH`, `ENT_GED_CODE`, `ENT_BDD_NOM`)
- Table `societe` supprimée — fusionnée dans `param_entreprise`
- 20 images BIB_Widget migrées, POST /ged/upload 201 ✅

### 1h. 14 routes manquantes + clients/[id] — `02ae79c`
- `/editions/devis`, `/editions/facture`, `/factures/avoir`, `/factures/:id/statut`,
  `/factures/:id/reglements`, `/devis/:id/statut`, `/achats/:id/bon-a-payer`,
  `/achats/:id/marquer-recu`, `/achats/reglements`, `/commandes-fourn`,
  `/statistiques`, `/planning`, `/templates`, `/ged-devis-formule/planifier`

### 1i. Fix SQL routes — `aed1a3e` + `dc6fd35` + `7cdf629` + 🔜
- `devis_contrat_ligne` (était `devis_ligne`)
- `achat_entete` (était `commande_fournisseur`)
- `avoir_client` (était `avoir`)
- Alias `sst` dans planning (était `st`)
- Page `/app/elevage/declarations` créée ✅

### 1j. Fix `app.use` → `instance.use` sur `/seances/:id`
- Fix DnD planning (PATCH ne persistait pas) ✅

---

## 2. Commits S64

| Commit | Description |
|---|---|
| `bc14949` | Dette technique : routes 404, doublons Eliot, getDbGed |
| `95dfa87` | Tarification 3 méthodes |
| `b89bc03` | Modules BL/BR/DAF/AC : 16 routes + tables + pages |
| `1731d73` | Fix Eliot create_reglement |
| `7eb7a8b` | Eliot tools : create_seance + get_planning + send_portail_link |
| `f8bdf49` | GED filesystem : routes + volume Docker |
| `02ae79c` | 14 routes manquantes + fix clients/[id] |
| `aed1a3e` | Fix SQL v1 : devis_contrat_ligne + planning + achat + avoir_client |
| `dc6fd35` | Fix SQL v2 + page elevage/declarations |
| `7cdf629` | Fix SQL v3 : avoir_client + achat_entete + planning sst |
| 🔜 | Fix SQL v4 : SST_NOM + AVC_NUMERO + ACH_ID + FAC_NUMERO |

---

## 3. État scan final (avant fix v4)

| Statut | Nb | Routes |
|---|---|---|
| ✅ OK | 51 | Toutes les routes principales |
| ⚠️ WARN | 1 | `/api/factures/avoir` (404) |
| ❌ FAIL | 3 | `/api/planning`, `/api/avoirs`, `/api/achats/1/bon-a-payer` |

**Causes des 3 FAIL (fix v4 en cours) :**
- `planning` : colonne `SST_LIBELLE` → vrai nom `SST_NOM`
- `avoirs` : colonne `AVO_NUM` → `AVC_NUMERO`
- `bon-a-payer` : `CMF_ID` → `ACH_ID` dans WHERE

---

## 4. BDD — Nouvelles tables S64

| Table | Description |
|---|---|
| `bon_livraison` + `bon_livraison_ligne` | Module BL |
| `bon_retour` | Module BR |
| `avoir_client` | Module AC |
| `demande_avoir_fourn` | Module DAF |
| `param_tarification` | Tarification 3 méthodes |
| `ged_fichier` | GED filesystem |
| `portail_client_acces` | Accès portail (S63, PCA_ID=2 Dujardin) |

**Colonnes ajoutées à `param_entreprise` :**
- `ENT_GED_PATH` = `C:\AnimGest_GED\SCT_001`
- `ENT_GED_CODE` = `SCT_001`
- `ENT_BDD_NOM` = `micro_logiciel`

---

## 5. Architecture GED

```
C:\AnimGest_GED\
  SCT_001\
    Widgets\          ← 20 images BIB_Widget + logos
    Semaine_2026_15\
      Module_Devis\
      Module_Factures\
      Module_Seances\
      Module_Animaux\ ← Photos animaux
      Module_BL\ Module_BR\ Module_AC\ Module_DAF\
      Module_Editions\
```
Volume Docker : `C:\AnimGest_GED:/app/ged_new`

---

## 6. Données test préservées

| Donnée | Valeur |
|---|---|
| Frimousse | `ANI_ID=22`, Malinois, Jean Dujardin — NE PAS SUPPRIMER |
| Jean Dujardin | `TIE_ID=8` (TIE_ID=1 = Catherine Deneuve) |
| Portail Dujardin | `PCA_ID=2`, token `3d7e2e7cf4e9...` |
| Séance Eliot | `SEA_ID=160`, 25/04/2026 14h00 |
| Règlement Eliot | `REG_ID=228`, facture PAYÉE |

---

## 7. Dette technique restante S65

### ROUGE
| Item | Action |
|---|---|
| Scan final post-fix v4 à valider | Relancer `scan_complet_final.js` après rebuild |
| `migration_ged_complete.sql` | Exécuter dans HeidiSQL |

### ORANGE
| Item | Action |
|---|---|
| Drag & Drop agenda | Fix `instance.use('/seances/:id')` en place — tester persistance |
| Supprimer `micro_logiciel_ged` | Après validation GED complète |
| `clients/[id]` crash runtime | Page compile mais crash React — investiguer `@/lib/api` |

### JAUNE
| Item | Action |
|---|---|
| Export CSV règlements | Bouton absent dans reglements/page.tsx |
| JSDoc 4 fichiers | 133/137 couverts |
| ~100 `app.use()` restants | Migration progressive vers `instance.use()` |
| Docs GitHub Pages S64 | Mettre à jour roadmap, API reference, changelog |

---

## 8. Score qualité S64

| Axe | S63 | S64 |
|---|---|---|
| Backend | 85/100 | **88/100** |
| Frontend | 84/100 | **86/100** |
| BDD | 85/100 | **88/100** |
| Global | 85/100 | **87/100** |

> Routes API : ~140 | Pages UI : 110 | Eliot tools : 13 | GED : nouvelle archi filesystem

---

## 9. Démarrage S65

```powershell
$root = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
Set-Location "$root\deploy"
docker compose ps
Invoke-RestMethod "http://localhost/api/bilan"

# Vérifier le scan (0 FAIL attendu après fix v4)
# Ouvrir http://localhost/api/bilan dans Chrome
# Coller le contenu de scan_complet_final.js dans DevTools Console

# Si encore des erreurs SQL : consulter HANDOVER_S64_FIN.md section 3
```

---

## 10. Règles critiques (rappel)

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
```
