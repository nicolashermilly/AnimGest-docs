/**
 * @module    scripts/corr-metier-boutons
 * @sentinel  S168_DOCS_PUBLIC_METIER_BOUTONS_V1
 * @description
 *   Solde la CATEGORIE B du triage des chemins : 17 lignes qui ecrivent un BOUTON comme une
 *   entree de menu. La v1 du triage proposait une convention uniforme `+ Nouveau`. Elle etait
 *   FAUSSE : `METIER_CONFIG` (src/app/app/seances/page.tsx) montre que l'ecran Seances change de
 *   nom ET de bouton selon le metier. Chaque ligne est donc corrigee avec le libelle REEL de son
 *   metier, lu dans le produit et dans `nav-snapshot.json`, jamais deduit d'une regle.
 *
 *   *** LA FORME. ***
 *   Un bouton n'est pas une cible de navigation : la fleche ment par nature. On ecrit donc
 *   "ecran X, bouton Y" au lieu de "X -> Y". La gate cesse alors de compter -- non parce qu'on
 *   l'a contournee, mais parce qu'il n'y a plus de chemin de menu a verifier.
 *
 *   *** CE QUI RESTE DEHORS : 1 LIGNE SUR 17. ***
 *   `sc-trans-reseaux-sociaux.html:413` promet `Reseaux sociaux > Templates`. Mesure du 22/08 :
 *   l'ecran /app/reseaux-sociaux n'a AUCUN Templates. Ce n'est donc pas un bouton mal ecrit,
 *   c'est une fonction promise et absente. Elle passe en categorie D, arbitrage fondateur.
 *
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node corr-metier-boutons.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

const CLIENT_AV = "<strong>Clients &rarr; Nouveau client</strong>";
const CLIENT_AP = "<strong>Clients</strong>, bouton <strong>+ Nouveau client</strong>";
const CONSULT_AP = "<strong>Consultations</strong>, bouton <strong>+ Nouvelle consultation</strong>";
const FACT_AV = "<strong>Factures &rarr; Nouvelle facture</strong>";
const FACT_AP = "<strong>Factures</strong>, bouton <strong>+ Nouvelle facture</strong>";
const DEVIS_AP = "<strong>Nouveau devis</strong> (l'entr&eacute;e du menu porte d&eacute;j&agrave; votre m&eacute;tier)";

// fichier, ancre EXACTE, remplacement, justification (mesure produit)
const CORRECTIONS = [
  ["sc-metier-eleveur.html",
   "<strong>Animaux &rarr; Nouvel animal</strong>",
   "<strong>Animaux</strong>, bouton <strong>+ Nouvel animal</strong>",
   "animaux/page.tsx L168 : le bouton s'appelle bien '+ Nouvel animal' ; c'est la forme qui etait fausse"],

  ["sc-metier-naturopathe.html",  CLIENT_AV, CLIENT_AP, "clients/page.tsx L473 : bouton '+ Nouveau client'"],
  ["sc-metier-osteopathe.html",   CLIENT_AV, CLIENT_AP, "idem"],
  ["sc-metier-petsitter.html",    CLIENT_AV, CLIENT_AP, "idem"],
  ["sc-metier-sport-canin.html",  CLIENT_AV, CLIENT_AP, "idem"],
  ["sc-metier-veterinaire.html",  CLIENT_AV, CLIENT_AP, "idem"],

  ["sc-metier-naturopathe.html",
   "<strong>S&eacute;ances &rarr; Nouvelle s&eacute;ance</strong>",
   CONSULT_AP,
   "METIER_CONFIG : NUTRITIONNISTE -> titre 'Consultations', bouton '+ Nouvelle consultation'"],

  ["sc-metier-osteopathe.html",
   "<strong>S&eacute;ances &rarr; Nouvelle s&eacute;ance</strong>",
   CONSULT_AP,
   "METIER_CONFIG : OSTEOPATHE -> 'Consultations' / '+ Nouvelle consultation'"],

  ["sc-metier-veterinaire.html",
   "<strong>Agenda &rarr; Nouvelle s&eacute;ance</strong>",
   CONSULT_AP,
   "METIER_CONFIG : VETERINAIRE -> 'Consultations' ; et l'agenda ne cree pas de seance"],

  ["sc-metier-naturopathe.html",
   "<strong>Programmes &rarr; Nouveau programme</strong>",
   "<strong>Programmes nutrition</strong>, bouton <strong>+ Nouveau programme</strong>",
   "nav-snapshot : NUTRITIONNISTE porte 'Programmes nutrition', pas 'Programmes'"],

  ["sc-metier-osteopathe.html",
   "<strong>Programmes &rarr; Nouveau programme</strong>",
   "<strong>Programmes</strong>, bouton <strong>+ Nouveau programme</strong>",
   "nav-snapshot : OSTEOPATHE porte bien 'Programmes' ; programmes/page.tsx L223 pour le bouton"],

  ["sc-metier-osteopathe.html",  FACT_AV, FACT_AP, "factures/page.tsx L95 : bouton '+ Nouvelle facture'"],
  ["sc-metier-veterinaire.html", FACT_AV, FACT_AP, "idem"],

  ["sc-metier-pension.html",
   "<strong>Registre sanitaire &rarr; Nouvel &eacute;v&eacute;nement</strong>",
   "<strong>Registre sanitaire</strong>, bouton <strong>+ &Eacute;v&eacute;nement</strong>",
   "RegistreSanitairePage.tsx L482 : le bouton s'appelle '+ Evenement', pas '+ Nouvel evenement'"],

  ["sc-metier-petsitter.html",
   "<strong>Devis &rarr; Nouveau devis &rarr; mod&egrave;le Pet-sitter</strong>",
   DEVIS_AP,
   "nav-snapshot : PET_SITTER -> 'Nouveau devis' -> /app/devis/new?metier=PET_SITTER"],

  ["sc-metier-comportementaliste.html",
   "<strong>Devis &rarr; Nouveau devis &rarr; mod&egrave;le Comportementaliste</strong>",
   DEVIS_AP,
   "nav-snapshot : EDUCATEUR_COMPORTEMENTALISTE -> 'Nouveau devis' -> /app/devis/new?metier=..."],
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
  if (n !== 1) erreurs.push(`${f} : ancre trouvee ${n} fois, attendu 1 -> ${avant}`);
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
if (CORRECTIONS.some(([, , a]) => /\u2014|\u2013|&mdash;|&ndash;/.test(a))) {
  console.error(`\n*** UN REMPLACEMENT PORTE UN CADRATIN. AUCUNE ECRITURE. ***`);
  process.exit(1);
}

console.log(`\n${CORRECTIONS.length} corrections, toutes ancrees exactement une fois, aucun cadratin.`);
console.log(`${parFichier.size} fichier(s) concerne(s).`);
console.log(`\nNON TRAITE : sc-trans-reseaux-sociaux.html:413 (Templates) -> categorie D.`);

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
console.log(`Controle : node scripts/lint-docs-public.mjs --check`);
