/**
 * @module    scripts/corr-cadratins-prose-lot1
 * @sentinel  S168_DOCS_PUBLIC_CADRATINS_PROSE_LOT1_V1
 * @description
 *   Premier lot de PROSE : les 33 cadratins des trois pages les plus chargees, lues en entier
 *   et validees ligne par ligne par NSE le 24/08. Apres ce lot il restera 137 cadratins,
 *   dont 9 cellules de tableau intouchables.
 *
 *   *** POURQUOI LIRE UNE PAGE ENTIERE PLUTOT QUE PARCOURIR LA LISTE. ***
 *   Prises isolement, ces 33 phrases se ressemblent toutes. Lues dans leur page, elles se
 *   rangent d'elles-memes, et une REGLE apparait, qui n'est pas un gout mais une observation :
 *
 *     DEUX-POINTS PAR DEFAUT (21 cas sur 33). La quasi-totalite de ces <li> sont une ACTION
 *     suivie de son RESULTAT : "Activer la recurrence dans l'agenda : les 6 RDV sont crees en
 *     un clic." Le deux-points dit exactement ce que le cadratin disait.
 *
 *     VIRGULE DANS DEUX CAS SEULEMENT (11 cas).
 *       a) La ligne porte DEJA un deux-points. En remettre un second la rend illisible :
 *          "Traitement prescrit : Metronidazole 5 jours, saisie dans les soins quotidiens".
 *       b) Les deux membres sont DEUX GESTES SUCCESSIFS et non une action et son effet :
 *          "Pesee (15,2 kg), notation etat general". Un deux-points annoncerait a tort que le
 *          second decoule du premier.
 *
 *     UN POINT, UNE SEULE FOIS. "Jour 8 : Boucle presente une diarrhee. Alerter le veterinaire
 *     referent." Le deux-points etait deja pris par "Jour 8 :", et la consigne merite sa phrase.
 *     C'est la SEULE des 33 ou un mot change de forme : "alerter" prend la majuscule.
 *
 *   *** UN CAS A DEUX CADRATINS SUR LA MEME PHRASE. ***
 *   "Acompte 30% &mdash; 138,60 EUR &mdash; paye par CB en ligne" recoit un deux-points puis une
 *   virgule : le premier annonce le montant, le second enchaine. Les deux sont traites par une
 *   seule ancre, sinon la deuxieme ne se retrouverait plus apres la premiere ecriture.
 *
 *   32 ancres pour 33 cadratins, chacune verifiee UNE SEULE FOIS dans son fichier.
 *   Les chaines accentuees sont en \u.... pour garder ce script en ASCII pur.
 *
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node scripts/corr-cadratins-prose-lot1.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

const CORRECTIONS = [
  // --- PENSION (13 cadratins)
  ["sc-metier-pension.html",
   "Affecter le box 3 (m&eacute;dium) &mdash; v&eacute;rifier la disponibilit&eacute;",
   "Affecter le box 3 (m&eacute;dium), v&eacute;rifier la disponibilit&eacute;"],
  ["sc-metier-pension.html",
   "Pes&eacute;e (15,2 kg) &mdash; notation &eacute;tat g&eacute;n&eacute;ral",
   "Pes&eacute;e (15,2 kg), notation &eacute;tat g&eacute;n&eacute;ral"],
  ["sc-metier-pension.html",
   "&agrave; jour &mdash; risque sanitaire et l&eacute;gal.",
   "&agrave; jour : risque sanitaire et l&eacute;gal."],
  ["sc-metier-pension.html",
   "8 box &mdash; statut sant&eacute; de chaque animal",
   "8 box, statut sant&eacute; de chaque animal"],
  ["sc-metier-pension.html",
   "(Vetmedin si cardiaque) &mdash; horodatage automatique",
   "(Vetmedin si cardiaque) : horodatage automatique"],
  ["sc-metier-pension.html",
   "+ &Eacute;v&eacute;nement</strong> &mdash; date/heure/sympt&ocirc;mes",
   "+ &Eacute;v&eacute;nement</strong> : date/heure/sympt&ocirc;mes"],
  ["sc-metier-pension.html",
   "Metronidazole 5 jours &mdash; saisie dans les soins quotidiens",
   "Metronidazole 5 jours, saisie dans les soins quotidiens"],
  ["sc-metier-pension.html",
   "R&eacute;solution sous 48h &mdash; cl&ocirc;ture de l'&eacute;v&eacute;nement registre",
   "R&eacute;solution sous 48h : cl&ocirc;ture de l'&eacute;v&eacute;nement registre"],
  ["sc-metier-pension.html",
   "Vue calendrier &mdash; tous les box visibles sur 8 semaines",
   "Vue calendrier : tous les box visibles sur 8 semaines"],
  ["sc-metier-pension.html",
   "Encaissement CB ou virement &mdash; remise du certificat de garde",
   "Encaissement CB ou virement, remise du certificat de garde"],
  ["sc-metier-pension.html",
   "Acompte 30% &mdash; 138,60&euro; &mdash; pay&eacute; par CB en ligne",
   "Acompte 30% : 138,60&euro;, pay&eacute; par CB en ligne"],
  ["sc-metier-pension.html",
   "une diarrh&eacute;e &mdash; alerter le v&eacute;t&eacute;rinaire r&eacute;f&eacute;rent",
   "une diarrh&eacute;e. Alerter le v&eacute;t&eacute;rinaire r&eacute;f&eacute;rent"],

  // --- COMPORTEMENTALISTE (11 cadratins)
  ["sc-metier-comportementaliste.html",
   "registres DDPP &mdash; le parcours complet",
   "registres DDPP : le parcours complet"],
  ["sc-metier-comportementaliste.html",
   "pour Rex &mdash; mardi 14h",
   "pour Rex : mardi 14h"],
  ["sc-metier-comportementaliste.html",
   "(snapshot baseline) &mdash; ex. score Rex",
   "(snapshot baseline) : ex. score Rex"],
  ["sc-metier-comportementaliste.html",
   "(d&eacute;j&agrave; r&eacute;alis&eacute;) &mdash; 120&euro;",
   "(d&eacute;j&agrave; r&eacute;alis&eacute;), 120&euro;"],
  ["sc-metier-comportementaliste.html",
   "(option) &mdash; 280&euro;",
   "(option), 280&euro;"],
  ["sc-metier-comportementaliste.html",
   "(Yousign) &mdash; le devis passe",
   "(Yousign) : le devis passe"],
  ["sc-metier-comportementaliste.html",
   "facture d'acompte 30% &mdash; 282 &euro;",
   "facture d'acompte 30% : 282 &euro;"],
  ["sc-metier-comportementaliste.html",
   "dans l'agenda &mdash; les 6 RDV",
   "dans l'agenda : les 6 RDV"],
  ["sc-metier-comportementaliste.html",
   "71 &rarr; 78 &mdash; bilan final atteint",
   "71 &rarr; 78, bilan final atteint"],
  ["sc-metier-comportementaliste.html",
   "facture solde &mdash; 658 &euro;",
   "facture solde : 658 &euro;"],
  ["sc-metier-comportementaliste.html",
   "gardiennage automatique &mdash; signature portail",
   "gardiennage automatique : signature portail"],

  // --- TOILETTEUR (9 cadratins)
  ["sc-metier-toiletteur.html",
   "peau sensible 50ml &mdash; le stock passe",
   "peau sensible 50ml : le stock passe"],
  ["sc-metier-toiletteur.html",
   "nourrissant 30ml &mdash; stock d&eacute;bit&eacute;",
   "nourrissant 30ml : stock d&eacute;bit&eacute;"],
  ["sc-metier-toiletteur.html",
   "(1 pulv) &mdash; comptabilis&eacute;",
   "(1 pulv) : comptabilis&eacute;"],
  ["sc-metier-toiletteur.html",
   "dans la s&eacute;ance &mdash; rechercher le produit",
   "dans la s&eacute;ance, rechercher le produit"],
  ["sc-metier-toiletteur.html",
   "sensible 250ml &mdash; 18,90 &euro; TTC",
   "sensible 250ml : 18,90 &euro; TTC"],
  ["sc-metier-toiletteur.html",
   "CB via terminal &mdash; ticket envoy&eacute;",
   "CB via terminal : ticket envoy&eacute;"],
  ["sc-metier-toiletteur.html",
   "245 &euro; HT &mdash; envoi PDF",
   "245 &euro; HT, envoi PDF"],
  ["sc-metier-toiletteur.html",
   "Bon de livraison &mdash; le stock s'incr&eacute;mente",
   "Bon de livraison : le stock s'incr&eacute;mente"],
  ["sc-metier-toiletteur.html",
   "30 jours &mdash; r&egrave;glement programm&eacute;",
   "30 jours : r&egrave;glement programm&eacute;"],
];

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }

// Meme garde que le lot reglementaire : les MOTS doivent etre identiques avant et apres.
// La comparaison est en minuscules, ce qui laisse passer la seule majuscule voulue ("Alerter").
const mots = (s) => s
  .replace(/<[^>]+>/g, " ")
  .replace(/&mdash;|&ndash;/g, " ")
  .replace(/[.:,;!?]/g, " ")
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
console.log(`cadratins : ${cadratins}   (une ancre en couvre deux : l'acompte de la pension)`);
console.log(`fichiers  : ${Object.keys(parFichier).length}\n`);
for (const [f, n] of Object.entries(parFichier).sort()) console.log(`   ${String(n).padStart(3)}  ${f}`);

if (erreurs.length) {
  console.error(`\n*** ${erreurs.length} DEFAUT(S). AUCUNE ECRITURE. ***`);
  erreurs.forEach((e) => console.error(`   ${e}`));
  process.exit(1);
}
console.log(`\nAncres : toutes trouvees exactement une fois.`);
console.log(`Mots   : identiques avant et apres. Seule la ponctuation change,`);
console.log(`         plus la majuscule de "Alerter", voulue et documentee en en-tete.`);

if (!ECRIRE) { console.log(`\nLECTURE SEULE. Rien n'a ete ecrit. Relancer avec --write.`); process.exit(0); }

const horo = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const vus = new Set();
for (const [f, avant, apres] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  if (!vus.has(f)) { fs.copyFileSync(p, `${p}.bak.${horo}`); vus.add(f); }
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(avant, apres), { encoding: "utf8" });
}
console.log(`\n*** ECRIT. ***  ${cadratins} cadratins, ${vus.size} fichiers, sauvegardes .bak.${horo}`);
console.log(`Controle : node scripts/etat-cadratins-structure.mjs   (attendu : 137)`);
console.log(`           node scripts/lint-docs-public.mjs --check   (c3_cadratins_entite 170 -> 137)`);
