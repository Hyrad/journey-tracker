// Journey Tracker bilingual presentation layer. French default; switchable English.
// Only UI text is translated. User-generated postcards and messages are never auto-translated.
(()=>{'use strict';
const KEY='journey-tracker-language';
const exact={
"Following the":"À bord du","Star Princess":"Star Princess",
"Our journey":"Notre voyage","Where are we going?":"Où allons-nous ?",
"Today's Adventure":"L'aventure du jour","Journey Progress":"Progression du voyage",
"Next Scheduled Destination":"Prochaine destination prévue",
"Today":"Aujourd’hui","Map":"Carte","Itinerary":"Itinéraire","Messages":"Messages",
"Journal":"Journal","Ports":"Escales","Family travel journal":"Journal de voyage familial",
"Postcards from the journey":"Cartes postales du voyage",
"Published travel memory":"Souvenir publié","Latest approved postcard":"Dernière carte postale approuvée",
"Browse published postcards":"Voir les cartes postales publiées",
"Our postcards":"Nos cartes postales","Browse memories by destination":"Explorer les souvenirs par destination",
"All published memories":"Tous les souvenirs publiés",
"Explore destination guides":"Découvrir les guides des escales",
"Full day-by-day itinerary":"Itinéraire jour par jour",
"Vessel tracking":"Suivi du navire","Verified vessel tracking":"Suivi vérifié du navire",
"External AIS links and details":"Liens AIS externes et détails",
"About the map and accuracy":"À propos de la carte et de sa précision",
"Selected destination":"Destination sélectionnée",
"Next scheduled destination":"Prochaine destination prévue",
"Nautical miles remaining":"Milles marins jusqu’à la prochaine escale",
"Estimated nautical miles traveled":"Milles marins estimés parcourus",
"Estimated nautical miles to finish":"Milles marins estimés restants",
"Preparing for departure":"Préparatifs du départ","Setting sail soon":"Départ imminent",
"The Star Princess itinerary begins October 24.":"L’itinéraire du Star Princess commence le 24 octobre.",
"Before departure":"Avant le départ",
"Departure countdown":"Compte à rebours avant le départ",
"Trip complete":"Voyage terminé","Voyage completed":"Voyage terminé",
"Welcome home!":"Bon retour !","A relaxing day at sea":"Une journée paisible en mer",
"The adventure is almost here":"L’aventure approche !",
"Today's adventure · schedule-based":"L’aventure du jour · selon l’itinéraire",
"Your Caribbean day":"Votre journée aux Caraïbes",
"A relaxed day awaits.":"Une belle journée de détente vous attend.",
"Enjoy the journey":"Profitez du voyage","Relaxed idea":"Suggestion détente",
"See the itinerary":"Voir l’itinéraire","Next scheduled stop":"Prochaine escale prévue",
"Activity ideas are optional, not bookings.":"Les activités proposées sont facultatives et ne sont pas des réservations.",
"View this day in itinerary":"Voir cette journée dans l’itinéraire",
"Explore the route ↓":"Explorer le trajet ↓",
"Pack at an easy pace":"Préparer les bagages tranquillement",
"Relive favorite memories":"Revivre vos meilleurs souvenirs",
"Sea day":"Journée en mer","Port of call":"Escale",
"Embarkation":"Embarquement","Disembarkation":"Débarquement",
"At sea":"En mer","At sea, approaching arrival":"En mer, en approche",
"Journey completed":"Voyage terminé","Welcome home":"Bon retour",
"Trip complete":"Voyage terminé",
"Route: Entire voyage":"Trajet : voyage complet",
"Route: To next port":"Trajet : prochaine escale",
"Travel view: Off":"Vue navigation : désactivée","Travel view: On":"Vue navigation : activée",
"Keep centered: On":"Suivi du navire : activé","Keep centered: Off":"Suivi du navire : désactivé",
"View estimated position":"Voir la position estimée","Previous day":"Jour précédent",
"Next day →":"Jour suivant →","Our adventure begins soon":"Notre aventure commence bientôt",
"No postcards published yet":"Aucune carte postale publiée",
"Family Messages":"Messages familiaux","Open messages →":"Ouvrir les messages →",
"Open Postcard Studio →":"Ouvrir l’atelier des cartes postales →",
"Family Postcards":"Cartes postales familiales",
"Private conversations for invited family members only. Secure setup is pending.":"Conversations privées réservées aux proches invités.",
"Personal messages and photos will appear here only when we choose to share them. No account is needed to read along.":"Les messages et photos apparaîtront ici seulement après notre approbation. Aucun compte n’est nécessaire pour les consulter.",
"Posts are shared intentionally, not automatically. Publishing may be delayed while we're at sea.":"Les publications nécessitent une approbation; elles ne sont jamais automatiques.",
"Fourteen nights, seven island stops":"Quatorze nuits, sept escales insulaires",
"Nights onboard":"Nuits à bord","Island port stops":"Escales insulaires","Sea days":"Jours en mer",
"At a glance":"En bref","Discover the destinations":"Découvrez les destinations",
"A little inspiration for every port":"Des idées pour chaque escale",
"Explore this port +":"Découvrir cette escale +","Close guide −":"Fermer le guide −",
"Culture & place":"Culture et destination","Local food":"Cuisine locale","Relaxed-day tip":"Conseil pour une journée détente",
"Activity ideas:":"Idées d’activités :","Check back for our first postcard!":"Revenez bientôt pour notre première carte postale !",
"Sign in":"Connexion","Invited email":"Courriel de l’invitation","Password":"Mot de passe",
"Finish setting up your account":"Terminer la création de votre compte",
"Choose your password (12 characters minimum)":"Choisissez votre mot de passe (12 caractères minimum)",
"Set my password":"Définir mon mot de passe","Sign out":"Déconnexion",
"Private messaging is not connected yet":"La messagerie privée n’est pas encore connectée",
"Leave a message for the family":"Laisser un message à la famille",
"Send private message":"Envoyer le message privé","Refresh":"Actualiser",
"Family board":"Groupe familial","Account settings / Set invitation password":"Paramètres du compte / Définir un mot de passe",
"New password (at least 12 characters)":"Nouveau mot de passe (12 caractères minimum)",
"Set password":"Définir le mot de passe",
"Write a postcard":"Rédiger une carte postale","Trip date":"Date du voyage",
"Itinerary day / destination":"Journée / destination","Postcard title":"Titre de la carte postale",
"Message for the family":"Message à la famille","Save private draft":"Enregistrer le brouillon privé",
"Clear editor":"Effacer le formulaire","Preview":"Aperçu",
"Drafts saved on this device":"Brouillons enregistrés sur cet appareil",
"Edit":"Modifier","Copy for approval":"Copier pour approbation","Delete":"Supprimer",
"Travel postcard":"Carte postale","Private draft on this device only.":"Brouillon privé enregistré uniquement sur cet appareil.",
"No drafts yet.":"Aucun brouillon.","No messages yet. Say hello!":"Aucun message pour l’instant. Dites bonjour !",
"Preparing to sail":"Préparatifs du départ","Relaxing at sea":"Détente en mer",
"Route map":"Carte du trajet"
};
const patterns=[
[/^(\d+) days? until sailing$/,'$1 jours avant le départ'],
[/^Next stop: /,'Prochaine escale : '],
[/^Selected destination: /,'Destination choisie : '],
[/^Scheduled today: /,'Prévu aujourd’hui : '],
[/^Day (\d+) of (\d+)$/,'Jour $1 sur $2'],
[/^Scheduled visit: /,'Visite prévue : '],
[/^In port · /,'À quai · '],
[/^At sea · /,'En mer · '],
[/^Journey progress$/,'Progression du voyage'],
[/^Next destination$/,'Prochaine destination'],
[/^No AIS feed connected$/,'Aucun flux AIS connecté'],
[/^No messages yet/,'Aucun message pour l’instant'],
[/^Please sign in with an invited account\.$/,'Connectez-vous avec un compte invité.'],
[/^Invitation accepted\. Awaiting family administrator approval\.$/,'Invitation acceptée. En attente de validation par l’administrateur familial.'],
[/^Signed in · private family board$/,'Connecté · messagerie familiale privée']
];
let language='fr';try{language=localStorage.getItem(KEY)==='en'?'en':'fr'}catch(e){}
const entries=new WeakMap();
let processing=false;
function translate(src){if(exact[src])return exact[src];let str=src;for(const [r,rep] of patterns)str=str.replace(r,rep);return str}
function processText(node){if(!node.nodeValue||!node.nodeValue.trim())return;
 const raw=node.nodeValue,lead=raw.match(/^\s*/)[0],tail=raw.match(/\s*$/)[0],core=raw.trim();
 const previous=entries.get(node);
 if(language==='en'){if(previous&&raw!==previous.original){if(raw===previous.french)node.nodeValue=previous.original;else entries.set(node,{original:raw,french:translate(raw.trim())})}else if(previous)node.nodeValue=previous.original;return;}
 if(previous&&raw===previous.french)return;
 const french=lead+translate(core)+tail;entries.set(node,{original:raw,french});if(french!==raw)node.nodeValue=french;
}
function walk(root){if(root.nodeType===3){processText(root);return}if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
 if(root.nodeType===1&&['SCRIPT','STYLE','TEXTAREA','INPUT','SELECT','OPTION','CODE','PRE'].includes(root.tagName))return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const nodes=[];while(n=w.nextNode())if(!n.parentElement?.closest('script,style,textarea,select,option,code,pre'))nodes.push(n);nodes.forEach(processText)}
function apply(){if(processing)return;processing=true;document.documentElement.lang=language;walk(document.body);const b=document.getElementById('languageSwitch');if(b){b.textContent=language==='fr'?'EN':'FR';b.setAttribute('aria-label',language==='fr'?'Switch to English':'Passer en français');b.title=language==='fr'?'Switch to English':'Passer en français'}processing=false;}
function init(){if(document.getElementById('languageSwitch'))return;const b=document.createElement('button');b.id='languageSwitch';b.type='button';b.setAttribute('style','position:fixed;top:max(10px,env(safe-area-inset-top,0px));right:12px;z-index:1900;padding:9px 12px;border-radius:24px;background:#f8fbfa;color:#075466;border:1px solid #a8c9c2;font:700 13px system-ui;box-shadow:0 2px 12px #0015;min-width:48px;min-height:44px');b.onclick=()=>{language=language==='fr'?'en':'fr';try{localStorage.setItem(KEY,language)}catch(e){}apply()};document.body.append(b);apply();const mo=new MutationObserver(()=>{if(processing)return;queueMicrotask(apply)});mo.observe(document.body,{subtree:true,childList:true,characterData:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
