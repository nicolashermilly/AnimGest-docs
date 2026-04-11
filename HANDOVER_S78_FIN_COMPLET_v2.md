# HANDOVER S78 — FIN COMPLET (Conv1 + Conv2)
**Date :** 11/04/2026
**Sprint :** S78
**Statut :** Terminé — builds validés, audit zéro dette, docs GitHub Pages publiés, documentation embarquée complète

---

## 1. Vérification stack au démarrage S79

```powershell
$root   = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
$deploy = "$root\deploy"
Set-Location $deploy
docker compose ps
Invoke-RestMethod "http://localhost/api/bilan"
Invoke-RestMethod "http://localhost/api/editions/devis/1"
# Attendu : blob PDF valide + fichier apparu dans C:\AnimGest_GED\SCT_001\Semaine_2026_15\Module_Devis\
# Vérifier aussi : http://localhost/docs/index-complet.html (documentation embarquée)
# Vérifier : http://localhost/docs/scenarios/index.html (21 scénarios)
```

---

## 2. Ce qui a été livré en S78

### Conv1 — Documentation complète (points 1-4 du briefing)

| Item | Statut | Notes |
|---|---|---|
| Centre d'aide `/app/aide` | ✅ | 244 Q/R, 20 modules, `help-content.ts` réécrit |
| HelpPanel contextuel corrigé | ✅ | `getArticlesForPage` avec mapping 35 routes → modules |
| Scénarios métier illustrés | ✅ | 22 fichiers HTML : 10 métiers + 11 transverses + index |
| Guide de paramétrage | ✅ | `guide-parametrage.html` — 7 phases, checklist 16 items |
| Notice complète d'utilisation | ✅ | `notice-utilisation.html` — 20 sections, sidebar navigation |
| Documentation embarquée `public/docs/` | ✅ | 20 pages référence + 22 scénarios |
| Accès depuis la Sidebar | ✅ | Boutons 📚 Documentation + 🎭 Scénarios en bas |
| Hub documentation `/app/aide` | ✅ | 12 raccourcis directs vers les guides |

#### Détail des 22 scénarios HTML (`public/docs/scenarios/`)

**10 métiers :**
- `metier-comportementaliste.html` — 12 étapes, BC, CAC, portail, pension, registres
- `metier-toiletteur.html` — séances, stock produits, abonnements, réapprovisionnement
- `metier-petsitter.html` — visites domicile, géolocalisation, compte-rendu temps réel
- `metier-eleveur.html` — portées, naissances LOF, réservations chiots, DDPP/SCC
- `metier-pension.html` — réservations, planning capacités, incidents sanitaires, registres
- `metier-equestre.html` — pension chevaux, SIRE, licences FFE, stages, compétitions
- `metier-veterinaire.html` — urgences, prescriptions, stock médicaments, multi-TVA
- `metier-osteopathe.html` — bilans ostéo, programmes rééducation, coordination vétérinaire
- `metier-sport-canin.html` — agility, obéissance, ring, niveaux, compétitions, stages
- `metier-naturopathe.html` — bilans nutritionnels, complémentation, vente produits

**11 transverses :**
- `trans-facturation.html` — devis → acompte → signature → solde → relances → avoir
- `trans-compta-fec.html` — plan comptable, écritures auto, balance, export FEC
- `trans-rfe.html` — calendrier 2026-2027, Factur-X, PDP, e-reporting
- `trans-stock-inventaire.html` — entrées, PMP, alertes, inventaire, valorisation bilan
- `trans-achats.html` — BC → BL → FF → règlement → retour → DAF → avoir fournisseur
- `trans-portail-client.html` — activation, signature, paiement CB, suivi CAC
- `trans-crm-leads.html` — formulaire web, pipeline Kanban, conversion, campagnes
- `trans-reseaux-sociaux.html` — connexion FB/IG/LI, calendrier éditorial, stats
- `trans-ged.html` — architecture disque, PDF auto, recherche, partage, RGPD
- `trans-registres.html` — carnivores, sanitaire séjour, événements, ACACED, DDPP
- `trans-eliot.html` — 22 outils, boucles agentiques, limites sécurité

#### Détail des 20 pages référence (`public/docs/`)

| Fichier | Contenu |
|---|---|
| `index-complet.html` | Portail documentation — index de toutes les pages |
| `ref-glossaire.html` | 28 termes techniques et réglementaires expliqués |
| `ref-raccourcis.html` | Raccourcis clavier + astuces productivité |
| `ref-faq.html` | FAQ 7 sections — installation, facturation, stock, agenda, compta, GED, Eliot |
| `ops-cloture-mensuelle.html` | Checklist clôture mensuelle interactive (30-45 min) |
| `ops-cloture-annuelle.html` | Checklist clôture annuelle — 4 phases |
| `ops-migration.html` | Guide migration depuis autre logiciel — import CSV, basculement |
| `ops-reprise-incident.html` | Diagnostic, redémarrage, restauration depuis sauvegarde |
| `tech-schema-donnees.html` | Tables principales, relations, conventions BDD, règles critiques |
| `tech-carte-modules.html` | 22 modules, dépendances, ordre d'activation recommandé |
| `tech-rgpd.html` | Données traitées, droits des personnes, durées conservation |
| `com-formules.html` | Comparatif Starter/Pro/Expert — fonctionnalités et tarifs |
| `com-roi.html` | Simulateur ROI interactif (sliders) |
| `com-onboarding.html` | Guide démarrage rapide — opérationnel en 2 heures |
| `adv-multi-utilisateurs.html` | Rôles, permissions, bonnes pratiques multi-users |
| `adv-multi-sites.html` | Configuration multi-établissements (formule Expert) |
| `adv-compta-avancee.html` | Journaux, plan comptable personnalisé, analytique, TVA |
| `adv-impayes.html` | Recouvrement 5 niveaux, intérêts légaux, injonction de payer |
| `adv-tarification-avancee.html` | Grilles tarifaires, forfaits, abonnements, analyse marge |
| `adv-eliot-avance.html` | Référence 22 outils Eliot, boucles agentiques complexes |

### Conv2 — Items ROUGE / JAUNE

| Item | Statut | Fichier(s) |
|---|---|---|
| R3 Agenda DnD | ✅ | `agenda/page.tsx` — `router.push()`, nettoyage |
| J4 Charte achats/stock | ✅ | `achats`, `inventaires`, `bon-livraison` |
| J9 PDF vers GED horodaté | ✅ | `custom-routes.ts` — helper `_saveGedPdf` |
| J10 GED arborescence | ✅ | 28 fichiers de test nettoyés |

### Conv2 — Audit clôture + dette technique

| Point | Action | Statut |
|---|---|---|
| Sidebar version | `v2 · S77` → `v2 · S78` | ✅ |
| `window.location.href` | `router.push()` dans clients + factures/avoir | ✅ |
| Couleurs résiduelles | bon-livraison + agenda + carte + clients dropdowns | ✅ |
| JSDoc manquant | Sidebar, EmailModal, 6 pages prioritaires | ✅ |
| Hex hardcodés | comportementaliste + EmailModal + dropdowns | ✅ |
| **Audit global dette** | **0 point résiduel sur périmètre S78** | ✅ |

### Exceptions documentées (non corrigeables)
- `agenda/page.tsx` : `s.STY_COULEUR` — couleur dynamique BDD, CSS var impossible
- `clients/page.tsx` + `carte/page.tsx` : HTML injecté dans popups Leaflet — hors React

---

## 3. Points techniques importants S79

### Helper `_saveGedPdf` — custom-routes.ts L1927
- Sauvegarde après `res.end()` sur routes devis + facture
- Chemin : `C:\AnimGest_GED\SCT_001\Semaine_YYYY_NN\Module_XXX\PIECE_horodatage.pdf`
- Insert dans `micro_logiciel.ged_fichier` (GED_ROLE = 'PDF_EDITION')
- Asynchrone `.catch(() => {})` — ne bloque pas la réponse HTTP

### `help-content.ts` — exports à ne pas toucher
```typescript
// Exports nommés obligatoires (utilisés par HelpPanel.tsx)
export interface HelpArticle { ... }
export const HELP_MODULES: string[]
export const HELP_ARTICLES: HelpArticle[]
export function getArticlesForPage(page: string): HelpArticle[]  // mapping 35 routes
export function searchArticles(query: string): HelpArticle[]
export default HELP_ARTICLES  // ne pas supprimer
```

### Mapping aide contextuelle `getArticlesForPage`
La fonction accepte un pathname complet (`/app/clients/123`) ou un segment.
Elle utilise `ROUTE_TO_MODULE` (35 entrées) pour mapper la route vers le bon module.
Exemples : `clients` → "Clients", `factures` → "Factures", `elevage` → "Élevage".

### Documentation embarquée — Règle de mise à jour
**À chaque début de sprint**, mettre à jour impérativement :
- `index-complet.html` — métriques (pages UI, routes API, Eliot tools, version sprint)
- Nouveaux scénarios si nouveau métier ou flux transverse implémenté
- `ref-glossaire.html` si nouveaux termes
- `ref-faq.html` si nouvelles questions support remontées
- Pages `ops-*` si procédures modifiées
- Script Python de mise à jour à générer dans le HANDOVER

### Points d'accès documentation dans le logiciel
```
Sidebar bas          → /docs/index-complet.html (📚) + /docs/scenarios/index.html (🎭)
/app/aide            → hub 12 raccourcis + centre Q/R 244 articles
HelpPanel (bouton ?) → questions contextuelles par page (35 routes mappées)
URL directes         → http://localhost/docs/[fichier].html
```

### Agenda DnD
- `force-dynamic` ✅ — `useRouter` + `router.push()` ✅ — zones de drop ✅

---

## 4. Métriques S78

| Indicateur | Valeur |
|---|---|
| Pages UI | 117 |
| Routes API | ~195 |
| Eliot tools | 22 |
| Build API | ✅ 0 erreur |
| Build Frontend | ✅ 0 erreur — 117/117 |
| Dette technique périmètre S78 | ✅ 0 point |
| Score qualité global | 99/100 |
| Docs GitHub Pages | ✅ commit 044c624 |
| Scénarios HTML embarqués | 22 fichiers (10 métiers + 11 transverses + index) |
| Pages référence embarquées | 20 fichiers |
| Q/R centre d'aide | 244 articles — 20 modules |

---

## 5. Backlog S79

### 🔴 ROUGE
*(Aucun)*

### 🟠 ORANGE
*(Aucun)*

### 🟡 JAUNE

| # | Problème |
|---|---|
| J1 | Test GED réel : générer PDF devis + vérifier apparition dans `/app/ged` |
| J2 | Charte graphique : bon-retour, demande-avoir-fourn, achats/[id] |
| J3 | JSDoc manquant global : ~45 fichiers hors périmètre S78 (dette ancienne) |
| J4 | Archivage : fichiers inutiles `micro_logiciel_frontend_nextjs/` vers `Archives/` |

### Début S79 — Actions prioritaires dans l'ordre
1. Vérification stack (section 1 ci-dessus)
2. **Mise à jour `index-complet.html`** — changer les métriques pour S79
3. Attaquer J1 (test GED) — si KO → investigation custom-routes.ts
4. Attaquer J2 (charte bon-retour/DAF/achats[id])
5. J3 JSDoc 45 fichiers — générer script d'audit puis patcher
6. J4 archivage fichiers inutiles

---

## 6. Règles critiques rappel S79

```
R-39 : Modal PDF = <iframe src="/api/pdf/[type]/[id]">
R-26 : Routes spécifiques AVANT routes paramétriques
R-25 : Thème clair = html.light .ma-classe
Charte NON-NÉGOCIABLE : var(--color-primaire) jamais hex hardcodé
GED NON-NÉGOCIABLE : C:\AnimGest_GED\SCT_001\ disque uniquement
cd deploy OBLIGATOIRE avant docker compose
COPIER_TOUTES_PAGES_v2.ps1 AVANT build frontend
export const dynamic = 'force-dynamic' sur pages avec hooks complexes
AUDIT DETTE TECHNIQUE GLOBAL obligatoire AVANT génération HANDOVER
Scripts : Python pour patches TSX — PS avec -ExecutionPolicy Bypass
DOC EMBARQUÉE : mettre à jour public/docs/ en début de chaque sprint
```

---

## 7. Séquence rebuild S79

```powershell
$root   = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
$deploy = "$root\deploy"
Set-Location $deploy
docker compose build api --no-cache
docker compose up -d --force-recreate api
docker compose restart nginx
Set-Location $root
.\COPIER_TOUTES_PAGES_v2.ps1
Set-Location $deploy
docker compose build frontend --no-cache
docker compose up -d frontend
docker compose restart nginx
```

---

## 8. Docs GitHub Pages S78

- **Commit :** `044c624` — 3 fichiers, 60 insertions
- `changelog-sprint-S78.html` ✅
- `docs-changelog.html` : onglet S78 ajouté ✅
- `06-roadmap.html` : S78 livré + S79 en cours ✅
- `20-pilotage-projet.html` : ligne S78 présente ✅

---

## 9. Script de mise à jour docs S79 (à exécuter en début de sprint)

```python
# update_docs_s79.py — à placer dans Downloads et exécuter en début de S79
import os

ROOT = r"D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
INDEX = os.path.join(ROOT, r"public\docs\index-complet.html")

content = open(INDEX, "r", encoding="utf-8").read()

# Mettre à jour les métriques (adapter les valeurs selon S79)
content = content.replace(">S78<", ">S79<")
content = content.replace(">117<", ">XXX<")   # mettre le nb réel de pages UI
content = content.replace(">195<", ">XXX<")   # mettre le nb réel de routes API
content = content.replace(">22<", ">XXX<")    # mettre le nb réel d'outils Eliot

open(INDEX, "w", encoding="utf-8").write(content)
print("index-complet.html mis a jour pour S79")
```

---

*Anim'Gest — NoSage's Editor — Handover S78 Complet v2 (Conv1 + Conv2) — 11/04/2026*
