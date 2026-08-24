/**
 * @module    scripts/etat-cadratins-structure
 * @sentinel  S168_DOCS_PUBLIC_CADRATINS_STRUCTURE_V1
 * @description
 *   LECTURE SEULE, TOUJOURS. Classe les 248 cadratins restants d'apres LA BALISE QUI LES PORTE,
 *   et non d'apres les mots qui les entourent.
 *
 *   *** POURQUOI CE SCRIPT REMPLACE etat-cadratins-prose.mjs. ***
 *   Le premier classait sur le TEXTE VU, balises retirees. Sa sortie du 24/08 sur les 171 pages
 *   montre que c'etait la mauvaise information :
 *     - CELLULE n'a attrape que 4 des 9 cellules de com-formules.html, parce qu'il cherchait
 *       "cadratin suivi d'un autre cadratin" au lieu de la seule chose qui compte : la cellule
 *       vaut exactement un cadratin, et sa classe est "no". Cinq valeurs de tableau etaient
 *       classees APPOSITION ou AUTRE, donc proposees a la correction. Elles disent "non inclus".
 *     - SIGLE a rendu 28 lignes dont 7 seulement sont des gloses. La regle "le mot d'avant est en
 *       capitales" attrape "NAC", "DDPP", "TVA", "HT", "FEC" au fil de la prose. Et elle MANQUE
 *       33-module-achats-complet.html:573, "<strong>Reglement</strong> &mdash; Paiement a
 *       echeance", qui est pourtant le 4e item de la meme liste que BC, BL, FF, BR, DAF, AF. Le
 *       marqueur n'est pas la capitale : c'est <li><strong>...</strong> &mdash;.
 *     - SERIE et INCISE comptent les cadratins par LIGNE SOURCE. Dans ce corpus les <ul> tiennent
 *       sur une seule ligne : "3 cadratins sur la ligne" ne veut pas dire "une enumeration", cela
 *       veut dire "trois <li> voisins, chacun avec son propre role". sc-metier-pension.html:437
 *       est classe SERIE alors que ce sont quatre appositions distinctes. Les deux classes sont
 *       un artefact de mise en page, pas une observation.
 *
 *   La lecon tient en une phrase : l'information qui tranche etait dans les balises, et le premier
 *   script commencait par les jeter.
 *
 *   LES SEPT ROLES :
 *     CELLULE  <td>&mdash;</td>, la cellule ENTIERE      -> NE PAS TOUCHER : vaut "non inclus"
 *     PIED     "Anim'Gest &mdash; No Sage's Editor"      -> point median : MANQUE par maj-cadratins
 *     TITRE    <title>, <h1..h6>, class=".*title.*"      -> point median, comme les pieds de page
 *     GLOSE    <li><strong>X</strong> &mdash; definition -> deux-points
 *     GARDE    garde-fou Eliot (ne prescrit pas...)      -> RESERVE : contenu reglementaire
 *     LEGAL    arrete, article, decret, NF525           -> RESERVE : contenu reglementaire
 *     PROSE    tout le reste                             -> LECTURE HUMAINE, phrase par phrase
 *
 *   PIED est le resultat le plus utile de ce classement : ces quatre lignes portent DEJA deux
 *   &middot; chacune. Le cadratin y est une incoherence avec la ligne elle-meme, et maj-cadratins
 *   -docs.mjs, qui traitait les pieds de page, les a laisses passer. C'est une correction de bug.
 *
 *   *** CORRIGE LE 24/08, APRES LECTURE DE PAGES ENTIERES. ***
 *   Deux trous, trouves non par le script mais en lisant adv-eliot-avance et 62-tarification :
 *     TITRE ratait "<div class=\"section-title\"><span class=\"num\">04</span> X &mdash; Y</div>".
 *       Le </span> intermediaire cassait le motif, qui n'admettait que des balises OUVRANTES entre
 *       l'attribut de classe et le cadratin. 4 titres tombaient donc en PROSE.
 *     GARDE connaissait "ne fournit jamais" mais pas "ne derive jamais" : le garde-fou sante de
 *       adv-eliot-avance.html:660 passait pour de la prose ordinaire.
 *   Aucun des deux n'etait dangereux (PROSE veut dire "un humain lit"), mais tous deux faisaient
 *   sous-estimer le mecanique. C'est l'argument pour lire les pages plutot que la liste.
 *
 *   Usage : node scripts/etat-cadratins-structure.mjs [--racine C:\AnimGest-docs] [--tout]
 *           [--page X] [--role PROSE]
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";
const TOUT = argv.includes("--tout");
const iP = argv.indexOf("--page");
const PAGE = iP >= 0 ? argv[iP + 1] : null;
const iRole = argv.indexOf("--role");
const ROLE = iRole >= 0 ? argv[iRole + 1].toUpperCase() : null;

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }

const CAD = "(?:&mdash;|&ndash;|\\u2014|\\u2013)";
const CAD_G = new RegExp(CAD, "g");

/** L'ORDRE COMPTE : chaque regle CONSOMME les cadratins qu'elle reconnait, et ce qui reste
 *  descend a la regle suivante. Du marqueur le plus sur au plus flou. */
const REGLES = [
  ["CELLULE", new RegExp(`<t[dh][^>]*>\\s*${CAD}\\s*</t[dh]>`, "gi")],
  ["PIED", new RegExp(`Anim'Gest\\s*${CAD}\\s*No Sage's Editor`, "gi")],
  ["TITRE", new RegExp(`<(?:title|h[1-6])[^>]*>[^<]*${CAD}|class="[^"]*title[^"]*"[^>]*>(?:[^<]|<(?!/(?:div|p|h[1-6]|li)\\b)[^>]*>)*?${CAD}`, "gi")],
  ["GLOSE", new RegExp(`<li>\\s*<strong>[^<]+</strong>\\s*${CAD}`, "gi")],
  ["GARDE", new RegExp(`Cadre Eliot|ne (?:fournit|calcule|prescrit|d(?:&eacute;|\\u00e9)rive) jamais`, "gi")],
  ["LEGAL", new RegExp(`(?:Arr&ecirc;t&eacute;|Arr[e\\u00ea]t[e\\u00e9]|Article|D[e\\u00e9]cret|NF ?525|Code rural)[^<]{0,80}${CAD}`, "gi")],
];

const ORDRE = ["CELLULE", "PIED", "TITRE", "GLOSE", "GARDE", "LEGAL", "PROSE"];
const CONSEIL = {
  CELLULE: "NE PAS TOUCHER : la cellule vaut 'non inclus'",
  PIED: "point median -- BUG de maj-cadratins-docs.mjs, la ligne porte deja des &middot;",
  TITRE: "point median, comme les pieds de page -- MECANIQUE",
  GLOSE: "deux-points : le cadratin introduit une definition -- MECANIQUE",
  GARDE: "RESERVE : garde-fou Eliot, contenu reglementaire, ne pas reecrire sans validation",
  LEGAL: "RESERVE : reference legale, contenu reglementaire, ne pas reecrire sans validation",
  PROSE: "LECTURE HUMAINE, phrase par phrase",
};

/** Le texte tel que le lecteur le voit, uniquement pour AFFICHER un extrait lisible. */
function texteVu(s) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&mdash;|&ndash;/g, "\u2014")
    .replace(/&nbsp;/g, " ")
    .replace(/&eacute;|&egrave;|&ecirc;/g, "e").replace(/&agrave;|&acirc;/g, "a")
    .replace(/&ccedil;/g, "c").replace(/&ocirc;/g, "o").replace(/&ugrave;|&ucirc;/g, "u")
    .replace(/&icirc;|&iuml;/g, "i").replace(/&middot;/g, "\u00b7")
    .replace(/&amp;/g, "&").replace(/&rarr;/g, "->").replace(/&hellip;/g, "...")
    .replace(/&[a-zA-Z]+;|&#\d+;/g, "?")
    .replace(/\s+/g, " ")
    .trim();
}

const parRole = {};
for (const r of ORDRE) parRole[r] = [];
const parPage = {};
let total = 0;

const pages = fs.readdirSync(RACINE)
  .filter((f) => f.toLowerCase().endsWith(".html"))
  .filter((f) => fs.statSync(path.join(RACINE, f)).isFile())
  .filter((f) => !PAGE || f === PAGE)
  .sort();

for (const f of pages) {
  const lignes = fs.readFileSync(path.join(RACINE, f), "utf8").split(/\r?\n/);
  lignes.forEach((ligne, i) => {
    CAD_G.lastIndex = 0;
    const n = (ligne.match(CAD_G) || []).length;
    if (!n) return;
    const extrait = texteVu(ligne).slice(0, 110);
    let reste = n;
    for (const [nom, rx] of REGLES) {
      rx.lastIndex = 0;
      const k = (ligne.match(rx) || []).length;
      if (!k) continue;
      const pris = Math.min(k, reste);
      for (let j = 0; j < pris; j++) parRole[nom].push({ f, ligne: i + 1, extrait });
      reste -= pris;
      if (!reste) break;
    }
    for (let j = 0; j < reste; j++) parRole.PROSE.push({ f, ligne: i + 1, extrait });
    parPage[f] = (parPage[f] || 0) + n;
    total += n;
  });
}

console.log(`racine : ${RACINE}`);
console.log(`pages  : ${pages.length}`);
console.log(`cadratins : ${total}\n`);

for (const r of ORDRE) {
  if (ROLE && r !== ROLE) continue;
  const l = parRole[r];
  console.log(`--- ${r} : ${l.length}   (${CONSEIL[r]})`);
  const montrer = TOUT || ROLE ? l : l.slice(0, 6);
  for (const x of montrer) console.log(`      ${x.f}:${x.ligne}  ${x.extrait}`);
  if (l.length > montrer.length) console.log(`      ... ${l.length - montrer.length} de plus (--tout)`);
  console.log("");
}

if (!ROLE) {
  const top = Object.entries(parPage).sort((a, b) => b[1] - a[1]).slice(0, 12);
  console.log(`--- LES PAGES LES PLUS CHARGEES ---`);
  for (const [f, n] of top) console.log(`   ${String(n).padStart(3)}  ${f}`);

  const mecanique = parRole.PIED.length + parRole.TITRE.length + parRole.GLOSE.length;
  const reserve = parRole.GARDE.length + parRole.LEGAL.length;
  console.log(`\nNE PAS TOUCHER (cellule)             : ${parRole.CELLULE.length}`);
  console.log(`MECANIQUE (pied + titre + glose)     : ${mecanique}`);
  console.log(`RESERVE REGLEMENTAIRE (garde + legal): ${reserve}`);
  console.log(`A LIRE (prose)                       : ${parRole.PROSE.length}`);
}
console.log(`\nLECTURE SEULE. Ce script n'ecrit jamais.`);
