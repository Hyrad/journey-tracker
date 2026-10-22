// Civil time only. Never used for ship movement, port schedules or all-aboard deadlines.
(()=>{'use strict';
const ports=[
 ['2026-10-27','America/Tegucigalpa'],['2026-10-28','America/Belize'],
 ['2026-10-29','America/Cancun'],['2026-11-01','America/Nassau'],
 ['2026-11-03','America/Santo_Domingo'],['2026-11-04','America/Grand_Turk'],
 ['2026-11-06','America/Nassau']
];
const montreal='America/Toronto';
function offset(instant,zone){const parts=new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(instant);const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));return (Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)-instant.getTime())/3600000;}
function comparison(date,zone){
 // Noon in Montreal on the visit date, well outside the DST repeated hour.
 const seed=new Date(date+'T12:00:00Z');
 const instant=new Date(seed.getTime()-offset(seed,montreal)*3600000);
 return {instant,difference:offset(instant,zone)-offset(instant,montreal)};
}
function copy(date,zone,english){const {instant,difference}=comparison(date,zone);const locale=english?'en-CA':'fr-CA';const visit=new Intl.DateTimeFormat(locale,{timeZone:zone,day:'numeric',month:'long',year:'numeric'}).format(instant);const time=new Intl.DateTimeFormat(locale,{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(instant);const delta=difference===0?'0':difference>0?'+'+difference:'−'+Math.abs(difference);return {
 title:english?'Local time · '+visit:'Heure locale · '+visit,
 delta:english?delta+' h vs Montréal'+(difference===0?' · same time':''):delta+' h par rapport à Montréal'+(difference===0?' · même heure':''),
 example:english?'Example on this date: 12:00 in Montréal = '+time+' local time.':'Exemple à cette date : 12 h à Montréal = '+time+' en heure locale.',
 note:english?'Montréal changes to standard time on November 1, 2026.':'Montréal passe à l’heure normale le 1er novembre 2026.',
 warning:english?'Important: Ship time may differ from local time. Always follow the ship’s official time and the all-aboard deadline provided by Princess Cruises.':'Attention : l’heure du navire peut différer de l’heure locale. Pour le retour à bord, fiez-vous toujours à l’heure officielle du navire et à l’heure limite de retour communiquée par Princess Cruises.'
};}
if(typeof module!=='undefined')module.exports={ports,offset,comparison,copy};
if(typeof document==='undefined')return;
const style=document.createElement('style');style.textContent='.port-time-info{margin:12px 0;padding:12px;border:1px solid #b6d5d4;border-radius:12px;background:#eff8f6;color:#143e48;font-size:13px;line-height:1.5;overflow-wrap:anywhere}.place .port-time-info p{min-height:0;margin:6px 0}.port-time-info small{display:block}.port-time-info .ship-time-warning{border-top:1px solid #b6d5d4;padding-top:8px}html[data-theme="dark"] .port-time-info{background:#193745;color:#e7f3f3;border-color:#537580}html[data-theme="dark"] .port-time-info .ship-time-warning{border-color:#537580}';document.head.append(style);
const blocks=ports.map(([date,zone],i)=>{const card=document.querySelector('#port'+i+' .txt');if(!card)return null;const panel=document.createElement('aside');panel.className='port-time-info';panel.dataset.ownTranslation='true';const fields=['title','delta','example','note','warning'].map((name,j)=>{const el=document.createElement(j<2?'strong':j===3?'small':'p');if(j===1)el.style.display='block';if(name==='warning')el.className='ship-time-warning';panel.append(el);return [name,el]});card.insertBefore(panel,card.querySelector('.ideas'));return {date,zone,panel,fields};});
function render(){const english=document.documentElement.lang==='en';for(const b of blocks){if(!b)continue;let text;try{text=copy(b.date,b.zone,english)}catch(e){text={title:english?'Local time unavailable':'Heure locale indisponible',delta:'',example:'',note:'',warning:english?'Follow the ship’s official time and Princess Cruises’ all-aboard deadline.':'Fiez-vous à l’heure officielle du navire et à l’heure limite de retour communiquée par Princess Cruises.'};}b.panel.lang=english?'en':'fr';for(const [name,el] of b.fields)el.textContent=text[name];}}
render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
