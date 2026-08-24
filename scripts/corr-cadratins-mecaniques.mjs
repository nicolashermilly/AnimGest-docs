/**
 * @module    scripts/corr-cadratins-mecaniques
 * @sentinel  S168_DOCS_PUBLIC_CADRATINS_MECA_V1
 * @description
 *   Corrige les 59 cadratins dont LE BALISAGE decide du role, mesures par
 *   etat-cadratins-structure.mjs sur les 171 pages le 24/08 : 4 pieds de page, 34 titres,
 *   21 gloses. Les 189 autres ne sont PAS touches ici (9 cellules de tableau, 19 en reserve
 *   reglementaire, 161 de prose a lire).
 *
 *   *** POURQUOI CES 59 ET PAS D'AUTRES. ***
 *   Un cadratin ne se remplace pas par un signe unique. Le classement par MOTS (premiere version,
 *   etat-cadratins-prose.mjs) rendait 28 "sigles" dont 7 vrais, et ratait
 *   "<strong>Reglement</strong> &mdash;", 4e item de la meme liste que BC, BL, FF. Le classement
 *   par BALISE ne se trompe pas sur ces trois familles-la, parce que le marqueur est structurel :
 *     PIED   la ligne dit "Anim'Gest &mdash; No Sage's Editor" et porte DEJA des &middot;
 *     TITRE  le cadratin est dans <title>, <hN> ou un element de classe "title"
 *     GLOSE  le cadratin suit exactement "<li><strong>...</strong>"
 *
 *   *** LES PIEDS DE PAGE SONT UNE CORRECTION DE BUG. ***
 *   maj-cadratins-docs.mjs traitait les pieds de page. Ces quatre-la lui ont echappe. Chacune de
 *   ces lignes separe deja ses autres segments par &middot; : le cadratin y contredit la ligne
 *   elle-meme. Ce n'est pas un arbitrage de style.
 *
 *   *** LE DEUX-POINTS DES GLOSES SUIT LE CORPUS, PAS MON GOUT. ***
 *   Mesure sur les 171 pages : " : " apparait 556 fois, "&nbsp;:" 22 fois. On ecrit donc " : ".
 *
 *   *** TROIS CORRECTIONS NE SONT PAS DE SIMPLES REMPLACEMENTS DE SIGNE. A REGARDER AU DIFF. ***
 *   1 et 2. adv-eliot-avance.html, <h3>Consultation &mdash; sans confirmation</h3> et
 *      <h3>Actions d'ecriture &mdash; avec confirmation</h3>. Ici le membre de droite est un
 *      QUALIFICATIF, pas un sous-titre : "Consultation &middot; sans confirmation" ne veut plus
 *      rien dire. Parentheses.
 *   3. scenarios-index.html, <title>Scenarios &mdash; Anim'Gest &middot; Anim'Gest</title>.
 *      "Anim'Gest" y est ecrit DEUX FOIS. Mettre un point median donnerait
 *      "Scenarios &middot; Anim'Gest &middot; Anim'Gest". Le defaut n'est pas le signe, c'est la
 *      repetition : le titre devient "Scenarios &middot; Anim'Gest". C'est la seule correction de
 *      ce lot qui RETIRE des mots.
 *
 *   *** CE QUI N'EST PAS TOUCHE, ET POURQUOI. ***
 *   sc-trans-compta-fec.html, "<strong>Comptabilite &rarr; Balance</strong>" : c'est le fantome
 *   D-2, garde par arbitrage du 22/08. On change la ponctuation APRES </strong>, jamais la chaine
 *   du chemin. Le compteur c1_fantome de la gate doit rester a 5 apres ce lot.
 *
 *   Chaque ancre est verifiee UNE SEULE FOIS dans son fichier, sinon rien n'est ecrit.
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node scripts/corr-cadratins-mecaniques.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

const CORRECTIONS = [
  // --- PIED DE PAGE (4) : la ligne porte deja des &middot; ; oubli de maj-cadratins-docs.mjs
  ["75-connecteur-yousign.html",
   "Anim'Gest &mdash; No Sage's Editor",
   "Anim'Gest &middot; No Sage's Editor"],
  ["connecteur-stripe.html",
   "Anim'Gest &mdash; No Sage's Editor",
   "Anim'Gest &middot; No Sage's Editor"],
  ["sc-metier-mediation.html",
   "Anim'Gest &mdash; No Sage's Editor",
   "Anim'Gest &middot; No Sage's Editor"],
  ["tuto-mediation.html",
   "Anim'Gest &mdash; No Sage's Editor",
   "Anim'Gest &middot; No Sage's Editor"],

  // --- TITRE (31) : <title>, <hN> ou class=title : meme role que les pieds de page
  ["15-rgpd-conformite.html",
   "<h3>Caisses NF525 &mdash; Inalt&eacute;rabilit&eacute;</h3>",
   "<h3>Caisses NF525 &middot; Inalt&eacute;rabilit&eacute;</h3>"],
  ["15-rgpd-conformite.html",
   "<h3>RFE &mdash; Calendrier facturation &eacute;lectronique</h3>",
   "<h3>RFE &middot; Calendrier facturation &eacute;lectronique</h3>"],
  ["16-landing-page.html",
   "<title>Anim'Gest &mdash; Le logiciel des professionnels du soin animalier</title>",
   "<title>Anim'Gest &middot; Le logiciel des professionnels du soin animalier</title>"],
  ["adv-eliot-avance.html",
   "<title>Eliot IA &mdash; R&eacute;f&eacute;rence avanc&eacute;e &middot; Anim'Gest</title>",
   "<title>Eliot IA &middot; R&eacute;f&eacute;rence avanc&eacute;e &middot; Anim'Gest</title>"],
  ["adv-eliot-avance.html",
   "<h1>Eliot IA &mdash; R&eacute;f&eacute;rence avanc&eacute;e</h1>",
   "<h1>Eliot IA &middot; R&eacute;f&eacute;rence avanc&eacute;e</h1>"],
  ["index.html",
   "<title>Anim'Gest &mdash; Documentation publique</title>",
   "<title>Anim'Gest &middot; Documentation publique</title>"],
  ["index.html",
   "<h1>Anim'Gest &mdash; Documentation</h1>",
   "<h1>Anim'Gest &middot; Documentation</h1>"],
  ["index.html",
   "<div class=\"title\">FAQ &mdash; Questions fr&eacute;quentes</div>",
   "<div class=\"title\">FAQ &middot; Questions fr&eacute;quentes</div>"],
  ["index.html",
   "<div class=\"title\">Eliot IA &mdash; Sc&eacute;nario d'usage</div>",
   "<div class=\"title\">Eliot IA &middot; Sc&eacute;nario d'usage</div>"],
  ["index.html",
   "<div class=\"title\">Eliot IA &mdash; R&eacute;f&eacute;rence avanc&eacute;e</div>",
   "<div class=\"title\">Eliot IA &middot; R&eacute;f&eacute;rence avanc&eacute;e</div>"],
  ["sc-metier-comportementaliste.html",
   "<span class=\"step-title\">R&eacute;alisation du Bilan Comportemental &mdash; 4 sections</span>",
   "<span class=\"step-title\">R&eacute;alisation du Bilan Comportemental &middot; 4 sections</span>"],
  ["sc-metier-comportementaliste.html",
   "<span class=\"step-title\">R&eacute;alisation des s&eacute;ances &mdash; Mise &agrave; jour CAC</span>",
   "<span class=\"step-title\">R&eacute;alisation des s&eacute;ances &middot; Mise &agrave; jour CAC</span>"],
  ["sc-metier-comportementaliste.html",
   "<span class=\"step-title\">Analyse et fid&eacute;lisation &mdash; Bilan du parcours</span>",
   "<span class=\"step-title\">Analyse et fid&eacute;lisation &middot; Bilan du parcours</span>"],
  ["sc-metier-eleveur.html",
   "<span class=\"step-title\">Registres de l'&eacute;levage &mdash; Contr&ocirc;le de conformit&eacute;</span>",
   "<span class=\"step-title\">Registres de l'&eacute;levage &middot; Contr&ocirc;le de conformit&eacute;</span>"],
  ["sc-metier-osteopathe.html",
   "<span class=\"step-title\">Suivi CAC &mdash; Quantification de la progression</span>",
   "<span class=\"step-title\">Suivi CAC &middot; Quantification de la progression</span>"],
  ["sc-metier-pension.html",
   "<span class=\"step-title\">Registres l&eacute;gaux &mdash; Bilan de saison</span>",
   "<span class=\"step-title\">Registres l&eacute;gaux &middot; Bilan de saison</span>"],
  ["sc-trans-compta-fec.html",
   "<span class=\"step-title\">&Eacute;criture automatique &mdash; Vente d'une prestation</span>",
   "<span class=\"step-title\">&Eacute;criture automatique &middot; Vente d'une prestation</span>"],
  ["sc-trans-compta-fec.html",
   "<span class=\"step-title\">&Eacute;criture automatique &mdash; R&egrave;glement client</span>",
   "<span class=\"step-title\">&Eacute;criture automatique &middot; R&egrave;glement client</span>"],
  ["sc-trans-ged.html",
   "<title>GED &mdash; Gestion &Eacute;lectronique de Documents &middot; Anim'Gest</title>",
   "<title>GED &middot; Gestion &Eacute;lectronique de Documents &middot; Anim'Gest</title>"],
  ["sc-trans-ged.html",
   "<h1>GED &mdash; Gestion &Eacute;lectronique de Documents</h1>",
   "<h1>GED &middot; Gestion &Eacute;lectronique de Documents</h1>"],
  ["scenarios-index.html",
   "<div class=\"title\">Eliot &mdash; Assistant IA</div>",
   "<div class=\"title\">Eliot &middot; Assistant IA</div>"],
  ["scenarios-index.html",
   "<div class=\"title\">GED &mdash; Documents</div>",
   "<div class=\"title\">GED &middot; Documents</div>"],
  ["75-connecteur-yousign.html",
   "<h1>Signature &eacute;lectronique &mdash; Yousign</h1>",
   "<h1>Signature &eacute;lectronique &middot; Yousign</h1>"],
  ["connecteur-stripe.html",
   "<h1>Paiement en ligne &mdash; Stripe</h1>",
   "<h1>Paiement en ligne &middot; Stripe</h1>"],
  ["sc-trans-eliot.html",
   "<title>Eliot &mdash; Votre assistant IA &middot; Anim'Gest</title>",
   "<title>Eliot &middot; Votre assistant IA &middot; Anim'Gest</title>"],
  ["sc-trans-eliot.html",
   "<h1>Eliot &mdash; Votre assistant IA</h1>",
   "<h1>Eliot &middot; Votre assistant IA</h1>"],
  ["sc-trans-eliot.html",
   "<span class=\"step-title\">Eliot &mdash; Recherche d'informations</span>",
   "<span class=\"step-title\">Eliot &middot; Recherche d'informations</span>"],
  ["sc-trans-eliot.html",
   "<span class=\"step-title\">Eliot &mdash; Cr&eacute;ation de s&eacute;ances et devis</span>",
   "<span class=\"step-title\">Eliot &middot; Cr&eacute;ation de s&eacute;ances et devis</span>"],
  ["sc-trans-eliot.html",
   "<span class=\"step-title\">Eliot &mdash; Facturation et r&egrave;glements</span>",
   "<span class=\"step-title\">Eliot &middot; Facturation et r&egrave;glements</span>"],
  ["sc-trans-eliot.html",
   "<span class=\"step-title\">Eliot &mdash; Planification et agenda</span>",
   "<span class=\"step-title\">Eliot &middot; Planification et agenda</span>"],
  ["sc-trans-eliot.html",
   "<span class=\"step-title\">Boucle agentique &mdash; Comment Eliot travaille</span>",
   "<span class=\"step-title\">Boucle agentique &middot; Comment Eliot travaille</span>"],

  // --- TITRE, CAS PARTICULIERS (3) : voir le commentaire d'en-tete, ce ne sont PAS de simples remplacements de signe
  ["adv-eliot-avance.html",
   "<h3>Consultation &mdash; sans confirmation</h3>",
   "<h3>Consultation (sans confirmation)</h3>"],
  ["adv-eliot-avance.html",
   "<h3>Actions d'&eacute;criture &mdash; avec confirmation</h3>",
   "<h3>Actions d'&eacute;criture (avec confirmation)</h3>"],
  ["scenarios-index.html",
   "<title>Sc&eacute;narios &mdash; Anim'Gest &middot; Anim'Gest</title>",
   "<title>Sc&eacute;narios &middot; Anim'Gest</title>"],

  // --- GLOSE (21) : <li><strong>X</strong> : definition ; le corpus ecrit ' : ' 556 fois contre 22 en &nbsp;:
  ["33-module-achats-complet.html",
   "<li><strong>BC</strong> &mdash;",
   "<li><strong>BC</strong> :"],
  ["33-module-achats-complet.html",
   "<li><strong>BL</strong> &mdash;",
   "<li><strong>BL</strong> :"],
  ["33-module-achats-complet.html",
   "<li><strong>FF</strong> &mdash;",
   "<li><strong>FF</strong> :"],
  ["33-module-achats-complet.html",
   "<li><strong>R&egrave;glement</strong> &mdash;",
   "<li><strong>R&egrave;glement</strong> :"],
  ["33-module-achats-complet.html",
   "<li><strong>BR</strong> &mdash;",
   "<li><strong>BR</strong> :"],
  ["33-module-achats-complet.html",
   "<li><strong>DAF</strong> &mdash;",
   "<li><strong>DAF</strong> :"],
  ["33-module-achats-complet.html",
   "<li><strong>AF</strong> &mdash;",
   "<li><strong>AF</strong> :"],
  ["adv-eliot-avance.html",
   "<li><strong>Confirmation humaine syst&eacute;matique</strong> &mdash;",
   "<li><strong>Confirmation humaine syst&eacute;matique</strong> :"],
  ["adv-eliot-avance.html",
   "<li><strong>Permissions par r&ocirc;le</strong> &mdash;",
   "<li><strong>Permissions par r&ocirc;le</strong> :"],
  ["adv-eliot-avance.html",
   "<li><strong>Tra&ccedil;abilit&eacute; compl&egrave;te</strong> &mdash;",
   "<li><strong>Tra&ccedil;abilit&eacute; compl&egrave;te</strong> :"],
  ["sc-metier-comportementaliste.html",
   "<li><strong>Pet-sitter &rarr; Nouvelle r&eacute;servation</strong> &mdash;",
   "<li><strong>Pet-sitter &rarr; Nouvelle r&eacute;servation</strong> :"],
  ["sc-metier-comportementaliste.html",
   "<li><strong>Registres &rarr; Carnivores DDPP</strong> &mdash;",
   "<li><strong>Registres &rarr; Carnivores DDPP</strong> :"],
  ["sc-metier-comportementaliste.html",
   "<li><strong>Registres &rarr; Sanitaire s&eacute;jour</strong> &mdash;",
   "<li><strong>Registres &rarr; Sanitaire s&eacute;jour</strong> :"],
  ["sc-metier-eleveur.html",
   "<li><strong>Registres &rarr; Carnivores DDPP</strong> &mdash;",
   "<li><strong>Registres &rarr; Carnivores DDPP</strong> :"],
  ["sc-metier-eleveur.html",
   "<li><strong>Registres &rarr; Sanitaire</strong> &mdash;",
   "<li><strong>Registres &rarr; Sanitaire</strong> :"],
  ["sc-metier-eleveur.html",
   "<li><strong>Registres &rarr; &Eacute;v&eacute;nements</strong> &mdash;",
   "<li><strong>Registres &rarr; &Eacute;v&eacute;nements</strong> :"],
  ["sc-metier-petsitter.html",
   "<li><strong>Pet-sitter &rarr; Registre carnivores DDPP</strong> &mdash;",
   "<li><strong>Pet-sitter &rarr; Registre carnivores DDPP</strong> :"],
  ["sc-metier-toiletteur.html",
   "<li><strong>Formules &rarr; Nouvel abonnement</strong> &mdash;",
   "<li><strong>Formules &rarr; Nouvel abonnement</strong> :"],
  ["sc-metier-toiletteur.html",
   "<li><strong>Achats &rarr; Bon de commande &rarr; Nouveau BC</strong> &mdash;",
   "<li><strong>Achats &rarr; Bon de commande &rarr; Nouveau BC</strong> :"],
  ["sc-trans-compta-fec.html",
   "<li><strong>Comptabilit&eacute; &rarr; Balance</strong> &mdash;",
   "<li><strong>Comptabilit&eacute; &rarr; Balance</strong> :"],
  ["sc-trans-compta-fec.html",
   "<li><strong>Gestion &rarr; D&eacute;claration TVA</strong> &mdash;",
   "<li><strong>Gestion &rarr; D&eacute;claration TVA</strong> :"],
];

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }

const erreurs = [];
const parFichier = {};
for (const [f, avant, apres] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  if (!fs.existsSync(p)) { erreurs.push(`${f} : fichier introuvable`); continue; }
  const src = fs.readFileSync(p, "utf8");
  const n = src.split(avant).length - 1;
  if (n !== 1) erreurs.push(`${f} : ancre trouvee ${n} fois, attendu 1 -> ${avant.slice(0, 70)}`);
  parFichier[f] = (parFichier[f] || 0) + 1;
}

const restants = CORRECTIONS.filter(([, , a]) => /\u2014|\u2013|&mdash;|&ndash;/.test(a));
if (restants.length) {
  console.error(`\n*** ${restants.length} REMPLACEMENT(S) PORTENT ENCORE UN CADRATIN. AUCUNE ECRITURE. ***`);
  restants.forEach(([f, , a]) => console.error(`   ${f} : ${a.slice(0, 90)}`));
  process.exit(1);
}

console.log(`corrections : ${CORRECTIONS.length}`);
console.log(`fichiers    : ${Object.keys(parFichier).length}\n`);
for (const [f, n] of Object.entries(parFichier).sort()) console.log(`   ${String(n).padStart(3)}  ${f}`);

if (erreurs.length) {
  console.error(`\n*** ${erreurs.length} ANCRE(S) EN DEFAUT. AUCUNE ECRITURE. ***`);
  erreurs.forEach((e) => console.error(`   ${e}`));
  process.exit(1);
}
console.log(`\nToutes les ancres sont trouvees exactement une fois. Aucun cadratin dans les remplacements.`);
console.log(`\nA REGARDER AU DIFF : les 3 corrections qui ne sont pas un simple changement de signe`);
console.log(`   adv-eliot-avance.html    x2  parentheses au lieu du point median`);
console.log(`   scenarios-index.html     x1  retire le 'Anim'Gest' ecrit deux fois dans le <title>`);

if (!ECRIRE) { console.log(`\nLECTURE SEULE. Rien n'a ete ecrit. Relancer avec --write.`); process.exit(0); }

const horo = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const vus = new Set();
for (const [f, avant, apres] of CORRECTIONS) {
  const p = path.join(RACINE, f);
  if (!vus.has(f)) { fs.copyFileSync(p, `${p}.bak.${horo}`); vus.add(f); }
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(avant, apres), { encoding: "utf8" });
}
console.log(`\n*** ECRIT. ***  ${CORRECTIONS.length} corrections, ${vus.size} fichiers, sauvegardes .bak.${horo}`);
console.log(`Controle : node scripts/etat-cadratins-structure.mjs`);
console.log(`           node scripts/lint-docs-public.mjs --check`);
console.log(`c3_cadratins_entite doit passer de 248 a 189, et c1_fantome rester a 5.`);
