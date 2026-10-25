// The schedule defines departure; saved feature preferences decide whether to surface it.
(()=>{'use strict';
const departure=window.JOURNEY_PORT_SCHEDULE?.find(stop=>stop.departure)?.departure;
const target=Date.parse(departure),$=id=>document.getElementById(id);
const language=()=>{try{return localStorage.getItem('journey-tracker-language')==='en'?'en':'fr'}catch{return'fr'}};
const labels={fr:{heading:'Départ de la croisière dans',done:'Le voyage a commencé !',unknown:'Horaire de départ à confirmer',day:'jours',hour:'heures',minute:'minutes',second:'secondes'},en:{heading:'Cruise departure in',done:'The cruise has begun!',unknown:'Departure schedule to be confirmed',day:'days',hour:'hours',minute:'minutes',second:'seconds'}};
function draw(){const clock=$('departureCountdown'),widget=$('departureWidget');if(!clock||!widget)return;const lang=language(),t=labels[lang];
 if(widget.dataset.enabled==='false'){clock.hidden=true;return}
 if(!Number.isFinite(target)){$('departureHeading').textContent=t.unknown;clock.hidden=true;return}
 const date=new Intl.DateTimeFormat(lang==='fr'?'fr-CA':'en-CA',{timeZone:'America/Toronto',month:'long',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(target));
 $('departureNote').textContent=lang==='fr'?'Départ estimé : '+date+'. Horaire provisoire, à confirmer dans Princess.':'Estimated departure: '+date+'. Provisional schedule; confirm in Princess.';
 let left=Math.max(0,Math.ceil((target-Date.now())/1000));$('departureHeading').textContent=left?t.heading:t.done;clock.hidden=!left;if(!left)return;
 const vals=[Math.floor(left/86400),Math.floor(left%86400/3600),Math.floor(left%3600/60),left%60];for(let i=0;i<4;i++){$('countdownValue'+i).textContent=String(vals[i]).padStart(i?2:1,'0');$('countdownLabel'+i).textContent=t[['day','hour','minute','second'][i]]}
}
function init(){draw();setInterval(()=>{if($('departureWidget')?.dataset.enabled!=='false')draw()},1000);document.addEventListener('journey-feature-change',draw);document.getElementById('languageSwitch')?.addEventListener('click',()=>setTimeout(draw,0))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
