# HANDOVER S76 — FIN COMPLET (Conv1 + Conv2)
**Date :** 10/04/2026  
**Sprint :** S76  
**Statut :** Terminé — builds validés, recettage documenté

---

## 1. Vérification stack au démarrage S77

```powershell
$root   = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
$deploy = "$root\deploy"
Set-Location $deploy
docker compose ps
Invoke-RestMethod "http://localhost/api/bilan"
Invoke-RestMethod "http://localhost/api/debug-pdf/1"
# Attendu : {"url":"/","originalUrl":"/debug-pdf/1",...}
```

---

## 2. Ce qui a été livré en S76

### Conv1 — Items ORANGE (tous soldés)
| Item | Statut |
|---|---|
| Listes devis : DCE_NUMERO cliquable | ✅ |
| Listes factures : FAC_NUM cliquable | ✅ |
| Page avoirs : crash fix AVO_→AVC_ | ✅ |
| Règlements : FAC_NUM déjà correct | ✅ |
| Modal PDF BL : Puppeteer + GED disque | ✅ route /pdf/bon-livraison/:id |
| Modal PDF BR : Puppeteer + GED | ✅ route /pdf/bon-retour/:id |
| Modal PDF DAF : Puppeteer + GED | ✅ route /pdf/demande-avoir-fourn/:id |
| Fusion CGV factures : GED disque | ✅ |
| Edition PDF inventaire : route + bouton + modal | ✅ route /pdf/inventaire/:id |

### Conv2 — Items JAUNE (tous soldés)
| Item | Statut |
|---|---|
| KPI inventaires : filtre VALIDE sans lignes | ✅ |
| Page /app/seances/new-bc créée | ✅ |
| GET /seances/types + /seances/statuts (R-26) | ✅ |
| Docs api-reference groupe 15 | ✅ commit 55c708d |

### Migration GED filesystem
- `C:\AnimGest_GED\SCT_001\General\` : logo.svg, filigrane.png, cgv.pdf, animaux/22.jpg ✅
- `C:\AnimGest_GED\SCT_001\Widget\bib_widget\` : 20 fichiers .webp ✅
- Colonnes BDD _BASE64 vidées ✅
- Routes upload/serve logo, filigrane, CGV via disque ✅

### Charte graphique
- Audit 12 pages S76 : 0 couleur hardcodée ✅
- Badges avoirs EMIS/VALIDE → var(--color-primaire) / var(--color-success) ✅
- CSS input:disabled → var(--text-primary) / var(--surface-card) ✅

---

## 3. Architecture routes PDF (NOUVEAU en S76)

**Règle R-39 mise à jour :** Les routes PDF sont sous `/pdf/` (pas `/editions/`)

```
GET /api/pdf/bon-livraison/:id        → PDF Puppeteer + saveGedPdf
GET /api/pdf/bon-retour/:id           → PDF Puppeteer + saveGedPdf
GET /api/pdf/demande-avoir-fourn/:id  → PDF Puppeteer + saveGedPdf
GET /api/pdf/avoir-client/:id         → PDF Puppeteer + saveGedPdf
GET /api/pdf/inventaire/:id           → PDF Puppeteer + saveGedPdf (A4 paysage)
GET /api/pdf/logo                     → JSON {base64, uri}
GET /api/pdf/filigrane                → JSON {base64, uri}
GET /api/pdf/cgv/preview              → PDF inline
GET /api/debug-pdf/:id                → JSON debug (à supprimer en S77)

GET /api/editions/devis/:id           → PDF via EditionsController NestJS
GET /api/editions/facture/:id         → PDF via EditionsController NestJS + CGV fusionné
```

**Pourquoi /pdf/ et pas /editions/ :**  
L'EditionsController NestJS intercepte tout sous `/editions/`. Les routes custom-routes.ts doivent utiliser un préfixe non géré par NestJS.

**Fix req.url (critique) :**  
Dans `instance.use('/pdf/X/:id', handler)`, `req.url = "/"` (Express strip le préfixe).  
Utiliser `req.originalUrl` → `_parts[_parts.length - 1]` pour extraire l'id.

---

## 4. Métriques S76

| Indicateur | Valeur |
|---|---|
| Pages UI | 117 |
| Routes API | ~195+ |
| Eliot tools | 22 |
| Erreurs build API | 0 |
| Erreurs build Frontend | 0 |
| Couleurs hardcodées pages S76 | 0 |

---

## 5. Backlog S77 — Recettage complet

### 🔴 ROUGE — Bloquants priorité absolue

| # | Problème | Page/Route |
|---|---|---|
| R1 | **PDF Puppeteer 502** : BL/BR/DAF/INV/AC retournent 502. req.originalUrl est OK (debug-pdf prouvé). Cause probable : BL_ID=1 absent BDD ou timeout Chromium. Tester avec ID valide + vérifier table bon_livraison | `/api/pdf/*` |
| R2 | **GED logo/filigrane/CGV perdus dans PDF** : devis et factures ne montrent plus le logo, le filigrane, ni les CGV. Revoir `getGedLogo()` et la fusion CGV dans les routes EditionsController | `/api/editions/devis`, `/api/editions/facture` |
| R3 | **Drag & drop Agenda cassé** : impossible de déplacer les créneaux réservés | `/app/agenda` |
| R4 | **Règlements achats non fonctionnel** (bug signalé depuis S74) | `/app/achats/reglements` |

### 🟠 ORANGE — Importants

| # | Problème | Page |
|---|---|---|
| O1 | Dashboard comportementaliste : séances affichent "Undefined" → traduire en français | `/app/comportementaliste/dashboard` |
| O2 | Sidebar : 2 items actifs simultanément (Bilans comportementaux + Séances de suivi) | Sidebar composant |
| O3 | Formules/abonnements comportementaliste : impossible de créer depuis l'écran | `/app/formules` |
| O4 | Devis template comportementaliste : "EDC" → "BC (Bilan Comportemental)" | `/app/devis/templates` |
| O5 | Fiche client — modal portail fond transparent → fond opaque obligatoire | `/app/clients/[id]` |
| O6 | Coefficients tarifaires devis : bouton "Appliquer tarif" non fonctionnel | `/app/devis/[id]` |
| O7 | **Registre sanitaire** : charte visuelle différente de Registre carnivores. Refaire sur le modèle carnivores (KPIs, filtres, bouton charte dynamique). Concerne pension/chenil, pet-sitter, élevage | `/app/pension/registre`, `/app/pet-sitter/registre`, `/app/elevage/registre-carnivores` |
| O8 | **Sport canin cours collectif vs individuel** : pas de différence visible entre les 2 écrans. À vérifier + corriger la distinction. Doit aussi remonter dans le métier comportementaliste | `/app/sport-canin/dashboard` |

### 🟡 JAUNE — Améliorations

| # | Problème |
|---|---|
| J1 | Listes devis/factures/avoirs/règlements : champ **client** cliquable → fiche client ; champ **animal** cliquable → fiche animal |
| J2 | Module achats/stock : champ **fournisseur** cliquable sur toutes les listes (BL, BR, commandes, DAF) |
| J3 | Facturation électronique : factures et clients cliquables |
| J4 | Charte graphique module achats/stock : uniformiser sur le modèle BL/BR (déjà conforme) |
| J5 | GED sidebar : arborescence dossiers absente, doit afficher `C:\AnimGest_GED\SCT_001\` |
| J6 | **i18n** : toute l'application en français par défaut. Option EN/ES/DE dans les paramètres. Zéro texte anglais natif (ex. "Undefined") |
| J7 | Topbar : 2 couleurs hardcodées (#1E293B, #94A3B8) → sprint charte dédié |
| J8 | Supprimer route `/api/debug-pdf/:id` (temporaire, ne pas laisser en prod) |
| J9 | Toute édition PDF (devis, facture, AC, BL, BR, DAF, facture fournisseur) doit être sauvegardée en GED avec horodatage |

---

## 6. Règles critiques (rappel S77)

```
R-39 mis à jour : Modal PDF = <iframe src="/api/pdf/[type]/[id]"> (préfixe /pdf/, pas /editions/)
R-26 : Routes spécifiques AVANT routes paramétriques
R-25 : Thème clair CSS = html.light .ma-classe
Charte dynamique NON-NÉGOCIABLE : var(--color-primaire) etc. — jamais hex hardcodé
GED NON-NÉGOCIABLE : C:\AnimGest_GED\SCT_001\ disque uniquement
req.originalUrl pour extraire l'id dans instance.use('/pdf/X/:id', ...)
cd deploy OBLIGATOIRE avant docker compose
COPIER_TOUTES_PAGES_v2.ps1 AVANT build frontend
```

---

## 7. Séquence rebuild S77

```powershell
# API
docker compose build api --no-cache
docker compose up -d --force-recreate api
docker compose restart nginx

# Frontend
Set-Location $root
.\COPIER_TOUTES_PAGES_v2.ps1
Set-Location deploy
docker compose build frontend --no-cache
docker compose up -d frontend
docker compose restart nginx
```

---

*Anim'Gest — NoSage's Editor — Handover S76 Complet — 10/04/2026*
