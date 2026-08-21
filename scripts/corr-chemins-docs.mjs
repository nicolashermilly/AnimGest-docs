/**
 * @module    scripts/corr-chemins-docs
 * @sentinel  S168_DOCS_PUBLIC_CHEMINS_V1
 * @description
 *   Corrige les chemins d'interface du site public dont la cible a ete RENOMMEE ou DEPLACEE
 *   dans le produit. Chaque correction est adossee a `nav-snapshot.json` (SSOT), jamais a une
 *   intuition. Une ancre qui n'est pas trouvee EXACTEMENT UNE FOIS fait echouer TOUT le lot
 *   AVANT la moindre ecriture : on ne corrige pas a moitie.
 *
 *   *** CE QUI N'EST PAS ICI, ET POURQUOI. ***
 *
 *   1. Les chemins qui nomment un ECRAN METIER ou un BOUTON. Mesure du 21/08 dans
 *      src/app/app/seances/page.tsx (table METIER_CONFIG) : l'ecran Seances change de nom ET
 *      de bouton selon le metier -- "Consultations / + Nouvelle consultation" chez l'osteopathe,
 *      "Gardes en cours / + Nouvelle garde" en pension. Leur appliquer une convention uniforme
 *      ferait PASSER LA GATE a des chemins qui resteraient faux : un defaut invisible, pire que
 *      le defaut visible d'aujourd'hui. Ils partent avec la relecture par metier.
 *
 *   2. Le TEXTE autour de deux chemins Eliot. Ce script deplace la cible, il ne reecrit pas la
 *      phrase. Or depuis S158 (marqueur S158_ELIOT_ECRAN_QUOTA_V1 dans
 *      src/app/app/parametres/api-keys/page.tsx) le client ne saisit PLUS de cle API Anthropic :
 *      l'acces est fourni par l'editeur, et l'ecran affiche a la place "Consommation du mois".
 *      Restent donc faux APRES ce script, et attendent un arbitrage :
 *        - ref-faq.html      : "Verifiez la cle API Anthropic dans ..." (etape 1 de la FAQ Eliot)
 *        - sc-trans-eliot.html : "... : configurer l'API Anthropic et activer"
 *      Meme situation sur sc-trans-portail-client.html:437 : le chemin est corrige, mais la
 *      phrase promet "revoquer en 1 clic" et "renouveler" ; l'ecran porte une bascule
 *      Activer/Desactiver, et l'expiration se fixe A LA CREATION. Pas de bouton Renouveler.
 *      Le chemin devient juste, la phrase reste a reformuler. C'est dit, ce n'est pas cache.
 *
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node corr-chemins-docs.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

// Deux encodages COEXISTENT dans le corpus : ref-faq.html ecrit la fleche et les accents en
// clair (UTF-8), les pages sc-* / adv-* / NN-* les ecrivent en entites (&rarr; &egrave;).
// Les ancres ci-dessous respectent l'encodage REEL de chaque fichier, mesure octet par octet.
// fichier, ancre EXACTE, remplacement, justification (SSOT)
const CORRECTIONS = [
  ["ref-faq.html",
   "Param\u00e8tres \u2192 API keys \u2192 Stripe",
   "Param\u00e8tres \u2192 Interfaces API \u2192 Stripe",
   "nav-snapshot : Interfaces & Communications -> 'Interfaces API' -> /app/parametres/api-keys"],

  ["ref-faq.html",
   "Param\u00e8tres \u2192 API keys \u2192 Eliot",
   "Param\u00e8tres \u2192 Interfaces API \u2192 Eliot",
   "nav-snapshot : 'Interfaces API' ; la carte Eliot y vit (titre produit 'Eliot - Assistant IA')"],

  ["ref-faq.html",
   "Param\u00e8tres \u2192 Utilisateurs \u2192 + Nouvel utilisateur",
   "Administration \u2192 Utilisateurs & R\u00f4les \u2192 + Nouvel utilisateur",
   "nav-snapshot : groupe Administration -> 'Utilisateurs & Roles' -> /app/admin"],

  ["ref-faq.html",
   "Param\u00e8tres \u2192 Plan comptable",
   "Param\u00e8tres \u2192 Plan de comptes",
   "nav-snapshot : Comptabilite & Paiements -> 'Plan de comptes' -> /app/parametres/plan-comptable"],

  ["ref-faq.html",
   "Param\u00e8tres \u2192 GED",
   "Outils \u2192 Documents (GED)",
   "nav-snapshot : groupe Outils -> 'Documents (GED)' -> /app/ged"],

  ["sc-metier-mediation.html",
   "Param\u00e8tres &rarr; Mon m\u00e9tier",
   "Param\u00e8tres &rarr; S\u00e9lection M\u00e9tier(s)",
   "nav-snapshot : Metier & Activite -> 'Selection Metier(s)' -> /app/mes-parametres/metier"],

  ["sc-trans-registres.html",
   "Param&egrave;tres &rarr; Personnel &rarr; ACACED",
   "Param&egrave;tres &rarr; S&eacute;lection M&eacute;tier(s) &rarr; ACACED",
   "mesure du 20/08 : l'attestation ACACED vit sur /app/mes-parametres/metier ; 'Personnel' n'existe pas"],

  ["sc-metier-associations.html",
   "Associations &rarr; T&acirc;ches",
   "Associations &rarr; T&acirc;ches b&eacute;n&eacute;voles",
   "nav-snapshot : metier ASSOCIATIONS -> entree 'Taches benevoles'"],

  ["sc-metier-associations.html",
   "Associations &rarr; Param&eacute;trage adh&eacute;sion",
   "Associations &rarr; Param&egrave;tres adh&eacute;sion",
   "nav-snapshot : metier ASSOCIATIONS -> entree 'Parametres adhesion'"],

  ["64-eliot-memoire.html",
   "Param&egrave;tres &rarr; Eliot &rarr; M&eacute;moire",
   "Administration &rarr; M&eacute;moire Eliot",
   "nav-snapshot : groupe Administration -> 'Memoire Eliot' -> /app/parametres/eliot-memoire"],

  ["72-droits-utilisateurs.html",
   "Param&egrave;tres &rarr; Utilisateurs &rarr; Matrice acc&egrave;s",
   "Administration &rarr; Utilisateurs &amp; R&ocirc;les &rarr; Matrice acc&egrave;s",
   "nav-snapshot : groupe Administration -> 'Utilisateurs & Roles' -> /app/admin"],

  ["sc-metier-naturopathe.html",
   "Param&egrave;tres &rarr; Articles",
   "Param&egrave;tres &rarr; Catalogue articles",
   "nav-snapshot : Metier & Activite -> 'Catalogue articles' -> /app/parametres/articles"],

  ["adv-eliot-avance.html",
   "Param&egrave;tres &rarr; Eliot &rarr; Consommation",
   "Param&egrave;tres &rarr; Interfaces API &rarr; Eliot",
   "S158_ELIOT_ECRAN_QUOTA_V1 : le bloc 'Consommation du mois' est DANS la carte Eliot de api-keys"],

  ["sc-trans-eliot.html",
   "Param&egrave;tres &rarr; Eliot",
   "Param&egrave;tres &rarr; Interfaces API &rarr; Eliot",
   "nav-snapshot : aucune tuile 'Eliot' ; la carte Eliot vit sous 'Interfaces API'"],

  ["sc-metier-veterinaire.html",
   "Param&egrave;tres &rarr; Articles",
   "Param&egrave;tres &rarr; Catalogue articles",
   "nav-snapshot : Metier & Activite -> 'Catalogue articles' -> /app/parametres/articles"],

  ["sc-trans-stock-inventaire.html",
   "Param&egrave;tres &rarr; Articles &rarr; + Nouvel article",
   "Param&egrave;tres &rarr; Catalogue articles &rarr; + Nouvel article",
   "nav-snapshot : Metier & Activite -> 'Catalogue articles' -> /app/parametres/articles"],

  ["sc-metier-comportementaliste.html",
   "Param&egrave;tres &rarr; Portail client &rarr; Envoyer le lien d'activation",
   "Outils &rarr; Portail Client &rarr; Envoyer le lien par email",
   "nav-snapshot : groupe Outils -> 'Portail Client' ; bouton reel = 'Envoyer le lien par email'"],

  ["sc-trans-portail-client.html",
   "Param&egrave;tres &rarr; Portail client &rarr; Liste tiers",
   "Outils &rarr; Portail Client &rarr; Acc&egrave;s clients",
   "portail/page.tsx : deux onglets et deux seulement, 'Acces clients' et 'Notifications'"],

  ["sc-trans-portail-client.html",
   "Param&egrave;tres &rarr; Portail client &rarr; Historique acc&egrave;s",
   "Outils &rarr; Portail Client &rarr; Acc&egrave;s clients",
   "portail/page.tsx : l'historique des acces est DANS l'onglet 'Acces clients'"],

  ["sc-trans-reseaux-sociaux.html",
   "Param&egrave;tres &rarr; R&eacute;seaux sociaux",
   "Outils &rarr; R&eacute;seaux sociaux &rarr; Param&egrave;tres",
   "nav-snapshot : Outils -> 'Reseaux sociaux' ; l'ecran porte un bouton 'Parametres'"],
];

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }

// --- 1. VERIFICATION AVANT TOUTE ECRITURE. Une ancre absente ou multiple fait echouer le lot.
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

console.log(`\n${CORRECTIONS.length} corrections, toutes ancrees exactement une fois.`);
console.log(`${parFichier.size} fichier(s) concerne(s).`);

if (!ECRIRE) { console.log(`\nLECTURE SEULE. Rien n'a ete ecrit. Relancer avec --write.`); process.exit(0); }

// --- 2. ECRITURE. Un .bak horodate par fichier touche, puis une seule ecriture par fichier.
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
console.log(`Les .bak.* sont ignores par .gitignore. Controle : node scripts/lint-docs-public.mjs`);
