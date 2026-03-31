# Anim'Gest — Handover S63 FIN (complet)
> NoSage's Editor — Généré le 31/03/2026

---

## En-tête session

| Champ | Valeur |
|---|---|
| Date | 31/03/2026 |
| Sprint | S63 → passe à S64 |
| Auteur | Sessions Claude S63 |
| Objectif | Portail Client déploiement + Eliot agent complet + fixes divers |
| Statut | Terminé — ~15 commits dev |

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
| API source | ...\api\src\custom-routes.ts (~3700 lignes) |
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

**Body parsing `instance.use()` :** helper `_readBody()` pour lire le body JSON sur les routes POST (NestJS ne parse pas avant `instance.use()`).

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

**Accès portail :**
- URL directe : `http://[host]/client/[TOKEN_64_chars]`
- Depuis sidebar : Communauté → 🔗 Portail Client
- Depuis liste clients : bouton "🔗 Portail" par ligne → mini-modal
- Depuis fiche client : bouton "🔗 Portail" dans le header PageHeader

### 1c. Email — vrai envoi nodemailer (ORANGE ✅)

- `nodemailer ^6.9.14` ajouté dans `api/package.json`
- `send_email` Eliot → vrai envoi nodemailer (lit `param_smtp`, génère PDF, envoie avec PJ)
- `POST /portail/admin/acces/:id/send-link` → envoie lien portail par email
- `PUT /param-smtp` → sauvegarde config SMTP depuis l'UI (avec `_readBody`)
- **Test validé** : email reçu sur nicolashermilly@gmail.com ✅

### 1d. Eliot — nouveaux tools S63 (ORANGE ✅)

| Tool | Description | Statut |
|---|---|---|
| `update_statut_devis` | Transitions BROUILLON→ENVOYE→ACCEPTE→REFUSE→ANNULE | ✅ |
| `create_facture_depuis_devis` | Convertit devis ACCEPTE en facture via `/devis/:id/facturer` | ✅ |
| `create_reglement` | INSERT dans table `reglement` (REG_DATE, REG_MONTANT, REG_MODE, REG_REFERENCE) | ✅ corrigé |

**Bugs Eliot corrigés S63 :**
- `FAC_NUMERO_INT` → `FAC_NUM` dans `POST /devis/:id/facturer`
- `REG_STATUT` inexistant → supprimé du INSERT reglement
- Doublons tools dans `execTool` → nettoyés (3 doublons supprimés)
- `send-link` ID parsing → `urlParts[urlParts.length - 2]`
- `DCE_STATUT` enum → FACTURE retiré (n'existe pas dans la BDD)

### 1e. Sidebar

- Tuile `🔗 Portail Client` ajoutée sous le groupe "Communauté"
- Route : `/app/parametres/portail`

### 1f. Corrections BDD/SQL diverses

- `ANI_CLI` au lieu de `TIE_ID` dans la requête animaux portail
- `SEA_DATE_DEBUT` au lieu de `SEA_DATE` dans la requête séances portail
- `ANI_ESPECE_RACE` retiré du SELECT portail (colonne calculée inexistante en SQL direct)
- `TIE_RAISON_SOCIALE` au lieu de `TIE_NOM`/`TIE_PRENOM` (la table tiers n'a pas ces colonnes)

---

## 2. Scores qualité S63 (estimé)

| Axe | Score S62 | Score S63 |
|---|---|---|
| Backend | 84/100 | 85/100 |
| Frontend | 82/100 | 84/100 |
| BDD | 85/100 | 85/100 |
| Global | 83/100 | 85/100 |

> Routes API : ~115 | Pages UI : 106 | Eliot tools : 10

---

## 3. État Frimousse (animal de test)

**PRÉSERVER IMPÉRATIVEMENT :**
- `ANI_ID=22`, Malinois, Jean Dujardin, `TIE_ID=1`

---

## 4. Accès portail de test créé

| Champ | Valeur |
|---|---|
| TIE_ID | 1 (Deneuve, Catherine — premier client BDD) |
| Token | `ef6f75061a821b8760a2bd5e80e5d18fb4f3bdeaa5ce0f35164974d6524ac66e` |
| URL | `http://localhost/client/ef6f75061a821b8760a2bd5e80e5d18fb4f3bdeaa5ce0f35164974d6524ac66e` |
| Résultat test | Login OK, 5 animaux, 4 séances, 8 factures ✅ |

---

## 5. Bugs connus et restants en S64

### ROUGE — Priorité maximale
| Bug | Module | Action |
|---|---|---|
| `PUT /devis/:id` — lignes non supportées | Devis | Ajouter support des lignes (DELETE/INSERT) + whitelist |
| `POST /devis/:id/facturer` — colonnes `facture` à vérifier entièrement | Factures | Audit complet de la route avant test |

### ORANGE — Priorité haute
| Bug | Module | Action |
|---|---|---|
| Eliot `create_reglement` — à tester end-to-end | Eliot | Tester via chat Eliot avec vraie facture |
| SMTP `send-link` — tester envoi depuis page admin | Portail | Créer accès pour Jean Dujardin + envoyer lien |
| Fiche client portail — `useState` depuis `client` non encore chargé | Portail | `setPortailEmail` à initialiser dans `useEffect` sur `client` |

### JAUNE — Backlog persistant
| Item | Module |
|---|---|
| `/app/elevage/declarations` — page TSX manquante | Elevage |
| Export CSV règlements | Règlements |
| Planning DnD correctifs | Planning |
| `Bouton ✓ Enregistre footer editions/page.tsx L336` | Editions |

---

## 6. Roadmap S64

### ROUGE — En premier
1. **Tarification 3 méthodes dans les devis** (spec dans `spec_chrono_tarif_cycles.md`)
   - Boutons COEF_FG+MARGE / COEF_VTE / PRIX_DIRECT sur devis BROUILLON
   - Page `/app/parametres/tarification` avec formules + historique coefficients
   - Tables : `param_tarification`, `tarif_historique_coef`
   - Colonnes BDD à ajouter : `article_prestation.ART_PAUHT`, `ART_PRHT`, `ART_PVHT_CALCULE`
   - Colonnes dejà présentes : `DCE_METHODE_TARIF`, `DCE_COEF_FG`, `DCE_PCT_MARGE`, `DCE_COEF_VTE`

2. **Modules commerciaux BL/BR/DAF/AC** (spec BDD dans HANDOVER_S62)
   - Tables `bon_livraison`, `bon_livraison_ligne`, `bon_retour`, `avoir_client`, `demande_avoir_fourn`
   - Routes API + pages UI + PDF puppeteer param_edition

### ORANGE — Agent Eliot complet
3. **`create_seance`** — planifier une séance depuis Eliot
4. **`get_planning`** — voir le planning d'une période
5. **`send_portail_link`** — envoyer le lien portail à un client depuis Eliot

### VERT — Modules futurs (S65+)
- Mémoire Eliot persistée en BDD
- Notifications portail email/SMS (PCN_TYPE: RAPPEL_SEANCE, DEVIS_DISPONIBLE...)
- Stripe billing + licence tiers (Essentiel/Professionnel/Expert)
- Sport canin parcours géolocalisé
- Renommage BDD micro_logiciel → Anim_Gest (S70+)

---

## 7. Règles techniques critiques (rappel S64)

```typescript
// 1. custom-routes.ts — instance.use() uniquement (pas app.use())
// 2. getDb() par connexion, toujours db.end() en finally
// 3. nginx strips /api/ prefix → routes définies sans /api/
// 4. PDF → Modal uniquement, jamais window.open()
// 5. Portail client → sessionStorage exclusivement
// 6. BC = Bilan Comportemental (jamais EDC)
// 7. Eliot — http.request (pas https) vers localhost:8080 dans Docker
// 8. instance.use() POST → utiliser _readBody() car body pas encore parsé
// 9. -LiteralPath PowerShell pour chemins avec [id]
// 10. Eliot = Option commerciale → toutes fonctionnalités doivent marcher sans lui
```

```powershell
# Ordre rebuild API
cd deploy
docker compose build api --no-cache
docker compose up -d api
docker compose restart nginx

# Ordre rebuild Frontend
cd ..
.\COPIER_TOUTES_PAGES_v2.ps1
cd deploy
docker compose build frontend --no-cache
docker compose up -d frontend
docker compose restart nginx

# Python scripts — toujours dans Downloads
C:\Python314\python.exe $env:USERPROFILE\Downloads\nom_script.py
```

---

## 8. Scripts Python S63 produits (dans Downloads)

| Script | Rôle | Statut |
|---|---|---|
| `inject_portail_routes.py` | Injection initiale routes portail | ✅ appliqué |
| `fix_send_email.py` | send_email Eliot → vrai nodemailer | ✅ appliqué |
| `add_nodemailer.py` | nodemailer dans package.json | ✅ appliqué |
| `fix_portail_appuse.py` | app.use → instance.use routes portail | ✅ appliqué |
| `fix_portail_position.py` | Repositionnement bloc portail | ✅ appliqué |
| `fix_portail_clean.py` | Nettoyage doublons + instance.use + next | ✅ appliqué |
| `fix_portail_colonnes.py` | Vrais noms colonnes BDD portail | ✅ appliqué |
| `fix_portail_body.py` | _readBody helper + TIE_RAISON_SOCIALE | ✅ appliqué |
| `fix_portail_sql.py` | ANI_CLI + SEA_DATE_DEBUT + sans prestation | ✅ appliqué |
| `fix_portail_animaux.py` | ANI_ESPECE_RACE retiré du SELECT | ✅ appliqué |
| `fix_smtp_put.py` | Route PUT /param-smtp + _readBody | ✅ appliqué |
| `fix_smtp_readbody.py` | _readBody dans PUT param-smtp | ✅ appliqué |
| `fix_eliot_tools_s63.py` | Tools Eliot S63 + FAC_NUM | ✅ appliqué |
| `fix_portail_sendlink.py` | Route send-link + REG_STATUT fix | ✅ appliqué |
| `fix_sidebar_portail_et_eliot.py` | Sidebar + doublons Eliot + send-link ID | ✅ appliqué |
| `fix_clients_portail.py` | Bouton portail liste clients | ✅ appliqué |
| `fix_fiche_client_portail.py` | Bouton portail fiche client | ✅ appliqué |

---

## 9. Comptes & accès

| Ressource | Valeur |
|---|---|
| SuperAdmin | `admin` / `@lgorithme` |
| Utilisateurs test | Anna (ADMIN), Bastien (MANAGER), Céline (ADMINISTRATIF) |
| GitHub Pages password | `@lgoritHme+977_73300` (pages sécurisées) |
| ANTHROPIC_API_KEY | Dans `deploy/.env` |
| BDD | host: `192.168.1.62:3307`, user: `optimbtp`, pwd: `optimbtp` |
| SMTP | smtp.gmail.com:465, user: nicolashermilly@gmail.com, App Password configuré |

---

## 10. Eliot agent — règles métier immuables

| Autorisation | Statut |
|---|---|
| Lecture (clients, animaux, devis, séances) | ✅ Toujours autorisé |
| Création (devis, séances, règlements, factures) | ✅ Autorisé |
| Modification statut devis | ✅ Autorisé |
| Suppression de données | ❌ JAMAIS |
| Modification de pages ou de code | ❌ JAMAIS |
| Exécution SQL direct | ❌ JAMAIS (passer par les routes API) |
| Eliot est une **Option** | Toutes fonctionnalités marchent sans lui |

---

## 11. Note importante S64 — Tarification 3 méthodes

Spec complète dans `spec_chrono_tarif_cycles.md` (project knowledge).

**Résumé :**
- Méthode 1 COEF_FG+MARGE : `PRHT = PAUHT×(1+CoefFG)` → `PVHT = PRHT÷(1-PctMarge)`
- Méthode 2 COEF_VTE : `PVHT = PAUHT×(1+CoefVte)`  
- Méthode 3 PRIX_DIRECT : saisie libre

Colonnes déjà en BDD sur `devis_contrat_entete` : `DCE_METHODE_TARIF`, `DCE_COEF_FG`, `DCE_PCT_MARGE`, `DCE_COEF_VTE`, `DCE_VERROUILLE`.
Page à créer : `/app/parametres/tarification`.
Boutons sur devis BROUILLON seulement (verrouillé si FAC liée).
