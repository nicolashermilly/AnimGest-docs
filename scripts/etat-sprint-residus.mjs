/**
 * @module    scripts/etat-sprint-residus
 * @sentinel  S168_DOCS_PUBLIC_SPRINT_RESIDUS_V1
 * @description
 *   LECTURE SEULE, TOUJOURS. Recense les marqueurs de sprint qui PRETENDENT etre le sprint
 *   courant et ne disent pas S168.
 *
 *   POURQUOI CE SCRIPT EXISTE. `maj-sprint-docs.mjs` ne traitait que deux formes : la pastille
 *   de navigation, et le pied de page au format standard. C'etait une regle MECANIQUE, et elle
 *   a laisse passer tout ce qui dit "sprint" autrement : une tuile de statistique libellee
 *   "Sprint", une ligne "sprint courant", un pied de page de forme differente, un KPI
 *   "Derniere MaJ". Mesure d'abord, correction ensuite.
 *
 *   CE QUI N'EST PAS UN RESIDU, ET NE DOIT PAS LE DEVENIR :
 *     - "Nouveaux S115-S120", "sprints S115 a S120" : du CONTENU historique, il est juste.
 *     - un badge "S126" sous un score mesure a S126 : une date de mesure, pas le sprint courant.
 *     - "MaJ S122" sur une carte : le backlog des 18 marqueurs MaJ, qui demande de RELIRE la
 *       page avant de changer le chiffre. Compte a part, jamais corrige mecaniquement.
 *
 *   Usage : node scripts/etat-sprint-residus.mjs [--racine C:\AnimGest-docs] [--tout]
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";
const TOUT = argv.includes("--tout");
const COURANT = "S168";

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }

const pages = fs.readdirSync(RACINE)
  .filter((f) => f.toLowerCase().endsWith(".html"))
  .filter((f) => fs.statSync(path.join(RACINE, f)).isFile())
  .sort();

// Un marqueur PRETEND etre le sprint courant si un libelle proche dit "sprint" ou "derniere maj".
const PRETEND = [
  { nom: "pastille nav",     re: /<span class="nav-badge">\s*(S\d+[^<]*)<\/span>/gi },
  { nom: "tuile Sprint",     re: /<div class="hero-stat-val">\s*(S\d+)\s*<\/div>\s*<div class="hero-stat-lbl">\s*Sprint/gi },
  { nom: "sprint courant",   re: /<span class="fs-val">\s*(S\d+)\s*<\/span>\s*<span class="fs-lbl">\s*sprint courant/gi },
  { nom: "KPI derniere MaJ", re: /<div class="kpi-value">\s*(S\d+)\s*<\/div>\s*<div class="kpi-label">\s*Derni[e&][^<]*MaJ/gi },
  { nom: "pied de page",     re: /Sprint\s+(S\d+(?:\s+J\d+)?)/gi },
];

// Le backlog MaJ : compte a part, JAMAIS corrige sans relire la page.
const RE_MAJ = /MaJ\s+(S\d+)/gi;

const residus = [];
let majBacklog = 0;
const majPages = new Set();

for (const f of pages) {
  const html = fs.readFileSync(path.join(RACINE, f), "utf8");
  for (const { nom, re } of PRETEND) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(html))) {
      const valeur = m[1].trim();
      if (valeur === COURANT) continue;
      const ligne = html.slice(0, m.index).split("\n").length;
      residus.push({ f, ligne, nom, valeur });
    }
  }
  RE_MAJ.lastIndex = 0;
  let mm;
  while ((mm = RE_MAJ.exec(html))) { majBacklog++; majPages.add(f); }
}

console.log(`racine  : ${RACINE}`);
console.log(`pages   : ${pages.length}`);
console.log(`courant : ${COURANT}\n`);

const parForme = {};
for (const r of residus) (parForme[r.nom] ||= []).push(r);

console.log(`--- MARQUEURS QUI PRETENDENT ETRE LE SPRINT COURANT ET NE DISENT PAS ${COURANT} : ${residus.length} ---`);
for (const [nom, liste] of Object.entries(parForme)) {
  const valeurs = [...new Set(liste.map((x) => x.valeur))].sort().join(", ");
  console.log(`\n  [${nom}] ${liste.length}   valeurs vues : ${valeurs}`);
  const montrer = TOUT ? liste : liste.slice(0, 12);
  for (const r of montrer) console.log(`      ${r.f}:${r.ligne}  ${r.valeur}`);
  if (liste.length > montrer.length) console.log(`      ... ${liste.length - montrer.length} de plus (relancer avec --tout)`);
}
if (!residus.length) console.log("  aucun.");

console.log(`\n--- BACKLOG "MaJ Sxxx" (A NE PAS CORRIGER MECANIQUEMENT) ---`);
console.log(`  ${majBacklog} marqueur(s) sur ${majPages.size} page(s).`);
console.log(`  Chacun affirme QUAND la page a ete mise a jour. Changer le chiffre sans relire la`);
console.log(`  page transformerait une information perimee en information fausse.`);

console.log(`\nLECTURE SEULE. Ce script n'ecrit jamais.`);
