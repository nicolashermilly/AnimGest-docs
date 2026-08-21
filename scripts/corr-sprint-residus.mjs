/**
 * @module    scripts/corr-sprint-residus
 * @sentinel  S168_DOCS_PUBLIC_SPRINT_RESIDUS_V1
 * @description
 *   Solde les marqueurs de sprint que `maj-sprint-docs.mjs` avait laisses : sa regle ne
 *   connaissait que deux formes (pastille de navigation, pied de page au format standard).
 *   Mesure du 21/08 par `etat-sprint-residus.mjs` : 7 marqueurs sur les 171 pages, et
 *   ZERO pastille de navigation -- celles-la etaient bien toutes a jour.
 *
 *   *** SUR LES 7 MESURES, 3 NE DOIVENT PAS ETRE CORRIGES. ***
 *   Mesurer les trouve ; le jugement les ecarte. Les voici, nommement :
 *
 *   1. `ref-faq.html:12` et `ref-glossaire.html:12` portent, dans un COMMENTAIRE HTML,
 *      "Refonte : Sprint S120 J1 (26 mai 2026)". C'est un fait historique VRAI, invisible du
 *      lecteur. Le passer a S168 ecrirait un mensonge pour faire taire un compteur.
 *
 *   2. `EXTENSIONS_UPLOAD_ANIMGEST.html:455` dit "MaJ Sprint S126 - 31/05/2026". Le mot MaJ
 *      change tout : ce n'est pas la version du site, c'est la date a laquelle CETTE page a
 *      ete relue. Personne ne l'a relue depuis. On n'y touche donc PAS au sprint -- seulement
 *      aux 3 cadratins de son pied de page, ce qui est une correction de FORME.
 *
 *   Restent 4 corrections de fond : deux tuiles de la page d'accueil qui annoncent le sprint
 *   courant, et deux pieds de page de forme ancienne. Le pied de page est un tampon de VERSION
 *   DU SITE (58 pages en portent deja un a S168), pas une date de relecture.
 *
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node corr-sprint-residus.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

// fichier, ancre EXACTE, remplacement, justification
const CORRECTIONS = [
  ["index.html",
   '<div class="hero-stat-val">S154</div><div class="hero-stat-lbl">Sprint</div>',
   '<div class="hero-stat-val">S168</div><div class="hero-stat-lbl">Sprint</div>',
   "tuile libellee 'Sprint' en page d'accueil : elle annonce le sprint courant"],

  ["index.html",
   '<span class="fs-val">S154</span><span class="fs-lbl">sprint courant</span>',
   '<span class="fs-val">S168</span><span class="fs-lbl">sprint courant</span>',
   "libelle 'sprint courant' : il ne peut pas dire autre chose que le sprint courant"],

  ["ref-faq.html",
   "- FAQ - <strong>Sprint S120 J1</strong> \u00b7 26 mai 2026",
   "\u00b7 FAQ \u00b7 <strong>Sprint S168</strong> \u00b7 21/08/2026",
   "pied de page de forme ancienne : aligne sur les 58 deja passes a S168"],

  ["ref-glossaire.html",
   "- Glossaire m\u00e9tier &amp; technique - <strong>Sprint S120 J1</strong> \u00b7 26 mai 2026",
   "\u00b7 Glossaire m\u00e9tier &amp; technique \u00b7 <strong>Sprint S168</strong> \u00b7 21/08/2026",
   "idem : meme forme ancienne, meme tampon de version du site"],

  // FORME SEULEMENT. Le sprint S126 de cette ligne est une date de RELECTURE : il reste.
  ["EXTENSIONS_UPLOAD_ANIMGEST.html",
   "MaJ Sprint S126 &mdash; 31/05/2026 &mdash; Conformit\u00e9 RGPD &mdash; Pipeline ClamAV",
   "MaJ Sprint S126 &middot; 31/05/2026 &middot; Conformit\u00e9 RGPD &middot; Pipeline ClamAV",
   "3 cadratins de pied de page ; le S126 est une date de relecture et ne bouge PAS"],
];

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }

const erreurs = [];
const parFichier = new Map();
for (const [f, avant, apres, pourquoi] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  if (!fs.existsSync(p)) { erreurs.push(`${f} : fichier introuvable`); continue; }
  const src = parFichier.get(f) ?? fs.readFileSync(p, "utf8");
  parFichier.set(f, src);
  const n = src.split(avant).length - 1;
  if (n !== 1) erreurs.push(`${f} : ancre trouvee ${n} fois, attendu 1 -> ${avant.slice(0, 70)}`);
  console.log(`  [${n === 1 ? "OK " : "!! "}] ${f}`);
  console.log(`         ${avant}`);
  console.log(`      -> ${apres}`);
  console.log(`         (${pourquoi})`);
}

if (erreurs.length) {
  console.error(`\n*** ${erreurs.length} ANCRE(S) EN DEFAUT. AUCUNE ECRITURE. ***`);
  erreurs.forEach((e) => console.error(`   ${e}`));
  process.exit(1);
}

// Garde : aucun cadratin ne doit entrer par ce script.
if (CORRECTIONS.some(([, , a]) => /\u2014|\u2013|&mdash;|&ndash;/.test(a))) {
  console.error(`\n*** UN REMPLACEMENT PORTE UN CADRATIN. AUCUNE ECRITURE. ***`);
  process.exit(1);
}

console.log(`\n${CORRECTIONS.length} corrections, toutes ancrees exactement une fois, aucun cadratin.`);
console.log(`${parFichier.size} fichier(s) concerne(s).`);
console.log(`\nNON TOUCHES DELIBEREMENT : ref-faq.html:12 et ref-glossaire.html:12 (commentaire`);
console.log(`historique VRAI), et le S126 de EXTENSIONS_UPLOAD (date de relecture, pas version).`);

if (!ECRIRE) { console.log(`\nLECTURE SEULE. Rien n'a ete ecrit. Relancer avec --write.`); process.exit(0); }

const horo = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const contenus = new Map();
for (const [f, avant, apres] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  const src = contenus.get(f) ?? fs.readFileSync(p, "utf8");
  contenus.set(f, src.replace(avant, apres));
}
for (const [f, contenu] of contenus) {
  const p = path.join(RACINE, f);
  fs.copyFileSync(p, `${p}.bak.${horo}`);
  fs.writeFileSync(p, contenu, { encoding: "utf8" });
  console.log(`  ecrit : ${f}   (sauvegarde ${f}.bak.${horo})`);
}
console.log(`\n*** ECRIT : ${contenus.size} fichier(s), ${CORRECTIONS.length} corrections. ***`);
console.log(`Controle : node scripts/etat-sprint-residus.mjs --tout`);
