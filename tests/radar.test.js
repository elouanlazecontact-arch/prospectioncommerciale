/* Radar — batterie de tests automatiques.
   Lancer depuis la racine du dépôt :  node tests/radar.test.js
   (nécessite Playwright + Chromium ; aucun accès réseau : tout est simulé en local) */
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]); const f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});

const results = []; let cur = '';
const ok = (cond, msg) => { results.push({ t: cur, ok: !!cond, msg }); };

async function page(b, file, vp) {
  const ctx = await b.newContext({ viewport: vp || { width: 1440, height: 900 } });
  await ctx.route('**/*', r => { const u = r.request().url();
    if (u.includes('config.js')) return r.fulfill({ body: 'window.RADAR_CONFIG={}', contentType: 'text/javascript' });
    if (u.startsWith('http://127.0.0.1')) return r.continue(); return r.abort(); });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(`http://127.0.0.1:${server.address().port}/${file}`); await pg.waitForFunction(() => typeof S !== 'undefined' && S.P);
  await pg.waitForTimeout(300); return { pg, ctx, errs };
}

const T = {
  async 'Démarrage PC et mobile sans erreur'(b) {
    for (const f of ['pc.html', 'mobile.html']) { const { pg, ctx, errs } = await page(b, f, f === 'mobile.html' ? { width: 390, height: 844 } : null);
      for (const v of ['today', 'list', 'agenda']) await pg.evaluate(v => { S.view = v; render() }, v);
      ok(!errs.length, `${f} : aucune erreur JS (${errs.join(' | ') || 'ok'})`); await ctx.close(); }
  },
  async 'Issues d’appel : NRP / Pas le temps / Pas intéressé'(b) {
    const { pg, ctx, errs } = await page(b, 'pc.html');
    const r = await pg.evaluate(async () => { window.__cal = 0; window.addToCal = () => { __cal++ };
      const mk = n => { const p = blank('tel'); p.ent = { nom: n, tel: '0147223344' }; S.P.set(p.id, p); return p };
      const out = {}; for (const k of ['nrp', 'temps', 'ko', 'barrage']) { const p = mk('Test ' + k); S.view = 'list'; openFiche(p.id, 'ent');
        await commitNote(p, '', OUT.poste.find(o => o.k === k)); const a = p.actions.filter(x => !x.fait);
        out[k] = { statut: p.statut, n: a.length, heure: a[0]?.heure, retry: a[0]?.retry, untreated: untreated(p) } }
      out.cal = __cal; return out });
    ok(r.nrp.n === 1 && /^\d\d:\d\d$/.test(r.nrp.heure) && r.nrp.retry === 'NRP', 'NRP → 1 rappel avec heure, marqué « speech à faire »');
    ok(r.temps.statut === 'rappel' && r.temps.retry === 'Pas le temps', 'Pas le temps → rappel calé');
    ok(r.barrage.retry, 'Barrage → rappel calé');
    ok(r.ko.statut === 'ko' && r.ko.n === 0, 'Pas intéressé → statut KO, aucune action');
    ok(r.cal === 0, 'Aucune ouverture Outlook pour NRP / barrage / pas le temps / KO');
    ok(!r.nrp.untreated, 'Une fiche appelée sort de « À traiter »');
    ok(!errs.length, 'aucune erreur JS'); await ctx.close();
  },
  async 'Analyse des notes'(b) {
    const { pg, ctx } = await page(b, 'pc.html');
    const r = await pg.evaluate(async () => { const t = async txt => { const p = blank('tel'); p.ent = { nom: 'N' }; S.P.set(p.id, p); openFiche(p.id, 'ent'); await commitNote(p, txt, null); return p };
      const a = await t('dg mr martin, 12 postes, rappeler jeudi 14h'); const b2 = await t('il a pas le temps, en réunion'); const c = await t('pas intéressé, non merci');
      const ra = a.actions.find(x => !x.fait); return { a: [ra?.type, ra?.heure], b: [b2.statut, b2.actions.find(x => !x.fait)?.retry], c: c.statut } });
    ok(r.a[0] === 'Rappel' && r.a[1] === '14:00', '« rappeler jeudi 14h » → Rappel à 14:00');
    ok(r.b[0] === 'rappel' && r.b[1], '« pas le temps » → rappel (pas « pas intéressé »)');
    ok(r.c === 'ko', '« pas intéressé » → KO'); await ctx.close();
  },
  async 'Fiche « à traiter » : saisie manuelle vs automatique'(b) {
    const { pg, ctx } = await page(b, 'pc.html');
    const r = await pg.evaluate(() => { const p = blank('tel'); p.ent = { nom: 'Auto', tel: '0100000000', secteur: 'Avocats' }; S.P.set(p.id, p); const before = untreated(p);
      openFiche(p.id, 'ent'); setField('ent.nom', 'Auto 2'); const afterName = untreated(p); setField('ent.email', 'a@b.fr'); return [before, afterName, untreated(p)] });
    ok(r[0] && r[1] && !r[2], 'Remplissage auto / nom = reste à traiter ; champ saisi à la main = traitée'); await ctx.close();
  },
  async 'Alertes de rappel 30 / 15 / 0 min'(b) {
    const { pg, ctx } = await page(b, 'pc.html');
    const r = await pg.evaluate(() => { const hm = d => { const x = new Date(Date.now() + d * 60e3); return pad(x.getHours()) + ':' + pad(x.getMinutes()) };
      const mk = m => { const p = blank('tel'); p.ent = { nom: 'A' + m }; p.actions = [{ id: rid(), type: 'Rappel', date: iso(new Date(Date.now() + m * 60e3)), heure: hm(m), fait: false }]; S.P.set(p.id, p) };
      mk(29); mk(14); mk(0); mk(120); remScan(); const n1 = $$('#remstack .remc').length; remScan(); return [n1, $$('#remstack .remc').length, $$('#remstack .remc').map(x => x.dataset.st).sort().join()] });
    ok(r[0] === 3 && r[1] === 3, '3 alertes (30, 15, maintenant), pas de doublon au 2e passage');
    ok(r[2] === '0,15,30', 'bons niveaux d’alerte'); await ctx.close();
  },
  async 'Espaces de travail : suppression avec déplacement'(b) {
    const { pg, ctx } = await page(b, 'pc.html');
    const r = await pg.evaluate(() => { S.settings.ws = [{ id: 'main', name: 'Data Links' }, { id: 't', name: 'test' }];
      for (let i = 0; i < 2; i++) { const p = blank('tel'); p.ent = { nom: 'T' + i }; p.ws = 't'; S.P.set(p.id, p) }
      ACT.wsdelok({ dataset: { v: 't', to: 'main' } }); return [wsList().length, [...S.P.values()].filter(p => wsOf(p) === 'main').length] });
    ok(r[0] === 1 && r[1] === 2, 'espace supprimé, fiches déplacées'); await ctx.close();
  },
  async 'Priorité des fiches'(b) {
    const { pg, ctx } = await page(b, 'pc.html');
    const r = await pg.evaluate(() => { const mk = (n, e, c) => { const p = blank('tel'); p.ent = { nom: n, ...e }; p.contacts = c || []; S.P.set(p.id, p); return p };
      const a = mk('Cabinet Avocats', { tel: '0100000000', secteur: 'Avocats', effectif: '6–10' }, [{ id: 'c', nom: 'X', decideur: 'Oui', mobile: '0600000000' }]);
      const g = mk('Garage', { tel: '0100000001', secteur: 'Garage' }); const ph = mk('Pharmacie du centre', { tel: '0100000002' }); const z = mk('Sans num', {});
      return [prio(a).s, prio(g).s, prio(ph).s, prio(z).s, [z, ph, g, a].sort(byPrio).map(p => p.ent.nom).join(',')] });
    ok(r[0] > r[1] && r[1] > r[2] && r[2] >= 0, `scores cohérents (${r.slice(0, 4).join(' / ')})`);
    ok(r[4].startsWith('Cabinet Avocats'), 'tri : la meilleure fiche d’abord'); await ctx.close();
  },
  async 'Mails tout prêts'(b) {
    const { pg, ctx } = await page(b, 'pc.html');
    const r = await pg.evaluate(() => { const vide = blank('tel'); vide.ent = { nom: 'Vide' }; S.P.set(vide.id, vide);
      const plein = blank('tel'); plein.ent = { nom: 'Plein', secteur: 'Notaire', email: 'x@y.fr' }; plein.contacts = [{ id: 'c', civ: 'Mme', nom: 'Durand', email: 'd@y.fr', decideur: 'Oui' }];
      plein.besoins = { sel: ['Cybersécurité'] }; plein.impr = { nb: 2, marques: ['Canon'], finContrat: '2027-06' }; plein.actions = [{ id: 'r', type: 'RDV', date: iso(bizDays(today(), 2)), heure: '10:00', note: 'RDV au cabinet', fait: false }]; S.P.set(plein.id, plein);
      const bad = []; for (const p of [vide, plein]) for (const [k] of MAIL_K) { const m = mailBuild(p, k); if (/undefined|null|NaN|\$\{/.test(m.subject + m.body)) bad.push(p.ent.nom + ':' + k) }
      return { bad, def: mailDefaultK(plein), to: mailBuild(plein, 'doc').to, hello: mailBuild(plein, 'doc').body.split('\n')[0] } });
    ok(!r.bad.length, 'aucun trou (« undefined »…) dans les 6 modèles' + (r.bad.length ? ' : ' + r.bad.join(', ') : ''));
    ok(r.def === 'rdvconf', 'modèle proposé selon la situation (RDV à venir → confirmation)');
    ok(r.to === 'd@y.fr' && r.hello === 'Bonjour Maître Durand,', 'destinataire et formule de politesse');
    await ctx.close();
  },
  async 'Jours fériés'(b) {
    const { pg, ctx } = await page(b, 'pc.html');
    const r = await pg.evaluate(() => [iso(bizDays(new Date(2026, 10, 10), 1)), iso(bizDays(new Date(2026, 11, 24), 1)), workDay('2027-05-01')]);
    ok(r[0] === '2026-11-12' && r[1] === '2026-12-28' && r[2] === '2027-05-03', 'pas de rappel le 11 nov., à Noël ni le 1er mai'); await ctx.close();
  },
  async 'Import Excel/CSV avec fusion des doublons'(b) {
    const { pg, ctx } = await page(b, 'pc.html');
    const r = await pg.evaluate(async () => { const p = blank('tel'); p.ent = { nom: 'Existante', siret: '84768975900011' }; S.P.set(p.id, p);
      const csv = 'Entreprise;SIRET;Téléphone;Ville\nExistante SARL;84768975900011;0147223344;Paris\nNouvelle Société;;0147000001;Levallois\n';
      await fimpFile(new File([csv], 'test.csv', { type: 'text/csv' })); for (let i = 0; i < 40 && !S.fimp?.rows; i++) await new Promise(r => setTimeout(r, 100));
      fimpRun(); for (let i = 0; i < 150 && !(S.fimp?.run?.end); i++) await new Promise(r => setTimeout(r, 100));
      return { n: S.P.size, tel: S.P.get(p.id).ent.tel, nouv: [...S.P.values()].some(x => x.ent?.nom === 'Nouvelle Société') } });
    ok(r.n === 2, `2 fiches au total (doublon fusionné) — trouvé ${r.n}`);
    ok(r.tel === '0147223344', 'le numéro importé complète la fiche existante');
    ok(r.nouv, 'la nouvelle société est créée'); await ctx.close();
  },
  async 'Fluidité (400 fiches)'(b) {
    const { pg, ctx } = await page(b, 'pc.html');
    const r = await pg.evaluate(() => { for (let i = 0; i < 400; i++) { const p = blank('tel'); p.ent = { nom: 'Societe ' + i, tel: '01' + String(47000000 + i).padStart(8, '0') }; p.manual = i % 2; S.P.set(p.id, p) }
      S.view = 'list'; render(); const t = f => { const a = performance.now(); f(); return performance.now() - a };
      const id = [...S.P.keys()][3]; return [t(() => renderList()), t(() => openFiche(id, 'ent'))] });
    ok(r[0] < 150, `liste redessinée en ${Math.round(r[0])} ms`); ok(r[1] < 250, `fiche ouverte en ${Math.round(r[1])} ms`); await ctx.close();
  },
};

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r)); const b = await chromium.launch();
  for (const [name, fn] of Object.entries(T)) { cur = name; try { await fn(b) } catch (e) { ok(false, 'plantage : ' + e.message.split('\n')[0]) } }
  await b.close(); server.close();
  let last = '', bad = 0; for (const x of results) { if (x.t !== last) { console.log('\n■ ' + x.t); last = x.t } console.log(`  ${x.ok ? '✓' : '✗'} ${x.msg}`); if (!x.ok) bad++ }
  console.log(`\n${results.length - bad}/${results.length} vérifications OK`); process.exit(bad ? 1 : 0);
})();
