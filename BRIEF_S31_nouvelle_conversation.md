# BRIEF S30 → S31 — PetSuite / micro_logiciel
## Date : 15/03/2026 — Fin session S30

---

## SITUATION STACK AU MOMENT DE LA FERMETURE

### Conteneurs Docker
| Conteneur | État | Note |
|---|---|---|
| micro_frontend | ✅ UP | Build 58 pages OK |
| micro_nginx | ✅ UP | Reverse proxy :80 |
| micro_api | ✅ UP | NestJS + custom-routes S30 actifs |
| MariaDB | ✅ UP | 192.168.1.62:3307 — HORS Docker |

### État API — IMPORTANT
- `api/src/custom-routes.ts` — 259 lignes, toutes routes S27→S30 présentes
- Routes S30 ajoutées : `/dashboard/stats`, `/parametres/metier`, `/programmes`, `/ged-admin-roles`, `/ged-devis-formule`, `/ged-edc-sans-devis`, `/ged-formulaire-lead`, `/ged-factures-email`
- Backup propre : `C:\Backup\micro_logiciel\20260315_1633_PROPRE\`

### Convention injection — DÉFINITIVE
- ✅ **custom-routes.ts** dans `api/src/` — approche définitive
- Si custom-routes échoue : `docker compose build api --no-cache && docker compose up -d api`

---

## SQL S30 — ÉTAT

| Migration | État |
|---|---|
| Toutes migrations S28/S29 | ✅ |
| `programme_suivi` + `programme_semaine` | ⚠️ Tables à créer si manquantes |
| `param_metier` | ⚠️ Table à créer (route retourne {} si absente) |

### Script SQL à vérifier au démarrage S31
```sql
-- Vérifier existence tables S30
SHOW TABLES LIKE 'programme_suivi';
SHOW TABLES LIKE 'programme_semaine';
SHOW TABLES LIKE 'param_metier';

-- Si manquantes, créer :
CREATE TABLE IF NOT EXISTS micro_logiciel.programme_suivi (
  PRG_ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ANI_ID INT NOT NULL,
  TIE_ID INT NOT NULL,
  PRG_TITRE VARCHAR(200) NOT NULL,
  PRG_DATE_DEBUT DATE NOT NULL,
  PRG_NB_SEMAINES INT NOT NULL DEFAULT 8,
  PRG_STATUT ENUM('EN_COURS','TERMINE','PAUSE') NOT NULL DEFAULT 'EN_COURS',
  PRG_OBJECTIF TEXT NULL,
  PRG_CREE_LE DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS micro_logiciel.programme_semaine (
  SEW_ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  PRG_ID INT NOT NULL,
  SEW_NUMERO INT NOT NULL,
  SEW_TITRE VARCHAR(200) NOT NULL DEFAULT '',
  SEW_OBJECTIFS TEXT NULL,
  SEW_EXERCICES TEXT NULL,
  SEW_NOTES TEXT NULL,
  SEW_STATUT ENUM('A_FAIRE','EN_COURS','REALISE') NOT NULL DEFAULT 'A_FAIRE',
  CONSTRAINT fk_sew_prg FOREIGN KEY (PRG_ID) REFERENCES programme_suivi(PRG_ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS micro_logiciel.param_metier (
  ID INT NOT NULL PRIMARY KEY DEFAULT 1,
  MET_NOM VARCHAR(150) NOT NULL DEFAULT '',
  MET_ACTIVITE VARCHAR(150) NOT NULL DEFAULT '',
  MET_DEVISE CHAR(3) NOT NULL DEFAULT 'EUR',
  MET_LANGUE CHAR(2) NOT NULL DEFAULT 'fr'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## SAUVEGARDE — OPÉRATIONNELLE ✅

| Composant | État |
|---|---|
| Script v5 | `G:\Sauvegarde_micro_logiciel\Sauvegarde_micro_logiciel.ps1` |
| Dump BDD | `mariadb-dump.exe` local — `backup_AAAA-MM-JJ.zip` |
| ZIP projet | `projet_AAAA-MM-JJ.zip` (203 fichiers) |
| Fichiers critiques | custom-routes.ts, docker-compose.yml, help-content.ts |
| Git push | Token configuré — push automatique |
| Tâche planifiée | À créer (déclenchement 04h00) |

### Créer la tâche planifiée sauvegarde (si pas encore fait)
```powershell
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-ExecutionPolicy Bypass -File `"G:\Sauvegarde_micro_logiciel\Sauvegarde_micro_logiciel.ps1`""
$trigger = New-ScheduledTaskTrigger -Daily -At "04:00"
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 1)
Register-ScheduledTask -TaskName "PetSuite_Sauvegarde" -Action $action -Trigger $trigger -Settings $settings -RunLevel Highest -Force
```

---

## FRONTEND — Build 58 pages ✅

### Pages déployées S30
- `/app/achats/[id]` → fiche achat avec lignes
- `/app/clients/[id]` → intégration composant ReseauxSociaux
- Filtre animaux par client corrigé (API)
- Centre d'aide → opérationnel (rebuild frontend)

### Composants S30
- `ReseauxSociaux.tsx` → icônes LinkedIn/FB/IG/WA dans fiche client

---

## ROUTES API DISPONIBLES (via custom-routes.ts) — COMPLET S30

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
| /ged-factures-email/:id | POST | S30 |
| /programmes | GET/POST | S30 |
| /programmes/:id | GET | S30 |
| /programmes/:id/semaines/:num | PATCH | S30 |
| /ged-devis-formule/:id/seances | GET | S30 |

---

## CHEMINS IMPORTANTS

```
Frontend src  : D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs\src
Deploy        : D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs\deploy
API src       : D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs\api\src
Backups       : C:\Backup\micro_logiciel\
Sauvegarde    : G:\Sauvegarde_micro_logiciel\
Git docs      : C:\petsuite-docs\
```

---

## ROADMAP S31 — PRIORITÉS

### Priorité 1 — SQL (tables manquantes S30)
- [ ] Créer `programme_suivi`, `programme_semaine`, `param_metier`
- [ ] Extensions `animal` : alimentation, médicaments, habitudes, contact_veto, ferrure, photo
- [ ] Extensions `tiers` : numéro urgence, instructions, RC_Pro

### Priorité 2 — Module Éditions (CGV + Documents métier)
- [ ] CGV paramétrables dans Mes Paramètres → Éditions spécifiques
- [ ] Contrats de prestation avec champs de fusion (solution intégrée)
- [ ] Ajout annexes CGV/contrats en fin de Devis/Facture

### Priorité 3 — Carnet pension DDPP
- [ ] Table `pension_sejour` (entrée/sortie, animal, propriétaire, sanitaire)
- [ ] Vue registre DDPP
- [ ] Export PDF conforme

### Priorité 4 — Frontend S31
- [ ] Page `/app/mes-parametres/metier` (devise, langue, activité)
- [ ] Tâche planifiée sauvegarde Windows
- [ ] Nettoyage Git (fichiers obsolètes)
- [ ] HTML docs mis à jour sur Git

---

## ROADMAP S32 — VUE D'ENSEMBLE

### 14 métiers couverts
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

### Mutualisations confirmées
| Table | Extensions S31 |
|---|---|
| `animal` | alimentation, médicaments, habitudes, contact_veto, ferrure, photos |
| `tiers` | numéro urgence, instructions, RC_Pro |
| `seance` | photos, type métier, exercices domicile |
| Module Éditions | contrats, CGV, autorisations, décharges, champs fusion |
| Agenda | rappels auto, tournées, optimisation trajets |

### Fonctionnalités transversales S32
- [ ] Internationalisation FR/EN/IT/DE/ES
- [ ] Devise paramétrable (€, $, £, CHF...)
- [ ] Registre élevage DDPP/I-CAD/SCC
- [ ] Suivi génétique reproducteurs
- [ ] Réservations en ligne
- [ ] Planning multi-ressources (moniteurs, chevaux, boxes)
- [ ] Carnet santé électronique

---

## RÈGLES ABSOLUES

1. `cd deploy` AVANT toute commande docker compose
2. MariaDB HORS Docker (192.168.1.62:3307) — jamais `docker exec micro_api mysql`
3. `--skip-ssl` pour connexion MariaDB
4. Suspense requis pour useSearchParams
5. Supprimer .next ET deploy/.next avant npm run build
6. Token GitHub expire → renouveler sur https://github.com/settings/tokens
7. custom-routes.ts = approche définitive pour les routes API
8. NE JAMAIS utiliser inject_v4_final.js
9. Dump BDD : `C:\ProgramData\OptimBTP\MariaDB\bin\mariadb-dump.exe` user=optimbtp/optimbtp host=localhost port=3307
