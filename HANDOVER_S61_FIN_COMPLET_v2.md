# Anim'Gest — Handover S61 FIN (complet)
> NoSage's Editor — Généré le 29/03/2026

---

## En-tête session

| Champ | Valeur |
|---|---|
| Date | 29/03/2026 |
| Sprint | S61 → passe à S62 |
| Auteur | Sessions Claude S61 (dev + docs) |
| Objectif | Widget Eliot IA + Portail Client BDD/spec + docs S61 |
| Statut | Terminé — 4 commits dev + 8 commits docs |

---

## Chemins & URLs

| Ressource | Valeur |
|---|---|
| App locale | http://localhost/app/ |
| API test | http://localhost/api/bilan |
| Docs GitHub | https://github.com/nicolashermilly/petsuite-docs |
| GitHub Pages | https://nicolashermilly.github.io/petsuite-docs/ |
| Frontend | D:\\OneDrive_Perso\\OneDrive\\Documents\\Micro_Logiciel\\Documentation\\Frontend\\micro_logiciel_frontend_nextjs |
| Deploy | ...\\micro_logiciel_frontend_nextjs\\deploy |
| API source | ...\\api\\src\\custom-routes.ts (~2800 lignes) |
| Docs local | C:\\AnimGest_Repo_Git\\petsuite-docs |
| Backup propre | C:\\AnimGest_Sav\\ (nightly) |
| Sauvegarde script | C:\\AnimGest_Sav\\Sauvegarde_micro_logiciel.ps1 (v7 corrigé — horodatage yyyy-MM-dd_HHmm) |
| BDD | 192.168.1.62:3307 — micro_logiciel |
| Scripts Python | $env:USERPROFILE\\Downloads\\ (jamais dans OneDrive) |
| BIB_Widget | ...\\micro_logiciel_frontend_nextjs\\BIB_Widget\\ (PNG originaux, ignoré Git) |

---

## 1. Ce qui a été accompli en S61

### API — custom-routes.ts
- **43 strings SQL multi-lignes fusionnées** — 3133 → 2875 lignes (parser caractériel Python)
- **12 corrections backtick/double-quote mélangés** (L1073, 1480, 1482, 1733, 1790, 1794, 1810, 1829, 1833, 2583, 2780, 2835)
- **Route `POST /ia/chat` injectée** — proxy Anthropic API côté serveur
  - `process.env.ANTHROPIC_API_KEY` — clé jamais exposée au client
  - System prompt métier Anim'Gest avec paramètre `metier`
  - Historique de conversation supporté via `history[]`
  - Modèle : `claude-sonnet-4-20250514`
- **Corrections TypeScript strict** — tous les callbacks typés `any`
- **Build API** — 0 erreur, container `micro_api` recréé

### Frontend — Widget Eliot IA
- **`ClaudeWidget.tsx` réécrit v2** — drag & drop fluide, panneau adaptatif, avatar temps réel
  - Drag fluide : snapshot position au `mouseDown` → delta calculé sur `mouseMove`
  - Panneau chat intelligent : `getPanelPos()` → s'ouvre vers le coin libre
  - Avatar temps réel : `setInterval(1000)` + `storage event` → pas de CTRL+SHIFT+R
  - Position initiale : coin bas-droit calculée dynamiquement
- **`layout.tsx`** — suppression `import dynamic` / `const ClaudeWidget` parasites (SSR fix)
- **`ClaudeWidgetWrapper.tsx`** — wrapper `"use client"` + `dynamic + ssr:false`
- **`StatusBadge`** — fix import named→default dans `formules/page.tsx`
- **Build frontend** — `Compiled successfully`, 0 erreur, 0 warning StatusBadge

### Frontend — BIB_Widget & Paramètres
- **307 Mo → 242 Ko** — 20 PNG originaux compressés en WebP 200x200px via Pillow
- **`public/bib_widget/`** — 20 avatars WebP (Poney_001 supprimé — hors format bulle)
- **`public/eliot-avatar.png`** — avatar par défaut (Eliot avec lunettes + bucket hat)
- **Page `/app/parametres/widget-ia`** — sélection avatar grille tuiles, coche ✓, aperçu, bouton valider → `localStorage.widget_avatar`
- **Tuile "🤖 Assistant IA"** ajoutée dans `/app/parametres`

### Variables d'environnement `deploy/.env`
```
ANTHROPIC_API_KEY=sk-ant-api03-...  ← clé réelle en place
NEXT_PUBLIC_WIDGET_IA_NOM=Eliot
```

### Test Eliot validé ✅
```json
{ "response": "Bonjour ! Oui, c'est bien moi, Eliot...", "model": "claude-sonnet-4-20250514" }
```

### BDD — Portail Client (tables créées en HeidiSQL)

| Table | Rôle |
|---|---|
| `portail_client_acces` | Token UUID + TIE_ID INT(11) + expiration |
| `portail_client_session` | Session token 24h + IP + User-Agent |
| `portail_client_notification` | Email/SMS — S63 |
| `portail_client_confirmation_seance` | CONFIRME/ANNULE/REPORTE |

### Git — Code source (micro_logiciel)

| Commit | Description |
|---|---|
| `95cc9c2` | S61a — Route /ia/chat + fix custom-routes 43 corrections SQL + SSR fix |
| `a6f7514` | S61b — Avatar Eliot + drag + 20 avatars WebP + page widget-ia |
| `a822cc8` | S61c — Widget v2 drag fluide + panneau adaptatif + avatar temps réel + fix StatusBadge |
| `12b0d9b` | S61d — Suppression Poney_001 + .gitignore *.bak* |

### Git — Docs (petsuite-docs)

| Commit | Description |
|---|---|
| `6d3ba1c` → `557a782` | Changelogs S52→S60 + index.html 105 pages + .gitignore |
| `c9acf70` → `0e8f6ee` | Portail Client spec v1 + MàJ S62 (16 routes, CAC, PDF) |
| `ec36021` | 07-audit-stack + 17-api-reference + 20-pilotage mis à jour S61 |
| `9957788` | Harmonisation charte 83 pages (navy/gold, Playfair+DM Sans, nav sticky) |
| `2e33a2a` | Dashboard Revue de Code fusionné + Launcher + Pilotage Qualité |
| `2ee2b66` | index.html — 3 nouvelles tuiles SAV |
| `821efd8` | 11 pages métier remodélées + BC 370 remplacements + SAV index refondu |
| `80ea7a4` | SAV_Analyseur_Dette_Technique.html + SAV_Regles_Metier.html |

### Outils SAV nouveaux S61
- `SAV_Analyseur_Dette_Technique.html` — 5 onglets : dashboard · catalogue · refactorisation · patterns · export
- `SAV_Regles_Metier.html` — 15 règles · exemples OK/NOK · matrice couverture · export
- `SAV_Dashboard_Revue_Code.html` — FUSION Qualité + Maintenance + Dette + Règles S54→S61
- `SAV_Pilotage_Qualite.html` — mis à jour 8 tuiles, checklist enrichie
- `SAV_Launcher.html` — flux SAV 6 étapes mis à jour

---

## 2. Score qualité S61

| Axe | Score |
|---|---|
| Backend | 82 / 100 |
| Frontend | 80 / 100 |
| BDD | 85 / 100 |
| Global | 82 / 100 |

> Routes API : 90+ (~2800 lignes) | Pages UI : 105 | JSDoc : 133/137 | Colonnes BDD : 241/241

Frimousse (ANI_ID=22, Malinois, Jean Dujardin) : PRESERVE

---

## 3. Bugs connus — à corriger en S62

| Bug | Module | Criticité | Fichier concerné | Action requise |
|---|---|---|---|---|
| Audit PDF → `window.open()` à remplacer par Modal | Editions | Haute | `src/app/app/editions/` | Remplacer tous les `window.open()` par Modal/Popup |
| Drag & Drop agenda non fonctionnel | Planning | Moyenne | `src/app/app/planning-seances/page.tsx` | Implémenter DnD (react-dnd ou @dnd-kit) |
| `devis_ligne` inexistante — `/api/devis/:id/lignes` retourne `[]` | Devis | Moyenne | `custom-routes.ts` route devis | Vérifier table `devis_contrat_ligne` et route |
| Export CSV règlements manquant | Règlements | Basse | `src/app/app/reglements/page.tsx` | Ajouter bouton export + route `/api/reglements/export-csv` |
| `/app/elevage/declarations` — page TSX manquante | Elevage | Basse | `src/app/app/elevage/declarations/page.tsx` | Créer page (route API déjà présente) |

---

## 4. Corrections techniques S62 — détail

### 4a. Portail Client — déploiement code (ROUGE)
**Fichiers disponibles dans Downloads** :
- `routes_portail_S61.ts` → 9 routes (auth + séances + admin)
- `routes_portail_S62.ts` → 7 routes (animaux + CAC + devis + factures + PDF)
- `portail_client_page_S62.tsx` → `/client/[token]/page.tsx` (4 onglets, modal CAC, modal PDF)
- `portail_admin_page.tsx` → `/app/parametres/portail/page.tsx`

**Séquence d'injection** :
```powershell
# 1. Injecter routes dans custom-routes.ts (script Python)
# 2. Rebuild API
# 3. Copier pages TSX
# 4. Rebuild Frontend
# 5. Test : POST /api/portail/auth/login
```

### 4b. Widget IA — accompli S61 ✅ / améliorations S62 (ORANGE)
**Accompli S61 ✅** :
- Drag & drop fluide (snapshot mouseDown + delta mouseMove)
- Panneau chat adaptatif `getPanelPos()` — s'ouvre vers le coin libre
- Avatar temps réel via `setInterval(1000)` + `storage event`
- Position initiale bas-droit dynamique
- 20 avatars WebP sélectionnables via `/app/parametres/widget-ia`
- Animal3D **remplacé définitivement** par avatars PNG BIB_Widget

**Restant S62** :
- Lien dans Sidebar vers `/app/parametres/widget-ia`
- Nom Eliot configurable via interface (actuellement `.env` uniquement)
- Vocal — intégration Web Speech API en production (POC validé S61)
- Position persistée en `localStorage` au rechargement

### 4c. Outil SAV Générateur Handover — mise à jour (JAUNE)
**Problème constaté S61** : le générateur produit un handover basé sur S60 sans mise à jour automatique des données S61.
**Action** : alimenter manuellement le générateur avec les métriques S61 avant génération, ou améliorer le pré-remplissage automatique dans l'outil.

---

## 5. Livrables dev à déployer en S62

| # | Fichier | Destination | Statut |
|---|---|---|---|
| 1 | `portail_client_tables_v2.sql` | BDD HeidiSQL | ✅ exécuté |
| 2 | `routes_portail_S61.ts` | → injecter dans custom-routes.ts | ⏳ |
| 3 | `routes_portail_S62.ts` | → injecter après S61 | ⏳ |
| 4 | `portail_client_page_S62.tsx` | → `src/app/client/[token]/page.tsx` | ⏳ |
| 5 | `portail_admin_page.tsx` | → `src/app/app/parametres/portail/page.tsx` | ⏳ |
| 6 | Rebuild API → Rebuild Frontend | | ⏳ |
| 7 | Test `GET /api/portail/animaux` · `GET /api/portail/factures/1/pdf` | | ⏳ |

---

## 6. Roadmap S62

### ROUGE — Portail Client déploiement (en premier)
- Injecter `routes_portail_S61.ts` + `routes_portail_S62.ts` dans custom-routes.ts
- Déployer `portail_client_page_S62.tsx` → `/client/[token]/page.tsx`
- Déployer `portail_admin_page.tsx` → `/app/parametres/portail/page.tsx`
- Rebuild API + Frontend
- Test `POST /api/portail/auth/login` avec token BDD

### ORANGE — Priorité haute
- Widget IA : lien Sidebar + nom configurable + position persistée + vocal
- Suivi CAC/BC depuis fiche séance `/app/seances/[id]`
- Suivi CAC/BC depuis BC `/app/seances/[id]/etude-comportementale`
- Déplacer routes dans `api/src/routes/` — commencer par `factures.ts`
- Services frontend `src/services/`
- Supprimer code mort

### JAUNE — Backlog
- `/app/elevage/declarations` — page TSX manquante (route API présente)
- `devis_ligne` — vérifier table + corriger route
- Export CSV règlements — bouton + route
- Drag & Drop agenda — `/app/planning-seances`
- Purge dossiers frontend (`node_modules`, `.next`, fichiers `.bak_*`)
- Vocal Eliot — intégration Web Speech API production

### VERT — Modules futurs
- S62-S63 : Portail Client notifications email/SMS + Stripe
- S62 : Carte Identité Animale — page publique liée à la puce
- S70+ : Module IA option commerciale — algorithme licence

---

## 7. Tables BDD utiles

- `facture` : FAC_ID, FAC_NUM, FAC_DATE, TIE_ID, FAC_TOTAL_TTC, FAC_STATUT
- `devis_contrat_entete` : DCE_ID, DCE_NUMERO, DCE_STATUT(BROUILLON/ENVOYE/ACCEPTE/REFUSE/ANNULE/FACTURE)
- `portail_client_acces` : PCT_ID, TIE_ID INT(11), PCT_TOKEN UUID, PCT_ACTIF, PCT_EXPIRATION
- `portail_client_session` : PCS_ID, PCT_ID, PCS_TOKEN, PCS_IP, PCS_USER_AGENT, PCS_EXPIRE
- `portail_client_notification` : PCN_ID, PCT_ID, PCN_TYPE, PCN_STATUT (S63)
- `portail_client_confirmation_seance` : PCC_ID, PCT_ID, SEA_ID, PCC_STATUT

---

## 8. Règles critiques

```
PDF/Editions  : Modal uniquement — jamais window.open()
CAC/BC        : UNIQUEMENT depuis /app/seances/[id] — pas de lien sidebar
Terminologie  : BC Bilan Comportemental — plus jamais EDC
custom-routes : app.use() uniquement, getDb(), 0 createConnection (~2800 lignes)
TSX           : "use client" ligne 1, apostrophes ASCII, scripts Python Downloads
Docker        : cd deploy OBLIGATOIRE, COPIER_TOUTES_PAGES_v2.ps1 avant build frontend
API rebuild   : build --no-cache → up -d → restart nginx
Scripts Python : $env:USERPROFILE\\Downloads\\ (jamais dans OneDrive)
SQL TypeScript : jamais de guillemets simples dans string TS déjà délimitée
Three.js      : @react-three/fiber supprimé S61 — remplacé par avatars PNG BIB_Widget
SSR Next.js   : dynamic+ssr:false interdit Server Components — wrapper "use client"
Module IA     : option commerciale — aucun algorithme de licence (à faire S70+)
ANTHROPIC_KEY : dans deploy/.env uniquement — jamais côté client
Portail       : sessionStorage uniquement — jamais localStorage
BDD FK        : tiers.TIE_ID=INT(11) signé, seance.SEA_ID=BIGINT(20) signé
Git docs      : git pull --rebase OBLIGATOIRE avant push petsuite-docs
Sauvegarde    : horodatage yyyy-MM-dd_HHmm — plusieurs sauvegardes/jour possibles
build docker  : sans --no-cache si le cache builder a été purgé (évite les blocages)
```

---

## 9. Commandes de redémarrage S62

```powershell
docker ps
Invoke-RestMethod "http://localhost/api/bilan"

# Rebuild API
cd "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs\deploy"
docker compose build api --no-cache
docker compose up -d api
docker compose restart nginx

# Rebuild Frontend (sans --no-cache si blocage)
cd "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
.\COPIER_TOUTES_PAGES_v2.ps1
cd deploy
docker compose build frontend
docker compose up -d frontend
docker compose restart nginx

# Test Eliot
# POST http://localhost/api/ia/chat  {"message":"Bonjour","metier":"comportementaliste"}

# Test Portail (après déploiement)
# POST http://localhost/api/portail/auth/login  {"token":"<token_bdd>"}

# Sauvegarde manuelle
PowerShell -ExecutionPolicy Bypass -File "C:\AnimGest_Sav\Sauvegarde_micro_logiciel.ps1"
```

---

## 10. Prompt de démarrage S62

```
Reprendre handover S61 FIN complet.
Lire section 5 (livrables) + section 4 (corrections détail) + section 6 (roadmap).
Commencer par ROUGE : Portail Client déploiement.
Fichiers dans Downloads : routes_portail_S61.ts, routes_portail_S62.ts,
  portail_client_page_S62.tsx, portail_admin_page.tsx
Séquence : inject routes API (script Python) → rebuild API → deploy pages → rebuild frontend → test.
Puis ORANGE : Widget IA améliorations (Sidebar + nom + vocal + position persistée).
Terminologie : BC Bilan Comportemental (plus jamais EDC).
Portail : sessionStorage uniquement, jamais localStorage.
Ne jamais patcher — intégrer proprement dans l'architecture.
Scripts Python dans $env:USERPROFILE\Downloads\ uniquement.
Pages HTML docs GitHub traitées dans une conversation séparée.
build frontend : utiliser docker compose build frontend (sans --no-cache) si blocage.
```

---
*Anim'Gest — NoSage's Editor — Handover S61 FIN complet — 29/03/2026*
