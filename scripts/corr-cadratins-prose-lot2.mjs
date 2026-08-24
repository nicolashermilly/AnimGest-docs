/**
 * @module    scripts/corr-cadratins-prose-lot2
 * @sentinel  S168_DOCS_PUBLIC_CADRATINS_PROSE_LOT2_V1
 * @description
 *   Deuxieme lot de PROSE : 26 cadratins sur 5 pages, lues en entier le 24/08.
 *   Apres ce lot il restera 111 cadratins, dont 9 cellules de tableau intouchables.
 *
 *   *** CE LOT A CORRIGE DEUX TROUS DU CLASSIFICATEUR, TROUVES EN LISANT. ***
 *   Ni l'un ni l'autre n'etait dangereux, puisque les deux faisaient tomber en PROSE, c'est-a-dire
 *   "un humain lit". Mais tous deux faisaient SOUS-ESTIMER ce qui etait mecanique.
 *
 *     1. QUATRE TITRES PASSAIENT POUR DE LA PROSE. Le motif
 *        <div class="section-title"><span class="num">04</span> X &mdash; Y</div>
 *        echappait a la regle TITRE : le </span> intermediaire cassait un motif qui n'admettait
 *        que des balises OUVRANTES entre l'attribut de classe et le cadratin. Corrige dans
 *        etat-cadratins-structure.mjs le meme jour. Les 4 sont traites ici comme des titres.
 *
 *     2. UN GARDE-FOU SANTE PASSAIT POUR DE LA PROSE. adv-eliot-avance.html:660, "Eliot ne DERIVE
 *        jamais une posologie, une dose ou une ration". La regle GARDE connaissait "ne fournit
 *        jamais" mais pas "ne derive jamais". Ce cadratin recoit donc le meme traitement que les
 *        12 garde-fous du 24/08, arbitres par NSE : POINT et majuscule. On ne va pas ponctuer
 *        autrement un garde-fou parce qu'une expression reguliere l'a manque.
 *
 *   *** LES CHOIX QUI NE SUIVENT PAS LA REGLE DU LOT 1, ET POURQUOI. ***
 *   Rappel de la regle : deux-points par defaut, virgule si la ligne porte deja un deux-points ou
 *   si les deux membres sont deux gestes successifs. Quatre lignes en sortent :
 *
 *     76-metier-mediation.html:390, "...ses regles de bien-etre &mdash; pas l'animal d'un client."
 *       VIRGULE, pas deux-points. Le second membre CONTREDIT le premier, il ne l'explique pas.
 *       Un deux-points annoncerait une consequence la ou il y a une mise au point.
 *
 *     76-metier-mediation.html:362, badge "Prochainement &mdash; verticale en preparation".
 *       POINT MEDIAN. Ce n'est pas une phrase, c'est une pastille : meme role qu'un titre.
 *
 *     62-tarification, "Methode 1 &mdash; COEF_FG + MARGE" et ses deux jumelles.
 *       POINT MEDIAN. Le membre de droite est le NOM de la methode, donc un sous-titre.
 *
 *     adv-eliot-avance.html:624, "Permissions par role &mdash; deny by default".
 *       PARENTHESES. Ici le membre de droite est un QUALIFICATIF et non un nom : c'est le meme
 *       cas que "Consultation (sans confirmation)", deja tranche ainsi le 24/08.
 *
 *   26 ancres pour 26 cadratins, chacune verifiee UNE SEULE FOIS dans son fichier.
 *   Les chaines accentuees sont en \u.... pour garder ce script en ASCII pur : cette page
 *   mediation ecrit ses accents en toutes lettres la ou le reste du corpus emploie des entites.
 *
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node scripts/corr-cadratins-prose-lot2.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

const CORRECTIONS = [
  // --- COM-FORMULES (1 : les 9 autres sont des cellules, intouchables)
  ["com-formules.html",
   "du secteur &mdash; choisissez la formule",
   "du secteur : choisissez la formule"],

  // --- MEDIATION (7)
  ["76-metier-mediation.html",
   "sur trois axes &mdash; c'est ce qui en fait",
   "sur trois axes : c'est ce qui en fait"],
  ["76-metier-mediation.html",
   "r\u00e8gles de bien-\u00eatre &mdash; pas l'animal d'un client.",
   "r\u00e8gles de bien-\u00eatre, pas l'animal d'un client."],
  ["76-metier-mediation.html",
   "R\u00e9sidents, patients, enfants &mdash; souvent",
   "R\u00e9sidents, patients, enfants : souvent"],
  ["76-metier-mediation.html",
   "et contre-indications &mdash; donn\u00e9es de sant\u00e9 prot\u00e9g\u00e9es.",
   "et contre-indications : donn\u00e9es de sant\u00e9 prot\u00e9g\u00e9es."],
  ["76-metier-mediation.html",
   "(observ\u00e9 vs cible) &mdash; le livrable qui justifie",
   "(observ\u00e9 vs cible) : le livrable qui justifie"],
  ["76-metier-mediation.html",
   "point de vigilance n&deg;1 &mdash; la protection est pr\u00e9vue",
   "point de vigilance n&deg;1 : la protection est pr\u00e9vue"],
  ["76-metier-mediation.html",
   "Prochainement &mdash; verticale en pr\u00e9paration",
   "Prochainement &middot; verticale en pr\u00e9paration"],

  // --- ADV-ELIOT-AVANCE (7)
  ["adv-eliot-avance.html",
   "en langage naturel &mdash; toujours sous garde-fou",
   "en langage naturel, toujours sous garde-fou"],
  ["adv-eliot-avance.html",
   "enregistrer un r&egrave;glement &mdash; le tout dict&eacute;",
   "enregistrer un r&egrave;glement, le tout dict&eacute;"],
  ["adv-eliot-avance.html",
   "forfaits/packs pr&eacute;pay&eacute;s &mdash; avec prix HT et TTC.",
   "forfaits/packs pr&eacute;pay&eacute;s, avec prix HT et TTC."],
  ["adv-eliot-avance.html",
   "&raquo; &mdash; Eliot r&eacute;pond avec",
   "&raquo; : Eliot r&eacute;pond avec"],
  ["adv-eliot-avance.html",
   "propri&eacute;taire&hellip;) &mdash; y compris les",
   "propri&eacute;taire&hellip;), y compris les"],
  ["adv-eliot-avance.html",
   "Permissions par r&ocirc;le &mdash; <em>deny&nbsp;by&nbsp;default</em>",
   "Permissions par r&ocirc;le (<em>deny&nbsp;by&nbsp;default</em>)"],
  ["adv-eliot-avance.html",
   "une ration &mdash; cette limite prime sur toute demande.",
   "une ration. Cette limite prime sur toute demande."],

  // --- ELEVEUR (7)
  ["sc-metier-eleveur.html",
   "cession des chiots &mdash; planning de reproduction",
   "cession des chiots : planning de reproduction"],
  ["sc-metier-eleveur.html",
   "lettre <strong>U</strong> &mdash; tous les noms commencent",
   "lettre <strong>U</strong>, tous les noms commencent"],
  ["sc-metier-eleveur.html",
   "CHPL (J60) &mdash; rappel J90",
   "CHPL (J60), rappel J90"],
  ["sc-metier-eleveur.html",
   "12 demandes &mdash; classement par anciennet&eacute;",
   "12 demandes, classement par anciennet&eacute;"],
  ["sc-metier-eleveur.html",
   "Envoi via portail client &mdash; signature &eacute;lectronique",
   "Envoi via portail client : signature &eacute;lectronique"],
  ["sc-metier-eleveur.html",
   "Encaissement de l'acompte &mdash; statut chiot",
   "Encaissement de l'acompte : statut chiot"],
  ["sc-metier-eleveur.html",
   "depuis la fiche port&eacute;e &mdash; export PDF",
   "depuis la fiche port&eacute;e, export PDF"],

  // --- TARIFICATION (4)
  ["62-tarification-3-methodes.html",
   "prix de vente &mdash; COEF_FG+MARGE",
   "prix de vente : COEF_FG+MARGE"],
  ["62-tarification-3-methodes.html",
   "M&eacute;thode 1 &mdash; COEF_FG + MARGE",
   "M&eacute;thode 1 &middot; COEF_FG + MARGE"],
  ["62-tarification-3-methodes.html",
   "M&eacute;thode 2 &mdash; COEF_VTE",
   "M&eacute;thode 2 &middot; COEF_VTE"],
  ["62-tarification-3-methodes.html",
   "M&eacute;thode 3 &mdash; PRIX_DIRECT",
   "M&eacute;thode 3 &middot; PRIX_DIRECT"],
];

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }

// Garde des mots. Elle neutralise le balisage, les cadratins, le point median, les parentheses
// et la ponctuation, puis compare en minuscules : la majuscule voulue de "Cette" passe, tout
// autre changement de mot bloque l'ecriture.
const mots = (s) => s
  .replace(/<[^>]+>/g, " ")
  .replace(/&mdash;|&ndash;|&middot;/g, " ")
  .replace(/[.:,;!?()]/g, " ")
  .toLowerCase()
  .split(/\s+/).filter(Boolean).join(" ");

const erreurs = [];
const parFichier = {};
let cadratins = 0;
for (const [f, avant, apres] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  if (!fs.existsSync(p)) { erreurs.push(`${f} : fichier introuvable`); continue; }
  const src = fs.readFileSync(p, "utf8");
  const n = src.split(avant).length - 1;
  if (n !== 1) erreurs.push(`${f} : ancre trouvee ${n} fois, attendu 1 -> ${avant.slice(0, 60)}`);
  if (mots(avant) !== mots(apres)) erreurs.push(`${f} : LES MOTS CHANGENT -> ${avant.slice(0, 60)}`);
  cadratins += (avant.match(/&mdash;|&ndash;/g) || []).length;
  parFichier[f] = (parFichier[f] || 0) + 1;
}

const restants = CORRECTIONS.filter(([, , a]) => /\u2014|\u2013|&mdash;|&ndash;/.test(a));
if (restants.length) {
  console.error(`\n*** ${restants.length} REMPLACEMENT(S) PORTENT ENCORE UN CADRATIN. AUCUNE ECRITURE. ***`);
  restants.forEach(([f, , a]) => console.error(`   ${f} : ${a.slice(0, 90)}`));
  process.exit(1);
}

console.log(`ancres    : ${CORRECTIONS.length}`);
console.log(`cadratins : ${cadratins}`);
console.log(`fichiers  : ${Object.keys(parFichier).length}\n`);
for (const [f, n] of Object.entries(parFichier).sort()) console.log(`   ${String(n).padStart(3)}  ${f}`);

if (erreurs.length) {
  console.error(`\n*** ${erreurs.length} DEFAUT(S). AUCUNE ECRITURE. ***`);
  erreurs.forEach((e) => console.error(`   ${e}`));
  process.exit(1);
}
console.log(`\nAncres : toutes trouvees exactement une fois.`);
console.log(`Mots   : identiques avant et apres. Seule la ponctuation change,`);
console.log(`         plus la majuscule de "Cette" au garde-fou sante d'adv-eliot-avance.`);
console.log(`\nA REGARDER AU DIFF : les 4 lignes qui ne suivent pas la regle du lot 1`);
console.log(`   76-metier-mediation.html:390   virgule : le 2e membre CONTREDIT le 1er`);
console.log(`   76-metier-mediation.html:362   point median : c'est une pastille, pas une phrase`);
console.log(`   62-tarification x3             point median : sous-titre (le nom de la methode)`);
console.log(`   adv-eliot-avance.html:624      parentheses : qualificatif, comme "Consultation (sans confirmation)"`);

if (!ECRIRE) { console.log(`\nLECTURE SEULE. Rien n'a ete ecrit. Relancer avec --write.`); process.exit(0); }

const horo = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const vus = new Set();
for (const [f, avant, apres] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  if (!vus.has(f)) { fs.copyFileSync(p, `${p}.bak.${horo}`); vus.add(f); }
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(avant, apres), { encoding: "utf8" });
}
console.log(`\n*** ECRIT. ***  ${cadratins} cadratins, ${vus.size} fichiers, sauvegardes .bak.${horo}`);
console.log(`Controle : node scripts/etat-cadratins-structure.mjs   (attendu : 111)`);
console.log(`           node scripts/lint-docs-public.mjs --check   (c3_cadratins_entite 137 -> 111)`);
