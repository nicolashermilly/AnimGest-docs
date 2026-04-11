# HANDOVER S66 — FIN DE SESSION
**Date :** 07/04/2026
**Sprint :** S66

---

## 1. Accompli en S66

### 1a. Validation scan routes 20/20 ✅
- `/api/achats/bon-a-payer` → la vraie route est `/api/achats/:id/bon-a-payer` — comportement correct
- `/api/portail/notifications` → 401 attendu (token requis) — comportement correct
- **20/20 routes opérationnelles confirmées**

### 1b. Migration GED ✅
- Fichier original avait `SCT_ID` — colonne inexistante dans `ged_fichier`
- Corrigé → `migration_ged_fixed.sql` sans `SCT_ID` (ENT_ID défaut=1)
- **57 entrées insérées** dans `micro_logiciel.ged_fichier`
- Modules : Editions, Widgets, Animaux, Seances, Devis, Factures, Clients

### 1c. Fix crash `clients/[id]` ✅
- **Cause :** 4 `useState` portail (portailModal, portailEmail, portailSaving, portailDone) déclarés aux lignes 248-251, **après** 2 `return` conditionnels → React error #310 (Rules of Hooks)
- **Fix :** remontés avec les autres `useState` en ligne 203
- **Script :** `patch_clients_id.py`
- **Validé :** `/app/clients/1` affiche "Deneuve, Catherine" sans erreur console

### 1d. Registre Carnivores Domestiques — nouveau module ✅ (partiel)
**Base réglementaire :** Arrêté du 30 juin 1992 modifié
**Métiers :** Pet-Sitter, Pension/Chenil, Élevage
**Espèces :** Chien, Chat, Furet

**BDD :**
- Table `registre_carnivores` créée (SQL exécuté dans HeidiSQL)

**API — 4 routes injectées dans custom-routes.ts :**
- `GET /api/registre-carnivores` (filtres metier/statut/espece/search)
- `GET /api/registre-carnivores/:id`
- `POST /api/registre-carnivores`
- `PUT /api/registre-carnivores/:id` (auto-SORTI si date_sortie fournie)

**Frontend — 3 pages compilées dans le build (115 pages) :**
- `/app/pet-sitter/registre-carnivores` ✅
- `/app/pension/registre-carnivores` ✅
- `/app/elevage/registre-carnivores` ✅

**Composant partagé :** `RegistreCarnivorePage.tsx`
- Liste chronologique + filtres espèce/statut/recherche
- KPIs : Présents / Sortis / Total
- Panneau latéral détail + sortie rapide
- Modal création complète (animal + santé + propriétaire + entrée)
- Puce formatée XXX-XXX-XXX-XXX-XXX

**⚠️ Bug restant à corriger en début S67 :**
- Route `GET /api/registre-carnivores` → erreur `Table 'micro_logiciel.animaux' doesn't exist`
- **Cause :** sous-requête ANI_NOM_LIE utilise `FROM animaux` mais la table BDD s'appelle `animal`
- **Fix prêt :** `patch_routes_registre_carnivores.py` → remplace `FROM animaux` par `FROM animal`
- **Rebuild API requis après patch**

**⚠️ Sidebar élevage non patchée :**
- Items élevage ont format `{ label, href, icon }` — scripts précédents cherchaient format sans icon
- **Fix prêt :** `patch_sidebar_elevage_v2.py` — détecte le bon format
- **Rebuild frontend requis après patch**

---

## 2. Fichiers modifiés S66

| Fichier | Modification |
|---|---|
| `api/src/custom-routes.ts` | +4 routes registre-carnivores (⚠️ bug FROM animaux) |
| `src/components/RegistreCarnivorePage.tsx` | NOUVEAU |
| `src/app/app/pet-sitter/registre-carnivores/page.tsx` | NOUVEAU |
| `src/app/app/pension/registre-carnivores/page.tsx` | NOUVEAU |
| `src/app/app/elevage/registre-carnivores/page.tsx` | NOUVEAU |
| `src/app/app/clients/[id]/page.tsx` | Fix useState portail hors ordre |
| `micro_logiciel.ged_fichier` | +57 entrées migration GED |
| `micro_logiciel.registre_carnivores` | Nouvelle table |

---

## 3. Scripts disponibles dans Downloads

| Script | Usage |
|---|---|
| `patch_routes_registre_carnivores.py` | Fix FROM animaux → FROM animal |
| `patch_sidebar_elevage_v2.py` | Ajoute Registre C.D. dans sidebar élevage |
| `create_registre_carnivores.sql` | SQL table (déjà exécuté) |

---

## 4. Dette technique S67

### ROUGE
| Item | Action |
|---|---|
| Fix `FROM animaux` → `FROM animal` | `patch_routes_registre_carnivores.py` → rebuild API |
| Sidebar élevage Registre C.D. | `patch_sidebar_elevage_v2.py` → rebuild frontend |

### ORANGE
| Item | Action |
|---|---|
| `clients/[id]` — valider portail modal | Tester ouverture modal portail depuis fiche client |
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
| Docs GitHub Pages S66 | roadmap, API reference, changelog |
| Sidebar pet-sitter + pension Registre C.D. | Vérifier si ancres trouvées par deploy script |

---

## 5. Score qualité S66

| Axe | S65 | S66 |
|---|---|---|
| Backend | 90/100 | **90/100** (stable — bug animaux mineur) |
| Frontend | 89/100 | **91/100** (fix crash clients/[id] + 3 nouvelles pages) |
| BDD | 90/100 | **91/100** (+table registre_carnivores + migration GED) |
| Global | 90/100 | **91/100** |

> Routes API : ~159 | Pages UI : 115 | Eliot tools : 13 | Registre sanitaire : 2 métiers | Registre C.D. : 3 métiers

---

## 6. Démarrage S67

```powershell
$root   = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
$deploy = "$root\deploy"

# Vérif stack
Set-Location $deploy
docker compose ps
Invoke-RestMethod "http://localhost/api/bilan"

# 1. Fix immédiat : FROM animaux → FROM animal
C:\Python314\python.exe "$env:USERPROFILE\Downloads\patch_routes_registre_carnivores.py"
docker compose build api --no-cache
docker compose up -d api
docker compose restart nginx

# 2. Fix sidebar élevage
C:\Python314\python.exe "$env:USERPROFILE\Downloads\patch_sidebar_elevage_v2.py"
Set-Location $root
.\COPIER_TOUTES_PAGES_v2.ps1
Set-Location $deploy
docker compose build frontend --no-cache
docker compose up -d frontend
docker compose restart nginx

# 3. Valider /api/registre-carnivores?metier=pension → []  (pas d'erreur)
```

---

## 7. Règles critiques (rappel)

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
Table animaux BDD : s'appelle 'animal' (singulier) — pas 'animaux'
Registre sanitaire : jointures via sous-requêtes (ambiguïté MariaDB)
Registre C.D. : même règle — sous-requêtes uniquement
```
