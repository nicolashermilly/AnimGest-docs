/**
 * @module    scripts/corr-textes-docs
 * @sentinel  S168_DOCS_PUBLIC_TEXTES_V1
 * @description
 *   Deuxieme lot du site public. Le premier (corr-chemins-docs) deplacait des CIBLES de menu ;
 *   celui-ci reecrit des PHRASES qui decrivent un ecran d'avant-hier. Chaque reecriture est
 *   adossee au code produit, lu le 21/08, jamais a une intuition. Meme garde-fou : une ancre
 *   qui n'est pas trouvee EXACTEMENT UNE FOIS fait echouer TOUT le lot avant la moindre ecriture.
 *
 *   *** DEUX FACONS DE RENDRE UN CHEMIN HONNETE. ***
 *   1. Si la cible EST une entree de navigation, on corrige la cible : le chemin reste un chemin.
 *   2. Si la cible est un BLOC DANS un ecran, la fleche ment par nature. On casse la fleche et
 *      on ecrit "ecran X, bloc Y, bouton Z". La gate ne compte alors plus rien -- non parce
 *      qu'on l'a contournee, mais parce qu'il n'y a plus de chemin de menu a verifier.
 *
 *   *** CE QUI N'EST PAS ICI. ***
 *   sc-trans-compta-fec.html:425 promet un ecran BALANCE : vue par compte, solde debut,
 *   mouvements debit/credit, solde fin, filtres periode / classe / journal. Mesure du 21/08 :
 *   le mot "balance" n'existe NULLE PART dans src/app. L'ecran Comptabilite porte un controle
 *   d'equilibre (No ecriture / Debit / Credit / Ecart), ce qui n'est pas une balance generale.
 *   Ce n'est donc pas un renommage : c'est une fonction promise au client et absente du produit.
 *   Elle passe en categorie D, arbitrage fondateur. Je ne la reecris pas seul.
 *
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node corr-textes-docs.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

// fichier, ancre EXACTE, remplacement, justification (mesure produit)
const CORRECTIONS = [

  // --- 1. ELIOT. Depuis S158 le client ne saisit plus de cle : l'editeur fournit l'acces,
  //        et l'ecran affiche a la place "Consommation du mois".
  ["ref-faq.html",
   "1) V\u00e9rifiez la cl\u00e9 API Anthropic dans Param\u00e8tres \u2192 Interfaces API \u2192 Eliot. 2) Testez avec le bouton \u00ab Tester la connexion \u00bb. 3) Si l'erreur persiste, regardez les logs container <code>micro_api</code> : <code>docker logs micro_api --tail 100 | grep ELIOT</code>. La cl\u00e9 est chiffr\u00e9e AES-GCM et d\u00e9chiffr\u00e9e \u00e0 la vol\u00e9e - un \u00e9chec de d\u00e9chiffrement indique souvent une corruption \u00e0 corriger en r\u00e9ins\u00e9rant la cl\u00e9.",
   "1) Ouvrez <b>Param\u00e8tres \u2192 Interfaces API</b>, carte Eliot, et v\u00e9rifiez que l'assistant est activ\u00e9. 2) Lisez <b>Consommation du mois</b> : plafond atteint, Eliot cesse de r\u00e9pondre jusqu'\u00e0 la r\u00e9initialisation, le 1er du mois. 3) Testez avec le bouton \u00ab Tester la connexion \u00bb. 4) Si l'erreur persiste, elle n'est pas chez vous : l'acc\u00e8s \u00e0 l'API est fourni par Anim'Gest et vous n'avez aucune cl\u00e9 \u00e0 saisir. \u00c9crivez \u00e0 contact@no-sages-editor.com en indiquant l'heure de la panne.",
   "S158_ELIOT_ECRAN_QUOTA_V1 : plus de champ de cle cote client ; le depannage AES-GCM et docker logs n'a rien a faire sur une page publique"],

  ["sc-trans-eliot.html",
   "<li><strong>Param&egrave;tres &rarr; Interfaces API &rarr; Eliot</strong> : configurer l'API Anthropic et activer</li><li>Choisir le mod&egrave;le : <code>claude-sonnet-4</code> (rapide) ou <code>claude-opus-4</code> (avanc&eacute;)</li>",
   "<li><strong>Param&egrave;tres &rarr; Interfaces API</strong>, carte Eliot : activer l'assistant. Aucune cl&eacute; &agrave; saisir, l'acc&egrave;s est fourni par Anim'Gest.</li><li>Choisir le mod&egrave;le : <code>Claude Sonnet 4.6</code> (rapide, par d&eacute;faut) ou <code>Claude Opus 4.8</code> (avanc&eacute;, plus lent), r&eacute;serv&eacute; aux administrateurs</li>",
   "api-keys/page.tsx L549-552 : les deux seuls modeles offerts, et le select est disabled hors admin"],

  // --- 2. PORTAIL CLIENT. L'ecran a une bascule Activer/Desactiver, pas de revocation ni de
  //        renouvellement, et l'expiration se fixe A LA CREATION.
  ["sc-trans-portail-client.html",
   "<li>Voir tous les acc&egrave;s : actif, expir&eacute;, r&eacute;voqu&eacute;</li><li>R&eacute;voquer un acc&egrave;s en 1 clic en cas de probl&egrave;me</li><li>Renouveler un acc&egrave;s expir&eacute; (nouveau lien magique)</li><li>Statistiques : derni&egrave;re connexion, pages les plus consult&eacute;es</li>",
   "<li>Voir tous les acc&egrave;s : actifs, d&eacute;sactiv&eacute;s, expir&eacute;s</li><li>D&eacute;sactiver un acc&egrave;s en un clic en cas de probl&egrave;me</li><li>La date d'expiration se fixe &agrave; la cr&eacute;ation de l'acc&egrave;s</li><li>Statistiques : derni&egrave;re connexion et nombre de connexions</li>",
   "portail/page.tsx : bascule Activer/Desactiver L413, PCA_DERNIERE_CONNEXION et PCA_NB_CONNEXIONS ; aucune page consultee n'est tracee"],

  // --- 3. COMPTABILITE. Deux vrais renommages, et trois blocs qui n'ont jamais ete des menus.
  ["sc-trans-compta-fec.html",
   "<strong>Comptabilit&eacute; &rarr; Plan comptable</strong> : adapt&eacute; au m&eacute;tier choisi",
   "<strong>Param&egrave;tres &rarr; Plan de comptes</strong> : adapt&eacute; au m&eacute;tier choisi",
   "nav-snapshot : le plan de comptes est une tuile de Parametres, pas un bloc de Comptabilite"],

  ["sc-trans-compta-fec.html",
   "<strong>Comptabilit&eacute; &rarr; Export TVA</strong>",
   "<strong>Gestion &rarr; D&eacute;claration TVA</strong>",
   "nav-snapshot : groupe Gestion -> 'Declaration TVA' -> /app/factures/tva, qui ventile bien par taux"],

  ["sc-trans-compta-fec.html",
   "<strong>Comptabilit&eacute; &rarr; Exercices &rarr; + Nouvel exercice</strong>",
   "<strong>Comptabilit&eacute;</strong>, bloc <strong>Exercices</strong>, bouton <strong>Nouvel exercice</strong>",
   "comptabilite/page.tsx L87 et L148 : bloc 'Exercices', bouton 'Nouvel exercice' (sans le +)"],

  ["sc-trans-compta-fec.html",
   "<strong>Comptabilit&eacute; &rarr; Exercices &rarr; Cl&ocirc;turer</strong>",
   "<strong>Comptabilit&eacute;</strong>, bloc <strong>Exercices</strong>, bouton <strong>Cl&ocirc;turer</strong>",
   "comptabilite/page.tsx L97 : bouton 'Cloturer' dans le bloc Exercices"],

  ["com-onboarding.html",
   "Comptabilit&eacute; &rarr; Balance &rarr; D&eacute;bit = Cr&eacute;dit",
   "Comptabilit&eacute;, contr&ocirc;le d'&eacute;quilibre : D&eacute;bit = Cr&eacute;dit",
   "comptabilite/page.tsx L139-141 : 'Toutes les ecritures sont equilibrees', colonnes Debit/Credit/Ecart"],

  ["com-onboarding.html",
   "Comptabilit&eacute; &rarr; Exercices &rarr; + Nouvel exercice 2026",
   "Comptabilit&eacute;, bloc Exercices, bouton Nouvel exercice 2026",
   "meme bloc, meme bouton : ce n'est pas un chemin de menu"],

  // --- 4. UN PLACEHOLDER DE ROUTE PUBLIE EN CLAIR SUR LE SITE VITRINE.
  ["sc-metier-sport-canin.html",
   "<strong>S&eacute;ances &rarr; [id] &rarr; Suivi CAC</strong> pour &eacute;valuer la progression",
   "<strong>Cours &amp; S&eacute;ances</strong>, ouvrir la s&eacute;ance, bouton <strong>Suivi CAC</strong> pour &eacute;valuer la progression",
   "METIER_CONFIG : SPORT_CANIN affiche 'Cours & Seances' ; seances/[id]/page.tsx L569 porte le bouton Suivi CAC"],

  // --- 5. DEUX PARAGRAPHES AVALES PAR LA FLECHE. On isole le chemin dans sa propre balise :
  //        il redevient lisible pour l'humain ET verifiable par la gate.
  ["ref-faq.html",
   "R\u00e9seaux sociaux \u2192 onglet + Nouveau post. S\u00e9lectionnez le r\u00e9seau",
   "<b>Outils \u2192 R\u00e9seaux sociaux</b>, bouton <b>+ Nouvelle publication</b>. S\u00e9lectionnez le r\u00e9seau",
   "reseaux-sociaux/page.tsx L121 : le bouton s'appelle '+ Nouvelle publication', il n'y a pas d'onglet"],

  ["ref-faq.html",
   "Param\u00e8tres \u2192 R\u00e9seaux sociaux (ou lien Param\u00e8tres en haut de la page). Renseignez",
   "<b>Outils \u2192 R\u00e9seaux sociaux</b>, bouton <b>Param\u00e8tres</b> en haut de la page. Renseignez",
   "reseaux-sociaux/page.tsx L120 : le bouton 'Parametres' mene a /app/parametres/reseaux-sociaux"],
];

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }

// --- 1. VERIFICATION AVANT TOUTE ECRITURE.
const erreurs = [];
const parFichier = new Map();
for (const [f, avant, apres, pourquoi] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  if (!fs.existsSync(p)) { erreurs.push(`${f} : fichier introuvable`); continue; }
  const src = parFichier.get(f) ?? fs.readFileSync(p, "utf8");
  parFichier.set(f, src);
  const n = src.split(avant).length - 1;
  if (n !== 1) erreurs.push(`${f} : ancre trouvee ${n} fois, attendu 1 -> ${avant.slice(0, 70)}...`);
  console.log(`  [${n === 1 ? "OK " : "!! "}] ${f}`);
  console.log(`         ${avant.slice(0, 110)}${avant.length > 110 ? " [...]" : ""}`);
  console.log(`      -> ${apres.slice(0, 110)}${apres.length > 110 ? " [...]" : ""}`);
  console.log(`         (${pourquoi})`);
}

if (erreurs.length) {
  console.error(`\n*** ${erreurs.length} ANCRE(S) EN DEFAUT. AUCUNE ECRITURE. ***`);
  erreurs.forEach((e) => console.error(`   ${e}`));
  process.exit(1);
}

// --- 1 bis. GARDE DE FORME. Aucun cadratin ne doit entrer par ce script.
const cadratins = CORRECTIONS.filter(([, , a]) => /\u2014|\u2013|&mdash;|&ndash;/.test(a));
if (cadratins.length) {
  console.error(`\n*** ${cadratins.length} REMPLACEMENT(S) PORTENT UN CADRATIN. AUCUNE ECRITURE. ***`);
  process.exit(1);
}

console.log(`\n${CORRECTIONS.length} reecritures, toutes ancrees exactement une fois, aucun cadratin.`);
console.log(`${parFichier.size} fichier(s) concerne(s).`);

if (!ECRIRE) { console.log(`\nLECTURE SEULE. Rien n'a ete ecrit. Relancer avec --write.`); process.exit(0); }

// --- 2. ECRITURE. Un .bak horodate par fichier touche.
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
console.log(`\n*** ECRIT : ${contenus.size} fichier(s), ${CORRECTIONS.length} reecritures. ***`);
console.log(`Controle : node scripts/lint-docs-public.mjs`);
