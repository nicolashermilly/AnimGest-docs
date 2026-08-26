/**
 * @module    scripts/corr-cadratins-prose-lot4
 * @sentinel  S168_DOCS_PUBLIC_CADRATINS_PROSE_LOT4_V1
 * @description
 *   Dernier lot de PROSE : les 54 cadratins de la traine, 33 pages, aucune n'en portant plus de 3.
 *   Apres ce lot il restera 9 cadratins sur les 171 pages : les 9 cellules de com-formules.html,
 *   qui valent "non inclus" et ne doivent JAMAIS etre remplacees. Le site sera au plancher.
 *
 *   *** LA TRAINE EST CLOSE, ET C'EST VERIFIE PAR ADDITION. ***
 *   54 (ce lot) + 48 (lot 3) + 9 (cellules) = 111, soit exactement le compteur mesure apres le
 *   lot 2. Aucune page n'a echappe au recensement : ce n'est pas une estimation.
 *
 *   *** UN SEUL SIGNE POUR 47 DES 54, ET CE N'EST PAS UN HASARD. ***
 *   Ces pages sont des fiches de presentation. Leur phrase type est "ce que c'est &mdash; ce qu'il
 *   y a dedans" : "Gerez votre centre equestre &mdash; pension chevaux, cours par Galop, stages".
 *   Le cadratin y annonce une enumeration, c'est le role meme du deux-points.
 *
 *   *** POURQUOI PAS DE POINT-VIRGULE ICI, ALORS QUE LE LOT 3 EN A INTRODUIT TROIS. ***
 *   Question posee et tranchee en ecrivant ce lot. Au lot 3, le point-virgule REMPLACAIT une
 *   virgule devenue ambigue : "jour, semaine, mois, choisir selon vos besoins" se lisait comme
 *   une liste de quatre. Ici le signe par defaut est le DEUX-POINTS, qui marque deja nettement la
 *   rupture : "Toilettage canin, felin et NAC : bains, coupes par race" ne prete a aucune
 *   confusion. Le point-virgule ne sert donc que la ou un deux-points est deja pris.
 *
 *   *** LES SEPT QUI SORTENT DE LA REGLE. A REGARDER AU DIFF. ***
 *
 *     60-registre-carnivores.html:589 et :590. PARENTHESES.
 *       "focus sur les mouvements ponctuels &mdash; pension, gardiennage, hospitalisation."
 *       Le deux-points est deja pris par l'etiquette "<strong>Registre #59</strong> :", et la
 *       droite est une liste d'EXEMPLES. Les parentheses la rattachent sans ambiguite. Ces deux
 *       lignes distinguent les registres #59 et #60 : contenu reglementaire, a lire au diff.
 *
 *     sc-metier-equestre.html:390. PARENTHESES, meme raison : "<strong>Animaux</strong> : fiche
 *       cheval &mdash; SIRE, race, robe..." Avec une virgule, "fiche cheval" se confondrait avec
 *       le premier element de la liste.
 *
 *     sc-metier-osteopathe.html:459. VIRGULE. "CA mensuel moyen : 2 800 EUR &mdash; ~40
 *       seances/mois". Deux-points deja pris, et la droite est une simple precision chiffree.
 *
 *     sc-metier-petsitter.html:450 et 64-eliot-memoire.html:610. POINT-VIRGULE.
 *       Les deux ont deja leur deux-points d'etiquette, et une virgule y serait ambigue :
 *       "Notes de frais : carburant, materiel, formations ; saisie OCR depuis ticket photo".
 *
 *     sc-trans-webhook-calendly.html:377. VIRGULE. "Disponible 24/7 &mdash; meme la nuit ou le
 *       week-end" est un rencherissement, ni une consequence ni une enumeration.
 *
 *   *** DEUX LIGNES A CONTENU REGLEMENTAIRE DANS CE LOT. ***
 *   Outre les deux registres ci-dessus : 15-rgpd-conformite.html:566 est une ligne du TABLEAU DES
 *   SOUS-TRAITANTS ("Yousign &mdash; signatures electroniques | Obligation legale (c) | 10 ans
 *   (eIDAS)"). Le cadratin y glose un nom d'outil, rien de plus, et aucun mot ne bouge.
 *
 *   54 ancres pour 54 cadratins, chacune verifiee UNE SEULE FOIS dans son fichier.
 *
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node scripts/corr-cadratins-prose-lot4.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

const CORRECTIONS = [
  // --- 11-carte-identite-animale.html (1)
  ["11-carte-identite-animale.html",
   "de chaque animal &mdash; identification ICAD",
   "de chaque animal : identification ICAD"],

  // --- 15-rgpd-conformite.html (1)
  ["15-rgpd-conformite.html",
   "<td>Yousign &mdash; signatures &eacute;lectroniques</td>",
   "<td>Yousign : signatures &eacute;lectroniques</td>"],

  // --- 18-questionnaires.html (1)
  ["18-questionnaires.html",
   "les 12 m&eacute;tiers &mdash; admission, bilan",
   "les 12 m&eacute;tiers : admission, bilan"],

  // --- 37-metier-toiletteur.html (2)
  ["37-metier-toiletteur.html",
   "salon de toilettage &mdash; planning, forfaits",
   "salon de toilettage : planning, forfaits"],
  ["37-metier-toiletteur.html",
   "f&eacute;lin et NAC &mdash; bains, coupes",
   "f&eacute;lin et NAC : bains, coupes"],

  // --- 38-metier-petsitter.html (1)
  ["38-metier-petsitter.html",
   "mobilit&eacute; totale &mdash; agenda g&eacute;olocalis&eacute;",
   "mobilit&eacute; totale : agenda g&eacute;olocalis&eacute;"],

  // --- 39-metier-eleveur.html (1)
  ["39-metier-eleveur.html",
   "&eacute;leveurs LOF/LOOF &mdash; planning saillies",
   "&eacute;leveurs LOF/LOOF : planning saillies"],

  // --- 45-dashboards-ceo-bi.html (1)
  ["45-dashboards-ceo-bi.html",
   "par m&eacute;tier &mdash; 11 dashboards",
   "par m&eacute;tier : 11 dashboards"],

  // --- 47-module-equestre.html (2)
  ["47-module-equestre.html",
   "centre &eacute;questre &mdash; pension chevaux",
   "centre &eacute;questre : pension chevaux"],
  ["47-module-equestre.html",
   "paddock, pr&eacute; &mdash; tarifs diff&eacute;renci&eacute;s",
   "paddock, pr&eacute; : tarifs diff&eacute;renci&eacute;s"],

  // --- 48-module-pension-chenil.html (1)
  ["48-module-pension-chenil.html",
   "canine ou f&eacute;line &mdash; r&eacute;servations multi-box",
   "canine ou f&eacute;line : r&eacute;servations multi-box"],

  // --- 49-module-veterinaire.html (2)
  ["49-module-veterinaire.html",
   "clinique v&eacute;t&eacute;rinaire &mdash; consultations, urgences",
   "clinique v&eacute;t&eacute;rinaire : consultations, urgences"],
  ["49-module-veterinaire.html",
   "20% cosm&eacute;tiques &mdash; CA3 d&eacute;taill&eacute;.",
   "20% cosm&eacute;tiques : CA3 d&eacute;taill&eacute;."],

  // --- 56-metier-osteopathe.html (2)
  ["56-metier-osteopathe.html",
   "&eacute;tat g&eacute;n&eacute;ral &mdash; graphique progression.",
   "&eacute;tat g&eacute;n&eacute;ral : graphique progression."],
  ["56-metier-osteopathe.html",
   "silhouette, comportement &mdash; stock&eacute;es en GED",
   "silhouette, comportement : stock&eacute;es en GED"],

  // --- 57-module-portail-client.html (1)
  ["57-module-portail-client.html",
   "libre-service &mdash; consultation des s&eacute;ances",
   "libre-service : consultation des s&eacute;ances"],

  // --- 60-registre-carnivores.html (2)
  ["60-registre-carnivores.html",
   "mouvements ponctuels &mdash; pension, gardiennage, hospitalisation.",
   "mouvements ponctuels (pension, gardiennage, hospitalisation)."],
  ["60-registre-carnivores.html",
   "d&eacute;tention prolong&eacute;e &mdash; &eacute;levage, refuges, &eacute;tablissements de pension permanente.",
   "d&eacute;tention prolong&eacute;e (&eacute;levage, refuges, &eacute;tablissements de pension permanente)."],

  // --- 62-notifications-portail.html (1)
  ["62-notifications-portail.html",
   "portail client &mdash; nouvelles factures",
   "portail client : nouvelles factures"],

  // --- 63-export-csv-reglements.html (1)
  ["63-export-csv-reglements.html",
   "contr&ocirc;le fiscal &mdash; format UTF-8 BOM",
   "contr&ocirc;le fiscal : format UTF-8 BOM"],

  // --- 64-eliot-memoire.html (2)
  ["64-eliot-memoire.html",
   "session &agrave; l'autre &mdash; tutoiement/vouvoiement",
   "session &agrave; l'autre : tutoiement/vouvoiement"],
  ["64-eliot-memoire.html",
   "eliot-memoire</code> &mdash; 287 lignes TSX",
   "eliot-memoire</code> ; 287 lignes TSX"],

  // --- 70-metier-associations.html (3)
  ["70-metier-associations.html",
   "association animale &mdash; adh&eacute;sions publiques",
   "association animale : adh&eacute;sions publiques"],
  ["70-metier-associations.html",
   "11580*03 conforme &mdash; d&eacute;duction 66",
   "11580*03 conforme : d&eacute;duction 66"],
  ["70-metier-associations.html",
   "conf&eacute;rences, AG &mdash; inscriptions, jauge",
   "conf&eacute;rences, AG : inscriptions, jauge"],

  // --- 72-droits-utilisateurs.html (1)
  ["72-droits-utilisateurs.html",
   "r&ocirc;les et permissions &mdash; 4 r&ocirc;les standard",
   "r&ocirc;les et permissions : 4 r&ocirc;les standard"],

  // --- 74-planning-multi-metier.html (1)
  ["74-planning-multi-metier.html",
   "m&eacute;tiers Anim'Gest &mdash; vues jour/semaine/mois",
   "m&eacute;tiers Anim'Gest : vues jour/semaine/mois"],

  // --- 75-connecteur-yousign.html (1)
  ["75-connecteur-yousign.html",
   "suivi du statut &mdash; le tout avec une valeur",
   "suivi du statut : le tout avec une valeur"],

  // --- connecteur-stripe.html (3)
  ["connecteur-stripe.html",
   "pour cet &eacute;tablissement &mdash; collez le",
   "pour cet &eacute;tablissement : collez le"],
  ["connecteur-stripe.html",
   "celui du endpoint &mdash; recopiez la bonne",
   "celui du endpoint : recopiez la bonne"],
  ["connecteur-stripe.html",
   "valide &mdash; corrigez la fin",
   "valide : corrigez la fin"],

  // --- index-complet.html (1)
  ["index-complet.html",
   "export CSV &mdash; d&eacute;penses",
   "export CSV : d&eacute;penses"],

  // --- ref-raccourcis.html (1)
  ["ref-raccourcis.html",
   "au quotidien &mdash; navigation, cr&eacute;ation rapide",
   "au quotidien : navigation, cr&eacute;ation rapide"],

  // --- sc-metier-equestre.html (2)
  ["sc-metier-equestre.html",
   "RC cavalier &mdash; contr&ocirc;le annuel",
   "RC cavalier : contr&ocirc;le annuel"],
  ["sc-metier-equestre.html",
   "fiche cheval &mdash; SIRE, race, robe, date naissance, propri&eacute;taire",
   "fiche cheval (SIRE, race, robe, date naissance, propri&eacute;taire)"],

  // --- sc-metier-osteopathe.html (2)
  ["sc-metier-osteopathe.html",
   "&eacute;tat g&eacute;n&eacute;ral) &mdash; baseline 40/100",
   "&eacute;tat g&eacute;n&eacute;ral) : baseline 40/100"],
  ["sc-metier-osteopathe.html",
   "2 800 &euro;</strong> &mdash; ~40 s&eacute;ances/mois",
   "2 800 &euro;</strong>, ~40 s&eacute;ances/mois"],

  // --- sc-metier-petsitter.html (2)
  ["sc-metier-petsitter.html",
   "d&eacute;but de p&eacute;riode &mdash; suivi du solde",
   "d&eacute;but de p&eacute;riode : suivi du solde"],
  ["sc-metier-petsitter.html",
   "mat&eacute;riel, formations &mdash; saisie OCR",
   "mat&eacute;riel, formations ; saisie OCR"],

  // --- sc-metier-sport-canin.html (2)
  ["sc-metier-sport-canin.html",
   "ring, pistage, canicross &mdash; cours collectifs",
   "ring, pistage, canicross : cours collectifs"],
  ["sc-metier-sport-canin.html",
   "la fiche animal &mdash; valorise le club",
   "la fiche animal : valorise le club"],

  // --- sc-metier-veterinaire.html (3)
  ["sc-metier-veterinaire.html",
   "r&eacute;glementation AMM &mdash; registre m&eacute;dicaments",
   "r&eacute;glementation AMM : registre m&eacute;dicaments"],
  ["sc-metier-veterinaire.html",
   "d&eacute;taill&eacute; par taux &mdash; indispensable pour",
   "d&eacute;taill&eacute; par taux : indispensable pour"],
  ["sc-metier-veterinaire.html",
   "plages habituelles &mdash; majoration configurable",
   "plages habituelles : majoration configurable"],

  // --- sc-trans-achats.html (1)
  ["sc-trans-achats.html",
   "facture fournisseur &mdash; le stock se met",
   "facture fournisseur : le stock se met"],

  // --- sc-trans-compta-fec.html (1)
  ["sc-trans-compta-fec.html",
   "l&eacute;gale 10 ans &mdash; conservation dans GED",
   "l&eacute;gale 10 ans : conservation dans GED"],

  // --- sc-trans-stock-inventaire.html (2)
  ["sc-trans-stock-inventaire.html",
   "Mat&eacute;riel...) &mdash; les statistiques seront",
   "Mat&eacute;riel...) : les statistiques seront"],
  ["sc-trans-stock-inventaire.html",
   "sur la p&eacute;riode &mdash; r&eacute;sum&eacute; comptable",
   "sur la p&eacute;riode : r&eacute;sum&eacute; comptable"],

  // --- sc-trans-webhook-calendly.html (3)
  ["sc-trans-webhook-calendly.html",
   "r&eacute;servations en ligne &mdash; cr&eacute;ation de s&eacute;ances",
   "r&eacute;servations en ligne : cr&eacute;ation de s&eacute;ances"],
  ["sc-trans-webhook-calendly.html",
   "Disponible 24/7 &mdash; m&ecirc;me la nuit",
   "Disponible 24/7, m&ecirc;me la nuit"],
  ["sc-trans-webhook-calendly.html",
   "<li>Sauvegarder &mdash; Calendly fournit",
   "<li>Sauvegarder : Calendly fournit"],

  // --- scenarios-index.html (3)
  ["scenarios-index.html",
   "des fonctionnalit&eacute;s &mdash; 12 m&eacute;tiers",
   "des fonctionnalit&eacute;s : 12 m&eacute;tiers"],
  ["scenarios-index.html",
   "de l'animalier &mdash; de la prise de contact",
   "de l'animalier : de la prise de contact"],
  ["scenarios-index.html",
   "pistage, canicross &mdash; cours, stages, comp&eacute;titions SCC.",
   "pistage, canicross : cours, stages, comp&eacute;titions SCC."],
];

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }

// Garde des mots : aucun mot ne doit changer. Ce lot ne comporte AUCUNE majuscule voulue,
// contrairement aux lots 1 a 3 : la comparaison en minuscules est ici une simple securite.
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
console.log(`Mots   : identiques avant et apres. Aucune majuscule ne change dans ce lot.`);
console.log(`\nA REGARDER AU DIFF : les 7 qui sortent de la regle`);
console.log(`   60-registre-carnivores.html:589 et :590  parentheses -- REGLEMENTAIRE (#59 vs #60)`);
console.log(`   sc-metier-equestre.html:390              parentheses -- deux-points deja pris`);
console.log(`   sc-metier-osteopathe.html:459            virgule     -- deux-points deja pris`);
console.log(`   sc-metier-petsitter.html:450             point-virgule -- deux-points deja pris`);
console.log(`   64-eliot-memoire.html:610                point-virgule -- deux-points deja pris`);
console.log(`   sc-trans-webhook-calendly.html:377       virgule     -- rencherissement`);
console.log(`\nEt une ligne reglementaire de plus : 15-rgpd-conformite.html:566, tableau des sous-traitants.`);

if (!ECRIRE) { console.log(`\nLECTURE SEULE. Rien n'a ete ecrit. Relancer avec --write.`); process.exit(0); }

const horo = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const vus = new Set();
for (const [f, avant, apres] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  if (!vus.has(f)) { fs.copyFileSync(p, `${p}.bak.${horo}`); vus.add(f); }
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(avant, apres), { encoding: "utf8" });
}
console.log(`\n*** ECRIT. ***  ${cadratins} cadratins, ${vus.size} fichiers, sauvegardes .bak.${horo}`);
console.log(`Controle : node scripts/etat-cadratins-structure.mjs   (attendu : 9, TOUS en CELLULE)`);
console.log(`           node scripts/lint-docs-public.mjs --check   (c3_cadratins_entite 63 -> 9)`);
