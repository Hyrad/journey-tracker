// Departure countdown: provisional published itinerary departure, NOT official all-aboard.
(()=>{'use strict';
const departure='2026-10-24T15:00:00-04:00';
const target=Date.parse(departure);
const $=id=>document.getElementById(id);
const language=()=>{try{return localStorage.getItem('journey-tracker-language')==='en'?'en':'fr'}catch(e){return'fr'}};
const labels={fr:{heading:'Départ de la croisière dans',done:'Le voyage a commencé !',day:'jours',hour:'heures',minute:'minutes',second:'secondes',note:'Départ estimé : 24 octobre à 15 h (Fort Lauderdale). Horaire provisoire, à confirmer dans Princess.'},en:{heading:'Cruise departure in',done:'The cruise has begun!',day:'days',hour:'hours',minute:'minutes',second:'seconds',note:'Estimated departure: Oct 24 at 3 PM (Fort Lauderdale). Provisional schedule; confirm in Princess.'}};
function draw(){const el=$('departureCountdown');if(!el)return;const t=labels[language()];$('departureHeading').textContent=t.heading;$('departureNote').textContent=t.note;let left=Math.max(0,Math.ceil((target-Date.now())/1000));if(!left){$('departureHeading').textContent=t.done;el.hidden=true;return}el.hidden=false;const vals=[Math.floor(left/86400),Math.floor(left%86400/3600),Math.floor(left%3600/60),left%60];for(let i=0;i<4;i++){$('countdownValue'+i).textContent=String(vals[i]).padStart(i?2:1,'0');$('countdownLabel'+i).textContent=t[['day','hour','minute','second'][i]]}}
function init(){draw();setInterval(draw,1000);document.getElementById('languageSwitch')?.addEventListener('click',()=>setTimeout(draw,0))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();