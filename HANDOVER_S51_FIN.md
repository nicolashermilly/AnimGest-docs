# PetSuite — Handover fin de session S51
**Date :** 25 mars 2026  
**Sprint :** S51 → passe à S52  
**Auteur :** Session Claude S51

---

## 🔗 URLs & chemins essentiels

| Ressource | Valeur |
|---|---|
| **App locale** | http://localhost/app/ |
| **Docs GitHub** | https://github.com/nicolashermilly/petsuite-docs |
| **GitHub Pages** | https://nicolashermilly.github.io/petsuite-docs/ |
| **Downloads** | C:\Users\AdminPC\Downloads |
| **Racine frontend** | D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs |
| **Deploy dir** | ...\micro_logiciel_frontend_nextjs\deploy |
| **API source** | ...\micro_logiciel_frontend_nextjs\api\src\custom-routes.ts |
| **BDD** | 192.168.1.62:3307 — bases : micro_logiciel + micro_logiciel_ged |

---

## ✅ Accompli en S51 — liste complète

### 1. Carte clients — Leaflet + géocodage batch
- **Bug 1** : `loading = true` pendant géocodage → `mapRef.current === null` → Leaflet ne monte jamais. **Fix** : `setDataLoading(false)` dès réception API, géocodage en arrière-plan.
- **Bug 2** : `latitude/longitude null` en BDD (jointure `TIE_VILLE_ID` morte). **Fix** : géocodage batch frontend via `api-adresse.data.gouv.fr` par CP avec cache.
- **Bug 3** : CDN Leaflet `unpkg` → `cdnjs.cloudflare.com`.
- **Résultat** : 140/156 clients géocodés sur la carte. 16 sans adresse géocodable.

### 2. Uniformisation boutons ← Retour
- `factures/[id]` : `← Retour` → `← Factures`
- `inventaires/[id]` : `← Retour` → `← Inventaires` (2 occurrences)

### 3. Uniformisation boutons + Nouveau
- `factures/page.tsx` : `+ Nouvelle` → `+ Nouvelle facture`
- `devis/page.tsx` : `+ Nouveau` → `+ Nouveau devis`
- `animaux/page.tsx` : `+ Nouveau` → `+ Nouvel animal`
- `achats/page.tsx` : `+ Nouveau` → `+ Nouvel achat`

### 4. Routes API GED CAC (nouvelles — 43 routes total)
- `GET /ged-cac/animal/:id/evolution` → historique CAC via vue `v_animal_evolution_cac` ✅
- `GET /ged-cac/animal/:id/score` → score CAC actuel ✅
- Vraie table BDD : `seance_suivi_cac` (pas `suivi_cac`)
- Vue disponible : `v_animal_evolution_cac`

### 5. Export CSV
- `factures/page.tsx` → bouton **⬇ CSV** : Numéro, Date, Client, Statut, Total TTC, Payé, Reste
- `seances/page.tsx` → bouton **⬇ CSV** : ID, Date, Client, Animal, Type, Statut, Durée, Montant, Objet, Lieu
- Format : UTF-8 BOM, séparateur `;` (compatible Excel FR)

### 6. Documentation GitHub Pages
- `03-notice-utilisateur.html` → v4 (élevage, achats, inventaires, RS, topbar v2) ✅
- `07-audit-stack.html` → S51 (43 routes, règles complètes) ✅
- `47-changelog-S51.html` → nouveau ✅
- Index : 96 pages de doc, sprint S51 ✅

---

## 🚧 À FAIRE — Tâches prioritaires S52

### 1. Vérifier la carte clients + boutons CSV (build en cours)
- `http://localhost/app/clients` → onglet Carte → carte visible immédiatement, marqueurs progressifs
- `http://localhost/app/factures` → bouton ⬇ CSV à droite de "+ Nouvelle facture"
- `http://localhost/app/seances` → bouton ⬇ CSV à droite de "+ Nouvelle séance"

### 2. Yousign — signature end-to-end
- Bouton "Signature" sur `/app/devis/[id]` déjà présent
- Route `/signatures` déjà opérationnelle (retourne `[]`)
- À implémenter : créer enveloppe → envoyer → webhook → màj statut devis

### 3. Page `/app/programmes/new` (404 console)
- Créer page minimale ou désactiver le lien dans la sidebar

### 4. Vue agenda drag & drop séances

### 5. Guide démarrage rapide par métier

---

## 🔧 Règles critiques de déploiement

```powershell
# AVANT build frontend — depuis racine :
.\COPIER_TOUTES_PAGES_v2.ps1

# Depuis deploy/ :
docker compose build frontend --no-cache && docker compose up -d frontend && docker compose restart nginx
docker compose build api --no-cache && docker compose up -d api && docker compose restart nginx

# Lire fichiers [id] :
$f = Join-Path $base "xxx\[id]\page.tsx"
$c = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# Écrire TypeScript avec guillemets complexes → TOUJOURS via Python :
$py = @'...code python...'@
$py | Out-File "$env:TEMP\script.py" -Encoding utf8
python "$env:TEMP\script.py"
```

---

## 📊 Chiffres clés au 25/03/2026

| Métrique | Valeur |
|---|---|
| Pages UI compilées | 94 |
| Routes API custom | 43 (41 + 2 GED CAC) |
| Factures en BDD | 279 |
| Clients/tiers | 167 (140 géocodés sur carte) |
| Séances | 159 |
| Métiers actifs | 10 |
| Pages de documentation | 96 |

---

## 🔒 Backup propre
`C:\Backup\micro_logiciel\20260315_0002`  
⚠️ Backups à partir de `20260315_0042` = code corrompu — **ne pas utiliser**.

---

## 📁 Fichiers modifiés en S51

| Fichier | Modification |
|---|---|
| `src/app/app/clients/page.tsx` | Leaflet cdnjs + géocodage batch + dataLoading séparé |
| `src/app/app/factures/[id]/page.tsx` | `← Factures` |
| `src/app/app/inventaires/[id]/page.tsx` | `← Inventaires` |
| `src/app/app/factures/page.tsx` | `+ Nouvelle facture` + ⬇ CSV |
| `src/app/app/devis/page.tsx` | `+ Nouveau devis` |
| `src/app/app/animaux/page.tsx` | `+ Nouvel animal` |
| `src/app/app/achats/page.tsx` | `+ Nouvel achat` |
| `src/app/app/seances/page.tsx` | `+ Nouvelle séance` + ⬇ CSV |
| `api/src/custom-routes.ts` | Routes GED CAC evolution + score |
| `deploy/petsuite-docs/03-notice-utilisateur.html` | v4 |
| `deploy/petsuite-docs/07-audit-stack.html` | S51 |
| `deploy/petsuite-docs/47-changelog-S51.html` | Nouveau |

---

## 💡 Leçons techniques S51

1. **Leaflet + Next.js** : séparer `dataLoading` (bloque le rendu du div) de `geocoding` (arrière-plan). Ne jamais conditionner le rendu du `div ref` sur un état qui reste `true` pendant un traitement long.
2. **Fichiers `[id]` OneDrive** : `Get-Content` filtre les crochets. Toujours `[System.IO.File]::ReadAllText()`.
3. **TypeScript depuis PowerShell** : guillemets imbriqués → Python obligatoire.
4. **Tables BDD supposées** : vérifier via `information_schema` avant d'écrire du SQL. `suivi_cac` n'existe pas, c'est `seance_suivi_cac`. La vue `v_animal_evolution_cac` est disponible et prête à l'emploi.
5. **Audit DOM** : naviguer sur chaque page et lire le DOM est plus fiable que parser les JS compilés pour trouver les libellés.

---

## 🔄 Ajouts de fin de session S51 (après rédaction initiale)

### Routes API supplémentaires (total : 44)
- `GET /elevage/declarations` — déclarations DDPP/SCC/LOOF/ICAD (table `elevage_declaration`) ✅
- Colonnes : `DEC_ID`, `DEC_TYPE`, `DEC_DATE_EVENEMENT`, `DEC_ECHEANCE`, `DEC_DATE_ENVOI`, `DEC_STATUT`, `DEC_MONTANT`, `DEC_NUM_DOSSIER`
- Filtres disponibles : `?statut=A_FAIRE` et `?type=NAISSANCE_SCC` etc.
- Types ENUM : `SAILLIE_SCC`, `SAILLIE_LOOF`, `NAISSANCE_SCC`, `NAISSANCE_LOOF`, `PORTEE_SCC`, `PORTEE_LOOF`, `ICAD_IDENTIFICATION`, `ICAD_CESSION`, `CEC`, `AUTRE`
- Statuts ENUM : `A_FAIRE`, `ENVOYE`, `ACCUSE_RECEPTION`, `VALIDE`, `EN_RETARD`, `ANNULE`

### Page créée
- `/app/programmes/new` — formulaire complet (titre, objectif, animal, client, date début, nb semaines, statut)

### Audit 404 complet — résultat
Toutes les pages principales auditées : 0 erreur restante après les corrections S51.

---

## 🔄 Routes API supplémentaires découvertes en fin de S51

### Routes 404 identifiées pendant l'audit (à ajouter en S52)

Toutes les routes ci-dessous ont été insérées dans `custom-routes.ts` et sont en cours de rebuild API :

| Route | Page | Statut |
|---|---|---|
| `GET /devis/:id/lignes` | Fiche devis | ⏳ Rebuild API en cours |
| `GET /ged-edc?sea_id=` | EDC séance | ⏳ Rebuild API en cours |
| `GET /stats/kpis` | Statistiques | ⏳ Rebuild API en cours |
| `GET /stats/ca-par-mois` | Statistiques | ⏳ Rebuild API en cours |
| `GET /stats/seances-par-type` | Statistiques | ⏳ Rebuild API en cours |
| `GET /stats/especes` | Statistiques | ⏳ Rebuild API en cours |
| `GET /stats/especes-ca` | Statistiques | ⏳ Rebuild API en cours |
| `GET /stats/villes` | Statistiques | ⏳ Rebuild API en cours |
| `GET /stats/top-clients` | Statistiques | ⏳ Rebuild API en cours |
| `GET /stats/promenade-visite` | Statistiques | ⏳ Rebuild API en cours |

### Table edc_fiche — colonnes utilisées
`EDF_ID`, `SEA_ID`, `ANI_ID`, `EDF_DATE`, `EDF_STATUT`, `EDF_CAC_SNAPSHOT`, `EDF_OBSERVATIONS`

### Total routes API après S51 : ~54
(44 début S51 + 10 stats + devis/lignes + ged-edc = ~56 routes)

### Vérification post-build API à faire en S52
```powershell
foreach ($route in @('stats/kpis','stats/ca-par-mois','stats/seances-par-type','devis/1/lignes','ged-edc?sea_id=1')) {
    $r = Invoke-WebRequest -Uri "http://localhost/api/$route" -UseBasicParsing
    Write-Host "$route : $($r.StatusCode)"
}
```
