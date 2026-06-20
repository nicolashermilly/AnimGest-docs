# Charte graphique — Anim'Gest / NoSage's Editor (Documentation)

> Référence du design system des pages de **documentation** publiques (`no-sages-editor.com`).
> Source de vérité : `20-pilotage-projet.html`. Toute nouvelle page docs doit respecter cette charte.
>
> Thème : **dark navy + accent or**. Identifiants/classes en anglais, contenu en français.

---

## 1. Fondations

| Aspect | Choix |
|---|---|
| Thème | Sombre uniquement (fond navy `#0F172A`) |
| Accent principal | Or `#F59E0B` (usage parcimonieux : titres, bordures actives, chiffres clés) |
| Largeur de contenu | `.main` = `max-width: 960px`, padding `48px 24px` |
| Interligne corps | `1.6` |

### Typographies (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Police | Rôle | Graisses | Exemples d'usage |
|---|---|---|---|
| **Playfair Display** (serif) | Display / titres | 400 · 600 · 700 | `h1` hero, `.section-title`, `.kpi-value`, `.score-value`, `.nav-logo` |
| **DM Sans** (sans) | Corps de texte | 300 · 400 · 500 · 600 | `body`, libellés, descriptions |
| **DM Mono** (mono) | Chiffres & code | 400 · 500 | `.num`, `.sprint-num`, `.mono`, `<code>`, identifiants techniques |

---

## 2. Palette (tokens CSS)

### Surfaces & texte

| Token | Hex | Usage |
|---|---|---|
| `--navy` | `#0F172A` | Fond principal |
| `--navy-800` | `#1E293B` | Fond surélevé / hover cartes / roadmap-item |
| `--navy-700` | `#334155` | Surface tertiaire |
| `--navy-600` | `#475569` | Surface tertiaire (variante) |
| `--card` | `#1E293B` | Fond des cartes |
| `--border` | `#1E293B` | Bordures neutres |
| `--text` | `#E2E8F0` | Texte principal |
| `--text-muted` | `#94A3B8` | Texte secondaire / libellés |

### Accent or

| Token | Hex | Usage |
|---|---|---|
| `--gold` | `#F59E0B` | Accent principal (titres, bordures actives, KPI, liens nav hover) |
| `--gold-light` | `#FCD34D` | Variante claire |
| `--gold-pale` | `#FEF3C7` | Fond très clair (rare) |

### Sémantique

| Token | Hex | Usage |
|---|---|---|
| `--cyan` | `#06B6D4` | Backend / tag API |
| `--violet` | `#4F46E5` | Frontend (texte clair associé : `#818CF8`) |
| `--green` | `#10B981` | Succès / terminé / delta positif / IA |
| `--red` | `#EF4444` | Erreur / priorité rouge (texte clair : `#FCA5A5`) |
| `--orange` | `#F97316` | Priorité haute |

> **Règle de transparence** : les fonds colorés sont en `rgba(<couleur>, 0.1)` et les bordures en `rgba(<couleur>, 0.2–0.4)`. Le texte reste la couleur pleine. Ex. tag API : fond `rgba(6,182,212,0.1)`, bordure `rgba(6,182,212,0.2)`, texte `var(--cyan)`.

---

## 3. Échelle typographique

| Élément | Police | Taille | Graisse | Couleur |
|---|---|---|---|---|
| `h1` (hero) | Playfair | `2.4rem` | 700 | `#F8FAFC` |
| `.kpi-value` | Playfair | `2.2rem` | 700 | `--gold` |
| `.score-value` | Playfair | `2rem` | 700 | variante sémantique |
| `.section-title` | Playfair | `1.3rem` | 600 | `#F8FAFC` |
| `.nav-logo` | Playfair | `1.1rem` | 700 | `--gold` |
| Corps | DM Sans | `~0.85–0.95rem` | 400–500 | `--text` / `--text-muted` |
| Eyebrow / labels | DM Sans | `0.7rem` | 600 | majuscules, `letter-spacing 0.08–0.15em` |

---

## 4. Rayons & espacements

| Usage | Valeur |
|---|---|
| Cartes (`.sprint-item`, `.score-card`) | `border-radius: 10px` |
| Cartes secondaires (`.roadmap-item`) | `8px` |
| Badges carrés (`.num`, `.sprint-num`) | `6px` |
| Pills (`.tag`, `.kpi-badge`, statuts) | `10–20px` |
| Pastilles priorité (`.dot-*`) | `50%` (10×10px) |
| Gap entre sections | `.section { margin-bottom: 48px }` |
| Padding nav | `14px 32px` |
| Padding hero | `60px 32px 48px` |

---

## 5. Règles d'usage

- **CSS variables uniquement** dans les composants — aucun hex codé en dur (cohérent R-25).
- **Or = parcimonie.** L'accent or porte la hiérarchie (titres, bordure de la carte « current », chiffres clés). Ne pas le diffuser partout.
- **Sémantique cohérente.** Backend → cyan, Frontend → violet, BDD → or, Fix → rouge, IA → vert. Réutiliser ce mapping pour tout nouveau tag.
- **Mono pour le technique.** Numéros de sprint, identifiants, chemins, code → DM Mono (`.mono` / `<code>`).
- **Priorités** : rouge (`--red`) / orange (`--orange`) / vert (`--green`) via `.dot-rouge|orange|vert`.
- **Hover** : bordures qui passent au or translucide (`rgba(245,158,11,0.25)`).

---

## 6. Catalogue de composants

| Composant | Classes clés | Description |
|---|---|---|
| **Nav** | `nav`, `.nav-logo`, `.nav-badge` | Barre sticky, fond `rgba(15,23,42,0.95)` + `backdrop-filter: blur(12px)`, bordure basse or translucide. Badge = sprint courant. |
| **Hero** | `.hero`, `.hero-label`, `h1` | Dégradé navy + halo radial or (`::before`). Eyebrow `.hero-label` (pill majuscule or). Titre Playfair. |
| **KPI grid** | `.kpi-grid`, `.kpi-card`, `.kpi-value`, `.kpi-label`, `.kpi-badge` | Grille 5 colonnes, séparée par un gap 1px sur fond or translucide. Valeur Playfair or, badge delta vert. |
| **Titre de section** | `.section-title`, `.num` | Titre Playfair + bordure basse or. `.num` = badge carré DM Mono (`01`, `02`…). |
| **Sprint card** | `.sprint-item(.current)`, `.sprint-header`, `.sprint-num`, `.sprint-status`, `.sprint-items`, `.sprint-tags` | Carte repliable. États : `.status-current` (or), `.status-done` (vert). Liste à puces `▸` or. |
| **Tags** | `.tag` + `.tag-api/front/bdd/fix/ia` | Pills sémantiques (voir mapping §5). |
| **Score card** | `.score-card`, `.score-value`, `.score-delta`, `.score-backend/front/bdd/global` | Grille 4 colonnes. Valeur Playfair colorée, delta vert. |
| **Roadmap** | `.priority-block`, `.priority-title`, `.dot-rouge/orange/vert`, `.roadmap-item` | Blocs par priorité avec pastille colorée + cartes `--navy-800`. |
| **Table dette** | `.dette-table`, `.mono` | En-têtes majuscules muted, lignes muted, 1ʳᵉ colonne accentuée, technique en mono. |
| **Footer** | `footer` | Centré, bordure haute, texte muted, liens or. |

---

## 7. Bloc `:root` à copier

```css
:root {
  --navy: #0F172A;
  --navy-800: #1E293B;
  --navy-700: #334155;
  --navy-600: #475569;
  --gold: #F59E0B;
  --gold-light: #FCD34D;
  --gold-pale: #FEF3C7;
  --cyan: #06B6D4;
  --violet: #4F46E5;
  --green: #10B981;
  --red: #EF4444;
  --orange: #F97316;
  --text: #E2E8F0;
  --text-muted: #94A3B8;
  --border: #1E293B;
  --card: #1E293B;
}
```

---

## 8. Archétype « Tutoriel vidéo » (storyboard animé)

> Modèle des pages `tuto-*.html` (ex. `tuto-yousign.html`, `tuto-stripe.html`) : un **storyboard vidéo animé** — lecteur auto-défilant d'écrans mock + sous-titre voix-off + script narré généré. Sert de support pour enregistrer un screencast commenté.
>
> **Gabarit de référence : `tuto-yousign.html`.** Toute nouvelle page tuto le clone (`<head>` + `<style>` à l'identique) et réutilise le bloc `:root` du §7 **sans modification**. On ne change que le contenu du `<body>` et le tableau `steps[]`.

### Particularités de shell (vs page docs standard)

| Aspect | Page docs (§1) | Page tuto |
|---|---|---|
| `.main` max-width | `960px` | `920px` |
| Padding hero | `60px 32px 48px` | `46px 24px 36px` |
| `h1` hero | `2.4rem` | `2.1rem` |
| `.section-title` | `1.3rem` | `1.25rem` |
| Eyebrow hero | `.hero-label` (idem) | `.hero-label` = « Tutoriel vidéo » |

Tokens, polices, accent or, nav, footer : **identiques** à la charte de base.

### Famille de composants du lecteur

| Bloc | Classes clés | Description |
|---|---|---|
| **Player** | `.player`, `.stage`, `.controls` | Conteneur carte (bordure or translucide, ombre portée). `.stage` en `aspect-ratio:16/9`, fond `#0B1220`. |
| **Écran** | `.screen(.active)`, `data-i="n"` | Slides empilés en absolu ; un seul `.active` (fondu + translation). |
| **Fenêtre mock** | `.win`, `.win-bar`, `.dot.r/.y/.g`, `.win-title`, `.win-body` | Faux navigateur/app : barre à 3 pastilles macOS + titre mono. |
| **Champs & jetons** | `.field` (+`.lbl`,`.mono`), `.row`, `.chip(.gold)`, `.toggle`, `.btn-send`, `.dropzone`, `.docpage`, `.urlbar`(+`.tid`), `.evt(.on)` | Briques d'interface simulées. `.urlbar .tid` met en or l'identifiant tenant ; `.evt.on` = case cochée or. `.btn-send` = CTA or (bouton d'action Anim'Gest). |
| **Statut** | `.status`, `.pill.cur/.done`, `.bar`, `.big`, `.muted` | État animé (en cours → terminé) sur le dernier écran. |
| **Surbrillance** | `.hl` | Halo or pulsé (`@keyframes pulse`) sur l'élément en cours de démonstration. |
| **Sur-couches** | `.legende` (haut-gauche), `.stepnum` (haut-droite), `.subtitle` (bas, voix-off) | Légende + numéro d'étape + sous-titre synchronisés par le JS. |
| **Contrôles** | `.ctrl-btn(.play)`, `.progress`, `.counter` | Précédent / Pause-Lecture / Suivant + barre de progression + compteur `n / N`. |
| **Script narré** | `.section-title .num`, `.script`, `.sc` (`.t`/`.vo`/`.ec`) | Section générée depuis `steps[]` : une carte numérotée par étape (titre, citation voix-off, action « à l'écran »). |
| **Conseil** | `.tip` | Encadré cyan (conseil de tournage). |
| **Dépannage** | `.troubleshoot`, `.ts-row`, `.ts-code.ok/.err` | Liste codes de réponse : pastille mono verte (succès) / rouge (erreur) + explication. |

### Pattern JS (source de vérité unique)

Un tableau `steps[]` (objets `{ titre, legende, vo, ec }`) **pilote à la fois** le lecteur (sous-titre, légende, compteur) **et** le script narré (généré par `.map(...)`). Réglages : `DUR = 7000` ms par étape, autoplay au chargement, dernier écran animé via un cas particulier `if(i===N-1)` (transition statut → terminé). Ne jamais dupliquer le texte voix-off ailleurs que dans `steps[]`.

### Conventions de contenu

- **Exemples neutres** (CGV, paiement de test) ; **mode Sandbox/Test** systématique (aucune action réelle).
- **Identifiant établissement** affiché en placeholder `t000123` / décrit en voix-off comme `tXXXXXX` (format `/^t\d{6}$/`).
- **Durée cible** du screencast : ~1 à 1 min 30.
- Une étape = un écran = une entrée `steps[]` = une carte du script. Garder la parité.

---

## 9. Notes

- **Dark-only** : la charte ne définit pas de mode clair. Si un mode clair docs est requis, prévoir des overrides `html.light .ma-classe` (R-25) — non couvert ici.
- **Plancher qualité** : responsive jusqu'au mobile, focus clavier visible, `prefers-reduced-motion` respecté.
- **Distinction logo produit** : le logo applicatif (`logo_animgest_v3_final.svg`) utilise violet `#4F46E5` / cyan `#06B6D4` ; la charte **docs** privilégie navy + or. Les deux cohabitent (violet/cyan restent disponibles comme couleurs sémantiques).

---

*Charte docs Anim'Gest — NoSage's Editor · établie d'après `20-pilotage-projet.html` · archétype tutoriel d'après `tuto-yousign.html` (§8, S138-2) · S138 (19/06/2026 CEST).*
