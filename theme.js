// Site-wide display preference; no DOM observation and no network calls.
(()=>{'use strict';const KEY='journey-tracker-theme';let mode='light';try{mode=localStorage.getItem(KEY)==='dark'?'dark':'light'}catch(e){}
const css=`
html[data-theme="dark"]{color-scheme:dark}
html[data-theme="dark"] body{background:#071923!important;color:#e7f3f3!important}
html[data-theme="dark"] header{background:linear-gradient(125deg,#06151f,#092b37 73%,#12454a)!important}
html[data-theme="dark"] .mapcard,html[data-theme="dark"] .section,html[data-theme="dark"] .daycard,html[data-theme="dark"] .card,html[data-theme="dark"] .place,html[data-theme="dark"] .live-metric,html[data-theme="dark"] .draft,html[data-theme="dark"] .port-comments,html[data-theme="dark"] .personal-port-notes{background:#112c38!important;color:#e7f3f3!important;border-color:#31515c!important}
html[data-theme="dark"] .live-dashboard,html[data-theme="dark"] .trip-progress,html[data-theme="dark"] .voyage-dashboard,html[data-theme="dark"] .port-details,html[data-theme="dark"] .preview,html[data-theme="dark"] .port-pier-info,html[data-theme="dark"] .note,html[data-theme="dark"] .notice,html[data-theme="dark"] .provider-map{background:#193745!important;color:#e7f3f3!important;border-color:#315b63!important}
html[data-theme="dark"] p,html[data-theme="dark"] small,html[data-theme="dark"] label,html[data-theme="dark"] .subnote,html[data-theme="dark"] .muted,html[data-theme="dark"] .hint,html[data-theme="dark"] .eyebrow,html[data-theme="dark"] .date,html[data-theme="dark"] .live-metric small,html[data-theme="dark"] .port-notes-hint{color:#bfd5da!important}
html[data-theme="dark"] input,html[data-theme="dark"] select,html[data-theme="dark"] textarea{background:#09222d!important;color:#f0fafa!important;border-color:#44717a!important}
html[data-theme="dark"] .day,html[data-theme="dark"] button.secondary,html[data-theme="dark"] .secondary,html[data-theme="dark"] .quick-nav a,html[data-theme="dark"] .ideas span{background:#204452!important;color:#edf7f5!important;border-color:#446772!important}
html[data-theme="dark"] .day.active,html[data-theme="dark"] .quick-nav a.active{background:#137f84!important;color:white!important}
html[data-theme="dark"] .mobile-tabbar{background:#102d39!important;color:#eaf7f5!important;border-color:#3e6270!important}
html[data-theme="dark"] .port-number-badge{border-color:#09222d}
html[data-theme="dark"] .port-comments .port-comment,html[data-theme="dark"] .msg{border-color:#335763!important}
html[data-theme="dark"] .photo-fallback,html[data-theme="dark"] .map-fallback{background:#1a3944!important}
html[data-theme="dark"] a{color:inherit}
#themeToggle{position:fixed;top:max(62px,calc(env(safe-area-inset-top,0px) + 52px));right:12px;z-index:1900;padding:9px 12px;border-radius:24px;background:#f8fbfa;color:#075466;border:1px solid #a8c9c2;font:700 13px system-ui;box-shadow:0 2px 12px #0015;min-width:48px;min-height:44px;cursor:pointer}
html[data-theme="dark"] #themeToggle,html[data-theme="dark"] #languageSwitch{background:#193b48;color:#eafafa;border:1px solid #6b929b}
`;
const style=document.createElement('style');style.textContent=css;document.head.append(style);
function paint(){document.documentElement.dataset.theme=mode;const b=document.getElementById('themeToggle');if(b){b.textContent=mode==='dark'?'☀️':'🌙';b.setAttribute('aria-label',mode==='dark'?'Activer le mode clair / Switch to light mode':'Activer le mode sombre / Switch to dark mode');b.title=mode==='dark'?'Mode clair / Light mode':'Mode sombre / Dark mode'}const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=mode==='dark'?'#071923':'#082c40'}
function init(){if(document.getElementById('themeToggle'))return;const btn=document.createElement('button');btn.id='themeToggle';btn.type='button';btn.onclick=()=>{mode=mode==='dark'?'light':'dark';try{localStorage.setItem(KEY,mode)}catch(e){}paint()};document.body.append(btn);paint()}
paint();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();