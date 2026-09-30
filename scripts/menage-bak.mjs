/**
 * @module    scripts/menage-bak
 * @sentinel  S168_DOCS_PUBLIC_MENAGE_BAK_V1
 * @description
 *   Supprime les sauvegardes .bak accumulees a la racine et dans scripts/. LECTURE SEULE par
 *   defaut : il faut --write pour qu'un seul octet disparaisse.
 *
 *   *** POURQUOI CE SCRIPT EXISTE. ***
 *   Chaque script corr-*.mjs depose un .bak horodate avant d'ecrire, ce qui est la bonne
 *   discipline au moment ou il ecrit. Mais personne ne les retire ensuite, et le depot en porte
 *   desormais plusieurs generations par page. Le dry run ci-dessous en donne le compte exact et
 *   le poids : ce ne sont pas des chiffres que j'ai estimes, c'est ta machine qui les rend.
 *
 *   *** TROIS GARDES, ET C'EST LE COEUR DU SCRIPT. ***
 *
 *   1. L'ARBRE GIT DOIT ETRE PROPRE. Le script lance `git status --porcelain` et REFUSE de
 *      supprimer quoi que ce soit s'il reste une modification non commitee. Une sauvegarde n'a
 *      d'interet que tant que le travail n'est pas enregistre : une fois commite et pousse,
 *      l'historique git est la vraie sauvegarde, et le .bak n'est plus qu'un doublon. Tant que
 *      l'arbre est sale, l'inverse est vrai et on ne touche a rien.
 *
 *   2. LE FICHIER VIVANT DOIT EXISTER. Pour chaque "X.bak...", le script verifie que "X" est
 *      toujours la. Un .bak dont l'original a disparu n'est PAS une sauvegarde redondante :
 *      c'est peut-etre la derniere copie. Ceux-la sont listes a part, sous ORPHELINS, et ne sont
 *      jamais supprimes, meme avec --write. Un humain tranche.
 *
 *   3. RIEN HORS DES TROIS MOTIFS CONNUS. Le script ne supprime que ce qui correspond
 *      exactement a l'une de ces trois formes, telles qu'elles existent dans ce depot :
 *        X.bak_AAAAMMJJ_HHMMSS     (le lot du 17/07)
 *        X.bak.AAAAMMJJHHMMSS      (les lots corr-*.mjs)
 *        X.AAAAMMJJ-HHMMSS.bak     (une forme isolee)
 *      Tout autre fichier, quel que soit son nom, est ignore.
 *
 *   *** UN MORT NOMME, TRAITE A PART. ***
 *   scripts/etat-cadratins-prose.mjs : le classificateur par MOTS, remplace le 24/08 par
 *   etat-cadratins-structure.mjs qui classe par BALISE. Ses trois erreurs sont documentees dans
 *   l'en-tete de son remplacant, donc le garder ne sert qu'a risquer de relancer le mauvais. Il
 *   n'a jamais ete commite et ne doit pas l'etre. Supprime par --write, liste a part.
 *
 *   Usage : node scripts/menage-bak.mjs [--racine C:\AnimGest-docs] [--write]
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }
if (!fs.existsSync(path.join(RACINE, ".git"))) {
  console.error(`PAS UN DEPOT GIT : ${RACINE}`);
  console.error(`Ce script ne nettoie que dans un depot, pour pouvoir verifier que l'arbre est propre.`);
  process.exit(1);
}

const MOTIFS = [
  /^(.*)\.bak_\d{8}_\d{6}$/,
  /^(.*)\.bak\.\d{14}$/,
  /^(.*)\.\d{8}-\d{6}\.bak$/,
];

const MORTS_NOMMES = [
  ["scripts/etat-cadratins-prose.mjs",
   "classificateur par MOTS, remplace le 24/08 par etat-cadratins-structure.mjs (par BALISE)"],
];

const DOSSIERS = ["", "scripts"];
const aSupprimer = [];
const orphelins = [];

for (const d of DOSSIERS) {
  const abs = path.join(RACINE, d);
  if (!fs.existsSync(abs)) continue;
  for (const nom of fs.readdirSync(abs)) {
    const p = path.join(abs, nom);
    if (!fs.statSync(p).isFile()) continue;
    let source = null;
    for (const rx of MOTIFS) {
      const m = nom.match(rx);
      if (m) { source = m[1]; break; }
    }
    if (!source) continue;
    const rel = d ? `${d}/${nom}` : nom;
    const cible = { rel, p, taille: fs.statSync(p).size };
    if (fs.existsSync(path.join(abs, source))) aSupprimer.push(cible);
    else orphelins.push({ ...cible, source });
  }
}

const morts = MORTS_NOMMES
  .filter(([rel]) => fs.existsSync(path.join(RACINE, rel)))
  .map(([rel, pourquoi]) => ({ rel, pourquoi, p: path.join(RACINE, rel), taille: fs.statSync(path.join(RACINE, rel)).size }));

const ko = (n) => `${(n / 1024).toFixed(0)} Ko`;
const total = aSupprimer.reduce((s, x) => s + x.taille, 0) + morts.reduce((s, x) => s + x.taille, 0);

const parFamille = {};
for (const x of aSupprimer) {
  const f = /\.bak_\d{8}_\d{6}$/.test(x.rel) ? "X.bak_AAAAMMJJ_HHMMSS"
    : /\.bak\.\d{14}$/.test(x.rel) ? "X.bak.AAAAMMJJHHMMSS"
    : "X.AAAAMMJJ-HHMMSS.bak";
  parFamille[f] = (parFamille[f] || 0) + 1;
}

console.log(`racine : ${RACINE}\n`);
console.log(`--- SAUVEGARDES REDONDANTES (le fichier vivant existe) : ${aSupprimer.length} ---`);
for (const [f, n] of Object.entries(parFamille).sort()) console.log(`   ${String(n).padStart(4)}  ${f}`);
console.log(`\n--- MORT NOMME : ${morts.length} ---`);
for (const m of morts) console.log(`   ${m.rel}\n      (${m.pourquoi})`);
console.log(`\n--- ORPHELINS, JAMAIS SUPPRIMES : ${orphelins.length} ---`);
for (const o of orphelins) console.log(`   ${o.rel}   (original absent : ${o.source})`);
if (!orphelins.length) console.log(`   aucun.`);
console.log(`\nespace rendu : ${ko(total)}`);

// GARDE 1 : l'arbre doit etre propre. Les non-suivis (??) ne comptent pas : les .bak en sont.
let sale = [];
try {
  sale = execSync("git status --porcelain", { cwd: RACINE, encoding: "utf8" })
    .split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("??"));
} catch (e) {
  console.error(`\n*** git status a echoue. AUCUNE SUPPRESSION. ***`);
  process.exit(1);
}
if (sale.length) {
  console.error(`\n*** ARBRE SALE : ${sale.length} modification(s) non commitee(s). AUCUNE SUPPRESSION. ***`);
  sale.slice(0, 10).forEach((l) => console.error(`   ${l}`));
  console.error(`\nUne sauvegarde ne devient un doublon qu'une fois le travail commite.`);
  console.error(`Commite d'abord, relance ensuite.`);
  process.exit(1);
}
console.log(`\narbre git : propre. Les .bak sont donc bien des doublons de l'historique.`);

if (!ECRIRE) { console.log(`\nLECTURE SEULE. Rien n'a ete supprime. Relancer avec --write.`); process.exit(0); }

let n = 0;
for (const x of [...aSupprimer, ...morts]) { fs.unlinkSync(x.p); n++; }
console.log(`\n*** SUPPRIME. ***  ${n} fichiers, ${ko(total)} rendus.`);
console.log(`Les ${orphelins.length} orphelin(s) sont intacts.`);
console.log(`Controle : git status --short   (il ne doit plus rester que ce que tu y attends)`);
