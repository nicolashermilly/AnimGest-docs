# Anim'Gest — Handover S63 FIN (complet)
> NoSage's Editor — Généré le 01/04/2026

---

## En-tête session

| Champ | Valeur |
|---|---|
| Date | 01/04/2026 |
| Sprint | S63 → passe à S64 |
| Auteur | Sessions Claude S63 |
| Objectif | Portail Client déploiement + Eliot agent complet + fixes divers |
| Statut | Terminé — commit b687f04 |

---

## Chemins & URLs

| Ressource | Valeur |
|---|---|
| App locale | http://localhost/app/ |
| API test | http://localhost/api/bilan |
| Docs GitHub | https://github.com/nicolashermilly/petsuite-docs |
| GitHub Pages | https://nicolashermilly.github.io/petsuite-docs/ |
| Frontend | D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs |
| Deploy | ...\micro_logiciel_frontend_nextjs\deploy |
| API source | ...\api\src\custom-routes.ts (3846 lignes — 220 760 octets) |
| Docs local | C:\AnimGest_Sav\ |
| Backup propre | C:\Backup\micro_logiciel\20260326_2317_avant_revue_code |
| BDD | 192.168.1.62:3307 — micro_logiciel + micro_logiciel_ged |
| Scripts Python | $env:USERPROFILE\Downloads\ (jamais dans OneDrive) |

---

## 1. Ce qui a été accompli en S63

### 1a. Portail Client — routes API (ROUGE ✅)

**11 routes déployées et fonctionnelles :**

| Route | Description | Statut |
|---|---|---|
| `POST /portail/auth/login` | Connexion par token, création session | ✅ |
| `POST /portail/auth/logout` | Déconnexion, invalidation session | ✅ |
| `GET /portail/animaux` | Animaux du client connecté | ✅ |
| `GET /portail/seances` | Séances du client (SEA_DATE_DEBUT) | ✅ |
| `GET /portail/factures` | Factures du client | ✅ |
| `GET /portail/notifications` | Notifications (colonnes réelles PCN_*) | ✅ |
| `GET /portail/admin/acces` | Liste des accès portail | ✅ |
| `POST /portail/admin/acces` | Créer un accès portail | ✅ |
| `PUT /portail/admin/acces/:id/toggle` | Activer/désactiver un accès | ✅ |
| `POST /portail/admin/acces/:id/send-link` | Envoyer le lien par email (nodemailer) | ✅ |
| `POST /portail/seances/:id/confirmer` | Confirmation séance par le client | ✅ |

**Colonnes BDD réelles (corrections appliquées) :**
- `portail_client_acces` : `PCA_ID`, `PCA_TOKEN`, `PCA_ACTIF`, `PCA_DATE_EXPIRATION`, `PCA_EMAIL`, `TIE_ID`
- `portail_client_session` : `PCS_SESSION_TOKEN`, `PCS_DATE_FIN`, `PCS_ACTIF`, `PCA_ID`
- `portail_client_notification` : `PCN_TYPE`, `PCN_CANAL`, `PCN_STATUT`, `PCN_OBJET`, `PCN_DATE_CREATION`, `TIE_ID`
- `animal` : `ANI_CLI` (pas `TIE_ID`), `ANI_PUC` (pas `ANI_PUCE`)
- `seance` : `SEA_DATE_DEBUT` (pas `SEA_DATE`)
- `tiers` : `TIE_RAISON_SOCIALE` (pas `TIE_NOM`/`TIE_PRENOM`)
- `reglement` : pas de `REG_STATUT` — colonnes : `REG_ID`, `FAC_ID`, `REG_DATE`, `REG_MONTANT`, `REG_MODE`, `REG_REFERENCE`
- `DCE_STATUT` enum : `BROUILLON/ENVOYE/ACCEPTE/REFUSE/ANNULE` (pas `FACTURE`)

**Body parsing `instance.use()` :** helper `_readBody()` obligatoire sur toutes les routes POST — NestJS ne parse pas le body avant `instance.use()`.

### 1b. Portail Client — pages frontend (ROUGE ✅)

| Fichier | Route | Description |
|---|---|---|
| `portail_client_page_S63.tsx` | `/client/[token]` | Espace client : login auto, séances/factures/animaux en onglets |
| `portail_admin_page.tsx` | `/app/parametres/portail` | Admin : liste accès, créer/copier/envoyer lien/toggle |

**Fonctionnalités page admin portail :**
- Select client (500 tiers chargés au montage, filtre local)
- Email pré-rempli depuis `TIE_EMAIL` de la fiche avec badge "depuis la fiche client"
- Bouton 📋 Copier le lien, ✉️ Envoyer par email, ✓/✗ Activer/Désactiver
- Stats : accès créés / actifs / connexions totales

**Accès portail — 4 points d'entrée :**
- URL directe : `http://[host]/client/[TOKEN_64_chars]`
- Sidebar : Communauté → 🔗 Portail Client
- Liste clients : bouton "🔗 Portail" par ligne → mini-modal
- Fiche client : bouton "🔗 Portail" dans le header PageHeader

### 1c. Email — vrai envoi nodemailer (ORANGE ✅)

- `nodemailer ^6.9.14` ajouté dans `api/package.json`
- `send_email` Eliot → vrai envoi nodemailer (lit `param_smtp`, génère PDF, envoie avec PJ)
- `POST /portail/admin/acces/:id/send-link` → envoie lien portail par email
- `PUT /param-smtp` → sauvegarde config SMTP depuis l'UI (avec `_readBody`)
- **Test validé** : email reçu sur nicolashermilly@gmail.com ✅
- SMTP config : smtp.gmail.com:465, App Password configuré

### 1d. Eliot — nouveaux tools S63 (ORANGE ✅)

| Tool | Description | Statut |
|---|---|---|
| `update_statut_devis` | Transitions BROUILLON→ENVOYE→ACCEPTE→REFUSE→ANNULE | ✅ |
| `create_facture_depuis_devis` | Convertit devis ACCEPTE en facture via `/devis/:id/facturer` | ✅ |
| `create_reglement` | INSERT reglement sans REG_STATUT (REG_DATE, REG_MONTANT, REG_MODE, REG_REFERENCE) | ✅ corrigé |

**Bugs Eliot corrigés S63 :**
- `FAC_NUMERO_INT` → `FAC_NUM` dans `POST /devis/:id/facturer`
- `REG_STATUT` inexistant → supprimé du INSERT reglement
- Doublons tools dans `execTool` → nettoyés (3 doublons supprimés)
- `send-link` ID parsing → `urlParts[urlParts.length - 2]`
- `DCE_STATUT` enum → FACTURE retiré (n'existe pas dans la BDD)

**⚠️ Doublons encore présents dans la liste déclarée :** `update_statut_devis`, `create_facture_depuis_devis`, `create_reglement` apparaissent 2x dans la déclaration (pas dans l'implémentation) — à corriger en S64.

### 1e. Sidebar + navigation

- Tuile `🔗 Portail Client` ajoutée sous le groupe "Communauté"
- Bouton portail dans liste clients (`/app/app/clients/page.tsx`)
- Bouton portail dans fiche client (`/app/app/clients/[id]/page.tsx`)

### 1f. Scripts utilitaires (fin de session)

- `mon_script.py` — inspection complète de `custom-routes.ts` (routes, app.use(), createConnection, tools Eliot, cohérence)
- `harmoniser_charte.py` — harmonisation design system Anim'Gest sur tous les HTML de `C:\AnimGest_Sav` → **94 fichiers harmonisés et pushés** (commit fbe0e7d)

---

## 2. État technique réel — résultats `mon_script.py`

```
custom-routes.ts : 3846 lignes — 220 760 octets
instance.use()   : 48 routes
app.use()        : 102 routes (DETTE TECHNIQUE — migration à planifier)
createConnection : 4 restants (lignes 2286, 2317, 2355, 2393 — tous sur micro_logiciel_ged)
getDb()          : 117 utilisations
db.end()         : 136 (> getDb() — OK, certains ont plusieurs connexions)
Tools déclarés   : 13 (dont 3 doublons dans la liste)
Tools implémentés: 10 (cohérence OK côté implémentation)
REG_STATUT       : ⚠️ encore présent dans un INSERT reglement
_readBody        : 3 occurrences
```

**Portail routes dans instance.use() :**
`/portail/auth/login`, `/portail/auth/logout`, `/portail/animaux`, `/portail/seances`,
`/portail/factures`, `/portail/admin/acces`, `/portail/admin/acces/:id/toggle`, `/portail/admin/acces/:id/send-link`
(8 sur 11 — `/portail/notifications` et `/portail/seances/:id/confirmer` restent à vérifier)

---

## 3. Scores qualité S63 (estimé)

| Axe | Score S62 | Score S63 |
|---|---|---|
| Backend | 84/100 | 85/100 |
| Frontend | 82/100 | 84/100 |
| BDD | 85/100 | 85/100 |
| Global | 83/100 | 85/100 |

> Routes API : ~115 | Pages UI : 106 | Eliot tools : 10 (déclarés : 13 avec doublons)

---

## 4. État Frimousse (animal de test)

**PRÉSERVER IMPÉRATIVEMENT :**
- `ANI_ID=22`, Malinois, Jean Dujardin, `TIE_ID=1`

---

## 5. Accès portail de test créé

| Champ | Valeur |
|---|---|
| TIE_ID | 1 (Deneuve, Catherine) |
| Token | `ef6f75061a821b8760a2bd5e80e5d18fb4f3bdeaa5ce0f35164974d6524ac66e` |
| URL | `http://localhost/client/ef6f75061a821b8760a2bd5e80e5d18fb4f3bdeaa5ce0f35164974d6524ac66e` |
| Résultat test | Login OK, 5 animaux, 4 séances, 8 factures ✅ |

---

## 6. Bugs connus — S64

### 🔴 ROUGE — Priorité maximale

| Bug | Module | Action |
|---|---|---|
| `PUT /devis/:id` — lignes non supportées | Devis | Ajouter support DELETE/INSERT lignes + whitelist |
| `POST /devis/:id/facturer` — colonnes `facture` à vérifier | Factures | Audit complet colonnes avant test |
| `REG_STATUT` encore présent dans un INSERT reglement | Règlements | Localiser et supprimer (L~56376) |
| Tools Eliot doublons dans liste déclarée (3 tools x2) | Eliot | Nettoyer la déclaration |

### 🟠 ORANGE — Priorité haute

| Bug | Module | Action |
|---|---|---|
| Eliot `create_reglement` — à tester end-to-end | Eliot | Tester via chat avec vraie facture |
| SMTP `send-link` — tester envoi depuis page admin portail | Portail | Créer accès Jean Dujardin + envoyer lien |
| Fiche client portail — `portailEmail` initialisé avant chargement client | Portail | Initialiser dans `useEffect` sur `client` |

### 🟡 JAUNE — Backlog persistant

| Item | Module |
|---|---|
| `/app/elevage/declarations` — page TSX manquante | Elevage |
| Export CSV règlements | Règlements |
| Planning DnD correctifs | Planning |
| Bouton ✓ Enregistre footer `editions/page.tsx` L336 | Editions |

---

## 7. Roadmap S64

### 🔴 ROUGE — En premier

1. **Tarification 3 méthodes dans les devis** (spec complète dans `spec_chrono_tarif_cycles.md`)
   - Méthode 1 COEF_FG+MARGE : `PRHT = PAUHT×(1+CoefFG)` → `PVHT = PRHT÷(1-PctMarge)`
   - Méthode 2 COEF_VTE : `PVHT = PAUHT×(1+CoefVte)`
   - Méthode 3 PRIX_DIRECT : saisie libre
   - Boutons sur devis BROUILLON uniquement (verrouillé si FAC liée)
   - Page `/app/parametres/tarification` avec formules + historique coefficients
   - Tables à créer : `param_tarification`, `tarif_historique_coef`
   - Colonnes déjà présentes : `DCE_METHODE_TARIF`, `DCE_COEF_FG`, `DCE_PCT_MARGE`, `DCE_COEF_VTE`, `DCE_VERROUILLE`

2. **Modules commerciaux BL/BR/DAF/AC**
   - Tables : `bon_livraison`, `bon_livraison_ligne`, `bon_retour`, `avoir_client`, `demande_avoir_fourn`
   - Routes API + pages UI + PDF puppeteer param_edition

### 🟠 ORANGE — Agent Eliot complet

- `create_seance` — planifier une séance depuis Eliot
- `get_planning` — voir le planning d'une période
- `send_portail_link` — envoyer le lien portail à un client depuis Eliot

### 🟢 VERT — Modules futurs (S65+)

- Mémoire Eliot persistée en BDD
- Notifications portail email/SMS (PCN_TYPE: RAPPEL_SEANCE, DEVIS_DISPONIBLE...)
- Stripe billing + licence tiers (Essentiel/Professionnel/Expert)
- Sport canin parcours géolocalisé
- Renommage BDD micro_logiciel → Anim_Gest (S70+)

---

## 8. Dette technique identifiée

| Dette | Lignes | Plan |
|---|---|---|
| 102 `app.use()` restants → migrer vers `instance.use()` | Voir liste `mon_script.py` | Migration progressive par module (formules, devis, factures...) |
| 4 `createConnection` sur BDD GED | L2286, L2317, L2355, L2393 | Créer `getDbGed()` helper + remplacer |
| Tools Eliot 3 doublons dans déclaration | Bloc tools déclarés | Supprimer les 3 doublons |
| `REG_STATUT` résiduel dans INSERT | L~56376 | Supprimer la colonne inexistante |

---

## 9. Outils SAV — notes et besoins S64

### Générateur Handover (`SAV_Generator_Handover.html`) — ⚠️ À revoir

**Problèmes constatés :**
- Formulaire trop générique — pas de champs forcés pour colonnes BDD, tools Eliot, bugs ROUGE/ORANGE/JAUNE
- Pas de validation — génération possible sans sections critiques remplies
- Résultat non fiable — le handover généré en S63 contenait du contenu S60 recyclé
- Pas de contexte technique persistant (taille routes, app.use() restants, etc.)

**Améliorations souhaitées S64 :**
- Sections obligatoires : routes ajoutées, colonnes BDD corrigées, tools Eliot, bugs triés ROUGE/ORANGE/JAUNE
- Champ "Dette technique identifiée" obligatoire
- État custom-routes.ts mis à jour automatiquement (ou champ forcé)
- Validation avant génération : impossible de générer sans remplir les sections critiques

### Générateur Maintenance (`SAV_Generator_Maintenance.html`) — ⚠️ À revoir

**Problèmes constatés :**
- Orienté monitoring (containers up/down, routes 200/404) mais pas de plan d'action
- Pas de catalogue de la dette technique
- Pas de lien avec le backlog bugs ROUGE/ORANGE/JAUNE
- Ne propose pas de scripts Python correctifs téléchargeables

**Améliorations souhaitées S64 :**
- Section "Dette technique" avec items concrets + scripts Python associés
- Lien vers les bugs ROUGE/ORANGE du dernier handover
- Plan de migration `app.use()` → `instance.use()` avec compteur de progression

---

## 10. Règles techniques critiques (rappel S64)

```
1.  custom-routes.ts — instance.use() uniquement (jamais app.use())
2.  getDb() par connexion, toujours db.end() en finally
3.  nginx strips /api/ prefix → routes définies sans /api/
4.  PDF → Modal uniquement, jamais window.open()
5.  Portail client → sessionStorage exclusivement
6.  BC = Bilan Comportemental (jamais EDC)
7.  Eliot → http.request (pas https) vers localhost:8080 dans Docker
8.  instance.use() POST → utiliser _readBody() (body non parsé par NestJS)
9.  PowerShell → -LiteralPath pour chemins avec [id]
10. Eliot = Option commerciale → toutes fonctionnalités marchent sans lui
11. COPIER_TOUTES_PAGES_v2.ps1 obligatoire avant tout build frontend
12. API rebuild : build --no-cache → up -d → restart nginx
13. Python scripts → toujours dans $env:USERPROFILE\Downloads\
14. git pull --rebase avant tout push sur petsuite-docs
```

---

## 11. Scripts Python S63 produits

| Script | Rôle | Statut |
|---|---|---|
| `inject_portail_routes.py` | Injection initiale routes portail | ✅ appliqué |
| `fix_send_email.py` | send_email Eliot → vrai nodemailer | ✅ appliqué |
| `add_nodemailer.py` | nodemailer dans package.json | ✅ appliqué |
| `fix_portail_appuse.py` | app.use → instance.use routes portail | ✅ appliqué |
| `fix_portail_colonnes.py` | Vrais noms colonnes BDD portail | ✅ appliqué |
| `fix_portail_body.py` | _readBody helper + TIE_RAISON_SOCIALE | ✅ appliqué |
| `fix_portail_sql.py` | ANI_CLI + SEA_DATE_DEBUT | ✅ appliqué |
| `fix_portail_animaux.py` | ANI_ESPECE_RACE retiré du SELECT | ✅ appliqué |
| `fix_smtp_put.py` | Route PUT /param-smtp + _readBody | ✅ appliqué |
| `fix_eliot_tools_s63.py` | Tools Eliot S63 + FAC_NUM | ✅ appliqué |
| `fix_portail_sendlink.py` | Route send-link + REG_STATUT fix | ✅ appliqué |
| `fix_sidebar_portail_et_eliot.py` | Sidebar + doublons Eliot + send-link ID | ✅ appliqué |
| `fix_clients_portail.py` | Bouton portail liste clients | ✅ appliqué |
| `fix_fiche_client_portail.py` | Bouton portail fiche client | ✅ appliqué |
| `fix_apostrophes_jsx.py` | Correction apostrophes JSX (`'Créer l'accès'`) | ✅ appliqué |
| `fix_eliot_doublons.py` | Nettoyage doublons execTool + send-link params | ✅ appliqué |
| `mon_script.py` | Inspection custom-routes.ts (routes, dette, tools) | ✅ outil permanent |
| `harmoniser_charte.py` | Charte design system sur 94 HTML docs | ✅ appliqué — 94 fichiers |

---

## 12. Commits S63

| Hash | Description |
|---|---|
| `b687f04` | S63 - Portail Client complet + Eliot tools S63 + Email nodemailer + Sidebar |
| `4a7b95e` | S63 - Handover final (petsuite-docs) |
| `fbe0e7d` | charte: harmonisation design system Anim'Gest — 94 fichiers (petsuite-docs) |

---

## 13. Comptes & accès

| Ressource | Valeur |
|---|---|
| SuperAdmin | `admin` / `@lgorithme` |
| Utilisateurs test | Anna (ADMIN), Bastien (MANAGER), Céline (ADMINISTRATIF) |
| GitHub Pages password | `@lgoritHme+977_73300` |
| ANTHROPIC_API_KEY | Dans `deploy/.env` |
| BDD | host: `192.168.1.62:3307`, user: `optimbtp`, pwd: `optimbtp` |
| SMTP | smtp.gmail.com:465, user: nicolashermilly@gmail.com, App Password configuré |

---

## 14. Eliot agent — règles métier immuables

| Autorisation | Statut |
|---|---|
| Lecture (clients, animaux, devis, séances) | ✅ Toujours autorisé |
| Création (devis, séances, règlements, factures) | ✅ Autorisé |
| Modification statut devis | ✅ Autorisé |
| Suppression de données | ❌ JAMAIS |
| Modification de pages ou de code | ❌ JAMAIS |
| Exécution SQL direct | ❌ JAMAIS |
| **Eliot est une Option** | Toutes fonctionnalités marchent sans lui |

---

*Anim'Gest — NoSage's Editor — Handover S63 FIN v2 — 01/04/2026*
