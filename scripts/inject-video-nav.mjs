/**
 * @module    scripts/inject-video-nav
 * @sentinel  S176_DOCS_NAV_VIDEO_V1
 * @description
 *   Insere le lien "Videos" (-> video/index.html) dans la barre de navigation de
 *   CHAQUE page HTML de la RACINE de AnimGest-docs, juste AVANT la pastille
 *   <span class="nav-badge">. Place le lien en 8e position, apres "RGPD", en
 *   coherence avec NAV_ATTENDUE (voir lint-docs-public.mjs).
 *
 *   IDEMPOTENT : une page qui a deja le lien de nav Videos est laissee telle quelle.
 *   Le lien Videos dans le CORPS (carte de la home) n'est PAS confondu avec le lien
 *   de nav : la detection porte sur `video/index.html">Vid`, soit le libelle direct.
 *
 *   MODE PAR DEFAUT = LECTURE SEULE.  Ecriture : node inject-video-nav.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ECRIRE = argv.includes("--write");
const iR = argv.indexOf("--racine");
const RACINE = iR >= 0 ? argv[iR + 1] : "C:\\AnimGest-docs";

// Le lien de nav, au style des autres entrees (entites HTML).
const LIEN = '  <a href="video/index.html">Vid&eacute;os</a>\n';
// Point d'insertion prioritaire : juste avant la pastille de version.
const RE_BADGE = /([ \t]*)<span class="nav-badge">/;
// Repli : si aucune pastille, juste avant la fin de la barre de navigation.
const RE_NAVFIN = /([ \t]*)<\/nav>/;

if (!fs.existsSync(RACINE)) { console.error(`RACINE INTROUVABLE : ${RACINE}`); process.exit(1); }
const fichiers = fs.readdirSync(RACINE).filter((f) => f.endsWith(".html")).sort();

let aInserer = 0, deja = 0, sansNav = 0;
for (const f of fichiers) {
  const p = path.join(RACINE, f);
  const avant = fs.readFileSync(p, "utf8");

  // Deja le lien de NAV (et pas seulement la carte du corps) ?
  if (/video\/index\.html">Vid/.test(avant)) { deja++; continue; }

  let apres = avant;
  if (RE_BADGE.test(avant)) {
    apres = avant.replace(RE_BADGE, (m, ws) => LIEN + ws + '<span class="nav-badge">');
  } else if (RE_NAVFIN.test(avant)) {
    apres = avant.replace(RE_NAVFIN, (m, ws) => LIEN + ws + "</nav>");
  } else {
    sansNav++; continue; // aucune nav : rien a faire
  }
  if (apres !== avant) { aInserer++; if (ECRIRE) fs.writeFileSync(p, apres, { encoding: "utf8" }); }
}

console.log(`racine : ${RACINE}   pages HTML : ${fichiers.length}\n`);
console.log(`lien Videos a inserer : ${aInserer}`);
console.log(`deja present (laisse tel quel) : ${deja}`);
console.log(`sans barre de nav (ignore) : ${sansNav}`);
console.log(ECRIRE ? `\n*** ECRIT. ***` : `\nLECTURE SEULE. Rien n'a ete ecrit. Relancer avec --write.`);
