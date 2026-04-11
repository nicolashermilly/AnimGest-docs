# PetSuite — Handover S49
> Généré le 24 mars 2026 — Fin de session S45→S49

---

## 🔗 URLs & Chemins essentiels

### Application
- **App locale** : http://localhost/app/
- **Formulaire public** : http://localhost/formulaire/c57134a64ffaf3bb6ed0a928dcfc063a
- **Docs GitHub Pages** : https://nicolashermilly.github.io/petsuite-docs/
- **Repo docs** : https://github.com/nicolashermilly/petsuite-docs

### Chemins Windows
```
Root frontend    : D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs\
Deploy           : ...\micro_logiciel_frontend_nextjs\deploy\
API source       : ...\micro_logiciel_frontend_nextjs\api\src\custom-routes.ts
Pages src        : ...\micro_logiciel_frontend_nextjs\src\app\app\
Docs Git         : ...\micro_logiciel_frontend_nextjs\deploy\petsuite-docs\
Downloads        : C:\Users\AdminPC\Downloads\
Backup custom-routes propre : G:\Sauvegarde_micro_logiciel\custom-routes-s47-propre.ts
BDD backup       : G:\Sauvegarde_micro_logiciel\BDD\micro_logiciel_2026-03-23.sql
```

### BDD MariaDB
```
Host     : 192.168.1.62:3307
User     : @lgorithme
Password : @lgoritHme+2025+977_73300
Bases    : micro_logiciel  |  micro_logiciel_ged
```

---

## 🐳 Commandes Docker essentielles

```powershell
# Toujours depuis le dossier deploy !
cd "D:\...\micro_logiciel_frontend_nextjs\deploy"

# Rebuild API (après modif custom-routes.ts)
docker compose build api --no-cache
docker compose up -d api
docker compose restart nginx

# Rebuild Frontend (après modif pages .tsx)
cd "D:\...\micro_logiciel_frontend_nextjs"
.\COPIER_TOUTES_PAGES_v2.ps1
cd deploy
docker compose build frontend --no-cache
docker compose up -d frontend
docker compose restart nginx

# Status / Logs
docker compose ps
docker compose logs api --tail=30
```

### ⚠️ Règles critiques Docker
- **JAMAIS** `docker compose restart api` — pas de rebuild, ancienne image
- **TOUJOURS** `build ... --no-cache` puis `up -d`
- Erreur `files.zip` dans COPIER_TOUTES_PAGES : inoffensive (OneDrive)
- PowerShell 5 : pas de `&&` dans les scripts .ps1
- Routes orphelines hors `registerCustomRoutes` → erreur TS2304 `app` not found

---

## 📊 État des routes API au 24/03/2026

### ✅ 38 routes opérationnelles (après rebuild_s49)
| Groupe | Routes |
|---|---|
| Core | /bilan, /inventaires, /achats, /seances, /factures, /animaux, /tiers, /devis, /reglements, /races |
| Élevage | /elevage/geniteurs, /genealogie, /reservations, /reglements, /alertes, /portees, /saillies, /gestations, /stats-viabilite, /mortalite |
| CRM | /leads, /crm/leads, /crm/stats |
| Réseaux | /reseaux-sociaux/comptes, /reseaux-sociaux/publications |
| Séances | /seances/edc, /seances/types/:id |
| Paramètres | /parametres/editions, /pa, /modules, /formulaire-lead, /metier, /sms, /smtp |
| Nouvelles S48 | /signatures, /agenda, /planning-seances |
| Aide | /aide/contexte (7 pages : general, clients, factures, seances/edc, elevage, crm/leads, reseaux-sociaux) |
| Divers | /categories, /tva, /plan-comptable, /programmes, /questionnaires, /dashboard/stats |

### ⚠️ Rebuild API S49 requis
Le `custom-routes-final.ts` corrigé (routes signatures/agenda/planning dans le scope) est prêt dans Downloads.
```powershell
Copy-Item "C:\Users\AdminPC\Downloads\custom-routes-final.ts" "...\api\src\custom-routes.ts" -Force
cd "...\deploy"
docker compose build api --no-cache
docker compose up -d api
docker compose restart nginx
```

### 🔴 Routes encore à créer
- `/api/stats` — vérifier si doublon de `/api/dashboard/stats`

---

## 📄 État du frontend — 94 pages compilées

### Pages déployées (S46-S49)
- `/app/seances/edc` ✅
- `/app/elevage/geniteurs` ✅ `/genealogie` ✅ `/reservations` ✅ `/reglements` ✅
- `/app/crm/leads` ✅
- `/app/reseaux-sociaux` ✅
- `/app/signatures` ✅ (v2 avec alerte Yousign non configuré)
- `/app/planning-seances` ✅ (v2 vue calendrier semaine + liste)
- `/app/mes-parametres/paiements` ✅ (bouton Retour + masquage SK)

---

## 🗃️ État BDD — Commentaires au 24/03/2026

### Scripts exécutés avec succès
| Script | Tables couvertes | Status |
|---|---|---|
| migration_comments_bdd.sql | ville, condition_paiement, tiers, contact, race, animal, facture, facture_ligne, seance, reglement, crm_lead | ✅ |
| migration_comments_elevage_all.sql | elevage_portee, elevage_gestation, elevage_reservation | ✅ |
| migration_comments_params_crm.sql | param_editions, param_pa, param_formulaire_lead, crm_source, crm_lead_statut, seance_type, seance_statut, utilisateur, role, tva_taux, article_prestation | ✅ |
| migration_comments_corrections.sql | inventaire (partiel), param_reseaux_sociaux (TikTok/YouTube/X) | ✅ |
| migration_statut_reservation.sql | Normalisation RES_STATUT (attente→EN_ATTENTE, confirme→CONFIRME) | ✅ |
| migration_comments_remaining.sql | 39 tables restantes (compteurs, achat_avoir, audit_*, com_*, etc.) | ✅ |
| migration_comments_final.sql | ~60 tables : edc_fiche, seance_suivi_cac, questionnaire, param_entreprise, vocal_*, stripe_*, signature_*, inventaire_entete, lead_formulaire_*, etc. | ✅ |

### ⚠️ Non couvert (vues + tables mineures)
Les vues (`v_*`) ne peuvent pas recevoir de commentaires via ALTER TABLE.
Tables à surveiller : `achat_entete` (100% déjà commenté), colonnes residuelles avec 1-2 champs manquants.

---

## 🚀 Priorités S50

### 1. Rebuild API (routes orphelines corrigées)
```powershell
Copy-Item "C:\Users\AdminPC\Downloads\custom-routes-final.ts" "...\api\src\custom-routes.ts" -Force
# puis rebuild API classique
```

### 2. Charte graphique — corrections (voir audit_charte_s49.md)
- Supprimer doublon AideContextuelle (2 boutons `?` superposés sur /app/clients)
- Ajouter `btn-danger` dans globals.css
- Corriger boutons A-/A+ (`text-slate-*` → `text-muted`)
- Uniformiser libellés boutons Retour

### 3. Docs HTML petsuite-docs — mise à jour charte
- Pousser `46-changelog-S48.html` sur GitHub Pages
- Mettre à jour index : 87 docs, sprint S49
- Uniformiser la charte des anciens changelogs

### 4. Pages à développer S50
- Vue agenda améliorée (drag & drop séances)
- Export CSV/Excel factures et séances
- Page EDC — améliorer la fiche comportementale

---

## 🗺️ Roadmap S50-S52

### S50 — Qualité & Agenda
- [ ] Fix doublon AideContextuelle
- [ ] btn-danger dans globals.css
- [ ] Rebuild API (routes orphelines)
- [ ] Changelog S48 sur GitHub Pages
- [ ] Vue agenda drag & drop

### S51 — Signatures Yousign
- [ ] Intégration Yousign end-to-end
- [ ] Signature depuis fiche devis
- [ ] Suivi statut webhook en temps réel

### S52 — Notice & Documentation
- [ ] Notice utilisateur v4 (modules S45-S49)
- [ ] Guide démarrage rapide par métier

---

## 🔧 Architecture technique

### Stack
```
Frontend  : Next.js 15.5 App Router, TypeScript, Tailwind
API       : NestJS compilé, Node 20, mysql2/promise (PAS TypeORM)
BDD       : MariaDB 192.168.1.62:3307 — micro_logiciel + micro_logiciel_ged
Proxy     : nginx:1.27-alpine
Orches.   : Docker Compose
```

### Règles custom-routes.ts (CRITIQUES)
```typescript
// 1. Toujours dans le scope de registerCustomRoutes(app)
// 2. Utiliser app.use() — pas instance.use() pour les nouvelles routes
// 3. Pas de backtick dans les strings SQL
// 4. Nginx strip /api/ → routes sans /api/
// 5. DbService inaccessible → toujours mysql2/promise direct
// 6. LED_DATE_CREATION, SEA_CREE_LE etc → pas de DEFAULT en BDD → toujours NOW() explicite
```

### Règles frontend
```typescript
"use client"; // TOUJOURS première ligne
import { api } from "@/lib/api"; // named export, jamais default
// PDF -> toujours Modal/Popup, jamais nouvelle page
// Pas d'apostrophes françaises dans les strings TypeScript
```

---

## 💡 Leçons apprises cette session (S49)

1. **Routes orphelines** : les routes ajoutées après le `}` final de `registerCustomRoutes` → erreur TS2304 `app` not found. Toujours vérifier que les routes sont DANS le scope.
2. **ENUM en BDD** : modifier un ENUM avec des données existantes hors de l'ENUM → erreur 1265 Data truncated. Solution : passer en VARCHAR temporairement, migrer les données, remettre l'ENUM.
3. **Colonnes supposées vs réelles** : les noms de colonnes supposés depuis les scripts SQL ne correspondent pas toujours à la BDD en prod. Toujours vérifier via l'API ou SHOW COLUMNS.
4. **Table `achat`** : la table `achat` n'existe pas — c'est `achat_entete` (déjà 100% commentée).
5. **151 tables** en BDD — les scripts de commentaires couvrent les tables avec données. Les compteurs (`avo_compteur_mois` etc.) sont des tables techniques 2 colonnes.

---

## 🎯 Chiffres clés au 24/03/2026

| Métrique | Valeur |
|---|---|
| Pages frontend compilées | 94 |
| Routes API opérationnelles | 38 (après rebuild S49) |
| Tables BDD commentées | ~90/151 (60%+) |
| Leads en BDD | 13 |
| Séances en BDD | 158 |
| Factures en BDD | 279 |
| Publications RS en BDD | 4 |
| Documents GitHub Pages | 86 |
| Sprint actuel | S49 |
