/**
 * @module    scripts/corr-arbitrage-d
 * @sentinel  S168_DOCS_PUBLIC_ARBITRAGE_D_V1
 * @description
 *   Applique les arbitrages NSE du 22/08 sur la categorie D. Sur les 7 lignes, DEUX seulement
 *   changent : les cinq autres restent volontairement en place, parce que NSE a choisi de tenir
 *   la promesse et d'ouvrir le chantier produit. Ce script ne les touche donc pas, et ce n'est
 *   pas un oubli.
 *
 *   *** LES DEUX CORRECTIONS. ***
 *
 *   1. Notifications portail -- arbitrage (a). L'onglet Notifications existe bien, sous
 *      Outils > Portail Client. Le "test d'envoi" n'existe nulle part : la mention part, le
 *      chemin est corrige.
 *
 *   2. Export des reglements -- arbitrage (b), plus une mesure apportee par NSE. Le bouton
 *      "Exporter CSV" existe : il est sur /app/reglements, pas dans les Parametres. La phrase
 *      envoyait donc le lecteur au mauvais endroit ALORS QUE LA FONCTION EXISTE. On corrige le
 *      lieu, on ajoute ce que le code dit (l'export prend TOUS les reglements, pas la page
 *      affichee : reglements/page.tsx, title="Exporter tous les reglements en CSV"), et on dit
 *      sans promesse de date que le choix des colonnes n'est pas encore parametrable.
 *
 *   *** LES CINQ QUI RESTENT, PAR DECISION. ***
 *      Mediation > Structures / Conventions / Beneficiaires  -> chantier produit ouvert
 *      Comptabilite > Balance                                -> backlog produit
 *      Reseaux sociaux > Templates                           -> backlog produit
 *   Elles resteront comptees par la gate. C'est voulu : un compteur qui rougit sur une promesse
 *   assumee vaut mieux qu'une promesse effacee pour faire un chiffre.
 *
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node corr-arbitrage-d.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

const CORRECTIONS = [
  ["62-notifications-portail.html",
   "<li>Test d'envoi disponible depuis <code>Param&egrave;tres &rarr; Notifications portail</code></li>",
   "<li>Les notifications se r&egrave;glent depuis <code>Outils &rarr; Portail Client &rarr; Notifications</code></li>",
   "portail/page.tsx : l'onglet Notifications existe ; aucun test d'envoi nulle part (arbitrage a)"],

  ["63-export-csv-reglements.html",
   "<strong>Param&eacute;trage compte :</strong> ajustez les colonnes export&eacute;es dans <code>Param&egrave;tres &rarr; Exports comptables</code> pour matcher vos sp&eacute;cifications expert-comptable.",
   "<strong>O&ugrave; exporter :</strong> le bouton <strong>Exporter CSV</strong> se trouve sur <code>Commercial &rarr; R&egrave;glements</code>. Il exporte <strong>tous</strong> les r&egrave;glements, pas seulement la page affich&eacute;e. Le choix des colonnes export&eacute;es n'est pas encore param&eacute;trable.",
   "reglements/page.tsx L52 : bouton 'Exporter CSV' -> /api/reglements/export-csv, infobulle 'tous les reglements'"],
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

console.log(`\n${CORRECTIONS.length} corrections, ancrees exactement une fois, aucun cadratin.`);
console.log(`\nLAISSES EN PLACE PAR DECISION (5 fantomes, chantier produit ouvert) :`);
console.log(`   Mediation > Structures / Conventions / Beneficiaires`);
console.log(`   Comptabilite > Balance`);
console.log(`   Reseaux sociaux > Templates`);

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
console.log(`Attendu : c1_fantome 7 -> 5.  Controle : node scripts/lint-docs-public.mjs --check`);
