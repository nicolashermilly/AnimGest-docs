/**
 * @module scripts/lint-docs-public
 * @description Gate du SITE PUBLIC (171 pages HTML a la racine). Mesure, ne repare rien.
 *
 *   POURQUOI. Le produit a `lint:nav`, le centre d'aide a `lint:aide`. Le site public n'avait
 *   RIEN -- d'ou 148 pages perimees et 11 chemins fantomes sur la seule page d'onboarding.
 *
 *   CE QU'ELLE NE FAIT PAS, ET C'EST ECRIT : elle ne corrige aucune page, elle n'arme pas le
 *   cliquet, et elle ne pretend PAS couvrir les "fonctions fantomes" (categorie B de l'audit :
 *   une fonction promise et une fonction livree ne se distinguent par aucun motif textuel).
 *   Une gate verte qui ne regarde pas donne le "succes menteur" de deploy_manifest_REFERENTIELS.
 *
 *   LA SOURCE DE VERITE EST `nav-snapshot.json`, JAMAIS `nav.config.ts` : lire le code produit
 *   d'ici forkerait la source de verite. Le snapshot porte TROIS ESPACES DISJOINTS (groups /
 *   metier_menus / parametres_sections). Un chemin absent du menu N'EST PAS fantome : il vit
 *   peut-etre dans les Parametres. Le 15/07, "Stock > Articles" a ete corrige en "Achats &
 *   Stock" sur la foi du SSOT du menu -- faux, les articles vivent dans la tuile "Catalogue
 *   articles". Une erreur remplacee par une autre, et publiee. D'ou TROIS verdicts, jamais deux.
 *
 *   LES COMPTEURS DE NAV SONT DEUX, ET ILS NE REPONDENT PAS A LA MEME QUESTION :
 *     c5_nav_non_conforme  les LIBELLES : les 7 entrees de NAV_ATTENDUE, dans l'ordre.
 *                          Il SAUTE le logo (nav-logo) et ne lit AUCUN href.
 *     c6_nav_cible         les CIBLES : href de "Accueil" et du nav-logo = index.html
 *                          (arbitrage du 17/07). Une entree ABSENTE = une violation.
 *   POURQUOI DEUX, ET PAS UN c5 DURCI : le 17/07, c5 valait 0 alors que 171/171 pages
 *   envoyaient "Accueil" sur index-complet.html et que le logo partait sur index.html --
 *   la meme barre servait DEUX accueils, et la gate etait verte. c5 valait 0 avant la
 *   bascule, et il vaudra 0 apres : il ne mesure pas ce qui bouge. Redefinir c5 en gardant
 *   son nom aurait casse la comparabilite avec la baseline historique (c5=171 au 496b429)
 *   et piege la session suivante, qui aurait cru comparer ce que la precedente comparait.
 *   c6 est donc NEUF, et il est parti NON NUL (174) -- un compteur qui affiche 0 du premier
 *   coup sur un depot non corrige ne mesure rien.
 *
 *   Usage :
 *     npm run lint:docs-public               mesure, affiche, exit 0 (preflight)
 *     npm run lint:docs-public -- --baseline ecrit docs-public.baseline.json, exit 0
 *     npm run lint:docs-public -- --check    compare, exit 1 si un compteur REMONTE
 *
 * @author CC-READ (Claude Code)
 * @sprint S154
 * @sentinelle S154_LINT_DOCS_PUBLIC_V1
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { execFileSync } from "node:child_process";

const RACINE = process.cwd();
const SNAPSHOT = join(RACINE, "nav-snapshot.json");
const BASELINE = join(RACINE, "docs-public.baseline.json");
const REPO_PRODUIT = "C:\\AnimGest_Logiciel";
const JOURS_PEREMPTION = 30;

const args = process.argv.slice(2);
const MODE_BASELINE = args.includes("--baseline");
const MODE_CHECK = args.includes("--check");

// La nav de reference (arbitrage 3a du 17/07), dans l'ORDRE. Le script est ASCII pur :
// les libelles accentues passent par des echappements \u, jamais par des octets accentues.
// La CIBLE de la nav (arbitrage du 17/07 : index.html fait foi). C5 ci-dessous compare des
// LIBELLES et saute le logo : il ne lit aucun href, donc il vaut 0 avant ET apres la bascule,
// et 0 aussi si elle est faite a moitie. C6 porte les CIBLES, et lui seul.
const NAV_CIBLE_ACCUEIL = "index.html";

/** Le href d'une balise <a ...>, ou null s'il n'y en a pas. */
function hrefDe(tag) {
  const m = /href\s*=\s*["']([^"']*)["']/i.exec(tag);
  return m ? m[1] : null;
}

const NAV_ATTENDUE = [
  "Accueil",
  "Nouveaut\u00e9s",
  "Sc\u00e9narios",
  "M\u00e9tiers",
  "FAQ",
  "Glossaire",
  "RGPD",
];

// ---------------------------------------------------------------------------
// Entites : les decoder, sinon on compare "Param&egrave;tres" a "Parametres"
// et TOUT est fantome.
// ---------------------------------------------------------------------------
const ENTITES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0",
  eacute: "\u00e9", egrave: "\u00e8", ecirc: "\u00ea", euml: "\u00eb",
  agrave: "\u00e0", acirc: "\u00e2", aelig: "\u00e6",
  ccedil: "\u00e7", icirc: "\u00ee", iuml: "\u00ef",
  ocirc: "\u00f4", oelig: "\u0153", ugrave: "\u00f9", ucirc: "\u00fb", uuml: "\u00fc",
  Eacute: "\u00c9", Egrave: "\u00c8", Agrave: "\u00c0", Ccedil: "\u00c7",
  rarr: "\u2192", mdash: "\u2014", ndash: "\u2013", hellip: "\u2026",
  laquo: "\u00ab", raquo: "\u00bb", eur: "\u20ac", euro: "\u20ac",
  deg: "\u00b0", times: "\u00d7", middot: "\u00b7", bull: "\u2022",
};

function decoder(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, n) => (ENTITES[n] !== undefined ? ENTITES[n] : m));
}

/** Normalise pour COMPARER (jamais pour afficher) : accents retires, casse et espaces neutres.
 *  On ne desaccentue JAMAIS une valeur transmise -- seulement la cle de comparaison. */
function cle(s) {
  return decoder(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0153/g, "oe")
    .replace(/[\u2019']/g, "'")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// C0 -- PEREMPTION DU SNAPSHOT, AVANT TOUT LE RESTE.
// Un snapshot muet est pire que pas de snapshot : c'est le point faible du montage
// (b), et il doit crier avant de mentir.
// ---------------------------------------------------------------------------
if (!existsSync(SNAPSHOT)) {
  console.error("SNAPSHOT ABSENT.");
  console.error(`  attendu : ${SNAPSHOT}`);
  console.error("  trouve  : rien");
  console.error("  Ne PAS le fabriquer a la main, ne PAS lire nav.config.ts : ce serait forker");
  console.error("  la source de verite. Le produire : npm run export:nav-snapshot (repo produit).");
  process.exit(1);
}
const snap = JSON.parse(readFileSync(SNAPSHOT, "utf8"));

const ageJours = (Date.now() - new Date(snap.generated_at).getTime()) / 86400000;
if (!(ageJours < JOURS_PEREMPTION)) {
  console.error("SNAPSHOT PERIME (age).");
  console.error(`  attendu : moins de ${JOURS_PEREMPTION} jours`);
  console.error(`  trouve  : ${ageJours.toFixed(1)} jours (generated_at ${snap.generated_at})`);
  process.exit(1);
}

let shaProduit = null;
try {
  shaProduit = execFileSync("git", ["-C", REPO_PRODUIT, "rev-parse", `HEAD:${snap.source_path}`], {
    encoding: "utf8",
  }).trim();
} catch {
  console.log(`AVERTISSEMENT : ${REPO_PRODUIT} inaccessible -- peremption jugee sur la seule date.`);
  console.log("  (la session monte le repo produit via --add-dir ; sans lui, le sha n'est pas verifiable)");
}
if (shaProduit && shaProduit !== snap.source_sha) {
  console.error("SNAPSHOT PERIME (source_sha).");
  console.error(`  attendu : ${shaProduit}  (blob actuel de ${snap.source_path})`);
  console.error(`  trouve  : ${snap.source_sha}  (fige dans nav-snapshot.json)`);
  console.error("  La navigation du produit a bouge depuis la photo. Regenerer le snapshot.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Les trois espaces du snapshot, indexes SEPAREMENT. Ne jamais les aplatir.
// ---------------------------------------------------------------------------
const espaces = {
  groups: new Map(),
  metier_menus: new Map(),
  parametres_sections: new Map(),
};
for (const g of snap.groups) {
  espaces.groups.set(cle(g.label), `groupe "${g.label}"`);
  for (const e of g.entries) espaces.groups.set(cle(e.label), `${g.label} > ${e.label}`);
}
for (const m of snap.metier_menus) {
  espaces.metier_menus.set(cle(m.metier), `metier ${m.metier}`);
  for (const e of m.entries) espaces.metier_menus.set(cle(e.label), `${m.metier} > ${e.label}`);
}
for (const s of snap.parametres_sections) {
  espaces.parametres_sections.set(cle(s.section), `section "${s.section}"`);
  for (const t of s.tuiles) espaces.parametres_sections.set(cle(t.label), `${s.section} > ${t.label}`);
}

/** Ou vit ce libelle ? Rend la liste des espaces qui le portent. */
function ouVit(libelle) {
  const k = cle(libelle);
  const trouves = [];
  for (const [nom, idx] of Object.entries(espaces)) {
    if (idx.has(k)) trouves.push({ espace: nom, ou: idx.get(k) });
  }
  return trouves;
}

/** Ressemblance : un libelle CONTENU dans un libelle connu (ou l'inverse). Sert a ne PAS
 *  crier "fantome" sur "Eliot > Memoire" quand le SSOT porte "Memoire Eliot". Le doute
 *  rend INDETERMINE, jamais FANTOME. */
function ressemble(libelle) {
  const k = cle(libelle);
  if (k.length < 4) return null;
  for (const [nom, idx] of Object.entries(espaces)) {
    for (const connu of idx.keys()) {
      if (connu.length >= 4 && (connu.includes(k) || k.includes(connu))) {
        return { espace: nom, ou: idx.get(connu) };
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------
const pagesRacine = readdirSync(RACINE)
  .filter((f) => f.toLowerCase().endsWith(".html"))
  .filter((f) => statSync(join(RACINE, f)).isFile())
  .sort();

/** Les noeuds de texte : ce qui vit entre '>' et '<'. On travaille sur le HTML BRUT et non
 *  sur un texte "aplati" : aplatir collerait deux libelles voisins en un chemin qui n'existe
 *  nulle part. */
function noeudsTexte(html) {
  const out = [];
  const re = />([^<]+)</g;
  let m;
  while ((m = re.exec(html))) out.push({ texte: m[1], index: m.index });
  return out;
}

function ligneDe(html, index) {
  return html.slice(0, index).split("\n").length;
}

// ---------------------------------------------------------------------------
// C4 -- domaines et adresses morts. Motifs + cible.
// ---------------------------------------------------------------------------
const C4_MOTIFS = [
  { re: /github\.io/g, quoi: "github.io", cible: "animgest-docs.no-sages-editor.com" },
  { re: /support@animgest\.fr/g, quoi: "support@animgest.fr", cible: "contact@no-sages-editor.com" },
  { re: /direction@[a-z0-9.-]+/g, quoi: "direction@...", cible: "contact@no-sages-editor.com" },
  { re: /Sprint\s+S114/g, quoi: "Sprint S114", cible: "residu retire par 18933b1, ne doit pas revenir" },
  // Le domaine nu reste LEGITIME comme vitrine editeur : on ne rejette que son usage comme
  // URL de DOCUMENTATION. D'ou la negation sur le sous-domaine docs, qui est la bonne cible.
  {
    re: /(?<!animgest-docs\.)no-sages-editor\.com\/[a-z0-9_-]*(?:\.html|docs)/gi,
    quoi: "no-sages-editor.com/ employe comme URL de doc",
    cible: "animgest-docs.no-sages-editor.com",
  },
];

// ---------------------------------------------------------------------------
// MESURE
// ---------------------------------------------------------------------------
function mesurer(fichiers, base) {
  const compteurs = {
    c1_fantome: 0, c1_indetermine: 0, c2_liens_morts: 0,
    c3_cadratins_char: 0, c3_cadratins_entite: 0,
    c4_morts: 0, c5_nav_non_conforme: 0, c6_nav_cible: 0,
  };
  const parPage = {};
  const details = { c1: [], c2: [], c3: [], c4: [], c5: [], c6: [] };

  for (const f of fichiers) {
    const chemin = join(base, f);
    const html = readFileSync(chemin, "utf8");
    const p = { c1_fantome: 0, c1_indetermine: 0, c2_liens_morts: 0, c3_cadratins_char: 0,
                c3_cadratins_entite: 0, c4_morts: 0, c5_nav_non_conforme: 0,
                c6_nav_cible: 0 };

    // --- C1 : chemins d'interface.
    //
    // *** CE QUI DISTINGUE UN CHEMIN D'UNE PHRASE A FLECHE. *** Une fleche ne fait pas un
    // chemin : le site en met dans la prose ("Cycle complet : Bon de commande -> Bon de
    // livraison -> Facture fournisseur -> Reglement"), dans des boutons ("Commencer l'essai
    // gratuit ->") et dans des schemas de flux. Les compter, c'est 216 "fantomes" dont la
    // quasi-totalite n'est pas un chemin : le bruit tue la gate en une semaine.
    //
    // Le balisage ne discrimine RIEN (mesure : 11 des 51 chemins "Parametres ->" seulement
    // sont en monospace -- l'hypothese presentationnelle a ete testee, puis abandonnee).
    // LE DISCRIMINANT EST SEMANTIQUE : une chaine est un chemin d'interface si l'un de ses
    // libell\u00e9s est un libelle CONNU du snapshot. La prose n'en porte pas.
    //
    // On ne valide QUE le libelle qui SUIT la racine connue : c'est le niveau nav/tuile, le
    // seul que le snapshot connaisse. "Parametres -> Editions & Documents -> Logo" : "Logo"
    // est un champ DANS l'ecran, pas une entree de nav. Le declarer fantome serait faux.
    for (const n of noeudsTexte(html)) {
      if (!/&rarr;|\u2192/.test(n.texte)) continue;
      const libelles = n.texte
        .split(/&rarr;|\u2192/)
        .map((x) => decoder(x).replace(/\s+/g, " ").trim())
        .filter(Boolean);
      if (libelles.length < 2) continue;

      // La racine : le premier libelle que le SSOT connait. Aucune -> ce n'est pas un chemin.
      const iRacine = libelles.findIndex((l) => ouVit(l).length > 0);
      if (iRacine === -1 || iRacine === libelles.length - 1) continue;

      const cible = libelles[iRacine + 1];
      const racineChemin = libelles[iRacine];
      // L'espace ATTENDU se deduit de la racine, pas d'une intuition.
      const attendu = /^param/i.test(cle(racineChemin)) ? "parametres_sections" : null;
      const ligne = ligneDe(html, n.index);
      const affiche = `${racineChemin} > ${cible}`;

      // Une cible qui ressemble a une phrase n'est pas un libelle : on ne tranche pas dessus.
      if (cible.length > 45 || /[.;:]\s|[.;:]$/.test(cible)) {
        p.c1_indetermine++;
        details.c1.push(`${f}:${ligne}  INDETERMINE  ${affiche}  -- cible en forme de phrase, non tranchee`);
        continue;
      }

      // Un BOUTON n'est pas une entree de nav ("Clients -> + Nouveau"). Le snapshot ne
      // couvre QUE la navigation : il ne dit rien de ce qui vit DANS un ecran. On ne
      // tranche jamais sur une source qui ne couvre pas la question.
      if (/^\+/.test(cible)) {
        p.c1_indetermine++;
        details.c1.push(`${f}:${ligne}  INDETERMINE  ${affiche}  -- bouton dans l'ecran, hors perimetre du snapshot`);
        continue;
      }

      const vit = ouVit(cible);
      if (vit.length === 0) {
        const proche = ressemble(cible);
        if (proche) {
          // Doute : le libelle ressemble a un libelle connu. INDETERMINE, jamais FANTOME.
          p.c1_indetermine++;
          details.c1.push(`${f}:${ligne}  INDETERMINE  ${affiche}  -- proche de ${proche.ou} (${proche.espace})`);
        } else {
          p.c1_fantome++;
          details.c1.push(`${f}:${ligne}  FANTOME      ${affiche}  -- introuvable dans les 3 espaces`);
        }
      } else if (attendu && !vit.some((v) => v.espace === attendu)) {
        // Present, mais PAS dans l'espace attendu : c'est exactement le piege du 15/07.
        p.c1_indetermine++;
        details.c1.push(
          `${f}:${ligne}  INDETERMINE  ${affiche}  -- absent de ${attendu}, present dans ${vit.map((v) => v.espace).join("+")} (${vit[0].ou})`,
        );
      } else if (vit.length > 1) {
        p.c1_indetermine++;
        details.c1.push(`${f}:${ligne}  INDETERMINE  ${affiche}  -- ambigu : ${vit.map((v) => v.espace).join("+")}`);
      }
      // sinon VALIDE : rien a compter.
    }

    // --- C2 : liens internes vers un fichier absent.
    for (const m of html.matchAll(/href\s*=\s*"([^"#?]+\.html)(?:[#?][^"]*)?"/gi)) {
      const href = decoder(m[1]);
      if (/^(https?:)?\/\//i.test(href) || /^mailto:/i.test(href)) continue;
      // [S155_C2_SKIP_JS_HREF] Un href assemble en JS ("'+esc(a.id)+'.html") n'est
      // pas un chemin statique : la regex happe le texte litteral du source. Ces
      // caracteres ne vivent jamais dans un nom de fichier html reel. On saute.
      if (/[+'`${}<>]/.test(href)) continue;
      const cibleFic = resolve(dirname(chemin), href);
      if (!existsSync(cibleFic)) {
        p.c2_liens_morts++;
        details.c2.push(`${f}:${ligneDe(html, m.index)}  ${href}  -> aucun fichier`);
      }
    }

    // --- C3 : cadratins. CARACTERE *** ET *** ENTITE : un controle qui ne compte que les
    // caracteres MENT, les deux s'affichent pareil. Rapportes separement.
    const chars = (html.match(/[\u2014\u2013]/g) || []).length;
    const entites = (html.match(/&mdash;|&ndash;/g) || []).length;
    p.c3_cadratins_char = chars;
    p.c3_cadratins_entite = entites;
    if (chars || entites) details.c3.push(`${f}  char=${chars} entite=${entites}`);

    // --- C4 : domaines et adresses morts.
    for (const motif of C4_MOTIFS) {
      motif.re.lastIndex = 0;
      for (const m of html.matchAll(motif.re)) {
        p.c4_morts++;
        details.c4.push(`${f}:${ligneDe(html, m.index)}  ${motif.quoi}  -> ${motif.cible}`);
      }
    }

    // --- C5 : nav conforme a 3a ? Les 7 entrees, dans l'ordre.
    const blocNav = /<nav[^>]*>([\s\S]*?)<\/nav>/i.exec(html);
    if (!blocNav) {
      p.c5_nav_non_conforme = 1;
      details.c5.push(`${f}  AUCUNE NAV`);
    } else {
      const libelles = [];
      for (const a of blocNav[1].matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)) {
        if (/nav-logo/.test(a[0])) continue; // le logo n'est pas une entree de nav
        const t = decoder(a[1].replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
        if (t) libelles.push(t);
      }
      const conforme =
        libelles.length === NAV_ATTENDUE.length &&
        libelles.every((l, i) => cle(l) === cle(NAV_ATTENDUE[i]));
      if (!conforme) {
        p.c5_nav_non_conforme = 1;
        const manque = NAV_ATTENDUE.filter((a) => !libelles.some((l) => cle(l) === cle(a)));
        details.c5.push(
          `${f}  nav=[${libelles.join(", ")}]${manque.length ? `  MANQUE: ${manque.join(", ")}` : ""}`,
        );
      }
    }

    // --- C6 : la nav pointe-t-elle sur la BONNE CIBLE ?
    // C5 (ci-dessus) ne lit que des libelles, et il SAUTE le logo. Mesure du 17/07 :
    // 171/171 pages envoient "Accueil" sur index-complet.html, et c5 vaut 0. Le vert ne
    // protege rien. C6 ne regarde QUE les href, sur les deux entrees qui portent l'accueil.
    // Une entree ABSENTE compte pour une violation : un compteur qui ne PEUT pas verifier
    // ne doit pas rendre "conforme" en silence -- c'est le defaut meme de c5.
    if (!blocNav) {
      p.c6_nav_cible += 2;
      details.c6.push(`${f}  AUCUNE NAV -- les 2 cibles sont invalidables`);
    } else {
      let hrefLogo = null;
      let hrefAccueil = null;
      for (const a of blocNav[1].matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)) {
        if (/nav-logo/.test(a[0])) { hrefLogo = hrefDe(a[0]); continue; }
        const t = a[1].replace(/<[^>]*>/g, "");
        if (cle(t) === cle("Accueil")) hrefAccueil = hrefDe(a[0]);
      }
      for (const [quoi, href] of [["nav-logo", hrefLogo], ["Accueil", hrefAccueil]]) {
        if (href !== NAV_CIBLE_ACCUEIL) {
          p.c6_nav_cible++;
          details.c6.push(
            `${f}  ${quoi} -> ${href === null ? "ABSENT" : href}  (attendu ${NAV_CIBLE_ACCUEIL})`,
          );
        }
      }
    }

    parPage[f] = p;
    for (const k of Object.keys(compteurs)) compteurs[k] += p[k];
  }

  return { compteurs, parPage, details };
}

// ---------------------------------------------------------------------------
// Sortie
// ---------------------------------------------------------------------------
console.log(`nav-snapshot    : ${snap.source_sha.slice(0, 12)}  (${snap.generated_at}, ${ageJours.toFixed(2)} j)`);
console.log(`                  espaces : groups=${snap.counts.groups_entries} metier=${snap.counts.metier_entries} parametres=${snap.counts.parametres_tuiles}, routes=${snap.counts.routes}`);
console.log(`pages a la racine : ${pagesRacine.length}`);
if (pagesRacine.length !== 171) {
  console.log(`  /!\\ attendu 171, trouve ${pagesRacine.length}. Signale, PAS corrige en silence.`);
}

const r = mesurer(pagesRacine, RACINE);

console.log("\n--- COMPTEURS (racine) ---");
for (const [k, v] of Object.entries(r.compteurs)) console.log(`  ${k.padEnd(22)} ${v}`);

if (!MODE_CHECK) {
  const top = Object.entries(r.parPage)
    .map(([f, p]) => [f, p.c1_fantome + p.c1_indetermine + p.c2_liens_morts + p.c3_cadratins_char + p.c3_cadratins_entite + p.c4_morts + p.c5_nav_non_conforme + p.c6_nav_cible])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  if (top.length) {
    console.log("\n--- TOP 10 des pages en ecart ---");
    for (const [f, n] of top) console.log(`  ${String(n).padStart(4)}  ${f}`);
  }
  for (const [code, lignes] of Object.entries(r.details)) {
    if (!lignes.length) continue;
    console.log(`\n--- ${code.toUpperCase()} (${lignes.length}) ---`);
    for (const l of lignes.slice(0, 25)) console.log(`  ${l}`);
    if (lignes.length > 25) console.log(`  ... ${lignes.length - 25} de plus`);
  }
}

// --- aide\ : mesure A PART, hors baseline. Pages GENEREES : leur qualite releve du
// generateur, pas d'une correction a la main. Publication non tranchee.
const dossierAide = join(RACINE, "aide");
if (existsSync(dossierAide)) {
  const pagesAide = readdirSync(dossierAide).filter((f) => f.toLowerCase().endsWith(".html")).sort();
  const ra = mesurer(pagesAide, dossierAide);
  console.log(`\n--- aide\\ : ${pagesAide.length} pages, HORS BASELINE (C2/C3/C4 seulement) ---`);
  console.log(`  c2_liens_morts        ${ra.compteurs.c2_liens_morts}`);
  console.log(`  c3_cadratins_char     ${ra.compteurs.c3_cadratins_char}`);
  console.log(`  c3_cadratins_entite   ${ra.compteurs.c3_cadratins_entite}`);
  console.log(`  c4_morts              ${ra.compteurs.c4_morts}`);
  console.log("  (pages generees, non commitees, publication non tranchee. Aucun compteur");
  console.log("   n'entre dans la baseline. Ne pas corriger a la main : le generateur les reecrit.)");
}

// ---------------------------------------------------------------------------
// --baseline / --check
// ---------------------------------------------------------------------------
if (MODE_BASELINE) {
  const base = {
    measured_at: new Date().toISOString(),
    snapshot_sha: snap.source_sha,
    pages: pagesRacine.length,
    counters: r.compteurs,
    par_page: r.parPage,
  };
  writeFileSync(BASELINE, JSON.stringify(base, null, 2) + "\n", "utf8");
  console.log(`\nbaseline ecrite : ${BASELINE}`);
  console.log("  Valeurs MESUREES, y compris non nulles. Une baseline honnete vaut mieux qu'un");
  console.log("  zero decrete : zero est la CIBLE, pas la condition d'entree.");
  process.exit(0);
}

if (MODE_CHECK) {
  if (!existsSync(BASELINE)) {
    console.error("\nBASELINE ABSENTE. La produire d'abord : npm run lint:docs-public -- --baseline");
    process.exit(1);
  }
  const base = JSON.parse(readFileSync(BASELINE, "utf8"));
  const hausses = [];
  const baisses = [];
  for (const [k, v] of Object.entries(r.compteurs)) {
    const ref = base.counters[k] ?? 0;
    // c1_indetermine LISTE, il ne bloque JAMAIS -- meme en hausse.
    if (k === "c1_indetermine") continue;
    if (v > ref) hausses.push(`  ${k} : ${ref} -> ${v}  (+${v - ref})`);
    else if (v < ref) baisses.push(`  ${k} : ${ref} -> ${v}  (${v - ref})`);
  }
  if (base.snapshot_sha !== snap.source_sha) {
    console.log(`\nAVERTISSEMENT : la baseline a ete mesuree sur le snapshot ${base.snapshot_sha.slice(0, 12)},`);
    console.log(`                la mesure courante sur ${snap.source_sha.slice(0, 12)}. Comparaison a prendre avec prudence.`);
  }
  if (baisses.length) {
    console.log("\nEN BAISSE (la baseline n'est PAS reecrite seule -- le cliquet ne se resserre que");
    console.log("par un geste explicite) :");
    for (const b of baisses) console.log(b);
    console.log("  Pour figer ce progres : npm run lint:docs-public -- --baseline");
  }
  if (hausses.length) {
    console.error("\nlint:docs-public : ECHEC. Un compteur est REMONTE.");
    for (const h of hausses) console.error(h);
    process.exit(1);
  }
  console.log("\nlint:docs-public : OK. Aucun compteur ne remonte.");
  process.exit(0);
}

console.log("\nlint:docs-public : preflight. Rien n'a ete corrige, rien n'a ete arme.");
process.exit(0);
