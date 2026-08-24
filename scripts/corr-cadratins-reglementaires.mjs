/**
 * @module    scripts/corr-cadratins-reglementaires
 * @sentinel  S168_DOCS_PUBLIC_CADRATINS_REG_V1
 * @description
 *   Corrige les 19 cadratins classes RESERVE REGLEMENTAIRE par etat-cadratins-structure.mjs :
 *   12 garde-fous Eliot et 7 references legales. Apres ce lot il restera 170 cadratins,
 *   dont 161 de prose a lire et 9 cellules de tableau intouchables.
 *
 *   *** AUCUN MOT N'EST AJOUTE, RETIRE NI DEPLACE. ***
 *   C'est la seule raison pour laquelle ce lot peut etre scripte. Le contenu reglementaire ne se
 *   reecrit pas sans validation humaine ; ici on ne change qu'un signe de ponctuation, et le
 *   controle est verifiable au diff : 19 lignes touchees, 19 signes changes, zero mot.
 *
 *   *** LES 12 GARDE-FOUS SONT DEUX POSITIONS, PAS DOUZE PHRASES. ***
 *   Le meme bloc est duplique sur 6 pages (49-module-veterinaire, 56-metier-osteopathe,
 *   69-metier-naturopathe, et les trois sc-metier-* correspondants). Chaque page porte deux
 *   cadratins, toujours aux memes deux endroits. Une decision en corrige donc six.
 *
 *     A. Titre du bloc : "Cadre Eliot &mdash; l'app trace, elle ne prescrit pas."
 *        -> deux-points. Un point median dirait que "l'app trace" est un sous-titre, alors que
 *        c'est ce que le cadre AFFIRME. Deux formulations coexistent, "ne prescrit pas" pour les
 *        4 pages veterinaire et osteopathe, "ne calcule pas" pour les 2 pages naturopathe. Elles
 *        sont DELIBEREES et restent distinctes.
 *
 *     B. Milieu de phrase : "...ni de diagnostic</strong> &mdash; ces decisions sont reservees..."
 *        -> POINT et majuscule (arbitrage NSE du 24/08, option b sur deux proposees). Sur un
 *        garde-fou, deux affirmations courtes et autonomes se lisent mieux qu'une seule longue,
 *        et chacune tient debout si on la cite isolement.
 *
 *   *** LES 7 REFERENCES LEGALES ONT TOUTES LA MEME FORME. ***
 *   Reference, puis ce qu'elle impose. Le deux-points va aux sept. La septieme
 *   (23-Prise-en-compte-de-la-NF-525) est d'une autre nature : le cadratin y introduit
 *   l'ENUMERATION des 4 piliers et non une obligation. Le deux-points convient aussi.
 *
 *   Chaque ancre est verifiee UNE SEULE FOIS dans son fichier, sinon rien n'est ecrit.
 *   Les chaines accentuees sont ecrites en \u.... pour garder ce script en ASCII pur tout en
 *   collant octet pour octet au corpus, qui melange entites HTML et accents litteraux.
 *
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node scripts/corr-cadratins-reglementaires.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

const CORRECTIONS = [
  // --- GARDE-A (6) : titre du bloc garde-fou : le deux-points introduit ce que le cadre AFFIRME
  ["49-module-veterinaire.html",
   "&#128737;&#65039; Cadre Eliot &mdash; l'app trace, elle ne prescrit pas.",
   "&#128737;&#65039; Cadre Eliot : l'app trace, elle ne prescrit pas."],
  ["56-metier-osteopathe.html",
   "&#128737;&#65039; Cadre Eliot &mdash; l'app trace, elle ne prescrit pas.",
   "&#128737;&#65039; Cadre Eliot : l'app trace, elle ne prescrit pas."],
  ["sc-metier-osteopathe.html",
   "&#128737;&#65039; Cadre Eliot &mdash; l'app trace, elle ne prescrit pas.",
   "&#128737;&#65039; Cadre Eliot : l'app trace, elle ne prescrit pas."],
  ["sc-metier-veterinaire.html",
   "&#128737;&#65039; Cadre Eliot &mdash; l'app trace, elle ne prescrit pas.",
   "&#128737;&#65039; Cadre Eliot : l'app trace, elle ne prescrit pas."],
  ["69-metier-naturopathe.html",
   "&#128737;&#65039; Cadre Eliot &mdash; l'app trace, elle ne calcule pas.",
   "&#128737;&#65039; Cadre Eliot : l'app trace, elle ne calcule pas."],
  ["sc-metier-naturopathe.html",
   "&#128737;&#65039; Cadre Eliot &mdash; l'app trace, elle ne calcule pas.",
   "&#128737;&#65039; Cadre Eliot : l'app trace, elle ne calcule pas."],

  // --- GARDE-B (6) : point + majuscule (choix NSE du 24/08) : deux affirmations autonomes
  ["49-module-veterinaire.html",
   "ni de diagnostic</strong> &mdash; ces d\u00e9cisions",
   "ni de diagnostic</strong>. Ces d\u00e9cisions"],
  ["56-metier-osteopathe.html",
   "ni de diagnostic</strong> &mdash; ces d\u00e9cisions",
   "ni de diagnostic</strong>. Ces d\u00e9cisions"],
  ["69-metier-naturopathe.html",
   "ni de diagnostic</strong> &mdash; ces d\u00e9cisions",
   "ni de diagnostic</strong>. Ces d\u00e9cisions"],
  ["sc-metier-naturopathe.html",
   "ni de diagnostic</strong> &mdash; ces d\u00e9cisions",
   "ni de diagnostic</strong>. Ces d\u00e9cisions"],
  ["sc-metier-osteopathe.html",
   "ni de diagnostic</strong> &mdash; ces d\u00e9cisions",
   "ni de diagnostic</strong>. Ces d\u00e9cisions"],
  ["sc-metier-veterinaire.html",
   "ni de diagnostic</strong> &mdash; ces d\u00e9cisions",
   "ni de diagnostic</strong>. Ces d\u00e9cisions"],

  // --- LEGAL (7) : reference legale puis ce qu'elle impose : deux-points
  ["23-Prise-en-compte-de-la-NF-525.html",
   "de facturation &mdash; inalt&eacute;rabilit&eacute;",
   "de facturation : inalt&eacute;rabilit&eacute;"],
  ["39-metier-eleveur.html",
   "Article L214-8 Code rural &mdash; aucune cession",
   "Article L214-8 Code rural : aucune cession"],
  ["48-module-pension-chenil.html",
   "Arr&ecirc;t&eacute; 3 avril 2014 &mdash; entr&eacute;e auto",
   "Arr&ecirc;t&eacute; 3 avril 2014 : entr&eacute;e auto"],
  ["58-registre-sanitaire.html",
   "Arr&ecirc;t&eacute; du 3 avril 2014 &mdash; registre obligatoire",
   "Arr&ecirc;t&eacute; du 3 avril 2014 : registre obligatoire"],
  ["59-registre-entrees-sorties.html",
   "article 45 &mdash; chiens, chats et furets",
   "article 45 : chiens, chats et furets"],
  ["60-registre-carnivores.html",
   "Arr&ecirc;t&eacute; du 19 juin 2025 &mdash; registre",
   "Arr&ecirc;t&eacute; du 19 juin 2025 : registre"],
  ["index.html",
   "art. 45 &mdash; chiens, chats, furets",
   "art. 45 : chiens, chats, furets"],
];

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }

// Garde propre a ce lot : le remplacement doit contenir EXACTEMENT les memes mots que l'original.
// On compare les deux chaines une fois la ponctuation et le balisage neutralises.
const mots = (s) => s
  .replace(/<[^>]+>/g, " ")
  .replace(/&mdash;|&ndash;|&#128737;|&#65039;/g, " ")
  .replace(/[.:,;!?]/g, " ")
  .toLowerCase()
  .split(/\s+/).filter(Boolean).join(" ");

const erreurs = [];
const parFichier = {};
for (const [f, avant, apres] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  if (!fs.existsSync(p)) { erreurs.push(`${f} : fichier introuvable`); continue; }
  const src = fs.readFileSync(p, "utf8");
  const n = src.split(avant).length - 1;
  if (n !== 1) erreurs.push(`${f} : ancre trouvee ${n} fois, attendu 1 -> ${avant.slice(0, 60)}`);
  if (mots(avant) !== mots(apres)) erreurs.push(`${f} : LES MOTS CHANGENT -> ${avant.slice(0, 60)}`);
  parFichier[f] = (parFichier[f] || 0) + 1;
}

const restants = CORRECTIONS.filter(([, , a]) => /\u2014|\u2013|&mdash;|&ndash;/.test(a));
if (restants.length) {
  console.error(`\n*** ${restants.length} REMPLACEMENT(S) PORTENT ENCORE UN CADRATIN. AUCUNE ECRITURE. ***`);
  process.exit(1);
}

console.log(`corrections : ${CORRECTIONS.length}   (12 garde-fous + 7 references legales)`);
console.log(`fichiers    : ${Object.keys(parFichier).length}\n`);
for (const [f, n] of Object.entries(parFichier).sort()) console.log(`   ${String(n).padStart(3)}  ${f}`);

if (erreurs.length) {
  console.error(`\n*** ${erreurs.length} DEFAUT(S). AUCUNE ECRITURE. ***`);
  erreurs.forEach((e) => console.error(`   ${e}`));
  process.exit(1);
}
console.log(`\nAncres : toutes trouvees exactement une fois.`);
console.log(`Mots   : identiques avant et apres, sur les 19. Seule la ponctuation change.`);

if (!ECRIRE) { console.log(`\nLECTURE SEULE. Rien n'a ete ecrit. Relancer avec --write.`); process.exit(0); }

const horo = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const vus = new Set();
for (const [f, avant, apres] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  if (!vus.has(f)) { fs.copyFileSync(p, `${p}.bak.${horo}`); vus.add(f); }
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(avant, apres), { encoding: "utf8" });
}
console.log(`\n*** ECRIT. ***  ${CORRECTIONS.length} corrections, ${vus.size} fichiers, sauvegardes .bak.${horo}`);
console.log(`Controle : node scripts/etat-cadratins-structure.mjs   (attendu : 170, GARDE 0, LEGAL 0)`);
console.log(`           node scripts/lint-docs-public.mjs --check   (c3_cadratins_entite 189 -> 170)`);
