/**
 * @module    scripts/corr-cadratins-prose-lot3
 * @sentinel  S168_DOCS_PUBLIC_CADRATINS_PROSE_LOT3_V1
 * @description
 *   Troisieme lot de PROSE : 48 cadratins sur 11 pages, lues en entier le 24/08.
 *   Apres ce lot il restera 54 cadratins, dont 9 cellules de tableau intouchables.
 *
 *   La regle des lots 1 et 2 s'applique a 37 des 48 : deux-points par defaut, virgule quand la
 *   ligne porte deja un deux-points ou quand les deux membres sont deux gestes successifs.
 *
 *   *** LES ONZE QUI EN SORTENT, ET POURQUOI. A REGARDER AU DIFF. ***
 *
 *     notice-utilisation.html:727, "Voir le scenario <strong>Eliot &mdash; Assistant IA</strong>".
 *       POINT MEDIAN, et c'est une question de COHERENCE, pas de ponctuation. Cette phrase CITE
 *       le titre d'une carte de scenarios-index.html, titre que le lot mecanique a deja passe au
 *       point median. Laisser le cadratin ici ferait diverger la citation de ce qu'elle cite.
 *
 *     sc-metier-associations.html:450, "Colonnes : A faire &mdash; En cours &mdash; Termine".
 *       DEUX VIRGULES. Ces cadratins ne ponctuent rien : ils separent trois NOMS DE COLONNES
 *       d'un kanban. C'est une liste, elle s'ecrit avec des virgules.
 *
 *     16-landing-page.html:395 et :419, "...pour votre metier &mdash; pas un CRM generique".
 *       VIRGULE. Le second membre CONTREDIT le premier au lieu de l'expliquer, comme
 *       76-metier-mediation.html:390 au lot 2. Un deux-points annoncerait une consequence.
 *
 *     57-metier-club-sport.html:498, deux cadratins et TROIS groupes :
 *       "club de sport canin | agility, obeissance, ring... | cours collectifs, stages...".
 *       DEUX-POINTS puis POINT-VIRGULE. Les deux listes emploient deja la virgule : les separer
 *       par une virgule les fondrait en une seule enumeration de neuf termes.
 *
 *     sc-trans-notes-frais.html:401, "(JPG, PNG, WebP &mdash; max 5 Mo)".
 *       POINT-VIRGULE. Meme raison, a l'interieur d'une parenthese : la liste de formats emploie
 *       la virgule, et un deux-points dans une parenthese est lourd.
 *
 *     index.html:631, notice-utilisation.html:586 et :605.
 *       POINT-VIRGULE, et ces trois-la ont ete trouves en relisant le DIFF, pas la source. La
 *       regle donnait une virgule, et la virgule etait juste tant qu'on regardait la phrase
 *       d'origine. Une fois ecrite, elle produisait "jour, semaine, mois, choisir selon vos
 *       besoins" : le lecteur croit lire un quatrieme element de la liste. Partout ou le membre
 *       de gauche est une enumeration a virgules, le separateur qui suit doit etre plus fort
 *       qu'une virgule. Meme raison qu'au club de sport et aux notes de frais.
 *
 *     sc-trans-registres.html:376, "...des chiens ou des chats &mdash; meme une seule nuit."
 *       VIRGULE. C'est un rencherissement, ni une consequence ni une explication.
 *
 *     61-eliot-tools-registre.html:588, DEUX cadratins sur la meme ligne, deux encarts distincts.
 *       POINT pour les deux. Chaque encart porte deja un deux-points d'etiquette ("Securite :",
 *       "Format de reponse :") et un second deux-points dans la meme phrase la rendrait illisible.
 *       Le premier ne change AUCUN mot ("Eliot" porte deja sa majuscule) ; le second met une
 *       majuscule a "Le". C'est aussi un enonce de conformite DDPP, et le point y donne a la
 *       garantie sa propre phrase, comme les garde-fous du 24/08.
 *
 *     index.html:631, "COEF_FG+MARGE, COEF_VTE, PRIX_DIRECT &mdash; verrouillage devis, ...".
 *       VIRGULE. Comparer avec index.html:568, ou le membre de droite RESUME celui de gauche
 *       ("...planification : 8 etapes guidees") et prend donc le deux-points. Ici les deux
 *       membres sont deux groupes de fonctions juxtaposes : aucun n'explique l'autre.
 *
 *   46 ancres pour 48 cadratins, chacune verifiee UNE SEULE FOIS dans son fichier.
 *
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node scripts/corr-cadratins-prose-lot3.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

const CORRECTIONS = [
  // --- sc-trans-portail-client.html (6 cadratins)
  ["sc-trans-portail-client.html",
   "client Marie Dupont &mdash; cliquer",
   "client Marie Dupont, cliquer"],
  ["sc-trans-portail-client.html",
   "Envoyer le lien</strong> &mdash; email automatique",
   "Envoyer le lien</strong> : email automatique"],
  ["sc-trans-portail-client.html",
   "<strong>Documents</strong> &mdash; devis en attente",
   "<strong>Documents</strong> : devis en attente"],
  ["sc-trans-portail-client.html",
   "&eacute;lectroniquement</strong> &mdash; ouverture Yousign",
   "&eacute;lectroniquement</strong> : ouverture Yousign"],
  ["sc-trans-portail-client.html",
   "Encaissement instantan&eacute; &mdash; re&ccedil;u envoy&eacute;",
   "Encaissement instantan&eacute; : re&ccedil;u envoy&eacute;"],
  ["sc-trans-portail-client.html",
   "pas Anim'Gest &mdash; white-label complet",
   "pas Anim'Gest : white-label complet"],

  // --- index.html (5 cadratins)
  ["index.html",
   "du soin animal &mdash; 12 m&eacute;tiers, 19 modules",
   "du soin animal : 12 m&eacute;tiers, 19 modules"],
  ["index.html",
   "d&eacute;taill&eacute;e par m&eacute;tier &mdash; configuration sp&eacute;cifique",
   "d&eacute;taill&eacute;e par m&eacute;tier : configuration sp&eacute;cifique"],
  ["index.html",
   "facturation, planification &mdash; 8 &eacute;tapes guid&eacute;es.",
   "facturation, planification : 8 &eacute;tapes guid&eacute;es."],
  ["index.html",
   "PRIX_DIRECT &mdash; verrouillage devis",
   "PRIX_DIRECT ; verrouillage devis"],
  ["index.html",
   "en 2 heures &mdash; 6 &eacute;tapes d&eacute;taill&eacute;es.",
   "en 2 heures : 6 &eacute;tapes d&eacute;taill&eacute;es."],

  // --- notice-utilisation.html (5 cadratins)
  ["notice-utilisation.html",
   "mot de passe &mdash; clic",
   "mot de passe, clic"],
  ["notice-utilisation.html",
   "contrats, photos &mdash; stock&eacute;s en GED",
   "contrats, photos ; stock&eacute;s en GED"],
  ["notice-utilisation.html",
   "jour, semaine, mois &mdash; choisir selon vos besoins",
   "jour, semaine, mois ; choisir selon vos besoins"],
  ["notice-utilisation.html",
   "sanitaire, &eacute;v&eacute;nements &mdash; tra&ccedil;abilit&eacute; obligatoire.",
   "sanitaire, &eacute;v&eacute;nements : tra&ccedil;abilit&eacute; obligatoire."],
  ["notice-utilisation.html",
   "<strong>Eliot &mdash; Assistant IA</strong>",
   "<strong>Eliot &middot; Assistant IA</strong>"],

  // --- sc-metier-associations.html (5 cadratins)
  ["sc-metier-associations.html",
   "formulaire public &mdash; inscriptions directement",
   "formulaire public, inscriptions directement"],
  ["sc-metier-associations.html",
   "Statut initial : Ouvert &mdash; les inscriptions sont",
   "Statut initial : Ouvert, les inscriptions sont"],
  ["sc-metier-associations.html",
   "ressaisie manuelle &mdash; le membre saisit",
   "ressaisie manuelle : le membre saisit"],
  ["sc-metier-associations.html",
   "Colonnes : &Agrave; faire &mdash; En cours &mdash; Termin&eacute;",
   "Colonnes : &Agrave; faire, En cours, Termin&eacute;"],

  // --- 16-landing-page.html (4 cadratins)
  ["16-landing-page.html",
   "du soin animalier &mdash; pas un CRM",
   "du soin animalier, pas un CRM"],
  ["16-landing-page.html",
   "relancer un impay&eacute; &mdash; des heures par semaine",
   "relancer un impay&eacute; : des heures par semaine"],
  ["16-landing-page.html",
   "pour votre m&eacute;tier &mdash; pas un CRM",
   "pour votre m&eacute;tier, pas un CRM"],
  ["16-landing-page.html",
   "int&eacute;gralit&eacute; du cycle &mdash; du premier contact",
   "int&eacute;gralit&eacute; du cycle : du premier contact"],

  // --- 36-metier-comportementaliste.html (4 cadratins)
  ["36-metier-comportementaliste.html",
   "canins ind&eacute;pendants &mdash; Bilan Comportemental (BC)",
   "canins ind&eacute;pendants : Bilan Comportemental (BC)"],
  ["36-metier-comportementaliste.html",
   "canin ou f&eacute;lin &mdash; BC initial 1h30",
   "canin ou f&eacute;lin : BC initial 1h30"],
  ["36-metier-comportementaliste.html",
   "Comportementale &mdash; 14 crit&egrave;res par animal",
   "Comportementale : 14 crit&egrave;res par animal"],
  ["36-metier-comportementaliste.html",
   "module-name\">BC &mdash; Bilan Comportemental</span>",
   "module-name\">BC : Bilan Comportemental</span>"],

  // --- 57-metier-club-sport.html (4 cadratins)
  ["57-metier-club-sport.html",
   "canicross, hoopers &mdash; configurable selon",
   "canicross, hoopers : configurable selon"],
  ["57-metier-club-sport.html",
   "SCC, FMBB, FFM &mdash; transport, accompagnement",
   "SCC, FMBB, FFM : transport, accompagnement"],
  ["57-metier-club-sport.html",
   "club de sport canin &mdash; agility, ob&eacute;issance, ring, pistage, canicross, hoopers &mdash; cours collectifs",
   "club de sport canin : agility, ob&eacute;issance, ring, pistage, canicross, hoopers ; cours collectifs"],

  // --- sc-trans-eliot.html (4 cadratins)
  ["sc-trans-eliot.html",
   "devis, facturation, planification &mdash; comment Eliot",
   "devis, facturation, planification : comment Eliot"],
  ["sc-trans-eliot.html",
   "ouvrir le chat &mdash; saisir au clavier",
   "ouvrir le chat, saisir au clavier"],
  ["sc-trans-eliot.html",
   "<strong>Valider</strong> &mdash; la s&eacute;ance/devis",
   "<strong>Valider</strong> : la s&eacute;ance/devis"],
  ["sc-trans-eliot.html",
   "<strong>Annuler</strong> &mdash; aucune action",
   "<strong>Annuler</strong> : aucune action"],

  // --- sc-trans-notes-frais.html (4 cadratins)
  ["sc-trans-notes-frais.html",
   "export FEC &mdash; gestion compl&egrave;te",
   "export FEC : gestion compl&egrave;te"],
  ["sc-trans-notes-frais.html",
   "papier ou photo &mdash; obligatoire en cas",
   "papier ou photo : obligatoire en cas"],
  ["sc-trans-notes-frais.html",
   "<strong>FEC</strong> &mdash; journal OD/AC",
   "<strong>FEC</strong> : journal OD/AC"],
  ["sc-trans-notes-frais.html",
   "(JPG, PNG, WebP &mdash; max 5 Mo)",
   "(JPG, PNG, WebP ; max 5 Mo)"],

  // --- sc-trans-registres.html (4 cadratins)
  ["sc-trans-registres.html",
   "des chiens ou des chats &mdash; m&ecirc;me une seule nuit.",
   "des chiens ou des chats, m&ecirc;me une seule nuit."],
  ["sc-trans-registres.html",
   "(timestamp qualifi&eacute;) &mdash; preuve de l'&eacute;tat",
   "(timestamp qualifi&eacute;) : preuve de l'&eacute;tat"],
  ["sc-trans-registres.html",
   "Archive en GED &mdash; consultable mais non",
   "Archive en GED : consultable mais non"],
  ["sc-trans-registres.html",
   "si vous le souhaitez &mdash; les statistiques sur 10+",
   "si vous le souhaitez : les statistiques sur 10+"],

  // --- 61-eliot-tools-registre.html (3 cadratins)
  ["61-eliot-tools-registre.html",
   "registres r&eacute;glementaires &mdash; consultation, recherche",
   "registres r&eacute;glementaires : consultation, recherche"],
  ["61-eliot-tools-registre.html",
   "read-only</strong> &mdash; Eliot ne peut pas",
   "read-only</strong>. Eliot ne peut pas"],
  ["61-eliot-tools-registre.html",
   "son affichage natif &mdash; le client voit",
   "son affichage natif. Le client voit"],
];

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }

// Garde des mots : balisage, cadratins, point median, parentheses et ponctuation neutralises,
// comparaison en minuscules. Seules les majuscules voulues passent, tout mot en plus ou en
// moins bloque l'ecriture.
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
console.log(`Mots   : identiques avant et apres. Seules changent la ponctuation et deux majuscules`);
console.log(`         voulues, documentees en en-tete.`);
console.log(`\nA REGARDER AU DIFF : les 11 cadratins qui ne suivent pas la regle des lots 1 et 2`);
console.log(`   notice-utilisation.html:727    point median : CITE un titre deja passe au point median`);
console.log(`   sc-metier-associations.html:450 x2  virgules : ce sont des noms de colonnes kanban`);
console.log(`   16-landing-page.html:395 et :419    virgule : le 2e membre CONTREDIT le 1er`);
console.log(`   57-metier-club-sport.html:498  deux-points puis POINT-VIRGULE : deux listes a virgules`);
console.log(`   sc-trans-notes-frais.html:401  POINT-VIRGULE dans une parenthese`);
console.log(`   sc-trans-registres.html:376    virgule : rencherissement`);
console.log(`   61-eliot-tools-registre.html:588 x2  points : deux encarts, chacun a deja son deux-points`);
console.log(`   index.html:631                 POINT-VIRGULE : deux groupes juxtaposes, aucun n'explique l'autre`);
console.log(`   notice-utilisation.html:586 et :605  POINT-VIRGULE : la gauche est deja une liste a virgules`);

if (!ECRIRE) { console.log(`\nLECTURE SEULE. Rien n'a ete ecrit. Relancer avec --write.`); process.exit(0); }

const horo = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const vus = new Set();
for (const [f, avant, apres] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  if (!vus.has(f)) { fs.copyFileSync(p, `${p}.bak.${horo}`); vus.add(f); }
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(avant, apres), { encoding: "utf8" });
}
console.log(`\n*** ECRIT. ***  ${cadratins} cadratins, ${vus.size} fichiers, sauvegardes .bak.${horo}`);
console.log(`Controle : node scripts/etat-cadratins-structure.mjs   (attendu : 63)`);
console.log(`           node scripts/lint-docs-public.mjs --check   (c3_cadratins_entite 111 -> 63)`);
