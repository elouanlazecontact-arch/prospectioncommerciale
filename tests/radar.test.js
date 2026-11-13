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
const iso0 = d => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);
const ok = (cond, msg) => { results.push({ t: cur, ok: !!cond, msg }); };

async function page(b, file, vp, mocks = {}) {
  const ctx = await b.newContext({ viewport: vp || { width: 1440, height: 900 } });
  await ctx.route('**/*', r => { const u = r.request().url();
    for (const [k, v] of Object.entries(mocks)) if (u.includes(k)) return r.fulfill({ body: JSON.stringify(v), contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } });
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
  async 'Correcteur automatique des notes'(b) {
    const { pg, ctx } = await page(b, 'pc.html');
    await pg.evaluate(() => { const p = blank('tel'); p.ent = { nom: 'X' }; S.P.set(p.id, p); S.view = 'list'; openFiche(p.id, 'ent') });
    await pg.click('#note-in'); await pg.keyboard.type('vu la secretaire mme durand, probleme de reseau. nrp rapl jeudi 14h ');
    const v = await pg.$eval('#note-in', e => e.value);
    ok(v === 'Vu la secrétaire Mme Durand, problème de réseau. nrp rapl jeudi 14h ', 'accents, majuscules et noms corrigés, abréviations gardées : ' + v);
    await pg.fill('#note-in', ''); await pg.keyboard.type('le reseau '); await pg.keyboard.press('Backspace');
    ok(await pg.$eval('#note-in', e => e.value) === 'Le reseau', 'retour arrière = mot d’origine'); await ctx.close();
  },
  async 'Statistiques'(b) {
    const { pg, ctx, errs } = await page(b, 'pc.html');
    const r = await pg.evaluate(() => { const iss = ['Répondeur / NRP', 'Barrage', 'Pas le temps', 'Échange sans suite', 'RDV pris · 12 nov.', 'Pas intéressé'];
      for (let i = 0; i < 60; i++) { const p = blank('tel'); p.ent = { nom: 'S' + i, secteur: i % 2 ? 'Avocats' : 'Garage' }; const d = iso(bizDays(today(), -(i % 10)));
        p.journal = [{ id: rid(), date: d + 'T' + pad(9 + i % 8) + ':10:00', canal: 'tel', issue: iss[i % 6] }]; if (i % 6 === 4) p.rdvPrisLe = Date.now(); S.P.set(p.id, p) }
      const D = statsData('30'); S.view = 'stats'; render(); return { n: D.n, reach: D.reach, rdv: D.rdv, cells: $$('.st-c').length, ins: $$('.st-ins li').length } });
    ok(r.n === 60 && r.reach === 40 && r.rdv === 10, `chiffres justes (${r.n} appels, ${r.reach} décrochés, ${r.rdv} RDV)`);
    ok(r.cells === 45 && r.ins >= 2, 'carte des créneaux et conseils affichés'); ok(!errs.length, 'aucune erreur JS'); await ctx.close();
  },
  async 'Doublons : détection et fusion'(b) {
    const { pg, ctx } = await page(b, 'pc.html');
    const r = await pg.evaluate(() => { const mk = (n, e) => { const p = blank('tel'); p.ent = { nom: n, ...e }; S.P.set(p.id, p); return p };
      mk('Cabinet Durand', { siret: '84768975900011' }); mk('Cabinet Durand SARL', { siret: '84768975900011', tel: '0147223344' });
      mk('Etude Martin', { tel: '0147000001', cp: '75017' }); mk('Etude Martin Notaires', { tel: '0147000001', cp: '75017' });
      mk('Société A', { siren: '111111111', tel: '0147000009' }); mk('Société B', { siren: '222222222', tel: '0147000009' });
      const G = dupGroups2(); ACT.dupopen2(); ACT.dupgo(); return { g: G.length, strong: G.filter(g => g.strong).length, left: S.P.size, tel: [...S.P.values()].find(p => p.ent.siret)?.ent.tel } });
    ok(r.g === 2, `2 groupes trouvés (SIRET identique, même téléphone + nom proche) — standard partagé entre 2 SIREN ignoré (${r.g})`);
    ok(r.strong === 1 && r.left === 5 && r.tel === '0147223344', 'seul le groupe sûr est fusionné par défaut, sans perte d’info'); await ctx.close();
  },
  async 'Recherche multi-sources (INPI + BODACC)'(b) {
    const { pg, ctx, errs } = await page(b, 'pc.html', null, {
      ratios_inpi_bce: { results: [{ date_cloture_exercice: '2024-12-31', chiffre_d_affaires: 1850000, resultat_net: 142000, marge_ebe: 12.4 }, { date_cloture_exercice: '2023-12-31', chiffre_d_affaires: 1520000 }] },
      'bodacc-datadila': { results: [{ dateparution: iso0(-60), familleavis: 'modification', familleavis_lib: 'Modifications diverses', listepersonnes: JSON.stringify({ personne: { capital: { montantCapital: '10000' }, formeJuridique: 'Société par actions simplifiée', administration: 'Président : nomination de Mme Durand' } }) },
        { dateparution: iso0(-200), familleavis: 'collective', familleavis_lib: 'Procédures collectives', jugement: JSON.stringify({ nature: 'Jugement d’ouverture d’une procédure de redressement judiciaire' }) }] } });
    const r = await pg.evaluate(async () => { const p = blank('tel'); p.ent = { nom: 'Test', siren: '833987195', tel: '0147223344', secteur: 'Avocats' }; S.P.set(p.id, p); const before = prio(p).s; await enrichMore(p, true);
      return { ca: p.ent.ca, evol: p.ent.caEvol, cap: p.ent.capital, forme: p.ent.forme, src: p.cpl.src.join(), sig: bodaccSignals(p).length, after: prio(p).s, before } });
    ok(r.ca === '1,9 M€ (2024)' && r.evol.startsWith('+22 %'), 'CA et évolution récupérés des comptes INPI');
    ok(r.cap === '10 k€' && r.forme === 'SAS', 'capital et forme récupérés du BODACC');
    ok(r.src.includes('inpi') && r.src.includes('bodacc'), 'sources affichées'); ok(r.sig >= 2, 'signaux : changement de dirigeant, procédure collective');
    ok(r.after < r.before, 'une procédure collective fait baisser la priorité'); ok(!errs.length, 'aucune erreur JS'); await ctx.close();
  },
  async 'Voisins à 100 m (PC)'(b) {
    const et = (siren, nom, naf, d, tr) => ({ siren, nom_complete: nom, nom_raison_sociale: nom, nature_juridique: '5710', activite_principale: naf, dirigeants: [], siege: { siret: siren + '00011' },
      matching_etablissements: [{ siret: siren + '00011', latitude: String(48.88 + d), longitude: '2.3', adresse: '1 RUE X 75017 PARIS', code_postal: '75017', libelle_commune: 'PARIS', activite_principale: naf, tranche_effectif_salarie: tr, est_siege: true, etat_administratif: 'A' }] });
    const { pg, ctx, errs } = await page(b, 'pc.html', null, { near_point: { total_pages: 1, results: [et('111111111', 'CABINET A', '69.10Z', .0002, '03'), et('222222222', 'BOULANGERIE', '10.71C', .0001, '02'), et('333333333', 'AGENCE IMMO', '68.31Z', .0004, '11'), et('444444444', 'MEDECIN', '86.21Z', .0003, '01'), et('999999999', 'MOI', '62.02A', 0, '03')] } });
    const r = await pg.evaluate(async () => { const p = blank('tel'); p.ent = { nom: 'Moi', siren: '999999999' }; p.geo = { lat: 48.88, lon: 2.3 }; S.P.set(p.id, p); await voisLoad(p);
      return { names: p.vois.list.slice(0, 3).map(v => v.name), n: S.P.size } });
    ok(r.names.length === 3 && !r.names.includes('Moi') && r.names[0] === 'Cabinet A', '3 voisins, cibles en premier, sans la société elle-même : ' + r.names.join(', '));
    ok(r.n === 1, 'aucune fiche créée automatiquement'); ok(!errs.length, 'aucune erreur JS'); await ctx.close();
  },
  async 'Groupes de sociétés'(b) {
    const { pg, ctx, errs } = await page(b, 'pc.html');
    const r = await pg.evaluate(() => { const mk = (nom, siren, e) => { const p = blank('tel'); p.ent = { nom, siren, cp: '75017', ...e }; S.P.set(p.id, p); return p };
      const cac = 'Salustro Reydel : commissaire aux comptes suppléant · Kpmg SA : commissaire aux comptes titulaire';
      const d1 = mk('Dentsu France', '352567986', { adresse: '67 Avenue de Wagram' }), d2 = mk('Dentsu Creative France', '490746344', { adresse: '67 Av de Wagram', holding: cac }),
        a1 = mk('Aegis Finance', '519185185', { adresse: '67 Avenue de Wagram', holding: cac }), x = mk('Boulangerie du coin', '111222333', { adresse: '67 Avenue de Wagram' }),
        s1 = mk('Solvha', '912362142', { adresse: '27 Quai Alphonse le Gallo', cp: '92100', tel: '0141104700', holding: 'Meogroup : président de sas' }),
        s2 = mk('Cost House', '452223688', { adresse: '33 Quai Alphonse le Gallo', cp: '92100', tel: '0141104700', holding: 'Cost House Development : président de sas' }),
        k1 = mk('Cabinet Kpmg Client A', '999000111', { holding: 'Kpmg SA : commissaire aux comptes titulaire', cp: '69001' }), k2 = mk('Autre Client B', '999000222', { holding: 'Kpmg SA : commissaire aux comptes titulaire', cp: '13001' });
      cleanAllContacts(); const g = p => grpOf(p)?.name || '';
      return { d1: g(d1), d2: g(d2), a1: g(a1), x: g(x), s1: g(s1), s2: g(s2), k1: g(k1), cac: d2.ent.cac, hold: d2.ent.holding } });
    ok(r.d1 === 'Groupe Dentsu' && r.d2 === r.d1 && r.a1 === r.d1, 'Dentsu France, Dentsu Creative et Aegis (même adresse, mêmes commissaires) → « Groupe Dentsu »');
    ok(!r.x, 'une société sans lien à la même adresse reste seule');
    ok(r.s1 && r.s1 === r.s2, 'même standard → même groupe (' + r.s1 + ')');
    ok(!r.k1, 'un commissaire aux comptes commun ne crée pas de groupe');
    ok(!r.hold && /Kpmg/.test(r.cac), 'commissaires aux comptes rangés à part (plus dans « société mère »)'); ok(!errs.length, 'aucune erreur JS'); await ctx.close();
  },
  async 'Ce qu’ils font (BODACC)'(b) {
    const { pg, ctx } = await page(b, 'pc.html', null, { 'bodacc-datadila': { results: [{ dateparution: '2024-03-01', familleavis: 'immatriculation', familleavis_lib: 'Immatriculations', listeetablissements: JSON.stringify({ etablissement: { activite: 'Conseil en organisation, recrutement et formation des cadres dirigeants' } }) }] }, ratios_inpi_bce: { results: [] } });
    const r = await pg.evaluate(async () => { const p = blank('tel'); p.ent = { nom: 'T', siren: '123456789' }; S.P.set(p.id, p); await enrichMore(p, true); return p.ent.metier });
    ok(r === 'Conseil en organisation, recrutement et formation des cadres dirigeants', 'activité réelle déclarée récupérée : ' + r); await ctx.close();
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
