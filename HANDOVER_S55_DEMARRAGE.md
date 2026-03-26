# PetSuite — Handover fin de session S54 -> Demarrage S55
**Date :** 26 mars 2026
**Sprint :** S55
**Auteur :** Session Claude S54

## ⚡ PREMIERE ACTION S55 — Reconstruction du code

**Avant tout developpement, lancer la reconstruction selon les regles de 50-revue-code.html**

### Ordre de reconstruction

**Etape 1 — Backend : factoriser custom-routes.ts**
- Creer `api/src/lib/db.ts` avec helper `getDb()` unique
- Remplacer les 82 `createConnection` par `getDb()`
- Corriger les 56 catch vides -> ajouter `res.status(500).json({ error: e.message })`
- Decouper en modules : `api/src/routes/factures.ts`, `seances.ts`, `elevage.ts`, `roles.ts`, etc.

**Etape 2 — Frontend : centraliser les utilitaires**
- Verifier que `src/lib/helpers.ts` exporte bien `fmtDate`, `fmtMontant`
- Remplacer les 48 definitions locales de `fmtDate` par import depuis helpers.ts
- Ajouter en-tetes JSDoc sur les 135 fichiers TSX sans en-tete
- Corriger les 10 catch vides dans les pages TSX

**Etape 3 — BDD : commenter toutes les colonnes**
- Convention FK : `Relation NomTable - description`
- Convention champ : description de l'attendu
- Priorite : forfait, forfait_client, role_permission, vues FEC

**Etape 4 — Composants generiques**
- Creer `src/components/DataTable.tsx`
- Creer `src/components/KpiCard.tsx`
- Creer `src/components/StatusBadge.tsx`
- Creer `src/components/PageHeader.tsx`

**Reference :** https://nicolashermilly.github.io/petsuite-docs/50-revue-code.html
**Score actuel :** 53/100 — **Objectif S55 : 75/100**

---


---

## URLs & chemins essentiels

| Ressource | Valeur |
|---|---|
| **App locale** | http://localhost/app/ |
| **Docs GitHub** | https://github.com/nicolashermilly/petsuite-docs |
| **GitHub Pages** | https://nicolashermilly.github.io/petsuite-docs/ |
| **Downloads** | C:\\Users\\AdminPC\\Downloads |
| **Racine frontend** | D:\\OneDrive_Perso\\OneDrive\\Documents\\Micro_Logiciel\\Documentation\\Frontend\\micro_logiciel_frontend_nextjs |
| **Deploy dir** | ...\\micro_logiciel_frontend_nextjs\\deploy |
| **API source** | ...\\api\\src\\custom-routes.ts |
| **Auth source** | ...\\api\\src\\auth\\auth.service.ts |
| **Repo docs local** | C:\\petsuite-docs |
| **BDD** | 192.168.1.62:3307 — base : micro_logiciel |
| **Dernier commit** | 296d1a5 (26/03/2026) |

---

## Regles critiques de demarrage
```powershell
$root = "D:\\OneDrive_Perso\\OneDrive\\Documents\\Micro_Logiciel\\Documentation\\Frontend\\micro_logiciel_frontend_nextjs"

# Deploy frontend
cd $root
.\\COPIER_TOUTES_PAGES_v2.ps1
cd deploy
docker compose build frontend --no-cache && docker compose up -d frontend && docker compose restart nginx

# Deploy API
cd "$root\\deploy"
docker compose build api --no-cache && docker compose up -d api && docker compose restart nginx

# Ecrire TypeScript complexe -> TOUJOURS via Python
$py = @'...code python...'@
$py | Out-File "$env:TEMP\\script.py" -Encoding utf8
python "$env:TEMP\\script.py"

# Git docs
cd C:\\petsuite-docs
git add -A && git commit -m "doc: ..." && git pull --rebase && git push
```

## Pattern API obligatoire
```typescript
app.use('/ma-route', async (req: any, res: any) => {
  const b: any = await new Promise<any>((resolve) => {
    if (req.body && Object.keys(req.body).length > 0) { resolve(req.body); return; }
    let data = '';
    req.on('data', (chunk: any) => { data += chunk; });
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
  });
  const db = await mysql.createConnection({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
  try {
    const [rows] = await db.execute("SELECT ...", [params]);
    res.json(rows);
  } catch(e: any) { res.status(500).json({ error: e.message }); }
  finally { await db.end(); }
});
// Nginx strip /api/ -> routes SANS /api/
// app.use() obligatoire (pas app.get())
// Pas d'apostrophes francaises dans TypeScript
// DbService inaccessible -> mysql2/promise direct
```

---

## Accompli en S54

### Frontend (100 pages compilees)
- Rebuild complet : DnD v2, programmes, forfaits, avoirs, admin
- Patch CSS mode clair globals.css (h1 invisible, td text-slate trop pale)
- Fix accents TSX : 11 fichiers + Sidebar
- Page /app/avoirs (6 avoirs, sidebar linkee apres Rappels impayes)
- Page /app/admin enrichie : onglet Utilisateurs + onglet Roles & Permissions
- Topbar badge role colore (violet ADMIN, gris autres roles)

### API
- GET /roles, GET/PUT /roles/:id/permissions
- GET /utilisateurs, PUT /utilisateurs/:id/role, PATCH /utilisateurs/:id/actif
- Fix auth.service.ts : USR_ROLE_ID direct (suppression ref table morte utilisateur_role)

### BDD
- CREATE TABLE role : 4 roles (ADMIN, GESTION, CONSULT, COMPTA)
- CREATE TABLE role_permission : 56 permissions (14 modules x 4 roles)
- ALTER TABLE utilisateur ADD USR_ROLE_ID FK -> role
- DROP TABLE utilisateur_role (orpheline vide remplacee)
- 6 utilisateurs : admin, @lgorithme, demo_video, anna, lilou (ex-bastien), L'IA (ex-celine)
- Tous USR_ROLE_ID = 1 (ADMIN) — a ajuster selon les vrais roles

### Documentation
- 5 fichiers BRIEFING harmonises charte navy/gold (S37/S38/S39/S40/S43)
- 49-changelog-S53.html pousse
- 50-revue-code.html genere (a pusher debut S55)
- Commit 296d1a5

---

## Regles importantes PDF

**IMPERATIF : Toutes les generations et visualisations PDF doivent etre en Modal/Popup**
- PAS de nouvel onglet navigateur
- PAS de window.open()
- Utiliser une modale avec iframe srcdoc ou fetch + blob URL dans un <iframe> dans une modale

---

## Regles BDD — Commentaires obligatoires

**Convention stricte pour tous les champs BDD :**
- FK : `Relation NomTable - description de la liaison`
- Champ ordinaire : description de l'attendu

Exemple :
- TIE_ID : `Identifiant unique du tiers`
- USR_ROLE_ID : `Relation role - Role attribue a l utilisateur`
- SEA_DATE_DEBUT : `Date et heure de debut de la seance`

**Action S55 : commenter toutes les colonnes de toutes les tables actives**

---

## Nouvelles formules commerciales

| Ancien | Nouveau | Description |
|---|---|---|
| Starter | Essentiel | Le professionnel solo qui debute ou gere seul son activite |
| Pro | Professionnel | Le praticien confirme qui veut piloter avec precision |
| Business | Expert | La structure multi-praticiens en croissance |

### Module Claude IA par formule
| Formule | Module IA | Contenu |
|---|---|---|
| Essentiel | Option | Devis & comptes rendus en saisie vocale. Suggestions intelligentes |
| Professionnel | Option | Redaction vocale devis & comptes rendus. Relances IA. Analyse comportementale |
| Expert | Option | IA multi-praticiens. Synthese seances. Veille reglementaire & evolutions metier |

### Contenu par formule
**Essentiel :**
- Agenda & gestion des seances
- Fiches clients & animaux
- Devis & facturation simple
- 1 metier active / Export FEC
- Aide intuitive & centre d'aide
- Forum communautaire

**Professionnel :**
- Tout Essentiel, plus...
- EC Etude Comportementale & CAC
- Elevage complet — portees, DDPP, LOF
- Questionnaires metiers & GED
- Tableau de bord & statistiques BI
- Multi-metiers / Signature electronique

**Expert :**
- Tout Professionnel, plus...
- Multi-utilisateurs & droits par role
- Inventaires, achats & fournisseurs
- Toutes familles de metiers
- Reseaux sociaux multi-comptes
- Accompagnement dedie & RPE

---

## Roadmap S55 — Dans l'ordre

### ROUGE — Bloquant
| Priorite | Sujet | Details |
|---|---|---|
| 1 | Pusher 50-revue-code.html | cd C:\\petsuite-docs && git add -A && git commit && git push |
| 2 | Bouton modifier utilisateur | Page /app/admin onglet Utilisateurs — bouton Edit manquant |
| 3 | Commentaires BDD toutes colonnes | Convention FK + champ ordinaire — toutes tables actives |
| 4 | Sidebar filtree par role | can_read depuis role_permission — Niveau 1 |

### ORANGE — Important
| Priorite | Sujet | Details |
|---|---|---|
| 5 | Module Formules/Abonnements | Page /app/forfaits a mettre a jour Essentiel/Professionnel/Expert |
| 6 | Activation modules par formule | SuperAdmin peut activer/desactiver modules par utilisateur |
| 7 | Module Claude IA S55 | Widget flottant + chat + lecture API existantes |
| 8 | Bug stats KPIs | Seances/Clients/Animaux = 0 — jointure SST a affiner |
| 9 | Suivi CAC comportementaliste | Redirige vers mauvais ecran |
| 10 | PDF toujours Modal/Popup | Audit de toutes les pages avec PDF — remplacer window.open |

### JAUNE — Backlog
| Priorite | Sujet | Details |
|---|---|---|
| 11 | /app/elevage/declarations | Page manquante — route API presente |
| 12 | /app/elevage/mortalite | Squelette seulement — a developper |
| 13 | Modeles programmes autres metiers | Toiletteur, Pet-sitter, Eleveur, Veto, Equestre |
| 14 | devis_ligne inexistante | /api/devis/:id/lignes retourne [] |
| 15 | Export CSV reglements | Bouton manquant |
| 16 | Yousign end-to-end | Configurer cle sandbox dans param_yousign |
| 17 | Redirects par page Niveau 2 | hook useRequireRole sur pages sensibles |

### VERT — Futur
| Priorite | Sujet | Details |
|---|---|---|
| 18 | Audit complet 151 tables BDD | Detection orphelines automatique |
| 19 | BDD tables secondaires | article_prestation, crm_lead, facture_ligne |
| 20 | Tests unitaires | Au moins sur logique metier critique |
| 21 | ESLint/Prettier | Linter configuration |

---

## Chiffres cles au 26/03/2026

| Metrique | Valeur |
|---|---|
| Pages UI compilees | 100 |
| Routes API custom | ~90 routes |
| Tables BDD actives | ~25 principales |
| Utilisateurs | 6 |
| Roles | 4 (ADMIN, GESTION, CONSULT, COMPTA) |
| Permissions | 56 (14 modules x 4 roles) |
| Factures | 279 |
| Clients/tiers | 167 |
| Seances | 159 |
| CA 12 mois | 48 014 EUR |
| Fichiers HTML docs | 90 |
| Dernier commit | 296d1a5 |

---

## Backup propre
`C:\\Backup\\micro_logiciel\\20260315_0002`
ATTENTION : Backups a partir de 20260315_0042 = code corrompu — ne pas utiliser

## Actions post-protection HTML (fin de session protection)
- DROP TABLE micro_logiciel.mdp apres application protection sur toutes les pages
- Verifier que toutes les pages protegees fonctionnent avant suppression

## Session dediee nettoyage frontend (S56+)
Dossier : D:\\OneDrive_Perso\\OneDrive\\Documents\\Micro_Logiciel\\Documentation\\Frontend\\micro_logiciel_frontend_nextjs
- Identifier tous les fichiers inutiles (scripts obsoletes, fichiers de test, inject_*.js, etc.)
- Creer un dossier _archives\\ a la racine
- Deplacer tout ce qui ne sert pas dans _archives\\
- Ne jamais supprimer - archiver uniquement
- Documenter ce qui a ete archive dans un fichier _archives\\ARCHIVE_LOG.md

## Bug connu — Drag & Drop agenda non fonctionnel

**Page :** http://localhost/app/planning-seances
**Symptome :** Le drag & drop HTML5 natif (v2 slot-drop, snap 30 min) ne fonctionne pas
**Route API :** PATCH /seances/:id retourne bien 200 (verifie en S54)
**Composant :** src/app/app/planning-seances/page.tsx
**Piste :** Le handler onDrop ou onDragOver ne declenche pas correctement le PATCH
**Action S55 :** Debugger les evenements HTML5 drag & drop dans la page planning-seances
- Verifier que dragover appelle preventDefault()
- Verifier que le drop calcule correctement le slot cible (snap 30 min)
- Verifier que le PATCH envoie les bonnes dates SEA_DATE_DEBUT / SEA_DATE_FIN
- Tester avec console.log dans le handler drop avant de patcher

## Roadmap supplementaire identifiee en S54

### Nouveaux modules a developper
| Sujet | Details |
|---|---|
| Carnet de suivi chien | Document PDF de progression - genere depuis les seances et CAC |
| Programmes multi-seances | Planification de parcours sur plusieurs seances |
| Forfaits cours collectifs | Gestion des cours en groupe avec inscriptions |

### Audit charte graphique HTML — A faire en S55
Certaines pages n'ont pas la bonne charte graphique et les bonnes dispositions.
Exemple identifie : 47-changelog-S51.html
Action : Faire un tour complet de toutes les pages HTML du repo et verifier :
- Presence de la charte navy/gold
- Disposition correcte (hero, container, nav, footer)
- Pas de doublons de nav ou de style
- Coherence visuelle avec index.html
Script a utiliser : update_html_charte_s53.py (deja dans le repo)
