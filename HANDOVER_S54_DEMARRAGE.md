# PetSuite — Handover fin de session S53 → Démarrage S54
**Date :** 26 mars 2026
**Sprint :** S54
**Auteur :** Sessions Claude S52/S53 consolidées

---

## 🔗 URLs & chemins essentiels

| Ressource | Valeur |
|---|---|
| **App locale** | http://localhost/app/ |
| **Docs GitHub** | https://github.com/nicolashermilly/petsuite-docs |
| **Racine frontend** | D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs |
| **Deploy dir** | `$root\deploy` |
| **API source** | `$root\api\src\custom-routes.ts` |
| **Repo docs** | C:\petsuite-docs |
| **BDD** | 192.168.1.62:3307 — base : micro_logiciel |
| **Commit GitHub Pages** | 6a25a46 (26/03/2026) |

---

## ✅ Accompli en S52 → S53 (résumé)

### Frontend
- Planning vue Jour + Semaine + **drag & drop HTML5 natif** (v2 slot-drop, snap 30 min)
- Dashboard unique fusionné — KPIs réels + factures impayées
- Questionnaires — 3 boutons (Aperçu / Envoyer / Modifier) fonctionnels
- Généalogie éleveur restaurée dans le dashboard éleveur
- Dashboards métiers alimentés — 9 métiers
- **Tuiles modèles programmes** — 5 Comportementaliste + 3 Éducateur
- **Page Forfaits & Abonnements** — catalogue + souscriptions + modales
- Pages créées : `elevage/mortalite`, `programmes/new`, `eleveur/dashboard`, `elevage/saillies`, `elevage/portees`
- **⚠️ Rebuild frontend nécessaire** — DnD v2 + programmes + forfaits pas encore compilés

### API (custom-routes.ts) — ~80 routes total
Nouvelles routes S53 :
| Route | Statut |
|---|---|
| `GET/POST /forfaits` | ✅ actif |
| `GET/PATCH/DELETE /forfaits/:id` | ✅ actif |
| `GET/POST /forfaits/clients` | ✅ actif |
| `GET/PUT /param-yousign` | ✅ actif |
| `POST /signatures` | ✅ actif |
| `POST /signatures/:id/envoyer` | ✅ actif |
| `POST /signatures/webhook` | ✅ actif |
| `PATCH /seances/:id` | ⚠️ rebuild API en cours à l'arrêt |
| `GET /param-smtp/stripe/klarna/sms/urls` | ✅ actif |
| `GET /contacts` | ✅ actif |
| `GET /communaute` | ✅ actif |
| `GET /param-pdp` | ✅ actif |

### BDD
- **24 tables commentées** (`tiers`, `animal`, `seance`, `facture`, `reglement`, `avoir`, `devis_contrat_entete`, `condition_paiement`, `utilisateur`, `race`, `seance_type`, `seance_statut`, `seance_suivi_cac`, `elevage_portee`, `elevage_saillie`, `elevage_reservation`, `elevage_declaration`, `programme_suivi`, `achat_entete`, `inventaire_entete`, `rs_post`, `param_entreprise`, `signature_demande`, + edc_fiche)
- **2 nouvelles tables** : `forfait` + `forfait_client` (seedées avec 12 forfaits démo)

### Documentation GitHub Pages
- 79 fichiers HTML harmonisés avec charte dark (`--navy`, `--gold`)
- Commit `6a25a46` — fichiers d'audit BDD pushés (columns_export.txt, decimals_export.txt, enums_export.txt)
- `49-changelog-S53.html` et scripts Python **non encore copiés dans petsuite-docs** (voir section S54)

---

## ⚡ Actions immédiates S54 — dans l'ordre

### Étape 1 — Vérifier l'API
```powershell
$root = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
cd "$root\deploy"
docker compose ps
# Vérifier l'âge du container micro_api
# Si créé il y a plus d'1h → rebuild nécessaire
```

Si rebuild nécessaire :
```powershell
docker compose build api --no-cache && docker compose up -d api && docker compose restart nginx
```

### Étape 2 — Tester PATCH séances (DnD)
```powershell
$body = '{"SEA_DATE_DEBUT":"2026-03-26T09:00:00","SEA_DATE_FIN":"2026-03-26T10:00:00"}'
Invoke-WebRequest -Uri "http://localhost/api/seances/1" -Method PATCH -Body $body -ContentType "application/json" -UseBasicParsing | Select-Object StatusCode
# Attendu : 200
```

### Étape 3 — Vérifier toutes les routes API
```powershell
foreach ($r in @('forfaits','forfaits/clients','param-yousign','signatures','param-smtp','param-stripe','contacts','seances')) {
    try {
        $s = (Invoke-WebRequest -Uri "http://localhost/api/$r" -UseBasicParsing).StatusCode
        Write-Host "$r : $s"
    } catch { Write-Host "$r : ERREUR" }
}
```

### Étape 4 — Fix mode clair CSS (globals.css)
Cause identifiée : `h1` a `class="text-white"` hardcodé → invisible sur fond blanc.
Cellules tableau : `text-slate-200/300` → trop claires sur fond blanc.

```powershell
$py = @'
import glob, os
ROOT = r"D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs\src"
PATCH = """
/* PetSuite patch light mode S53 */
html.light h1,
html.light h1.text-white { color: #1E293B !important; }
html.light h2, html.light h3 { color: #1E293B !important; }
html.light .text-white { color: #1E293B !important; }
html.light td.text-slate-200,
html.light td.text-slate-300,
html.light td.text-slate-400 { color: #334155 !important; }
html.light .text-slate-200 { color: #334155 !important; }
html.light .text-slate-300 { color: #475569 !important; }
html.light .text-slate-400 { color: #64748B !important; }
/* end PetSuite patch light mode S53 */
"""
for f in glob.glob(os.path.join(ROOT,"**","globals.css"),recursive=True):
    c = open(f,encoding="utf-8").read()
    if "patch light mode S53" not in c:
        open(f,"w",encoding="utf-8").write(c+PATCH)
        print(f"Patche: {f}")
    else:
        print(f"Deja fait: {f}")
'@
$py | Out-File "$env:TEMP\fix_light.py" -Encoding utf8
python "$env:TEMP\fix_light.py"
```

### Étape 5 — Corriger accents dans les pages TSX
```powershell
$py = @'
import glob, os
ROOT = r"D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs\src"
FIXES = [
    ('"Seances"','"Séances"'),(">Seances<",">Séances<"),
    ("158 elements","158 séances"),
    ("Seances a venir","Séances à venir"),
    ("Factures impayees","Factures impayées"),
    ("Centre equestre","Centre équestre"),
    (">Eleveur<",">Éleveur<"),
    ("Etudes Comportementales","Études Comportementales"),
    ("Seances de suivi","Séances de suivi"),
    ("Seances toilettage","Séances toilettage"),
    ("Realisees","Réalisées"),
]
total = 0
for fpath in glob.glob(os.path.join(ROOT,"**","*.tsx"),recursive=True):
    if "node_modules" in fpath or ".next" in fpath: continue
    c = open(fpath,encoding="utf-8",errors="replace").read()
    orig = c
    for old,new in FIXES:
        c = c.replace(old,new)
    if c != orig:
        open(fpath,"w",encoding="utf-8").write(c)
        print(f"Fix: {fpath.split(chr(92))[-1]}")
        total += 1
print(f"Total: {total} fichiers modifies")
'@
$py | Out-File "$env:TEMP\fix_accents.py" -Encoding utf8
python "$env:TEMP\fix_accents.py"
```

### Étape 6 — Rebuild frontend
```powershell
$root = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
cd $root
.\COPIER_TOUTES_PAGES_v2.ps1
cd deploy
docker compose build frontend --no-cache && docker compose up -d frontend && docker compose restart nginx
```

### Étape 7 — Mettre à jour documentation GitHub Pages
```powershell
cd C:\petsuite-docs

# Copier les fichiers depuis les outputs Claude
# (les fichiers sont dans les outputs de la session Claude)
# - 49-changelog-S53.html
# - update_html_charte_s53.py (applique charte sur BRIEFING_S37/38/39/40)

# Exécuter le script de mise à jour charte HTML
python update_html_charte_s53.py

# Commit
git add -A
git commit -m "doc: changelog S53 + charte BRIEFING files"
git pull --rebase
git push
```

---

## 🚧 Développements S54

| Priorité | Sujet | Notes |
|---|---|---|
| 🔴 | Tester drag & drop planning | PATCH /seances/:id doit retourner 200 |
| 🔴 | Rebuild frontend | DnD v2 + programmes + forfaits pas buildés |
| 🟠 | Fix mode clair CSS | h1 class="text-white" invisible, td text-slate trop pâle |
| 🟠 | Bug stats Séances/Clients/Animaux = 0 | Jointure SST à affiner dans /stats/kpis |
| 🟠 | Suivi cases à cocher comportementaliste | Redirige vers mauvais écran |
| 🟡 | Page `/app/avoirs` | Route /api/avoirs HTTP 200, page frontend manquante |
| 🟡 | Page `/app/elevage/declarations` | Route API déjà là |
| 🟡 | `/app/elevage/mortalite` | Squelette seulement, à développer |
| 🟡 | Modèles programmes autres métiers | Toiletteur, Pet-sitter, Éleveur, Véto, Équestre |
| 🟡 | Nommages accents | "Séances", "Études Comportementales", "Réalisées" |
| 🟡 | Role topbar | Affiche "Role : —" → afficher le vrai rôle |
| 🟡 | `devis_ligne` inexistante | /api/devis/:id/lignes retourne [] |
| 🟡 | Docs HTML BRIEFING_S37/38/39/40 | Pas encore de charte navy/gold |
| 🟡 | 49-changelog-S53.html | À copier dans petsuite-docs et pusher |
| 🟢 | Yousign test end-to-end | Configurer clé sandbox dans param_yousign |
| 🟢 | BDD tables secondaires | article_prestation, crm_lead, facture_ligne, etc. |

---

## 📊 Chiffres clés au 26/03/2026

| Métrique | Valeur |
|---|---|
| Pages UI compilées | 96 (actuel) — rebuild nécessaire pour forfaits/DnD |
| Routes API custom | ~80 routes |
| Tables BDD commentées | 24 tables principales |
| Tables BDD ajoutées S53 | forfait + forfait_client |
| Forfaits de démo | 12 (4 Toiletteur + 4 Pension + 4 Équestre) |
| Factures | 279 |
| Clients/tiers | 167 |
| Séances | 159 |
| CA 12 mois | 48 014 € |
| Fichiers HTML docs | 84 (dont 4 BRIEFING sans charte) |
| Commit GitHub Pages | 6a25a46 |

---

## 🔧 Règles critiques

```powershell
# Toujours définir $root en début de session
$root = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"

# Séquence deploy frontend
cd $root
.\COPIER_TOUTES_PAGES_v2.ps1
cd deploy
docker compose build frontend --no-cache
docker compose up -d frontend
docker compose restart nginx

# Séquence deploy API
cd "$root\deploy"
docker compose build api --no-cache
docker compose up -d api
docker compose restart nginx

# Si container avec nom bizarre (ex: 8a1ad9e_micro_api)
cd "$root\deploy"
docker compose down && docker compose up -d

# Lire fichier [id]
$f = Join-Path $root "src\app\app\xxx\[id]\page.tsx"
$c = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# TypeScript complexe → Python obligatoire
$py = @'...code python...'@
$py | Out-File "$env:TEMP\script.py" -Encoding utf8
python "$env:TEMP\script.py"

# Git docs
cd C:\petsuite-docs
git add -A && git commit -m "doc: ..." && git pull --rebase && git push
```

### Pattern API obligatoire (avec body parsing POST/PATCH)
```typescript
app.use('/ma-route', async (req: any, res: any) => {
  // Body parsing manuel obligatoire pour POST/PATCH
  const b: any = await new Promise<any>((resolve) => {
    if (req.body && Object.keys(req.body).length > 0) { resolve(req.body); return; }
    let data = '';
    req.on('data', (chunk: any) => { data += chunk; });
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
  });
  const db = await mysql.createConnection({
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT),
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  try {
    const [rows] = await db.execute("SELECT ...", [params]);
    res.json(rows);
  } catch(e: any) { res.status(500).json({ error: e.message }); }
  finally { await db.end(); }
});
// ⚠️ Nginx strip /api/ → routes SANS /api/
// ⚠️ DbService inaccessible → mysql2/promise direct uniquement
// ⚠️ app.use() obligatoire (pas app.get()) pour query params
// ⚠️ Pas d'apostrophes françaises dans les strings TypeScript
```

### Charte CSS PetSuite (frontend)
| Variable | Valeur | Usage |
|---|---|---|
| `--surface-page` | `#0F172A` (dark) | Fond général |
| `--surface-card` | `#1E293B` (dark) | Cards |
| `--text-primary` | `#F1F5F9` (dark) / `#1E293B` (light) | Texte principal |
| `--text-secondary` | `#94A3B8` | Texte secondaire |
| `--color-primaire` | `#4F46E5` | Accent violet |

### Charte CSS Documentation GitHub (HTML)
| Variable | Valeur |
|---|---|
| `--navy` | `#0D2137` |
| `--gold` | `#D4A843` |
| `--dark` | `#070F1A` |
| `--white` | `#F8F8F5` |

---

## 🔍 Diagnostic mode clair — cause identifiée

**Problème :** `h1` hardcodé `class="text-white"` → `rgb(255,255,255)` sur fond blanc = invisible.

**Éléments concernés :**
- `h1.text-white` → toutes les pages (factures, séances, statistiques, etc.)
- `td.text-slate-200` / `td.text-slate-300` → lignes de tableaux (numéros, dates, clients)
- Classes hardcodées Tailwind qui n'ont pas de surcharge dark: prefix

**Fix CSS confirmé (à injecter dans globals.css) :**
```css
/* PetSuite patch light mode S53 */
html.light h1, html.light h1.text-white { color: #1E293B !important; }
html.light h2, html.light h3 { color: #1E293B !important; }
html.light .text-white { color: #1E293B !important; }
html.light td.text-slate-200,
html.light td.text-slate-300,
html.light td.text-slate-400 { color: #334155 !important; }
html.light .text-slate-200 { color: #334155 !important; }
html.light .text-slate-300 { color: #475569 !important; }
html.light .text-slate-400 { color: #64748B !important; }
```

---

## 🔒 Backup propre
`C:\Backup\micro_logiciel\20260315_0002`
⚠️ Backups à partir de `20260315_0042` = code corrompu — **ne pas utiliser**
