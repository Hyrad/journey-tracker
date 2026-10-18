// Journey Tracker offline shell. Network-first for HTML and app data, cache fallback.
// Public resources only; never cache authenticated/private pages or third-party AIS.
const CACHE='journey-tracker-v1-3-3';
const CORE=['./','./index.html','./trip-data.js','./journal-data.js','./position-data.js','./port-schedule.js','./manifest.webmanifest','./icon.svg','./i18n.js','./messages.html','./messages-config.js','./postcard-studio.html'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 event.respondWith(fetch(req).then(response=>{
  if(response.ok&&response.type==='basic'){
   const copy=response.clone();
   event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,copy)));
  }
  return response;
 }).catch(()=>caches.match(req).then(cached=>cached|| (req.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});