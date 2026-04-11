# PetSuite — Handover S50
> Généré le 24 mars 2026 — Fin de session S50

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
Composants       : ...\micro_logiciel_frontend_nextjs\src\components\
Docs Git         : ...\micro_logiciel_frontend_nextjs\deploy\petsuite-docs\
Downloads        : C:\Users\AdminPC\Downloads\
Backup propre    : G:\Sauvegarde_micro_logiciel\custom-routes-s47-propre.ts
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
# TOUJOURS depuis le dossier deploy !
cd "D:\...\micro_logiciel_frontend_nextjs\deploy"

# Rebuild API
docker compose build api --no-cache
docker compose up -d api
docker compose restart nginx

# Rebuild Frontend
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
- **TOUJOURS** `docker compose restart nginx` après rebuild frontend (sinon 502)
- Erreur `files.zip` dans COPIER_TOUTES_PAGES : inoffensive (OneDrive)
- PowerShell 5 : pas de `&&` dans les scripts .ps1

---

## ✅ Livraisons S50

### API
- **Routes orphelines corrigées** : `/signatures`, `/agenda`, `/planning-seances` désormais dans le scope `registerCustomRoutes` → 200 ✅
- **`/api/stats`** : confirmé inutile — doublon de `/api/dashboard/stats` qui répond 200. Ne pas créer.

### Frontend — corrections charte graphique
- **Doublon AideContextuelle supprimé** : 5 fichiers nettoyés (animaux, clients, elevage, factures, seances)
- **btn-danger ajouté** dans `globals.css`
- **text-slate-* corrigé** → `text-[var(--muted)]` dans `compta-fec/page.tsx`
- **Boutons Liste/Tuiles/Carte** : à compléter manuellement (34 fichiers concernés, trop risqué en masse)
- **"Déconnexion"** corrigé dans `Topbar.tsx` (accent manquant)
- **Titres A- / A+** : `title="Réduire la police"` / `title="Agrandir la police"` corrigés
- **PDF factures** : route corrigée `/api/factures/${id}/pdf` → `/api/editions/facture/${id}`
- **PDF devis** : route corrigée `/api/devis/${id}/pdf` → `/api/editions/devis/${id}`
- **PDF achats** : remplacé `window.open` par modal `srcdoc` (HTML inline)
- **Sidebar Suivi CAC** : route corrigée `/app/mes-parametres/cac` → `/app/seances?type=SEANCE`
- **Sidebar Règlements achats** : lien ajouté → `/app/achats/reglements`

### Chiffres clés au 24/03/2026
| Métrique | Valeur |
|---|---|
| Pages frontend compilées | 94 |
| Routes API opérationnelles | 41 (38 S49 + 3 corrigées S50) |
| Tables BDD commentées | ~90/151 (60%+) |
| Leads en BDD | 13 |
| Séances en BDD | 159 |
| Factures en BDD | 279 |
| Documents GitHub Pages | 86 |
| Sprint actuel | S50 |

---

## 📊 État des routes API au 24/03/2026

### ✅ 41 routes opérationnelles
| Groupe | Routes |
|---|---|
| Core | /bilan, /inventaires, /achats, /seances, /factures, /animaux, /tiers, /devis, /reglements, /races |
| Élevage | /elevage/geniteurs, /genealogie, /reservations, /reglements, /alertes, /portees, /saillies, /gestations, /stats-viabilite, /mortalite |
| CRM | /leads, /crm/leads, /crm/stats |
| Réseaux | /reseaux-sociaux/comptes, /reseaux-sociaux/publications |
| Séances | /seances/edc, /seances/types/:id |
| Paramètres | /parametres/editions, /pa, /modules, /formulaire-lead, /metier, /sms, /smtp |
| S50 corrigées | /signatures, /agenda, /planning-seances |
| Aide | /aide/contexte (7 contextes) |
| Divers | /categories, /tva, /plan-comptable, /programmes, /questionnaires, /dashboard/stats |

---

## 📄 État du frontend — 94 pages compilées

### Pages S50 modifiées
- `/app/factures/[id]` — route PDF corrigée → `/api/editions/facture/:id` ✅
- `/app/devis/[id]` — route PDF corrigée → `/api/editions/devis/:id` ✅
- `/app/achats/[id]` — PDF window.open → modal srcdoc ✅
- `/app/animaux/page.tsx` — AideContextuelle doublon supprimé ✅
- `/app/clients/page.tsx` — AideContextuelle doublon supprimé ✅
- `/app/elevage/page.tsx` — AideContextuelle doublon supprimé ✅
- `/app/factures/page.tsx` — AideContextuelle doublon supprimé ✅
- `/app/seances/page.tsx` — AideContextuelle doublon supprimé ✅
- `/app/compta-fec/page.tsx` — text-slate-* → text-muted ✅

### Composants S50 modifiés
- `Sidebar.tsx` — Suivi CAC corrigé + Règlements achats ajouté ✅
- `Topbar.tsx` — "Déconnexion" + titres A-/A+ corrigés ✅
- `globals.css` — btn-danger ajouté ✅

---

## 🔴 Reste à faire S51

### Charte graphique
- [ ] Boutons Liste/Tuiles/Carte → ajouter `btn-ghost` manuellement sur les pages concernées
- [ ] Bouton `🖥️` → ajouter `title="Plein écran"` sur la TopBar
- [ ] Tester mode clair : btn-primary, tables, badges statuts sur toutes les pages
- [ ] Uniformiser `← Retour` → `← [Nom page parente]` sur toutes les sous-pages
- [ ] Uniformiser `+ Nouveau` → `+ Nouveau [entité]` sur toutes les pages liste
- [ ] `Enregistrement…` → `Enregistrement en cours…` dans les formulaires

### Docs GitHub Pages
- [ ] Pousser `46-changelog-S48.html` sur GitHub Pages
- [ ] Mettre à jour index : 87 docs, sprint S50

### Développement
- [ ] Vue agenda drag & drop séances
- [ ] Export CSV/Excel factures et séances
- [ ] Page EDC — améliorer la fiche comportementale

---

## 🗺️ Roadmap S51-S52

### S51 — Signatures Yousign
- Intégration Yousign end-to-end
- Signature depuis fiche devis
- Suivi statut webhook en temps réel

### S52 — Notice & Documentation
- Notice utilisateur v4 (modules S45-S50)
- Guide démarrage rapide par métier

---

## 🔧 Règles critiques — rappel

### custom-routes.ts
```typescript
// 1. TOUJOURS dans le scope de registerCustomRoutes(app)
// 2. app.use() — pas instance.use()
// 3. Pas de backtick dans les strings SQL
// 4. Nginx strip /api/ → routes sans /api/
// 5. DbService inaccessible → toujours mysql2/promise direct
// 6. Colonnes sans DEFAULT → toujours NOW() explicite
```

### Frontend
```typescript
"use client"; // TOUJOURS première ligne
import { api } from "@/lib/api"; // named export, jamais default
// PDF -> TOUJOURS Modal/Popup, JAMAIS nouvelle page
// Routes PDF : /api/editions/facture/:id et /api/editions/devis/:id
// Pas d'apostrophes françaises dans les strings TypeScript
// Ne JAMAIS écraser layout.tsx — patcher uniquement les 2 lignes nécessaires
```

### Charte CSS (mode sombre par défaut)
| Variable | Valeur | Usage |
|---|---|---|
| `--bg` | `#0a0a0f` | Fond général |
| `--surface` | `#13131a` | Cards, panels |
| `--border` | `#1e1e2e` | Séparateurs |
| `--accent` | `#534ab7` | Accent principal |
| `--accent2` | `#7c6ff7` | Accent secondaire |
| `--text` | `#e2e0d8` | Texte principal |
| `--muted` | `#6b6880` | Texte secondaire |
| `--green` | `#3ecf8e` | Succès |
| `--red` | `#ef4444` | Erreur/danger |

### Classes boutons
| Classe | Usage | État |
|---|---|---|
| `btn-primary` | Action principale | ✅ OK |
| `btn-ghost` | Action secondaire | ✅ OK |
| `btn-danger` | Action destructive | ✅ Créé S50 |

---

## 💡 Leçons apprises S50

1. **Routes orphelines** : le fichier `custom-routes-final.ts` avait le même bug — les 3 routes étaient après le `}` fermant. Toujours vérifier avec `Get-Content ... | Select-Object -Last 80` avant de rebuilder.
2. **Routes PDF** : les routes d'édition PDF sont sous `/api/editions/facture/:id` et `/api/editions/devis/:id`, pas `/api/factures/:id/pdf`. La confusion vient des anciens patterns de développement.
3. **Backticks Python** : les templates TypeScript avec `${id}` dans des scripts Python inline `-c` posent problème. Toujours passer par un fichier `.py` écrit avec `Out-File`.
4. **PDF achats** : pas de route API dédiée — le HTML est généré inline côté frontend. La modal `srcdoc` est la solution adaptée.
5. **`/api/stats`** : route inexistante et inutile — `/api/dashboard/stats` fait le travail.
6. **SMTP_PASSWORD null** : normal en développement local — le bouton Mail fonctionne côté UI mais l'envoi réel échouera sans mot de passe configuré.
