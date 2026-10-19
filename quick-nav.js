// Journey Tracker quick navigation: no extra sticky bar; keyboard and touch accessible.
(()=>{'use strict';
const labels={fr:{open:'Navigation rapide',close:'Fermer le menu',top:'Retour en haut',today:'Aujourd’hui',map:'Carte du voyage',itinerary:'Itinéraire',ports:'Escales',journal:'Journal',messages:'Messages privés',studio:'Cartes postales'},en:{open:'Quick navigation',close:'Close menu',top:'Back to top',today:'Today',map:'Voyage map',itinerary:'Itinerary',ports:'Destinations',journal:'Journal',messages:'Private messages',studio:'Postcard studio'}};
const language=()=>{try{return localStorage.getItem('journey-tracker-language')==='en'?'en':'fr'}catch(e){return'fr'}};
const items=[['today','☀️','#todayAdventure'],['map','🗺️','#map'],['itinerary','📅','#timeline'],['ports','🌴','#places'],['journal','📖','#journal'],['messages','💬','messages.html'],['studio','📸','postcard-studio.html'],['top','↑','#top']];
function init(){if(document.getElementById('quickNavToggle'))return;
const wrap=document.createElement('div');wrap.className='quick-menu-wrap';const toggle=document.createElement('button');toggle.id='quickNavToggle';toggle.type='button';toggle.className='quick-menu-toggle';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','quickNavPanel');const panel=document.createElement('nav');panel.className='quick-menu-panel';panel.id='quickNavPanel';panel.setAttribute('aria-label','Quick navigation');panel.hidden=true;
const links=items.map(([key,emoji,href])=>{const a=document.createElement('a');a.href=href;a.dataset.quickKey=key;const ico=document.createElement('span');ico.textContent=emoji;ico.setAttribute('aria-hidden','true');const caption=document.createElement('span');a.append(ico,caption);panel.append(a);return a});
function translate(){const l=labels[language()];toggle.textContent=(panel.hidden?'☰ ':'✕ ')+(panel.hidden?l.open:l.close);toggle.setAttribute('aria-label',panel.hidden?l.open:l.close);panel.setAttribute('aria-label',l.open);for(const a of links)a.lastElementChild.textContent=l[a.dataset.quickKey]}
function change(open,focus=false){panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));translate();if(focus)(open?links[0]:toggle).focus()}
toggle.onclick=()=>change(panel.hidden,true);
for(const a of links)a.addEventListener('click',event=>{const href=a.getAttribute('href');if(!href.startsWith('#')){change(false);return}event.preventDefault();change(false);if(href==='#top'){window.scrollTo({top:0,behavior:'smooth'});history.replaceState(null,'',location.pathname+location.search);return}if(href==='#places'){const parent=document.getElementById('destinationsDetails');if(parent)parent.open=true}if(href==='#timeline'){const parent=document.getElementById('itineraryDetails');if(parent)parent.open=true}const target=document.querySelector(href);if(target){target.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'',href)}});
document.addEventListener('pointerdown',event=>{if(!panel.hidden&&!wrap.contains(event.target))change(false)});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden)change(false,true)});
wrap.append(panel,toggle);document.body.append(wrap);translate();
document.getElementById('languageSwitch')?.addEventListener('click',()=>setTimeout(translate,0));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();