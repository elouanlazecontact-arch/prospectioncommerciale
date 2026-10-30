
"use strict";
const APP_V=35;
/* ================= Données de référence ================= */
const STATUTS=[
 {k:'nouveau',l:'À qualifier',c:'var(--ink-3)'},{k:'contacte',l:'Contacté',c:'var(--cold)'},{k:'rappel',l:'À rappeler',c:'var(--warm)'},
 {k:'rdv',l:'RDV pris',c:'var(--accent)'},{k:'rdv_fait',l:'RDV effectué',c:'var(--accent-2)'},{k:'devis',l:'Devis envoyé',c:'#7B61C9'},
 {k:'gagne',l:'Signé',c:'var(--ok)'},{k:'perdu',l:'Perdu',c:'var(--bad)'},{k:'ko',l:'Pas intéressé',c:'var(--hot)'}];
const ST=Object.fromEntries(STATUTS.map(s=>[s.k,s]));
const RANK={nouveau:0,contacte:1,rappel:2,rdv:3,rdv_fait:4,devis:5,gagne:6,perdu:6,ko:2};
const TEMPS=[{k:'froid',l:'Froid'},{k:'tiede',l:'Tiède'},{k:'chaud',l:'Chaud'}];
const ATYPES=['Appel','Rappel','Mail','Visite','RDV','Devis','Relance'];
const SECTEURS=['Notaire / juridique','Avocat','Expert-comptable','Médical / paramédical','Conseil / RH / recrutement','Architecte','Agence immobilière','Assurance','BTP / artisan','Commerce','Industrie','Transport / logistique','Association','Restauration / hôtellerie'];
const BESOINS=['Parc informatique','Réseau / Wi-Fi','Cybersécurité','Sauvegarde / PRA','Téléphonie / standard','Mobiles / opérateur','Internet / fibre','Impression / copieurs','Gestion documentaire','Infogérance / support','Microsoft 365 / cloud','Serveur','IA / automatisation'];
const SATIS=['Satisfait','Moyen','Insatisfait'];
const FONCTIONS=['Dirigeant / gérant','DG','DAF','DSI / resp. IT','Office manager','Assistante / accueil','Resp. RH','Resp. opérations','Associé'];

const TABS=[
 {id:'ent',l:'Entreprise',fields:[
  {k:'ent.nom',l:'Raison sociale',t:'text',w:2,sec:'Identité'},
  {k:'ent.enseigne',l:'Enseigne / nom commercial',t:'text'},
  {k:'ent.secteur',l:'Secteur',t:'single',o:SECTEURS,w:2},
  {k:'ent.siret',l:'SIRET',t:'mono',ph:'14 chiffres'},
  {k:'ent.siren',l:'SIREN',t:'mono',ph:'9 chiffres'},
  {k:'ent.forme',l:'Forme juridique',t:'single',o:['SAS','SASU','SARL','EURL','SA','SCP','SELARL','SCI','EI','Association'],w:2},
  {k:'ent.naf',l:'Code NAF',t:'mono',ph:'69.10Z'},
  {k:'ent.creation',l:'Date de création',t:'text',ph:'2014'},
  {k:'ent.activite',l:'Activité',t:'text',w:2},
  {k:'ent.effectif',l:'Effectif du site',t:'single',o:['1–5','6–10','11–19','20–49','50–99','100–249','250 +'],w:2},
  {k:'ent.adresse',l:'Adresse',t:'text',w:2,sec:'Coordonnées'},
  {k:'ent.cp',l:'Code postal',t:'mono'},
  {k:'ent.ville',l:'Ville',t:'text'},
  {k:'ent.tel',l:'Standard',t:'tel'},
  {k:'ent.email',l:'Email générique',t:'email'},
  {k:'ent.site',l:'Site web',t:'text'},
  {k:'ent.sites',l:'Plusieurs sites',t:'single',o:['Non','Oui']},
  {k:'ent.groupe',l:'Décision au siège / réseau',t:'single',o:['Non','Oui'],w:2},
  {k:'ent.notes',l:'Notes entreprise (infos qui ne rentrent dans aucune case)',t:'area',w:2,sec:'Notes'},
  {k:'ent.categorie',l:'Catégorie',t:'single',o:['Micro-entreprise','PME','ETI','Grande entreprise'],w:2,reg:true,sec:'Registre officiel'},
  {k:'ent.etab',l:'Cet établissement',t:'single',o:['Siège','Établissement secondaire'],reg:true},
  {k:'ent.tva',l:'TVA intracommunautaire',t:'mono',reg:true},
  {k:'ent.installe',l:'Installé à cette adresse',t:'text',reg:true},
  {k:'ent.ca',l:'Chiffre d’affaires',t:'text',reg:true},
  {k:'ent.resultat',l:'Résultat net',t:'text',reg:true},
  {k:'ent.convention',l:'Convention collective',t:'text',w:2,reg:true},
  {k:'ent.holding',l:'Dirigeants personnes morales (holding)',t:'text',w:2,reg:true},
 ]},
 {id:'contacts',l:'Contacts',custom:true},
 {id:'besoins',l:'Besoins',fields:[
  {k:'besoins.sel',l:'Besoins identifiés',t:'multi',o:BESOINS,w:2},
  {k:'besoins.declencheur',l:'Déclencheurs',t:'multi',o:['Fin de contrat','Insatisfaction prestataire','Déménagement','Croissance / recrutement','Panne / incident','Cyberattaque','Réduire les coûts','Modernisation'],w:2},
  {k:'besoins.priorite',l:'Échéance du projet',t:'single',o:['Urgent','< 3 mois','3–6 mois','6–12 mois','Pas de projet'],w:2},
  {k:'besoins.decision',l:'Qui décide',t:'single',o:['Dirigeant seul','Avec les associés','Siège / groupe','Avec le comptable'],w:2},
  {k:'besoins.budget',l:'Budget évoqué',t:'text'},
  {k:'besoins.concurrents',l:'Concurrents en place / consultés',t:'multi',o:[],w:2},
  {k:'besoins.notes',l:'Détail des besoins',t:'area',w:2},
 ]},
 {id:'cyber',l:'Cyber',fields:[
  {k:'cyber.aPresta',l:'Prestataire cybersécurité',t:'presta',tk:'cyber.prestataire',w:2},
  {k:'cyber.prestataire',l:'Nom du prestataire',t:'text',hidden:true},
  {k:'cyber.antivirus',l:'Antivirus / EDR',t:'multi',o:['Aucun','Windows Defender','Bitdefender','ESET','Kaspersky','Sophos','SentinelOne','WithSecure','Avast / AVG','Ne sait pas'],w:2},
  {k:'cyber.firewall',l:'Pare-feu',t:'single',o:['Aucun (box opérateur)','Fortinet','Stormshield','Sophos','WatchGuard','Cisco Meraki','Ne sait pas'],w:2},
  {k:'cyber.sauvegarde',l:'Sauvegarde',t:'multi',o:['Aucune','Disque externe','NAS','Cloud','Externalisée (prestataire)','Ne sait pas'],w:2},
  {k:'cyber.mfa',l:'Double authentification',t:'single',o:['Oui','Partielle','Non','Ne sait pas']},
  {k:'cyber.sensibilisation',l:'Sensibilisation équipe',t:'single',o:['Oui','Non']},
  {k:'cyber.mails',l:'Messagerie',t:'single',o:['Microsoft 365','Google Workspace','OVH','Orange','Gandi'],w:2},
  {k:'cyber.incident',l:'Incident déjà subi',t:'multi',o:['Jamais','Phishing','Rançongiciel','Messagerie piratée','Vol / perte de matériel'],w:2},
  {k:'cyber.rgpd',l:'RGPD',t:'single',o:['Conforme','En cours','Non','Ne sait pas']},
  {k:'cyber.niveau',l:'Niveau ressenti',t:'single',o:['Faible','Moyen','Bon']},
  {k:'cyber.notes',l:'Notes cyber',t:'area',w:2},
 ]},
 {id:'impr',l:'Impression',fields:[
  {k:'impr.nb',l:'Copieurs',t:'num'},
  {k:'impr.nbImprimantes',l:'Imprimantes',t:'num'},
  {k:'impr.marques',l:'Marques',t:'multi',o:['Canon','Ricoh','Konica Minolta','Sharp','Xerox','Kyocera','Toshiba','HP','Brother','Epson','Lexmark'],w:2},
  {k:'impr.mode',l:'Financement',t:'single',o:['Achat','Location / leasing','Coût copie seul','Ne sait pas'],w:2},
  {k:'impr.loueur',l:'Loueur',t:'single',o:['Grenke','Leasecom','BNP Paribas Leasing','Locam','Franfinance'],w:2},
  {k:'impr.finContrat',l:'Fin de contrat',t:'month'},
  {k:'impr.aPresta',l:'Fournisseur / prestataire copieurs',t:'presta',tk:'impr.prestataire',w:2},
  {k:'impr.prestataire',l:'Nom du fournisseur',t:'text',hidden:true},
  {k:'impr.volNB',l:'Volume N&B / mois',t:'num'},
  {k:'impr.volCoul',l:'Volume couleur / mois',t:'num'},
  {k:'impr.satisfaction',l:'Satisfaction',t:'single',o:SATIS,w:2},
  {k:'impr.irritants',l:'Irritants',t:'multi',o:['Pannes','Délais d’intervention','Coût','Toner','Scan compliqué','Commercial absent'],w:2},
  {k:'impr.ged',l:'Gestion documentaire',t:'multi',o:['Aucune','Scan vers dossier','GED en place','Signature électronique','Archivage papier'],w:2},
  {k:'impr.notes',l:'Notes impression',t:'area',w:2},
 ]},
 {id:'it',l:'Informatique',fields:[
  {k:'it.postes',l:'Postes',t:'num'},
  {k:'it.utilisateurs',l:'Utilisateurs',t:'num'},
  {k:'it.aPresta',l:'Prestataire informatique',t:'presta',tk:'it.prestataire',w:2},
  {k:'it.prestataire',l:'Nom du prestataire',t:'text',hidden:true},
  {k:'it.contrat',l:'Type de support',t:'single',o:['Infogérance','À la demande','Interne','Personne','Ne sait pas'],w:2},
  {k:'it.satisfaction',l:'Satisfaction',t:'single',o:SATIS,w:2},
  {k:'it.age',l:'Âge du parc',t:'single',o:['< 3 ans','3–5 ans','> 5 ans','Mixte']},
  {k:'it.serveur',l:'Serveur',t:'multi',o:['Aucun','Serveur local','NAS','Cloud (Azure / AWS)','Ne sait pas'],w:2},
  {k:'it.cloud',l:'Outils cloud',t:'multi',o:['Microsoft 365','Google Workspace','SharePoint / OneDrive','Dropbox','Logiciel métier SaaS'],w:2},
  {k:'it.reseau',l:'Réseau',t:'multi',o:['Wi-Fi lent','Wi-Fi invités','Câblage à revoir','Baie / switch','VPN télétravail'],w:2},
  {k:'it.logiciels',l:'Logiciels métier',t:'text',w:2,ph:'Genapi, iNot, Doctolib, Sage…'},
  {k:'it.notes',l:'Notes informatique',t:'area',w:2},
 ]},
 {id:'tel',l:'Télécom',fields:[
  {k:'tel.operateur',l:'Opérateur(s)',t:'multi',o:['Orange','SFR','Bouygues','Free Pro','OVH'],w:2},
  {k:'tel.aPresta',l:'Prestataire / revendeur télécom',t:'presta',tk:'tel.prestataire',w:2},
  {k:'tel.prestataire',l:'Nom du prestataire',t:'text',hidden:true},
  {k:'tel.lignesFixes',l:'Lignes fixes',t:'num'},
  {k:'tel.lignesMobiles',l:'Lignes mobiles',t:'num'},
  {k:'tel.standard',l:'Standard',t:'single',o:['Aucun','Standard physique (PABX)','Standard cloud (IPBX)','Teams Phone','Ne sait pas'],w:2},
  {k:'tel.internet',l:'Accès internet',t:'multi',o:['Fibre','ADSL / VDSL','Box 4G / 5G','Lien dédié','Ne sait pas'],w:2},
  {k:'tel.finEngagement',l:'Fin d’engagement',t:'month'},
  {k:'tel.facture',l:'Facture mensuelle',t:'text',ph:'≈ 450 €'},
  {k:'tel.satisfaction',l:'Satisfaction',t:'single',o:SATIS,w:2},
  {k:'tel.notes',l:'Notes télécom',t:'area',w:2},
 ]},
 {id:'suivi',l:'Suivi',custom:true},
 {id:'cr',l:'Compte rendu',custom:true},
];
const CFIELDS=[
 {k:'civ',l:'Civilité',t:'single',o:['M.','Mme']},
 {k:'decideur',l:'Décideur',t:'single',o:['Oui','Non','Influenceur']},
 {k:'prenom',l:'Prénom',t:'text'},{k:'nom',l:'Nom',t:'text'},
 {k:'fonction',l:'Fonction',t:'single',o:FONCTIONS,w:2},
 {k:'tel',l:'Ligne directe',t:'tel'},{k:'mobile',l:'Mobile',t:'tel'},
 {k:'email',l:'Email',t:'email',w:2},{k:'linkedin',l:'LinkedIn',t:'text',w:2},
 {k:'note',l:'Note',t:'text',w:2},
];
const FIELD={};TABS.forEach(t=>(t.fields||[]).forEach(f=>FIELD[f.k]=f));
const CFIELD=Object.fromEntries(CFIELDS.map(f=>[f.k,f]));
const EXCL=/^(aucun|aucune|jamais|ne sait pas)/i;

const OUT={
 poste:[
  {k:'nrp',l:'Répondeur / NRP',key:'1',statut:'contacte',a:{type:'Rappel',in:1}},
  {k:'barrage',l:'Barrage',key:'2',statut:'rappel',a:{type:'Rappel',in:2}},
  {k:'rappel',l:'Rappel demandé',key:'3',statut:'rappel',a:{type:'Rappel',in:1},ask:true},
  {k:'doc',l:'Doc à envoyer',key:'4',statut:'contacte',a:{type:'Mail',in:0}},
  {k:'rdv',l:'RDV pris',key:'5',statut:'rdv',temp:'chaud',a:{type:'RDV',in:2},ask:true,cls:'rdv'},
  {k:'ko',l:'Pas intéressé',key:'6',statut:'ko',temp:'froid',cls:'ko'},
  {k:'faux',l:'Faux numéro',key:'7'},
  {k:'parle',l:'Échange sans suite',key:'8',statut:'contacte',a:{type:'Relance',in:14}},
 ],
 terrain:[
  {k:'accueil',l:'Vu l’accueil',statut:'contacte',a:{type:'Rappel',in:1}},
  {k:'carte',l:'Carte laissée',statut:'contacte',a:{type:'Rappel',in:2}},
  {k:'decideur',l:'Décideur rencontré',statut:'rappel',temp:'tiede',a:{type:'Rappel',in:2}},
  {k:'repasser',l:'Repasser',statut:'contacte',a:{type:'Visite',in:7},ask:true},
  {k:'rdv',l:'RDV pris',statut:'rdv',temp:'chaud',a:{type:'RDV',in:2},ask:true,cls:'rdv'},
  {k:'ko',l:'Pas intéressé',statut:'ko',temp:'froid',cls:'ko'},
  {k:'ferme',l:'Fermé / absent',a:{type:'Visite',in:7}},
  {k:'exclu',l:'Hors cible',statut:'perdu'},
 ]};

/* ================= Utilitaires ================= */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fromIso=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const bizDays=(d,n)=>{let x=new Date(d);let k=0;while(k<n){x=addDays(x,1);if(x.getDay()%6)k++;}if(n===0)while(!(x.getDay()%6))x=addDays(x,1);return x};
const rid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[’`]/g,"'");
const getP=(o,p)=>p.split('.').reduce((a,k)=>a==null?undefined:a[k],o);
function setP(o,p,v){const ks=p.split('.');let a=o;for(let i=0;i<ks.length-1;i++){if(a[ks[i]]==null||typeof a[ks[i]]!=='object')a[ks[i]]={};a=a[ks[i]];}a[ks.at(-1)]=v}
const filled=v=>Array.isArray(v)?v.length>0:(v!==undefined&&v!==null&&String(v).trim()!=='');
const JOURS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
const MOIS=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const fmtDate=s=>{if(!s)return'';const d=fromIso(s);const t=today();const diff=Math.round((d-t)/864e5);
  if(diff===0)return"Aujourd'hui";if(diff===1)return'Demain';if(diff===-1)return'Hier';
  return `${JOURS[d.getDay()].slice(0,3)}. ${d.getDate()} ${MOIS[d.getMonth()]}`};
const fmtMonth=s=>{if(!s)return'';const [y,m]=s.split('-');return `${MOIS[+m-1]} ${y}`};
const fmtSiret=s=>{const d=String(s||'').replace(/\D/g,'');return d.length===14?`${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,9)} ${d.slice(9)}`:d.length===9?`${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6)}`:s};
const fmtTel=s=>{const d=String(s||'').replace(/\D/g,'').replace(/^33/,'0');return d.length===10?d.replace(/(\d{2})(?=\d)/g,'$1 '):s};
function luhn(s){const d=String(s).replace(/\D/g,'');if(!d.length)return false;let sum=0;for(let i=0;i<d.length;i++){let n=+d[d.length-1-i];if(i%2){n*=2;if(n>9)n-=9}sum+=n}return sum%10===0}
const lsGet=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch{return d}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
queueMicrotask(()=>{S.briefOpen=lsGet('radar-brief','1')!=='0'});

/* ================= État ================= */
const S={P:new Map(),sel:null,view:'today',mode:'poste',modeForced:false,tab:'ent',q:'',filter:'all',store:'loading',
  settings:{objectif:20},queue:new Set(),selMode:false,picked:new Set(),confirmBulk:false,sample:null,aiImages:false,aiBusy:false,aiMsg:'',ask:null,session:null,call:null,sheet:false,flash:new Set(),undo:null,confirmDel:false,downloads:null};
const dirty=new Map(),timers={},chains={};

function blank(src){return{id:'p_'+rid(),createdAt:Date.now(),updatedAt:Date.now(),statut:'nouveau',temperature:'',source:src,ent:{},contacts:[],besoins:{},cyber:{},impr:{},it:{},tel:{},actions:[],journal:[]}}
const cur=()=>S.P.get(S.sel);

/* ================= Stockage : local + synchro Supabase ================= */
const CFG=window.RADAR_CONFIG||{};let SB=null,USER=null,RT=null;
const LK=()=>'radar-'+(USER?.id||'local');
function loadLocal(){S.P.clear();for(const p of lsGet(LK()+'-data',[]))if(p&&p.id)S.P.set(p.id,p);
  S.settings={objectif:20,...lsGet(LK()+'-settings',{})};if(S.settings.cal==='live'&&proMail())S.settings.cal='m365';S.queue=new Set(lsGet(LK()+'-queue',[]))}
/* ---------- Rôles : admin = accès aux fiches de toute l'équipe ---------- */
const isAdmin=()=>S.role==='admin'||S.role==='owner';
const ownerOf=p=>p?._owner||USER?.id;
function vis(p){if(!isAdmin()||S.who==='all')return true;if(!S.who||S.who==='me')return !p._owner||p._owner===USER?.id;return p._owner===S.who}
const VP=()=>[...S.P.values()].filter(vis);
const memberName=id=>{if(!id||id===USER?.id)return'Moi';const m=(S.team||[]).find(x=>x.id===id);return m?(m.nom||m.email.split('@')[0]):'Collègue'};
async function loadRole(){if(!SB||!USER)return;
  try{await SB.from('profiles').upsert({id:USER.id,email:USER.email,updated_at:new Date().toISOString()},{onConflict:'id'})}catch{}
  let role='';try{const {data,error}=await SB.from('admins').select('role').eq('user_id',USER.id).maybeSingle();if(!error&&data)role=data.role}catch{}
  const was=S.role;S.role=role;lsSet(LK()+'-role',role);
  if(isAdmin()){try{const {data}=await SB.from('profiles').select('id,email,nom').order('email');S.team=data||[]}catch{S.team=[]}
    try{const {data}=await SB.from('admins').select('user_id,role');S.admins=data||[]}catch{S.admins=[]}
    if(!lsGet(LK()+'-full',false)){lsSet(LK()+'-since',null);await pullAll();lsSet(LK()+'-full',true)}
    if(!was)subscribe()}
  else if(was&&!role){S.who='me'}
  render()}
function saveLocal(){lsSet(LK()+'-data',[...S.P.values()]);lsSet(LK()+'-queue',[...S.queue])}
let saveT=null;const saveLocalSoon=()=>{clearTimeout(saveT);saveT=setTimeout(saveLocal,200)};
function markDirty(id){S.queue.add(id);saveLocalSoon();clearTimeout(timers.push);timers.push=setTimeout(pushQueue,800);renderStore()}
function touch(p){p.updatedAt=Date.now();markDirty(p.id)}
function removeProspect(id){const p=S.P.get(id);if(p?._owner){S.delOwner=S.delOwner||{};S.delOwner[id]=p._owner}S.P.delete(id);markDirty(id)}
/* ---------- Doublons de SIRET / SIREN ---------- */
const sirOf=p=>({siret:/^\d{14}$/.test(p.ent?.siret||'')?p.ent.siret:'',siren:p.ent?.siren||(p.ent?.siret||'').slice(0,9)||p.rne?.siren||''});
function dupOf(num,exceptId){num=String(num||'').replace(/\D/g,'');if(num.length!==9&&num.length!==14)return null;
  for(const p of S.P.values()){if(p.id===exceptId)continue;const o=sirOf(p);
    if(num.length===14){if(o.siret===num||(!o.siret&&o.siren===num.slice(0,9)))return p}
    else if(o.siren===num)return p}
  return null}
function dupGroups(){const m=new Map();
  for(const p of VP()){const o=sirOf(p);const k=o.siret||(o.siren?'n'+o.siren:'');if(!k)continue;if(!m.has(k))m.set(k,[]);m.get(k).push(p)}
  // un SIREN seul rejoint le SIRET du même SIREN s'il n'y en a qu'un
  for(const [k,ps] of [...m]){if(k[0]!=='n')continue;const siren=k.slice(1);const sk=[...m.keys()].filter(x=>x[0]!=='n'&&x.startsWith(siren));if(sk.length===1){m.get(sk[0]).push(...ps);m.delete(k)}}
  return[...m.values()].filter(g=>g.length>1)}
const richness=p=>(p.journal?.length||0)*3+(p.actions?.length||0)*3+(p.contacts?.length||0)*2+qualif(p)/10+(p.statut!=='nouveau'?5:0);
function mergeInto(k,o){
  for(const sec of ['ent','besoins','cyber','impr','it','tel']){k[sec]=k[sec]||{};for(const [f,v] of Object.entries(o[sec]||{})){const cur=k[sec][f];if(cur==null||cur===''||(Array.isArray(cur)&&!cur.length))k[sec][f]=structuredClone(v);else if(Array.isArray(cur)&&Array.isArray(v))k[sec][f]=[...new Set([...cur,...v])]}}
  const key=c=>norm([c.prenom,c.nom,c.tel,c.mobile,c.email].filter(Boolean).join(' '));const have=new Set((k.contacts||[]).map(key));
  for(const c of o.contacts||[])if(!have.has(key(c))){k.contacts.push(structuredClone(c));have.add(key(c))}
  const ids=new Set((k.actions||[]).map(a=>a.id));for(const a of o.actions||[])if(!ids.has(a.id))k.actions.push(structuredClone(a));
  const jids=new Set((k.journal||[]).map(j=>j.id));for(const j of o.journal||[])if(!jids.has(j.id))k.journal.push(structuredClone(j));
  if(!k.temperature&&o.temperature)k.temperature=o.temperature;if(k.statut==='nouveau'&&o.statut!=='nouveau')k.statut=o.statut;
  if(!k.geo&&o.geo)k.geo=o.geo;k.createdAt=Math.min(k.createdAt||Infinity,o.createdAt||Infinity)}
function mergeDups(){const gs=dupGroups();if(!gs.length)return toast('Aucun doublon de SIRET');const backup=[];let n=0;
  for(const g of gs){g.sort((a,b)=>richness(b)-richness(a)||(a.createdAt||0)-(b.createdAt||0));const k=g[0];backup.push(structuredClone(k));
    for(const o of g.slice(1)){backup.push(o);mergeInto(k,o);removeProspect(o.id);if(S.sel===o.id)S.sel=k.id;n++}touch(k)}
  render();toast(`${n} doublon${n>1?'s':''} fusionné${n>1?'s':''} (aucune info perdue)`,()=>{for(const p of backup){S.P.set(p.id,p);touch(p)}render()})}
function saveSettings(){lsSet(LK()+'-settings',S.settings);if(SB&&USER){S.settingsDirty=true;markDirty('settings-'+USER.id)}}
async function pushQueue(){
  if(!SB||!USER||!navigator.onLine||S.pushing){renderStore();return}
  const ids=[...S.queue];if(!ids.length){renderStore();return}
  S.pushing=true;renderStore();
  try{
    const now=new Date().toISOString();
    const rows=ids.map(id=>{
      if(id==='settings-'+USER.id)return{id,owner:USER.id,data:{settings:S.settings},updated_at:now,deleted:false};
      const p=S.P.get(id);
      return p?{id,owner:ownerOf(p),data:p,updated_at:new Date(Math.max(p.updatedAt||0,Date.now()-1000)).toISOString(),deleted:false}
              :{id,owner:S.delOwner?.[id]||USER.id,data:{id},updated_at:now,deleted:true}});
    for(let i=0;i<rows.length;i+=100){const {error}=await SB.from('prospects').upsert(rows.slice(i,i+100),{onConflict:'id'});if(error)throw error}
    ids.forEach(id=>S.queue.delete(id));S.syncErr='';S.lastSync=Date.now();saveLocal();
  }catch(e){S.syncErr=e?.message||String(e)}
  finally{S.pushing=false;renderStore();if(S.queue.size){clearTimeout(timers.push);timers.push=setTimeout(pushQueue,S.syncErr?20000:1500)}}}
function mergeRemote(r){
  if(!r||!r.id)return false;
  if(r.id==='settings-'+USER?.id){if(!S.queue.has(r.id)&&r.data?.settings){S.settings={...S.settings,...r.data.settings};lsSet(LK()+'-settings',S.settings)}return false}
  if(r.id.startsWith('settings-'))return false;
  if(S.queue.has(r.id))return false;
  if(r.deleted){const had=S.P.has(r.id);S.P.delete(r.id);return had}
  const loc=S.P.get(r.id);if(loc&&(loc.updatedAt||0)>(r.data?.updatedAt||0))return false;
  S.P.set(r.id,r.owner&&r.owner!==USER?.id?{...r.data,_owner:r.owner}:r.data);return true}
async function pullAll(){
  if(!SB||!USER||!navigator.onLine)return;
  try{const since=lsGet(LK()+'-since',null);let last=since,from=0,selChanged=false,any=false;
    for(let n=0;n<50;n++){let q=SB.from('prospects').select('id,owner,data,updated_at,deleted').order('updated_at',{ascending:true}).range(from,from+999);if(since)q=q.gt('updated_at',since);
      const {data,error}=await q;if(error)throw error;
      for(const r of data){if(mergeRemote(r)){any=true;if(r.id===S.sel)selChanged=true}last=r.updated_at}
      if(data.length<1000)break;from+=1000}
    if(last)lsSet(LK()+'-since',last);saveLocal();S.syncErr='';if(any||S.view==='today')renderSoft(selChanged);renderStore()}
  catch(e){S.syncErr=e?.message||String(e);renderStore()}}
function subscribe(){
  if(!SB||!USER)return;if(RT){SB.removeChannel(RT);RT=null}
  RT=SB.channel('radar-'+USER.id).on('postgres_changes',{event:'*',schema:'public',table:'prospects',...(isAdmin()?{}:{filter:'owner=eq.'+USER.id})},pl=>{
    const r=pl.new;if(r&&mergeRemote(r)){saveLocalSoon();renderSoft(r.id===S.sel)}}).subscribe()}
function renderStore(){const el=$('#store');if(!el)return;let s,t,tip='';
  if(!SB){s='local';t='Sur cet appareil';tip='Synchronisation non configurée : voir le guide d’installation.'}
  else if(!USER){s='loading';t='Non connecté'}
  else if(!navigator.onLine){s='local';t=S.queue.size?`Hors ligne · ${S.queue.size} en attente`:'Hors ligne';tip='Tout est gardé sur l’appareil et part dès le retour du réseau.'}
  else if(S.pushing){s='loading';t='Synchronisation…'}
  else if(S.syncErr){s='local';t='Synchro en échec';tip=S.syncErr}
  else if(S.queue.size){s='loading';t=`${S.queue.size} en attente`}
  else{s='cloud';t='Synchronisé';tip='PC et téléphone partagent les mêmes fiches.'}
  el.dataset.s=s;el.querySelector('span').textContent=t;el.title=tip}
/* ---------- Compte ---------- */
async function initStore(){
  if(CFG.supabaseUrl&&CFG.supabaseAnonKey&&window.supabase){
    try{SB=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,storageKey:'radar-auth'}});
      const {data}=await SB.auth.getSession();USER=data?.session?.user||null;
      SB.auth.onAuthStateChange((ev,sess)=>{const u=sess?.user||null;if((u?.id||null)!==(USER?.id||null)){USER=u;onUser()}})}
    catch(e){SB=null}}
  onUser()}
function onUser(){
  if(SB&&!USER){showAuth();return}
  hideAuth();loadLocal();
  if(SB&&USER){const loc=lsGet('radar-local-data',[]);if(loc.length){for(const p of loc)if(!S.P.has(p.id)){S.P.set(p.id,p);S.queue.add(p.id)}lsSet('radar-local-data',[])}}
  S.role=lsGet(LK()+'-role','');S.who=lsGet(LK()+'-who','me');
  render();renderStore();if(SB&&USER){pullAll().then(pushQueue);subscribe();loadRole()}}
function showAuth(m){const el=$('#auth');el.hidden=false;S.authMode=S.authMode||'login';
  el.innerHTML=`<div class="auth-card"><div class="brand" style="font-size:24px">${$('.brand svg').outerHTML}Radar <small>Data Links</small></div>
   <h1>${S.authMode==='signup'?'Créer ton compte':S.authMode==='reset'?'Mot de passe oublié':'Connexion'}</h1>
   <p>${S.authMode==='signup'?'Un compte par commercial : tes fiches restent privées et suivent sur ton PC et ton téléphone.':S.authMode==='reset'?'Tu vas recevoir un lien pour choisir un nouveau mot de passe.':'Les mêmes identifiants sur l’appli PC et l’appli téléphone.'}</p>
   <form id="auth-form" autocomplete="on">
    <div class="f"><label for="au-mail">Email professionnel</label><input class="in" id="au-mail" type="email" autocomplete="username" required value="${esc(lsGet('radar-last-email',''))}"></div>
    ${S.authMode!=='reset'?`<div class="f"><label for="au-pass">Mot de passe</label><input class="in" id="au-pass" type="password" autocomplete="${S.authMode==='signup'?'new-password':'current-password'}" minlength="6" required></div>`:''}
    <button class="btn btn-p" type="submit" style="width:100%;height:44px">${S.authMode==='signup'?'Créer mon compte':S.authMode==='reset'?'Envoyer le lien':'Se connecter'}</button>
   </form>
   <div class="ai" id="au-msg" ${m?'':'hidden'}>${esc(m||'')}</div>
   <div class="auth-links">${S.authMode!=='login'?'<button class="btn btn-q" data-act="authmode" data-v="login">J’ai déjà un compte</button>':'<button class="btn btn-q" data-act="authmode" data-v="signup">Créer un compte</button><button class="btn btn-q" data-act="authmode" data-v="reset">Mot de passe oublié</button>'}</div></div>`;
  $('#auth-form').addEventListener('submit',authSubmit);setTimeout(()=>($('#au-mail').value?$('#au-pass'):$('#au-mail'))?.focus(),30)}
function hideAuth(){const el=$('#auth');if(el){el.hidden=true;el.innerHTML=''}}
async function authSubmit(e){e.preventDefault();const mail=$('#au-mail').value.trim(),pass=$('#au-pass')?.value||'';lsSet('radar-last-email',mail);
  const msg=t=>{const m=$('#au-msg');m.hidden=false;m.textContent=t};const btn=e.target.querySelector('button');btn.disabled=true;msg('Un instant…');
  try{
    if(S.authMode==='signup'){const {data,error}=await SB.auth.signUp({email:mail,password:pass});if(error)throw error;
      if(!data.session){S.authMode='login';showAuth('Compte créé. Ouvre le mail de confirmation, puis connecte-toi ici.');return}}
    else if(S.authMode==='reset'){const {error}=await SB.auth.resetPasswordForEmail(mail,{redirectTo:location.href.split('#')[0]});if(error)throw error;msg('Lien envoyé. Regarde ta boîte mail (et les spams).');btn.disabled=false;return}
    else{const {error}=await SB.auth.signInWithPassword({email:mail,password:pass});if(error)throw error}
  }catch(err){btn.disabled=false;const t=String(err?.message||err);
    msg(/invalid login/i.test(t)?'Email ou mot de passe incorrect.':/not confirmed/i.test(t)?'Confirme d’abord ton email (lien reçu par mail).':/already registered|already exists/i.test(t)?'Ce compte existe déjà : connecte-toi.':/password/i.test(t)?'Mot de passe trop court : 6 caractères minimum.':/fetch|network/i.test(t)?'Pas de connexion internet.':t)}}
async function logout(){if(!SB)return;await pushQueue();if(RT){SB.removeChannel(RT);RT=null}await SB.auth.signOut();USER=null;S.P.clear();S.sel=null;S.menu=false;renderLayer();onUser()}

/* ================= Calculs ================= */
function nextAction(p){return (p.actions||[]).filter(a=>!a.fait).sort((a,b)=>(a.date||'9')+(a.heure||'')<(b.date||'9')+(b.heure||'')?-1:1)[0]}
function dueClass(a){if(!a||!a.date)return'';const t=iso(today());return a.date<t?'late':a.date===t?'is-today':''}
function qualif(p){let tot=0,ok=0;
  for(const t of TABS)for(const f of (t.fields||[])){if(f.t==='area'||f.reg||f.hidden||f.k==='ent.enseigne'||f.k==='ent.creation'||f.k==='ent.naf')continue;if(p.est?.[f.k]){tot++;continue}tot++;if(filled(getP(p,f.k)))ok++}
  tot+=3;if(p.contacts?.length)ok++;if(p.contacts?.some(c=>c.decideur==='Oui'))ok++;if(p.contacts?.some(c=>c.tel||c.mobile||c.email))ok++;
  return Math.round(ok/tot*100)}
function tabCount(p,t){if(t.id==='cr')return['✓',null];if(t.id==='contacts')return[p.contacts?.length||0,null];if(t.id==='suivi')return[(p.actions||[]).filter(a=>!a.fait).length,null];
  const fs=t.fields.filter(f=>f.t!=='area'&&!f.reg&&!f.hidden);return[fs.filter(f=>filled(getP(p,f.k))).length,fs.length]}
function displayName(p){return p.ent?.nom||p.ent?.enseigne||'Sans nom'}
function excluded(p){const s=norm([p.ent?.nom,p.ent?.enseigne,p.ent?.activite,p.ent?.secteur,p.ent?.naf].join(' '));
  if(/\b(banque|bnp|credit agricole|societe generale|lcl|caisse d'epargne|bred|cic|la poste)\b/.test(s))return'Banque / agence bancaire : décision IT au siège.';
  if(/\b(pharmacie|speedy|franchise|franchis|midas|norauto|carglass)\b/.test(s)||p.ent?.groupe==='Oui')return'Franchise ou réseau : la décision IT se prend au siège.';
  return''}
function matches(p,q){if(!q)return true;const s=norm([p.ent?.nom,p.ent?.enseigne,p.ent?.ville,p.ent?.cp,p.ent?.siret,p.ent?.siren,p.ent?.tel,p.ent?.secteur,...(p.contacts||[]).flatMap(c=>[c.prenom,c.nom,c.tel,c.mobile,c.email])].join(' ')).replace(/\s/g,'');
  return norm(q).split(/\s+/).every(w=>s.includes(w.replace(/\s/g,'')))}
function filtered(){const t=iso(today());
  return VP().filter(p=>matches(p,S.q)).filter(p=>{
    if(S.filter==='all')return true;if(S.filter==='due'){const a=nextAction(p);return a&&a.date&&a.date<=t}
    if(S.filter==='chaud')return p.temperature==='chaud';if(S.filter==='batch')return (S.lastBatch||[]).includes(p.id);if(S.filter==='terrain')return p.source==='terrain';if(S.filter==='rneko')return p.rne?.status==='a_verifier';return p.statut===S.filter})
   .sort((a,b)=>{const na=nextAction(a),nb=nextAction(b);const ka=na?.date?na.date+(na.heure||''):'~',kb=nb?.date?nb.date+(nb.heure||''):'~';return ka<kb?-1:ka>kb?1:(a.createdAt||0)-(b.createdAt||0)})}
function allActions(){const out=[];for(const p of VP())for(const a of (p.actions||[]))out.push({p,a});return out}
function monthRdv(){const d=new Date();const m=`${d.getFullYear()}-${pad(d.getMonth()+1)}`;return VP().filter(p=>p.rdvPrisLe&&p.rdvPrisLe.startsWith(m)).length}
function todayJournal(c){const t=iso(today());let n=0;for(const p of VP())for(const j of (p.journal||[]))if(j.date?.startsWith(t)&&j.canal===c&&j.issue)n++;return n}

/* ================= Rendu : coquille ================= */
function teamHtml(){const d=new Date();const mo=`${d.getFullYear()}-${pad(d.getMonth()+1)}`;const all=[...S.P.values()];
  const rows=(S.team||[]).map(m=>{const ps=all.filter(p=>(p._owner||USER.id)===m.id);const rdv=ps.filter(p=>String(p.rdvPrisLe||'').startsWith(mo)).length;const adm=(S.admins||[]).find(a=>a.user_id===m.id);
    return `<div class="tm"><b title="${esc(m.email)}">${esc(m.nom||m.email)}</b>${adm?`<span class="tag-adm">${adm.role==='owner'?'Admin principal':'Admin'}</span>`:''}<span>${ps.length} fiches · ${rdv} RDV ce mois</span>
      <button class="btn btn-q btn-s" data-act="whoset" data-v="${m.id===USER.id?'me':m.id}">Voir</button>
      ${S.role==='owner'&&m.id!==USER.id&&adm?.role!=='owner'?`<button class="btn btn-g btn-s" data-act="admtoggle" data-v="${m.id}">${adm?'Retirer admin':'Rendre admin'}</button>`:''}</div>`}).join('');
  return `<div class="f"><span class="lab">Équipe (accès admin)</span><div class="team">${rows||'<span class="cr-sub">Tes collègues apparaissent ici dès leur première connexion.</span>'}</div></div>`}
function renderWho(){for(const nav of $$('nav')){let b=nav.querySelector('[data-v="team"]');if(isAdmin()&&!b){const ag=nav.querySelector('[data-v="agenda"]');if(ag){b=ag.cloneNode(true);b.dataset.v='team';const svg=b.querySelector('svg');b.innerHTML=(svg?'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="7" cy="7" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="14" cy="8" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M2 16c.5-3 2.5-4.5 5-4.5s4.5 1.5 5 4.5M12 12.2c2.5-.4 4.6.8 5.2 3.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>':'')+'Équipe';ag.after(b)}}else if(!isAdmin()&&b)b.remove()}
  const w=$('#who-wrap');if(!w)return;if(!isAdmin()){w.innerHTML='';return}
  const opts=[['me','Mes fiches'],['all','Toute l’équipe'],...(S.team||[]).filter(m=>m.id!==USER?.id).map(m=>[m.id,m.nom||m.email])];
  w.innerHTML=`<label class="who"><span>👁</span><select id="who-sel" aria-label="Fiches affichées">${opts.map(([v,l])=>`<option value="${v}" ${S.who===v?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`}
function render(){
  renderWho();const app=$('#app');app.className=S.mode;
  $$('[data-act="view"]').forEach(b=>b.setAttribute('aria-current',String(S.view===b.dataset.v&&!(S.mode==='terrain'&&S.view==='list'&&S.sel&&false))));
  $$('[data-act="mode"]').forEach(b=>b.setAttribute('aria-pressed',String(S.mode===b.dataset.v)));
  const m=$('#main');
  if(S.view==='today')m.innerHTML=`<div class="today"><div class="today-in" id="today"></div></div>`,renderToday();
  else if(S.view==='agenda')m.innerHTML=`<div class="today"><div class="today-in" id="agenda"></div></div>`,renderAgenda();
  else if(S.view==='team')m.innerHTML=`<div class="today"><div class="today-in wide" id="team"></div></div>`,renderTeam();
  else if(S.view==='around'){m.innerHTML=`<div class="today"><div class="today-in" id="around"></div></div>`;renderAround();if(!S.gpsTried&&!A().pos&&S.mode==='terrain'){S.gpsTried=true;setTimeout(tryGps,150)}}
  else if(S.mode==='poste'){m.innerHTML=`<div class="cols"><aside class="col col-list" id="list"></aside><section class="col col-fiche" id="fiche"></section><aside class="col col-notes" id="notes"></aside></div>`;renderList();renderFiche();renderNotesOnly()}
  else{ if(S.sel&&cur()){m.innerHTML=`<section class="mono-col col-fiche" id="fiche"></section>`;renderFiche()}else{m.innerHTML=`<div class="mono-col col-list" id="list"></div>`;renderList()} }
  renderLayer();
}
function renderSoft(selChanged){
  if(S.view==='today')renderToday();else if(S.view==='agenda')renderAgenda();else if(S.view==='team')renderTeam();else if(S.view==='around'){}else{renderList();
    if(selChanged&&!$('#fiche')?.contains(document.activeElement))renderFiche();
    if(S.sel&&!cur()){S.sel=null;render()}}
}


/* ================= Équipe (admin) : stats par collaborateur ================= */
const NOREACH=/r[ée]pondeur|nrp|faux num|barrage/i;
function memberStats(id,per){const now=new Date();const t=iso(now);const wk=iso(addDays(now,-6));const mo=t.slice(0,7);
  const from=per==='jour'?t:per==='semaine'?wk:mo+'-01';
  const ps=[...S.P.values()].filter(p=>(p._owner||USER?.id)===id);let calls=0,reach=0,visits=0,last='';
  for(const p of ps)for(const j of p.journal||[]){const d=String(j.date||'').slice(0,10);if(j.date>last)last=j.date;if(d<from)continue;if(j.canal==='tel'){calls++;if(!NOREACH.test(j.issue||''))reach++}else if(j.canal==='terrain')visits++}
  const rdv=ps.filter(p=>p.rdvPrisLe&&iso(new Date(p.rdvPrisLe))>=from).length;
  const created=ps.filter(p=>p.createdAt&&iso(new Date(p.createdAt))>=from).length;
  const late=ps.filter(p=>{const a=nextAction(p);return a&&a.date&&a.date<t}).length;
  const due=ps.filter(p=>{const a=nextAction(p);return a&&a.date===t}).length;
  const chauds=ps.filter(p=>p.temperature==='chaud'&&!['gagne','perdu','ko'].includes(p.statut)).length;
  const devis=ps.filter(p=>p.statut==='devis').length,signes=ps.filter(p=>p.statut==='gagne').length;
  const upd=Math.max(0,...ps.map(p=>p.updatedAt||0));const lastAct=last||(upd?new Date(upd).toISOString():'');
  return{id,fiches:ps.length,calls,reach,visits,rdv,created,late,due,chauds,devis,signes,lastAct,conv:calls?Math.round(rdv/calls*100):null}}
const sinceTxt=s=>{if(!s)return'—';const d=new Date(s.length<=19&&!/Z$/.test(s)?s:s);const m=Math.round((Date.now()-d)/6e4);if(m<60)return m<=1?'à l’instant':`il y a ${m} min`;const h=Math.round(m/60);if(h<24)return`il y a ${h} h`;const j=Math.round(h/24);return j===1?'hier':`il y a ${j} j`};
function renderTeam(){const el=$('#team');if(!el)return;if(!isAdmin()){el.innerHTML='<div class="empty">Réservé aux admins.</div>';return}
  const per=S.teamPer||'semaine';const members=(S.team&&S.team.length?S.team:[{id:USER?.id,email:USER?.email||'Moi'}]);
  const rows=members.map(m=>({m,s:memberStats(m.id,per)})).sort((a,b)=>b.s.rdv-a.s.rdv||b.s.calls-a.s.calls);
  const tot=rows.reduce((t,{s})=>{for(const k of ['fiches','calls','reach','visits','rdv','created','late','due','chauds','devis','signes'])t[k]=(t[k]||0)+s[k];return t},{});
  const max=Math.max(1,...rows.map(r=>r.s.calls));const obj=S.settings.objectif||20;
  const adm=id=>(S.admins||[]).find(a=>a.user_id===id);
  el.innerHTML=`<div class="team-h"><div><h1>Équipe</h1><p>${members.length} collaborateur${members.length>1?'s':''} · statistiques ${per==='jour'?'du jour':per==='semaine'?'des 7 derniers jours':'du mois'}</p><button class="btn btn-g btn-s" data-act="expteam">📤 Exporter les sessions (choisir comptes et période)</button></div>
    <div class="chips">${[['jour','Aujourd’hui'],['semaine','7 jours'],['mois','Mois']].map(([k,l])=>`<button class="chip" data-act="teamper" data-v="${k}" aria-pressed="${per===k}">${l}</button>`).join('')}<button class="btn btn-g btn-s" data-act="teamrefresh">Actualiser</button></div></div>
   <div class="team-kpi"><div><b>${tot.calls||0}</b><span>appels</span></div><div><b>${tot.reach||0}</b><span>décrochés</span></div><div><b>${tot.rdv||0}</b><span>RDV pris</span></div><div><b>${tot.calls?Math.round((tot.rdv||0)/tot.calls*100)+' %':'—'}</b><span>appels → RDV</span></div><div><b>${tot.late||0}</b><span>rappels en retard</span></div></div>
   <div class="team-tbl"><table><thead><tr><th>Collaborateur</th><th>Appels</th><th>Décrochés</th><th>Visites</th><th>RDV pris</th><th>Appels → RDV</th><th>RDV ce mois / objectif</th><th>Chauds</th><th>Devis · signés</th><th>À faire</th><th>Fiches</th><th>Activité</th></tr></thead><tbody>
   ${rows.map(({m,s})=>{const mo=memberStats(m.id,'mois').rdv;const pct=Math.min(100,Math.round(mo/obj*100));const a=adm(m.id);
     return `<tr class="trow" data-act="whoset" data-v="${m.id===USER?.id?'me':m.id}" title="Voir ses fiches"><td><b>${esc(m.nom||m.email.split('@')[0])}${m.id===USER?.id?' (moi)':''}</b><small>${esc(m.email)}${a?` · ${a.role==='owner'?'admin principal':'admin'}`:''}</small></td>
      <td><div class="tbar"><i style="width:${Math.round(s.calls/max*100)}%"></i><span>${s.calls}</span></div></td><td>${s.reach}</td><td>${s.visits}</td><td><b class="big">${s.rdv}</b></td><td>${s.conv==null?'—':s.conv+' %'}</td>
      <td><div class="tbar obj"><i style="width:${pct}%"></i><span>${mo} / ${obj}</span></div></td><td>${s.chauds}</td><td>${s.devis} · ${s.signes}</td>
      <td>${s.late?`<span class="late">${s.late} en retard</span>`:''}${s.due?`<span class="due-t">${s.due} aujourd’hui</span>`:''}${!s.late&&!s.due?'—':''}</td><td>${s.fiches}${s.created?`<small>+${s.created}</small>`:''}</td><td>${sinceTxt(s.lastAct)}</td></tr>`}).join('')}
   </tbody></table></div>
   ${members.length<2?`<p class="hint">Tes collègues apparaîtront ici dès qu’ils auront créé leur compte Radar et se seront connectés une fois. Envoie-leur l’adresse de l’appli.</p>`:''}
   <p class="hint">Clique sur un collaborateur pour ouvrir ses fiches. « Décrochés » = appels hors répondeur, barrage et faux numéro. « Appels → RDV » = RDV pris ÷ appels sur la période.</p>`}
/* ================= Aujourd'hui ================= */
function renderToday(){
  const el=$('#today');if(!el)return;
  const h=new Date().getHours();const t=iso(today());
  const acts=allActions().filter(x=>!x.a.fait&&x.a.date&&x.a.date<=t).sort((x,y)=>(x.a.date+(x.a.heure||'99'))<(y.a.date+(y.a.heure||'99'))?-1:1);
  const late=acts.filter(x=>x.a.date<t).length;
  const rdv=monthRdv(),obj=S.settings.objectif||20;
  const P=VP();
  const counts=STATUTS.map(s=>({...s,n:P.filter(p=>p.statut===s.k).length}));
  const tot=P.length||1;
  const hot=P.filter(p=>p.temperature==='chaud'&&!['gagne','perdu','ko'].includes(p.statut)).slice(0,6);
  const exemples=P.some(p=>p.exemple);
  const daysLeft=(()=>{const d=new Date();const end=new Date(d.getFullYear(),d.getMonth()+1,0);let n=0;for(let x=new Date(d);x<=end;x=addDays(x,1))if(x.getDay()%6)n++;return n})();
  el.innerHTML=`
  <div class="hello"><div><h1>${h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir'}${''} — ${esc(JOURS[new Date().getDay()])} ${new Date().getDate()} ${MOIS[new Date().getMonth()]}</h1>
    <p>${acts.length?`${acts.length} action${acts.length>1?'s':''} à traiter${late?`, dont ${late} en retard`:''}.`:'Rien en retard. Bonne journée pour prospecter.'}</p></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-loc" data-act="view" data-v="around">📍 Autour de moi · 50 m</button>${S.mode==='poste'?`<button class="btn btn-p" data-act="session">Lancer la session d'appels</button>`:`<button class="btn btn-p" data-act="new">+ Nouvelle visite</button>`}<button class="btn btn-g" data-act="new">${S.mode==='poste'?'+ Nouveau prospect':'+ Saisie rapide'}</button><button class="btn btn-g" data-act="expquick" title="Télécharge l’Excel de ta journée">📤 Exporter ma session du jour</button><button class="btn btn-q" data-act="xlsx" title="Choisir la période et les comptes">Autre export…</button></div></div>
  ${exemples?`<div class="banner"><span>Les fiches marquées « exemple » montrent comment l'outil se remplit. Supprime-les quand tu veux.</span><button class="btn btn-g btn-s" data-act="delex">Supprimer les exemples</button></div>`:''}
  ${S.mode==='terrain'?`<div class="card qn-card"><h2>📝 Notes rapides → fiche</h2><p class="qn-help">Colle ou tape tes notes prises à la va-vite : la fiche est créée, l’entreprise cherchée au registre et chaque info rangée automatiquement.</p>
    <input class="in" id="qn-nom" placeholder="Nom de l’entreprise ou SIRET (facultatif)" value="${esc(lsGet('radar-qn-nom',''))}" autocomplete="off">
    <textarea class="in" id="qn-txt" rows="4" placeholder="ex. cabinet dupont, vu la secrétaire mme durand, dg absent, 8 pc sous w10, copieur canon en loc fin 06/27, rapl jeudi 14h">${esc(lsGet('radar-qn-txt',''))}</textarea>
    <button class="btn btn-p" data-act="qncreate">Créer la fiche et analyser</button></div>`:''}
  <div class="kpis">
    <div class="kpi main"><span class="k">RDV pris ce mois</span><span class="v num">${rdv}<small> / ${obj}</small></span><div class="bar"><i style="width:${Math.min(100,rdv/obj*100)}%"></i></div><span class="s">${rdv>=obj?'Objectif atteint 🎯':`Encore ${obj-rdv} · ${daysLeft} jours ouvrés restants`}</span></div>
    <div class="kpi"><span class="k">Appels aujourd'hui</span><span class="v num">${todayJournal('tel')}</span><span class="s">issues d'appel saisies</span></div>
    <div class="kpi"><span class="k">Visites aujourd'hui</span><span class="v num">${todayJournal('terrain')}</span><span class="s">passages terrain</span></div>
    <div class="kpi ${late?'alert':''}"><span class="k">En retard</span><span class="v num">${late}</span><span class="s">${late?'à rattraper en priorité':'tout est à jour'}</span></div>
  </div>
  <div class="two">
    <div class="card"><h2>À faire maintenant <button class="btn btn-q btn-s" data-act="view" data-v="agenda">Tout l'agenda →</button></h2>
      ${acts.length?acts.slice(0,12).map(todoRow).join(''):P.length?`<div class="empty" style="padding:14px">Aucune action prévue aujourd'hui.</div>`:emptyStart()}
    </div>
    <div style="display:flex;flex-direction:column;gap:18px;min-width:0">
      <div class="card"><h2>Pipeline <span class="lbl">${P.length} prospect${P.length>1?'s':''}</span></h2>
        <div class="pipe">${counts.filter(c=>c.n).map(c=>`<i style="width:${c.n/tot*100}%;background:${c.c}" title="${esc(c.l)} : ${c.n}"></i>`).join('')}</div>
        <div class="pl">${counts.map(c=>`<button data-act="filter" data-v="${c.k}"><i style="background:${c.c}"></i>${esc(c.l)}</button><span class="num">${c.n}</span>`).join('')}</div>
      </div>
      <div class="card"><h2>Prospects chauds</h2>
        ${hot.length?hot.map(p=>`<button class="todo" data-act="open" data-id="${p.id}"><span class="tdot" data-t="chaud"></span><span style="min-width:0"><div class="t">${esc(displayName(p))}</div><div class="n">${esc([ST[p.statut]?.l,p.ent?.ville].filter(Boolean).join(' · '))}</div></span><span class="due ${dueClass(nextAction(p))}">${esc(nextAction(p)?fmtDate(nextAction(p).date):'—')}</span></button>`).join(''):`<div class="n" style="color:var(--ink-3);font-size:13px">Marque un prospect « Chaud » dans sa fiche pour le retrouver ici.</div>`}
      </div>
    </div>
  </div>`;
}
function emptyStart(){return `<div class="empty"><h3>Ton radar est vide</h3><span>Crée ta première fiche : tape le nom ou colle un SIRET, l'outil remplit le reste.</span><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center"><button class="btn btn-p" data-act="new">+ Premier prospect</button><button class="btn btn-g" data-act="seed">Voir 3 exemples</button></div></div>`}
function todoRow({p,a}){const c=dueClass(a);return `<button class="todo" data-act="open" data-id="${p.id}" data-tab="suivi"><span class="atype">${esc(a.type)}</span><span style="min-width:0"><div class="t">${esc(displayName(p))}</div><div class="n">${esc([a.note,p.contacts?.[0]&&[p.contacts[0].prenom,p.contacts[0].nom].filter(Boolean).join(' '),fmtTel(p.contacts?.[0]?.tel||p.contacts?.[0]?.mobile||p.ent?.tel)].filter(Boolean).join(' · '))}</div></span><span class="due ${c}">${esc(c==='late'?fmtDate(a.date):a.heure||fmtDate(a.date))}</span></button>`}

/* ================= Agenda ================= */
function renderAgenda(){
  const el=$('#agenda');if(!el)return;const t=iso(today()),tm=iso(addDays(today(),1)),wk=iso(addDays(today(),7));
  const acts=allActions().filter(x=>!x.a.fait).sort((x,y)=>((x.a.date||'9')+(x.a.heure||''))<((y.a.date||'9')+(y.a.heure||''))?-1:1);
  const groups=[['En retard',x=>x.a.date&&x.a.date<t,'late'],["Aujourd'hui · "+longDate(today(),false),x=>x.a.date===t],['Demain · '+longDate(addDays(today(),1),false),x=>x.a.date===tm],...[2,3,4,5,6,7].map(n=>{const d=addDays(today(),n),k=iso(d);const L=longDate(d,false);return[L.charAt(0).toUpperCase()+L.slice(1),x=>x.a.date===k]}),['Plus tard',x=>x.a.date>wk],['Sans date',x=>!x.a.date]];
  el.innerHTML=`<div class="hello"><div><h1>Agenda</h1><p>${acts.length} action${acts.length>1?'s':''} ouverte${acts.length>1?'s':''}. Coche pour terminer, touche pour ouvrir la fiche.</p></div></div>
   <div class="card">${acts.length?groups.map(([l,f,c])=>{const g=acts.filter(f);return g.length?`<div class="ag-g"><h3 class="${c||''}">${l} · ${g.length}</h3>${g.map(x=>`<div class="act"><button class="check" role="checkbox" aria-checked="false" data-act="done" data-id="${x.p.id}" data-a="${x.a.id}" aria-label="Terminer"></button><button style="text-align:left;min-width:0" data-act="open" data-id="${x.p.id}" data-tab="suivi"><div class="act-t"><span class="atype">${esc(x.a.type)}</span>${esc(displayName(x.p))}</div><div class="act-n">${esc([x.a.note,x.p.ent?.ville,fmtTel(x.p.contacts?.[0]?.tel||x.p.contacts?.[0]?.mobile||x.p.ent?.tel)].filter(Boolean).join(' · '))}</div></button><span class="due ${dueClass(x.a)}">${esc(fmtDate(x.a.date))}${x.a.heure?' · '+esc(x.a.heure):''}</span></div>`).join('')}</div>`:''}).join(''):`<div class="empty"><h3>Rien de prévu</h3><span>Les rappels, RDV et relances créés depuis les fiches ou les notes apparaissent ici.</span></div>`}</div>`;
}

/* ================= Liste ================= */
function renderList(){
  const el=$('#list');if(!el)return;const keepTop=el.scrollTop;queueMicrotask(()=>{if(el.isConnected)el.scrollTop=keepTop});const L=filtered();
  const F=[['all','Tous'],['due','À traiter'],['chaud','Chauds'],['terrain','Terrain'],...(S.lastBatch?.length?[['batch','Dernier ajout']]:[]),...([...S.P.values()].some(p=>p.rne?.status==='a_verifier')?[['rneko','Registre à confirmer']]:[]),...STATUTS.slice(0,6).map(s=>[s.k,s.l]),['ko','Pas intéressé']];
  el.innerHTML=`<div class="list-head"><div class="lh-acts"><button class="btn btn-loc btn-s" data-act="view" data-v="around">📍 Autour de moi</button><button class="btn btn-g btn-s" data-act="importopen">+ SIRET / SIREN</button><button class="btn btn-g btn-s" data-act="fimpopen" title="Importer un fichier Excel, CSV ou PDF">📄 Importer un fichier</button></div>
   ${(()=>{const miss=VP().filter(p=>!p.ent?.tel&&(p.ent?.nom||p.ent?.enseigne));const r=S.phoneRun;return r&&!r.end?`<div class="ai" data-s="busy"><span class="spin"></span><span>Recherche des numéros : ${r.done.length}/${r.ids.length} · ${r.found} trouvé${r.found>1?'s':''}</span></div>`:r&&r.end?`<div class="ai"><span>${r.failed?'Le service gratuit OpenStreetMap ne répond pas en ce moment, réessaie plus tard. ':''}${r.found} numéro${r.found>1?'s':''} trouvé${r.found>1?'s':''} sur ${r.ids.length}. Pour les autres : ouvre la fiche, boutons PagesJaunes / Google.</span></div>`:miss.length?`<button class="btn btn-g btn-s" data-act="phoneall">📞 Chercher les numéros manquants (${miss.length})</button>`:''})()}${(()=>{const d=dupGroups().reduce((t,g)=>t+g.length-1,0);return d?`<button class="btn btn-s" style="background:var(--hot-soft,#fde8e4);color:var(--hot,#c2410c)" data-act="mergedups">⚠ ${d} doublon${d>1?'s':''} de SIRET : fusionner</button>`:''})()}<h2>Prospects <span>${L.length}${S.q||S.filter!=='all'?' / '+VP().length:''} ${VP().length?`<button class="btn btn-q btn-s" data-act="selmode">${S.selMode?'Terminer':'Sélectionner'}</button>`:''}</span></h2>
   ${S.selMode?`<div class="selbar"><button class="btn btn-g btn-s" data-act="pickall">Tout sélectionner (${L.length})</button><button class="btn btn-q btn-s" data-act="picknone">Aucune</button>
     ${S.picked.size?(S.confirmBulk?`<button class="btn btn-s" style="background:var(--bad);color:#fff" data-act="bulkdel">Confirmer : supprimer ${S.picked.size} fiche${S.picked.size>1?'s':''}</button><button class="btn btn-q btn-s" data-act="bulkno">Annuler</button>`:`<button class="btn btn-s" style="background:var(--bad);color:#fff" data-act="bulkask">Supprimer ${S.picked.size} fiche${S.picked.size>1?'s':''}</button>`):'<span class="lbl">Coche les fiches à supprimer</span>'}</div>`:''}
   <div class="filters">${F.map(([k,l])=>`<button class="fchip" data-act="filter" data-v="${k}" aria-pressed="${S.filter===k}">${esc(l)}</button>`).join('')}</div></div>
   <div class="rows">${L.length?L.map(p=>{const a=nextAction(p);const c=p.contacts?.[0];return `<button class="row${S.selMode?' picking':''}" data-act="${S.selMode?'pick1':'open'}" data-id="${p.id}" aria-current="${S.selMode?S.picked.has(p.id):p.id===S.sel}">
     ${S.selMode?`<span class="pbox" aria-hidden="true">${S.picked.has(p.id)?'✓':''}</span>`:`<span class="tdot" data-t="${p.temperature||''}"></span>`}<span class="nm">${esc(displayName(p))}${p.exemple?' <span class="lbl" style="font-size:10px">exemple</span>':''}</span><span class="pill st-${p.statut}">${esc(ST[p.statut]?.l||'')}</span>
     <span class="sub">${isAdmin()&&S.who!=='me'?`<span class="own">${esc(memberName(p._owner))}</span>`:''}${a?`<span class="due ${dueClass(a)}">${esc(a.type)} · ${esc(fmtDate(a.date))}${a.heure?' '+esc(a.heure):''}</span>`:''}<span>${p.ent?.tel?'📞 '+esc(fmtTel(p.ent.tel))+' · ':S.phoneRun&&S.phoneRun.ids.includes(p.id)&&!S.phoneRun.done.includes(p.id)?'📞 recherche… · ':''}${esc([p.ent?.ville,c&&[c.prenom,c.nom].filter(Boolean).join(' ')||p.ent?.secteur].filter(Boolean).join(' · '))}</span></span></button>`}).join('')
   :VP().length?`<div class="empty">Aucun prospect ne correspond.<button class="btn btn-g btn-s" data-act="filter" data-v="all">Effacer les filtres</button></div>`:emptyStart()}</div>`;
}

/* ================= Fiche ================= */
function ringSvg(v){const r=25,c=2*Math.PI*r;return `<svg viewBox="0 0 58 58"><circle cx="29" cy="29" r="${r}" fill="none" stroke="var(--sunk)" stroke-width="5"/><circle cx="29" cy="29" r="${r}" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-v/100)}" style="transition:stroke-dashoffset .5s"/></svg>`}
function renderFiche(){
  const el=$('#fiche');if(!el)return;const p=cur();
  if(!p){el.innerHTML=`<div class="placeholder"><div><h3>Choisis un prospect</h3><span>ou crée-en un nouveau. Raccourcis : <kbd>N</kbd> nouveau, <kbd>J</kbd>/<kbd>K</kbd> suivant/précédent, <kbd>/</kbd> recherche, <kbd>?</kbd> aide.</span><button class="btn btn-p" data-act="new">+ Nouveau prospect</button></div></div>`;return}
  const q=qualif(p),ex=excluded(p);const sub=[p.ent?.secteur,[p.ent?.cp,p.ent?.ville].filter(Boolean).join(' '),p.ent?.effectif&&p.ent.effectif+' sal. sur ce site'].filter(Boolean);
  el.innerHTML=`<div class="fiche">
   ${S.mode==='terrain'?`<div><button class="back" data-act="back">← Prospects</button></div>`:''}
   <div class="fhead">${p._owner&&p._owner!==USER?.id?`<div class="ownbar">👁 Fiche de <b>${esc(memberName(p._owner))}</b> · tes modifications sont enregistrées sur sa fiche</div>`:''}
    <div class="fhead-top"><div class="fname"><input id="f-ent-nom" data-k="ent.nom" value="${esc(p.ent?.nom||'')}" placeholder="Tape le nom : suggestions du registre" autocomplete="off">
      <div class="fmeta" id="fmeta">${fmetaHtml(p,sub)}</div></div>
      <div class="ring" title="Qualification de la fiche">${ringSvg(q)}<b class="num" id="ringv">${q}%</b><small>qualifiée</small></div></div>
    <div class="fbar"><div class="stsel">${STATUTS.map(s=>`<button data-act="statut" data-v="${s.k}" aria-pressed="${p.statut===s.k}" ${p.statut===s.k?`class="st-${s.k}"`:''}>${esc(s.l)}</button>`).join('')}</div>
     <div class="temp" role="group" aria-label="Température">${TEMPS.map(t=>`<button data-act="temp" data-v="${t.k}" aria-pressed="${p.temperature===t.k}">${t.l}</button>`).join('')}</div></div>
    ${ex?`<div class="warnbox"><b>Hors cible ?</b><span>${esc(ex)}</span></div>`:''}
    ${(()=>{const d=dupOf(p.ent?.siret||p.ent?.siren,p.id);return d?`<div class="warnbox"><b>Doublon</b><span>Ce SIRET est déjà dans la fiche « ${esc(displayName(d))} ».</span><button class="btn btn-p btn-s" data-act="dupopen">Fusionner dans la fiche existante</button></div>`:''})()}
    ${S.mode==='terrain'?(()=>{const d=lsGet('radar-draft-'+p.id,'');const n=(p.journal||[]).length;return `<button class="qnote" data-act="sheet"><span class="qn-t">📝 Notes rapides${n?` <small>· ${n} note${n>1?'s':''} déjà enregistrée${n>1?'s':''}</small>`:''}</span><span class="qn-d">${d?'Brouillon : '+esc(d.slice(0,90))+(d.length>90?'…':''):'Tape ou dicte tes notes en vrac (« dg mr martin, 12 postes, canon fin 06/27, rapl jeudi 14h ») : tout se range tout seul dans la fiche.'}</span><span class="qn-b">Écrire / analyser →</span></button>`})():''}
    ${phoneBox(p)}
   </div>
   <div class="tabs" role="tablist" id="tabs">${tabsHtml(p)}</div>
   <div id="tabbody">${tabBody(p)}</div>
   <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;padding-top:6px">
     <button class="btn btn-g btn-s" data-act="tab" data-v="cr">Voir le compte rendu</button><button class="btn btn-g btn-s" data-act="copycr">Copier le compte rendu</button>
     ${S.confirmDel?`<button class="btn btn-s" style="background:var(--bad);color:#fff" data-act="del2">Confirmer la suppression</button><button class="btn btn-q btn-s" data-act="del0">Annuler</button>`:`<button class="btn btn-q btn-s" data-act="del">Supprimer la fiche</button>`}
   </div>
  </div>
  ${S.mode==='terrain'?`<button class="fab" data-act="sheet"><svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 15.5V17h1.5L15 7.5 13.5 6zM12.5 7l1.5 1.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>Notes rapides</button>`:''}`;
  flashApply();setTimeout(()=>{autoEnrich(cur());autoPhone(cur())},400);
}
function fmetaHtml(p,sub){sub=sub||[p.ent?.secteur,[p.ent?.cp,p.ent?.ville].filter(Boolean).join(' '),p.ent?.effectif&&p.ent.effectif+' sal. sur ce site'].filter(Boolean);
  return `${p.ent?.enseigne?`<span class="ens">${esc(p.ent.enseigne)}</span>`:''}${p.ent?.siret?`<span>SIRET <span class="mono">${esc(fmtSiret(p.ent.siret))}</span></span>`:p.ent?.siren?`<span>SIREN <span class="mono">${esc(fmtSiret(p.ent.siren))}</span></span>`:'<span style="color:var(--ink-3)">SIRET non renseigné</span>'}${sub.map(s=>`<span>${esc(s)}</span>`).join('')}${p.ent?.tel?`<span class="mono">${esc(fmtTel(p.ent.tel))}</span>`:''}${p.rne?.status==='ok'?'<span class="badge-dec">✓ Registre</span>':p.rne?.status==='a_verifier'?'<span class="tag">Registre à confirmer</span>':''}<span style="color:var(--ink-3)">${p.source==='terrain'?'Terrain':p.source==='linkedin'?'LinkedIn':'Téléphone'}</span>`}
function tabsHtml(p){return TABS.map((t,i)=>{const [n,tot]=tabCount(p,t);return `<button class="tab${S.flash.has('tab:'+t.id)?' flash':''}" role="tab" data-act="tab" data-v="${t.id}" aria-selected="${S.tab===t.id}" title="${S.mode==='poste'?'Alt+'+(i+1):''}">${t.l}<span class="cnt${tot&&n===tot?' full':''}">${tot?n+'/'+tot:n}</span></button>`}).join('')}
function refreshMeta(){const p=cur();if(!p)return;const m=$('#fmeta');if(m)m.innerHTML=fmetaHtml(p);const t=$('#tabs');if(t)t.innerHTML=tabsHtml(p);
  const q=qualif(p),r=$('.ring');if(r){r.querySelector('svg').outerHTML=ringSvg(q);$('#ringv').textContent=q+'%'}}
function tabBody(p){const t=TABS.find(x=>x.id===S.tab)||TABS[0];
  if(t.id==='contacts')return contactsHtml(p);if(t.id==='suivi')return suiviHtml(p);if(t.id==='cr')return crHtml(p);
  return `${t.id==='ent'?briefHtml(p)+identHtml(p):''}<div class="panel"><div class="grid">${gridHtml(p,t)}</div></div>`}
function gridHtml(p,t){let sec='',shown='',out='',n=0;
  for(const f of t.fields){if(f.sec)sec=f.sec;if(f.k==='ent.nom'||f.hidden||(f.reg&&!filled(getP(p,f.k))))continue;
    if(sec!==shown){if(n&&sec)out+=`<div class="gsec">${esc(sec)}</div>`;shown=sec}
    n++;out+=fieldHtml(f,f.k,getP(p,f.k),null,p)}
  return out}
const PRESTA_O=['Oui','Non','Ne sait pas'];
function fieldHtml(f,path,v,def,p){
  const id='f-'+path.replace(/\./g,'-');const span=f.w===2?' span-2':'';const dk=def||f.k;
  const est=p?.est?.[path]?'<em class="est" title="Estimation automatique d’après l’effectif et le secteur : à confirmer pendant l’appel">≈ estimé</em>':'';
  if(f.t==='presta'){const nm=p?getP(p,f.tk):'';const yes=norm(v)==='oui';
    return `<div class="f${span} presta"><span class="lab">${esc(f.l)}</span><div class="presta-row">${chipsHtml({...f,t:'single',o:PRESTA_O,noOther:true},path,v,dk)}
      ${yes?`<input class="in" id="f-${f.tk.replace(/\./g,'-')}" data-k="${f.tk}" data-def="${f.tk}" value="${esc(nm||'')}" placeholder="Nom du prestataire" autocomplete="off">`:''}</div></div>`}
  if(f.t==='single'||f.t==='multi')return `<div class="f${span}"><span class="lab">${esc(f.l)}${est}</span>${chipsHtml(f,path,v,dk)}</div>`;
  let extra=est;
  if(f.k==='ent.siret'&&v){const d=String(v).replace(/\D/g,'');extra=d.length===14&&luhn(d)?'<em>✓ valide</em>':'<em class="bad">à vérifier</em>'}
  if(f.t==='area')return `<div class="f${span}"><label for="${id}">${esc(f.l)}</label><textarea class="in" id="${id}" data-k="${path}" data-def="${dk}" placeholder="${esc(f.ph||'')}">${esc(v||'')}</textarea></div>`;
  const type=f.t==='num'?'number':f.t==='month'?'month':f.t==='email'?'email':f.t==='tel'?'tel':'text';
  if(f.k==='ent.tva'&&v)extra+=' <button class="lnk" data-act="copyv" data-v="'+esc(v)+'">copier</button>';
  const val=f.t==='tel'?fmtTel(v||''):f.t==='mono'&&/siret|siren/.test(f.k)?fmtSiret(v||''):(v??'');
  return `<div class="f${span}"><label for="${id}">${esc(f.l)}${extra}</label><input class="in${f.t==='mono'||f.t==='tel'?' mono':''}" id="${id}" type="${type}" ${f.t==='num'?'inputmode="numeric" min="0"':''} data-k="${path}" data-def="${dk}" value="${esc(val)}" placeholder="${esc(f.ph||'')}" autocomplete="off"></div>`}
function chipsHtml(f,path,v,dk){
  const sel=f.t==='multi'?(Array.isArray(v)?v:(v?[v]:[])):(v?[v]:[]);
  const isSel=o=>sel.some(x=>norm(x)===norm(o));
  const custom=sel.filter(x=>!f.o.some(o=>norm(o)===norm(x)));
  return `<div class="chips" data-group="${path}" data-k="${path}" data-def="${dk}" data-t="${f.t}">${f.o.map(o=>`<button class="chip" data-act="chip" data-v="${esc(o)}" aria-pressed="${isSel(o)}">${esc(o)}</button>`).join('')}${custom.map(o=>`<button class="chip custom" data-act="chip" data-v="${esc(o)}" aria-pressed="true">${esc(o)}</button>`).join('')}${f.noOther?'':`<button class="chip add" data-act="other">+ ${f.o.length?'Autre':'Ajouter'}</button>`}</div>`}
function identHtml(p){
  const qn=encodeURIComponent([p.ent?.nom,p.ent?.ville].filter(Boolean).join(' '));const has=!!(p.ent?.nom);
  const q2=encodeURIComponent(p.ent?.siren||p.ent?.siret?.slice(0,9)||[p.ent?.nom,p.ent?.ville].filter(Boolean).join(' '));
  const st=S.id&&S.id.pid===p.id?S.id:{};
  const cands=st.cands?.length?st.cands:(p.rneCands||[]).map(c=>({kind:'sir',...c}));
  const ok=p.rne?.status==='ok';
  const candHtml=(c,i)=>{
    if(c.kind==='addr')return `<button class="cand" data-act="pick" data-i="${i}"><b>Garder seulement l'adresse</b><span>${esc(c.g.label)}</span></button>`;
    if(c.kind==='etab'){const x=c.x;return `<button class="cand" data-act="pick" data-i="${i}"><b>${esc(x.name)}</b><span>${esc([nafLabel(x.naf),x.forme,x.adr.rue].filter(Boolean).join(' · '))}</span><em>${Math.round(x.dist)} m</em></button>`}
    if(c.kind==='re'){const r=c.r;const e=pickEtab(r,{cp:p.ent?.cp});const a=addrOf(e||r.siege);return `<button class="cand" data-act="pick" data-i="${i}"><b>${esc(nameOf(r))}</b><span>${esc([formeFromCode(r.nature_juridique),[a.cp,a.ville].filter(Boolean).join(' '),nafLabel(nafFmt(r.activite_principale)),r.etat_administratif==='C'?'fermée':''].filter(Boolean).join(' · '))}</span><em class="mono">${esc(fmtSiret(r.siren))}</em></button>`}
    return `<button class="cand" data-act="pick" data-i="${i}"><b>${esc(c.nom||c.siren)}</b><span>${esc(c.info||'')}</span><em class="mono">${esc(fmtSiret(c.siren))}</em></button>`};
  if(ok&&!st.busy&&!st.msg&&!cands.length&&!S.identOpen?.has(p.id))return `<div class="ident ident-mini" id="ident-box"><span class="badge-dec">✓ Registre</span><span class="cr-sub" style="margin:0">Données de l’établissement ${p.ent?.siret?'SIRET <span class="mono">'+esc(fmtSiret(p.ent.siret))+'</span>':''}${p.ent?.etab?' · '+esc(p.ent.etab.toLowerCase()):''} · ${esc(fmtDate(p.rne.at).toLowerCase())}</span>${p.ent?.siret?`<a class="lnk" href="https://annuaire-entreprises.data.gouv.fr/etablissement/${esc(p.ent.siret)}" target="_blank" rel="noopener">voir la fiche officielle</a>`:''}
     <span class="sp"></span><button class="btn btn-q btn-s" data-act="rnerefresh">Actualiser</button><button class="btn btn-q btn-s" data-act="identopen">Changer d’entreprise</button></div>`;
  return `<div class="ident" id="ident-box" style="margin-bottom:14px">
   <h3><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5l1.6 4.2 4.4.3-3.4 2.8 1.1 4.3L8 10.7l-3.7 2.4 1.1-4.3L2 6l4.4-.3z" fill="var(--accent)"/></svg>Identification automatique ${ok?'<span class="badge-dec" style="margin-left:auto">✓ Registre</span>':''}</h3>
   <p>Tape le nom (les entreprises s'affichent pendant que tu écris), un SIRET, un SIREN, une adresse, ou colle une fiche entière : tout se remplit depuis le registre officiel.</p>
   <textarea class="in" id="ident-in" placeholder="ex. « gestion roche asnières », « 847 689 759 », « 4 rue de la Station »">${esc(st.keep||'')}</textarea>
   <div class="ident-row"><button class="btn btn-p btn-s" data-act="identify" ${st.busy?'disabled':''}>${st.busy?'Recherche…':'Identifier et remplir'}</button>
     ${p.ent?.siren?`<button class="btn btn-q btn-s" data-act="rnerefresh">${ok?'Actualiser depuis le registre':'Compléter depuis le registre'}</button>`:''}
     <span style="font-size:12px;color:var(--ink-3)">${S.mode==='poste'?'<kbd>Ctrl</kbd>+<kbd>Entrée</kbd>':''}</span></div>
   ${st.msg||st.busy?`<div class="ai" data-s="${st.busy?'busy':''}" style="background:var(--surface)">${st.busy?'<span class="spin"></span>':''}<span>${esc(st.msg||'')}</span></div>`:''}
   ${cands.length?`<div class="cands"><div class="lbl">${cands[0].kind==='etab'||cands[0].kind==='addr'?'Entreprises enregistrées à cette adresse':'Choisis la bonne entreprise'}</div>${cands.map(candHtml).join('')}
      <button class="btn btn-q btn-s" data-act="candx" style="align-self:flex-start">Aucune ne correspond</button></div>`:''}
   ${ok?`<p style="font-size:11.5px">Données officielles (${esc(fmtDate(p.rne.at).toLowerCase())}) · registre public des entreprises (INSEE / RNE).</p>`:''}
   ${has||p.ent?.siret?`<div class="links"><span class="lbl" style="align-self:center">Vérifier :</span>
     <a href="${p.ent?.siret?'https://annuaire-entreprises.data.gouv.fr/etablissement/'+encodeURIComponent(p.ent.siret):'https://annuaire-entreprises.data.gouv.fr/rechercher?terme='+q2}" target="_blank" rel="noopener">Annuaire des entreprises</a>
     <a href="https://www.pappers.fr/recherche?q=${q2}" target="_blank" rel="noopener">Pappers</a>
     <a href="https://www.google.com/maps/search/${qn}" target="_blank" rel="noopener">Maps</a>
     <a href="https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(p.ent?.nom||'')}" target="_blank" rel="noopener">LinkedIn</a>
     <a href="https://www.google.com/search?q=${qn}" target="_blank" rel="noopener">Google</a></div>`:''}
  </div>`}
function contactsHtml(p){const cs=p.contacts||[];
  return `<div style="display:flex;flex-direction:column;gap:12px">${cs.map((c,i)=>`<div class="contact"><div class="contact-h"><b>${esc([c.civ,c.prenom,c.nom].filter(Boolean).join(' ')||'Nouveau contact')}</b><span style="display:flex;gap:6px;align-items:center">${c.decideur==='Oui'?'<span class="badge-dec">Décideur</span>':''}<button class="btn btn-q btn-s" data-act="delc" data-i="${i}">Retirer</button></span></div>
   <div class="grid">${CFIELDS.map(f=>fieldHtml(f,`contacts.${i}.${f.k}`,c[f.k],'c.'+f.k)).join('')}</div></div>`).join('')}
   <button class="btn btn-g" data-act="addc" style="align-self:flex-start">+ Ajouter un contact</button></div>`}
function suiviHtml(p){
  const acts=(p.actions||[]).slice().sort((a,b)=>(a.fait-b.fait)||((a.date||'9')+(a.heure||'')<(b.date||'9')+(b.heure||'')?-1:1));
  const j=(p.journal||[]).slice().sort((a,b)=>a.date<b.date?1:-1);
  const na=S.newAct||{type:'Rappel',date:iso(bizDays(today(),1)),heure:'',note:''};
  return `<div style="display:flex;flex-direction:column;gap:14px">
   <div class="panel"><h3 class="sec-t">Actions à venir <span class="lbl">${acts.filter(a=>!a.fait).length} ouverte(s)</span></h3>
    <div class="acts">${acts.length?acts.map(a=>`<div class="act${a.fait?' done':''}"><button class="check" role="checkbox" aria-checked="${!!a.fait}" data-act="done" data-id="${p.id}" data-a="${a.id}" aria-label="Terminer">${a.fait?'✓':''}</button><div style="min-width:0"><div class="act-t"><span class="atype">${esc(a.type)}</span>${esc(fmtDate(a.date)||'Sans date')}${a.heure?' · '+esc(a.heure):''}</div>${a.note?`<div class="act-n">${esc(a.note)}</div>`:''}${CAL_TYPES.includes(a.type)&&!a.fait&&a.date?calBtns(p,a):''}</div><button class="btn btn-q btn-s" data-act="dela" data-a="${a.id}" aria-label="Supprimer l'action">✕</button></div>`).join(''):`<span style="color:var(--ink-3);font-size:13px">Aucune action. Ajoute-en une ou écris « rappeler jeudi 14h » dans tes notes.</span>`}</div>
    <div class="addact"><div class="chips">${ATYPES.map(t=>`<button class="chip" data-act="natype" data-v="${t}" aria-pressed="${na.type===t}">${t}</button>`).join('')}</div>
     <div class="f"><label for="na-date">Date</label><input class="in" type="date" id="na-date" value="${esc(na.date)}"></div>
     <div class="f"><label for="na-heure">Heure</label><input class="in" type="time" id="na-heure" value="${esc(na.heure)}"></div>
     <div class="quick span-2">${[['Demain',1],['+2 j',2],['+1 sem.',5],['+2 sem.',10],['+1 mois',21]].map(([l,n])=>`<button class="chip" data-act="naquick" data-v="${n}">${l}</button>`).join('')}</div>
     <div class="f span-2"><label for="na-note">Note</label><input class="in" id="na-note" placeholder="ex. demander la DAF, envoyer plaquette impression" value="${esc(na.note)}"></div>
     <button class="btn btn-p span-2" data-act="addact">Ajouter l'action</button></div>
   </div>
   <div class="panel"><h3 class="sec-t">Source</h3>${chipsHtml({t:'single',o:['Téléphone','Terrain','LinkedIn','Recommandation','Salon']},'source',{tel:'Téléphone',terrain:'Terrain',linkedin:'LinkedIn'}[p.source]||p.source,'source')}</div>
   <div class="panel"><h3 class="sec-t">Historique <span class="lbl">${j.length} entrée(s)</span></h3>
    ${j.length?`<div class="tl">${j.map((e,ix)=>`${ix===0||e.date.slice(0,10)!==j[ix-1].date.slice(0,10)?`<div class="tl-day">${esc(dayLabel(e.date))}<small>${esc(statTxt(dayStats(j.filter(x=>x.date.slice(0,10)===e.date.slice(0,10)).map(x=>({j:x})))))}</small></div>`:''}<div class="tl-i" data-c="${e.canal}"><div class="tl-h"><b>${esc(e.issue||(e.canal==='note'?'Note':e.canal==='tel'?'Appel':'Visite'))}</b><span>${esc(fmtDate(e.date.slice(0,10)))} ${esc(e.date.slice(11,16))}</span>${e.duree?`<span class="mono">${esc(e.duree)}</span>`:''}${e.canal==='tel'?'<span>📞</span>':e.canal==='terrain'?'<span>📍</span>':''}</div>${e.texte?(()=>{const L=jLines(e);return `${L.length?`<ul class="tl-clean">${L.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}<details class="tl-raw"><summary>Note brute</summary><div class="tl-x">${esc(e.texte)}</div></details>`})():''}</div>`).join('')}</div>`:`<span style="color:var(--ink-3);font-size:13px">Les notes et issues d'appel ou de visite s'ajoutent ici automatiquement.</span>`}
   </div></div>`}

/* ================= Panneau notes / appel ================= */
function notesHtml(p){
  if(!p)return `<div class="np"><div class="np-h"><h2>Notes</h2></div><div style="color:var(--ink-3);font-size:13px">Ouvre une fiche pour prendre des notes. L'analyse range automatiquement chaque info dans le bon onglet.</div>${S.mode==='poste'?`<button class="btn btn-p" data-act="session">Lancer la session d'appels</button>`:''}</div>`;
  const m=S.mode;const c=(p.contacts||[]).find(c=>c.tel||c.mobile)||null;const ph=c?.tel||c?.mobile||'';
  const outs=OUT[m];const draft=lsGet('radar-draft-'+p.id,'');const ses=S.session;
  return `<div class="np">
   ${ses?`<div class="sess"><span>Session d'appels · <b>${ses.i+1}/${ses.q.length}</b></span><span style="display:flex;gap:6px"><button class="btn btn-s" data-act="snext">Suivant <kbd style="background:transparent;border-color:currentColor;color:inherit">J</kbd></button><button class="btn btn-q btn-s" style="color:inherit" data-act="sstop">Arrêter</button></span></div>`:''}
   ${p.ent?.tel?`<div class="std-hero"><span class="lbl">Standard${p.ent.enseigne?' · '+esc(p.ent.enseigne):''}</span><a class="std-num mono" href="tel:${esc(p.ent.tel)}">${esc(fmtTel(p.ent.tel))}</a><button class="btn btn-g btn-s" data-act="copyph" data-v="${esc(p.ent.tel)}">Copier</button>${p.ent.telSource?`<small>${esc(p.ent.telSource)}</small>`:''}</div>`:`<div class="std-hero none"><span class="lbl">Standard</span><span class="std-none">pas de numéro</span>${S.ph?.busy&&S.ph.pid===p.id?`<span class="ph-run" style="padding:4px 8px"><span class="spin"></span>Recherche…</span>`:`<button class="btn btn-g btn-s" data-act="findphone">🔎 Trouver</button>`}</div>`}
   ${(()=>{const cm=S.calMsg;if(!cm||cm.pid!==p.id)return'';const ids=cm.aids||(cm.aid?[cm.aid]:[]);const L=ids.map(id=>p.actions?.find(x=>x.id===id)).filter(a=>a&&!a.fait);if(!L.length)return'';
     const lab=a=>`${a.type} ${fmtDate(a.date)}${a.heure?' à '+a.heure.replace(':','h'):''}`;const all=L.every(a=>a.cal);
     return `<div class="calmsg"><b>📅 ${L.length>1?L.length+' actions à inscrire dans l’agenda':esc(lab(L[0]))+(all?' envoyé vers Outlook':' à inscrire dans l’agenda')}</b><span>${all?'Si Outlook ne s’est pas ouvert ou que l’événement n’y apparaît pas :':'Un clic par action :'}</span>${L.map(a=>`<div>${L.length>1?`<span class="cal-l">${esc(lab(a))}${a.cal?' ✓':''}</span>`:''}<button class="btn btn-p btn-s" data-act="cal" data-v="m365" data-id="${p.id}" data-a="${a.id}">Outlook web</button><button class="btn btn-g btn-s" data-act="cal" data-v="ics" data-id="${p.id}" data-a="${a.id}">Outlook (application)</button></div>`).join('')}<div><button class="btn btn-q btn-s" data-act="calx">OK</button></div></div>`})()}
   <div class="np-h"><h2>${m==='poste'?'Appel en cours':'📝 Notes rapides · visite'}</h2>${S.sheet?`<button class="btn btn-q" data-act="sheetx">Fermer</button>`:''}</div>
   ${m==='poste'?`<div class="callbar">${ph?`<span class="who">${esc(c?[c.civ,c.prenom,c.nom].filter(Boolean).join(' ')+(c.fonction?' · '+c.fonction:''):'Standard')}</span><span class="ph">${esc(fmtTel(ph))}</span><button class="btn btn-g btn-s" data-act="copyph" data-v="${esc(ph)}">Copier</button><a class="btn btn-g btn-s" href="tel:${esc(String(ph).replace(/\s/g,''))}" style="text-decoration:none">Appeler</a>`:(p.ent?.tel?'':`<span class="links" style="width:100%">${phoneLinks(p)}</span>`)}
     ${S.call&&S.call.id===p.id?`<span class="timer" id="timer">00:00</span><button class="btn btn-q btn-s" data-act="callstop">Stop</button>`:`<button class="btn btn-p btn-s" data-act="callstart" style="margin-left:auto">▶ Chrono</button>`}</div>`:''}
   <textarea class="in note" id="note-in" placeholder="${m==='poste'?'Tape comme tu parles : « dg mr martin, 12 postes, canon en leasing fin 06/27 pas content, av avast, pas de svg, rapl jeudi 14h »':'ex. « vu accueil, gerante mme lopez absente, 8 pers, copieur ricoh, repasser mardi matin »'}">${esc(draft)}</textarea>
   <div class="hint"><span>Abréviations et fautes comprises.</span>${m==='poste'?'<span><kbd>Ctrl</kbd>+<kbd>Entrée</kbd> analyser</span>':''}</div>
   <button class="btn btn-p" data-act="analyze" ${S.aiBusy?'disabled':''}>${S.aiBusy?'Analyse en cours…':'Analyser et remplir la fiche'}</button>
   ${S.aiMsg||S.aiBusy?`<div class="ai" data-s="${S.aiBusy?'busy':''}">${S.aiBusy?'<span class="spin"></span>':''}<span>${esc(S.aiMsg)}</span></div>`:''}
   ${S.ask?askHtml():`<div><div class="lbl" style="margin-bottom:6px">Issue ${m==='poste'?'de l’appel':'de la visite'}</div><div class="outs">${outs.map(o=>`<button class="out ${o.cls||''}" data-act="out" data-v="${o.k}">${esc(o.l)}${o.key&&m==='poste'?`<kbd>Alt ${o.key}</kbd>`:''}</button>`).join('')}</div></div>`}
  </div>`}
function askHtml(){const a=S.ask;const o=OUT[S.mode].find(x=>x.k===a.k);
  return `<div class="ask"><b>${esc(o.l)} : quand ?</b><div class="quick">${(o.k==='rdv'?[['Demain',1],['+2 j',2],['+3 j',3],['+1 sem.',5]]:[['Demain',1],['+2 j',2],['+1 sem.',5],['+1 mois',21]]).map(([l,n])=>`<button class="chip" data-act="askq" data-v="${n}">${l}</button>`).join('')}</div>
   <div class="rowx"><input class="in" type="date" id="ask-date" value="${esc(a.date)}"><input class="in" type="time" id="ask-heure" step="900" value="${esc(a.heure)}"></div>
   <div class="slots">${slotsFor(o.k==='rdv'?60:0).map((s,i,arr)=>`${i&&hm(s)-hm(arr[i-1])>90?'<i></i>':''}<button class="chip${a.heure===s?' on':''}" data-act="askslot" data-v="${s}" aria-pressed="${a.heure===s}">${s.replace(':','h')}</button>`).join('')}</div>
   <small class="hint">Tes horaires : ${workHours().map(([x,y])=>x.replace(':','h')+'–'+y.replace(':','h')).join(' et ')}${o.k==='rdv'?' · RDV d’1 h':''}</small>
   ${o.k==='rdv'?`<div class="chips">${['Sur place','Visio','Téléphone','Accompagné'].map(t=>`<button class="chip" data-act="asklieu" data-v="${t}" aria-pressed="${a.lieu===t}">${t}</button>`).join('')}</div>`:''}
   <div class="rowx"><button class="btn btn-p" data-act="askok">Valider</button><button class="btn btn-g" data-act="askno">Annuler</button></div></div>`}
function renderNotesOnly(){const p=cur();
  if(S.mode==='poste'){const el=$('#notes');if(el){const keep=$('#note-in')?.value;el.innerHTML=notesHtml(p);if(keep!=null&&$('#note-in')&&p)$('#note-in').value=keep}}
  else renderLayer()}
function renderLayer(){const L=$('#layer');
  if(S.mode==='terrain'&&S.sheet&&cur()){const keep=$('#note-in')?.value;L.innerHTML=`<div class="sheet-bg" data-act="sheetx"></div><div class="sheet" role="dialog" aria-label="Notes et issue"><div class="grab"></div>${notesHtml(cur())}</div>`;if(keep!=null)$('#note-in').value=keep}
  else if(S.fimpOpen)L.innerHTML=fimpHtml();else if(S.importing)L.innerHTML=importHtml();else if(S.help)L.innerHTML=helpHtml();else if(S.menu)L.innerHTML=menuHtml();else if(S.exp)L.innerHTML=expHtml();else L.innerHTML=''}
function helpHtml(){return `<div class="modal" data-act="closem"><div><h2>Raccourcis clavier</h2><div class="keys">
 <kbd>N</kbd><span>Nouveau prospect</span><kbd>/</kbd><span>Rechercher</span><kbd>J</kbd> <kbd>K</kbd><span>Prospect suivant / précédent (ou suivant en session d'appels)</span>
 <kbd>Ctrl Entrée</kbd><span>Analyser la note (ou l'identification)</span><kbd>Alt 1…8</kbd><span>Issue d'appel rapide</span><kbd>Alt ⇧ 1…8</kbd><span>Changer d'onglet</span><kbd>Échap</kbd><span>Sortir du champ</span></div>
 <button class="btn btn-g" data-act="closem">Fermer</button></div></div>`}
function menuHtml(){const other=S.mode==='poste'?['mobile.html','Radar Terrain (téléphone)']:['pc.html','Radar Poste (PC)'];
 return `<div class="modal" data-act="closem"><div><h2>Options</h2>
 ${isAdmin()?teamHtml():''}
 ${USER?`<div class="acct"><span>Connecté : <b>${esc(USER.email)}</b>${isAdmin()?` · <span class="tag-adm">${S.role==='owner'?'Admin principal':'Admin'}</span>`:''}</span><button class="btn btn-q btn-s" data-act="logout">Se déconnecter</button></div>`:`<div class="acct"><span>${SB?'Non connecté':'Synchronisation non configurée : les fiches restent sur cet appareil.'}</span></div>`}
 <div class="f"><label for="obj">Objectif RDV par mois</label><input class="in" id="obj" type="number" min="1" value="${S.settings.objectif||20}"></div>
 <div class="f"><label for="tt-key">Clé TomTom (facultatif, pour trouver plus de numéros)</label><input class="in mono" id="tt-key" placeholder="Laisse vide si tu n'en as pas" value="${esc(S.settings.tomtomKey||'')}" autocomplete="off"></div>
 <div class="f"><span class="lab">Mes horaires de travail</span><div class="hrs">${workHours().map(([a,b],i)=>`<span><input class="in mono" type="time" id="wh-${i}a" value="${a}"> – <input class="in mono" type="time" id="wh-${i}b" value="${b}"></span>`).join('<em>et</em>')}</div><small class="hint">Utilisés pour proposer les créneaux de RDV et de rappel.</small></div>
 <div class="f"><span class="lab">Agenda (RDV et rappels)</span><div class="chips">${[['m365','Outlook pro (Microsoft 365)'],['ics','Outlook (application Windows, fichier)'],...(proMail()?[]:[['live','Outlook.com perso']])].map(([k,l])=>`<button class="chip" data-act="calpick" data-v="${k}" aria-pressed="${(S.settings.cal||'m365')===k}">${l}</button>`).join('')}</div>
  <label style="display:flex;gap:8px;align-items:center;font-size:13px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--ink)"><input type="checkbox" id="cal-auto" ${S.settings.calAuto!==false?'checked':''}> Ouvrir l'agenda automatiquement quand je prends un RDV</label><label style="display:flex;gap:8px;align-items:center;font-size:13px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--ink)"><input type="checkbox" id="cal-rappel" ${S.settings.calRappel!==false?'checked':''}> Ouvrir l'agenda automatiquement quand on me demande de rappeler</label></div>
 <div style="display:flex;flex-direction:column;gap:8px">
  ${S.installEvt?'<button class="btn btn-p" data-act="install">Installer l’application</button>':''}
  <button class="btn btn-p" data-act="fimpopen">Importer un fichier (Excel, CSV, PDF)</button>
  <button class="btn btn-g" data-act="importopen">Créer des fiches depuis des SIRET / SIREN</button>
  <button class="btn btn-g" data-act="xlsx">Exporter en Excel (jour, semaine, mois, comptes…)</button>
  <button class="btn btn-g" data-act="export">Exporter en CSV (import Artis)</button>
  <button class="btn btn-g" data-act="backup">Télécharger une sauvegarde complète</button>
  <label class="btn btn-g" for="imp-in" style="cursor:pointer">Importer une sauvegarde</label><input type="file" id="imp-in" accept=".json,application/json" hidden>
  ${S.mode==='poste'?'<button class="btn btn-g" data-act="help">Raccourcis clavier</button>':''}
  ${S.P.size?'':'<button class="btn btn-g" data-act="seed">Charger 3 fiches d’exemple</button>'}
  <a class="btn btn-q" href="${other[0]}">Ouvrir ${other[1]}</a>
 </div>
 <button class="btn btn-p" data-act="closem">Fermer</button></div></div>`}

/* ================= Actions UI ================= */
function openFiche(id,tab){S.sel=id;S.confirmDel=false;S.ask=null;S.aiMsg='';S.newAct=null;if(tab)S.tab=tab;else if(!TABS.some(t=>t.id===S.tab))S.tab='ent';
  const fromList=S.mode==='poste'&&S.view==='list'&&$('#list');
  if(S.view!=='list')S.view='list';
  if(fromList){renderList();renderFiche();renderNotesOnly();const fc=$('#fiche')?.closest('.col');if(fc)fc.scrollTop=0}
  else{render();if(S.mode==='poste')$('.row[aria-current="true"]')?.scrollIntoView({block:'nearest'})}}
function newProspect(){const p=blank(S.mode==='poste'?'tel':'terrain');S.P.set(p.id,p);touch(p);S.tab='ent';openFiche(p.id,'ent');setTimeout(()=>$('#ident-in')?.focus(),30)}
function toast(msg,undo){const t=document.createElement('div');t.className='toast';t.innerHTML=`<span>${esc(msg)}</span>${undo?'<button>Annuler</button>':''}`;
  if(undo)t.querySelector('button').onclick=()=>{undo();t.remove()};$('#toast').append(t);setTimeout(()=>t.remove(),undo?7000:3200)}
function setField(path,v){const p=cur();if(!p)return;
  if(path==='source'){p.source={Téléphone:'tel',Terrain:'terrain',LinkedIn:'linkedin'}[v]||v;touch(p);return}
  if(p.est?.[path]){delete p.est[path];const l=$(`[data-k="${CSS.escape(path)}"]`)?.closest('.f')?.querySelector('.est');if(l)l.remove()}
  setP(p,path,v);if(['ent.effectif','ent.secteur','it.utilisateurs'].includes(path)&&p.est&&Object.keys(p.est).length){if(path==='ent.effectif'&&p.rne)p.rne.tranche='';applyEstimates(p);if(S.tab==='ent'&&path!=='it.utilisateurs'){const bx=$('#tabbody .brief');if(bx)bx.outerHTML=briefHtml(p)}}
  touch(p);refreshMeta()}

const ACT={
 view:b=>{S.view=b.dataset.v;if(S.mode==='terrain'&&S.view==='list')S.sel=null;S.sheet=false;render()},
 new:()=>newProspect(),
 open:b=>openFiche(b.dataset.id,b.dataset.tab),
 selmode:()=>{S.selMode=!S.selMode;S.picked=new Set();S.confirmBulk=false;if(S.mode==='terrain')S.sel=null;renderList()},
 pick1:b=>{const id=b.dataset.id;S.picked.has(id)?S.picked.delete(id):S.picked.add(id);S.confirmBulk=false;renderList()},
 pickall:()=>{filtered().forEach(p=>S.picked.add(p.id));S.confirmBulk=false;renderList()},
 picknone:()=>{S.picked.clear();S.confirmBulk=false;renderList()},
 bulkask:()=>{S.confirmBulk=true;renderList()},bulkno:()=>{S.confirmBulk=false;renderList()},
 bulkdel:()=>{const gone=[...S.picked].map(id=>S.P.get(id)).filter(Boolean);gone.forEach(p=>removeProspect(p.id));if(gone.some(p=>p.id===S.sel))S.sel=null;
   S.picked.clear();S.confirmBulk=false;S.selMode=false;render();
   toast(`${gone.length} fiche${gone.length>1?'s':''} supprimée${gone.length>1?'s':''}`,()=>{gone.forEach(p=>{S.P.set(p.id,p);touch(p)});render()})},
 back:()=>{S.sel=null;S.sheet=false;render()},
 filter:b=>{S.filter=S.filter===b.dataset.v&&b.dataset.v!=='all'&&S.view==='list'?'all':b.dataset.v;if(S.view!=='list'||(S.mode==='terrain'&&S.sel)){S.view='list';if(S.mode==='terrain')S.sel=null;render()}else renderList()},
 tab:b=>{S.tab=b.dataset.v;S.flash.delete('tab:'+S.tab);$('#tabs').innerHTML=tabsHtml(cur());$('#tabbody').innerHTML=tabBody(cur())},
 statut:b=>{const p=cur();setStatut(p,b.dataset.v);touch(p);renderFiche();renderList()},
 temp:b=>{const p=cur();p.temperature=p.temperature===b.dataset.v?'':b.dataset.v;touch(p);renderFiche();renderList()},
 chip:b=>{const g=b.closest('.chips');const path=g.dataset.k,t=g.dataset.t,v=b.dataset.v;const p=cur();
  if(path==='source'){setField('source',v);g.outerHTML=chipsHtml({t:'single',o:['Téléphone','Terrain','LinkedIn','Recommandation','Salon']},'source',v,'source');return}
  const curv=getP(p,path);let nv;
  if(t==='single')nv=norm(curv)===norm(v)?'':v;
  else{let arr=Array.isArray(curv)?curv.slice():[];const i=arr.findIndex(x=>norm(x)===norm(v));if(i>=0)arr.splice(i,1);else{if(EXCL.test(v))arr=[];else arr=arr.filter(x=>!EXCL.test(x));arr.push(v)}nv=arr}
  setField(path,nv);if(FIELD[path]?.t==='presta'){$('#tabbody').innerHTML=tabBody(p);if(norm(nv)==='oui')$('#f-'+FIELD[path].tk.replace(/\./g,'-'))?.focus();return}redrawChips(path);
  if(path.startsWith('contacts.')&&path.endsWith('decideur')){$('#tabbody').innerHTML=tabBody(p)}},
 other:b=>{const g=b.closest('.chips');b.outerHTML=`<input class="chip-in" placeholder="Saisis puis Entrée" aria-label="Autre valeur">`;const i=g.querySelector('.chip-in');i.focus();
  const commit=()=>{const v=i.value.trim();if(v){const p=cur();const f=defOf(g.dataset.def);let curv=getP(p,g.dataset.k);
     if(f.t==='single')setField(g.dataset.k,v);else{let arr=Array.isArray(curv)?curv.filter(x=>!EXCL.test(x)):[];if(!arr.some(x=>norm(x)===norm(v)))arr.push(v);setField(g.dataset.k,arr)}}
   redrawChips(g.dataset.k)};
  i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();commit()}if(e.key==='Escape')redrawChips(g.dataset.k)});i.addEventListener('blur',()=>{if(document.contains(i))commit()})},
 addc:()=>{const p=cur();p.contacts=p.contacts||[];p.contacts.push({id:rid()});touch(p);$('#tabbody').innerHTML=tabBody(p);refreshMeta();$$('.contact').at(-1)?.querySelector('input')?.focus()},
 delc:b=>{const p=cur();const old=structuredClone(p.contacts);p.contacts.splice(+b.dataset.i,1);touch(p);$('#tabbody').innerHTML=tabBody(p);refreshMeta();toast('Contact retiré',()=>{p.contacts=old;touch(p);$('#tabbody').innerHTML=tabBody(p);refreshMeta()})},
 natype:b=>{S.newAct=readNa();S.newAct.type=b.dataset.v;$('#tabbody').innerHTML=tabBody(cur())},
 naquick:b=>{S.newAct=readNa();S.newAct.date=iso(bizDays(today(),+b.dataset.v));$('#tabbody').innerHTML=tabBody(cur())},
 addact:()=>{const p=cur();const na=readNa();addAction(p,{type:na.type,date:na.date,heure:na.heure,note:na.note});S.newAct=null;touch(p);$('#tabbody').innerHTML=tabBody(p);refreshMeta();renderList();toast(`${na.type} ajouté · ${fmtDate(na.date)}`)},
 done:b=>{const p=S.P.get(b.dataset.id);const a=p.actions.find(x=>x.id===b.dataset.a);a.fait=!a.fait;a.faitLe=a.fait?new Date().toISOString():null;touch(p);
  if(S.view==='agenda')renderAgenda();else if(S.view==='today')renderToday();else{$('#tabbody')&&($('#tabbody').innerHTML=tabBody(p));refreshMeta();renderList()}
  if(a.fait)toast(`${a.type} terminé`,()=>{a.fait=false;touch(p);renderSoft(true)})},
 dela:b=>{const p=cur();const i=p.actions.findIndex(x=>x.id===b.dataset.a);const [a]=p.actions.splice(i,1);touch(p);$('#tabbody').innerHTML=tabBody(p);refreshMeta();renderList();toast('Action supprimée',()=>{p.actions.push(a);touch(p);$('#tabbody').innerHTML=tabBody(p);renderList()})},
 identify:()=>{const v=$('#ident-in').value.trim();if(!v){$('#ident-in').focus();return}identify(cur(),v)},
 pick:b=>pickCand(cur(),+b.dataset.i),
 sgpick:b=>sgPick(+b.dataset.i),
 candx:()=>{const p=cur();delete p.rneCands;if(p.rne?.status==='a_verifier')p.rne.status='introuvable';touch(p);S.id=null;renderFiche()},
 rnerefresh:async()=>{const p=cur();setId(p,{busy:true,msg:'Mise à jour depuis le registre…'});try{idDone(p,await applyRne(p,p.ent.siret||p.ent.siren,{siret:p.ent.siret}))}catch(e){setId(p,{msg:e?.fr||'Registre indisponible.'})}},
 gps:()=>tryGps(),aroundgo:()=>aroundSearch(),
 radius:b=>{const a=A();a.radius=+b.dataset.v;lsSet('radar-radius',a.radius);if(a.pos)aroundRun();else renderAround()},
 grp:b=>{const a=A();const k=b.dataset.v;a.groups=a.groups.includes(k)?a.groups.filter(x=>x!==k):[...a.groups,k];if(!a.groups.length)a.groups=[k];lsSet('radar-groups2',a.groups);if(a.all.length){filterAround();renderAround()}else renderAround()},
 selone:(b,e)=>{const a=A();if(e.target!==b)return;b.checked?a.sel.add(b.dataset.id):a.sel.delete(b.dataset.id);renderAround()},
 selall:()=>{const a=A();a.res.forEach(x=>{if(!x.known)a.sel.add(x.id)});renderAround()},selnone:()=>{A().sel.clear();renderAround()},
 aroundcreate:()=>aroundCreate(),
 analyze:()=>{const t=$('#note-in').value.trim();if(!t){$('#note-in').focus();return}commitNote(cur(),t,null)},
 out:b=>{const o=OUT[S.mode].find(x=>x.k===b.dataset.v);const p=cur();
  if(o.ask){const note=$('#note-in')?.value||'';const w=parseWhen(norm(note),today());const d=w?.date||iso(bizDays(today(),o.a.in));
    S.ask={k:o.k,date:workDay(d),heure:w?.heure?fitSlot(w.heure,o.k==='rdv'?60:0):(o.k==='rdv'?'10:00':''),lieu:S.mode==='terrain'?'Sur place':'Sur place'};renderNotesOnly();return}
  commitNote(p,$('#note-in')?.value.trim()||'',o)},
 askq:b=>{S.ask.date=iso(bizDays(today(),+b.dataset.v));$('#ask-date').value=S.ask.date},
 asklieu:b=>{S.ask.lieu=b.dataset.v;$$('[data-act="asklieu"]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))},
 askok:()=>{const o=OUT[S.mode].find(x=>x.k===S.ask.k);const date=$('#ask-date').value;let heure=$('#ask-heure').value;const lieu=S.ask.lieu;const dur=o.k==='rdv'?60:0;
  if(heure&&!inHours(heure,dur)){const f=fitSlot(heure,dur);toast(`${heure.replace(':','h')} est hors de tes horaires : RDV placé à ${f.replace(':','h')}`);heure=f}
  if(date&&[0,6].includes(new Date(date+'T12:00').getDay())){toast('Ce jour tombe un week-end : choisis un jour de semaine.');return}
  S.ask=null;
  const pp=cur();commitNote(pp,$('#note-in')?.value.trim()||'',o,{date,heure,lieu:o.k==='rdv'?lieu:''});
  if(o.k==='rdv'){const a=(pp.actions||[]).filter(x=>x.type==='RDV'&&!x.fait&&x.date===date).slice(-1)[0];if(a){if(S.settings.calAuto!==false)addToCal(pp,a);else{S.calMsg={pid:pp.id,aid:a.id};renderNotesOnly()}}}},
 askno:()=>{S.ask=null;renderNotesOnly()},
 askslot:b=>{S.ask.heure=b.dataset.v;$('#ask-heure').value=b.dataset.v;$$('[data-act="askslot"]').forEach(x=>{const on=x===b;x.setAttribute('aria-pressed',String(on));x.classList.toggle('on',on)})},
 copyph:b=>copy(String(b.dataset.v).replace(/\s/g,''),'Numéro copié'),
 copyv:b=>copy(String(b.dataset.v),'Copié : '+b.dataset.v),
 callstart:()=>{S.call={id:S.sel,t0:Date.now()};renderNotesOnly();tick()},
 callstop:()=>{S.call=null;renderNotesOnly()},
 session:()=>startSession(),snext:()=>nextInSession(),sstop:()=>{S.session=null;renderNotesOnly();toast('Session terminée')},
 sheet:()=>{S.sheet=true;renderLayer();setTimeout(()=>$('#note-in')?.focus(),60)},
 sheetx:e=>{S.sheet=false;S.ask=null;renderLayer()},
 copy:()=>copy(crText(cur()),'Compte rendu copié'),copyv:b=>copy(b.dataset.v,'Copié'),
 angnext:b=>{S.angOff=S.angOff||{};S.angOff[b.dataset.id]=(S.angOff[b.dataset.id]||0)+1;$('#tabbody').innerHTML=tabBody(cur())},
 brieftg:()=>{S.briefOpen=S.briefOpen===false;lsSet('radar-brief',S.briefOpen?'1':'0');$('#tabbody').innerHTML=tabBody(cur())},
 identopen:()=>{const p=cur();S.identOpen=S.identOpen||new Set();S.identOpen.add(p.id);$('#tabbody').innerHTML=tabBody(p);$('#ident-in')?.focus()},
 findphone:()=>{const p=cur();if(p)findPhoneUI(p)},
 phoneall:()=>phoneAll(),mergedups:()=>mergeDups(),
 dupopen:()=>{const p=cur();const d=p&&dupOf(p.ent?.siret||p.ent?.siren,p.id);if(!p||!d)return;mergeInto(d,p);removeProspect(p.id);touch(d);S.id=null;openFiche(d.id,'ent');render();toast('Fiches fusionnées dans la fiche existante')},
 usealt:()=>{const p=cur();if(!p)return;const old=p.ent.tel;p.ent.tel=p.ent.telAlt;p.ent.telAlt=old||'';if(p.ent.telLookup)p.ent.telLookup.status='ok';touch(p);renderFiche();renderNotesOnly()},
 importopen:()=>{S.menu=false;S.imp=S.imp&&S.imp.busy?S.imp:{};S.importing=true;renderLayer();setTimeout(()=>$('#imp-text')?.focus(),50)},
 impsrc:b=>{const st=S.imp=S.imp||{};st.text=$('#imp-text')?.value||st.text;st.src=b.dataset.v;renderLayer()},
 impgo:()=>runImport(),
 copycr:()=>copy(crText(cur()),'Compte rendu copié'),
 xlsx:()=>expOpen('jour'),
 expper:b=>{S.exp.per=b.dataset.v;renderLayer()},
 expown:b=>{const o=S.exp.owners,v=b.dataset.v;S.exp.owners=o.includes(v)?o.filter(x=>x!==v):[...o,v];renderLayer()},
 expall:()=>{const M=expMembers();S.exp.owners=S.exp.owners.length===M.length?[]:M.map(m=>m.id);renderLayer()},
 expname:()=>{const n=prompt('Nom qui apparaîtra dans tes exports :',S.settings.monNom||'');if(n!=null){S.settings.monNom=n.trim();saveSettings();renderLayer()}},
 expx:(b,e)=>{if(e.target!==b&&!b.matches('button'))return;S.exp=null;renderLayer()},
 expgo:async()=>{const o=S.exp;S.exp=null;renderLayer();await expRun(o)},
 expquick:()=>expRun({per:'jour',owners:[meId()]}),
 qncreate:async()=>{const nom=($('#qn-nom')?.value||'').trim(),txt=($('#qn-txt')?.value||'').trim();if(!txt&&!nom){toast('Écris d’abord tes notes.');$('#qn-txt')?.focus();return}
   const p=blank('terrain');const dig=nom.replace(/[\s.\-]/g,'');if(nom&&!/^\d{9}(\d{5})?$/.test(dig))p.ent.nom=nom;S.P.set(p.id,p);touch(p);lsSet('radar-qn-nom',null);lsSet('radar-qn-txt',null);
   if(txt)await commitNote(p,txt,null);openFiche(p.id,'ent');if(nom)identify(p,nom).catch(()=>{});toast(`Fiche créée${txt?' et notes analysées':''}`)},
 expteam:()=>{expOpen('jour');S.exp.owners=expMembers().map(m=>m.id);renderLayer()},
 del:()=>{S.confirmDel=true;renderFiche()},del0:()=>{S.confirmDel=false;renderFiche()},
 del2:()=>{const p=cur();removeProspect(p.id);S.sel=null;S.confirmDel=false;render();toast(`« ${displayName(p)} » supprimé`,()=>{S.P.set(p.id,p);touch(p);openFiche(p.id)})},
 menu:()=>{S.menu=true;renderLayer()},help:()=>{S.menu=false;S.help=true;renderLayer()},
 calpick:b=>{S.settings.cal=b.dataset.v;saveSettings();renderLayer()},
 teamper:b=>{S.teamPer=b.dataset.v;renderTeam()},teamrefresh:async()=>{await loadRole();await pullAll();if(S.view==='team')renderTeam();toast('Statistiques à jour')},
 whoset:b=>{S.who=b.dataset.v;lsSet(LK()+'-who',S.who);S.menu=false;S.sel=null;S.filter='all';S.view='list';renderLayer();render()},
 admtoggle:async b=>{if(S.role!=='owner')return;const id=b.dataset.v;const adm=(S.admins||[]).find(a=>a.user_id===id);b.disabled=true;
  const {error}=adm?await SB.from('admins').delete().eq('user_id',id):await SB.from('admins').insert({user_id:id,role:'admin'});
  if(error){toast('Impossible : '+error.message);b.disabled=false;return}
  const {data}=await SB.from('admins').select('user_id,role');S.admins=data||[];toast(adm?'Droits admin retirés':'Droits admin donnés');renderLayer()},
 calx:()=>{S.calMsg=null;renderNotesOnly()},
 cal:b=>{const p=S.P.get(b.dataset.id);const a=p?.actions?.find(x=>x.id===b.dataset.a);if(a)addToCal(p,a,b.dataset.v)},
 closem:(b,e)=>{if(e.target!==b&&!b.matches('button'))return;const tk=$('#tt-key');if(tk&&S.menu&&tk.value.trim()!==(S.settings.tomtomKey||'')){S.settings.tomtomKey=tk.value.trim();saveSettings()}const ca=$('#cal-auto');if(ca&&S.menu&&ca.checked!==(S.settings.calAuto!==false)){S.settings.calAuto=ca.checked;saveSettings()}const cr2=$('#cal-rappel');if(cr2&&S.menu&&cr2.checked!==(S.settings.calRappel!==false)){S.settings.calRappel=cr2.checked;saveSettings()}const o=$('#obj');if(o&&S.menu){const n=parseInt(o.value);if(n>0&&n!==S.settings.objectif){S.settings.objectif=n;saveSettings();if(S.view==='today')renderToday()}}if(S.menu&&$('#wh-0a')){const h=[0,1].map(i=>[$('#wh-'+i+'a')?.value,$('#wh-'+i+'b')?.value]).filter(x=>x[0]&&x[1]&&hm(x[0])<hm(x[1]));if(h.length&&JSON.stringify(h)!==JSON.stringify(workHours())){S.settings.hours=h;saveSettings()}}
  S.menu=false;S.help=false;S.importing=false;S.fimpOpen=false;renderLayer()},
 fimpopen:()=>{S.menu=false;S.importing=false;S.fimpOpen=true;if(S.fimp?.run?.end)S.fimp=null;renderLayer()},
 fimpsrc:b=>{S.fimp.src=b.dataset.v;renderLayer()},
 fimpsheet:b=>{fimpSheet(S.fimp,+b.dataset.v);renderLayer()},
 fimpreset:()=>{S.fimp={src:S.fimp?.src};renderLayer()},
 fimpgo:()=>fimpRun(),
 fimpstop:()=>{if(S.fimp?.run)S.fimp.run.stop=true},
 fimpsee:()=>{S.fimpOpen=false;S.fimp=null;S.filter='batch';S.view='list';S.q='';renderLayer();render()},
 export:()=>exportCsv(),backup:()=>exportBackup(),logout:()=>logout(),install:async()=>{const ev=S.installEvt;if(!ev)return;ev.prompt();await ev.userChoice.catch(()=>{});S.installEvt=null;S.menu=false;renderLayer()},
 authmode:b=>{S.authMode=b.dataset.v;showAuth()},
 eitog:()=>{const a=A();a.ei=!a.ei;lsSet('radar-ei',a.ei);filterAround();renderAround()},
 seed:()=>{seedExamples();S.menu=false;S.view='today';render()},
 delex:()=>{for(const p of [...S.P.values()])if(p.exemple)removeProspect(p.id);if(cur()?.exemple)S.sel=null;render();toast('Exemples supprimés')},
};
function readNa(){return{type:S.newAct?.type||$('[data-act="natype"][aria-pressed="true"]')?.dataset.v||'Rappel',date:$('#na-date')?.value||'',heure:$('#na-heure')?.value||'',note:$('#na-note')?.value||''}}
function defOf(dk){return dk.startsWith('c.')?CFIELD[dk.slice(2)]:FIELD[dk]}
function redrawChips(path){const g=$(`.chips[data-group="${CSS.escape(path)}"]`);if(!g)return;const f=defOf(g.dataset.def);g.outerHTML=chipsHtml(f,path,getP(cur(),path),g.dataset.def)}
function copy(text,msg){try{navigator.clipboard.writeText(text).then(()=>toast(msg),()=>fallbackCopy(text,msg))}catch{fallbackCopy(text,msg)}}
function fallbackCopy(text,msg){S.copyText=text;$('#layer').innerHTML=`<div class="modal" data-act="closem"><div><h2>Copie manuelle</h2><p style="margin:0;color:var(--ink-2)">Sélectionne puis copie (Ctrl+C).</p><textarea class="in" style="min-height:220px" id="cpy">${esc(text)}</textarea><button class="btn btn-p" data-act="closem">Fermer</button></div></div>`;$('#cpy').select()}
function tick(){if(!S.call)return;const el=$('#timer');if(el){const s=Math.floor((Date.now()-S.call.t0)/1000);el.textContent=`${pad(Math.floor(s/60))}:${pad(s%60)}`}setTimeout(tick,1000)}

function setStatut(p,k){if(!k)return;const was=p.statut;p.statut=k;if(k==='rdv'&&!p.rdvPrisLe)p.rdvPrisLe=new Date().toISOString();if(was!==k&&k!=='rdv'&&RANK[k]<3&&p.rdvPrisLe&&was==='rdv'){}
}
function addAction(p,a){p.actions=p.actions||[];if(!a.date&&!a.type)return false;
  if(p.actions.some(x=>!x.fait&&x.type===a.type&&x.date===a.date))return false;
  // Une nouvelle relance remplace les rappels ouverts plus anciens
  if(['Rappel','Appel','Visite','Relance'].includes(a.type))p.actions.filter(x=>!x.fait&&['Rappel','Appel','Visite','Relance'].includes(x.type)&&x.date&&a.date&&x.date<=a.date).forEach(x=>{x.fait=true;x.faitLe=new Date().toISOString();x.auto=true});
  p.actions.push({id:rid(),type:a.type||'Rappel',date:a.date||'',heure:a.heure||'',note:a.note||'',fait:false,createdAt:Date.now()});return true}

/* ================= Session d'appels ================= */
function startSession(){const t=iso(today());
  const due=VP().map(p=>({p,a:nextAction(p)})).filter(x=>x.a&&['Appel','Rappel','Relance'].includes(x.a.type)&&x.a.date&&x.a.date<=t).sort((x,y)=>(x.a.date+(x.a.heure||'99'))<(y.a.date+(y.a.heure||'99'))?-1:1).map(x=>x.p.id);
  const fresh=VP().filter(p=>p.statut==='nouveau'&&!due.includes(p.id)&&(p.ent?.tel||p.contacts?.some(c=>c.tel||c.mobile))).map(p=>p.id);
  const q=[...due,...fresh];if(!q.length){toast('Aucun appel à passer : pas de rappel dû ni de fiche « À qualifier » avec numéro.');return}
  S.session={q,i:0};if(S.mode!=='poste'){S.mode='poste'}openFiche(q[0],'ent');toast(`${q.length} appel${q.length>1?'s':''} dans la session`)}
function nextInSession(){const s=S.session;if(!s)return;if(s.i>=s.q.length-1){S.session=null;toast('Session terminée, bravo 👏');renderNotesOnly();return}s.i++;S.call=null;openFiche(s.q[s.i],'ent')}


/* ---------- Horaires de travail ---------- */
const workDay=d=>{let x=new Date(d+'T12:00');while([0,6].includes(x.getDay()))x=addDays(x,1);return iso(x)};
const DEF_HOURS=[['09:00','12:30'],['14:00','17:15']];
const hm=s=>{const [h,m]=String(s||'').split(':').map(Number);return (h||0)*60+(m||0)};const mh=n=>`${pad(Math.floor(n/60))}:${pad(n%60)}`;
function workHours(){const h=S.settings.hours;return Array.isArray(h)&&h.length&&h.every(x=>x[0]&&x[1]&&hm(x[0])<hm(x[1]))?h:DEF_HOURS}
function slotsFor(dur){const out=[];for(const [a,b] of workHours()){for(let t=hm(a);t+dur<=hm(b);t+=30)out.push(mh(t));const last=hm(b)-dur;if(dur&&last>=hm(a)&&!out.includes(mh(last)))out.push(mh(last))}return out}
function inHours(h,dur=0){const t=hm(h);return workHours().some(([a,b])=>t>=hm(a)&&t+dur<=hm(b))}
function fitSlot(h,dur=0){if(!h)return h;if(inHours(h,dur))return h;const t=hm(h);let best=null,bd=1e9;for(const s of slotsFor(dur||30)){const d=Math.abs(hm(s)-t);if(d<bd){bd=d;best=s}}return best||h}
function endWithin(h,dur){const t=hm(h);const r=workHours().find(([a,b])=>t>=hm(a)&&t<hm(b));const e=t+dur;return mh(r?Math.min(e,hm(r[1])):e)}
/* ================= Analyse locale ================= */
const WD={dimanche:0,lundi:1,lun:1,mardi:2,mercredi:3,jeudi:4,jeu:4,vendredi:5,ven:5,samedi:6};
const MN={janvier:1,janv:1,jan:1,fevrier:2,fevr:2,fev:2,mars:3,avril:4,avr:4,mai:5,juin:6,juillet:7,juil:7,aout:8,septembre:9,sept:9,sep:9,octobre:10,oct:10,novembre:11,nov:11,decembre:12,dec:12};
function parseWhen(c,base){let d=null,h='';
  if(/apres[- ]?demain|apdem|apres dem/.test(c))d=addDays(base,2);
  else if(/\b(demain|dem1|2main|dmn)\b/.test(c))d=addDays(base,1);
  else if(/\b(aujourd'?hui|ajd|auj|ce soir|cet aprem|tout a l'heure|ce matin)\b/.test(c))d=base;
  let m;
  if(!d&&(m=c.match(/dans\s+(\d+|un|une|deux|trois|quinze|15)\s*(j\b|jours?|sem\w*|mois)/))){const n={un:1,une:1,deux:2,trois:3,quinze:15}[m[1]]||+m[1];d=m[2].startsWith('m')?new Date(base.getFullYear(),base.getMonth()+n,base.getDate()):addDays(base,m[2].startsWith('s')?7*n:n)}
  if(!d&&/(semaine|sem|sm)\s*(pro|prochaine|suiv)/.test(c)){d=addDays(base,((8-base.getDay())%7)||7)}
  if(!d&&/fin\s*(de\s*)?(la\s*)?(semaine|sem)\b/.test(c)){d=addDays(base,(5-base.getDay()+7)%7||0)}
  if(!d&&/fin\s*(du\s*)?mois/.test(c)){d=new Date(base.getFullYear(),base.getMonth()+1,0);while(!(d.getDay()%6))d=addDays(d,-1)}
  if(!d&&/debut\s*(du\s*)?mois/.test(c)){d=new Date(base.getFullYear(),base.getMonth()+1,1);while(!(d.getDay()%6))d=addDays(d,1)}
  if(!d&&(m=c.match(/\b(lundi|lun|mardi|mercredi|jeudi|jeu|vendredi|ven|samedi|dimanche)\b/))){const w=WD[m[1]];let k=(w-base.getDay()+7)%7;if(k===0)k=7;d=addDays(base,k)}
  if(!d&&(m=c.match(/(?:^|[^\d])(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?(?!\d)/))){const dd=+m[1],mm=+m[2];if(mm>=1&&mm<=12&&dd>=1&&dd<=31){let y=m[3]?(+m[3]<100?2000+ +m[3]:+m[3]):base.getFullYear();let x=new Date(y,mm-1,dd);if(!m[3]&&x<base)x=new Date(y+1,mm-1,dd);d=x}}
  if(!d&&(m=c.match(/\b(\d{1,2})\s*(janvier|janv|jan|fevrier|fevr|fev|mars|avril|avr|mai|juin|juillet|juil|aout|septembre|sept|sep|octobre|oct|novembre|nov|decembre|dec)\b/))){let x=new Date(base.getFullYear(),MN[m[2]]-1,+m[1]);if(x<base)x=new Date(base.getFullYear()+1,MN[m[2]]-1,+m[1]);d=x}
  if(!d&&(m=c.match(/\b(?:le|lundi|mardi|mercredi|jeudi|vendredi)\s+(\d{1,2})\b(?!\s*(?:h|postes?|pc|pers|salari|copieurs?|lignes?|%|ans))/))){const n=+m[1];if(n>=1&&n<=31){let x=new Date(base.getFullYear(),base.getMonth(),n);if(x<base)x=new Date(base.getFullYear(),base.getMonth()+1,n);d=x}}
  if((m=c.match(/(?:^|[^\d])([01]?\d|2[0-3])\s*(?:h(?![a-z])|:)\s*([0-5]\d)?(?!\s*\/)/)))h=`${pad(+m[1])}:${m[2]||'00'}`;
  else if(/aprem|apres[- ]midi|\bapm\b/.test(c))h='14:00';else if(/\bmatin\b|\bmat\b/.test(c))h='09:30';else if(/\bmidi\b/.test(c))h='12:00';else if(/\bsoir\b|fin de journee/.test(c))h='17:00';
  if(!d&&!h)return null;if(!d)d=base;return{date:iso(d),heure:h}}
function parseMonth(c){let m=c.match(/(?:^|[^\d])(\d{1,2})[\/.-](\d{2,4})(?!\d)/);if(m&&+m[1]>=1&&+m[1]<=12){const y=+m[2]<100?2000+ +m[2]:+m[2];return `${y}-${pad(+m[1])}`}
  m=c.match(/\b(janvier|janv|jan|fevrier|fevr|fev|mars|avril|avr|mai|juin|juillet|juil|aout|septembre|sept|sep|octobre|oct|novembre|nov|decembre|dec)\b\.?\s*(\d{2,4})?\b/);if(m){let y=m[2]?(+m[2]<100?2000+ +m[2]:+m[2]):new Date().getFullYear();return `${y}-${pad(MN[m[1]])}`}
  m=c.match(/\b(20\d{2})\b/);if(m)return `${m[1]}-${/debut/.test(c)?'01':'12'}`;return''}
const TOPIC={
 impr:/(couleur|copieur|photocop|imprim|impression|mfp|multifonction|toner|canon|ricoh|konica|minolta|sharp|xerox|kyocera|toshiba|lexmark|epson|\bscan|ged\b|leasing|loueur|grenke|leasecom|locam|cout copie|coul\b|n&b|noir et blanc)/,
 cyber:/(cyber|antivirus|anti-virus|\bav\b|pare-?feu|firewall|\bfw\b|sauvegarde|backup|\bsvg\b|\bsauv\b|mfa|2fa|double auth|phishing|hameconn|ransom|rancon|pirat|hack|virus|securite|rgpd|edr|fortinet|stormshield|bitdefender|eset|kaspersky|avast|sophos)/,
 tel:/(telephon|standard|pabx|ipbx|\btel\b|\btelep|lignes?\b|forfait|mobiles?\b|portables?\b|operateur|\bop\b|fibre|adsl|vdsl|\bbox\b|internet|\b4g|\b5g|orange|\bsfr|bouygues|bytel|\bfree\b|teams phone|3cx|engagement)/,
 it:/(informatique|\binfo\b|\bit\b|postes?\b|\bpc\b|ordis?\b|ordinateur|serveur|\bnas\b|reseau|wifi|wi-fi|switch|cablage|presta|infogerance|infogere|maintenance|office|m365|o365|microsoft|365|logiciel|cloud|onedrive|sharepoint|vpn|teletravail|parc)/};
const INTEREST=/(besoin|interess|\bint\b|veut|veul|voudrai|audit|souhait|cherche|projet|a revoir|changer|renouvel|remplac|refaire|amelior|pas content|insatisf|mecontent|marre|galere|probleme|souci|lent|trop cher|cher\b|ok pour|ouvert|curieu|devis)/;
const INSAT=/(pas content|pas satisf|insatisf|mecontent|marre|galere|nul\b|pas reactif|lent|trop cher|probleme|souci|plaint|plaign|deçu|decu|sature|rame|catastroph|horrible|pas top|bof bof)/;
const MID=/\b(moyen|moyennement|bof|mouais|sans plus|correct)\b/;
const SAT=/(\bsatisfait|content|ca va bien|rien a dire|tres bien|ras\b)/;
function fonctionNear(text,i,len){const a=text.slice(i+len).split(/[,.;\n]/)[0].slice(0,45),b=text.slice(0,i).split(/[,.;\n]/).pop().slice(-30);return fonctionOf(norm(a))||fonctionOf(norm(b))}
function fonctionOf(c){
 if(/\b(pdg|president|gerant|gerante|dirigeant|dirigeante|patron|patronne|boss|fondateur|fondatrice)\b/.test(c))return'Dirigeant / gérant';
 if(/\b(dg|directeur general|directrice generale|direction generale)\b/.test(c))return'DG';
 if(/\b(directeur|directrice)\b(?!\s+(financier|financiere|administratif|administrative|commercial|commerciale|technique|informatique|des operations|rh|marketing))/.test(c))return'DG';
 if(/\b(daf|directeur financier|directrice financiere|raf|comptable)\b/.test(c))return'DAF';
 if(/\b(dsi|resp(?:onsable)?\.?\s*(?:it|info\w*)|informaticien|admin sys|it manager)\b/.test(c))return'DSI / resp. IT';
 if(/\b(office manager|office mgr|\bom\b)\b/.test(c))return'Office manager';
 if(/\b(assistante?|secretaire|accueil|standardiste|hotesse)\b/.test(c))return'Assistante / accueil';
 if(/\b(drh|rh|ressources humaines)\b/.test(c))return'Resp. RH';
 if(/\b(resp(?:onsable)?\.?\s*(?:ops|operations)|directeur des operations)\b/.test(c))return'Resp. opérations';
 if(/\b(associe|associee)\b/.test(c))return'Associé';
 const m=c.match(/\b(notaire|avocate?|architecte|medecin|docteur|expert[- ]comptable|kine|dentiste|pharmacien|agent general)\b/);if(m)return m[1][0].toUpperCase()+m[1].slice(1);
 return''}
const DECIDE=new Set(['Dirigeant / gérant','DG','DAF','DSI / resp. IT','Associé','Notaire','Avocat','Avocate','Architecte','Medecin','Docteur','Agent general']);
const SMALL=new Set(['sur','sous','de','du','des','la','le','les','en','et','lès','d','l']);
function capName(s){return s.split(/\s+/).map((w,wi)=>w.split('-').map((x,xi)=>!x?x:(wi+xi>0&&SMALL.has(x.toLowerCase()))?x.toLowerCase():x[0].toUpperCase()+x.slice(1).toLowerCase()).join('-')).join(' ')}
function effBucket(n){return n<=5?'1–5':n<=10?'6–10':n<=19?'11–19':n<=49?'20–49':n<=99?'50–99':n<=249?'100–249':'250 +'}


/* ---------- Normalisation des notes : raccourcis et fautes de frappe ---------- */
const ABBR={dem:'demain',dmn:'demain',dm1:'demain','2m1':'demain',dem1:'demain',ajd:"aujourd'hui",auj:"aujourd'hui",pr:'pour',tt:'tout',ts:'tous',tjr:'toujours',tjrs:'toujours',tjs:'toujours',qd:'quand',bcp:'beaucoup',pb:'probleme',pbm:'probleme',pblm:'probleme',pbs:'problemes',prob:'probleme',ds:'dans',avt:'avant',apr:'apres',ac:'avec',avc:'avec',c:"c'est",g:"j'ai",jsp:'ne sait pas',nsp:'ne sait pas',mtn:'maintenant',rdz:'rdv',rv:'rdv',ordi:'ordinateur',ordis:'ordinateurs',ordo:'ordinateur',ordos:'ordinateurs',pcs:'pc',imp:'imprimante',imps:'imprimantes',photocop:'photocopieur',photocopie:'photocopieur',multif:'multifonction',sauv:'sauvegarde',sauvg:'sauvegarde',svg:'sauvegarde',bkp:'sauvegarde',antivir:'antivirus',fw:'pare-feu',pf:'pare-feu',presta:'prestataire',prestas:'prestataires',prest:'prestataire',prestat:'prestataire',info:'informatique',infos:'informatique',infor:'informatique',tel:'telephone',std:'standard',stand:'standard',ope:'operateur',op:'operateur',mob:'mobiles',mobs:'mobiles',sal:'salaries',sala:'salaries',salar:'salaries',sals:'salaries',perso:'personnes',persos:'personnes',pers:'personnes',pax:'personnes',ppl:'personnes',collab:'collaborateurs',collabs:'collaborateurs',colab:'collaborateurs',colabs:'collaborateurs',empl:'employes',util:'utilisateurs',utils:'utilisateurs',users:'utilisateurs',user:'utilisateurs',ger:'gerant',dirlo:'dirigeant',dirlot:'dirigeant',dirl:'dirigeant',dir:'directeur',dirco:'directeur',boss:'dirigeant',patron:'dirigeant',patronne:'dirigeante',sec:'secretaire',secr:'secretaire',secre:'secretaire',secreta:'secretaire',assist:'assistante',assis:'assistante',compta:'comptable',resp:'responsable',int:'interesse',inter:'interesse',interes:'interesse',insat:'insatisfait',sat:'satisfait',moy:'moyen',loc:'location',locat:'location',leas:'leasing',ctr:'contrat',ctrt:'contrat',cntrt:'contrat',ctrat:'contrat',eng:'engagement',engag:'engagement',engmt:'engagement',doc:'documentation',docs:'documentation',plaq:'plaquette',relan:'relance',rapl:'rappeler',rpl:'rappeler',rapel:'rappeler',rapeler:'rappeler',rapell:'rappeler',rapeller:'rappeler',rappl:'rappeler',rappele:'rappeler',rapelle:'rappelle',rapele:'rappeler',rap:'rappeler',dispo:'disponible',abs:'absent',sem:'semaine',proch:'prochaine',aprem:'apres-midi',apm:'apres-midi',qques:'quelques',qq:'quelques',ste:'societe',soc:'societe',ent:'entreprise',cab:'cabinet',vx:'veux',veu:'veut',ya:'il y a',copi:'copieur',cop:'copieur',coul:'couleur',mfp:'multifonction',ss:'sans',w10:'windows 10',w11:'windows 11',fact:'facture',abo:'abonnement',mens:'mensuel',inf:'informatique',infogere:'infogerance',infog:'infogerance',maint:'maintenance',serv:'serveur',rx:'reseau',res:'reseau',cybr:'cyber',secu:'securite',ia:'ia',demat:'dematerialisation',renouv:'renouvellement',ech:'echeance'};
const VOCAB=('imprimante imprimantes copieur copieurs photocopieur photocopieurs photocopieuse photocopieuses multifonction multifonctions scanner scanners toner cartouche cartouches leasing location contrat contrats engagement echeance '+
 'sauvegarde sauvegardes antivirus firewall messagerie securite cybersecurite phishing piratage pirate rancongiciel '+
 'prestataire prestataires informatique informaticien ordinateur ordinateurs portable portables postes poste serveur serveurs reseau wifi cablage maintenance infogerance logiciel logiciels microsoft office outlook onedrive sharepoint '+
 'telephone telephonie telephonique standard standardiste operateur operateurs forfait forfaits mobile mobiles lignes ligne fibre internet orange bouygues abonnement facture '+
 'salaries salarie personnes collaborateurs employes utilisateurs effectif '+
 'gerant gerante dirigeant dirigeante directeur directrice assistante assistant secretaire comptable associe associee responsable president presidente '+
 'interesse interessee interesses interessant interessante satisfait satisfaite insatisfait content contente mecontent probleme problemes souci soucis '+
 'rappeler rappelle rappel relance relancer devis plaquette documentation brochure presentation '+
 'demain semaine prochaine prochain lundi mardi mercredi jeudi vendredi samedi janvier fevrier avril juillet septembre octobre novembre decembre '+
 'canon ricoh konica minolta sharp xerox kyocera toshiba lexmark epson brother grenke leasecom locam defender bitdefender kaspersky sophos fortinet stormshield watchguard '+
 'absent absente disponible reunion conges vacances secteur societe entreprise cabinet bureau bureaux agence demenagement recrutement budget projet changer renouveler renouvellement audit couleur').split(' ');
const VSET=new Set(VOCAB);
const KEEP=new Set(['local','locale','locaux','locales','loyer','plainte','plaignent','plaint','direction','directe','porte','portes','poser','poste','parle','parler','passe','place','sortie','salle','sauve','pense','notre','votre','leurs','autre','autres','entre','avant','apres','encore','toute','toutes','comme','faire','sont','avec','dans','pour','mais','elles','merci','bonne','mardi','mercredi','client','clients','contre','compte','comptes','content','direct','directe','ancien','ancienne','charge','change','chaque','chose','loue','louee','achete','achetee','prete','presse','preste','reste','renouvele','signe','signer','sinon','toujours','jamais','neveu','fille','femme','matin','martin','soir','midi','mail','mails','gmail','teams','zoom','visio','chez','leur','juste','pas','tres','bien']);
function dl(a,b,max){const m=a.length,n=b.length;if(Math.abs(m-n)>max)return max+1;let prev2=null,prev=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){const cur=[i];let best=i;for(let j=1;j<=n;j++){let v=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));if(prev2&&i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])v=Math.min(v,prev2[j-2]+1);cur.push(v);if(v<best)best=v}
    if(best>max)return max+1;prev2=prev;prev=cur}return prev[n]}
const FIXC=new Map();
function fixWord(w){if(ABBR[w]!=null)return ABBR[w];if(w.length<5||VSET.has(w)||KEEP.has(w)||/\d/.test(w))return w;if(FIXC.has(w))return FIXC.get(w);
  const max=w.length>=9?2:1;let best=w,bs=1e9;for(const v of VOCAB){if(v[0]!==w[0]||v.length<5)continue;const d=dl(w,v,max);if(d>max)continue;const sc=d*10-(w.startsWith(v)||v.startsWith(w)?3:0)+Math.abs(v.length-w.length);if(sc<bs){bs=sc;best=v}}
  const r=best;FIXC.set(w,r);return r}
function canon(s){const t=norm(s);return t.replace(/[a-z0-9][a-z0-9'-]*/g,(tok,i)=>{if(/(?:^|[^a-z])(?:mr|mme|m|monsieur|madame|mlle|dr|me|docteur|maitre)\.?\s+$/.test(t.slice(Math.max(0,i-12),i)))return tok;
  return tok.split("'").map((x,k,a)=>k<a.length-1&&x.length<=2?x:x.split('-').map(fixWord).join('-')).join("'")})}
const PN_FILL=new Set(['informatique','info','it','telecom','telecoms','telephonie','impression','copieur','copieurs','cyber','securite','actuel','actuelle','actuellement','qui','s','appelle','appel','apelle','appele','s\'appelle','c','cest','c\'est','est','nomme','societe','la','le','l','de','du','d','boite','entreprise','un','une','leur','son','sa',':','=','-','(','c\'est','se','nom','=>','->','ste']);
const PN_NOT=new Set(['nul','nulle','top','bien','cher','chers','lent','lents','content','contents','satisfait','satisfaits','insatisfait','moyen','reactif','pas','plus','tres','trop','depuis','que','mais','et','ou','en','a','au','avec','pour','sur','toujours','jamais','bof','ok','rien','aucun','deja','depuis','mal','super','genial','cool','correct','qui','ils','elle','il','on','vient','viennent','passe','passent','fait','font','gere','s\'occupe']);
const PN_CONT=new Set(['informatique','info','conseil','services','service','solutions','solution','systemes','systeme','bureautique','telecom','telecoms','reseaux','reseau','groupe','france','it','tech','technologies','sas','sarl','digital','numerique','office','pro','consulting','net','network','networks','&','and','et']);
function prestaNames(text){const out=[];const toks=[...text.matchAll(/[A-Za-zÀ-ÿ0-9][\wÀ-ÿ&'’.-]*|[(:=]/g)].map(m=>({t:m[0].replace(/[.’]+$/,'').replace('’',"'"),i:m.index}));
  for(let k=0;k<toks.length;k++){const w=fixWord(norm(toks[k].t));let trig=/^(prestataire|prestataires|fournisseur|informaticien)$/.test(w)?w:'';
    if(!trig&&/^(infogere|infogeres|gere|geres|maintenu|maintenus)$/.test(w)&&norm(toks[k+1]?.t)==='par'){trig='par';k++}
    if(!trig)continue;const before=norm(text.slice(Math.max(0,toks[k].i-40),toks[k].i));if(/(pas|aucun|sans)\s+(de\s+|d')?\s*$/.test(before))continue;
    let j=k+1;const ctx=[];while(j<toks.length&&(PN_FILL.has(norm(toks[j].t))||/^(s'?)?ap+e?l+e?s?$|^nomm?ee?s?$/.test(norm(toks[j].t)))&&j-k<8){ctx.push(norm(toks[j].t));j++}
    const seg=text.slice(toks[k].i,toks[j]?.i??text.length);if(/[,;.\n)]/.test(seg.slice(toks[k].t.length)))continue;
    const name=[];while(j<toks.length&&name.length<4){const t=toks[j].t,nt=norm(t);const gap=name.length?text.slice(toks[j-1].i+toks[j-1].t.length,toks[j].i):'';if(name.length&&/[,;.\n()]/.test(gap))break;
      if(!name.length){if(PN_NOT.has(nt)||(VSET.has(nt)&&!/^[A-Z]/.test(t))||nt.length<2||/^[(:=]$/.test(t))break;name.push(t);j++;continue}
      if(/^[A-Z0-9&]/.test(t)||PN_CONT.has(nt)){name.push(t);j++}else break}
    while(name.length&&['et','and','&'].includes(norm(name.at(-1))))name.pop();
    if(!name.length)continue;const ctxs=norm(text.slice(Math.max(0,toks[k].i-50),toks[k].i))+' '+ctx.join(' ');
    const dom=/copieur|impression|imprim|photocop|toner/.test(ctx.join(' '))?'impr':/telecom|telephon|standard/.test(ctx.join(' '))?'tel':/cyber|securite/.test(ctx.join(' '))?'cyber':/informatique|info|\bit\b/.test(ctx.join(' '))?'it':
      trig==='fournisseur'?(/telephon|telecom|operateur/.test(ctxs)?'tel':'impr'):/copieur|impression|imprim|photocop/.test(ctxs)&&!/informati|\bpc\b|ordinateur/.test(ctxs)?'impr':/telephon|telecom|standard/.test(ctxs)?'tel':/cyber|securite|antivirus/.test(ctxs)?'cyber':'it';
    const nm=name.join(' ').replace(/^\w/,c=>c.toUpperCase());if(!out.some(x=>x.dom===dom))out.push({dom,name:nm})}
  return out}
function parseLocal(text,p){
  const out={set:{},contacts:[],actions:[],statut:'',temperature:''};const S_=out.set;const add=(k,v)=>{if(FIELD[k].t==='multi'){S_[k]=[...(S_[k]||[]),...[].concat(v)]}else S_[k]=v};
  const n=canon(text);const base=today();
  // Identifiants
  const siret=text.match(/(?<!\d)(\d{3}[\s.]?\d{3}[\s.]?\d{3}[\s.]?\d{5})(?!\d)/);if(siret){const d=siret[1].replace(/\D/g,'');S_['ent.siret']=d;S_['ent.siren']=d.slice(0,9)}
  else{const sr=text.match(/siren\s*:?\s*(\d{3}\s?\d{3}\s?\d{3})(?!\d)/i)||text.match(/(?<![\d+])(\d{3}\s\d{3}\s\d{3})(?![\d\s]*\d{2}\b)/);if(sr)S_['ent.siren']=sr[1].replace(/\D/g,'')}
  const naf=text.match(/\b(\d{2}\.?\d{2}[A-Z])\b/);if(naf)S_['ent.naf']=naf[1].replace(/^(\d{2})(\d{2})/,'$1.$2');
  const emails=[...text.matchAll(/[\w.+-]+@[\w-]+\.[\w.-]+/g)].map(m=>m[0].replace(/[.\-]+$/,''));
  const phones=[...text.matchAll(/(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}/g)].map(m=>({raw:m[0],i:m.index,d:m[0].replace(/\D/g,'').replace(/^33/,'0')}));
  const adr=text.match(/\b(\d{1,4}(?:\s?(?:bis|ter))?,?\s+(?:rue|avenue|av\.?|bd|boulevard|place|pl\.|all[ée]e|chemin|quai|impasse|route|cours|square|villa|passage)\s+[^,\n\d]{2,60})/i);if(adr)S_['ent.adresse']=adr[1].trim();
  const cpv=text.match(/\b((?:0[1-9]|[1-8]\d|9[0-5]|2[AB])\d{3})\s+([A-ZÀ-Ÿ][A-Za-zÀ-ÿ'’ -]{1,38}?)(?=$|[\n,;.]|\s{2}|\s+(?:France|tel|tél|Tél|\d))/m);if(cpv){S_['ent.cp']=cpv[1];S_['ent.ville']=capName(cpv[2].trim())}
  else{const vm=n.match(/\b(asnieres|colombes|gennevilliers|clichy|levallois|courbevoie|bois-colombes|bois colombes|la garenne-colombes|la garenne|nanterre|puteaux|neuilly|villeneuve-la-garenne|saint-ouen|paris|la defense|rueil|suresnes|boulogne|issy)\b/);if(vm&&/\b(a|sur|asnieres|bureaux|cabinet|agence|situe|ville)\b/.test(n))S_['ent.ville']={asnieres:'Asnières-sur-Seine','bois colombes':'Bois-Colombes','la garenne':'La Garenne-Colombes','la defense':'La Défense',neuilly:'Neuilly-sur-Seine',rueil:'Rueil-Malmaison',boulogne:'Boulogne-Billancourt',issy:'Issy-les-Moulineaux'}[vm[1]]||capName(vm[1])}
  const forme=text.match(/\b(SASU|SAS|SARL|EURL|SELARL|SCP|SCI|SA)\b/);if(forme)S_['ent.forme']=forme[1];
  const web=text.match(/\b((?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.(?:fr|com|net|eu|org|paris)(?:\/\S*)?)\b/i);if(web&&!web[1].includes('@')&&!emails.some(e=>e.includes(web[1])))S_['ent.site']=web[1];
  // Secteur
  const sect=[[/notair|etude notariale|office notarial/,'Notaire / juridique'],[/avocat|cabinet d'avocat/,'Avocat'],[/expert[- ]?compta|cabinet compta|\bec\b/,'Expert-comptable'],[/medic|medecin|\bkine|dentist|infirmi|cabinet medical|osteo|orthophon|radiolog|\blabo\b|laboratoire/,'Médical / paramédical'],[/recrutement|interim|cabinet rh|conseil|consulting/,'Conseil / RH / recrutement'],[/architect/,'Architecte'],[/agence immo|immobili/,'Agence immobilière'],[/assuran|agent general|courtier/,'Assurance'],[/\bbtp\b|plomb|electricien|maconn|menuis|batiment|renovation/,'BTP / artisan'],[/association|asso\b/,'Association'],[/restaurant|hotel|brasserie/,'Restauration / hôtellerie'],[/transport|logistiq/,'Transport / logistique']];
  const PN=prestaNames(text);const nS=PN.reduce((a,x)=>a.split(norm(x.name)).join(' '),n);
  if(!p.ent?.secteur)for(const [re,l] of sect)if(re.test(nS)){S_['ent.secteur']=l;break}
  for(const x of PN){S_[x.dom+'.aPresta']='Oui';S_[x.dom+'.prestataire']=x.name}
  for(const [dom,re] of [['it',/(pas|aucun|sans|0)\s+(de\s+|d')?prestataires?(\s+(informatique|it))?\b|personne (ne )?(s'occupe|gere) (de )?l'informatique|c'est (son|sa|leur|le) (neveu|fils|fille|cousin|mari|femme)/],['impr',/(pas|aucun|sans)\s+(de\s+)?(fournisseur|prestataire)\s+(copieur|impression)/],['tel',/(pas|aucun|sans)\s+(de\s+)?prestataire\s+(telecom|telephonie|telephone)/],['cyber',/(pas|aucun|sans)\s+(de\s+)?prestataire\s+(cyber|securite)/]])if(re.test(n)&&!S_[dom+'.aPresta'])S_[dom+'.aPresta']='Non';
  if(!S_['it.aPresta']&&/\b(ont|a|avec|travaille avec|deja)\s+(un|une|leur|des|deja un)\s+prestataires?\b(?!\s+(copieur|impression|telecom|telephon|cyber))/.test(n)&&!/(pas|aucun|sans)\s+(de\s+)?prestataire/.test(n))S_['it.aPresta']='Oui';
  // Effectif / postes
  let m;
  if((m=n.match(/(\d+)\s*(?:salaries?|sal\b|personnes|pers\b|collab\w*|employes?|users?|utilisateurs?|ppl|gens|agents|negociateurs|avocats|notaires|medecins|associes|clercs|comptables|consultants)\b/))||(m=n.match(/\b(?:ils|elles|ils?|on)\s+(?:sont|est|etaient)\s+(?:a\s+|une?\s+equipe\s+de\s+|environ\s+|~\s*)?(\d+)\b(?!\s*(?:h\b|ans|%|€|postes?|pc|ordinateurs?|copieurs?|imprimantes?|lignes?))/))||(m=n.match(/\b(?:equipe|effectif|taille)\s*(?:de|:|=)?\s*(\d+)\b/))){const k=+m[1];if(k>0&&k<5000){S_['it.utilisateurs']=k;S_['ent.effectif']=effBucket(k)}}
  if((m=n.match(/(\d+)\s*(?:postes?\b(?!\s*tel)|pc\b|ordis?\b|ordinateurs?|laptops?|portables? (?:pc|informatique))/)))S_['it.postes']=+m[1];
  if((m=n.match(/(\d+)\s*(?:copieurs?|photocop\w*|mfp|multifonctions?)/)))S_['impr.nb']=+m[1];else if((/\b(un|1|le|leur|une|la)\s+(copieur|photocop|multifonction)/.test(n)||/\bcopieur\s+(canon|ricoh|konica|minolta|sharp|xerox|kyocera|toshiba|lexmark|epson|hp|brother)/.test(n))&&!/copieurs|photocopieurs/.test(n))S_['impr.nb']=1;
  if((m=n.match(/(\d+)\s*imprimantes?/))||(m=n.match(/imprimantes?[^.,;\d]{0,25}?\(?\s*(?:env\.?|environ|~|une?)?\s*(\d+)\b(?!\s*(?:h|ans|%|€|pages?))/)))S_['impr.nbImprimantes']=+m[1];
  if((m=n.match(/(\d[\d\s]{1,6})\s*(?:pages?|copies|pp)\s*(?:\/|par)?\s*(?:mois|m\b)?\s*(?:en\s*)?(coul\w*|n&b|nb|noir)?/))){const v=+m[1].replace(/\s/g,'');if(m[2]&&/coul/.test(m[2]))S_['impr.volCoul']=v;else S_['impr.volNB']=v}
  // Par proposition
  const clauses=text.split(/\n|;|,(?!\d)|\.(?!\d)|\s[-–—]\s|\s\/\s|\s\+\s/).map(s=>s.trim()).filter(Boolean);
  const besoins=new Set(),decl=new Set();let lastTopic='';
  for(const raw of clauses){const c=canon(raw);
    const topics=Object.keys(TOPIC).filter(t=>TOPIC[t].test(c));const topic=topics[0]||'';
    const interest=INTEREST.test(c)&&!/pas de (projet|besoin)|aucun (projet|besoin)|pas interess/.test(c),insat=INSAT.test(c),sat=!insat&&SAT.test(c);
    // Impression
    if(topics.includes('impr')){
      const brands=[['canon','Canon'],['ricoh','Ricoh'],['konica|minolta','Konica Minolta'],['sharp','Sharp'],['xerox','Xerox'],['kyocera','Kyocera'],['toshiba','Toshiba'],['\\bhp\\b','HP'],['brother','Brother'],['epson','Epson'],['lexmark','Lexmark']].filter(([r])=>new RegExp(r).test(c)).map(x=>x[1]);
      if(brands.length)add('impr.marques',brands);
      if(/leasing|location|\bloue|\blld\b|\bloc\b|loyer|grenke|leasecom|locam/.test(c))S_['impr.mode']='Location / leasing';else if(/achete|achat|proprietaire|a eux/.test(c))S_['impr.mode']='Achat';
      const l=c.match(/\b(grenke|leasecom|locam|franfinance|bnp)\b/);if(l)S_['impr.loueur']={grenke:'Grenke',leasecom:'Leasecom',locam:'Locam',franfinance:'Franfinance',bnp:'BNP Paribas Leasing'}[l[1]];
      const irr=[[/panne|bourr|plante/,'Pannes'],[/delai|attend|long a venir|technicien/,"Délais d’intervention"],[/cher|cout|prix|facture/,'Coût'],[/toner|cartouche/,'Toner'],[/scan/,'Scan compliqué'],[/commercial (absent|jamais)|jamais vu|aucun suivi/,'Commercial absent']].filter(([r])=>r.test(c)).map(x=>x[1]);
      if(insat&&irr.length)add('impr.irritants',irr);
      if(/ged|dematerialis|archiv/.test(c))add('impr.ged',/archiv\w* papier|papier/.test(c)?'Archivage papier':/ged/.test(c)&&!/pas de ged|aucune ged/.test(c)?'GED en place':'Aucune');
      if(/signature electro|docusign|yousign/.test(c))add('impr.ged','Signature électronique');
    }
    // Fin de contrat / engagement
    if(/fin\s*(?:de\s*|du\s*|d'\s*)?(?:contrat|leasing|loc\w*|engagement|ctr|ctrt|bail)|\bfin\s+(?:en\s+|le\s+)?(?=\d|janv|fev|mars|avr|mai|juin|juil|aout|sept|oct|nov|dec|debut)|termine en|se termine|echeance|expire|jusqu'?\s*(?:en|a|au|fin)?\s*(?=\d|janv|fev|mars|avr|mai|juin|juil|aout|sept|oct|nov|dec)/.test(c)){const mo=parseMonth(c.replace(/.*?(fin|termine|echeance|expire|jusqu'?)/,''));if(mo){if(topics.includes('tel')&&!topics.includes('impr'))S_['tel.finEngagement']=mo;else if(topics.includes('impr')||lastTopic==='impr'||!topics.length)S_['impr.finContrat']=mo;else if(topics.includes('tel'))S_['tel.finEngagement']=mo;decl.add('Fin de contrat')}}
    // Cyber
    if(topics.includes('cyber')){
      if(/(pas|aucun|sans|0)\s*(d'?|de\s)?(antivirus|anti-virus|av\b)/.test(c))add('cyber.antivirus','Aucun');
      const av=[['defender','Windows Defender'],['bitdefender','Bitdefender'],['eset','ESET'],['kaspersky','Kaspersky'],['sophos','Sophos'],['sentinel','SentinelOne'],['withsecure|f-secure','WithSecure'],['avast|avg','Avast / AVG'],['norton','Norton'],['mcafee','McAfee'],['trend','Trend Micro']].filter(([r])=>new RegExp(r).test(c)&&!(r==='sophos'&&/(pare-?feu|firewall|fw)/.test(c))).map(x=>x[1]);if(av.length)add('cyber.antivirus',av);
      if(/(pas|aucun|sans)\s*(de\s)?(pare-?feu|firewall|fw)/.test(c))S_['cyber.firewall']='Aucun (box opérateur)';
      const fw=c.match(/\b(fortinet|fortigate|stormshield|watchguard|meraki|sonicwall)\b/);if(fw)S_['cyber.firewall']={fortinet:'Fortinet',fortigate:'Fortinet',stormshield:'Stormshield',watchguard:'WatchGuard',meraki:'Cisco Meraki',sonicwall:'SonicWall'}[fw[1]];
      if(/(pas|aucune?|sans|0)\s*(de\s)?(sauvegarde|backup|svg|sauv)/.test(c))add('cyber.sauvegarde','Aucune');
      else{if(/disque|dd ext|cle usb|\bdd\b/.test(c))add('cyber.sauvegarde','Disque externe');if(/\bnas\b/.test(c)&&/(sauv|backup|svg)/.test(c))add('cyber.sauvegarde','NAS');if(/(sauv|backup|svg).{0,20}cloud|cloud.{0,20}(sauv|backup)/.test(c))add('cyber.sauvegarde','Cloud')}
      if(/(pas|sans)\s*(de\s)?(mfa|2fa|double auth)/.test(c))S_['cyber.mfa']='Non';else if(/mfa|2fa|double auth/.test(c))S_['cyber.mfa']='Oui';
      if(/phishing|hameconn/.test(c))add('cyber.incident','Phishing');if(/ransom|rancon|crypt[eé]/.test(c))add('cyber.incident','Rançongiciel');if(/(mail|messagerie|boite).{0,20}pirat|pirat.{0,20}(mail|messagerie)/.test(c))add('cyber.incident','Messagerie piratée');
      if(/sensibilis|formation cyber/.test(c))S_['cyber.sensibilisation']=/pas|aucune|jamais/.test(c)?'Non':'Oui';
      if(/rgpd/.test(c))S_['cyber.rgpd']=/pas|non|aucun/.test(c)?'Non':/en cours/.test(c)?'En cours':'Conforme';
    }
    if(/(m365|o365|office 365|microsoft 365|outlook|exchange)/.test(c)){add('it.cloud','Microsoft 365');S_['cyber.mails']='Microsoft 365'}
    if(/(google workspace|gsuite|g suite|gmail)/.test(c)){add('it.cloud','Google Workspace');S_['cyber.mails']='Google Workspace'}
    if(/onedrive|sharepoint/.test(c))add('it.cloud','SharePoint / OneDrive');if(/dropbox/.test(c))add('it.cloud','Dropbox');
    // IT
    if(topics.includes('it')){
      if(/serveur/.test(c))add('it.serveur',/(pas|aucun|sans)\s*(de\s)?serveur/.test(c)?'Aucun':/cloud|azure|aws/.test(c)?'Cloud (Azure / AWS)':'Serveur local');
      if(/\bnas\b/.test(c))add('it.serveur','NAS');
      if(/wifi|wi-fi/.test(c)&&/lent|rame|coupe|marche mal|probleme|nul/.test(c))add('it.reseau','Wi-Fi lent');
      if(/cablage|cable/.test(c))add('it.reseau','Câblage à revoir');if(/vpn|teletravail/.test(c))add('it.reseau','VPN télétravail');
      if(/infogerance|infogere|contrat de maintenance/.test(c))S_['it.contrat']='Infogérance';else if(/a la demande|au besoin|quand ca plante|ponctuel/.test(c))S_['it.contrat']='À la demande';else if(/(personne|aucun presta|pas de presta|se debrouill|le fils|neveu|lui[- ]meme)/.test(c))S_['it.contrat']='Personne';else if(/en interne|informaticien interne|(comptable|secretaire|assistante|salarie|associe|dirigeant|gerant)\w* (qui )?(gere|s'occupe|fait)/.test(c))S_['it.contrat']='Interne';
      if(/vieux|ancien|obsolete|windows 7|win 7|plus de 5 ans|>\s*5 ans/.test(c))S_['it.age']='> 5 ans';else if(/recent|neuf|renouvele/.test(c))S_['it.age']='< 3 ans';
    }
    // Télécom
    if(topics.includes('tel')){
      const ops=[['orange','Orange'],['\\bsfr','SFR'],['bouygues|bytel','Bouygues'],['\\bfree\\b','Free Pro'],['\\bovh','OVH'],['\\bnordnet','Nordnet']].filter(([r])=>new RegExp(r).test(c)).map(x=>x[1]);if(ops.length)add('tel.operateur',ops);
      if((m=c.match(/(\d+)\s*(?:lignes?\s*)?(?:mobiles?|portables?|forfaits?|gsm)/)))S_['tel.lignesMobiles']=+m[1];
      if((m=c.match(/(\d+)\s*(?:lignes?|postes? tel\w*|numeros)(?!\s*(?:mobiles?|portables?))/)))S_['tel.lignesFixes']=+m[1];
      if(/teams phone|teams tel/.test(c))S_['tel.standard']='Teams Phone';else if(/ipbx|3cx|standard (cloud|virtuel|en ligne)|voip|toip/.test(c))S_['tel.standard']='Standard cloud (IPBX)';else if(/pabx|autocom|standard (physique|vieux|ancien)/.test(c))S_['tel.standard']='Standard physique (PABX)';else if(/(pas|aucun|sans)\s*(de\s)?standard/.test(c))S_['tel.standard']='Aucun';
      if(/fibre/.test(c))add('tel.internet','Fibre');if(/adsl|vdsl|cuivre/.test(c))add('tel.internet','ADSL / VDSL');if(/\b(4g|5g)\b/.test(c)&&/box|routeur|internet/.test(c))add('tel.internet','Box 4G / 5G');if(/lien dedie|fibre dediee|\bfto\b/.test(c))add('tel.internet','Lien dédié');
    }
    if((topics.includes('tel')||/facture|abonnement|par mois|\/mois|mensuel/.test(c))&&!topics.includes('impr')&&(m=raw.match(/(\d[\d\s]{1,5})\s*(?:€|eur\b|euros)/i))&&(topics.includes('tel')||lastTopic==='tel'||/telephon|forfait|ligne|internet/.test(n)))S_['tel.facture']=m[1].replace(/\s/g,'')+' €/mois';
    // Satisfaction par domaine
    const dom=topics.find(t=>['impr','it','tel'].includes(t))||(insat||sat||MID.test(c)?lastTopic:'');
    const mid=!insat&&MID.test(c);const aboutNet=dom==='it'&&/wifi|reseau|internet|connexion|cablage/.test(c)&&!/prestataire|informaticien|maintenance|support|infogerance/.test(c);
    if(aboutNet&&insat&&/wifi|reseau/.test(c))add('it.reseau','Wi-Fi lent');
    if(dom&&!aboutNet&&(insat||sat||mid)&&['impr','it','tel'].includes(dom)){S_[dom+'.satisfaction']=insat?'Insatisfait':mid?'Moyen':'Satisfait';if(insat)decl.add('Insatisfaction prestataire')}
    // Besoins
    if(interest||insat){const tps=topics.length?topics:/audit/.test(c)?[TOPIC.cyber.test(n)?'cyber':'it']:lastTopic?[lastTopic]:[];for(const t of tps){
      if(t==='impr')besoins.add(/ged|demat|archiv/.test(c)?'Gestion documentaire':'Impression / copieurs');
      if(t==='cyber')besoins.add(/sauv|backup|svg/.test(c)?'Sauvegarde / PRA':'Cybersécurité');
      if(t==='tel')besoins.add(/fibre|internet|adsl|box/.test(c)?'Internet / fibre':/mobile|forfait|portable/.test(c)?'Mobiles / opérateur':'Téléphonie / standard');
      if(t==='it')besoins.add(/wifi|reseau|cabl/.test(c)?'Réseau / Wi-Fi':/presta|infoger|maintenance|support/.test(c)?'Infogérance / support':/365|office|cloud/.test(c)?'Microsoft 365 / cloud':/serveur/.test(c)?'Serveur':'Parc informatique')}}
    if(/\b(ia|intelligence artificielle|automatis|chatgpt|copilot)\b/.test(c)&&interest)besoins.add('IA / automatisation');
    if(/(pas de sauvegarde|pas de svg|aucune sauvegarde|pas de backup)/.test(c))besoins.add('Sauvegarde / PRA');
    if(/demenag/.test(c))decl.add('Déménagement');if(/recrut|embauch|croissance|grandit|nouveaux? (bureau|locaux)/.test(c))decl.add('Croissance / recrutement');if(/panne|crash|plante/.test(c))decl.add('Panne / incident');if(/ransom|rancon|pirat|attaque|hack/.test(c))decl.add('Cyberattaque');if(/trop cher|economi|reduire.{0,10}cout|baisser/.test(c))decl.add('Réduire les coûts');if(/moderni|digitalis|numeris/.test(c))decl.add('Modernisation');
    if(/urgent|asap|au plus vite|rapidement|vite\b/.test(c))S_['besoins.priorite']='Urgent';
    if(/pas de projet|pas de besoin|rien a changer|aucun besoin/.test(c))S_['besoins.priorite']='Pas de projet';
    if(/decide avec|avec (son|ses|les) associ/.test(c))S_['besoins.decision']='Avec les associés';else if(/(c'?est|decision au|voir avec le) siege|maison mere|groupe decide/.test(c)){S_['besoins.decision']='Siège / groupe';S_['ent.groupe']='Oui'}
    if((m=raw.match(/budget\s*:?\s*([^\s,;].{0,30})/i)))S_['besoins.budget']=m[1].trim();
    // Statut & température
    if(/\brdv\b|rendez[- ]vous|\brdz\b|rdv pris|\brv\b/.test(c)&&!/pas de (rdv|rendez)|refuse|annul/.test(c)){out.statut='rdv';out.temperature=out.temperature||'chaud';const w=parseWhen(c,base);if(w)out.actions.push({type:'RDV',...w,note:raw})}
    else if(/barrage|filtr|bloque|refus\w* de (me )?(passer|transmettre)|veut pas (me )?(passer|transmettre)|ne passe pas/.test(c)){out.statut=out.statut||'rappel'}
    else if(/pas interess|pas int\b|\bpi\b|aucun interet|ne veut pas|pas besoin|\bko\b|refus|raccroch|non merci|pas le temps/.test(c)){out.statut=out.statut||'ko';out.temperature='froid'}
    else if(/\bnrp\b|repondeur|\brep\b|messagerie vocale|\bmsg\b|pas de rep|ne repond pas|injoignable|sonne dans le vide/.test(c)){out.statut=out.statut||'contacte';if(!out.actions.length)out.actions.push({type:'Rappel',date:iso(bizDays(base,1)),heure:'',note:'NRP'})}
    else if(/barrage|filtre|secretaire bloque|veut pas passer/.test(c)){out.statut=out.statut||'rappel'}
    if(/rappel|rapl|rapel|rappeler|recontact|relanc|rapeller|re-?appeler|rappelle|callback|\bcb\b/.test(c)&&!/\b(il|elle) (me |nous )?rappel/.test(c)){const w=parseWhen(c,base);out.statut=out.statut==='rdv'?'rdv':(out.statut||'rappel');out.actions.push({type:/relanc/.test(c)?'Relance':'Rappel',date:w?.date||iso(bizDays(base,2)),heure:w?.heure||'',note:raw})}
    else if(/\b(il|elle) (me |nous )?rappel/.test(c)){const w=parseWhen(c,base);out.actions.push({type:'Relance',date:w?.date||iso(bizDays(base,3)),heure:w?.heure||'',note:'Attend son rappel : '+raw});out.statut=out.statut||'rappel'}
    if(/(envoyer|envoie|env|transmettre|faire suivre)\s*(un\s*|une\s*|la\s*|le\s*|par\s*)?(mail|doc|plaquette|brochure|presentation|infos?)|\bmail\b.*(plaquette|doc)/.test(c)){const w=parseWhen(c,base);out.actions.push({type:'Mail',date:w?.date||iso(base),heure:'',note:raw})}
    if(/repasser|revenir|repasse|passer (sur place|au cabinet|a l'agence|a l'etude|les voir|le voir|la voir|un|lundi|mardi|mercredi|jeudi|vendredi|demain|la semaine)/.test(c)&&!/passer (le|la|l') ?(dg|dirigeant|gerant|directeur|directrice|patron|responsable|ligne|appel)/.test(c)){const w=parseWhen(c,base);out.actions.push({type:'Visite',date:w?.date||iso(bizDays(base,5)),heure:w?.heure||'',note:raw})}
    if(/devis/.test(c)&&/(faire|envoyer|envoi|env\b|preparer|attend|veut|veul|demande|chiffrer)/.test(c)){const w=parseWhen(c,base);out.actions.push({type:'Devis',date:w?.date||iso(bizDays(base,3)),heure:'',note:raw})}
    if(/\bchaud\b|tres interess|motiv|emballe|partant|chaud bouillant/.test(c))out.temperature='chaud';else if(/tiede|a voir|peut[- ]etre|mitige|reflechi/.test(c)&&!out.temperature)out.temperature='tiede';else if(/\bfroid\b|ferme\b|sec\b/.test(c)&&!out.temperature)out.temperature='froid';
    else if(/interess|ouvert|curieu|ok pour/.test(c)&&!/pas interess/.test(c)&&!out.temperature)out.temperature='tiede';
    if(/concurren|deja (avec|chez)|travaille avec|en place chez/.test(c)){const cm=raw.match(/(?:concurrent|avec|chez)\s*:?\s*([A-Z][\w&'’.-]*(?:\s+[A-Z][\w&'’.-]*){0,2})/);if(cm)add('besoins.concurrents',cm[1])}
    if(topic)lastTopic=topic;
  }
  const lg=text.match(/\b(Genapi|iNot|Fiducial|Fichorga|Doctolib|Weda|Crossway|Sage|Cegid|EBP|ACD|Inqom|Pennylane|Secib|Septeo|Kleos|Diapason|Apimo|Hektor|Netty|AC3|Vilogi|Archicad|Revit|AutoCAD|SketchUp|Silae|Batappli|Obat|Julie|Logos)\b/gi);if(lg)S_['it.logiciels']=[...new Set(lg)].join(', ');
  if(besoins.size)add('besoins.sel',[...besoins]);if(decl.size)add('besoins.declencheur',[...decl]);
  // Contacts
  const cRe=/\b(M\.|Mr\.?|Mme|Madame|Monsieur|Mlle|Me|Ma[iî]tre|Dr\.?|Docteur)\s+([A-ZÀ-Ÿ][\wÀ-ÿ'’-]+(?:\s+[A-ZÀ-Ÿ][\wÀ-ÿ'’-]+)?)/g;
  const lowRe=/\b(?:mr|mme|m\.|monsieur|madame)\s+([a-zà-ÿ][a-zà-ÿ'’-]{2,})/gi;
  const found=[];
  for(const mm of text.matchAll(cRe))found.push({civ:/^(Mme|Madame|Mlle)/i.test(mm[1])?'Mme':/^(Me|Ma[iî]tre|Dr|Docteur)/i.test(mm[1])?'':'M.',title:/^(Me|Ma[iî]tre|Dr|Docteur)/i.test(mm[1]),len:mm[0].length,full:mm[2],i:mm.index});
  if(!found.length)for(const mm of text.matchAll(lowRe)){const w=norm(mm[1]);if(['le','la','de','du','est','absent','absente','pas'].includes(w))continue;found.push({civ:/^(mme|madame)/i.test(mm[0])?'Mme':'M.',full:capName(mm[1]),i:mm.index,len:mm[0].length})}
  const STOP=new Set(['le','la','les','l','un','une','accueil','secretaire','standard','standardiste','assistante','assistant','personne','quelqu','gerant','gerante','dg','daf','dsi','pdg','directeur','directrice','rh','drh','lui','elle','eux','son','sa','ses','mon','ma','patron','patronne','boss','office','comptable','associe','associee','mr','mme','monsieur','madame','pas','plus','bon','ok','fils','fille','femme','mari','responsable','resp','dirigeant','dirigeante','notaire','avocat','medecin','docteur','tel','mail','client','eux','nous','tout','rien','des','du','de']);
  const pRe=/\b(?:parl[ée]+\s+(?:a|à|avec)|eu|vu|rencontr[ée]+|interlocut\w*\s*:?|contact\s*:|demander|dmd|s'appelle)\s+([A-Za-zÀ-ÿ][\wÀ-ÿ'’-]+)(\s+[A-ZÀ-Ÿ][\wÀ-ÿ'’-]+)?/gi;
  for(const mm of text.matchAll(pRe)){const w=norm(mm[1]);if(STOP.has(w)||w.length<3||/\d/.test(w))continue;const full=capName(mm[1])+(mm[2]&&mm[2].trim()[0]===mm[2].trim()[0].toUpperCase()?' '+mm[2].trim():'');if(!found.some(f=>norm(f.full).includes(w)))found.push({civ:'',full,i:mm.index,len:mm[0].length})}
  const fRe=/\b(dg|pdg|daf|dsi|drh|g[ée]rante?|dirigeante?|directeur|directrice|office manager|assistante?|secr[ée]taire|associ[ée]e?|comptable)\s*(?:=|:|-|est|c'est)?\s*(?:(M\.|Mr|Mme|Monsieur|Madame)\s+)?([A-ZÀ-Ÿ][a-zà-ÿ'’-]+(?:\s+[A-ZÀ-Ÿ][A-Za-zà-ÿ'’-]+)?)/gi;
  for(const mm of text.matchAll(fRe)){const name=mm[3].replace(/^(Me|Ma[iî]tre|Dr)\s+/,'');if(name[0]!==name[0].toUpperCase())continue;const fn=fonctionOf(norm(mm[1]));const ex=found.find(f=>f.full.includes(name.split(' ')[0]));if(ex){if(fn&&!ex.fn)ex.fn=fn;continue}found.push({civ:mm[2]?(/^(Mme|Madame)/i.test(mm[2])?'Mme':'M.'):/(gerante|dirigeante|directrice|assistante|associee)$/i.test(norm(mm[1]))?'Mme':'',full:name,i:mm.index,fn})}
  for(const f of found){
    const words=f.full.split(/\s+/);if(['Asnières','Paris','Data','Links','Canon','Ricoh','Orange','Jeudi','Lundi','Mardi','Mercredi','Vendredi'].includes(words[0]))continue;
    const ctx=norm(text.slice(0,f.i).split(/[,.;\n]/).pop()+text.slice(f.i).split(/[,.;\n]/)[0]);
    const fn=f.fn||fonctionNear(text,f.i,f.len||f.full.length+6);const c={civ:f.civ};
    if(words.length===1){if(f.civ)c.nom=words[0];else c.prenom=words[0]}else{c.prenom=words[0];c.nom=words.slice(1).join(' ')}
    if(f.civ&&words.length===2&&/^(M\.|Mme)$/.test(f.civ)){c.prenom=words[0];c.nom=words[1]}
    if((f.civ||f.title)&&words.length===1){c.nom=words[0];delete c.prenom}
    if(fn)c.fonction=fn;if(DECIDE.has(fn)||/decid|decisionnaire|c'est (lui|elle) qui (signe|decide)/.test(ctx))c.decideur='Oui';else if(fn==='Assistante / accueil')c.decideur='Non';
    const ph=phones.find(p=>!p.used&&((p.i>=f.i&&p.i-f.i<70)||(p.i<f.i&&f.i-p.i<25&&!/(tel|standard|accueil|fixe)\W*$/i.test(text.slice(Math.max(0,p.i-12),p.i)))));if(ph){if(/^0[67]/.test(ph.d))c.mobile=ph.d;else c.tel=ph.d;ph.used=true}
    const em=emails.find(e=>norm(e.split('@')[0]).includes(norm(words.at(-1)).slice(0,4)));if(em){c.email=em;emails.splice(emails.indexOf(em),1)}
    out.contacts.push(c)}
  if(!out.contacts.length){const fn=fonctionOf(n);if(fn&&/\b(parle|vu|eu|rencontre|contact|interlocut|dg|daf|gerante?|dirigeante?|dsi|directeur|directrice)\b/.test(n)){/* fonction sans nom : on la note */const c={fonction:fn};if(/\b(gerante|dirigeante|directrice|associee)\b/.test(n))c.civ='Mme';if(DECIDE.has(fn))c.decideur='Oui';const ph=phones.find(p=>!p.used&&/^0[67]/.test(p.d));if(ph){c.mobile=ph.d;ph.used=true}out.contacts.push(c)}}
  for(const ph of phones)if(!ph.used){if(!p.ent?.tel&&!S_['ent.tel']&&!/^0[67]/.test(ph.d))S_['ent.tel']=ph.d;else if(/^0[67]/.test(ph.d)&&out.contacts[0]&&!out.contacts[0].mobile)out.contacts[0].mobile=ph.d;else if(!S_['ent.tel']&&!p.ent?.tel)S_['ent.tel']=ph.d}
  if(emails.length){if(out.contacts[0]&&!out.contacts[0].email&&!/^(contact|info|accueil|secretariat|office|bonjour)@/i.test(emails[0]))out.contacts[0].email=emails.shift();if(emails.length)S_['ent.email']=emails[0]}
  return out}

/* ================= Application des résultats ================= */
function coerce(f,v){if(v==null)return null;
  if(f.t==='multi'){const arr=[].concat(v).map(x=>String(x).trim()).filter(Boolean);return arr.map(x=>f.o.find(o=>norm(o)===norm(x))||f.o.find(o=>norm(o).startsWith(norm(x))||norm(x).startsWith(norm(o)))||x)}
  if(f.t==='single'){const x=String(Array.isArray(v)?v[0]:v).trim();if(!x)return null;return f.o.find(o=>norm(o)===norm(x))||f.o.find(o=>norm(o).startsWith(norm(x))&&x.length>2)||x}
  if(f.t==='num'){const n=parseFloat(String(v).replace(/\s/g,'').replace(',','.'));return isFinite(n)?n:null}
  if(f.t==='month'){const s=String(v);const m=s.match(/(\d{4})-(\d{1,2})/);return m?`${m[1]}-${pad(+m[2])}`:(parseMonth(norm(s))||null)}
  if(f.k==='ent.siret'){const d=String(v).replace(/\D/g,'');return d.length===14?d:null}
  if(f.k==='ent.siren'){const d=String(v).replace(/\D/g,'');return d.length===9?d:null}
  if(f.t==='tel'){const d=String(v).replace(/[^\d+]/g,'');return d.length>=10?d.replace(/^\+33/,'0'):String(v)}
  return String(v).trim()}
function applyPatch(p,patch,overwrite){
  const changed=new Set();if(!patch)return[];
  for(const [k,v0] of Object.entries(patch.set||{})){const f=FIELD[k];if(!f)continue;const v=coerce(f,v0);if(!filled(v))continue;const cv=getP(p,k);
    if(f.t==='multi'){let arr=Array.isArray(cv)?cv.slice():[];let ch=false;for(const x of v)if(!arr.some(a=>norm(a)===norm(x))){arr.push(x);ch=true}
      if(arr.some(x=>!EXCL.test(x)))arr=arr.filter(x=>!EXCL.test(x));if(ch){setP(p,k,arr);changed.add(k)}}
    else if(f.t==='area'){const have=new Set(String(cv||'').split('\n').map(nkey));const add=String(v).split('\n').filter(x=>{const k2=nkey(x);if(!k2||have.has(k2))return false;have.add(k2);return true});if(add.length){setP(p,k,cv?cv+'\n'+add.join('\n'):add.join('\n'));changed.add(k)}}
    else if(String(cv??'')===String(v)&&p.est?.[k]){delete p.est[k];changed.add(k)}
    else if(String(cv??'')!==String(v)&&(overwrite||!filled(cv)||p.est?.[k]||/\.prestataire$/.test(k)||['single','num','month'].includes(f.t))){if(k==='ent.secteur'&&filled(cv)&&!overwrite)continue;setP(p,k,v);changed.add(k)}
    if(p.est?.[k]&&changed.has(k))delete p.est[k]}
  if(p.ent?.siret&&!p.ent.siren){p.ent.siren=p.ent.siret.slice(0,9);changed.add('ent.siren')}
  // Contacts
  for(const c0 of (patch.contacts||[])){if(!c0||typeof c0!=='object')continue;const c={};for(const f of CFIELDS){if(c0[f.k]==null||c0[f.k]==='')continue;let v=c0[f.k];if(f.k==='decideur'&&typeof v==='boolean')v=v?'Oui':'Non';v=coerce(f,v);if(filled(v))c[f.k]=v}
    if(!Object.keys(c).length)continue;p.contacts=p.contacts||[];
    const nm=x=>norm(x||'').replace(/\s/g,'');
    let ex=p.contacts.find(x=>(c.nom&&nm(x.nom)===nm(c.nom))||(c.nom&&nm(x.prenom)===nm(c.nom))||(c.prenom&&!c.nom&&nm(x.prenom)===nm(c.prenom))||(c.prenom&&c.nom&&nm(x.prenom)===nm(c.prenom)&&!x.nom)||(c.email&&x.email===c.email)||(!c.nom&&!c.prenom&&c.fonction&&x.fonction===c.fonction));
    if(!ex&&!c.nom&&!c.prenom&&p.contacts.length===1&&!p.contacts[0].fonction)ex=p.contacts[0];
    const i=ex?p.contacts.indexOf(ex):p.contacts.length;if(!ex){ex={id:rid()};p.contacts.push(ex)}
    for(const [k,v] of Object.entries(c))if(!filled(ex[k])||(k==='decideur'&&v==='Oui')){ex[k]=v;changed.add('contacts.'+i+'.'+k)}}
  // Actions
  let nAct=0;for(const a of (patch.actions||[])){if(!a)continue;const type=ATYPES.find(t=>norm(t)===norm(a.type))||'Rappel';let date=/^\d{4}-\d{2}-\d{2}$/.test(a.date||'')?a.date:'';let heure=/^\d{1,2}:\d{2}$/.test(a.heure||'')?a.heure.padStart(5,'0'):'';if(heure)heure=fitSlot(heure,type==='RDV'?60:0);if(date)date=workDay(date);
    if(addAction(p,{type,date,heure,note:String(a.note||'').slice(0,160)})){nAct++;changed.add('actions')}}
  if(patch.statut&&ST[patch.statut]){const k=patch.statut;if(k!==p.statut&&(RANK[k]>RANK[p.statut]||['ko','perdu','gagne'].includes(k)||p.statut==='nouveau')){setStatut(p,k);changed.add('statut')}}
  if(patch.temperature&&['froid','tiede','chaud'].includes(patch.temperature)&&patch.temperature!==p.temperature){p.temperature=patch.temperature;changed.add('temperature')}
  return[...changed]}
function markFlash(paths){for(const k of paths){S.flash.add(k);const top=k.split('.')[0];const tab=top==='contacts'?'contacts':['actions','statut','temperature'].includes(top)?'suivi':top==='besoins'?'besoins':top;if(TABS.some(t=>t.id===tab))S.flash.add('tab:'+tab)}
  setTimeout(()=>{for(const k of paths)S.flash.delete(k)},2500)}
function flashApply(){for(const k of S.flash){if(k.startsWith('tab:'))continue;const el=$(`[data-k="${CSS.escape(k)}"]`);if(el){el.classList.remove('flash-f');void el.offsetWidth;el.classList.add('flash-f')}}}
function describe(changed){const fields=changed.filter(k=>k!=='actions'&&k!=='statut'&&k!=='temperature').length;const parts=[];if(fields)parts.push(`${fields} champ${fields>1?'s':''}`);if(changed.includes('actions'))parts.push('action planifiée');if(changed.includes('statut'))parts.push('statut');return parts.join(' · ')}

/* ================= Analyse des notes ================= */
async function analyze(p,text,{kind='note',journal=null}={}){
  if(!p)return;const before=structuredClone(p);let changed=[];
  if(text){const loc=parseLocal(text,p);if(kind==='note'){const lo=leftovers(text);if(lo.length){loc.set=loc.set||{};loc.set['ent.notes']=lo.join('\n')}}changed=applyPatch(p,loc,kind==='ident')}
  if(journal){p.journal=p.journal||[];p.journal.push(journal)}
  touch(p);markFlash(changed);
  S.aiMsg=changed.length?`Rempli : ${describe(changed)}.`:'Aucune info à ranger détectée : la note est gardée dans l’historique.';
  if(S.sel===p.id){renderFiche();renderNotesOnly()}renderList();
  if(changed.length){S.undo=before;toast(`${displayName(p)} : ${describe(changed)}`,()=>{S.P.set(p.id,before);touch(before);if(S.sel===p.id){renderFiche();renderNotesOnly()}renderList()})}
  return changed}

async function commitNote(p,text,o,ask){
  if(!p)return;const canal=o?(S.mode==='poste'?'tel':'terrain'):'note';
  const j={id:rid(),date:new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,19),canal,issue:o?.l||'',texte:text};
  if(text)j.propre=cleanNote(text);const had=new Set((p.actions||[]).map(a=>a.id));let defAct=null;
  if(S.call&&S.call.id===p.id&&o){const s=Math.floor((Date.now()-S.call.t0)/1000);j.duree=`${pad(Math.floor(s/60))}:${pad(s%60)}`;S.call=null}
  if(o){if(o.statut)setStatut(p,(RANK[o.statut]>=RANK[p.statut]||['ko','perdu'].includes(o.statut)||p.statut==='nouveau')?o.statut:p.statut);if(o.temp)p.temperature=o.temp;
    if(o.a){const n0=(p.actions||[]).length;const date=ask?.date||iso(bizDays(today(),o.a.in));const note=[o.k==='rdv'&&ask?.lieu,o.k==='doc'?'Envoyer la documentation':'',o.l].filter(Boolean)[0];addAction(p,{type:o.a.type,date,heure:ask?.heure||'',note:o.k==='rdv'?`RDV ${ask?.lieu||''}`.trim():note});if(!ask&&(p.actions||[]).length>n0){defAct=p.actions.at(-1);p.actions=p.actions.filter(a=>a!==defAct)}}
    if(o.k==='rdv'&&ask){j.issue=`RDV pris · ${fmtDate(ask.date)}${ask.heure?' '+ask.heure:''}${ask.lieu?' · '+ask.lieu:''}`}}
  lsSet('radar-draft-'+p.id,null);if($('#note-in'))$('#note-in').value='';
  S.ask=null;
  if(text)await analyze(p,text,{kind:'note',journal:j});
  else{p.journal=p.journal||[];p.journal.push(j);touch(p);renderFiche();renderNotesOnly();renderList();toast(`${displayName(p)} : ${j.issue}`)}
  if(defAct){/* action par défaut de l'issue, sauf si la note fixe elle-même un rappel / RDV */
    const fromNote=(p.actions||[]).find(a=>!had.has(a.id)&&!a.fait&&a.date&&['Rappel','RDV','Appel','Relance'].includes(a.type));
    if(fromNote){fromNote.note=cleanClause(fromNote.note||'')||defAct.note;fromNote.explicit=true}
    else if(!p.actions.some(x=>!x.fait&&x.type===defAct.type&&x.date===defAct.date))p.actions.push(defAct)
    touch(p);if(S.sel===p.id){renderFiche();renderNotesOnly()}renderList()}
  calNew(p,had,o,defAct);
  if(o&&S.session&&S.session.q[S.session.i]===p.id)setTimeout(nextInSession,700);
  if(o&&S.mode==='terrain'){S.sheet=false;renderLayer()}}

/* Outlook s'ouvre UNIQUEMENT pour les issues « Rappel demandé » (ici) et « RDV pris » (géré dans askok).
   Toutes les autres issues (NRP, barrage, doc, pas intéressé, échange sans suite…) : rien ne s'ouvre. */
function calNew(p,had,o){if(o?.k!=='rappel')return;
  const a=(p.actions||[]).filter(x=>!had.has(x.id)&&!x.fait&&x.date&&x.type==='Rappel').at(-1);if(!a)return;
  if(S.settings.calRappel!==false)addToCal(p,a);else{S.calMsg={pid:p.id,aids:[a.id]};if(S.sel===p.id)renderNotesOnly()}}
/* ================= Résumé, export, exemples ================= */
function summary(p){const L=[];const e=p.ent||{};
  L.push(`${displayName(p).toUpperCase()}${e.forme?' ('+e.forme+')':''}`);
  if(e.siret||e.siren)L.push(`SIRET : ${fmtSiret(e.siret||e.siren)}`);
  if(e.adresse||e.ville)L.push(`Adresse : ${[e.adresse,[e.cp,e.ville].filter(Boolean).join(' ')].filter(Boolean).join(', ')}`);
  if(e.tel)L.push(`Standard : ${fmtTel(e.tel)}`);if(e.secteur||e.effectif)L.push(`Secteur : ${[e.secteur,e.effectif&&e.effectif+' salariés'].filter(Boolean).join(' · ')}`);
  L.push(`Statut : ${ST[p.statut]?.l||''}${p.temperature?' · '+TEMPS.find(t=>t.k===p.temperature).l:''}`);
  for(const c of p.contacts||[])L.push(`Contact : ${[c.civ,c.prenom,c.nom].filter(Boolean).join(' ')}${c.fonction?' ('+c.fonction+')':''}${c.decideur==='Oui'?' [décideur]':''}${c.tel||c.mobile?' · '+fmtTel(c.tel||c.mobile):''}${c.email?' · '+c.email:''}`);
  for(const t of TABS.filter(t=>t.fields&&t.id!=='ent')){const xs=t.fields.map(f=>[f.l,getP(p,f.k)]).filter(([,v])=>filled(v)).map(([l,v])=>`${l} : ${Array.isArray(v)?v.join(', '):/^\d{4}-\d{2}$/.test(v)?fmtMonth(v):v}`);if(xs.length){L.push('');L.push(`— ${t.l.toUpperCase()} —`);L.push(...xs)}}
  const a=nextAction(p);if(a){L.push('');L.push(`Prochaine action : ${a.type} ${fmtDate(a.date)}${a.heure?' '+a.heure:''}${a.note?' · '+a.note:''}`)}
  return L.join('\n')}
async function exportCsv(){
  const cols=[['Entreprise',p=>displayName(p)],['SIRET',p=>p.ent?.siret],['SIREN',p=>p.ent?.siren],['Adresse',p=>p.ent?.adresse],['CP',p=>p.ent?.cp],['Ville',p=>p.ent?.ville],['Standard',p=>fmtTel(p.ent?.tel)],['Secteur',p=>p.ent?.secteur],['Effectif',p=>p.ent?.effectif],['Statut',p=>ST[p.statut]?.l],['Température',p=>p.temperature],['Source',p=>p.source],
    ['Contact',p=>{const c=p.contacts?.[0];return c?[c.civ,c.prenom,c.nom].filter(Boolean).join(' '):''}],['Fonction',p=>p.contacts?.[0]?.fonction],['Tél. contact',p=>fmtTel(p.contacts?.[0]?.tel||p.contacts?.[0]?.mobile)],['Email',p=>p.contacts?.[0]?.email||p.ent?.email],
    ['Besoins',p=>(p.besoins?.sel||[]).join(' / ')],['Échéance',p=>p.besoins?.priorite],['Copieurs',p=>[p.impr?.nb,(p.impr?.marques||[]).join(' ')].filter(Boolean).join(' ')],['Fin contrat impression',p=>p.impr?.finContrat],['Postes',p=>p.it?.postes],['Prestataire IT',p=>p.it?.prestataire],['Opérateur',p=>(p.tel?.operateur||[]).join(' / ')],['Fin engagement télécom',p=>p.tel?.finEngagement],
    ['Prochaine action',p=>{const a=nextAction(p);return a?`${a.type} ${a.date} ${a.heure||''}`.trim():''}],['Qualification %',p=>qualif(p)],['Dernière note',p=>(p.journal||[]).at(-1)?.texte]];
  const q=v=>{const s=String(v??'');return /[;"\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
  const csv='﻿'+[cols.map(c=>c[0]).join(';'),...VP().map(p=>cols.map(c=>q(c[1](p))).join(';'))].join('\r\n');
  downloadFile(`prospects-${iso(new Date())}.csv`,csv,'text/csv;charset=utf-8');toast('Export téléchargé')}
function downloadFile(name,content,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
function exportBackup(){downloadFile(`radar-sauvegarde-${iso(new Date())}.json`,JSON.stringify({version:1,exportedAt:new Date().toISOString(),prospects:[...S.P.values()]}),'application/json');toast('Sauvegarde téléchargée')}
function importBackup(file){const fr=new FileReader();fr.onload=()=>{try{const j=JSON.parse(fr.result);const arr=Array.isArray(j)?j:j.prospects;let n=0;for(const p of arr||[]){if(!p?.id)continue;const loc=S.P.get(p.id);if(!loc||(p.updatedAt||0)>(loc.updatedAt||0)){S.P.set(p.id,p);markDirty(p.id);n++}}S.menu=false;render();toast(`${n} fiche${n>1?'s':''} importée${n>1?'s':''}`)}catch{toast('Fichier illisible : choisis une sauvegarde Radar (.json).')}};fr.readAsText(file)}
function seedExamples(){const t=today();const mk=(o)=>{const p=Object.assign(blank(o.source||'tel'),o,{exemple:true});S.P.set(p.id,p);touch(p);return p};
  mk({statut:'rappel',temperature:'chaud',ent:{nom:'Étude Martin & Associés (exemple)',secteur:'Notaire / juridique',forme:'SCP',effectif:'11–19',adresse:'12 rue de la Station',cp:'92600',ville:'Asnières-sur-Seine'},
    contacts:[{id:rid(),civ:'Mme',nom:'Martin',fonction:'Associé',decideur:'Oui'},{id:rid(),prenom:'Julie',fonction:'Office manager',decideur:'Influenceur'}],
    besoins:{sel:['Impression / copieurs','Sauvegarde / PRA'],declencheur:['Fin de contrat','Insatisfaction prestataire'],priorite:'< 3 mois'},cyber:{antivirus:['Avast / AVG'],sauvegarde:['Disque externe']},
    impr:{nb:2,marques:['Ricoh'],mode:'Location / leasing',loueur:'Grenke',finContrat:iso(new Date(t.getFullYear(),t.getMonth()+3,1)).slice(0,7),satisfaction:'Insatisfait',irritants:['Pannes',"Délais d’intervention"]},it:{postes:14,logiciels:'Genapi'},
    actions:[{id:rid(),type:'Rappel',date:iso(t),heure:'14:00',note:'Rappeler Mme Martin pour caler le RDV',fait:false}],
    journal:[{id:rid(),date:iso(addDays(t,-2))+'T10:12:00',canal:'tel',issue:'Barrage',texte:"parlé à julie (office manager), mme martin associée décide, 2 copieurs ricoh leasing grenke pas contents pannes, svg sur dd externe, rapl ajd 14h"}]});
  mk({statut:'rdv',temperature:'chaud',rdvPrisLe:new Date().toISOString(),source:'terrain',ent:{nom:'Cabinet Kiné Seine (exemple)',secteur:'Médical / paramédical',effectif:'6–10',ville:'Asnières-sur-Seine'},
    contacts:[{id:rid(),civ:'M.',prenom:'Karim',nom:'Benali',fonction:'Dirigeant / gérant',decideur:'Oui'}],besoins:{sel:['Cybersécurité','Réseau / Wi-Fi']},it:{reseau:['Wi-Fi lent'],cloud:['Microsoft 365']},tel:{operateur:['Orange'],internet:['Fibre']},
    actions:[{id:rid(),type:'RDV',date:iso(bizDays(t,3)),heure:'10:00',note:'RDV Sur place',fait:false}],journal:[{id:rid(),date:iso(t)+'T09:40:00',canal:'terrain',issue:'RDV pris',texte:'vu le gérant karim, wifi patients lent, peur du piratage dossiers patients'}]});
  mk({statut:'nouveau',ent:{nom:'Atelier Lumen Architectes (exemple)',secteur:'Architecte',ville:'Bois-Colombes',tel:'0147000000'},actions:[]});}

/* ================= Registre des entreprises & adresses (services publics) ================= */
const RE='https://recherche-entreprises.api.gouv.fr', GEO='https://data.geopf.fr/geocodage';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let nextSlot=0;
async function getJSON(url,{signal}={}){
  if(!navigator.onLine)throw{fr:'Pas de connexion internet.'};
  for(let k=0;k<3;k++){
    const wait=Math.max(0,nextSlot-Date.now());nextSlot=Math.max(nextSlot,Date.now())+160;if(wait)await sleep(wait);
    if(signal?.aborted)throw{name:'AbortError'};
    let r;try{r=await fetch(url,{signal,headers:{Accept:'application/json'}})}
    catch(e){if(e?.name==='AbortError')throw e;if(k<2){await sleep(700);continue}throw{fr:'Service public injoignable. Vérifie ta connexion.'}}
    if(r.status===429){await sleep(1100*(k+1));continue}
    if(r.status===404||r.status===400)return null;
    if(!r.ok){if(k<2&&r.status>=500){await sleep(800);continue}throw{fr:`Le registre a répondu une erreur (${r.status}). Réessaie dans un instant.`}}
    return r.json()}
  throw{fr:'Trop de recherches d’un coup : réessaie dans quelques secondes.'}}
const reCache=new Map();
async function reSearch(q,opt={}){
  const u=new URL(RE+'/search');u.searchParams.set('q',q);u.searchParams.set('per_page',String(opt.per_page||10));u.searchParams.set('page','1');
  if(opt.code_postal)u.searchParams.set('code_postal',opt.code_postal);if(opt.etabs)u.searchParams.set('limite_matching_etablissements','100');
  const k=u.toString();if(reCache.has(k))return reCache.get(k);
  const out=(await getJSON(k,opt))?.results||[];reCache.set(k,out);return out}
async function geocode(q){const u=new URL(GEO+'/search');u.searchParams.set('q',q);u.searchParams.set('limit','1');u.searchParams.set('index','address');
  const f=(await getJSON(u.toString()))?.features?.[0];if(!f)return null;const pr=f.properties||{};
  return{lon:f.geometry.coordinates[0],lat:f.geometry.coordinates[1],label:pr.label||q,addr:{num:pr.housenumber||'',street:pr.street||pr.name||'',cp:pr.postcode||'',ville:pr.city||''},score:pr.score}}
async function revgeo(pos){try{const u=new URL(GEO+'/reverse');u.searchParams.set('lon',pos.lon);u.searchParams.set('lat',pos.lat);u.searchParams.set('limit','1');u.searchParams.set('index','address');
  const f=(await getJSON(u.toString()))?.features?.[0];return f?.properties?.label||''}catch{return''}}
function haversine(a,b){const R=6371000,t=x=>x*Math.PI/180;const dLa=t(b.lat-a.lat),dLo=t(b.lon-a.lon);const h=Math.sin(dLa/2)**2+Math.cos(t(a.lat))*Math.cos(t(b.lat))*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(h))}

/* ---------- Mise en forme des données officielles ---------- */
const SMALLW=new Set(['de','du','des','la','le','les','sur','sous','et','d','l','en','au','aux','lès']);
function niceCase(s){if(!s)return'';const t=String(s).trim();if(t!==t.toUpperCase())return t;
  return t.toLowerCase().split(' ').map((w,wi)=>w.split(/([-'’])/).map((x,xi)=>(!x||/[-'’]/.test(x))?x:((wi+xi>0&&SMALLW.has(x))?x:x[0].toUpperCase()+x.slice(1))).join('')).join(' ')
   .replace(/\b(Sas|Sasu|Sarl|Eurl|Selarl|Scp|Sci|Sa|Snc|Scm|Selas)\b/g,m=>m.toUpperCase())}
const trunc=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n-1).trim()+'…':s};
const nafFmt=c=>{const m=String(c||'').match(/^(\d{2})\.?(\d{2}[A-Z])$/);return m?`${m[1]}.${m[2]}`:c||''};
const frDate=d=>{const m=String(d||'').match(/^(\d{4})-(\d{2})-(\d{2})/);return m?`${m[3]}/${m[2]}/${m[1]}`:d||''};
function formeFromCode(c){c=String(c||'');if(!c)return'';if(c==='5720')return'SASU';if(c==='5785')return'SELAS';if(c.startsWith('57'))return'SAS';if(c==='5498')return'EURL';if(c==='5485')return'SELARL';if(c.startsWith('54'))return'SARL';
  if(c.startsWith('55')||c.startsWith('56'))return'SA';if(c==='6540')return'SCI';if(c.startsWith('656'))return'SCP';if(c.startsWith('65'))return'Société civile';if(c==='1000')return'EI';if(c.startsWith('92'))return'Association';return''}
const EFF={'00':'1–5','01':'1–5','02':'1–5','03':'6–10','11':'11–19','12':'20–49','21':'50–99','22':'100–249','31':'100–249','32':'250 +','41':'250 +','42':'250 +','51':'250 +','52':'250 +','53':'250 +'};
const effLabel=t=>EFF[t]||'';
function secteurFromNaf(code,text){const c=String(code||'').replace('.','');const t=norm(text);if(!c)return'';const c2=c.slice(0,2),c4=c.slice(0,4);
  if(c4==='6910')return /avocat/.test(t)&&!/notair/.test(t)?'Avocat':'Notaire / juridique';
  if(c4==='6920')return'Expert-comptable';if(c2==='86'||c4==='7500')return'Médical / paramédical';
  if(['7010','7021','7022','7810','7820','7830','7490','7320'].includes(c4))return'Conseil / RH / recrutement';
  if(c4==='7111')return'Architecte';if(c2==='68')return'Agence immobilière';if(['6511','6512','6621','6622','6629'].includes(c4))return'Assurance';
  if(['41','42','43'].includes(c2))return'BTP / artisan';if(['45','46','47'].includes(c2))return'Commerce';if(['55','56'].includes(c2))return'Restauration / hôtellerie';
  if(+c2>=49&&+c2<=53)return'Transport / logistique';if(c2==='94')return'Association';if(+c2>=10&&+c2<=33)return'Industrie';return''}
function fonctionRne(f){f=String(f||'');if(/pr[ée]sident|g[ée]rant/i.test(f))return'Dirigeant / gérant';if(/directeur g[ée]n[ée]ral/i.test(f))return'DG';if(/associ/i.test(f))return'Associé';return f}
const STOPN=new Set(['cabinet','sarl','sas','sasu','eurl','selarl','scp','agence','societe','ste','groupe','les','des','et','de','du','la','le','france','chez','maison','atelier','boutique','etablissements','ets','espace','centre','the','and']);
const toks=s=>norm(s).replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>=3&&!STOPN.has(w));
function sim(a,b){const X=toks(a),Y=toks(b);if(!X.length||!Y.length)return 0;return X.filter(w=>Y.some(x=>x===w||(w.length>4&&(x.startsWith(w)||w.startsWith(x))))).length/X.length}
function etabsOf(r){const m=[...(r.matching_etablissements||[])];if(r.siege&&!m.some(e=>e.siret===r.siege.siret))m.push({...r.siege,est_siege:true});return m}
function addrOf(e){const full=String(e?.adresse||'');const cp=e?.code_postal||(full.match(/\b\d{5}\b/)||[])[0]||'';let rue=full;if(cp){const i=full.lastIndexOf(cp);if(i>0)rue=full.slice(0,i)}
  return{rue:niceCase(rue.replace(/[,\s]+$/,'').trim()),cp,ville:niceCase(e?.libelle_commune||full.slice(full.lastIndexOf(cp)+5).trim())}}
const enseigneOf=(r,e)=>niceCase((e?.liste_enseignes||[])[0]||e?.nom_commercial||'');
const nameOf=r=>niceCase(r.nom_raison_sociale||r.nom_complet||'');
function pickEtab(r,hint={}){const ets=etabsOf(r);let e=null;
  if(hint.siret)e=ets.find(x=>x.siret===hint.siret);
  if(!e&&(hint.cp||hint.adresse)){let best=-1;for(const x of ets){const a=addrOf(x);const s=(x.etat_administratif==='F'?0:1)+(hint.cp&&a.cp===hint.cp?3:0)+(hint.adresse?sim(hint.adresse,a.rue)*2:0);if(s>best){best=s;e=x}}if(best<3)e=null}
  return e||r.siege||ets[0]||null}
const NOT_DIR=/commissaire|suppl[ée]ant|liquidateur|mandataire|administrateur judiciaire|repr[ée]sentant permanent|contr[ôo]leur/i;
const isGroup=r=>(r.nombre_etablissements_ouverts||0)>1;
const etabTranche=(r,e)=>{const t=e?.tranche_effectif_salarie;if(t&&t!=='NN')return t;return isGroup(r)?'':(r.tranche_effectif_salarie||'')};
function reToPatch(r,e){
  const naf=nafFmt(e?.activite_principale||r.activite_principale);const a=addrOf(e||r.siege);const grp=isGroup(r);const local=grp&&e&&!e.est_siege;
  const set={'ent.nom':nameOf(r),'ent.siren':r.siren,'ent.siret':e?.siret||r.siege?.siret,'ent.forme':formeFromCode(r.nature_juridique),'ent.naf':naf,
    'ent.creation':frDate(r.date_creation),'ent.effectif':effLabel(etabTranche(r,e)),'ent.adresse':a.rue,'ent.cp':a.cp,'ent.ville':a.ville};
  const en=enseigneOf(r,e);if(en&&norm(en)!==norm(set['ent.nom']))set['ent.enseigne']=en;
  const sec=secteurFromNaf(naf,[r.nom_complet,(r.dirigeants||[]).map(d=>d.qualite).join(' ')].join(' '));if(sec)set['ent.secteur']=sec;
  if((r.nombre_etablissements_ouverts||0)>1)set['ent.sites']='Oui';else if(r.nombre_etablissements_ouverts===1)set['ent.sites']='Non';
  if(!set['ent.enseigne']&&r.sigle&&norm(r.sigle)!==norm(set['ent.nom']))set['ent.enseigne']=r.sigle;
  const lab=nafLabel(naf);if(lab)set['ent.activite']=lab;
  const cat={PME:'PME',ETI:'ETI',GE:'Grande entreprise'}[r.categorie_entreprise];if(cat&&!grp)set['ent.categorie']=cat;if(local)set['ent.groupe']='Oui';
  if(e)set['ent.etab']=e.est_siege?'Siège':'Établissement secondaire';
  set['ent.tva']=(r.tva&&r.tva[0])||tvaOf(r.siren);
  const ec=e?.date_creation||'';if(ec){const y=ec.slice(0,4);set['ent.installe']=ec!==r.date_creation&&ec>(r.date_creation||'')?`depuis ${moisAn(ec)}`:`depuis la création (${y})`}
  const fin=r.finances&&Object.entries(r.finances).sort((a,b)=>b[0]-a[0])[0];
  if(fin&&!grp){const [y,f]=fin;if(f.ca>0)set['ent.ca']=`${eur(f.ca)} (${y})`;if(f.resultat_net!=null)set['ent.resultat']=`${eur(f.resultat_net)} (${y})`}
  const idcc=(e?.liste_idcc||(grp?[]:r.complements?.liste_idcc)||[]).filter(x=>x&&x!=='9999');if(idcc.length)set['ent.convention']=idcc.map(c=>IDCC[c.replace(/^0+/,'')]?`${IDCC[c.replace(/^0+/,'')]} (IDCC ${c})`:`IDCC ${c}`).join(', ');
  const pm=(r.dirigeants||[]).filter(d=>/morale/i.test(d.type_dirigeant||'')&&d.denomination);if(pm.length&&!grp)set['ent.holding']=pm.slice(0,3).map(d=>`${niceCase(d.denomination)}${d.qualite?' : '+d.qualite.toLowerCase():''}`).join(' · ');
  const contacts=(local||(grp&&(r.nombre_etablissements_ouverts||0)>5)?[]:(r.dirigeants||[])).filter(d=>/physique/i.test(d.type_dirigeant||'physique')&&d.nom&&!NOT_DIR.test(d.qualite||'')).slice(0,3)
    .map(d=>({prenom:niceCase(String(d.prenoms||d.prenom||'').split(/[\s,]+/)[0]),nom:niceCase(d.nom),fonction:fonctionRne(d.qualite),decideur:'Oui',note:'Dirigeant au registre'+(d.qualite?' : '+d.qualite:'')}));
  return{set,contacts}}
const tvaOf=s=>{s=String(s||'');if(!/^\d{9}$/.test(s))return'';return'FR'+String((12+3*(+s%97))%97).padStart(2,'0')+s};
const eur=n=>{n=+n;const a=Math.abs(n);return (n<0?'−':'')+(a>=1e6?(a/1e6).toFixed(a>=1e7?0:1).replace('.',',')+' M€':a>=1e3?Math.round(a/1e3)+' k€':a+' €')};
const MOISL=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const moisAn=d=>{const m=String(d).match(/^(\d{4})-(\d{2})/);return m?`${MOISL[+m[2]-1]} ${m[1]}`:d};
const IDCC={'1527':'Immobilier','2205':'Notariat','1000':'Cabinets d’avocats','787':'Cabinets d’experts-comptables','1486':'Syntec (bureaux d’études, conseil)','1147':'Cabinets médicaux','1619':'Cabinets dentaires','2332':'Architecture','2247':'Courtage d’assurances','1672':'Sociétés d’assurances','2120':'Banque','1979':'Hôtels, cafés, restaurants','1501':'Restauration rapide','3248':'Métallurgie','1596':'Bâtiment ouvriers (≤10)','1597':'Bâtiment ouvriers (>10)','2609':'Bâtiment ETAM','1517':'Commerce de détail non alimentaire','2216':'Commerce alimentaire','573':'Commerces de gros','16':'Transports routiers','1090':'Services de l’automobile','2264':'Hospitalisation privée','29':'Hospitalisation privée à but non lucratif','413':'Établissements pour personnes inadaptées','1516':'Organismes de formation','2941':'Aide à domicile','1801':'Sociétés d’assistance','2098':'Prestataires de services tertiaires','1351':'Prévention et sécurité','3043':'Entreprises de propreté','2596':'Coiffure','1996':'Pharmacie d’officine','2511':'Sport','1261':'Centres sociaux'};
/* ---------- Estimations et brief avant l'appel ---------- */
const TRM={'00':1,'01':2,'02':4,'03':8,'11':15,'12':35,'21':75,'22':150,'31':225,'32':375,'41':750,'42':1500,'51':3500,'52':7500,'53':10000};
const EFFM={'1–5':3,'6–10':8,'11–19':15,'20–49':35,'50–99':75,'100–249':170,'250 +':400};
const BUREAU=['Notaire / juridique','Avocat','Expert-comptable','Conseil / RH / recrutement','Architecte','Agence immobilière','Assurance'];
function headcount(p){if(p.it?.utilisateurs&&!p.est?.['it.utilisateurs'])return +p.it.utilisateurs;const t=p.rne?.tranche;if(t&&TRM[t])return TRM[t];return EFFM[p.ent?.effectif]||0}
function estimates(p){const n=headcount(p);if(!n)return null;const sec=p.ent?.secteur||'';const bur=BUREAU.includes(sec);
  const ratio=bur?1.1:sec==='Médical / paramédical'?1.15:sec==='Commerce'?0.45:sec==='BTP / artisan'?0.35:sec==='Restauration / hôtellerie'?0.15:sec==='Industrie'?0.5:sec==='Transport / logistique'?0.4:sec==='Association'?0.7:0.8;
  const postes=Math.max(1,Math.round((n+(n<20?1:0))*ratio));
  const copieurs=bur||sec==='Médical / paramédical'||sec==='Association'?Math.max(1,Math.ceil(n/(n<=20?15:20))):Math.max(1,Math.ceil(n/30));
  const indiv=['Notaire / juridique','Avocat','Médical / paramédical','Expert-comptable'].includes(sec)?0.5:bur?0.25:0.15;
  const imprimantes=Math.max(n>=3?1:0,Math.round(postes*indiv));
  return{n,postes,copieurs,imprimantes,lignes:bur||sec==='Médical / paramédical'?Math.max(2,Math.round(n*0.9)):Math.max(1,Math.round(n*0.4))}}
function applyEstimates(p){const e=estimates(p);if(!e)return[];p.est=p.est||{};const ch=[];
  const put=(k,v)=>{const cv=getP(p,k);if(filled(cv)&&!p.est[k])return;if(cv===v)return;setP(p,k,v);p.est[k]=true;ch.push(k)};
  if(!p.est['it.utilisateurs']&&filled(p.it?.utilisateurs)){}else put('it.utilisateurs',e.n);
  put('it.postes',e.postes);put('impr.nb',e.copieurs);put('impr.nbImprimantes',e.imprimantes);put('tel.lignesFixes',e.lignes);return ch}
const LOGI={'Notaire / juridique':'Genapi, iNot (Fiducial), Fichorga','Avocat':'Secib, Septeo (ex-Jarvis), Kleos','Expert-comptable':'Cegid, ACD, Sage, Inqom, Pennylane','Médical / paramédical':'Doctolib, Weda, Crossway, Julie / Logos_w (dentaire)','Agence immobilière':'Apimo, Hektor, AC3, Netty, Vilogi (syndic)','Architecte':'Archicad, Revit, AutoCAD, SketchUp','Assurance':'Extranets compagnies, CRM courtage (Oggo, Courtigo)','Conseil / RH / recrutement':'Microsoft 365, CRM / ATS (Flatchr, Taleez)','BTP / artisan':'Batappli, Obat, EBP Bâtiment','Restauration / hôtellerie':'Caisse (Zelty, Lightspeed), PMS hôtelier'};
const ANGLES={
 'Notaire / juridique':['Très gros volumes d’impression et de scan (actes, copies authentiques) : copieurs rapides + scan vers Genapi/iNot.','Secret professionnel et données clients : sauvegarde externalisée, EDR, messagerie sécurisée.','Signature électronique et acte authentique à distance : postes et réseau à niveau.'],
 'Avocat':['Secret professionnel : la cyber (messagerie, EDR, MFA) est un argument fort.','Dossiers lourds et scan : copieur + GED.','Mobilité / audiences : portables, VPN, Microsoft 365.'],
 'Expert-comptable':['Pics d’activité (bilans, déclarations) : une panne coûte cher, support réactif.','Données financières de centaines de clients : sauvegarde + cyber.','Facture électronique : ils conseillent leurs clients, donc sensibles au sujet.'],
 'Médical / paramédical':['Données de santé : obligations RGPD/HDS, sauvegarde et poste sécurisés.','Imprimantes d’ordonnances et scanners au poste, plusieurs cabinets.','Accueil téléphonique saturé : standard cloud, files d’attente, renvoi vers Doctolib.'],
 'Agence immobilière':['Vitrine et affiches couleur A3 : copieur couleur avec coût copie maîtrisé.','Négociateurs mobiles : forfaits mobiles, Microsoft 365, signature électronique.','Accueil téléphonique et renvoi d’appels vers les mobiles.'],
 'Architecte':['Gros fichiers (plans, maquettes) : NAS, réseau rapide, sauvegarde.','Traceur grand format et copieur A3 couleur.','Postes puissants (CAO) : renouvellement de parc.'],
 'Assurance':['Conformité (DDA, RGPD) et données clients : cyber et sauvegarde.','Souvent rattachés à une compagnie : vérifier ce qui est imposé et ce qui reste libre.','Téléphonie : standard, enregistrement, renvois.'],
 'Conseil / RH / recrutement':['Équipes mobiles : Microsoft 365, Teams, portables.','Données candidats / clients : RGPD, MFA.','Téléphonie cloud (Teams Phone) pour le travail hybride.'],
 'BTP / artisan':['Équipes sur chantier : flotte mobile et tablettes.','Devis / factures : facture électronique 2027.','Petit bureau : un seul prestataire pour tout (IT, téléphonie, copieur).'],
 'Commerce':['Caisse, TPE et Wi-Fi : réseau fiable.','Téléphonie et internet de secours (4G).','Vidéosurveillance / réseau.'],
 'Restauration / hôtellerie':['Wi-Fi clients et réseau caisse séparés.','Internet de secours : une coupure = pas de paiement.','Téléphonie / réservations.']};
/* ---------- Angles d'attaque : personnalisés d'après la fiche + rotation dans une grande réserve ---------- */
/* Chaque angle : t = l'idée, d = pourquoi ça parle au prospect, q = la question à poser */
const ANG_SEC={
 'Notaire / juridique':[
  {t:'Volumes de scan et d’impression',d:'Actes, copies authentiques, pièces : le copieur tourne toute la journée et le scan alimente le logiciel de l’étude.',q:'Vous scannez directement vers Genapi / iNot, ou il faut repasser par un poste ?'},
  {t:'Secret professionnel et données clients',d:'Une fuite ou un rançongiciel bloque l’étude et engage la responsabilité du notaire.',q:'Si un poste est piraté demain, qu’est-ce qui protège les dossiers clients ?'},
  {t:'Actes à distance',d:'Signature électronique et comparution à distance demandent des postes, des écrans et un réseau à niveau.',q:'Vous faites des signatures à distance ? Ça se passe bien techniquement ?'},
  {t:'Arrivée d’un nouveau collaborateur',d:'Préparer un poste complet (logiciel métier, droits, messagerie) prend souvent des jours.',q:'Quand un clerc arrive, combien de temps pour qu’il ait un poste prêt ?'},
  {t:'Accueil téléphonique',d:'Les clients appellent beaucoup pour suivre leur dossier : appels perdus = clients mécontents.',q:'Aux heures de pointe, il arrive que des appels ne soient pas pris ?'}],
 'Avocat':[
  {t:'Secret professionnel',d:'Messagerie, pièces, échanges clients : la cybersécurité est un argument déontologique, pas seulement technique.',q:'Vous avez une double authentification sur la messagerie du cabinet ?'},
  {t:'Mobilité et audiences',d:'Travailler du palais, de chez soi ou en déplacement : portable, VPN et accès sécurisé aux dossiers.',q:'Quand vous êtes au tribunal, vous accédez facilement à vos dossiers ?'},
  {t:'Dossiers lourds',d:'Pièces volumineuses à scanner, numéroter, envoyer : copieur rapide + scan vers le logiciel du cabinet.',q:'Qui scanne les pièces chez vous, et ça prend combien de temps ?'},
  {t:'RPVA et postes',d:'Accès RPVA, logiciel métier, mises à jour : un poste qui flanche bloque une échéance.',q:'Qui vous dépanne quand le RPVA ou le logiciel du cabinet ne répond plus ?'},
  {t:'Joignabilité',d:'Un client qui n’arrive pas à joindre son avocat le fait vite savoir.',q:'Les appels arrivent sur le standard ou directement sur vos mobiles ?'}],
 'Expert-comptable':[
  {t:'Périodes fiscales',d:'Pendant les bilans et déclarations, une panne coûte des heures facturables.',q:'Pendant la période fiscale, si un poste tombe, en combien de temps vous êtes dépannés ?'},
  {t:'Données financières clients',d:'Des centaines de dossiers clients : sauvegarde et cyber sont critiques.',q:'Votre sauvegarde est testée ? Vous savez en combien de temps vous repartiriez ?'},
  {t:'Facture électronique',d:'Le cabinet conseille ses clients sur la réforme : il doit lui-même être bien équipé (scan, flux, GED).',q:'Côté cabinet, vous êtes prêts pour la réception des factures électroniques ?'},
  {t:'Télétravail des collaborateurs',d:'Accès aux logiciels de production à distance, en sécurité.',q:'Vos collaborateurs travaillent de chez eux ? Comment ils accèdent aux dossiers ?'},
  {t:'Pièces clients papier',d:'Encore beaucoup de documents papier à numériser à l’arrivée.',q:'Les pièces papier des clients, vous les numérisez comment aujourd’hui ?'}],
 'Médical / paramédical':[
  {t:'Données de santé',d:'Obligations RGPD renforcées : postes, sauvegarde et hébergement doivent être sécurisés.',q:'Vos dossiers patients sont sauvegardés où, et qui s’en occupe ?'},
  {t:'Accueil téléphonique saturé',d:'Secrétariat débordé, patients qui raccrochent : files d’attente, messages, renvoi vers la prise de RDV en ligne.',q:'Le matin, combien d’appels vous estimez manquer ?'},
  {t:'Postes en consultation',d:'Lecteur de carte Vitale, logiciel métier, imprimante d’ordonnances : tout doit marcher dès le premier patient.',q:'Quand un poste ou un lecteur de carte plante en consultation, vous faites comment ?'},
  {t:'Plusieurs praticiens, un seul cabinet',d:'Agendas, impressions et téléphones partagés entre praticiens : un seul prestataire simplifie.',q:'Chaque praticien gère son matériel, ou c’est mutualisé ?'},
  {t:'Rançongiciels dans la santé',d:'Les structures de santé sont des cibles fréquentes : un poste infecté arrête les consultations.',q:'Si un poste était bloqué par un virus demain, vous pourriez continuer à recevoir ?'}],
 'Agence immobilière':[
  {t:'Vitrine et affichage couleur',d:'Affiches A3 couleur renouvelées souvent : le coût par page couleur pèse.',q:'Vous savez combien vous coûte une affiche couleur aujourd’hui ?'},
  {t:'Négociateurs sur le terrain',d:'Mobiles, accès aux mandats et signature électronique en visite.',q:'Vos négociateurs ont tout sur leur mobile en visite, ou ils repassent à l’agence ?'},
  {t:'Appels d’acquéreurs perdus',d:'Un appel non pris = un acquéreur qui appelle l’agence d’à côté.',q:'Quand l’agence est fermée ou que tout le monde est en visite, les appels vont où ?'},
  {t:'Mandats et pièces',d:'Diagnostics, titres, pièces d’identité : beaucoup de scan et de données personnelles.',q:'Les pièces des vendeurs, vous les stockez où ?'},
  {t:'Indépendance',d:'Agence indépendante : un prestataire local et réactif plutôt qu’une hotline.',q:'Aujourd’hui, quand quelque chose ne marche pas, vous appelez qui ?'}],
 'Architecte':[
  {t:'Fichiers lourds',d:'Plans, maquettes BIM, rendus : NAS, réseau rapide et sauvegarde adaptés.',q:'Vos fichiers de projets sont stockés où, et ça va vite à ouvrir ?'},
  {t:'Postes de CAO',d:'Les logiciels de dessin demandent des postes puissants : un poste lent, c’est des heures perdues.',q:'Vos postes tiennent bien la charge sur les gros projets ?'},
  {t:'Impression grand format',d:'Traceur et copieur A3 couleur : coût et fiabilité.',q:'Les plans grand format, vous les imprimez au cabinet ou chez un reprographe ?'},
  {t:'Échanges avec les partenaires',d:'Bureaux d’études, maîtres d’ouvrage : partage de gros fichiers en sécurité.',q:'Vous envoyez vos plans comment à vos partenaires ?'},
  {t:'Perte de projet',d:'Un disque qui lâche = des mois de travail perdus si la sauvegarde n’est pas testée.',q:'Vous avez déjà perdu des fichiers de projet ?'}],
 'Assurance':[
  {t:'Ce qui est imposé ou libre',d:'Agent général : la compagnie impose certains outils, le reste (postes, téléphonie, impression) est souvent libre.',q:'Qu’est-ce qui vous est imposé par la compagnie, et qu’est-ce que vous choisissez vous-même ?'},
  {t:'Données clients et conformité',d:'Données personnelles et de santé (prévoyance) : cyber et sauvegarde.',q:'Qui gère la sécurité de vos postes : vous ou la compagnie ?'},
  {t:'Joignabilité des clients',d:'Sinistre = client stressé qui veut joindre l’agence tout de suite.',q:'En cas de sinistre, vos clients vous joignent facilement, même entre midi et deux ?'},
  {t:'Équipe commerciale mobile',d:'Rendez-vous chez les clients : mobiles et accès sécurisé.',q:'Vos collaborateurs travaillent souvent à l’extérieur ?'}],
 'Conseil / RH / recrutement':[
  {t:'Travail hybride',d:'Microsoft 365, Teams et téléphonie dans Teams pour être joignable partout.',q:'Vos consultants sont souvent en télétravail ou chez les clients ?'},
  {t:'Données candidats',d:'CV et données personnelles : RGPD, double authentification, partages maîtrisés.',q:'Les CV et dossiers candidats sont stockés où ?'},
  {t:'Croissance de l’équipe',d:'Recrutements réguliers : préparer vite les postes et comptes.',q:'Vous avez des arrivées prévues dans les prochains mois ?'},
  {t:'Image auprès des clients',d:'Visio qui coupe, son mauvais : ça se voit en rendez-vous client.',q:'Vos visios clients se passent bien côté son et connexion ?'}],
 'BTP / artisan':[
  {t:'Facture électronique',d:'Devis et factures en flux électronique : émission obligatoire au 1er sept. 2027 pour les PME et TPE.',q:'Vos factures, vous les faites avec quel logiciel aujourd’hui ?'},
  {t:'Équipes sur chantier',d:'Mobiles, tablettes, photos de chantier et devis sur place.',q:'Vos chefs de chantier envoient comment les infos au bureau ?'},
  {t:'Un seul prestataire',d:'Petit bureau, pas d’informaticien : un interlocuteur unique pour l’IT, la téléphonie et le copieur.',q:'Aujourd’hui, combien de fournisseurs différents pour l’informatique, le téléphone et l’impression ?'},
  {t:'Plans et dossiers',d:'Impressions de plans, DOE, dossiers d’appels d’offres.',q:'Vous imprimez beaucoup pour les chantiers et les appels d’offres ?'}],
 'Commerce':[
  {t:'Internet de secours',d:'Une coupure internet = plus de commandes ni d’encaissement en ligne.',q:'La dernière coupure internet, ça a duré combien de temps ?'},
  {t:'Wi-Fi et réseau',d:'Réseau du magasin, Wi-Fi clients et bureau séparés et fiables.',q:'Votre Wi-Fi tient bien dans tout le magasin ?'},
  {t:'Téléphonie',d:'Ne pas rater les appels clients quand l’équipe est en rayon.',q:'Quand tout le monde est occupé, les appels basculent où ?'}],
 'Industrie':[
  {t:'Arrêt de production',d:'Un rançongiciel ou une panne réseau peut arrêter l’atelier : sauvegarde et cyber sont un sujet de continuité.',q:'Si le réseau tombe une journée, la production s’arrête ?'},
  {t:'Atelier et bureaux',d:'Réseau et Wi-Fi qui couvrent l’atelier, postes partagés, étiquettes et documents de production.',q:'Le réseau couvre bien l’atelier et l’entrepôt ?'},
  {t:'Logiciel de gestion',d:'ERP, serveur local vieillissant : sujet de renouvellement ou de passage au cloud.',q:'Votre logiciel de gestion tourne sur un serveur chez vous ?'},
  {t:'Volumes d’impression',d:'Bons, étiquettes, plans : un mix copieur / imprimantes à rationaliser.',q:'Vous avez une idée du nombre d’imprimantes sur le site ?'}],
 'Transport / logistique':[
  {t:'Flotte mobile',d:'Chauffeurs et équipes terrain : forfaits, terminaux et gestion de la flotte.',q:'Vous gérez combien de lignes mobiles pour vos équipes ?'},
  {t:'Wi-Fi d’entrepôt',d:'Scanners et terminaux qui décrochent = préparation ralentie.',q:'Vos terminaux perdent parfois le réseau dans l’entrepôt ?'},
  {t:'Documents de transport',d:'Bons, lettres de voiture, étiquettes : impression et dématérialisation.',q:'Vos documents de livraison sont encore papier ?'}],
 'Association':[
  {t:'Budget maîtrisé',d:'Peu de moyens : regrouper IT, téléphonie et impression chez un seul prestataire pour y voir clair.',q:'Vos coûts informatiques et téléphoniques sont regroupés ou éparpillés ?'},
  {t:'Bénévoles et salariés',d:'Comptes partagés, départs et arrivées fréquents : accès à sécuriser.',q:'Quand un bénévole part, ses accès sont coupés ?'},
  {t:'Données des adhérents',d:'Fichiers d’adhérents et de bénéficiaires : RGPD et sauvegarde.',q:'Vos fichiers d’adhérents sont sauvegardés où ?'}],
 'Restauration / hôtellerie':[
  {t:'Internet de secours',d:'Une coupure = plus de réservations en ligne ni de paiement.',q:'Vous avez une solution si internet coupe en plein service ?'},
  {t:'Wi-Fi clients',d:'Wi-Fi clients séparé du réseau de l’établissement, pour la sécurité.',q:'Le Wi-Fi clients est séparé de votre réseau interne ?'},
  {t:'Réservations par téléphone',d:'Appels manqués pendant le service = tables vides.',q:'Pendant le service, qui répond au téléphone ?'}]};
const ANG_GEN=[
 {t:'Un seul interlocuteur',d:'Informatique, téléphonie, impression et cyber chez un seul prestataire : un numéro à appeler, une facture.',q:'Aujourd’hui, vous avez combien de prestataires différents pour tout ça ?'},
 {t:'Temps de dépannage',d:'Ce qui agace le plus, c’est d’attendre quand ça ne marche pas : intervention rapide, sur place si besoin.',q:'La dernière panne, vous avez attendu combien de temps avant d’être dépannés ?'},
 {t:'Sauvegarde testée',d:'Beaucoup d’entreprises ont une sauvegarde, peu l’ont déjà testée.',q:'Si votre serveur ou un poste tombe demain, vous récupérez quoi, et en combien de temps ?'},
 {t:'Coût de l’impression',d:'Contrat copieur, coût par page, cartouches des imprimantes : souvent personne n’a la vision globale.',q:'Vous savez combien vous coûte l’impression par mois, tout compris ?'},
 {t:'Appels manqués',d:'Standard qui sonne dans le vide, pas de renvoi sur mobile : des clients perdus sans le savoir.',q:'Quand vous êtes absents ou occupés, vos appels arrivent où ?'},
 {t:'Mails piégés',d:'L’hameçonnage reste la première porte d’entrée des pirates : double authentification et filtrage.',q:'Vous avez déjà reçu un faux mail qui a failli passer ?'},
 {t:'Facture électronique',d:'Réception obligatoire depuis le 1er sept. 2026, émission au 1er sept. 2027 pour les PME et TPE : scan, flux et archivage à organiser.',q:'Vous recevez déjà vos factures fournisseurs en électronique ?'},
 {t:'Parc vieillissant',d:'Des postes de plus de 5 ans ralentissent tout le monde et posent des soucis de sécurité.',q:'Vos postes ont quel âge en moyenne ?'},
 {t:'Arrivées et départs',d:'Créer et couper les accès proprement, préparer un poste en avance.',q:'Quand quelqu’un arrive, son poste est prêt le premier jour ?'}];
/* Angles tirés de ce qu'on sait déjà de CE prospect (priorité absolue) */
function dynAngles(p){const A=[];const all=norm(JSON.stringify([p.it,p.impr,p.tel,p.cyber,p.besoins,(p.journal||[]).map(j=>j.texte),(p.contacts||[]).map(c=>c.note),p.ent?.notes]));
  const soon=m=>{if(!/^\d{4}-\d{2}$/.test(m||''))return null;const [y,mo]=m.split('-').map(Number);const d=(y-today().getFullYear())*12+(mo-1-today().getMonth());return d};
  if(/windows 10|\bw10\b|win ?10/.test(all))A.push({t:'Windows 10 n’est plus mis à jour',d:'Microsoft a arrêté les mises à jour de sécurité de Windows 10 le 14 octobre 2025 : ces postes sont exposés.',q:'Vous avez prévu de passer vos postes sous Windows 11 ? Certains ne sont peut-être pas compatibles.',dyn:1});
  const fc=soon(p.impr?.finContrat);if(fc!=null&&fc>=-1&&fc<=15)A.push({t:`Fin du contrat copieur : ${fmtMonth(p.impr.finContrat)}`,d:'Les contrats de location se dénoncent souvent plusieurs mois à l’avance, sinon ils se prolongent.',q:'Vous savez quel est le préavis pour ne pas être reconduit ?',dyn:1});
  const fe=soon(p.tel?.finEngagement);if(fe!=null&&fe>=-1&&fe<=12)A.push({t:`Fin d’engagement télécom : ${fmtMonth(p.tel.finEngagement)}`,d:'Le bon moment pour comparer forfaits, standard et internet avant de se réengager.',q:'Votre opérateur vous a déjà fait une proposition de renouvellement ?',dyn:1});
  for(const [k,l,dl] of [['impr','le copieur','du copieur'],['it','le prestataire informatique','du prestataire informatique'],['tel','la téléphonie','de la téléphonie']])if(/insatisf|pas content|mecontent|moyen/.test(norm(p[k]?.satisfaction||'')))A.push({t:`Pas satisfait ${dl}`,d:'Le mécontentement est déjà là : il reste à savoir ce qui coince exactement et depuis quand.',q:`Qu’est-ce qui vous gêne le plus avec ${l} aujourd’hui ?`,dyn:1});
  if(/\bpanne|en panne|plante|bug|lent\b|lenteur/.test(all))A.push({t:'Les pannes dont ils ont parlé',d:'Ils ont mentionné des pannes ou des lenteurs : partir de leur problème concret.',q:'Ce problème, ça arrive souvent ? Et ça vous coûte combien de temps à chaque fois ?',dyn:1});
  if(p.it?.aPresta==='Non'||/pas de presta|sans presta|neveu|c'est moi qui|on se debrouille/.test(all))A.push({t:'Pas de prestataire informatique',d:'Quelqu’un en interne bricole à côté de son vrai travail : ça coûte plus cher qu’il n’y paraît.',q:'Qui s’occupe de l’informatique quand ça ne marche pas, et combien de temps ça lui prend ?',dyn:1});
  const sv=norm(val(p.cyber?.sauvegarde||''));if(/aucun|disque|cle|usb|pas de/.test(sv)||/pas de (sauvegarde|svg)|disque dur externe/.test(all))A.push({t:'Sauvegarde fragile',d:'Un disque ou une clé branchés au poste sont chiffrés en même temps que lui en cas de rançongiciel.',q:'Votre sauvegarde est débranchée et emportée hors du bureau, ou elle reste à côté du poste ?',dyn:1});
  const inst=p.rne?.installe;if(inst){const age=today().getFullYear()-(+inst.slice(0,4));if(age>=3&&age<=6)A.push({t:`Installés ici depuis ${age} ans`,d:'Les contrats signés à l’emménagement (copieur, télécom, matériel) arrivent souvent à échéance.',q:'Les contrats pris à votre arrivée, ils se terminent bientôt ?',dyn:1})}
  if(p.ent?.etab==='Établissement secondaire')A.push({t:'Site secondaire',d:'La décision se prend peut-être au siège : savoir qui décide évite de perdre du temps.',q:'Pour l’informatique et la téléphonie, ça se décide ici ou au siège ?',dyn:1});
  const y=+String(p.ent?.creation||'').slice(-4);if(y&&today().getFullYear()-y<=3)A.push({t:'Entreprise récente',d:'Souvent équipée au minimum au démarrage : le bon moment pour structurer avant de grandir.',q:'Vous avez prévu de recruter ? Votre installation suivra ?',dyn:1});
  return A}
const hashStr=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)};
function anglesFor(p){const sec=ANG_SEC[p.ent?.secteur]||[];const seed=hashStr(p.id);
  const mix=(arr,k)=>arr.map((a,i)=>[(hashStr(a.t)+seed*(k+1))%997,a]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
  /* alterne secteur et général pour varier */
  const s=mix(sec,1),g=mix(ANG_GEN,2),pool=[];while(s.length||g.length){if(s.length)pool.push(s.shift());if(s.length)pool.push(s.shift());if(g.length)pool.push(g.shift())}
  const dyn=dynAngles(p);const seen=new Set(dyn.map(a=>a.t));return[...dyn,...pool.filter(a=>!seen.has(a.t))]}
function anglesHtml(p){const L=anglesFor(p);if(!L.length)return'';const N=3;S.angOff=S.angOff||{};const pages=Math.ceil(L.length/N);const pg=(S.angOff[p.id]||0)%pages;
  const cur=L.slice(pg*N,pg*N+N);
  return `<div class="ang-h"><div class="lbl">Angles d’attaque${p.ent?.secteur?' · '+esc(p.ent.secteur):''}</div>${pages>1?`<button class="btn btn-q btn-s" data-act="angnext" data-id="${p.id}">↻ Autres angles <small>${pg+1}/${pages}</small></button>`:''}</div>
   <ul class="ang2">${cur.map(a=>`<li${a.dyn?' class="dyn"':''}><b>${esc(a.t)}</b>${a.dyn?'<span class="tag">d’après la fiche</span>':''}<span class="ang-d">${esc(a.d)}</span><span class="ang-q">« ${esc(a.q)} »</span></li>`).join('')}</ul>`}
function briefData(p){const e=estimates(p);const sec=p.ent?.secteur||'';const sig=[];const now=today().getFullYear();
  const t=p.rne?.tranche;if(t&&TRM[t])sig.push(['👥',`Effectif sur ce site (SIRET ${fmtSiret(p.ent?.siret||'')}) : ${{'00':'0','01':'1 à 2','02':'3 à 5','03':'6 à 9','11':'10 à 19','12':'20 à 49','21':'50 à 99','22':'100 à 199','31':'200 à 249','32':'250 à 499','41':'500 à 999'}[t]||p.ent?.effectif} salariés${p.rne.annee?' ('+p.rne.annee+')':''}`]);
  else if(p.ent?.effectif)sig.push(['👥',`Effectif : ${p.ent.effectif} salariés`]);
  else if(p.rne?.status==='ok')sig.push(['👥','Effectif de ce site non publié par l’INSEE : demande combien ils sont sur place.']);
  const inst=p.rne?.installe;if(inst&&inst>(p.rne?.creation||'')){const y=+inst.slice(0,4);const age=now-y;sig.push(['🚚',`Installé à cette adresse en ${moisAn(inst)}${age<=6?` : contrats souvent signés à l’emménagement, donc ${age>=3?'renouvellements en cours ou proches (copieur ≈ 5 ans, télécom 2-3 ans)':'premiers renouvellements à venir'}.`:'.'}`])}
  if(p.ent?.creation){const y=+String(p.ent.creation).slice(-4);if(y&&now-y<=3)sig.push(['🌱',`Entreprise jeune (créée en ${y}) : équipement souvent minimal, besoin de structurer.`]);else if(y)sig.push(['🏛️',`Créée en ${y} (${now-y} ans).`])}
  if(p.ent?.etab==='Établissement secondaire')sig.push(['🏢','Site secondaire d’une entreprise multi-sites : la décision IT / achats peut se prendre au siège. Demande qui décide.']);
  if(false)sig.push(['🏢',`${p.ent.nbEtabs} établissements ouverts${p.ent.etab?' · celui-ci : '+p.ent.etab.toLowerCase():''} : interconnexion, téléphonie et parc à harmoniser.`]);
  if(p.ent?.holding)sig.push(['🧩',`Dirigée par une société (${p.ent.holding}) : la décision peut se prendre au niveau de la holding.`]);
  if(p.ent?.ca)sig.push(['💶',`CA ${p.ent.ca}${p.ent.resultat?' · résultat '+p.ent.resultat:''}`]);
  if(p.ent?.categorie==='PME'||!p.ent?.categorie)sig.push(['🧾','Facture électronique : réception obligatoire depuis le 1er sept. 2026, émission obligatoire au 1er sept. 2027 pour les PME et TPE. Argument scan / GED / dématérialisation.']);
  return{e,sig,angles:ANGLES[sec]||[],logi:LOGI[sec]||''}}
function briefHtml(p){if(!p.ent?.nom&&!p.ent?.enseigne)return'';const b=briefData(p);const open=S.briefOpen!==false;
  return `<section class="brief${open?'':' closed'}"><button class="brief-h" data-act="brieftg"><b>Avant l’appel</b><span>${b.e?`≈ ${b.e.postes} poste${b.e.postes>1?'s':''} · ≈ ${b.e.copieurs} copieur${b.e.copieurs>1?'s':''} · ≈ ${b.e.imprimantes} imprimante${b.e.imprimantes>1?'s':''}`:''}</span><i>${open?'Masquer':'Afficher'}</i></button>
   ${open?`<div class="brief-b">
    ${b.e?`<div class="kpis"><div><b>≈ ${b.e.n}</b><span>personnes</span></div><div><b>≈ ${b.e.postes}</b><span>postes</span></div><div><b>≈ ${b.e.copieurs}</b><span>copieur${b.e.copieurs>1?'s':''}</span></div><div><b>≈ ${b.e.imprimantes}</b><span>imprimante${b.e.imprimantes>1?'s':''}</span></div><div><b>≈ ${b.e.lignes}</b><span>lignes tél.</span></div></div><p class="bnote">Estimations d’après l’effectif et le secteur, préremplies dans les onglets avec la mention « estimé ». Fais-les confirmer : ça ouvre la discussion.</p>`:''}
    ${b.sig.length?`<ul class="sig">${b.sig.map(([i,t])=>`<li><span>${i}</span>${esc(t)}</li>`).join('')}</ul>`:''}
    ${anglesHtml(p)}
    ${b.logi?`<div class="lbl">Logiciels probables</div><p class="bnote" style="margin:0">${esc(b.logi)} : demande lequel ils utilisent.</p>`:''}
   </div>`:''}</section>`}
function applyRe(p,r,hint={}){
  const e=pickEtab(r,{...hint,cp:hint.cp||p.ent?.cp,adresse:hint.adresse||p.ent?.adresse});
  const before=structuredClone(p);const patch=reToPatch(r,e);
  const a=addrOf(e||r.siege);
  if(p.ent?.cp&&a.cp&&a.cp!==p.ent.cp&&!hint.siret&&!hint.force){for(const k of ['ent.adresse','ent.cp','ent.ville','ent.siret'])delete patch.set[k]}
  if(hint.siret)patch.set['ent.siret']=hint.siret;
  const ch=applyPatch(p,patch,!hint.soft);
  delete p.ent.nbEtabs;if(p.contacts?.length)p.contacts=p.contacts.filter(c=>!NOT_DIR.test(c.note||''));
  if(isGroup(r)){for(const k of ['ca','resultat','categorie','holding'])if(p.ent[k]!=null){delete p.ent[k];ch.push('ent.'+k)}
    const ef=patch.set['ent.effectif'];if(hint.soft&&(p.rne?.v||0)<3){if(ef)p.ent.effectif=ef;else if(e&&!e.est_siege)delete p.ent.effectif;if(p.est)for(const k of Object.keys(p.est)){setP(p,k,'');delete p.est[k]}}}
  if(e?.latitude&&!p.geo)p.geo={lat:+e.latitude,lon:+e.longitude};
  p.rne={status:'ok',siren:r.siren,at:iso(today()),actif:r.etat_administratif!=='C',v:4,tranche:etabTranche(r,e),annee:e?.annee_tranche_effectif_salarie||r.annee_tranche_effectif_salarie||'',installe:e?.date_creation||'',creation:r.date_creation||''};delete p.rneCands;
  ch.push(...applyEstimates(p));touch(p);markFlash(ch);
  return{r,e,ch,before}}
async function applyRne(p,num,hint={}){const res=await reSearch(num);const r=res.find(x=>x.siren===String(num).slice(0,9))||res[0];
  if(!r)throw{fr:'Ce numéro n’existe pas au registre. Vérifie les chiffres.'};return applyRe(p,r,hint)}

/* ---------- Identification ---------- */
const ADDR_RE=/\b\d{1,4}\s*(?:bis|ter)?,?\s+(?:rue|avenue|av\.?|bd|boulevard|place|pl\.?|all[ée]e|chemin|quai|impasse|route|cours|square|villa|passage|rond-point)\b/i;
function setId(p,o){S.id={pid:p.id,...o};renderIdentBox()}
function renderIdentBox(){const box=$('#ident-box');const p=cur();if(!box||!p)return;const v=$('#ident-in')?.value||'';box.outerHTML=identHtml(p);if(v&&$('#ident-in'))$('#ident-in').value=v}
async function identify(p,raw){
  const text=raw.trim();if(!text)return;const digits=text.replace(/[\s.\-]/g,'');
  setId(p,{busy:true,msg:'Recherche au registre…',keep:text});
  try{
    if(/^\d{14}$/.test(digits))return idDone(p,await applyRne(p,digits,{siret:digits,force:true}));
    if(/^\d{9}$/.test(digits))return idDone(p,await applyRne(p,digits,{}));
    if(/^(\+33|0)[1-9]\d{8}$/.test(digits)){p.ent=p.ent||{};p.ent.tel=digits.replace(/^\+33/,'0');touch(p);renderFiche();
      return setId(p,{msg:'Numéro enregistré. Aucun registre public ne retrouve une entreprise par son téléphone : ajoute son nom ou son adresse pour l’identifier.'})}
    if(text.length>140||text.split('\n').length>2){
      await analyze(p,text,{kind:'ident'});
      const sr=p.ent?.siren||(p.ent?.siret||'').slice(0,9);
      if(/^\d{9}$/.test(sr))return idDone(p,await applyRne(p,p.ent?.siret||sr,{siret:p.ent?.siret}));
      if(p.ent?.nom)return nameSearch(p,[p.ent.nom,p.ent.ville].filter(Boolean).join(' '),p.ent.cp||'');
      return setId(p,{msg:'Texte analysé. Aucun SIRET ni nom d’entreprise reconnu pour interroger le registre.'})}
    const loc=parseLocal(text,p);
    const noteish=Object.keys(loc.set).filter(k=>!/^ent\.(siret|siren|ville|cp|adresse|forme|site|email|tel)$/.test(k)).length+loc.contacts.length+loc.actions.length+(loc.statut?1:0);
    if(!loc.set['ent.siret']&&!loc.set['ent.siren']&&noteish>=2){setId(p,{});await commitNote(p,text,null);return setId(p,{msg:'Ce texte ressemble à une note : je l’ai analysée et rangée dans la fiche (voir les champs surlignés).'})}
    if(loc.set['ent.siret'])return idDone(p,await applyRne(p,loc.set['ent.siret'],{siret:loc.set['ent.siret'],force:true}));
    if(loc.set['ent.siren'])return idDone(p,await applyRne(p,loc.set['ent.siren'],{}));
    if(ADDR_RE.test(text))return addressSearch(p,text);
    const cp=(text.match(/\b(\d{5})\b/)||[])[1]||'';return nameSearch(p,text.replace(/\b\d{5}\b/,'').trim(),cp)
  }catch(e){setId(p,{msg:e?.fr||'Recherche impossible pour l’instant.'})}}
function idDone(p,{r,e,ch,before}){
  if($('#ident-in'))$('#ident-in').value='';const dup=dupOf(p.ent?.siret||p.ent?.siren,p.id);
  if(dup){renderFiche();renderList();return setId(p,{dup:dup.id,msg:`⚠ Ce SIRET est déjà en fiche : « ${displayName(dup)} ». Fusionne pour éviter le doublon (rien n’est perdu).`})}
  setId(p,{msg:`${nameOf(r)} identifiée${p.ent?.siret?' · SIRET '+fmtSiret(p.ent.siret):''}${r.etat_administratif==='C'?' · ATTENTION : entreprise fermée':''}. ${ch.length} champ${ch.length>1?'s':''} rempli${ch.length>1?'s':''}.`});
  renderFiche();renderList();toast(`${nameOf(r)} identifiée`,()=>{S.P.set(p.id,before);touch(before);S.id=null;renderFiche();renderList()});
  if(!p.ent?.tel)findPhoneUI(p)}
function rankRes(res,q,cp){const city=norm(q);return res.map(r=>({...r,_s:sim(q,r.nom_complet)*2+(cp&&etabsOf(r).some(e=>e.code_postal===cp)?2:0)+(etabsOf(r).some(e=>city.includes(norm(e.libelle_commune||'').split(/[\s-]/)[0]||'§'))?1.2:0)+(/^(75|77|78|91|92|93|94|95)/.test(r.siege?.code_postal||'')?0.3:0)+(r.etat_administratif==='C'?-2:0)})).sort((a,b)=>b._s-a._s)}
async function nameSearch(p,q,cp){
  const res=rankRes(await reSearch(q,{per_page:15}),q,cp).slice(0,8);
  if(!res.length){if(!p.ent?.nom){p.ent=p.ent||{};p.ent.nom=q;touch(p);renderFiche()}return setId(p,{msg:`Aucune entreprise « ${q} » au registre. Essaie le SIRET, l'adresse ou une autre orthographe.`})}
  setId(p,{cands:res.map(r=>({kind:'re',r})),msg:`${res.length} résultat${res.length>1?'s':''} au registre.`})}
async function addressSearch(p,text){
  const g=await geocode(/\b\d{5}\b|asni|paris|colombes|clichy|levallois|courbevoie|gennevilliers|nanterre/i.test(text)?text:text+' Asnières-sur-Seine');
  if(!g)return setId(p,{msg:'Adresse introuvable. Vérifie le numéro et la ville.'});
  const items=(await nearEtabs({lat:g.lat,lon:g.lon},30)).filter(x=>!x.hidden).slice(0,10);
  setId(p,{cands:[...items.map(x=>({kind:'etab',x})),{kind:'addr',g}],msg:items.length?`${items.length} entreprise${items.length>1?'s':''} enregistrée${items.length>1?'s':''} à ${g.label}.`:`Aucune entreprise enregistrée à ${g.label}.`})}
function pickCand(p,i){
  const st=S.id&&S.id.pid===p.id?S.id:{};const cands=st.cands?.length?st.cands:(p.rneCands||[]).map(c=>({kind:'sir',...c}));const c=cands[i];if(!c)return;
  if(c.kind==='addr'){p.ent=p.ent||{};Object.assign(p.ent,{adresse:[c.g.addr.num,c.g.addr.street].filter(Boolean).join(' '),cp:c.g.addr.cp,ville:c.g.addr.ville});p.geo={lat:c.g.lat,lon:c.g.lon};touch(p);S.id=null;renderFiche();return}
  if(c.kind==='re')return idDone(p,applyRe(p,c.r,{}));
  if(c.kind==='etab'){p.geo={lat:c.x.lat,lon:c.x.lon};return idDone(p,applyRe(p,c.x.r,{siret:c.x.e.siret,force:true}))}
  setId(p,{busy:true,msg:'Récupération de la fiche officielle…'});applyRne(p,c.siren,{}).then(x=>idDone(p,x)).catch(e=>setId(p,{msg:e?.fr||'Registre indisponible.'}))}

/* ---------- Autour de moi ---------- */
const GROUPS=[
 {k:'liberal',l:'Libéraux & conseil',t:n=>/^(69|70|71|72|73|74|78|62|63|58|82|66\.2)/.test(n)},
 {k:'sante',l:'Santé',t:n=>/^(86|75|47\.74|47\.78A)/.test(n)},
 {k:'immo',l:'Agences immo',t:n=>/^68\.3/.test(n)},
 {k:'resto',l:'Restaurants & hôtels',t:n=>/^(55|56)/.test(n)},
 {k:'commerce',l:'Commerces',t:n=>/^(45|46|47)/.test(n)},
 {k:'btp',l:'BTP & industrie',t:n=>/^(0\d|1\d|2\d|3[0-3]|41|42|43|49|5[0-3])/.test(n)},
 {k:'services',l:'Autres services',t:()=>true}];
const groupOf=naf=>GROUPS.find(g=>g.t(naf||''))?.k||'services';
const NAFLAB={'69.10Z':'Juridique','69.20Z':'Comptabilité','70.22Z':'Conseil','70.10Z':'Siège social','71.11Z':'Architecture','71.12B':'Ingénierie','73.11Z':'Publicité','74.10Z':'Design','78.10Z':'Recrutement','78.20Z':'Intérim','62.01Z':'Développement informatique','62.02A':'Conseil informatique','86.21Z':'Médecin généraliste','86.22C':'Médecin spécialiste','86.23Z':'Dentiste','86.90E':'Kiné / paramédical','86.90D':'Infirmier','75.00Z':'Vétérinaire','68.31Z':'Agence immobilière','68.32A':'Syndic / gestion','66.22Z':'Courtier / agent d’assurance','56.10A':'Restaurant','56.10C':'Restauration rapide','56.30Z':'Café / bar','55.10Z':'Hôtel','47.11B':'Supérette','47.11D':'Supermarché','47.24Z':'Boulangerie','47.73Z':'Pharmacie','47.78A':'Opticien','47.71Z':'Vêtements','96.02A':'Coiffure','96.02B':'Institut de beauté','85.59A':'Formation','85.59B':'Formation','88.91A':'Crèche','94.99Z':'Association','41.20A':'Construction','43.21A':'Électricité','43.22A':'Plomberie','43.39Z':'Travaux de finition','45.20A':'Garage auto','64.20Z':'Holding','68.20A':'Location de logements','68.20B':'Location immobilière'};
const nafLabel=n=>NAFLAB[n]||GROUPS.find(g=>g.k===groupOf(n))?.l||'';
function outOfTarget(x){const n=x.naf;if(/^64\.1/.test(n)||/^64\.19/.test(n))return'Banque';if(n==='47.73Z')return'Pharmacie';if(/^64\.(20|30)/.test(n))return'Holding';if(/^68\.20/.test(n))return'Location immobilière';return''}
function knownProspect(x){for(const p of S.P.values()){if(x.siret&&p.ent?.siret===x.siret)return p;if(x.siren&&p.ent?.siren===x.siren&&(!p.ent?.cp||p.ent.cp===x.adr.cp))return p}return null}
async function nearEtabs(pos,radius){
  const map=new Map();let page=1,pages=1;
  do{const u=`${RE}/near_point?lat=${pos.lat.toFixed(6)}&long=${pos.lon.toFixed(6)}&radius=${Math.max(0.01,radius/1000).toFixed(3)}&per_page=25&page=${page}`;
    const j=await getJSON(u);if(!j)break;pages=Math.min(j.total_pages||1,16);
    for(const r of (j.results||[])){const ets=(r.matching_etablissements&&r.matching_etablissements.length)?r.matching_etablissements:(r.siege?[r.siege]:[]);
      for(const e of ets){if(e.etat_administratif==='F'||!e.latitude||!e.longitude)continue;const lat=+e.latitude,lon=+e.longitude;const dist=haversine(pos,{lat,lon});if(dist>radius*1.2+15)continue;
        if(map.has(e.siret))continue;const naf=nafFmt(e.activite_principale||r.activite_principale);const adr=addrOf(e);
        const x={id:e.siret,siret:e.siret,siren:r.siren,r,e,lat,lon,dist,naf,adr,name:enseigneOf(r,e)||nameOf(r),denom:nameOf(r),forme:formeFromCode(r.nature_juridique),ei:String(r.nature_juridique)==='1000',siege:!!(e.est_siege||e.siret===r.siege?.siret),eff:effLabel(e.tranche_effectif_salarie||r.tranche_effectif_salarie)};
        x.group=groupOf(naf);x.out=outOfTarget(x);x.hidden=/Holding|Location immobilière/.test(x.out);map.set(e.siret,x)}}
    page++}while(page<=pages);
  return[...map.values()].sort((a,b)=>a.dist-b.dist)}
function parsePos(t){let m;
  if((m=t.match(/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/))||(m=t.match(/[?&](?:q|ll|query|daddr)=(-?\d{1,2}\.\d+)(?:,|%2C)\s*(-?\d{1,3}\.\d+)/i))||(m=t.match(/(-?\d{1,2}\.\d{3,})\s*[,;\s]\s*(-?\d{1,3}\.\d{3,})/))){let a=+m[1],b=+m[2];if(a<15&&b>35)[a,b]=[b,a];return{lat:a,lon:b}}
  if((m=t.match(/(\d{1,2})°\s*(\d{1,2})['’]\s*([\d.]+)"?\s*([NS])[,\s]+(\d{1,3})°\s*(\d{1,2})['’]\s*([\d.]+)"?\s*([EOW])/i))){const la=(+m[1]+m[2]/60+m[3]/3600)*(/S/i.test(m[4])?-1:1),lo=(+m[5]+m[6]/60+m[7]/3600)*(/[OW]/i.test(m[8])?-1:1);return{lat:la,lon:lo}}
  return null}
function A(){if(!S.around)S.around={radius:lsGet('radar-radius',50),groups:lsGet('radar-groups2',['liberal','sante','immo','services']),ei:lsGet('radar-ei',true),all:[],res:[],sel:new Set(),pos:null,busy:false,msg:'',batch:[]};return S.around}
function filterAround(){const a=A();a.res=a.all.filter(x=>!x.hidden&&a.groups.includes(x.group)&&(a.ei||!x.ei)).map(x=>({...x,known:knownProspect(x)?.id||''}));
  a.sel=new Set(a.res.filter(x=>!x.out&&!x.known).map(x=>x.id))}
let gpsBusy=false;
function tryGps(){const a=A();if(gpsBusy)return;
  if(!('geolocation' in navigator)){a.msg='Ce navigateur ne donne pas la position : tape l’adresse devant toi.';return renderAround()}
  gpsBusy=true;a.busy=true;a.msg='Localisation en cours…';renderAround();
  let best=null,finished=false,err='';
  const finish=async()=>{if(finished)return;finished=true;navigator.geolocation.clearWatch(wid);clearTimeout(t1);gpsBusy=false;
    if(!best){a.busy=false;a.msg=err||'Position introuvable. Active la localisation du téléphone, ou tape l’adresse devant toi.';renderAround();return}
    const c=best.coords;a.pos={lat:c.latitude,lon:c.longitude,acc:Math.round(c.accuracy),src:'gps',label:'Ma position'};renderAround();
    revgeo(a.pos).then(l=>{if(l&&a.pos&&a.pos.src==='gps'){a.pos.label=l;renderAround()}});await aroundRun()};
  const wid=navigator.geolocation.watchPosition(g=>{if(!best||g.coords.accuracy<best.coords.accuracy)best=g;a.msg=`Localisation… précision ±${Math.round(best.coords.accuracy)} m`;renderAround();if(best.coords.accuracy<=20)finish()},
    e=>{err=e.code===1?'La localisation est refusée pour Radar. Autorise-la dans les réglages du navigateur (icône à gauche de l’adresse, ou Réglages du téléphone → Safari/Chrome → Position).':'Signal GPS indisponible : active la localisation ou sors à découvert.';if(e.code===1)finish()},
    {enableHighAccuracy:true,maximumAge:0,timeout:15000});
  const t1=setTimeout(finish,9000)}
async function aroundSearch(raw){const a=A();const t=(raw??$('#pos-in')?.value??'').trim();
  a.busy=true;a.msg='Recherche de la position…';renderAround();
  try{let pos=parsePos(t);
    if(pos){pos.src='coord';pos.label=await revgeo(pos)||`${pos.lat.toFixed(5)}, ${pos.lon.toFixed(5)}`}
    else if(t){const g=await geocode(/\b\d{5}\b|asni|paris|colombes|clichy|levallois|courbevoie|gennevilliers|nanterre/i.test(t)?t:t+' Asnières-sur-Seine');if(!g)throw{fr:'Adresse introuvable. Ajoute le numéro et la ville.'};pos={lat:g.lat,lon:g.lon,label:g.label,src:'addr'}}
    else if(a.pos)pos=a.pos;else{a.busy=false;return tryGps()}
    a.pos=pos;await aroundRun()}
  catch(e){a.busy=false;a.msg=e?.fr||'Recherche impossible pour l’instant.';renderAround()}}
async function aroundRun(){const a=A();if(!a.pos)return;a.busy=true;a.msg=`Recherche des entreprises à ${a.radius} m…`;renderAround();
  try{a.all=await nearEtabs(a.pos,a.radius);filterAround();const hid=a.all.filter(x=>x.hidden).length;
    a.msg=a.res.length?`${a.res.length} entreprise${a.res.length>1?'s':''} à moins de ${a.radius} m${hid?` (${hid} holding${hid>1?'s':''} / SCI masquée${hid>1?'s':''})`:''}.`:`Aucune entreprise de ces types à moins de ${a.radius} m. Élargis le rayon ou coche d’autres types.`}
  catch(e){a.msg=e?.fr||'Recherche impossible pour l’instant.'}a.busy=false;renderAround()}
function aroundCreate(){const a=A();const items=a.res.filter(x=>a.sel.has(x.id));if(!items.length)return;const ids=[];
  let skip=0;for(const [i,x] of items.entries()){if(dupOf(x.e?.siret||x.siren)){skip++;continue}const p=blank('terrain');p.createdAt=Date.now()+i;applyPatch(p,reToPatch(x.r,x.e),true);p.rne={status:'ok',siren:x.siren,at:iso(today()),actif:true};p.geo={lat:x.lat,lon:x.lon};
    p.journal.push({id:rid(),date:new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,19),canal:'note',issue:'Repéré autour de moi',texte:`À ${Math.round(x.dist)} m de ${a.pos?.label||'ma position'}${x.naf?' · '+nafLabel(x.naf):''}`});
    p.actions.push({id:rid(),type:'Visite',date:iso(today()),heure:'',note:'Passer sur place',fait:false,createdAt:Date.now()});
    S.P.set(p.id,p);touch(p);ids.push(p.id)}
  a.batch=ids;S.lastBatch=ids;filterAround();a.msg=`${ids.length} fiche${ids.length>1?'s':''} créée${ids.length>1?'s':''}, déjà identifiée${ids.length>1?'s':''} au registre (SIRET, adresse, dirigeants).${skip?` ${skip} déjà en fiche, ignorée${skip>1?'s':''}.`:''}`;
  renderAround();toast(`${ids.length} fiches créées`);
  (async()=>{try{const pool=await overpassPhones(a.pos,a.radius+120);let n=0;for(const id of ids){const p=S.P.get(id);if(p&&!p.ent?.tel){const r=await findPhone(p,{pool});if(r.status==='ok')n++}}
    a.msg+=` ${n} numéro${n>1?'s':''} de standard trouvé${n>1?'s':''}.`;if(S.view==='around')renderAround();renderSoft(false)}catch{}})()}
function renderAround(){
  const el=$('#around');if(!el)return;const a=A();const n=a.res.filter(x=>a.sel.has(x.id)).length;const keep=$('#pos-in')?.value;
  el.innerHTML=`<div class="hello"><div><h1>Autour de moi</h1><p>Toutes les entreprises enregistrées autour de toi, y compris les cabinets à l'étage. Coche, puis crée leurs fiches en un geste.</p></div></div>
  <div class="card">
    <div class="ident-row"><button class="btn btn-loc" data-act="gps" ${a.busy?'disabled':''}>📍 ${a.pos?.src==='gps'?'Actualiser ma position':'Me localiser'}</button>
      <input class="in" id="pos-in" style="flex:1;min-width:200px" placeholder="ou une adresse (« 12 rue de la Station »)" value="${esc(keep??'')}" enterkeyhint="search">
      <button class="btn btn-g" data-act="aroundgo" ${a.busy?'disabled':''}>Chercher</button></div>
    <div class="ident-row"><span class="lbl">Rayon</span><div class="chips">${[25,50,100,200].map(r=>`<button class="chip" data-act="radius" data-v="${r}" aria-pressed="${a.radius===r}">${r} m</button>`).join('')}</div></div>
    <div class="ident-row"><span class="lbl">Types</span><div class="chips">${GROUPS.map(g=>`<button class="chip" data-act="grp" data-v="${g.k}" aria-pressed="${a.groups.includes(g.k)}">${g.l}</button>`).join('')}<button class="chip" data-act="eitog" aria-pressed="${a.ei}">Indépendants (EI)</button></div></div>
    ${a.pos?`<div class="posline"><span>📍 ${esc(a.pos.label)}</span>${a.pos.acc?`<span class="mono">GPS ±${a.pos.acc} m</span>`:''}${a.pos.acc>60?'<span style="color:var(--warn)">précision faible : les résultats peuvent être décalés</span>':''}</div>`:''}
    ${a.msg||a.busy?`<div class="ai" data-s="${a.busy?'busy':''}">${a.busy?'<span class="spin"></span>':''}<span>${esc(a.msg)}</span></div>`:''}
  </div>
  ${a.res.length?`<div class="card"><h2>${a.res.length} entreprise${a.res.length>1?'s':''} <span style="display:flex;gap:6px"><button class="btn btn-q btn-s" data-act="selall">Tout</button><button class="btn btn-q btn-s" data-act="selnone">Rien</button></span></h2>
    <div class="plist">${a.res.map(x=>`<label class="prow${x.out||x.known?' dim':''}"><input type="checkbox" data-act="selone" data-id="${esc(x.id)}" ${a.sel.has(x.id)?'checked':''}>
      <span style="min-width:0"><b>${esc(x.name)}</b><small>${esc([nafLabel(x.naf),x.forme,x.eff&&x.eff+' sal.'].filter(Boolean).join(' · '))}</small><small>${esc(x.adr.rue)}${x.name!==x.denom?` · ${esc(x.denom)}`:''}</small>
      ${x.known?`<button class="tag ok" data-act="open" data-id="${x.known}">Déjà en fiche →</button>`:x.out?`<span class="tag">${esc(x.out)}</span>`:''}</span><em class="num">${Math.round(x.dist)} m</em></label>`).join('')}</div>
    <div class="createbar"><span>${n} sélectionnée${n>1?'s':''}</span>${a.batch.length?`<button class="btn btn-g" data-act="filter" data-v="batch">Voir les fiches créées</button>`:''}<button class="btn btn-p" data-act="aroundcreate" ${n?'':'disabled'}>Créer ${n} fiche${n>1?'s':''}</button></div>
    <p style="margin:0;font-size:12px;color:var(--ink-3)">Source : registre public des entreprises (INSEE / RNE, via recherche-entreprises.api.gouv.fr). Les adresses enregistrées peuvent dater : vérifie sur place.</p></div>`:''}`}

/* ---------- Suggestions pendant la frappe ---------- */
const SG={input:null,items:[],idx:-1};let sugT=null,sugCtl=null;
function sgShow(input,html){let b=$('#sugg');if(!b){b=document.createElement('div');b.id='sugg';b.className='sugg';b.setAttribute('role','listbox');document.body.append(b);b.addEventListener('mousedown',e=>e.preventDefault())}
  const r=input.getBoundingClientRect();const w=Math.min(Math.max(r.width,300),innerWidth-16);b.style.width=w+'px';b.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px';b.style.top=(r.bottom+4)+'px';b.innerHTML=html;b.hidden=false;SG.input=input}
function sgHide(){const b=$('#sugg');if(b)b.hidden=true;SG.items=[];SG.idx=-1}
function sgMark(){$$('#sugg .sg-i').forEach((x,i)=>x.classList.toggle('on',i===SG.idx));$('#sugg .sg-i.on')?.scrollIntoView({block:'nearest'})}
async function suggest(input){const p=cur();if(!p||document.activeElement!==input)return;const q=input.value.trim();
  if(q.length<3||q.includes('\n')||q.length>90){sgHide();return}
  const digits=q.replace(/[\s.\-]/g,'');
  if(/^\d+$/.test(digits)){sgHide();if((digits.length===9||digits.length===14)&&(p.ent?.siren!==digits.slice(0,9)||p.rne?.status!=='ok'))identify(p,digits);return}
  sugCtl?.abort();const ctl=sugCtl=new AbortController();sgShow(input,`<div class="sg-msg"><span class="spin"></span>Recherche au registre…</div>`);
  try{const cp=(q.match(/\b\d{5}\b/)||[])[0]||p.ent?.cp||'';const res=rankRes(await reSearch(q.replace(/\b\d{5}\b/,'').trim()||q,{per_page:12,signal:ctl.signal}),q+' '+(p.ent?.ville||''),cp).slice(0,7);
    if(ctl.signal.aborted||document.activeElement!==input)return;
    SG.items=res;SG.idx=res.length?0:-1;
    sgShow(input,res.length?res.map((r,i)=>{const e=pickEtab(r,{cp});const a=addrOf(e||r.siege);return `<button class="sg-i${i===0?' on':''}" role="option" data-act="sgpick" data-i="${i}"><b>${esc(nameOf(r))}</b><span>${esc([formeFromCode(r.nature_juridique),[a.cp,a.ville].filter(Boolean).join(' '),nafLabel(nafFmt(r.activite_principale)),r.etat_administratif==='C'?'fermée':''].filter(Boolean).join(' · '))}</span><em>${esc(fmtSiret(r.siren))}</em></button>`}).join('')+`<div class="sg-foot">Entrée pour choisir · registre officiel des entreprises</div>`
      :`<div class="sg-msg">Aucune entreprise « ${esc(q)} » au registre. Essaie une autre orthographe ou le SIRET.</div>`)}
  catch(e){if(e?.name==='AbortError'||ctl.signal.aborted)return;sgShow(input,`<div class="sg-msg">${esc(e?.fr||'Registre indisponible pour l’instant.')}</div>`)}}
function sgPick(i){const r=SG.items[i];const p=cur();if(!r||!p)return;sgHide();sugCtl?.abort();if(S.tab!=='ent'){S.tab='ent';renderFiche()}idDone(p,applyRe(p,r,{}))}
document.addEventListener('focusout',e=>{if(e.target===SG.input)setTimeout(()=>{if(document.activeElement!==SG.input)sgHide()},150)});
window.addEventListener('scroll',e=>{if(!e.target?.closest?.('#sugg'))sgHide()},true);

/* ================= Compte rendu automatique ================= */
const canalOf=p=>p.source==='terrain'?'Terrain':'Téléphonique';
const srcLabel=p=>({tel:'Téléphone',terrain:'Terrain',linkedin:'LinkedIn'}[p.source]||p.source||'Téléphone');
const val=v=>Array.isArray(v)?v.join(', '):/^\d{4}-\d{2}$/.test(String(v||''))?fmtMonth(v):String(v??'');
const CAL_TYPES=['RDV','Rappel','Appel','Relance','Visite'];
/* ================= Notes corrigées (lisibles) ================= */
/* Abréviations → forme écrite (avec accents) */
const DISP={rdv:'RDV',rdz:'RDV',rv:'RDV',dg:'DG',daf:'DAF',dsi:'DSI',drh:'DRH',pdg:'PDG',rh:'RH',rgpd:'RGPD',nrp:'pas de réponse',pi:'pas intéressé',mme:'Mme',mlle:'Mlle',
 ajd:"aujourd'hui",auj:"aujourd'hui",dem:'demain',dmn:'demain',dm1:'demain',dem1:'demain','2m1':'demain',apdem:'après-demain',pr:'pour',tt:'tout',ts:'tous',tjr:'toujours',tjrs:'toujours',tjs:'toujours',qd:'quand',bcp:'beaucoup',
 pb:'problème',pbm:'problème',pblm:'problème',prob:'problème',pbs:'problèmes',msg:'message',msgs:'messages',rep:'répondeur',ds:'dans',avt:'avant',apr:'après',ac:'avec',avc:'avec',jsp:'ne sait pas',nsp:'ne sait pas',mtn:'maintenant',
 ordi:'ordinateur',ordis:'ordinateurs',ordo:'ordinateur',ordos:'ordinateurs',imp:'imprimante',imps:'imprimantes',photocop:'photocopieur',multif:'multifonction',
 sauv:'sauvegarde',sauvg:'sauvegarde',svg:'sauvegarde',bkp:'sauvegarde',antivir:'antivirus',fw:'pare-feu',presta:'prestataire',prestas:'prestataires',prest:'prestataire',
 info:'informatique',infor:'informatique',inf:'informatique',std:'standard',stand:'standard',ope:'opérateur',op:'opérateur',mob:'mobiles',mobs:'mobiles',
 sal:'salariés',sala:'salariés',salar:'salariés',sals:'salariés',perso:'personnes',persos:'personnes',pers:'personnes',pax:'personnes',ppl:'personnes',collab:'collaborateurs',collabs:'collaborateurs',colab:'collaborateurs',colabs:'collaborateurs',
 empl:'employés',util:'utilisateurs',utils:'utilisateurs',ger:'gérant',dirlo:'dirigeant',dirl:'dirigeant',dir:'directeur',dirco:'directeur',sec:'secrétaire',secr:'secrétaire',secre:'secrétaire',secreta:'secrétaire',
 assist:'assistante',assis:'assistante',compta:'comptable',resp:'responsable',inter:'intéressé',interes:'intéressé',insat:'insatisfait',sat:'satisfait',moy:'moyen',
 loc:'location',locat:'location',leas:'leasing',ctr:'contrat',ctrt:'contrat',cntrt:'contrat',ctrat:'contrat',eng:'engagement',engag:'engagement',engmt:'engagement',doc:'documentation',docs:'documentation',plaq:'plaquette',
 relan:'relance',rapl:'rappeler',rpl:'rappeler',rapel:'rappeler',rapeler:'rappeler',rapell:'rappeler',rapeller:'rappeler',rappl:'rappeler',rappele:'rappeler',rapele:'rappeler',rap:'rappeler',
 dispo:'disponible',abs:'absent',sem:'semaine',proch:'prochaine',aprem:'après-midi',apm:'après-midi',qques:'quelques',qq:'quelques',ste:'société',soc:'société',cab:'cabinet',ya:'il y a',
 copi:'copieur',cop:'copieur',coul:'couleur',ss:'sans',w10:'Windows 10',w11:'Windows 11',w7:'Windows 7',fact:'facture',abo:'abonnement',mens:'mensuel',maint:'maintenance',serv:'serveur',
 secu:'sécurité',cybr:'cyber',demat:'dématérialisation',renouv:'renouvellement',ech:'échéance',mr:'M.',m365:'Microsoft 365',o365:'Microsoft 365',ms365:'Microsoft 365',tel:'tél.',tél:'tél.',env:'envoyer',
 infogere:'infogérance',infog:'infogérance',rx:'réseau',vx:'veux',veu:'veut',stp:"s'il te plaît",dc:'donc',pcq:'parce que',psk:'parce que',bjr:'bonjour',slt:'salut',mm:'même',
};
/* Mots corrigés sans accent → forme accentuée */
const ACC={batiment:'bâtiment',batiments:'bâtiments',interphone:'interphone',hopital:'hôpital',chateau:'château',etablissement:'établissement',etablissements:'établissements',maniere:'manière',frere:'frère',pere:'père',mere:'mère',fete:'fête',vehicule:'véhicule',vehicules:'véhicules',probleme:'problème',problemes:'problèmes',securite:'sécurité',cybersecurite:'cybersécurité',telephone:'téléphone',telephones:'téléphones',telephonie:'téléphonie',telephonique:'téléphonique',
 operateur:'opérateur',operateurs:'opérateurs',salaries:'salariés',salarie:'salarié',employes:'employés',employe:'employé',interesse:'intéressé',interessee:'intéressée',interesses:'intéressés',interessant:'intéressant',interessante:'intéressante',
 gerant:'gérant',gerante:'gérante',secretaire:'secrétaire',associe:'associé',associee:'associée',president:'président',presidente:'présidente',echeance:'échéance',reseau:'réseau',reseaux:'réseaux',societe:'société',
 demenagement:'déménagement',demenage:'déménage',deja:'déjà',tres:'très',apres:'après',mecontent:'mécontent',mecontente:'mécontente',prevu:'prévu',prevue:'prévue',repondeur:'répondeur',reunion:'réunion',conges:'congés',
 decembre:'décembre',fevrier:'février',aout:'août',decide:'décide',decideur:'décideur',decision:'décision',etude:'étude',telecom:'télécom',telecoms:'télécoms',dematerialisation:'dématérialisation',numerique:'numérique',
 materiel:'matériel',reactif:'réactif',reactive:'réactive',reponse:'réponse',repond:'répond',deplace:'déplacé',interet:'intérêt',equipe:'équipe',equipes:'équipes',equipement:'équipement',equipements:'équipements',
 ecran:'écran',ecrans:'écrans',ete:'été',debut:'début',deuxieme:'deuxième',premiere:'première',derniere:'dernière',dernier:'dernier',prefere:'préfère',preference:'préférence',general:'général',generale:'générale',
 eleve:'élevé',elevee:'élevée',recent:'récent',recente:'récente',renouvele:'renouvelé',a_voir:'à voir',beneficie:'bénéficie',besoin:'besoin',televiseur:'téléviseur',cle:'clé',delai:'délai',delais:'délais',
 depuis:'depuis',deja_vu:'déjà vu',controle:'contrôle',systeme:'système',systemes:'systèmes',logiciel:'logiciel',acces:'accès',succes:'succès',precis:'précis',presentation:'présentation',evenement:'événement',
 rappele:'rappelé',appele:'appelé',envoye:'envoyé',signe:'signé',passe:'passé',pret:'prêt',prete:'prête',bientot:'bientôt',meme:'même',theorie:'théorie',etage:'étage',zero:'zéro',fenetre:'fenêtre',
 telephoner:'téléphoner',rappeler:'rappeler',reflechir:'réfléchir',reflechit:'réfléchit',reflexion:'réflexion',mitige:'mitigé',mitigee:'mitigée',defaut:'défaut',probablement:'probablement',deplacement:'déplacement',
 resilier:'résilier',resiliation:'résiliation',penalite:'pénalité',penalites:'pénalités',tresorerie:'trésorerie',ecole:'école',cafe:'café',entree:'entrée',televerse:'téléversé',numero:'numéro',numeros:'numéros',
 tiede:'tiède',hesite:'hésite',hesitant:'hésitant',hesitante:'hésitante',agree:'agréé',dedie:'dédié',dediee:'dédiée',expire:'expire',termine:'terminé',terminee:'terminée',plutot:'plutôt',apres_midi:'après-midi'};
const BRAND={canon:'Canon',ricoh:'Ricoh',konica:'Konica',minolta:'Minolta',xerox:'Xerox',kyocera:'Kyocera',sharp:'Sharp',toshiba:'Toshiba',hp:'HP',epson:'Epson',lexmark:'Lexmark',
 avast:'Avast',avg:'AVG',eset:'ESET',kaspersky:'Kaspersky',bitdefender:'Bitdefender',sophos:'Sophos',norton:'Norton',mcafee:'McAfee',defender:'Defender',sentinelone:'SentinelOne',
 fortinet:'Fortinet',fortigate:'FortiGate',stormshield:'Stormshield',watchguard:'WatchGuard',meraki:'Meraki',orange:'Orange',sfr:'SFR',bouygues:'Bouygues',ovh:'OVH',nordnet:'Nordnet',
 grenke:'Grenke',leasecom:'Leasecom',locam:'Locam',franfinance:'Franfinance',microsoft:'Microsoft',teams:'Teams',outlook:'Outlook',windows:'Windows',google:'Google',gmail:'Gmail',onedrive:'OneDrive',sharepoint:'SharePoint',dropbox:'Dropbox',
 '3cx':'3CX',nas:'NAS',adsl:'ADSL',vdsl:'VDSL','4g':'4G','5g':'5G',pc:'PC',pcs:'PC',wifi:'Wi-Fi',vpn:'VPN',ipbx:'IPBX',pabx:'PABX',voip:'VoIP',mfa:'MFA','2fa':'2FA',edr:'EDR',ged:'GED',ia:'IA',
 genapi:'Genapi',inot:'iNot',doctolib:'Doctolib',sage:'Sage',cegid:'Cegid',ebp:'EBP',pennylane:'Pennylane',silae:'Silae',septeo:'Septeo',
 lundi:'lundi',mardi:'mardi',mercredi:'mercredi',jeudi:'jeudi',vendredi:'vendredi','wi-fi':'Wi-Fi'};
const CIV_RE=/^(m\.|mr\.?|mme|mlle|me|dr\.?|monsieur|madame|maitre|maître|docteur)$/i;
function cleanToken(tok,prev){
  if(/^\d/.test(tok)||/@|\//.test(tok))return tok; /* chiffres, heures, e-mails, dates : tels quels */
  const low=tok.toLowerCase(),n=norm(tok);
  if(prev&&CIV_RE.test(prev))return tok[0].toUpperCase()+tok.slice(1); /* nom après M. / Mme */
  if(BRAND[n])return BRAND[n];
  const cap=tok!==low&&tok.slice(1)===low.slice(1); /* « Pb », « Rdv » en début de note */
  if(tok===low||cap){if(DISP[n]!=null)return DISP[n];if(ACC[n])return ACC[n]}
  if(tok!==low)return tok; /* nom propre ou sigle : on garde */
  if(/-/.test(tok))return tok.split('-').map(x=>x?cleanToken(x,''):x).join('-');
  if(/[à-ÿ]/i.test(tok)&&tok!==n)return tok; /* déjà accentué */
  const fx=fixWord(n);if(fx===n)return tok;return fx.split(' ').map(w=>ACC[w]||w).join(' ')}
function cleanClause(raw){
  let s=String(raw||'').replace(/\s+/g,' ').trim().replace(/^[•›\-–—*·]+\s*/,'').replace(/\bav\s+(?=(avast|avg|eset|kaspersky|bitdefender|norton|mcafee|sophos|defender|windows defender)\b)/i,'antivirus ');if(!s)return'';
  let prev='';s=s.replace(/[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9'’.@\/-]*/g,(m,off,str)=>{
    const core=m.replace(/[.]+$/,''),tail=m.slice(core.length);let out;
    const lc=core.toLowerCase();
    if((lc==='m'||lc==='mr')&&!/\d/.test(prev)&&(tail||/^\s+[A-Za-zÀ-ÿ]{2,}/.test(str.slice(off+m.length)))){prev='m.';return 'M.'}
    if(lc==='dr'&&tail){prev='dr.';return 'Dr'}
    const ap=core.match(/^((?:[ldjmnstc]|qu|jusqu|lorsqu|puisqu)['’])(.+)$/i);
    if(ap)out=ap[1]+cleanToken(ap[2],prev);else if(/['’]/.test(core))out=core;else out=cleanToken(core,prev);
    prev=core;return out+tail});
  s=s.replace(/\s+([,;:!?])/g,'$1').replace(/\s{2,}/g,' ').trim();
  return s.charAt(0).toUpperCase()+s.slice(1)}
const SPLIT_RE=/\n|;|(?<!\d),(?!\d)|(?<!\b(?:M|m|Mr|mr|Dr|dr|Me|St|st|av|bd|tél|tel|cf|etc|ex|env|n°|No|no))\.(?!\d)(?=\s|$)|\s[-–—]\s|\s\/\s|\s\+\s/;
/* Note brute → liste de phrases propres, sans doublon */
function cleanNote(text){
  const out=[],seen=new Set();
  for(const raw of String(text||'').split(SPLIT_RE)){
    const c=cleanClause(raw);if(!c||c.length<2)continue;const k=norm(c).replace(/[^a-z0-9]/g,'');if(!k||seen.has(k))continue;seen.add(k);out.push(c)}
  return out}
const nkey=s=>norm(s).replace(/[^a-z0-9]/g,'');
/* Ajoute des lignes en évitant les doublons (même phrase, ou phrase incluse dans une autre déjà dite) */
function dedupPush(arr,lines,seen){for(const l of lines){const k=nkey(l);if(!k||k.length<3)continue;if([...seen].some(x=>x===k||(k.length>=8&&x.includes(k))))continue;seen.add(k);arr.push(l)}return arr}

/* Ce qui, dans une note, ne rentre dans aucune case de la fiche → « Notes entreprise » */
const USED_RE=/\b(rdv|rendez|rappel|relanc|nrp|repondeur|barrage|filtr|interess|pas le temps|devis|mail|plaquette|documentation|repasser|revenir|chaud|tiede|froid|budget|decid|siege|urgen|projet|demenag|recrut|concurren|travaill|salarie|personne|poste|collaborat|effectif|equipe|gerant|dirigeant|directeur|directrice|assistant|secretaire|associe|comptab|office manager|accueil|standard|absent|siret|siren|monsieur|madame|parle|rencontr|interlocut|prestataire|fournisseur|informati|notaire|avocat|medic|medecin|kine|architect|immobil|assuran|association|restaurant|transport|copieur|imprim|impression|toner|leasing|location|loue|sauvegard|antivir|pare-feu|firewall|serveur|reseau|wifi|fibre|adsl|internet|telephon|mobile|ligne|operateur|orange|sfr|bouygues|ovh|microsoft|logiciel|cloud|cyber|securite|satisf|content|probleme|souci|panne|lent|cher|contrat|engagement|abonnement|factur|janvier|fevrier|mars|avril|juin|juillet|aout|septembre|octobre|novembre|decembre|demain|lundi|mardi|mercredi|jeudi|vendredi|semaine|mois|annee|ordinateur|ecran|materiel|messagerie|outlook|teams)|\b(dg|daf|dsi|pdg|drh|rh|ko|ok|fin|mai|btp|pc|nas|free|rue|avenue|boulevard|av|bd)\b/;
function leftovers(text){
  const out=[];
  for(const raw of String(text||'').split(SPLIT_RE)){
    const r=raw.trim();if(r.split(/\s+/).length<2||/\b\d{1,2}\s?h(\d{2})?\b|\b\d{1,2}[\/.-]\d{1,2}\b|\b\d+\s?(j|jours?|sem|mois|ans?)\b|\b\d+\s?(k|€|eur)/i.test(r))continue;const c=canon(r);
    if(Object.values(TOPIC).some(re=>re.test(c))||INTEREST.test(c)||INSAT.test(c)||SAT.test(c)||MID.test(c)||USED_RE.test(c))continue;
    if(/(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}|@|\b\d{5}\b|\b(M\.|Mme|Mr)\s/.test(r))continue;
    const cl=cleanClause(r);if(cl)out.push(cl)}
  return out}

/* ================= Compte rendu (lisible, daté, sans doublon) ================= */
function jDate(s){const m=String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);return m?new Date(+m[1],+m[2]-1,+m[3],+(m[4]||0),+(m[5]||0)):null}
function longDate(d,withTime=true){if(!d)return'';return `${JOURS[d.getDay()]} ${d.getDate()} ${MOISL[d.getMonth()]} ${d.getFullYear()}`+(withTime&&(d.getHours()||d.getMinutes())?` à ${d.getHours()}h${pad(d.getMinutes())}`:'')}
const jLines=j=>Array.isArray(j?.propre)&&j.propre.length?j.propre:cleanNote(j?.texte||'');
function crModel(p){
  const e=p.ent||{},b=p.besoins||{};const seen=new Set();
  const J=(p.journal||[]).slice().sort((x,y)=>x.date<y.date?1:-1);
  const last=J.find(j=>j.canal==='tel'||j.canal==='terrain')||J[0]||null;const ld=jDate(last?.date);
  const quoi=last?.canal==='terrain'||(!last&&p.source==='terrain')?'Visite':'Appel';
  const head=last?`${quoi} du ${longDate(ld)}${last.issue?' · '+last.issue:''}${last.duree?' · durée '+last.duree:''}`:`Fiche créée le ${longDate(new Date(p.createdAt||Date.now()),false)} · aucun appel enregistré`;
  const etat=[ST[p.statut]?.l,TEMPS.find(x=>x.k===p.temperature)?.l].filter(x=>x&&!(last?.issue||'').includes(x)).join(' · ');
  const S_=[];
  /* Entreprise : l'essentiel seulement */
  const ent=[[e.secteur,e.effectif&&e.effectif+' salariés sur le site',[e.cp,e.ville].filter(Boolean).join(' ')].filter(Boolean).join(' · '),
    e.tel&&'Standard : '+fmtTel(e.tel),e.email&&'E-mail : '+e.email,e.site&&'Site : '+e.site].filter(Boolean);
  if(ent.length)S_.push({h:'Entreprise',items:ent.map(t=>({t}))});
  /* Ce qui s'est dit : dernier échange, puis les précédents */
  const said=[];if(last)dedupPush(said,jLines(last),seen);
  if(said.length)S_.push({h:`Ce qui s'est dit${ld?' le '+ld.getDate()+' '+MOISL[ld.getMonth()]:''}`,items:said.map(t=>({t}))});
  const prev=J.filter(j=>j!==last&&(j.texte||j.issue)).slice(0,4);
  const prevItems=prev.map(j=>{const L=dedupPush([],jLines(j),seen);const d=jDate(j.date);const ld2=d?longDate(d):'';return{t:`${ld2.charAt(0).toUpperCase()+ld2.slice(1)}${j.issue?' — '+j.issue:''}`,sub:L.join(' · ')}}).filter(x=>x.t||x.sub);
  if(prevItems.length)S_.push({h:'Autres échanges',items:prevItems});
  /* Interlocuteurs, avec leurs notes corrigées et sans redite */
  const cs=(p.contacts||[]).filter(c=>c.nom||c.prenom||c.fonction||c.tel||c.mobile||c.email||c.note);
  if(cs.length)S_.push({h:'Interlocuteur'+(cs.length>1?'s':''),items:cs.map(c=>{const nm=[c.civ,c.prenom,c.nom].filter(Boolean).join(' ')||'Interlocuteur';
    const notes=dedupPush([],cleanNote(c.note||''),seen);
    return{t:`${nm}${c.fonction?' ('+c.fonction+')':''}${c.decideur==='Oui'?' — décideur':c.decideur==='Influenceur'?' — influenceur':''}`,
      sub:[[fmtTel(c.tel||''),fmtTel(c.mobile||''),c.email].filter(Boolean).join(' · '),notes.length?'Note : '+notes.join(' ; '):''].filter(Boolean).join('\n')}})});
  /* Besoins et situation */
  const det=crDetails(p);const bes=[];
  if((b.sel||[]).length)bes.push({t:'Besoins : '+b.sel.join(', ')});if(b.priorite)bes.push({t:'Échéance : '+b.priorite});if((b.declencheur||[]).length)bes.push({t:'Déclencheurs : '+b.declencheur.join(', ')});
  if(b.decision)bes.push({t:'Décision : '+b.decision});if(b.budget)bes.push({t:'Budget : '+b.budget});if((b.concurrents||[]).length)bes.push({t:'En place / consultés : '+b.concurrents.join(', ')});
  det.forEach(([k,v])=>bes.push({t:`${k} : ${v}`}));
  if(bes.length)S_.push({h:'Besoins et situation',items:bes});
  /* À noter : notes de la fiche (entreprise, besoins, domaines), corrigées, sans doublon */
  const misc=[];for(const [l,v] of [['',e.notes],['',b.notes],['Informatique',p.it?.notes],['Impression',p.impr?.notes],['Télécom',p.tel?.notes],['Cyber',p.cyber?.notes]]){
    const L=dedupPush([],cleanNote(v||''),seen);L.forEach(x=>misc.push({t:(l?l+' : ':'')+x}))}
  if(misc.length)S_.push({h:'À noter',items:misc});
  /* Prochaines étapes */
  const t=iso(today());
  const ag=(p.actions||[]).filter(a=>!a.fait&&ATYPES.includes(a.type)).sort((x,y)=>((x.date||'9')+(x.heure||''))<((y.date||'9')+(y.heure||''))?-1:1)
    .map(a=>({a,t:`${a.type} : ${a.date?longDate(jDate(a.date),false):'sans date'}${a.heure?' à '+a.heure.replace(':00','h').replace(':','h'):''}${a.date&&a.date<t?' (en retard)':''}`,sub:a.note?(/^RDV\b/.test(a.note)?a.note:dedupPush([],[cleanClause(a.note)],seen)[0]||''):''}));
  S_.push({h:'Prochaines étapes',items:ag.length?ag:[{t:'Rien de planifié'}]});
  return{titre:`COMPTE RENDU — ${displayName(p).toUpperCase()}`,head,etat,canal:canalOf(p),sections:S_}}
function crDetails(p){const est=k=>p.est?.[k];const out=[];
  const imp=[!est('impr.nb')&&p.impr?.nb&&p.impr.nb+' copieur'+(p.impr.nb>1?'s':''),p.impr?.nbImprimantes&&!est('impr.nbImprimantes')&&p.impr.nbImprimantes+' imprimante'+(p.impr.nbImprimantes>1?'s':''),val(p.impr?.marques||''),p.impr?.mode,p.impr?.loueur,p.impr?.prestataire&&'fournisseur : '+p.impr.prestataire,p.impr?.finContrat&&'fin de contrat '+fmtMonth(p.impr.finContrat),p.impr?.satisfaction&&p.impr.satisfaction.toLowerCase(),filled(p.impr?.irritants)&&'irritants : '+val(p.impr.irritants).toLowerCase()].filter(Boolean);
  if(imp.length)out.push(['Impression',imp.join(' · ')]);
  const it=[!est('it.postes')&&p.it?.postes&&p.it.postes+' postes',p.it?.prestataire?'prestataire : '+p.it.prestataire:p.it?.aPresta==='Non'?'pas de prestataire':'',p.it?.contrat,p.it?.satisfaction&&p.it.satisfaction.toLowerCase(),filled(p.it?.serveur)&&'serveur : '+val(p.it.serveur),filled(p.it?.cloud)&&val(p.it.cloud),filled(p.it?.reseau)&&val(p.it.reseau),p.it?.logiciels&&'logiciels : '+p.it.logiciels].filter(Boolean);
  if(it.length)out.push(['Informatique',it.join(' · ')]);
  const cy=[filled(p.cyber?.antivirus)&&'antivirus : '+val(p.cyber.antivirus),filled(p.cyber?.sauvegarde)&&'sauvegarde : '+val(p.cyber.sauvegarde),p.cyber?.firewall&&'pare-feu : '+p.cyber.firewall,p.cyber?.mfa&&'double authentification : '+p.cyber.mfa.toLowerCase(),filled(p.cyber?.incident)&&'incident : '+val(p.cyber.incident),p.cyber?.prestataire&&'prestataire : '+p.cyber.prestataire].filter(Boolean);
  if(cy.length)out.push(['Cybersécurité',cy.join(' · ')]);
  const te=[filled(p.tel?.operateur)&&val(p.tel.operateur),p.tel?.prestataire&&'prestataire : '+p.tel.prestataire,p.tel?.lignesFixes&&p.tel.lignesFixes+' lignes fixes',p.tel?.lignesMobiles&&p.tel.lignesMobiles+' mobiles',p.tel?.standard,filled(p.tel?.internet)&&val(p.tel.internet),p.tel?.finEngagement&&'fin d’engagement '+fmtMonth(p.tel.finEngagement),p.tel?.facture&&'facture '+p.tel.facture,p.tel?.satisfaction&&p.tel.satisfaction.toLowerCase()].filter(Boolean);
  if(te.length)out.push(['Télécom',te.join(' · ')]);
  return out}
function crText(p){const m=crModel(p);const L=[m.titre,m.head+(m.etat?' · '+m.etat:''),''];
  for(const s of m.sections){L.push(s.h.toUpperCase());for(const it of s.items){L.push('- '+it.t);if(it.sub)it.sub.split('\n').forEach(x=>x&&L.push('   '+x))}L.push('')}
  while(L.length&&!L.at(-1))L.pop();return L.join('\n')}
function crHtml(p){const m=crModel(p);
  return `<div class="panel cr"><div class="cr-head"><div><div class="lbl">Compte rendu · rempli et corrigé automatiquement</div><h3>${esc(displayName(p))}</h3>
    <div class="cr-when">${esc(m.head)}</div>
    <div class="cr-tags"><span class="pill ${p.source==='terrain'?'st-rappel':'st-contacte'}">${esc(m.canal)}</span><span class="pill st-${p.statut}">${esc(ST[p.statut]?.l||'')}</span>${p.temperature?`<span class="pill">${esc(TEMPS.find(x=>x.k===p.temperature)?.l||'')}</span>`:''}</div></div>
    <button class="btn btn-p btn-s" data-act="copycr">Copier le compte rendu</button></div>
   ${m.sections.map(s=>`<section class="cr-sec"><h4>${esc(s.h)}</h4><ul class="cr-list">${s.items.map(it=>`<li${it.a&&it.a.date&&it.a.date<iso(today())?' class="late"':''}><span>${esc(it.t)}</span>${it.sub?`<span class="cr-sub">${esc(it.sub).replace(/\n/g,'<br>')}</span>`:''}${it.a&&it.a.date&&CAL_TYPES.includes(it.a.type)?calBtns(p,it.a):''}</li>`).join('')}</ul></section>`).join('')}
   <p class="cr-foot">Notes d’origine conservées telles quelles dans Suivi → Historique.</p>
  </div>`}

/* ================= Coordonnées : site, e-mail, pistes d'e-mail direct ================= */
const FREEMAIL=/@(gmail|hotmail|outlook|live|yahoo|orange|wanadoo|free|sfr|laposte|neuf|bbox|icloud|aol|msn)\./i;
function domainOf(p){const s=String(p.ent?.site||'').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').split(/[\/?#]/)[0];if(/^[a-z0-9.-]+\.[a-z]{2,}$/.test(s))return s;
  const em=[p.ent?.email,...(p.contacts||[]).map(c=>c.email)].find(x=>x&&!FREEMAIL.test(x));return em?em.split('@')[1].toLowerCase():''}
const slug=s=>norm(s).replace(/[^a-z\s-]/g,'').trim().replace(/\s+/g,'-');
function mailGuesses(c,dom){if(!dom||!c?.nom)return[];const n=slug(c.nom).replace(/-/g,''),pr=slug(c.prenom||'').replace(/-/g,'');
  return [...new Set([pr&&`${pr}.${n}@${dom}`,pr&&`${pr[0]}.${n}@${dom}`,pr&&`${pr[0]}${n}@${dom}`,`${n}@${dom}`,pr&&`${pr}@${dom}`].filter(Boolean))]}
function contactBox(p){const e=p.ent||{};const dom=domainOf(p);const nm=encodeURIComponent(p.ent?.enseigne||p.ent?.nom||'');
  const decs=(p.contacts||[]).filter(c=>c.nom&&!c.email).sort((x,y)=>(y.decideur==='Oui')-(x.decideur==='Oui'));
  const rows=[];
  if(e.site)rows.push(`<span><span class="lbl">Site</span> <a href="${esc(/^https?:/.test(e.site)?e.site:'https://'+e.site)}" target="_blank" rel="noopener">${esc(e.site.replace(/^https?:\/\//,''))}</a>${e.siteSource?` <small>(${esc(e.siteSource)})</small>`:''}</span>`);
  if(e.email)rows.push(`<span><span class="lbl">E-mail</span> <button class="lnk mono" data-act="copyv" data-v="${esc(e.email)}">${esc(e.email)}</button>${e.emailSource?` <small>(${esc(e.emailSource)})</small>`:''}</span>`);
  else if(dom)rows.push(`<span><span class="lbl">E-mail générique</span> <button class="lnk mono" data-act="copyv" data-v="contact@${esc(dom)}">contact@${esc(dom)}</button> <small>(à vérifier)</small></span>`);
  const guesses=decs.slice(0,2).map(c=>{const g=mailGuesses(c,dom);return g.length?`<div class="mg"><span class="lbl">E-mail direct possible · ${esc([c.prenom,c.nom].filter(Boolean).join(' '))}</span><span class="chips">${g.map(x=>`<button class="chip" data-act="copyv" data-v="${esc(x)}" title="Copier">${esc(x)}</button>`).join('')}</span><small>Formats les plus courants, à vérifier (aucun annuaire public ne donne les e-mails directs).</small></div>`:''}).join('');
  const links=`<a href="https://www.google.com/search?q=${encodeURIComponent((dom?'"@'+dom+'" ':'')+(p.ent?.enseigne||p.ent?.nom||''))}+email" target="_blank" rel="noopener">Chercher l’e-mail</a>${decs[0]?`<a href="https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent([decs[0].prenom,decs[0].nom,p.ent?.enseigne||p.ent?.nom].filter(Boolean).join(' '))}" target="_blank" rel="noopener">${esc(decs[0].nom)} sur LinkedIn</a>`:''}<a href="https://www.118712.fr/recherche/auto/${encodeURIComponent(p.ent?.ville||'')}/${nm}" target="_blank" rel="noopener">118 712</a>`;
  if(!rows.length&&!guesses&&!(p.ent?.nom||p.ent?.enseigne))return'';
  return `<div class="cbox">${rows.length?`<div class="cbox-r">${rows.join('')}</div>`:''}${guesses}<div class="links">${links}</div></div>`}

/* ================= Export Excel ================= */
let xlsxLib=null;
function loadExcel(){return loadLib('excel','https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js','ExcelJS')}
async function exportXlsx(opt={}){
  toast('Préparation du fichier Excel…');
  let X;try{X=await loadExcel()}catch{toast('Impossible de préparer Excel sans connexion internet. Réessaie avec du réseau.');return}
  const wb=new X.Workbook();wb.creator='Radar — Data Links';wb.created=new Date();
  const C={teal:'FF0B6B6A',tealSoft:'FFD9EFED',ink:'FF101823',grey:'FF4B5868',line:'FFD7DEE6',zebra:'FFF5F7F9',red:'FFCF4434',redSoft:'FFF9E1DD',amber:'FFC9821F',amberSoft:'FFF8EDDB',blue:'FF2F78BE',blueSoft:'FFE1EDF8',green:'FF2E8A4F',greenSoft:'FFDDF0E3',white:'FFFFFFFF',terrain:'FFCF4434'};
  const STC={nouveau:[C.grey,'FFEEF1F4'],contacte:[C.blue,C.blueSoft],rappel:[C.amber,C.amberSoft],rdv:[C.teal,C.tealSoft],rdv_fait:[C.teal,C.tealSoft],devis:['FF7B61C9','FFECE7F8'],gagne:[C.green,C.greenSoft],perdu:[C.red,C.redSoft],ko:[C.red,C.redSoft]};
  const font={name:'Calibri',size:11,color:{argb:C.ink}};
  const border={bottom:{style:'thin',color:{argb:C.line}}};
  const P=(opt.P||VP()).slice().sort((a,b)=>displayName(a).localeCompare(displayName(b),'fr'));const R=opt.range||perRange('tout');const WHO=opt.who||ownName();
  const J=opt.J||(()=>{const L=[];for(const p of P)for(const j of p.journal||[])L.push({p,j});return L.sort((a,b)=>a.j.date<b.j.date?-1:1)})();
  const toDate=s=>{if(!s)return null;const m=String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);return m?new Date(Date.UTC(+m[1],+m[2]-1,+m[3])):null};
  const toMonth=s=>{const m=String(s||'').match(/^(\d{4})-(\d{2})$/);return m?new Date(Date.UTC(+m[1],+m[2]-1,1)):null};
  const nextRdv=p=>(p.actions||[]).filter(a=>!a.fait&&a.type==='RDV').sort((a,b)=>(a.date||'')<(b.date||'')?-1:1)[0];
  function titleBlock(ws,title,sub,ncol,color){ws.mergeCells(1,1,1,ncol);ws.mergeCells(2,1,2,ncol);
    const t=ws.getCell(1,1);t.value=title;t.font={name:'Calibri',size:16,bold:true,color:{argb:C.white}};t.fill={type:'pattern',pattern:'solid',fgColor:{argb:color}};t.alignment={vertical:'middle',indent:1};ws.getRow(1).height=30;
    const s2=ws.getCell(2,1);s2.value=sub;s2.font={...font,italic:true,color:{argb:C.grey}};s2.alignment={indent:1};ws.getRow(2).height=18}
  function table(ws,cols,rows,color,startRow=4){
    ws.columns=cols.map(c=>({key:c.k,width:c.w}));
    const hr=ws.getRow(startRow);cols.forEach((c,i)=>{const cell=hr.getCell(i+1);cell.value=c.h;cell.font={name:'Calibri',size:11,bold:true,color:{argb:C.white}};cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:color}};cell.alignment={vertical:'middle',wrapText:true};cell.border={bottom:{style:'medium',color:{argb:color}}}});hr.height=32;
    rows.forEach((r,ri)=>{const row=ws.getRow(startRow+1+ri);cols.forEach((c,i)=>{const cell=row.getCell(i+1);const v=r[c.k];cell.value=v===''||v==null?null:v;cell.font=font;cell.border=border;cell.alignment={vertical:'top',wrapText:!!c.wrap};
        if(c.fmt)cell.numFmt=c.fmt;if(ri%2)cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:C.zebra}};if(c.style)c.style(cell,r)})});
    ws.views=[{state:'frozen',xSplit:1,ySplit:startRow,showGridLines:false}];
    if(rows.length)ws.autoFilter={from:{row:startRow,column:1},to:{row:startRow+rows.length,column:cols.length}}}
  const stStyle=(cell,r)=>{const c=STC[r._st];if(c){cell.font={...font,bold:true,color:{argb:c[0]}};cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:c[1]}}}};
  const tpStyle=(cell,r)=>{const m={Chaud:C.red,Tiède:C.amber,Froid:C.blue}[r.temp];if(m)cell.font={...font,bold:true,color:{argb:m}}};
  const late=(cell,r)=>{if(r._late)cell.font={...font,bold:true,color:{argb:C.red}}};
  const rowOf=p=>{const c=p.contacts?.find(x=>x.decideur==='Oui')||p.contacts?.[0]||{};const a=nextAction(p);const rv=nextRdv(p);
    return{nom:displayName(p),owner:ownName(okey(p)),siret:fmtSiret(p.ent?.siret||p.ent?.siren||''),secteur:p.ent?.secteur,eff:p.ent?.effectif,adresse:p.ent?.adresse,cp:p.ent?.cp,ville:p.ent?.ville,standard:fmtTel(p.ent?.tel||''),
      contact:[c.civ,c.prenom,c.nom].filter(Boolean).join(' '),fonction:c.fonction,dec:c.decideur,telc:fmtTel(c.tel||c.mobile||''),email:c.email||p.ent?.email,
      statut:ST[p.statut]?.l,_st:p.statut,temp:TEMPS.find(x=>x.k===p.temperature)?.l||'',source:srcLabel(p),besoins:(p.besoins?.sel||[]).join(', '),echeance:p.besoins?.priorite,
      action:a?a.type:'',adate:toDate(a?.date),aheure:a?.heure,_late:a?.date&&a.date<iso(today()),rdv:toDate(rv?.date),rdvh:rv?.heure,
      copieurs:[p.impr?.nb&&(p.est?.['impr.nb']?'≈'+p.impr.nb+' (estimé)':p.impr.nb),(p.impr?.marques||[]).join(' ')].filter(Boolean).join(' '),finimpr:toMonth(p.impr?.finContrat),postes:p.est?.['it.postes']&&p.it?.postes?'≈'+p.it.postes+' (estimé)':p.it?.postes,presta:p.it?.prestataire||(p.it?.aPresta==='Non'?'Aucun':''),
      ope:(p.tel?.operateur||[]).join(', '),fintel:toMonth(p.tel?.finEngagement),qualif:qualif(p)/100,note:(p.journal||[]).slice().sort((x,y)=>x.date<y.date?1:-1)[0]?.texte,cree:p.createdAt?new Date(p.createdAt):null}};
  const COLS=[{k:'nom',h:'Entreprise',w:32,wrap:true,style:c=>{c.font={...font,bold:true}}},{k:'owner',h:'Commercial',w:18},{k:'statut',h:'Statut',w:15,style:stStyle},{k:'temp',h:'Température',w:12,style:tpStyle},
    {k:'action',h:'Prochaine action',w:14},{k:'adate',h:'Date',w:12,fmt:'dd/mm/yyyy',style:late},{k:'aheure',h:'Heure',w:8},{k:'rdv',h:'RDV prévu le',w:13,fmt:'dd/mm/yyyy'},{k:'rdvh',h:'à',w:7},
    {k:'contact',h:'Contact',w:22},{k:'fonction',h:'Fonction',w:18},{k:'dec',h:'Décideur',w:10},{k:'telc',h:'Tél. contact',w:15},{k:'email',h:'Email',w:28},
    {k:'besoins',h:'Besoins identifiés',w:34,wrap:true},{k:'echeance',h:'Échéance projet',w:14},
    {k:'secteur',h:'Secteur',w:22},{k:'eff',h:'Effectif',w:10},{k:'siret',h:'SIRET',w:20},{k:'adresse',h:'Adresse',w:28,wrap:true},{k:'cp',h:'CP',w:8},{k:'ville',h:'Ville',w:18},{k:'standard',h:'Standard',w:15},
    {k:'copieurs',h:'Copieurs',w:16},{k:'finimpr',h:'Fin contrat impression',w:14,fmt:'mmm yyyy'},{k:'postes',h:'Postes',w:8},{k:'presta',h:'Prestataire IT',w:18},{k:'ope',h:'Opérateur(s)',w:16},{k:'fintel',h:'Fin engagement télécom',w:14,fmt:'mmm yyyy'},
    {k:'qualif',h:'Qualification',w:12,fmt:'0%'},{k:'source',h:'Source',w:12},{k:'note',h:'Dernière note',w:45,wrap:true},{k:'cree',h:'Fiche créée le',w:13,fmt:'dd/mm/yyyy'}];
  const tel=P.filter(p=>canalOf(p)==='Téléphonique'),ter=P.filter(p=>canalOf(p)==='Terrain');
  // Synthèse
  const ws0=wb.addWorksheet('Synthèse',{properties:{tabColor:{argb:C.ink}}});
  titleBlock(ws0,`${R.l} — ${WHO}`,`Commercial : ${WHO} · Période : ${R.l} · exporté le ${new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} à ${new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}`,7,C.ink);
  ws0.columns=[{width:30},{width:22},{width:14},{width:14},{width:14},{width:12},{width:14}];
  const hdr=ws0.getRow(4);['Statut','Téléphonique','Terrain','Total'].forEach((h,i)=>{const c=hdr.getCell(i+1);c.value=h;c.font={name:'Calibri',size:11,bold:true,color:{argb:C.white}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:i===2?C.terrain:i===1?C.teal:C.grey}};c.alignment={horizontal:i?'center':'left',vertical:'middle'}});hdr.height=26;
  STATUTS.forEach((s,i)=>{const r=ws0.getRow(5+i);const a=tel.filter(p=>p.statut===s.k).length,b=ter.filter(p=>p.statut===s.k).length;[s.l,a,b,a+b].forEach((v,j)=>{const c=r.getCell(j+1);c.value=v;c.font={...font,bold:j===0||j===3};c.border=border;c.alignment={horizontal:j?'center':'left'};if(j===0){const cc=STC[s.k];c.font={...font,bold:true,color:{argb:cc[0]}}}})});
  const tr=ws0.getRow(5+STATUTS.length);['Total',tel.length,ter.length,P.length].forEach((v,j)=>{const c=tr.getCell(j+1);c.value=v;c.font={...font,bold:true};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:C.tealSoft}};c.alignment={horizontal:j?'center':'left'};c.border={top:{style:'medium',color:{argb:C.teal}}}});
  const kr=7+STATUTS.length;const ST0=dayStats(J);const kpi=[['Appels',ST0.calls],['Décrochés',ST0.reach],['Visites terrain',ST0.visits],['RDV pris',ST0.rdv],['Actions en retard',P.reduce((n,p)=>n+(p.actions||[]).filter(a=>!a.fait&&a.date&&a.date<iso(today())).length,0)],['Qualification moyenne',P.length?P.reduce((s,p)=>s+qualif(p),0)/P.length/100:0]];
  kpi.forEach(([k,v],i)=>{const r=ws0.getRow(kr+i);r.getCell(1).value=k;r.getCell(1).font={...font,color:{argb:C.grey}};const c=r.getCell(2);c.value=v;c.font={name:'Calibri',size:13,bold:true,color:{argb:C.teal}};c.alignment={horizontal:'left'};if(i===5)c.numFmt='0%'});
  /* Détail jour par jour et par commercial */
  const byDay=new Map();for(const x of J){const k=x.j.date.slice(0,10)+'|'+okey(x.p);if(!byDay.has(k))byDay.set(k,[]);byDay.get(k).push(x)}
  let rr=kr+kpi.length+2;const h2=ws0.getRow(rr);['Jour','Commercial','Appels','Décrochés','Visites','RDV pris','Fiches créées'].forEach((h,i)=>{const c=h2.getCell(i+1);c.value=h;c.font={name:'Calibri',size:11,bold:true,color:{argb:C.white}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:C.teal}};c.alignment={horizontal:i>1?'center':'left',vertical:'middle'}});h2.height=24;
  let prevDay='',band=false;
  for(const [k,L] of [...byDay.entries()].sort((a,b)=>{const [da,oa]=a[0].split('|'),[db,ob]=b[0].split('|');return da!==db?(da<db?1:-1):ownName(oa).localeCompare(ownName(ob),'fr')})){const [d,o]=k.split('|');if(d!==prevDay){band=!band;prevDay=d}const st=dayStats(L);const cr=P.filter(p=>okey(p)===o&&p.createdAt&&iso(new Date(p.createdAt))===d).length;
    const r=ws0.getRow(++rr);const dd=jDate(d);[`${JOURS[dd.getDay()]} ${dd.getDate()} ${MOISL[dd.getMonth()]} ${dd.getFullYear()}`,ownName(o),st.calls,st.reach,st.visits,st.rdv,cr].forEach((v,i)=>{const c=r.getCell(i+1);c.value=v;c.font={...font,bold:i===0};c.alignment={horizontal:i>1?'center':'left'};c.border=border;if(band)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:C.tealSoft}}})}
  if(!byDay.size){const r=ws0.getRow(++rr);r.getCell(1).value='Aucun appel ni visite saisi sur la période';r.getCell(1).font={...font,italic:true,color:{argb:C.grey}}}
  ws0.views=[{showGridLines:false}];
  /* Feuille « Jour par jour » : chaque échange, séparé par journée */
  const wsJ=wb.addWorksheet('Jour par jour',{properties:{tabColor:{argb:C.blue}}});
  const JC=[['Heure',8],['Commercial',18],['Entreprise',30],['Canal',12],['Issue',24],['Durée',8],['Contact',22],['Téléphone',15],['Ce qui s’est dit (corrigé)',70]];
  titleBlock(wsJ,`Jour par jour — ${WHO}`,`${R.l} · ${J.length} échange${J.length>1?'s':''} · un bandeau par journée`,JC.length,C.blue);
  wsJ.columns=JC.map(([,w])=>({width:w}));let jr=4;const hj=wsJ.getRow(jr);JC.forEach(([h],i)=>{const c=hj.getCell(i+1);c.value=h;c.font={name:'Calibri',size:11,bold:true,color:{argb:C.white}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:C.blue}};c.alignment={vertical:'middle'}});hj.height=24;
  const days=new Map();for(const x of J){const d=x.j.date.slice(0,10);if(!days.has(d))days.set(d,[]);days.get(d).push(x)}
  for(const [d,L] of [...days.entries()].sort((a,b)=>a[0]<b[0]?1:-1)){jr+=1;if(jr>5)jr+=1;wsJ.mergeCells(jr,1,jr,JC.length);const dd=jDate(d);const c=wsJ.getCell(jr,1);
    c.value=`${JOURS[dd.getDay()].toUpperCase()} ${dd.getDate()} ${MOISL[dd.getMonth()].toUpperCase()} ${dd.getFullYear()}   —   ${statTxt(dayStats(L))}`;c.font={name:'Calibri',size:12,bold:true,color:{argb:C.white}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:C.ink}};c.alignment={vertical:'middle',indent:1};wsJ.getRow(jr).height=24;
    L.forEach(({p,j},i)=>{const r=wsJ.getRow(++jr);const ct=p.contacts?.find(x=>x.decideur==='Oui')||p.contacts?.[0]||{};const txt=(Array.isArray(j.propre)&&j.propre.length?j.propre:cleanNote(j.texte||'')).map(x=>'• '+x).join('\n');
      [j.date.slice(11,16).replace(':','h'),ownName(okey(p)),displayName(p),j.canal==='tel'?'Téléphone':j.canal==='terrain'?'Terrain':'Note',j.issue||'',j.duree||'',[ct.civ,ct.prenom,ct.nom].filter(Boolean).join(' '),fmtTel(ct.tel||ct.mobile||p.ent?.tel||''),txt].forEach((v,k)=>{const c=r.getCell(k+1);c.value=v||null;c.font={...font,bold:k===2,color:{argb:k===4&&/^RDV/.test(v)?C.teal:k===4&&NOREACH.test(v||'')?C.grey:C.ink}};c.alignment={vertical:'top',wrapText:k===8||k===2};c.border=border;if(i%2)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:C.zebra}}})})}
  if(!days.size){wsJ.getCell(6,1).value='Aucun échange saisi sur la période.';wsJ.getCell(6,1).font={...font,italic:true,color:{argb:C.grey}}}
  wsJ.views=[{state:'frozen',ySplit:4,showGridLines:false}];
  // Feuilles par canal
  for(const [name,list,color] of [['Téléphonique',tel,C.teal],['Terrain',ter,C.terrain]]){
    const ws=wb.addWorksheet(name,{properties:{tabColor:{argb:color}}});
    titleBlock(ws,`Prospection ${name.toLowerCase()} — ${list.length} fiche${list.length>1?'s':''}`,`${WHO} · ${R.l} · filtres actifs sur chaque colonne`,COLS.length,color);
    table(ws,COLS,list.map(rowOf),color);
    const qi=COLS.findIndex(c=>c.k==='qualif')+1;const ql=ws.getColumn(qi).letter;if(list.length)ws.addConditionalFormatting({ref:`${ql}5:${ql}${4+list.length}`,rules:[{type:'dataBar',cfvo:[{type:'num',value:0},{type:'num',value:1}],color:{argb:'FF3DB5AC'},gradient:false}]})}
  // Actions à venir
  const acts=P.flatMap(p=>(p.actions||[]).map(a=>({p,a}))).filter(x=>!x.a.fait).sort((x,y)=>((x.a.date||'9')+(x.a.heure||''))<((y.a.date||'9')+(y.a.heure||''))?-1:1);
  const wsA=wb.addWorksheet('Rappels & RDV',{properties:{tabColor:{argb:C.amber}}});
  const AC=[{k:'date',h:'Date',w:16,fmt:'ddd dd/mm/yyyy',style:late},{k:'heure',h:'Heure',w:8},{k:'type',h:'Type',w:10,style:(c,r)=>{if(r.type==='RDV')c.font={...font,bold:true,color:{argb:C.teal}}}},{k:'nom',h:'Entreprise',w:32,wrap:true,style:c=>{c.font={...font,bold:true}}},{k:'owner',h:'Commercial',w:18},{k:'canal',h:'Canal',w:14,style:(c,r)=>{c.font={...font,color:{argb:r.canal==='Terrain'?C.terrain:C.teal}}}},{k:'contact',h:'Contact',w:22},{k:'tel',h:'Téléphone',w:15},{k:'note',h:'Note',w:45,wrap:true}];
  titleBlock(wsA,`Rappels & RDV à venir — ${acts.length}`,`${WHO} · en rouge : en retard`,AC.length,C.amber);
  table(wsA,AC,acts.map(({p,a})=>{const c=p.contacts?.[0]||{};return{date:toDate(a.date),heure:a.heure,type:a.type,nom:displayName(p),owner:ownName(okey(p)),canal:canalOf(p),contact:[c.prenom,c.nom].filter(Boolean).join(' '),tel:fmtTel(c.tel||c.mobile||p.ent?.tel||''),note:a.note,_late:a.date&&a.date<iso(today())}}),C.amber);
  // Comptes rendus
  const wsC=wb.addWorksheet('Comptes rendus',{properties:{tabColor:{argb:C.grey}}});
  const CC=[{k:'nom',h:'Entreprise',w:30,wrap:true,style:c=>{c.font={...font,bold:true}}},{k:'owner',h:'Commercial',w:18},{k:'der',h:'Dernier échange',w:16,fmt:'ddd dd/mm/yyyy'},{k:'canal',h:'Canal',w:14},{k:'statut',h:'Statut',w:15,style:stStyle},{k:'cr',h:'Compte rendu',w:100,wrap:true}];
  titleBlock(wsC,`Comptes rendus — ${WHO}`,`${R.l} · entreprise, échanges, besoins, prochaines étapes`,CC.length,C.grey);
  table(wsC,CC,P.map(p=>({nom:displayName(p),owner:ownName(okey(p)),der:toDate((p.journal||[]).map(j=>j.date).sort().at(-1)),canal:canalOf(p),statut:ST[p.statut]?.l,_st:p.statut,cr:crText(p).split('\n').slice(3).join('\n')})),C.grey);
  const buf=await wb.xlsx.writeBuffer();
  downloadFile(opt.file||`Radar-${slug(String(WHO).split('@')[0])||'export'}-global-${iso(new Date())}.xlsx`,buf,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');toast('Fichier Excel téléchargé')}

/* ================= Export par période et par compte ================= */
const okey=p=>p?._owner||USER?.id||'me';
function dayLabel(s){const d=jDate(s);const t=iso(today()),y=iso(addDays(today(),-1));const k=String(s).slice(0,10);const L=longDate(d,false);return k===t?'Aujourd’hui · '+L:k===y?'Hier · '+L:L.charAt(0).toUpperCase()+L.slice(1)}
const meId=()=>USER?.id||'me';
function ownName(id){id=id||meId();const m=(S.team||[]).find(x=>x.id===id);const mine=id===meId();
  if(mine&&S.settings.monNom)return S.settings.monNom;if(m)return m.nom||m.email;if(mine)return USER?.email||'Moi';return'Collègue'}
function expMembers(){if(isAdmin()&&(S.team||[]).length){const L=S.team.map(m=>({id:m.id,l:ownName(m.id)}));if(!L.some(x=>x.id===meId()))L.unshift({id:meId(),l:ownName()});return L}return[{id:meId(),l:ownName()}]}
const PERS=[['jour','Session du jour'],['hier','Hier'],['semaine','Cette semaine'],['mois','Ce mois'],['perso','Dates au choix'],['tout','Tout (global)']];
function perRange(k,f,t){const now=today(),T=iso(now);
  if(k==='jour')return{from:T,to:T,l:`Session du ${longDate(now,false)}`,slug:'session-'+T};
  if(k==='hier'){let d=addDays(now,-1);while([0,6].includes(d.getDay()))d=addDays(d,-1);const D=iso(d);return{from:D,to:D,l:`Session du ${longDate(d,false)}`,slug:'session-'+D}}
  if(k==='semaine'){const mon=addDays(now,1-(now.getDay()||7));return{from:iso(mon),to:T,l:`Semaine du ${longDate(mon,false)} au ${longDate(now,false)}`,slug:'semaine-'+iso(mon)}}
  if(k==='mois')return{from:T.slice(0,8)+'01',to:T,l:`Mois de ${MOISL[now.getMonth()]} ${now.getFullYear()}`,slug:'mois-'+T.slice(0,7)};
  if(k==='perso'){f=f||T;t=t||T;if(t<f)[f,t]=[t,f];return{from:f,to:t,l:f===t?`Session du ${longDate(jDate(f),false)}`:`Du ${longDate(jDate(f),false)} au ${longDate(jDate(t),false)}`,slug:f===t?'session-'+f:`${f}_${t}`}}
  return{from:'',to:'',l:'Tout l’historique',slug:'global'}}
const inR=(d,r)=>{if(!r.from)return true;d=String(d||'').slice(0,10);return d>=r.from&&d<=r.to};
function expSel(o){const r=perRange(o.per,o.from,o.to);const own=new Set(o.owners);
  const P=[...S.P.values()].filter(p=>own.has(okey(p))&&!p.exemple);
  const act=p=>!r.from||(p.journal||[]).some(j=>inR(j.date,r))||(p.createdAt&&inR(iso(new Date(p.createdAt)),r))||(p.rdvPrisLe&&inR(iso(new Date(p.rdvPrisLe)),r))||(p.actions||[]).some(a=>a.createdAt&&inR(iso(new Date(a.createdAt)),r));
  const fiches=P.filter(act);const J=[];for(const p of fiches)for(const j of p.journal||[])if(inR(j.date,r))J.push({p,j});
  J.sort((a,b)=>a.j.date<b.j.date?-1:1);return{r,fiches,J}}
function dayStats(list){let calls=0,reach=0,visits=0,rdv=0,notes=0;for(const {j} of list){if(j.canal==='tel'){calls++;if(j.issue&&!NOREACH.test(j.issue))reach++}else if(j.canal==='terrain')visits++;else notes++;if(/^RDV/i.test(j.issue||''))rdv++}return{calls,reach,visits,rdv,notes}}
const statTxt=s=>[s.calls&&`${s.calls} appel${s.calls>1?'s':''}`,s.calls&&`${s.reach} décroché${s.reach>1?'s':''}`,s.visits&&`${s.visits} visite${s.visits>1?'s':''}`,s.rdv&&`${s.rdv} RDV`,s.notes&&`${s.notes} note${s.notes>1?'s':''}`].filter(Boolean).join(' · ')||'aucune activité';
function expOpen(per){const ow=isAdmin()&&S.who==='all'?expMembers().map(m=>m.id):isAdmin()&&S.who&&S.who!=='me'?[S.who]:[meId()];
  S.menu=false;S.exp={per:per||'jour',owners:ow,from:iso(today()),to:iso(today())};renderLayer()}
function expHtml(){const o=S.exp;const M=expMembers();const sel=expSel(o);const days=new Map();for(const x of sel.J){const d=x.j.date.slice(0,10);if(!days.has(d))days.set(d,[]);days.get(d).push(x)}
  const dl=[...days.entries()].sort((a,b)=>a[0]<b[0]?1:-1);
  return `<div class="modal" data-act="expx"><div class="exp"><h2>Exporter en Excel</h2>
   <div class="f"><span class="lab">Période</span><div class="chips">${PERS.map(([k,l])=>`<button class="chip" data-act="expper" data-v="${k}" aria-pressed="${o.per===k}">${l}</button>`).join('')}</div>
    ${o.per==='perso'?`<div class="exp-dates"><label>Du <input class="in" type="date" id="exp-from" value="${o.from}"></label><label>au <input class="in" type="date" id="exp-to" value="${o.to}"></label></div>`:''}
    <small class="exp-r">${esc(sel.r.l)}</small></div>
   <div class="f"><span class="lab">Compte${M.length>1?'s':''}</span>${M.length>1?`<div class="chips">${M.map(m=>`<button class="chip" data-act="expown" data-v="${m.id}" aria-pressed="${o.owners.includes(m.id)}">${esc(m.l)}${m.id===meId()?' (moi)':''}</button>`).join('')}<button class="chip" data-act="expall">${o.owners.length===M.length?'Aucun':'Tous'}</button></div>`:`<div class="exp-me">👤 ${esc(M[0].l)} <button class="lnk" data-act="expname">changer le nom affiché</button></div>`}</div>
   <div class="exp-prev"><b>${sel.fiches.length} fiche${sel.fiches.length>1?'s':''}</b> · ${statTxt(dayStats(sel.J))}${dl.length?`<ul>${dl.slice(0,7).map(([d,L])=>`<li><span>${esc(dayLabel(d))}</span><span>${esc(statTxt(dayStats(L)))}</span></li>`).join('')}${dl.length>7?`<li><span>… et ${dl.length-7} autre${dl.length-7>1?'s':''} jour${dl.length-7>1?'s':''}</span></li>`:''}</ul>`:''}</div>
   <div class="exp-b"><button class="btn btn-p" data-act="expgo" ${!o.owners.length||(!sel.fiches.length&&o.per!=='tout')?'disabled':''}>Télécharger l’Excel</button><button class="btn btn-g" data-act="expx">Annuler</button></div>
  </div></div>`}
async function expRun(o){const sel=expSel(o);if(!sel.fiches.length){toast('Rien à exporter sur cette période.');return}
  const names=o.owners.map(ownName);const who=names.length===expMembers().length&&names.length>1?'Toute l’équipe ('+names.join(', ')+')':names.join(', ');
  const slugN=names.length>2?'equipe':names.map(n=>slug(String(n).split('@')[0])).join('+');
  await exportXlsx({P:sel.fiches,J:sel.J,range:sel.r,who,multi:o.owners.length>1,file:`Radar-${slugN||'export'}-${sel.r.slug}.xlsx`})}

/* ================= Agenda Outlook ================= */
function rdvInfo(p,a){const c=(p.contacts||[]).find(x=>x.decideur==='Oui')||p.contacts?.[0]||{};const tel=fmtTel(c.tel||c.mobile||p.ent?.tel||'');
  const who=[c.civ,c.prenom,c.nom].filter(Boolean).join(' ');const nm=displayName(p);const adr=[p.ent?.adresse,[p.ent?.cp,p.ent?.ville].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  const isRdv=a.type==='RDV',isVis=a.type==='Visite';const dur=isRdv?60:isVis?30:15;
  const lieuTxt=isRdv?(/visio/i.test(a.note||'')?'Visio (Teams)':/t[ée]l[ée]phone/i.test(a.note||'')?'Téléphone : '+tel:adr):isVis?adr:(tel?'Tél. '+tel:'');
  const title=isRdv?`RDV ${nm}${who?' — '+who:''}`:isVis?`Visite ${nm}`:a.type==='Relance'?`Relancer ${nm}${who?' — '+who:''}`:`📞 Rappeler ${nm}${who?' — '+who:''}`;
  const hh=a.heure?fitSlot(a.heure,dur):'';const tm=hh?' à '+hh.replace(':00','h').replace(':','h'):'';const ctel=fmtTel(c.mobile||c.tel||'');
  const head=isRdv?[`Rendez-vous le ${longDate(jDate(a.date),false)}${tm}`,lieuTxt&&'Lieu : '+lieuTxt,who&&`Interlocuteur : ${who}${c.fonction?' ('+c.fonction+')':''}`,(ctel||tel)&&'Tél. : '+[ctel,tel&&tel!==ctel?'standard '+tel:''].filter(Boolean).join(' · ')].filter(Boolean).join('\n')
    :[a.note&&!/^RDV\b/.test(a.note)?'À faire : '+a.note:'',tel?'Numéro : '+tel+(who?' ('+who+')':''):''].filter(Boolean).join('\n');
  const body=(head?head+'\n\n':'')+crText(p)+'\n\n— Créé depuis Radar (prospection Data Links)';const html=calHtml(p,head);
  if(!a.heure&&!isRdv){const d=new Date(a.date+'T12:00');d.setDate(d.getDate()+1);return{title,allday:true,start:a.date,end:iso(d),lieu:lieuTxt,body,html}}
  const h=fitSlot(a.heure||'10:00',dur);const [H,M]=h.split(':').map(Number);const end=endWithin(h,dur);
  return{title,start:`${a.date}T${pad(H)}:${pad(M)}:00`,end:`${a.date}T${end}:00`,lieu:lieuTxt,body,html}}
/* Descriptif d'agenda mis en forme (Outlook web lit le descriptif en HTML : les retours à la ligne simples y sont ignorés) */
function calHtml(p,head){const m=crModel(p);const MAX=5000;let h='';let cut=false;
  const add=x=>{if(cut)return;if(h.length+x.length>MAX){cut=true;h+='…<br>';return}h+=x};
  if(head)add(head.split('\n').map(x=>`<b>${esc(x)}</b>`).join('<br>')+'<br><br>');
  add(`<b>${esc(m.titre)}</b><br>${esc(m.head)}${m.etat?' · '+esc(m.etat):''}<br>`);
  for(const sec of m.sections){add(`<br><b><u>${esc(sec.h.toUpperCase())}</u></b><br>`);
    for(const it of sec.items){add('• '+esc(it.t)+'<br>');if(it.sub)for(const x of it.sub.split('\n').filter(Boolean))add('&nbsp;&nbsp;&nbsp;&nbsp;'+esc(x)+'<br>')}}
  cut=false;h+='<br><i>Créé depuis Radar (prospection Data Links)</i>';return h}
const withOff=s=>{const d=new Date(s);const o=-d.getTimezoneOffset();return s.slice(0,19)+(o>=0?'+':'-')+pad(Math.floor(Math.abs(o)/60))+':'+pad(Math.abs(o)%60)};
function outlookUrl(i,host){const u=new URL(`https://${host}/calendar/action/compose`);u.searchParams.set('rru','addevent');
  u.searchParams.set('subject',i.title);if(i.allday){u.searchParams.set('startdt',i.start);u.searchParams.set('enddt',i.end);u.searchParams.set('allday','true')}else{u.searchParams.set('startdt',withOff(i.start));u.searchParams.set('enddt',withOff(i.end));u.searchParams.set('allday','false')}if(i.lieu)u.searchParams.set('location',i.lieu);u.searchParams.set('body',i.html||i.body.slice(0,1200));return u.toString()}
const VTZ=['BEGIN:VTIMEZONE','TZID:Europe/Paris','BEGIN:DAYLIGHT','TZOFFSETFROM:+0100','TZOFFSETTO:+0200','TZNAME:CEST','DTSTART:19700329T020000','RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU','END:DAYLIGHT','BEGIN:STANDARD','TZOFFSETFROM:+0200','TZOFFSETTO:+0100','TZNAME:CET','DTSTART:19701025T030000','RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU','END:STANDARD','END:VTIMEZONE'];
const fold=l=>{const out=[];let s=l;while(new TextEncoder().encode(s).length>73){let n=73;while(new TextEncoder().encode(s.slice(0,n)).length>73)n--;out.push(s.slice(0,n));s=' '+s.slice(n)}out.push(s);return out.join('\r\n')};
function icsOf(i,uid){const f=s=>s.replace(/[-:]/g,'').slice(0,15);const e=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/([,;])/g,'\\$1');
  return['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Data Links//Radar//FR','CALSCALE:GREGORIAN','METHOD:PUBLISH',...VTZ,'BEGIN:VEVENT',`UID:${uid}@radar-datalinks`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').slice(0,15)}Z`,
    ...(i.allday?[`DTSTART;VALUE=DATE:${i.start.replace(/-/g,'')}`,`DTEND;VALUE=DATE:${i.end.replace(/-/g,'')}`,'TRANSP:TRANSPARENT']:[`DTSTART;TZID=Europe/Paris:${f(i.start)}`,`DTEND;TZID=Europe/Paris:${f(i.end)}`]),`SUMMARY:${e(i.title)}`,i.lieu?`LOCATION:${e(i.lieu)}`:'',`DESCRIPTION:${e(i.body)}`,i.html?`X-ALT-DESC;FMTTYPE=text/html:${e('<html><body style="font-family:Calibri,Arial,sans-serif;font-size:11pt">'+i.html+'</body></html>')}`:'','BEGIN:VALARM',i.allday?'TRIGGER:PT9H':i.title.startsWith('RDV')?'TRIGGER:-PT30M':'TRIGGER:-PT5M','ACTION:DISPLAY','DESCRIPTION:Rappel','END:VALARM','END:VEVENT','END:VCALENDAR'].filter(Boolean).map(fold).join('\r\n')}
const proMail=()=>!!USER?.email&&!/@(outlook|hotmail|live|msn)\./i.test(USER.email);
function addToCal(p,a,mode){mode=mode||S.settings.cal||'m365';if(mode==='live'&&proMail())mode='m365';const i=rdvInfo(p,a);
  const what=a.type==='RDV'?'le RDV':a.type==='Visite'?'la visite':a.type==='Relance'?'la relance':'le rappel';
  if(mode==='ics'){downloadFile(`${a.type}-${displayName(p).replace(/[^\w-]+/g,'_')}-${a.date}.ics`,icsOf(i,a.id),'text/calendar;charset=utf-8');toast(`Fichier agenda téléchargé : ouvre-le, Outlook affiche ${what}, clique « Enregistrer et fermer »`);}
  else{const w=window.open(outlookUrl(i,mode==='live'?'outlook.live.com':'outlook.office.com'),'_blank');try{if(w)w.opener=null}catch{}if(!w)toast(`Ton navigateur a bloqué la fenêtre Outlook : utilise le bouton « Ajouter à Outlook » de ${what}.`);else toast(`Outlook s\u2019ouvre avec ${what} prérempli : clique Enregistrer`)}
  a.cal=true;S.calMsg={pid:p.id,aids:[a.id]};touch(p);if(S.sel===p.id)renderNotesOnly()}
function calBtns(p,a){return `<span class="calbtns"><button class="btn btn-g btn-s" data-act="cal" data-id="${p.id}" data-a="${a.id}">📅 ${a.cal?'Outlook ✓':'Ajouter à Outlook'}</button><button class="btn btn-q btn-s" data-act="cal" data-v="ics" data-id="${p.id}" data-a="${a.id}" title="Fichier pour tout agenda">.ics</button></span>`}
/* ================= Numéros de téléphone (OpenStreetMap, TomTom en option) ================= */
const OVERPASS=['https://overpass-api.de/api/interpreter'];
const normTel=t=>{let d=String(t||'').split(/[;,/]/)[0].replace(/[^\d+]/g,'');if(d.startsWith('+33'))d='0'+d.slice(3);if(d.startsWith('0033'))d='0'+d.slice(4);return /^0[1-9]\d{8}$/.test(d)?d:''};
let ovNext=0;
const cleanMail=m=>{const x=String(m||'').split(/[;,\s]/)[0].replace(/^mailto:/i,'').trim().toLowerCase();return /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(x)?x:''};
const cleanSite=u=>{const x=String(u||'').split(/[;\s]/)[0].trim();return /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/i.test(x)?x.replace(/\/$/,''):''};
const osmItem=e=>({name:e.tags.name,phone:normTel(e.tags.phone||e.tags['contact:phone']||e.tags['contact:mobile']),email:cleanMail(e.tags.email||e.tags['contact:email']),site:cleanSite(e.tags.website||e.tags['contact:website']),lat:e.lat??e.center?.lat,lon:e.lon??e.center?.lon,src:'OpenStreetMap'});
async function overpassPhones(pos,radius){
  const q=`[out:json][timeout:20];nwr(around:${Math.round(radius)},${pos.lat.toFixed(6)},${pos.lon.toFixed(6)})["name"][~"^(phone|contact:phone|contact:mobile|email|contact:email|website|contact:website)$"~"."];out tags center 300;`;
  const wait=Math.max(0,ovNext-Date.now());ovNext=Math.max(ovNext,Date.now())+1200;if(wait)await sleep(wait);
  for(const url of [...OVERPASS,OVERPASS[0]]){try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'data='+encodeURIComponent(q),signal:AbortSignal.timeout(15000)});if(!r.ok){await sleep(1500);continue}const j=await r.json();
    return(j.elements||[]).map(osmItem).filter(x=>x.phone||x.email||x.site)}catch{await sleep(800)}}
  return null}
async function tomtomPhones(p,pos){const key=S.settings.tomtomKey;if(!key)return[];
  try{const u=new URL(`https://api.tomtom.com/search/2/poiSearch/${encodeURIComponent(p.ent?.enseigne||p.ent?.nom||'')}.json`);
    u.searchParams.set('key',key);u.searchParams.set('lat',pos.lat);u.searchParams.set('lon',pos.lon);u.searchParams.set('radius','250');u.searchParams.set('limit','8');u.searchParams.set('language','fr-FR');u.searchParams.set('countrySet','FR');
    const j=await fetch(u,{signal:AbortSignal.timeout(10000)}).then(r=>r.ok?r.json():null);return(j?.results||[]).map(x=>({name:x.poi?.name,phone:normTel(x.poi?.phone),site:cleanSite(x.poi?.url),email:'',lat:x.position?.lat,lon:x.position?.lon,src:'TomTom'})).filter(x=>x.phone||x.site)}catch{return[]}}
async function posOf(p){if(p.geo?.lat)return p.geo;const e=p.ent||{};if(!e.adresse&&!e.ville)return null;
  try{const g=await geocode([e.adresse,e.cp,e.ville].filter(Boolean).join(' '));if(g){p.geo={lat:g.lat,lon:g.lon};touch(p);return p.geo}}catch{}return null}
function bestPhone(p,list,pos,min=0.5){const names=[p.ent?.enseigne,p.ent?.nom].filter(Boolean);let best=null,bs=0;
  for(const x of list){const s=Math.max(...names.map(n=>Math.max(sim(n,x.name),sim(x.name,n))));const d=pos&&x.lat?haversine(pos,{lat:x.lat,lon:x.lon}):0;const sc=s-(d>120?0.2:0);if(sc>bs){bs=sc;best=x}}
  return bs>=min?best:null}
async function findPhone(p,{silent=false,pool=null,step=()=>{}}={}){
  step('Localisation de l’adresse…');const pos=await posOf(p);if(!pos)return{status:'noaddr'};
  step('Recherche dans OpenStreetMap…');let list=pool||await overpassPhones(pos,120);const down=list===null;list=list||[];
  let hit=bestPhone(p,list.filter(x=>x.phone),pos),web=bestPhone(p,list.filter(x=>x.email||x.site),pos);
  if(!hit&&!pool&&!down){step('Recherche élargie autour de l’adresse…');const wide=await overpassPhones(pos,400);if(wide){hit=bestPhone(p,wide.filter(x=>x.phone),pos,0.75);web=web||bestPhone(p,wide.filter(x=>x.email||x.site),pos,0.75)}}
  if((!hit||!web)&&S.settings.tomtomKey){step('Recherche dans TomTom…');const tt=await tomtomPhones(p,pos);hit=hit||bestPhone(p,tt.filter(x=>x.phone),pos);web=web||bestPhone(p,tt.filter(x=>x.site),pos)}
  const gotWeb=fillWeb(p,hit)|fillWeb(p,web);
  if(!hit&&down)return{status:'down'};
  if(!hit){const near=list.filter(x=>pos&&x.lat&&haversine(pos,{lat:x.lat,lon:x.lon})<=20);p.ent.telLookup={at:iso(today()),status:'none'};
    if(near.length===1&&!p.ent.tel){p.ent.telAlt=near[0].phone;p.ent.telSource=`même adresse : « ${near[0].name} » (${near[0].src})`;p.ent.telLookup.status='possible'}touch(p);return{status:p.ent.telLookup.status==='possible'?'possible':'none',web:!!gotWeb}}
  p.ent.telLookup={at:iso(today()),status:'ok'};
  if(!p.ent.tel||p.ent.tel===hit.phone){p.ent.tel=hit.phone;p.ent.telSource=hit.src;touch(p);markFlash(['ent.tel']);return{status:'ok',hit,web:!!gotWeb}}
  if(p.ent.tel!==hit.phone){p.ent.telAlt=hit.phone;p.ent.telSource=hit.src;touch(p);return{status:'alt',hit,web:!!gotWeb}}}
function fillWeb(p,x){if(!x)return 0;let n=0;p.ent=p.ent||{};if(x.email&&!p.ent.email){p.ent.email=x.email;p.ent.emailSource=x.src;n++}if(x.site&&!p.ent.site){p.ent.site=x.site;p.ent.siteSource=x.src;n++}if(n){touch(p);markFlash(['ent.email','ent.site'])}return n}
function phoneLinks(p){const n=encodeURIComponent(p.ent?.enseigne||p.ent?.nom||''),v=encodeURIComponent(p.ent?.ville||p.ent?.cp||'');
  return `<a href="https://www.pagesjaunes.fr/annuaire/chercherlespros?quoiqui=${n}&ou=${v}" target="_blank" rel="noopener">PagesJaunes</a><a href="https://www.google.com/search?q=${n}+${v}+t%C3%A9l%C3%A9phone" target="_blank" rel="noopener">Google</a><a href="https://www.google.com/maps/search/${n}+${v}" target="_blank" rel="noopener">Maps</a>`}
function phoneBox(p){const e=p.ent||{};const st=S.ph&&S.ph.pid===p.id?S.ph:{};
  return `<div class="phonebox" id="phone-box"><div class="ident-row"><span class="lbl">Standard</span>${e.tel?`<a class="mono ph-num" href="tel:${esc(e.tel)}">📞 ${esc(fmtTel(e.tel))}</a>${e.telSource?`<span class="cr-sub" style="margin:0">source : ${esc(e.telSource)}</span>`:''}`:'<span class="cr-sub" style="margin:0">pas encore de numéro</span>'}
   <button class="btn ${e.tel?'btn-q':'btn-g'} btn-s" data-act="findphone" ${st.busy?'disabled':''}>${st.busy?'<span class="spin"></span> Recherche…':e.tel?'🔎 Revérifier':'🔎 Trouver le numéro'}</button>
   ${e.tel?'':`<span class="links ph-links">${phoneLinks(p)}</span>`}</div>
   ${st.busy?`<div class="ph-run"><span class="spin"></span>${esc(st.step||'Recherche en cours…')} <small>(jusqu’à 30 s)</small></div>`:''}
   ${e.telAlt&&e.telAlt!==e.tel?`<div class="ident-row"><span class="cr-sub" style="margin:0">${e.tel?'Autre numéro trouvé':'Numéro possible ('+esc(e.telSource||'')+')'} : <b class="mono">${esc(fmtTel(e.telAlt))}</b></span><button class="btn btn-q btn-s" data-act="usealt">Utiliser celui-ci</button></div>`:''}
   ${!e.tel&&e.telLookup&&!st.msg&&!st.busy?`<div class="cr-sub" style="margin:0">Recherche automatique faite le ${esc(fmtDate(e.telLookup.at).toLowerCase())} : ${e.telLookup.status==='possible'?'un numéro possible à la même adresse.':'aucun numéro public trouvé. Ouvre PagesJaunes ou Google, puis colle le numéro dans Standard (onglet Entreprise).'}</div>`:''}
   ${st.msg&&!st.busy?`<div class="ph-msg${st.ok?' ok':''}">${esc(st.msg)}</div>`:''}${contactBox(p)}</div>`}
async function findPhoneUI(p){if(S.ph?.busy&&S.ph.pid===p.id)return;S.ph={pid:p.id,busy:true,step:'Démarrage…'};rePhone();if(S.sel===p.id)renderNotesOnly();
  let r;try{r=await findPhone(p,{step:t=>{if(S.ph?.pid===p.id){S.ph.step=t;rePhone()}}})}catch{r={status:'err'}}
  S.ph={pid:p.id,ok:r.status==='ok'||r.web,msg:(r.status==='ok'?`✓ Numéro trouvé sur ${r.hit.src} (« ${r.hit.name} »). Vérifie-le au premier appel.`:r.status==='alt'?'Un autre numéro a été trouvé, voir ci-dessus.':r.status==='noaddr'?'Ajoute d’abord l’adresse (ou identifie l’entreprise) pour chercher son numéro.':r.status==='down'||r.status==='err'?'Le service gratuit OpenStreetMap ne répond pas en ce moment. Réessaie plus tard, ou utilise PagesJaunes / Google.':'Aucun numéro public trouvé automatiquement. Ouvre PagesJaunes ou Google, puis colle le numéro dans le champ Standard (onglet Entreprise).')+(r.web?' Site / e-mail de l’entreprise trouvés aussi (ci-dessous).':'')};
  if(S.sel===p.id){renderFiche();renderNotesOnly()}renderList()}
function autoEnrich(p){if(!p||p.rne?.status!=='ok'||p.rne?.v===4||!(p.ent?.siret||p.ent?.siren))return;S.enr=S.enr||new Set();if(S.enr.has(p.id))return;S.enr.add(p.id);
  applyRne(p,p.ent.siret||p.ent.siren,{siret:p.ent.siret,soft:true}).then(()=>{if(S.sel===p.id){renderFiche();renderNotesOnly()}renderList()}).catch(()=>{})}
function autoPhone(p){if(!p||p.ent?.tel||p.ent?.telLookup||!(p.ent?.nom||p.ent?.enseigne)||!(p.geo||p.ent?.adresse||p.ent?.ville))return;S.phAuto=S.phAuto||new Set();if(S.phAuto.has(p.id))return;S.phAuto.add(p.id);findPhoneUI(p)}
function rePhone(){const b=$('#phone-box');const p=cur();if(b&&p)b.outerHTML=phoneBox(p)}

async function overpassBbox(b){const q=`[out:json][timeout:25];nwr(${b.s.toFixed(5)},${b.w.toFixed(5)},${b.n.toFixed(5)},${b.e.toFixed(5)})["name"][~"^(phone|contact:phone|contact:mobile)$"~"."];out tags center 3000;`;
  for(let k=0;k<2;k++){try{const r=await fetch(OVERPASS[0],{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'data='+encodeURIComponent(q),signal:AbortSignal.timeout(15000)});
      if(r.ok){const j=await r.json();return(j.elements||[]).map(osmItem).filter(x=>x.phone)}}catch{}
    if(k<1)await sleep(3000)}
  return null}
async function phoneAll(){const list=VP().filter(p=>!p.ent?.tel&&(p.ent?.nom||p.ent?.enseigne));if(!list.length)return;
  const r=S.phoneRun={ids:list.map(p=>p.id),done:[],found:0,step:'Localisation des adresses…'};renderList();
  for(const p of list){if(!p.geo)await posOf(p)}
  const groups=new Map();for(const p of list){if(!p.geo){r.done.push(p.id);continue}const k=Math.floor(p.geo.lat/0.03)+'_'+Math.floor(p.geo.lon/0.03);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(p)}
  for(const ps of groups.values()){const b={s:Math.min(...ps.map(p=>p.geo.lat))-0.002,n:Math.max(...ps.map(p=>p.geo.lat))+0.002,w:Math.min(...ps.map(p=>p.geo.lon))-0.003,e:Math.max(...ps.map(p=>p.geo.lon))+0.003};
    const pool=await overpassBbox(b);
    for(const p of ps){if(pool){const near=pool.filter(x=>x.lat&&haversine(p.geo,{lat:x.lat,lon:x.lon})<250);
        let x=await findPhone(p,{pool:near}).catch(()=>({status:'err'}));if(x.status!=='ok'&&S.settings.tomtomKey){const tt=await tomtomPhones(p,p.geo);const h=bestPhone(p,tt,p.geo);if(h){p.ent.tel=h.phone;p.ent.telSource=h.src;p.ent.telLookup={at:iso(today()),status:'ok'};touch(p);x={status:'ok'}}}
        if(x.status==='ok')r.found++}else r.failed=true;
      r.done.push(p.id);renderList()}}
  r.end=true;renderSoft(true);setTimeout(()=>{if(S.phoneRun===r){S.phoneRun=null;renderList()}},20000)}
/* ================= Import de SIRET / SIREN en lot ================= */
function importHtml(){const st=S.imp||{};return `<div class="modal" data-act="closem"><div style="max-width:620px"><h2>Créer des fiches depuis des SIRET / SIREN</h2>
  <p style="margin:0;color:var(--ink-2);font-size:13.5px">Colle un ou plusieurs numéros (un par ligne, ou séparés par des virgules ou des espaces). Chaque fiche est créée et remplie depuis le registre officiel, puis l'outil cherche son numéro de standard.</p>
  <textarea class="in" id="imp-text" style="min-height:150px" placeholder="847 689 759&#10;751 972 134 00017&#10;880982301" ${st.busy?'disabled':''}>${esc(st.text||'')}</textarea>
  <div class="ident-row"><span class="lbl">Canal</span><div class="chips">${[['tel','Téléphonique'],['terrain','Terrain']].map(([k,l])=>`<button class="chip" data-act="impsrc" data-v="${k}" aria-pressed="${(st.src||(S.mode==='terrain'?'terrain':'tel'))===k}">${l}</button>`).join('')}</div></div>
  ${st.msg?`<div class="ai" data-s="${st.busy?'busy':''}">${st.busy?'<span class="spin"></span>':''}<span>${esc(st.msg)}</span></div>`:''}
  ${st.log?.length?`<div class="implog">${st.log.map(l=>`<div class="${l.ok?'':'ko'}">${l.ok?'✓':'✕'} ${esc(l.t)}</div>`).join('')}</div>`:''}
  <div class="ident-row" style="justify-content:flex-end"><button class="btn btn-g" data-act="closem">Fermer</button><button class="btn btn-p" data-act="impgo" ${st.busy?'disabled':''}>Créer les fiches</button></div></div></div>`}
function parseNums(txt){const out=[];
  for(const line of String(txt).split(/[\n,;|]+/)){const g=line.match(/\d+/g)||[];let i=0;
    while(i<g.length){if(g[i].length===9||g[i].length===14){out.push(g[i]);i++;continue}
      let acc='',j=i,got=false;while(j<g.length&&acc.length<14){acc+=g[j];j++;if(acc.length===14||(acc.length===9&&(j>=g.length||(acc+g[j]).length>14||g[j].length===9||g[j].length===14))){out.push(acc);got=true;break}}
      i=got?j:i+1}}
  return[...new Set(out)]}
async function runImport(){const txt=$('#imp-text')?.value||'';const st=S.imp=S.imp||{};st.text=txt;
  const nums=parseNums(txt);
  if(!nums.length){st.msg='Aucun SIRET (14 chiffres) ni SIREN (9 chiffres) reconnu.';renderLayer();return}
  st.busy=true;st.log=[];st.msg=`Création de ${nums.length} fiche${nums.length>1?'s':''}…`;renderLayer();const src=st.src||(S.mode==='terrain'?'terrain':'tel');const made=[];
  for(const [i,n] of nums.entries()){
    const dup=dupOf(n);
    if(dup){st.log.push({ok:false,t:`${fmtSiret(n)} : déjà en fiche (${displayName(dup)})`});continue}
    try{const res=await reSearch(n);const r=res.find(x=>x.siren===n.slice(0,9))||res[0];if(!r)throw{fr:'introuvable au registre'};
      const p=blank(src);applyRe(p,r,n.length===14?{siret:n,force:true}:{});const e=pickEtab(r,{siret:n.length===14?n:''});if(e?.latitude)p.geo={lat:+e.latitude,lon:+e.longitude};
      p.journal.push({id:rid(),date:new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,19),canal:'note',issue:'Créée depuis un SIRET/SIREN',texte:fmtSiret(n)});
      const d2=dupOf(p.ent.siret||n);if(d2){st.log.push({ok:false,t:`${fmtSiret(n)} : déjà en fiche (${displayName(d2)})`});continue}
      p.createdAt=Date.now()+i;S.P.set(p.id,p);touch(p);made.push(p);st.log.push({ok:true,t:`${displayName(p)} · ${fmtSiret(p.ent.siret||n)}`})}
    catch(e){st.log.push({ok:false,t:`${fmtSiret(n)} : ${e?.fr||'introuvable au registre'}`})}
    st.msg=`${i+1}/${nums.length} traités…`;if(S.imp===st)renderLayer()}
  S.lastBatch=made.map(p=>p.id);renderSoft(false);
  let ph=0;for(const [i,p] of made.entries()){st.msg=`Fiches créées. Recherche des numéros de standard ${i+1}/${made.length}…`;if(S.imp===st)renderLayer();try{const r=await findPhone(p,{silent:true});if(r.status==='ok')ph++}catch{}}
  st.busy=false;st.text='';st.msg=`${made.length} fiche${made.length>1?'s':''} créée${made.length>1?'s':''}, ${ph} numéro${ph>1?'s':''} de standard trouvé${ph>1?'s':''}. Elles sont dans Prospects (filtre « Dernier ajout »).`;
  if(S.imp===st)renderLayer();renderSoft(false);toast(`${made.length} fiches créées`)}

/* ================= Import d'un fichier (Excel, CSV, PDF) ================= */
const FCOLS_X=[['contact2','Contact 2'],['fonction2','Fonction 2'],['telsrc','Source du numéro']];
const FCOLS=[['','Ignorer'],['siret','SIRET (établissement)'],['siren','SIREN (entreprise)'],['sir','SIRET ou SIREN'],['nom','Raison sociale'],['enseigne','Nom commercial'],['tel','Standard (téléphone)'],['mobile','Mobile'],['contact','Contact (nom complet)'],['prenom','Prénom'],['cnom','Nom du contact'],['fonction','Fonction'],['email','Email'],['adresse','Adresse'],['cp','Code postal'],['ville','Ville'],['note','Notes / commentaire'],...FCOLS_X];
const FHDR=[['',/annuaire|lien|url|fiabilit|latitude|longitude|^ess$|^sigle$|nb dirigeants|annee|effectif|categorie|forme|creation|naf|activit|secteur|^ca\b|resultat|convention|etablissements|profil/],['telsrc',/source du (numero|tel)/],['siret',/siret/],['siren',/siren/],['sir',/n°\s*(d')?entreprise|identifiant|immatricul/],['tel',/t[ée]l|phone|standard|fixe|num[ée]ro(?!.*(siret|siren))/],['mobile',/mobile|portable|gsm|cell/],['email',/mail|courriel/],['nom',/raison|soci[ée]t[ée]|entreprise|d[ée]nomination|client|compte|^nom$|company/],['enseigne',/enseigne|commercial/],['contact',/contact|interlocut|dirigeant|responsable/],['prenom',/pr[ée]nom/],['cnom',/^nom\s*(du)?\s*contact|nom de famille/],['fonction',/fonction|qualit|poste|titre|r[ôo]le/],['adresse',/adresse|rue|voie/],['cp',/code\s*postal|^cp$|postal/],['ville',/ville|commune|localit/],['note',/note|comment|remarque|observ|info/]];
let fLibs={};
const LOCAL_LIB={xlsx:'lib/xlsx.full.min.js',excel:'lib/exceljs.min.js'};
const addScript=src=>new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>{s.remove();rej(new Error('lib'))};document.head.appendChild(s)});
function loadLib(key,url,glob){if(window[glob])return Promise.resolve(window[glob]);if(fLibs[key])return fLibs[key];
  fLibs[key]=(async()=>{for(const src of [LOCAL_LIB[key],url].filter(Boolean)){try{await addScript(src);if(window[glob])return window[glob]}catch{}}fLibs[key]=null;throw new Error('lib')})();return fLibs[key]}
const cellStr=v=>{if(v==null)return'';if(typeof v==='number')return Number.isInteger(v)?v.toFixed(0):String(v);if(v instanceof Date)return iso(v);return String(v).replace(/\s+/g,' ').trim()};
function decodeText(buf){let t=new TextDecoder('utf-8').decode(buf);if(/\uFFFD/.test(t))try{t=new TextDecoder('windows-1252').decode(buf)}catch{}return t.replace(/^\uFEFF/,'')}
function parseCsv(t){const first=t.split(/\r?\n/).find(l=>l.trim())||'';const d=[';','\t',',','|'].map(c=>[c,first.split(c).length]).sort((a,b)=>b[1]-a[1])[0][0];
  const rows=[];let row=[],cell='',q=false;for(let i=0;i<t.length;i++){const ch=t[i];
    if(q){if(ch==='"'){if(t[i+1]==='"'){cell+='"';i++}else q=false}else cell+=ch;continue}
    if(ch==='"'){q=true;continue}if(ch===d){row.push(cell);cell='';continue}if(ch==='\n'||ch==='\r'){if(ch==='\r'&&t[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';continue}cell+=ch}
  if(cell||row.length){row.push(cell);rows.push(row)}return rows}
async function readXlsx(buf){const X=await loadLib('xlsx','https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js','XLSX');const wb=X.read(buf,{type:'array',cellDates:true});
  return wb.SheetNames.map(n=>({name:n,rows:X.utils.sheet_to_json(wb.Sheets[n],{header:1,raw:true,defval:''})})).filter(s=>s.rows.some(r=>r.some(c=>cellStr(c))))}
async function readPdf(buf){const L=await loadLib('pdf','https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js','pdfjsLib');L.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  const doc=await L.getDocument({data:buf}).promise;const rows=[];
  for(let i=1;i<=doc.numPages;i++){const pg=await doc.getPage(i);const tc=await pg.getTextContent();const lines=new Map();
    for(const it of tc.items){if(!it.str||!it.str.trim())continue;const y=Math.round(it.transform[5]/3);const k=[...lines.keys()].find(z=>Math.abs(z-y)<=1)??y;if(!lines.has(k))lines.set(k,[]);lines.get(k).push({x:it.transform[4],w:it.width||0,s:it.str})}
    for(const k of [...lines.keys()].sort((a,b)=>b-a)){const its=lines.get(k).sort((a,b)=>a.x-b.x);const cells=[];let last=null;
      for(const it of its){if(last&&it.x-(last.x+last.w)<10){cells[cells.length-1]+=(it.x-(last.x+last.w)>1.5?' ':'')+it.s}else cells.push(it.s);last=it}
      rows.push(cells.map(c=>c.replace(/\s+/g,' ').trim()))}}
  if(!rows.length)throw{fr:'Ce PDF ne contient pas de texte (document scanné). Demande la version Excel ou un PDF « texte ».'};return rows}
const isPhone=s=>{const d=String(s).replace(/[^\d+]/g,'').replace(/^\+33|^0033/,'0');return /^0[1-9]\d{8}$/.test(d)||/^[1-9]\d{8}$/.test(d)&&/[\s.]/.test(String(s))};
const telOf=s=>{let d=String(s||'').split(/[\/;,]| ou /)[0].replace(/[^\d+]/g,'');if(d.startsWith('+33'))d='0'+d.slice(3);if(d.startsWith('0033'))d='0'+d.slice(4);if(/^[1-9]\d{8}$/.test(d))d='0'+d;return /^0[1-9]\d{8}$/.test(d)?d:''};
const sirOfCell=s=>{const d=String(s||'').replace(/[\s.\-]/g,'');return /^\d{14}$/.test(d)?d:/^\d{9}$/.test(d)?d:''};
function guessMap(rows){const W=Math.max(0,...rows.slice(0,200).map(r=>r.length));let hdr=-1,best=0;
  for(let i=0;i<Math.min(rows.length,15);i++){const sc=rows[i].filter(c=>FHDR.some(([,re])=>re.test(norm(cellStr(c))))).length;if(sc>best&&sc>=2){best=sc;hdr=i}}
  const map=Array(W).fill('');const used=new Set();const ign=new Set();
  if(hdr>=0)rows[hdr].forEach((c,j)=>{const h=norm(cellStr(c));if(!h)return;const hit=FHDR.find(([k,re])=>re.test(h)&&!(k&&used.has(k)&&!['note','contact','fonction'].includes(k)));if(!hit)return;let k=hit[0];if(!k){ign.add(j);return}
    if((k==='contact'||k==='fonction')&&used.has(k))k=used.has(k+'2')?'':k+'2';map[j]=k;if(k)used.add(k)});
  const body=rows.slice(hdr+1).filter(r=>r.some(c=>cellStr(c)));
  for(let j=0;j<W;j++){const vals=body.map(r=>cellStr(r[j])).filter(Boolean).slice(0,300);if(!vals.length)continue;const share=f=>vals.filter(f).length/vals.length;
    if(map[j]==='tel'||map[j]==='mobile'){if(share(v=>telOf(v))<0.3&&share(v=>sirOfCell(v))>0.6)map[j]='sir';continue}
    if(map[j]==='siren'&&share(v=>/^\d{14}$/.test(v.replace(/[\s.]/g,'')))>0.6){map[j]='siret';continue}
    if(map[j]==='siret'&&share(v=>/^\d{9}$/.test(v.replace(/[\s.]/g,'')))>0.6&&!map.includes('siren')){map[j]='siren';continue}
    if(map[j]||ign.has(j))continue;
    if(share(v=>/^\d{14}$/.test(v.replace(/[\s.]/g,'')))>0.6&&!map.includes('siret')){map[j]='siret';continue}
    if(share(v=>/^\d{3}\s?\d{3}\s?\d{3}$/.test(v))>0.6&&!map.includes('siren')&&share(v=>/^0/.test(v))<0.5){map[j]='siren';continue}
    if(share(v=>telOf(v))>0.6){const mob=share(v=>/^0[67]/.test(telOf(v)))>0.6;const k=mob&&!used.has('mobile')?'mobile':!used.has('tel')?'tel':!used.has('mobile')?'mobile':'';if(k){map[j]=k;used.add(k)}continue}
    if(share(v=>/@/.test(v))>0.6&&!used.has('email')){map[j]='email';used.add('email');continue}
    if(share(v=>/^\d{5}$/.test(v))>0.7&&!used.has('cp')){map[j]='cp';used.add('cp');continue}}
  const auto=!map.some(k=>/^(sir|siret|siren)$/.test(k));
  return{hdr,map,auto,W}}
function fimpRows(st){return st.rows.slice(st.hdr+1).filter(r=>r.some(c=>cellStr(c)))}
const looksCompany=s=>{s=String(s||'').trim();return !!s&&(!/[a-zà-ÿ]/.test(s)&&s.split(/\s+/).length<=4||/\b(SAS|SARL|HOLDING|CONSEIL|GROUP|GROUPE|INVEST|PARTICIPATIONS|CAPITAL|SA|SCI|SELARL|GESTION|FINANCE)\b/.test(s)&&!/[a-zà-ÿ]{3,}\s+[A-Z]{2,}/.test(s))};
/* numéros d'autres feuilles du même fichier, retrouvés par SIRET / SIREN */
function crossPhones(st){const m=new Map();for(const [i,sh] of (st.sheets||[]).entries()){if(i===st.si)continue;const g=guessMap(sh.rows);if(!g.map.some(k=>['tel','mobile','enseigne'].includes(k)))continue;const s2={...g,rows:sh.rows};
    for(const r of fimpRows(s2)){const x=rowRec(s2,r);if(!x.sir||!(x.tel||x.mob||x.enseigne))continue;const merge=k=>{const o=m.get(k)||{};for(const f of ['tel','mob','telsrc','note','enseigne'])if(!o[f]&&x[f])o[f]=x[f];m.set(k,o)};merge(x.sir);merge(x.sir.slice(0,9))}}
  return m}
function rowRec(st,r){const o={};st.map.forEach((k,j)=>{if(!k)return;const v=cellStr(r[j]);if(!v)return;o[k]=o[k]?o[k]+' '+v:v});
  const full=r.map(cellStr).join('  ');
  const hasCol=st.map.some(k=>/^(sir|siret|siren)$/.test(k));
  let sir=[o.siret,o.sir,o.siren].map(v=>sirOfCell(v)).find(v=>v.length===14)||[o.sir,o.siren,o.siret].map(v=>sirOfCell(v)).find(Boolean)||'';
  if(!sir){const ns=parseNums(hasCol?[o.siret,o.sir,o.siren].filter(Boolean).join(' '):full);sir=ns.find(n=>n.length===14)||ns.find(n=>n.length===9&&!isPhone(n))||''}
  let tel=telOf(o.tel),mob=telOf(o.mobile);if(!tel&&!mob&&!st.map.some(k=>k==='tel'||k==='mobile')){const ph=[...full.matchAll(/(?:\+33\s?|0)[1-9](?:[\s.\-]?\d{2}){4}/g)].map(m=>telOf(m[0])).filter(Boolean);tel=ph.find(x=>!/^0[67]/.test(x))||'';mob=ph.find(x=>/^0[67]/.test(x))||''}
  if(!tel&&mob&&!o.contact&&!o.cnom&&!o.prenom){tel=mob;mob=''}
  const email=o.email||(full.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)||[])[0]||'';
  return{sir,tel,mob,email:email.replace(/[.\-]+$/,''),nom:o.nom||'',enseigne:o.enseigne||'',contact:o.contact||'',prenom:o.prenom||'',cnom:o.cnom||'',fonction:o.fonction||'',contact2:o.contact2||'',fonction2:o.fonction2||'',telsrc:o.telsrc||'',adresse:o.adresse||'',cp:(o.cp||'').match(/\d{5}/)?.[0]||'',ville:o.ville||'',note:o.note||''}}
const importable=x=>!!(x.sir||x.nom||x.enseigne||x.tel||x.mob);
function fimpStats(st){const recs=fimpRows(st).map(r=>rowRec(st,r));const keys=new Map();let inFile=0,dup=0;
  for(const x of recs.filter(importable)){const ks=[x.sir&&x.sir.length===14&&'s'+x.sir,x.tel&&'t'+x.tel,x.mob&&'t'+x.mob,x.email&&'m'+x.email.toLowerCase(),nmKey(x.nom||x.enseigne||'').length>=4&&'n'+nmKey(x.nom||x.enseigne)+'|'+(x.cp||'')].filter(Boolean);
    if(ks.some(k=>keys.has(k))){inFile++;continue}ks.forEach(k=>keys.set(k,1));if(findMatch(x))dup++}
  const ok=recs.filter(importable).length;
  return{lignes:recs.length,sir:recs.filter(x=>x.sir).length,ok,tel:recs.filter(x=>x.tel||x.mob||(x.sir&&[st.cross?.get(x.sir),st.cross?.get(x.sir.slice(0,9))].some(c=>c?.tel||c?.mob))).length,dup,inFile,sansSir:recs.filter(x=>!x.sir&&importable(x)).length,neuves:Math.max(0,ok-dup-inFile)}}
function fimpHtml(){const st=S.fimp||{};const src=st.src||'tel';
  const head=`<h2>Importer un fichier</h2><p class="fsub">Excel, CSV ou PDF de ton entreprise : chaque ligne devient une fiche (complétée par le registre officiel quand il y a un SIRET). Si une fiche existe déjà avec le même SIRET, téléphone, e-mail ou nom, les infos sont combinées au lieu de créer un doublon.</p>`;
  if(!st.rows)return `<div class="modal" data-act="closem"><div class="fimp">${head}
    <label class="drop${st.drag?' on':''}" id="fdrop"><input type="file" id="fimp-in" accept=".xlsx,.xls,.xlsm,.ods,.csv,.txt,.pdf" hidden>
      <b>${st.busy?'<span class="spin"></span> Lecture du fichier…':'Glisse ton fichier ici'}</b><span>ou clique pour le choisir · .xlsx, .xls, .csv, .pdf</span></label>
    ${st.msg?`<div class="ai"><span>${esc(st.msg)}</span></div>`:''}
    <div class="ident-row" style="justify-content:flex-end"><button class="btn btn-g" data-act="closem">Fermer</button></div></div></div>`;
  const rows=fimpRows(st);const s=fimpStats(st);const W=st.W;const prev=rows.slice(0,6);const run=st.run;
  return `<div class="modal" data-act="closem"><div class="fimp wide">${head}
   <div class="fname"><b>${esc(st.name)}</b><span>${s.lignes} ligne${s.lignes>1?'s':''}</span>${run?'':`<button class="btn btn-q btn-s" data-act="fimpreset">Changer de fichier</button>`}</div>
   ${!run&&st.sheets?.length>1?`<div class="lbl">Feuille à importer</div><div class="chips">${st.sheets.map((sh,i)=>`<button class="chip" data-act="fimpsheet" data-v="${i}" aria-pressed="${st.si===i}">${esc(sh.name)} · ${sh.nsir} SIRET${sh.ntel?` · ${sh.ntel} n°`:''}</button>`).join('')}</div>`:''}
   ${run?'':`<div class="lbl">Colonnes reconnues · corrige si besoin</div>
   <div class="ftab"><table><thead><tr>${Array.from({length:W},(_,j)=>`<th><select data-fcol="${j}">${FCOLS.map(([k,l])=>`<option value="${k}" ${st.map[j]===k?'selected':''}>${l}</option>`).join('')}</select>${st.hdr>=0?`<small>${esc(trunc(cellStr(st.rows[st.hdr][j]),28))}</small>`:''}</th>`).join('')}</tr></thead>
    <tbody>${prev.map(r=>`<tr>${Array.from({length:W},(_,j)=>`<td class="${st.map[j]?'on':''}">${esc(trunc(cellStr(r[j]),40))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
   <div class="fstats"><div><b>${s.sir}</b><span>avec SIRET / SIREN</span></div><div><b>${s.tel}</b><span>avec un numéro</span></div><div><b>${s.dup}</b><span>déjà en fiche : infos combinées</span></div><div><b>${s.sansSir}</b><span>sans SIRET (créées quand même)</span></div></div>
   ${st.cross?.size&&!run?`<p class="fsub">📞 Les numéros et enseignes des autres feuilles du fichier sont ajoutés automatiquement (retrouvés par SIRET / SIREN).</p>`:''}
   ${s.inFile?`<p class="fsub">${s.inFile} ligne${s.inFile>1?'s':''} en double dans le fichier (même SIRET, téléphone ou e-mail) : regroupée${s.inFile>1?'s':''} dans une seule fiche.</p>`:''}
   <div class="ident-row"><span class="lbl">Canal</span><div class="chips">${[['tel','Téléphonique'],['terrain','Terrain']].map(([k,l])=>`<button class="chip" data-act="fimpsrc" data-v="${k}" aria-pressed="${src===k}">${l}</button>`).join('')}</div></div>`}
   ${run?`<div class="ai" data-s="${run.end?'':'busy'}">${run.end?'':'<span class="spin"></span>'}<span>${esc(run.msg)}</span></div>
     <div class="fprog"><i style="width:${Math.round(run.done/Math.max(1,run.total)*100)}%"></i></div>
     ${run.log.length?`<div class="implog">${run.log.slice(-200).map(l=>`<div class="${l.ok?'':l.warn?'warn':'ko'}">${l.ok?'✓':l.warn?'•':'✕'} ${esc(l.t)}</div>`).join('')}</div>`:''}`:''}
   <div class="ident-row" style="justify-content:flex-end">${run&&!run.end?`<button class="btn btn-q" data-act="fimpstop">Arrêter le complément</button><button class="btn btn-p" data-act="closem">Voir mes fiches (le complément continue)</button>`:run?.end?`<button class="btn btn-g" data-act="closem">Fermer</button><button class="btn btn-p" data-act="fimpsee">Voir les fiches importées</button>`:`<button class="btn btn-g" data-act="closem">Annuler</button><button class="btn btn-p" data-act="fimpgo" ${s.ok?'':'disabled'}>Importer : ${s.neuves} nouvelle${s.neuves>1?'s':''}${s.dup?` + ${s.dup} complétée${s.dup>1?'s':''}`:''}</button>`}</div>
  </div></div>`}
function fimpSheet(st,i){const sh=st.sheets[i];st.si=i;st.rows=sh.rows;Object.assign(st,guessMap(sh.rows));st.cross=crossPhones(st)}
async function fimpFile(f){const st=S.fimp={src:S.fimp?.src||(S.mode==='terrain'?'terrain':'tel'),busy:true,name:f.name};renderLayer();
  try{const buf=new Uint8Array(await f.arrayBuffer());const ext=(f.name.split('.').pop()||'').toLowerCase();let rows;
    let sheets;
    if(ext==='pdf'||(buf[0]===0x25&&buf[1]===0x50))sheets=[{name:'PDF',rows:await readPdf(buf)}];
    else if(['csv','txt'].includes(ext))sheets=[{name:'CSV',rows:parseCsv(decodeText(buf))}];
    else sheets=await readXlsx(buf);
    if(!sheets.length)throw{fr:'Le fichier est vide.'};
    for(const sh of sheets){const g=guessMap(sh.rows);const s2={...g,rows:sh.rows};const recs=fimpRows(s2).map(r=>rowRec(s2,r));sh.n=recs.length;sh.nsir=recs.filter(x=>x.sir).length;sh.ntel=recs.filter(x=>x.sir&&(x.tel||x.mob)).length}
    const useful=sheets.filter(s=>s.nsir);const pick=(useful.length?useful:sheets).slice().sort((a,b)=>(b.ntel/Math.max(1,b.nsir))-(a.ntel/Math.max(1,a.nsir))||b.ntel-a.ntel||b.nsir-a.nsir)[0];
    st.sheets=sheets;fimpSheet(st,sheets.indexOf(pick));st.busy=false}
  catch(e){Object.assign(st,{busy:false,msg:e?.fr||(e?.message==='lib'?'Le lecteur Excel n’a pas pu se charger. Recharge la page (Ctrl + F5) puis réessaie.':'Fichier illisible ('+(e?.message||'format inconnu')+'). Dans Excel : Fichier → Enregistrer sous → « Classeur Excel (.xlsx) » ou « CSV UTF-8 », puis réessaie.')})}
  if(S.fimp===st)renderLayer()}
/* Fiche déjà existante pour cette ligne ? (évite les doublons, on combine) */
const telsOf=p=>[p.ent?.tel,p.ent?.telAlt,...(p.contacts||[]).flatMap(c=>[c.tel,c.mobile])].map(telOf).filter(Boolean);
const mailsOf=p=>[p.ent?.email,...(p.contacts||[]).map(c=>c.email)].filter(Boolean).map(x=>x.toLowerCase().trim());
const nmKey=s=>norm(s).replace(/\b(sas|sarl|sa|sasu|eurl|sci|selarl|selas|scp|snc|ste|societe|cabinet|etude|the|le|la|les|l|de|du|des|et)\b/g,'').replace(/[^a-z0-9]/g,'');
function findMatch(x,exceptId){const sr=String(x.sir||'').slice(0,9);/* deux SIREN différents = deux entreprises différentes, même si le standard est partagé */
  const P=[...S.P.values()].filter(p=>p.id!==exceptId&&!(sr.length===9&&sirOf(p).siren&&sirOf(p).siren!==sr));let why='';
  const by=(f,w)=>{const p=P.find(f);if(p&&!why)why=w;return p};
  const sir=String(x.sir||'');const tels=[x.tel,x.mob].map(telOf).filter(Boolean);const mail=String(x.email||'').toLowerCase().trim();
  const nk=nmKey(x.nom||x.enseigne||''),cp=x.cp||'';
  const p=(sir.length===14&&by(q=>sirOf(q).siret===sir,'même SIRET'))
    ||(tels.length&&by(q=>telsOf(q).some(t=>tels.includes(t)),'même numéro de téléphone'))
    ||(mail&&!/^(contact|info|accueil|bonjour)@(gmail|hotmail|orange|wanadoo|free|yahoo)/.test(mail)&&by(q=>mailsOf(q).includes(mail),'même e-mail'))
    ||(sir.length>=9&&by(q=>sirOf(q).siren===sir.slice(0,9)&&(!sirOf(q).siret||sir.length===9)&&(!cp||!q.ent?.cp||q.ent.cp===cp),'même SIREN'))
    ||(nk.length>=4&&by(q=>[q.ent?.nom,q.ent?.enseigne].some(n=>n&&nmKey(n)===nk)&&(!cp||!q.ent?.cp||q.ent.cp===cp),'même nom'))||null;
  return p?{p,why}:null}
/* SIREN seul : retrouver l'établissement visé (adresse / code postal / ville du fichier) plutôt que le siège */
async function resolveEtab(x){const siren=x.sir.slice(0,9);
  if(x.sir.length===14){const res=await reSearch(x.sir);const r=res.find(z=>z.siren===siren);if(!r)return{};const e=etabsOf(r).find(z=>z.siret===x.sir);if(e)return{r,e};
    const r2=(await reSearch(nameOf(r),{code_postal:x.cp||undefined,etabs:true,per_page:20})).find(z=>z.siren===siren);const e2=r2&&etabsOf(r2).find(z=>z.siret===x.sir);return e2?{r:r2,e:e2}:{r,e:{siret:x.sir}}}
  const res=await reSearch(siren);const r=res.find(z=>z.siren===siren)||null;if(!r)return{};
  if(!isGroup(r))return{r,e:r.siege};
  const nb=r.nombre_etablissements_ouverts;
  if(!x.cp&&!x.ville&&!x.adresse)return{r,e:r.siege,how:`${nb} établissements et pas d’adresse dans le fichier : siège utilisé (ajoute une colonne adresse / code postal pour cibler l’établissement)`};
  const tries=[];if(x.cp)tries.push([r.nom_complet||nameOf(r),{code_postal:x.cp}]);if(x.adresse||x.ville)tries.push([[r.nom_complet||nameOf(r),x.adresse,x.cp,x.ville].filter(Boolean).join(' '),{}]);if(x.ville)tries.push([[r.nom_complet||nameOf(r),x.ville].join(' '),{}]);
  let best=null,bs=-1,br=null,closed=null;
  for(const [q,o] of tries){
    const rr=(await reSearch(q,{...o,etabs:true,per_page:20}).catch(()=>[])).find(z=>z.siren===siren);if(!rr)continue;
    for(const e of (rr.matching_etablissements||[])){if(e.etat_administratif==='F'){if(!closed&&(!x.cp||addrOf(e).cp===x.cp))closed=e;continue}const a=addrOf(e);const s=(x.cp&&a.cp===x.cp?3:0)+(x.ville&&norm(a.ville).includes(norm(x.ville).split(/[\s-]/)[0])?1:0)+(x.adresse?sim(x.adresse,a.rue)*3+(String(x.adresse).match(/^\d+/)?.[0]===String(a.rue).match(/^\d+/)?.[0]?1:0):0);if(s>bs){bs=s;best=e;br=rr}}
    if(bs>=4)break}
  if(best&&bs>=3)return{r:br,e:best};
  if(best)return{r:br,e:best,how:`établissement le plus proche de l’adresse du fichier (${addrOf(best).rue}, ${addrOf(best).cp}) : à vérifier`};
  if(closed)return{r,e:r.siege,how:`l’établissement ${addrOf(closed).rue}, ${addrOf(closed).cp} est FERMÉ au registre : vérifie s’ils sont toujours là (siège utilisé en attendant)`};
  return{r,e:r.siege,how:`aucun établissement trouvé à l’adresse du fichier : siège utilisé`}}
async function fimpRun(){const st=S.fimp;if(!st?.rows||st.run)return;const recs=fimpRows(st).map(r=>rowRec(st,r));const src=st.src||'tel';
  const run=st.run={done:0,total:recs.length,log:[],msg:'Démarrage…',made:[],upd:[],stop:false};renderLayer();const seen=new Set();let nok=0;
  const fill=(p,x,fromReg)=>{const ch=[];const set=(k,v)=>{if(!v)return;const cv=getP(p,k);if(!filled(cv)){setP(p,k,v);ch.push(k)}};
    if(x.tel){if(!p.ent.tel){p.ent.tel=x.tel;p.ent.telSource=x.telsrc?'fichier : '+x.telsrc:'fichier entreprise';p.ent.telLookup={at:iso(today()),status:'ok'};ch.push('tel')}else if(p.ent.tel!==x.tel&&p.ent.telAlt!==x.tel){p.ent.telAlt=x.tel;ch.push('telAlt')}}
    set('ent.nom',niceCase(x.nom||x.enseigne));set('ent.adresse',x.adresse);set('ent.cp',x.cp);set('ent.ville',x.ville&&niceCase(x.ville));
    if(x.sir&&!p.ent.siren){p.ent.siren=x.sir.slice(0,9);if(x.sir.length===14)p.ent.siret=x.sir;ch.push('siret')}
    set('ent.enseigne',x.enseigne&&norm(x.enseigne)!==norm(p.ent.nom||'')?x.enseigne:'');
    if(x.email&&!/@/.test(p.ent.email||'')&&/^(contact|info|accueil|secretariat|office|bonjour|cabinet|agence)@/i.test(x.email))set('ent.email',x.email);
    for(const [cn,fn] of [[x.contact2,x.fonction2]])if(cn&&!looksCompany(cn)){const w=cn.replace(/\s*\(.*\)\s*$/,'').split(/\s+/);applyPatch(p,{contacts:[{prenom:w.length>1?niceCase(w[0]):'',nom:niceCase(w.length>1?w.slice(1).join(' '):w[0]),fonction:fn?fonctionRne(fn):'',decideur:'Oui'}]},false)}
    if(looksCompany(x.contact))x.contact='';
    let pn=x.prenom,nn=x.cnom;if(x.contact&&!pn&&!nn){const w=x.contact.replace(/^(M\.|Mr|Mme|Madame|Monsieur|Me|Dr)\s+/i,'').replace(/\s*\(.*\)\s*$/,'').split(/\s+/);if(w.length>1){pn=w[0];nn=w.slice(1).join(' ')}else nn=w[0]}
    const c={prenom:pn&&niceCase(pn),nom:nn&&niceCase(nn),fonction:x.fonction?fonctionRne(x.fonction):'',decideur:x.fonction&&/pr[ée]sident|g[ée]rant|directeur|dirigeant|associ/i.test(x.fonction)?'Oui':undefined,mobile:x.mob,email:x.email&&!/^(contact|info|accueil|secretariat|office|bonjour|cabinet|agence)@/i.test(x.email)?x.email:'',civ:/^(Mme|Madame)/i.test(x.contact)?'Mme':/^(M\.|Mr|Monsieur)/i.test(x.contact)?'M.':''};
    if(c.prenom||c.nom||c.mobile||c.email){const r=applyPatch(p,{contacts:[c]},false);if(r.length)ch.push('contact')}
    if(x.note){p.journal=p.journal||[];p.journal.push({id:rid(),date:new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,19),canal:'note',issue:'Import '+st.name,texte:x.note})}
    return ch};
  for(const x of recs){const c=x.sir&&(st.cross?.get(x.sir)||st.cross?.get(x.sir.slice(0,9)));if(c){for(const f of ['tel','mob','telsrc','note','enseigne'])if(!x[f]&&c[f])x[f]=c[f]}}
  /* Étape 1 (instantanée) : toutes les fiches apparaissent tout de suite, doublons combinés */
  const todo=[];
  for(const [i,x] of recs.entries()){if(!importable(x))continue;const label=x.nom||x.enseigne||(x.sir?fmtSiret(x.sir):'ligne '+(i+1));
    const mt=findMatch(x);
    if(mt){const d=mt.p;const ch=fill(d,x,true);if(ch.length){touch(d);if(!run.upd.includes(d.id)&&!run.made.includes(d.id))run.upd.push(d.id);run.log.push({ok:true,t:`${displayName(d)} : déjà en fiche (${mt.why}) → ${ch.includes('tel')?'numéro ajouté':ch.includes('telAlt')?'2e numéro ajouté':ch.includes('siret')?'SIRET ajouté':'infos combinées'}`})}
      else run.log.push({warn:true,t:`${displayName(d)} : déjà en fiche (${mt.why}), rien de nouveau`});
      if(x.sir&&d.rne?.status!=='ok'&&!todo.some(t=>t.p===d))todo.push({p:d,x});continue}
    const p=blank(src);p.createdAt=Date.now()+i;fill(p,x,false);if(x.sir){p.ent.siren=x.sir.slice(0,9);if(x.sir.length===14)p.ent.siret=x.sir}
    p.journal.push({id:rid(),date:new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,19),canal:'note',issue:'Importée depuis '+st.name,texte:x.sir?fmtSiret(x.sir):''});
    S.P.set(p.id,p);touch(p);run.made.push(p.id);
    if(x.sir)todo.push({p,x,label});else run.log.push({warn:true,t:`${label}${p.ent.tel?' · 📞 '+fmtTel(p.ent.tel):''} : créée sans SIRET (à identifier)`})}
  S.lastBatch=[...run.made,...run.upd];S.filter='batch';S.q='';if($('#q'))$('#q').value='';S.view='list';if(S.mode==='terrain')S.sel=null;render();
  toast(`${run.made.length} fiche${run.made.length>1?'s':''} ajoutée${run.made.length>1?'s':''}${run.upd.length?`, ${run.upd.length} complétée${run.upd.length>1?'s':''}`:''} : complément au registre en cours…`);
  /* Étape 2 : complément au registre officiel (adresse exacte, dirigeants, effectif…) fiche par fiche */
  run.total=todo.length;
  for(const [i,{p,x,label}] of todo.entries()){if(run.stop)break;run.done=i;run.msg=`Complément au registre : ${i+1} / ${todo.length} · ${run.made.length} créée${run.made.length>1?'s':''}, ${run.upd.length} complétée${run.upd.length>1?'s':''} (les fiches sont déjà dans ta liste)`;if(S.fimp===st&&i%2===0)renderLayer();
    try{const {r,e:et,how}=await resolveEtab(x);if(!r)throw{fr:'introuvable'};
      applyRe(p,r,et?{siret:et.siret,force:true,soft:!run.made.includes(p.id)}:{cp:x.cp,soft:!run.made.includes(p.id)});const e=et||pickEtab(r,{});if(how)run.log.push({warn:true,t:`${nameOf(r)} : ${how}`});if(e?.latitude&&!p.geo)p.geo={lat:+e.latitude,lon:+e.longitude};
      fill(p,x,true);touch(p);if(label)run.log.push({ok:true,t:`${displayName(p)}${p.ent.tel?' · 📞 '+fmtTel(p.ent.tel):''}`})}
    catch(err){nok++;run.log.push({warn:true,t:`${label||displayName(p)} : ${err?.fr==='introuvable'?'SIRET '+fmtSiret(x.sir)+' introuvable au registre':'registre indisponible'}, gardée avec les données du fichier`})}
    if(i%5===4)renderSoft(false)}
  run.done=run.total;run.end=true;S.lastBatch=[...run.made,...run.upd];
  run.msg=`${run.stop?'Arrêté. ':''}${run.made.length} fiche${run.made.length>1?'s':''} créée${run.made.length>1?'s':''}, ${run.upd.length} complétée${run.upd.length>1?'s':''}${nok?`, ${nok} problème${nok>1?'s':''}`:''}.`;
  renderSoft(false);if(S.fimp===st)renderLayer();toast(run.msg)}

/* ================= Événements ================= */
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const f=ACT[b.dataset.act];if(f){if(b.tagName==='A'&&b.dataset.act!=='closem')return;f(b,e)}});
document.addEventListener('input',e=>{const el=e.target;
  if(el.id==='q'){S.q=el.value;if(S.view!=='list'){S.view='list';if(S.mode==='terrain')S.sel=null;render();$('#q').focus()}else if(S.mode==='terrain'&&S.sel){S.sel=null;render();$('#q').focus()}else renderList();return}
  if(el.id==='note-in'&&S.sel){lsSet('radar-draft-'+S.sel,el.value);return}
  if(el.id==='qn-nom'||el.id==='qn-txt'){lsSet(el.id==='qn-nom'?'radar-qn-nom':'radar-qn-txt',el.value);return}
  if((el.id==='ident-in'||(el.dataset.k==='ent.nom'&&cur()?.rne?.status!=='ok'))){clearTimeout(sugT);sugT=setTimeout(()=>suggest(el),380)}
  if((el.dataset.k==='ent.siret'||el.dataset.k==='ent.siren')&&cur()){const d=el.value.replace(/\D/g,'');const p=cur();if(((d.length===14&&luhn(d))||(d.length===9&&el.dataset.k==='ent.siren'))&&(p.rne?.status!=='ok'||p.ent?.siren!==d.slice(0,9))){setTimeout(()=>identify(p,d),50)}}
  if(el.dataset.k&&!el.classList.contains('chip-in')){const f=defOf(el.dataset.def||el.dataset.k);let v=el.value;if(f&&f.t==='num')v=v===''?'':+v;if(f&&(f.t==='tel'||/siret|siren/.test(f.k)))v=v.replace(/[^\d+]/g,'');
    setField(el.dataset.k,v);if(el.dataset.k==='ent.nom'||el.dataset.k.startsWith('ent.'))renderList();
    if(el.dataset.k==='ent.siret'&&v.length===14&&!cur().ent.siren){cur().ent.siren=v.slice(0,9);const s=$('#f-ent-siren');if(s)s.value=fmtSiret(cur().ent.siren)}}});
document.addEventListener('change',e=>{const el=e.target;
  if((el.id==='exp-from'||el.id==='exp-to')&&S.exp){S.exp[el.id==='exp-from'?'from':'to']=el.value;renderLayer();return}
  if(el.id==='who-sel'){S.who=el.value;lsSet(LK()+'-who',S.who);if(S.sel&&!vis(cur()||{}))S.sel=null;S.filter='all';render();toast(el.value==='me'?'Tes fiches':el.value==='all'?'Fiches de toute l’équipe':'Fiches de '+memberName(el.value));return}if(el.id==='imp-in'&&el.files[0]){const f=el.files[0];el.value='';importBackup(f)}
  if(el.id==='fimp-in'&&el.files[0]){const f=el.files[0];el.value='';fimpFile(f);return}
  if(el.dataset.fcol!=null&&S.fimp){const j=+el.dataset.fcol,k=el.value;if(k&&k!=='note')S.fimp.map=S.fimp.map.map((x,i)=>i!==j&&x===k?'':x);S.fimp.map[j]=k;renderLayer();return}
  if(el.dataset.k==='ent.siret'||el.dataset.k==='ent.siren'){el.value=fmtSiret(el.value);renderFiche()}if(el.dataset.def==='c.decideur')$('#tabbody').innerHTML=tabBody(cur())});
document.addEventListener('keydown',e=>{
  const typing=/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)||document.activeElement?.isContentEditable;
  if($('#sugg')&&!$('#sugg').hidden&&document.activeElement===SG.input){
    if(e.key==='ArrowDown'&&SG.items.length){e.preventDefault();SG.idx=(SG.idx+1)%SG.items.length;sgMark();return}
    if(e.key==='ArrowUp'&&SG.items.length){e.preventDefault();SG.idx=(SG.idx-1+SG.items.length)%SG.items.length;sgMark();return}
    if(e.key==='Enter'&&!e.ctrlKey&&!e.metaKey&&SG.idx>=0){e.preventDefault();sgPick(SG.idx);return}
    if(e.key==='Escape'){sgHide();return}}
  if(e.key==='Enter'&&document.activeElement?.id==='pos-in'){e.preventDefault();aroundSearch();return}
  if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();if(document.activeElement?.id==='ident-in')ACT.identify();else if(document.activeElement?.id==='na-note')ACT.addact();else if(S.sel)ACT.analyze();return}
  if(e.key==='Escape'){if(S.help||S.menu||S.sheet){S.help=S.menu=S.sheet=false;renderLayer()}else if(typing)document.activeElement.blur();return}
  if(e.altKey&&S.mode==='poste'&&S.sel&&/^Digit[1-8]$/.test(e.code)){e.preventDefault();const n=+e.code.slice(5);
    if(e.shiftKey){const t=TABS[n-1];if(t){S.tab=t.id;S.flash.delete('tab:'+t.id);$('#tabs').innerHTML=tabsHtml(cur());$('#tabbody').innerHTML=tabBody(cur())}}
    else{const o=OUT.poste.find(x=>x.key===String(n));if(o){const b=$(`[data-act="out"][data-v="${o.k}"]`);if(b)ACT.out(b)}}return}
  if(typing||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='/'){e.preventDefault();$('#q').focus()}
  else if(e.key==='n'||e.key==='N'){e.preventDefault();newProspect()}
  else if(e.key==='?'){S.help=true;renderLayer()}
  else if(e.key==='j'||e.key==='k'){if(S.session&&e.key==='j'){nextInSession();return}const L=filtered();if(!L.length)return;const i=L.findIndex(p=>p.id===S.sel);const ni=e.key==='j'?Math.min(L.length-1,i+1):Math.max(0,i-1);openFiche(L[ni<0?0:ni].id)}
});
window.addEventListener('online',()=>{renderStore();pushQueue();pullAll()});window.addEventListener('offline',renderStore);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){pullAll();pushQueue()}else saveLocal()});
window.addEventListener('pagehide',saveLocal);
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();S.installEvt=e;const b=$('#install-btn');if(b)b.hidden=false});
window.addEventListener('appinstalled',()=>{S.installEvt=null;const b=$('#install-btn');if(b)b.hidden=true;toast('Application installée')});

/* Molette de la souris : défilement horizontal des onglets et filtres */
document.addEventListener('wheel',e=>{const el=e.target.closest?.('.tabs,.filters');if(!el||el.scrollWidth<=el.clientWidth||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;el.scrollLeft+=e.deltaY;e.preventDefault()},{passive:false});
/* ================= Démarrage ================= */
(function boot(){S.mode=document.documentElement.dataset.app==='terrain'?'terrain':'poste';S.view='today';
  if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
  /* Mise à jour automatique : dès qu'une nouvelle version est en ligne, l'appli se recharge (sans perdre de saisie) */
  const checkV=async()=>{try{const t=await fetch('sw.js',{cache:'no-store'}).then(r=>r.text());const v=+(t.match(/radar-v(\d+)/)||[])[1];if(v>APP_V){const busy=/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)||S.ask||S.fimp?.run&&!S.fimp.run.end;if(busy){S.updWait=true;return}toast('Nouvelle version de Radar : mise à jour…');setTimeout(()=>location.reload(),900)}}catch{}};
  if(location.protocol==='https:'){setInterval(checkV,5*60*1000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkV()});document.addEventListener('focusout',()=>{if(S.updWait)setTimeout(checkV,1500)});setTimeout(checkV,4000)}
  try{const h=(location.hash||'').match(/^#(?:gps)?(-?\d{1,2}\.\d+)_(-?\d{1,3}\.\d+)$/);if(h){S.gpsTried=true;S.view='around';setTimeout(()=>aroundSearch(`${h[1]},${h[2]}`),300)}}catch{}
  initStore()})();

/* Glisser-déposer d'un fichier sur la fenêtre d'import */
document.addEventListener('dragover',e=>{if(!S.fimpOpen||S.fimp?.rows)return;if([...(e.dataTransfer?.types||[])].includes('Files')){e.preventDefault();const d=$('#fdrop');if(d)d.classList.add('on')}});
document.addEventListener('dragleave',e=>{const d=$('#fdrop');if(d&&!d.contains(e.relatedTarget))d.classList.remove('on')});
document.addEventListener('drop',e=>{if(!S.fimpOpen||S.fimp?.rows)return;const f=e.dataTransfer?.files?.[0];if(f){e.preventDefault();fimpFile(f)}});
