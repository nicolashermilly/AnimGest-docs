/**
 * @module    scripts/corr-bl-chain
 * @sentinel  S168_DOCS_PUBLIC_BL_CHAIN_V1
 * @description
 *   Suite du renommage produit [S168_R3B_BL_CHAIN_V1] Pt5, qui desambiguise la chaine des bons
 *   de livraison : 'BL fournisseur (reception)' devient 'Receptions fournisseurs', et
 *   'Bons de livraison' devient 'Bons de livraison (clients)'.
 *
 *   *** UNE SEULE LIGNE DU SITE EST CONCERNEE, ET ELLE ETAIT DEJA FAUSSE AVANT. ***
 *   Recensement sur les 171 pages : cinq occurrences, une seule est un chemin.
 *     - changelog.html:483 et index.html:414 : titres de nouveautes, de la PROSE. Intouches.
 *     - sc-trans-ged.html:389 : "devis, bons de livraison, ordonnances..." , une enumeration de
 *       TYPES DE DOCUMENTS, pas un chemin de menu. Intouche.
 *     - tuto-bons-livraison.html:6 : le titre d'une page de tutoriel. Ce n'est pas un chemin :
 *       laisse a l'arbitrage (le renommer en "(clients)" serait coherent, mais c'est un nom de
 *       page, pas un libelle de navigation).
 *     - sc-trans-achats.html:401 : LE chemin. Corrige ici.
 *
 *   *** POURQUOI CETTE LIGNE ETAIT DEJA FAUSSE. ***
 *   Son contexte est sans ambiguite : "A la reception physique des marchandises", "Lier au BC
 *   d'origine", "Verifier les quantites recues vs commandees", "Le stock est incremente". C'est
 *   la RECEPTION FOURNISSEUR, donc /app/achats/bl. Or la ligne envoyait vers "Bons de livraison",
 *   qui est l'ecran CLIENT (/app/bon-livraison). Le renommage Pt5 existe precisement pour lever
 *   cette confusion : la doc en etait une victime.
 *
 *   Elle etait par ailleurs INVISIBLE a la gate, parce que sa racine s'ecrivait "Achats" et que le
 *   groupe s'appelle "Achats & Stock". Corriger la racine la rend verifiable pour toujours.
 *
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node corr-bl-chain.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

const CORRECTIONS = [
  ["sc-trans-achats.html",
   "<strong>Achats &rarr; Bons de livraison &rarr; + Nouveau BL</strong>",
   "<strong>Achats &amp; Stock &rarr; R&eacute;ceptions fournisseurs</strong>, bouton <strong>Nouveau bon de livraison</strong>",
   "le contexte decrit une reception fournisseur : /app/achats/bl, renomme 'Receptions fournisseurs' par Pt5 ; bouton reel L157"],
];

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }

const erreurs = [];
for (const [f, avant, apres, pourquoi] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  if (!fs.existsSync(p)) { erreurs.push(`${f} : fichier introuvable`); continue; }
  const src = fs.readFileSync(p, "utf8");
  const n = src.split(avant).length - 1;
  if (n !== 1) erreurs.push(`${f} : ancre trouvee ${n} fois, attendu 1`);
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

console.log(`\n${CORRECTIONS.length} correction, ancree exactement une fois, aucun cadratin.`);
console.log(`\nINTOUCHES A DESSEIN : changelog.html:483, index.html:414, sc-trans-ged.html:389`);
console.log(`(prose et enumerations de types de documents, pas des chemins de menu).`);
console.log(`A ARBITRER : le titre de tuto-bons-livraison.html.`);

if (!ECRIRE) { console.log(`\nLECTURE SEULE. Rien n'a ete ecrit. Relancer avec --write.`); process.exit(0); }

const horo = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
for (const [f, avant, apres] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  const src = fs.readFileSync(p, "utf8");
  fs.copyFileSync(p, `${p}.bak.${horo}`);
  fs.writeFileSync(p, src.replace(avant, apres), { encoding: "utf8" });
  console.log(`  ecrit : ${f}   (sauvegarde ${f}.bak.${horo})`);
}
console.log(`\n*** ECRIT. ***  Controle : node scripts/lint-docs-public.mjs --check`);
