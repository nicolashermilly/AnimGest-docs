# Anim'Gest — Handover S58
> NoSage's Editor — Généré le 28/03/2026

---

## En-tête session

| Champ | Valeur |
|---|---|
| Date | 28/03/2026 |
| Sprint | S58 -> passe à S59 |
| Auteur | Session Claude S58 |
| Objectif | — |
| Statut | Terminé |

---

## Chemins & URLs

| Ressource | Valeur |
|---|---|
| App locale | http://localhost/app/ |
| API test | http://localhost/api/bilan |
| Docs GitHub | https://github.com/nicolashermilly/petsuite-docs |
| GitHub Pages | https://nicolashermilly.github.io/petsuite-docs/ |
| Frontend | D:\OneDrive_Perso\...\micro_logiciel_frontend_nextjs |
| Deploy | ...\micro_logiciel_frontend_nextjs\deploy |
| API source | ...\api\src\custom-routes.ts (2736 lignes, 87+ getDb()) |
| Routes | ...\api\src\routes\ |
| Docs local | C:\petsuite-docs |
| Backup propre | C:\Backup\micro_logiciel\20260315_0002 |
| Sauvegarde script | G:\Sauvegarde_micro_logiciel\Sauvegarde_micro_logiciel.ps1 |
| BDD | 192.168.1.62:3307 — micro_logiciel |

---

## 1. Ce qui a été accompli

### Front-end
- KPIs dashboard : nb_seances_a_venir -> nb_seances — 159 séances affichées
- Sidebar comportementaliste : lien "Suivi CAC" supprimé (règle CAC S57)
- /app/parametres/editions : nouvelle page Logo, Couleurs, Police, En-tête, Pied de page, CGV, Filigrane

### Back-end / API
- GET /roles/:id/permissions : colonnes RPM_* -> vrais noms BDD (module_code, can_read, can_write, can_delete)
- GET /user-permissions : détection auto colonnes -> noms directs
- GET /seances/:id : route manquante ajoutée — SELECT avec jointures STY/SST/tiers/animal/contact

### Base de données
- (aucun)

### Refactorisations
- Restauration src/ depuis backup 20260326_2317_avant_revue_code (parasites } / ); éliminés)
- Script sauvegarde v7 déployé sur G:\Sauvegarde_micro_logiciel\

### Corrections de bugs
- Route /roles/:id/permissions : parsing parts[2] corrigé (nginx strips /api/)
- Route /user-permissions : deux requêtes sans JOIN alias

---

## 2. Fichiers générés

### PowerShell .ps1 -> C:\Users\AdminPC\Downloads
- Sauvegarde_micro_logiciel.ps1 v7 — FULL_KEEP=30, Full_Copy inclut C:\Backup\micro_logiciel

### Pages front .tsx -> src/app/app/
- src/app/app/parametres/editions/page.tsx — nouvelle page éditions
- src/components/Sidebar.tsx — suppression lien Suivi CAC comportementaliste
- src/app/app/page.tsx — fix KPI nb_seances

### Routes API .ts
- GET /roles/:id/permissions — fix noms colonnes BDD
- GET /user-permissions — fix noms colonnes directs
- GET /seances/:id — ajout route manquante avec jointures

### SQL .sql -> exécution manuelle HeidiSQL
- (aucun)

### Python .py
- (aucun)

---

## 3. Bugs connus

| Bug | Module | Criticité | Statut |
|---|---|---|---|
| Formules/Abonnements — page non mise à jour | Forfaits | Haute | Ouvert |
| Audit PDF -> window.open() à remplacer | Editions | Haute | Ouvert |
| Drag & Drop agenda non fonctionnel | Planning | Moyenne | Ouvert |
| devis_ligne inexistante — retourne [] | Devis | Moyenne | Ouvert |
| Export CSV règlements manquant | Règlements | Basse | Ouvert |
| /app/elevage/declarations — page manquante | Elevage | Basse | Ouvert |

---

## 4. Score qualité

| Axe | Score |
|---|---|
| Backend | 82 / 100 |
| Frontend | 80 / 100 |
| BDD | 85 / 100 |
| Global | 82 / 100 |

> Routes API : 90 (~2736 lignes) | Pages UI : 100 | JSDoc : 133/137 | Colonnes BDD : 241/241

Frimousse (ANI_ID=22, Malinois, Jean Dujardin) : PRESERVE

---

## 5. Roadmap — S59

### ROUGE — Priorité haute (bloquant)
- Git push S57 (commit custom-routes + sidebar)
- Module Formules/Abonnements (Essentiel / Professionnel / Expert)
- Audit PDF -> Modal : remplacer tous les window.open()

### ORANGE — Priorité moyenne (fonctionnel)
- Widget Claude IA — widget flottant + chat
- Suivi CAC depuis fiche séance /app/seances/[id]
- Suivi CAC depuis EDC /app/seances/[id]/etude-comportementale
- Déplacer routes dans api/src/routes/ — commencer par factures.ts
- Services frontend src/services/
- Supprimer code mort

### JAUNE — Backlog
- /app/elevage/declarations — page manquante (route API présente)
- devis_ligne inexistante — /api/devis/:id/lignes retourne []
- Export CSV règlements — bouton manquant
- Drag & Drop agenda — /app/planning-seances

### Blocages identifiés
- WireGuard VPN port 51820 — partiellement configuré, non opérationnel

### VERT — Nouveaux modules (S59+)
- S59-S60 : Portail Client — espace séances/CAC avec login client
- S61-S63 : Carte Identité Animale — page publique liée à la puce

---

## 6. Objectif S59

> Git push S57 + démarrer Module Formules/Abonnements + Audit PDF->Modal

---

## 7. Règles critiques

```
PDF/Editions  : Modal uniquement — jamais window.open()
CAC           : accessible UNIQUEMENT depuis /app/seances/[id] — pas de lien sidebar
custom-routes : 2736 lignes, 87+ getDb(), 0 createConnection
TSX           : via scripts Python (apostrophes FR, backticks)
Docker        : cd deploy OBLIGATOIRE, COPIER_TOUTES_PAGES_v2.ps1 avant build frontend
```

---

## 8. Commandes de redémarrage

```powershell
docker ps
Invoke-RestMethod "http://localhost/api/bilan"

# Rebuild API
cd "D:\...\deploy"
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

# Sauvegarde manuelle
PowerShell -ExecutionPolicy Bypass -File "G:\Sauvegarde_micro_logiciel\Sauvegarde_micro_logiciel.ps1"
```

---

## 9. Prompt de démarrage S59

```
Reprendre handover S58.
Lire section 1 (accompli) et section 5 (roadmap).
Vérifier cohérence architecture (routes, services, pages).
Proposer plan d'action structuré pour S59.
Ne jamais patcher — intégrer proprement dans l'architecture.
Analyser arborescence.txt si disponible.
```

---
*Anim'Gest — NoSage's Editor — Handover S58 — 28/03/2026*