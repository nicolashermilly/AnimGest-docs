# BRIEF S30 → S31 — PetSuite / micro_logiciel
## Date clôture : 16/03/2026 00h41 — Fin session S30 complète

---

## ✅ STACK AU DÉMARRAGE S31

### Conteneurs Docker
| Conteneur | État | Note |
|---|---|---|
| micro_frontend | ✅ UP | Build 58 pages |
| micro_nginx | ✅ UP | Reverse proxy :80 |
| micro_api | ✅ UP | NestJS + custom-routes.ts 290 lignes |
| MariaDB | ✅ UP | 192.168.1.62:3307 — HORS Docker |

### API — custom-routes.ts
- Fichier : `api/src/custom-routes.ts` — **290 lignes** — S27→S30
- Backup : `api/src/custom-routes.ts.bak_races`
- 24 routes custom opérationnelles (voir liste complète ci-dessous)

### BDD — État S30
- `race` : 392 races, RACE_TYPE + RACE_CATEGORIE — migration S30 ✅
- `programme_suivi`, `programme_semaine`, `param_metier` : **À CRÉER en S31** (voir scripts ci-dessous)

---

## 🔑 CHEMINS IMPORTANTS

```
Frontend src  : D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs\src
API src       : D:\...\micro_logiciel_frontend_nextjs\api\src
custom-routes : D:\...\api\src\custom-routes.ts
Deploy        : D:\...\micro_logiciel_frontend_nextjs\deploy
Sauvegarde    : G:\Sauvegarde_micro_logiciel\Sauvegarde_micro_logiciel.ps1
Git docs      : C:\petsuite-docs\
Backup propre : C:\Backup\micro_logiciel\20260315_1633_PROPRE\
mariadb-dump  : C:\ProgramData\OptimBTP\MariaDB\bin\mariadb-dump.exe
```

---

## 📋 ROUTES API — custom-routes.ts (290 lignes S30)

| Route | Méthode | Sprint |
|---|---|---|
| /ged-factures-impayees | GET | S27 |
| /ged-admin-users | GET | S27 |
| /ged-admin-roles | GET | S30 |
| /ged-admin-audit | GET | S27 |
| /ged-exercices | GET | S27 |
| /ged-compta-fec | GET | S27 |
| /ged-compta-fec-generer | POST | S27 |
| /elevage/alertes | GET | S28 |
| /elevage/gestations | GET | S28 |
| /elevage/portees | GET | S28 |
| /elevage/saillies | POST | S28 |
| /achats | GET/POST | S28 |
| /seances/:id/generer-devis | POST | S28 |
| /bilan | GET | S29 |
| /inventaires | GET/POST | S29 |
| /dashboard/stats | GET | S30 |
| /parametres/metier | GET/POST/PUT | S30 |
| /ged-edc-sans-devis | GET | S30 |
| /ged-formulaire-lead | GET | S30 |
| /ged-factures-email | POST | S30 |
| /programmes | GET/POST | S30 |
| /programmes/:id | GET | S30 |
| /programmes/:id/semaines/:num | PATCH | S30 |
| /ged-devis-formule/:id/seances | GET | S30 |
| /animaux/races | GET (?type=&categorie=) | S30 |
| /animaux/races/types | GET | S30 |
| /animaux/races/categories | GET (?type=) | S30 |

---

## 🗄️ SQL S31 — TABLES À CRÉER

```sql
-- Vérifier existence avant de créer
SHOW TABLES LIKE 'programme_suivi';
SHOW TABLES LIKE 'programme_semaine';
SHOW TABLES LIKE 'param_metier';

-- programme_suivi
CREATE TABLE IF NOT EXISTS micro_logiciel.programme_suivi (
  PRG_ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ANI_ID INT NOT NULL,
  TIE_ID INT NOT NULL,
  PRG_TITRE VARCHAR(200) NOT NULL,
  PRG_DATE_DEBUT DATE NOT NULL,
  PRG_NB_SEMAINES INT NOT NULL DEFAULT 8,
  PRG_STATUT ENUM('EN_COURS','TERMINE','PAUSE') NOT NULL DEFAULT 'EN_COURS',
  PRG_OBJECTIF TEXT NULL,
  PRG_CREE_LE DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prg_ani FOREIGN KEY (ANI_ID) REFERENCES animal(ANI_ID) ON DELETE RESTRICT,
  CONSTRAINT fk_prg_tie FOREIGN KEY (TIE_ID) REFERENCES tiers(TIE_ID) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- programme_semaine
CREATE TABLE IF NOT EXISTS micro_logiciel.programme_semaine (
  SEW_ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  PRG_ID INT NOT NULL,
  SEW_NUMERO INT NOT NULL,
  SEW_TITRE VARCHAR(200) NOT NULL DEFAULT '',
  SEW_OBJECTIFS TEXT NULL,
  SEW_EXERCICES TEXT NULL,
  SEW_NOTES TEXT NULL,
  SEW_STATUT ENUM('A_FAIRE','EN_COURS','REALISE') NOT NULL DEFAULT 'A_FAIRE',
  UNIQUE KEY uq_sew (PRG_ID, SEW_NUMERO),
  CONSTRAINT fk_sew_prg FOREIGN KEY (PRG_ID) REFERENCES programme_suivi(PRG_ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- param_metier (singleton ID=1)
CREATE TABLE IF NOT EXISTS micro_logiciel.param_metier (
  ID INT NOT NULL PRIMARY KEY DEFAULT 1,
  MET_NOM VARCHAR(150) NOT NULL DEFAULT '',
  MET_ACTIVITE VARCHAR(150) NOT NULL DEFAULT '',
  MET_DEVISE CHAR(3) NOT NULL DEFAULT 'EUR',
  MET_LANGUE CHAR(2) NOT NULL DEFAULT 'fr',
  MET_ACACED TINYINT(1) NOT NULL DEFAULT 0,
  MET_RC_PRO VARCHAR(100) NULL,
  MET_SIRET CHAR(14) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT IGNORE INTO micro_logiciel.param_metier (ID) VALUES (1);

-- Extensions table race (déjà faites S30 — vérification)
SELECT COUNT(*) AS nb_races, 
       SUM(RACE_TYPE='CHIEN') AS chiens,
       SUM(RACE_TYPE='CHAT') AS chats
FROM micro_logiciel.race;
-- Attendu : ~392 races total, ~211 chiens, ~48 chats
```

---

## 🎯 PRIORITÉS S31

### 1. SQL (immédiat)
- [ ] Créer `programme_suivi`, `programme_semaine`, `param_metier` (scripts ci-dessus)
- [ ] Extensions `animal` : +ANI_ALIMENTATION, +ANI_MEDICAMENTS, +ANI_HABITUDES, +ANI_CONTACT_VETO, +ANI_FERRURE, +ANI_PHOTOS (TEXT/VARCHAR)
- [ ] Extensions `tiers` : +TIE_URGENCE_TEL, +TIE_INSTRUCTIONS, +TIE_RC_PRO_NUM

### 2. Frontend races (immédiat)
- [ ] Copier `races-page.tsx` → `src/app/app/parametres/races/page.tsx`
- [ ] Copier `RaceSelector.tsx` → `src/components/RaceSelector.tsx`
- [ ] Intégrer RaceSelector dans page creation animal (remplace les 2 selects race)
- [ ] Rebuild frontend

### 3. Module Éditions (S31 core)
- [ ] Page `/app/mes-parametres/editions` — gestion CGV + documents
- [ ] Table `param_edition` (CGV, modèles contrats)
- [ ] Système champs de fusion (solution intégrée, pas Word)
- [ ] Annexes automatiques en fin de Devis/Facture

### 4. Carnet pension DDPP
- [ ] Table `pension_sejour` (ANI_ID, TIE_ID, date_entree, date_sortie, observations)
- [ ] Vue registre DDPP
- [ ] Page `/app/pension/registre`

### 5. Paramètres métier
- [ ] Page `/app/mes-parametres/metier` — activité, devise, langue, ACACED, RC Pro
- [ ] Route `/parametres/metier` déjà en place (retourne {} si table vide)

---

## 💾 SAUVEGARDE — v5 OPÉRATIONNELLE ✅

```
Script    : G:\Sauvegarde_micro_logiciel\Sauvegarde_micro_logiciel.ps1
Tâche     : PetSuite_Sauvegarde — 04h00 quotidien
Résultat  : 5/5 OK — backup_2026-03-15.zip (1.8 Mo) + projet_2026-03-15.zip (0.4 Mo)
```

---

## 📁 DOCS GIT — État S30

Repo : `C:\petsuite-docs` — github.com/nicolashermilly/petsuite-docs

Fichiers mis à jour cette session :
- `index.html` ✅ — portail navigation S30
- `01-synthese-projet.html` ✅
- `03-notice-utilisateur.html` ✅ — v4.0 S30
- `05-architecture-roadmap.html` ✅
- `06-roadmap.html` ✅ — S31/S32 complet
- `07-audit-stack.html` ✅ — stack S30, custom-routes 290 lignes
- `08-roadmap-metiers.html` ✅ — 14 métiers
- `11-carte-identite-animale.html` ✅ — 392 races S30
- `12-infrastructure.html` ✅ — Docker + sauvegarde v5
- `17-api-reference.html` ✅ — 27 routes documentées
- `20-pilotage-projet.html` ✅ — sprint S30 + roadmap S31/S32
- `22-demarches-eleveur.html` ✅ — DDPP, I-CAD, SCC
- `BRIEF_S31_nouvelle_conversation.md` ✅ — ce fichier

---

## 🗺️ ROADMAP S31/S32 — 14 MÉTIERS

### Mutualisations confirmées
| Table | Extensions S31 |
|---|---|
| `animal` | alimentation, médicaments, habitudes, contact_veto, ferrure, photos |
| `tiers` | numéro urgence, instructions, RC_Pro, licence FFE |
| `seance` | photos, type métier, exercices domicile, techniques appliquées |
| Module Éditions | CGV, contrats, autorisations, décharges, champs fusion |
| Agenda | rappels auto, tournées géo, optimisation trajets |
| Stock/Inventaire | matériel toilettage, fers/clous, sellerie |
| GED | carnets santé, contrats cession, certificats vétérinaires |
| Carnet pension DDPP | registre entrées/sorties, observation sanitaire |

### 14 métiers
1. Comportementaliste/Éducateur (cœur PetSuite)
2. Éleveur canin/félin
3. Éleveur animalier
4. Toiletteur
5. Pet-sitter
6. Naturopathe/Nutritionniste
7. Maréchal-ferrant
8. Centre équestre
9. Centre canin
10. Ostéopathe/Kiné animalier
11. Éducateur animalier
12. Pension animale
13. Chenil/Chatterie
14. Organisateur événements animaliers

---

## 🚨 RÈGLES ABSOLUES

1. `cd deploy` AVANT toute commande docker compose
2. MariaDB HORS Docker (192.168.1.62:3307) — jamais docker exec mysql
3. `--skip-ssl` obligatoire pour connexion MariaDB
4. Supprimer `.next` ET `deploy/.next` avant npm run build
5. `custom-routes.ts` = approche définitive pour routes supplémentaires
6. NE JAMAIS utiliser `inject_v4_final.js`
7. Dump BDD : `mariadb-dump.exe` user=optimbtp/optimbtp host=localhost port=3307
8. Token GitHub expire → renouveler sur github.com/settings/tokens
9. Suspense requis pour `useSearchParams` dans les pages Next.js
