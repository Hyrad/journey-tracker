// Explicitly revalidate the public app shell without clearing preferences or sign-in.
(()=>{'use strict';
const button=document.getElementById('refreshSite'),status=document.getElementById('refreshStatus');
if(!button||!status)return;
const labels={fr:{button:'↻ Actualiser',loading:'Actualisation…',error:'Actualisation impossible. Vérifiez votre connexion et réessayez.'},en:{button:'↻ Refresh',loading:'Refreshing…',error:'Unable to refresh. Check your connection and try again.'}};
const language=()=>{try{return localStorage.getItem('journey-tracker-language')==='en'?'en':'fr'}catch{return'fr'}};
const translate=()=>{button.textContent=labels[language()][button.disabled?'loading':'button']};
// The unique URL bypasses an old document in Safari's HTTP cache. Keep the clean URL afterwards.
const clean=new URL(location.href);if(clean.searchParams.has('_refresh')){clean.searchParams.delete('_refresh');history.replaceState(history.state,'',clean.href)}
button.addEventListener('click',async()=>{
 if(button.disabled)return;
 button.disabled=true;status.textContent='';translate();
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
 try{
  if(!navigator.onLine)throw Error('offline');
  // Check connectivity before touching the offline shell. The old worker also understands this URL.
  const target=new URL(location.href);target.searchParams.set('_refresh',String(Date.now()));
  const response=await fetch(target.href,{cache:'reload',signal:controller.signal});
  if(!response.ok)throw Error('document unavailable');
  const html=await response.text();
  const doc=new DOMParser().parseFromString(html,'text/html');
  // Reload same-origin scripts and styles too: a normal document reload can reuse stale assets.
  const assets=[...doc.querySelectorAll('script[src],link[rel="stylesheet"][href]')]
   .map(el=>new URL(el.getAttribute('src')||el.getAttribute('href'),target))
   .filter(url=>url.origin===target.origin);
  await Promise.all([...new Set(assets.map(url=>url.href))].map(async url=>{
   const asset=await fetch(url,{cache:'reload',signal:controller.signal});
   if(!asset.ok)throw Error('asset unavailable');
   await asset.arrayBuffer();
  }));
  if('serviceWorker' in navigator){
   const registration=await navigator.serviceWorker.getRegistration();
   if(registration)await Promise.race([registration.update().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,2000))]);
  }
  location.replace(target.href);
 }catch{
  button.disabled=false;status.textContent=labels[language()].error;translate();
 }finally{clearTimeout(timeout)}
});
document.getElementById('languageSwitch')?.addEventListener('click',()=>setTimeout(translate,0));translate();
})();
