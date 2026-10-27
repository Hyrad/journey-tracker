const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');

// Exercise the actual journal renderer without loading external APIs or writing
// to a real browser's storage. Entries are synthetic, already-approved fixtures.
class Element {
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.textContent='';}
 append(...nodes){this.children.push(...nodes);}
 appendChild(node){this.append(node);return node;}
 replaceChildren(...nodes){this.children=[...nodes];}
}
function descendants(root,tag){return root.children.flatMap(child=>[...(child.tagName===tag?[child]:[]),...descendants(child,tag)]);}
function fixture(language){
 const ids=Object.fromEntries(['latestJournal','journalEntries','memoryStop','memoryTimeline','memoryGallery'].map(id=>[id,new Element('div')]));
 const events={},pending=[];
 const storage={'journey-tracker-language':language,'journey-tracker-theme':'dark','journey-tracker-feature-preferences-v1':'keep preferences','private-drafts':'keep draft'};
 const postcards=[{date:'2026-10-25',title:'Notre moment',title_en:'Our moment',message:'Notre récit <b>intact</b>',message_en:'Our unchanged story <b>text</b>',photos:[{src:'photos/test.jpg',alt:'La mer',alt_en:'The sea',caption:'Caption kept'},{src:'https://example.com/unapproved.jpg',alt:'Rejected'}]}];
 const before=JSON.stringify(postcards),storedBefore=JSON.stringify(storage);
 const window={JOURNEY_JOURNAL:[],JOURNEY_CLOUD_POSTCARDS:postcards};
 const context={window,document:{getElementById:id=>ids[id],createElement:tag=>new Element(tag),addEventListener:(type,fn)=>events[type]=fn},localStorage:{getItem:key=>storage[key],setItem:()=>{throw Error('Unexpected storage write')}},setTimeout:fn=>pending.push(fn),setDay:()=>{},renderSelectedDestination:()=>{},console};
 vm.createContext(context);
 vm.runInContext(read('trip-data.js'),context);
 const html=read('index.html');
 vm.runInContext(html.slice(html.indexOf('function renderJournal(){'),html.indexOf('// Independent AIS position')),context);
 return {ids,window,switchTo(lang){storage['journey-tracker-language']=lang;events.click({target:{closest:selector=>selector==='#languageSwitch'}});pending.splice(0).forEach(fn=>fn());},assertPreserved(){assert.equal(JSON.stringify(postcards),before);assert.equal(JSON.stringify({...storage,'journey-tracker-language':language}),storedBefore);}};
}

for(const lang of ['fr','en'])test(`approved journal renders ${lang} text, metadata and photos without mutation`,()=>{
 const f=fixture(lang),card=f.ids.journalEntries.children[0];
 assert.equal(descendants(card,'h3')[0].textContent,lang==='fr'?'Notre moment':'Our moment');
 assert.equal(descendants(card,'p')[0].textContent,lang==='fr'?'Notre récit <b>intact</b>':'Our unchanged story <b>text</b>');
 assert.equal(card.children[0].textContent,lang==='fr'?'Souvenir publié':'Published travel memory');
 assert.equal(card.children[2].textContent,lang==='fr'?'En mer':'At sea');
 assert.equal(descendants(card,'time')[0].dateTime,'2026-10-25');
 assert.equal(descendants(card,'time')[0].textContent,new Date('2026-10-25T12:00:00').toLocaleDateString(lang==='fr'?'fr-CA':'en-US',{month:'short',day:'numeric'}));
 assert.equal(descendants(card,'img').length,1);
 assert.equal(descendants(card,'img')[0].alt,lang==='fr'?'La mer':'The sea');
 assert.equal(descendants(f.ids.memoryGallery,'img')[0].alt,lang==='fr'?'La mer':'The sea');
 assert.equal(card.dataset.ownTranslation,'true');
 assert.equal(f.ids.latestJournal.children[0].dataset.ownTranslation,'true');
 assert.equal(f.ids.memoryStop.children[0].textContent,lang==='fr'?'Tous les souvenirs publiés':'All published memories');
 f.assertPreserved();
});

test('late-created language button rerenders archive, latest card and timeline FR/EN/FR',()=>{
 const f=fixture('fr');
 for(const language of ['en','fr','en','fr']){
  f.switchTo(language);
  for(const root of [f.ids.journalEntries,f.ids.latestJournal])assert.equal(descendants(root,'h3')[0].textContent,language==='fr'?'Notre moment':'Our moment');
  assert.ok(f.ids.memoryTimeline.children[0].textContent.endsWith(language==='fr'?'Notre moment':'Our moment'));
 }
 f.assertPreserved();
});

const css=read('journal.css');
function luminance(hex){const c=hex.match(/[0-9a-f]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4);return c[0]*0.2126+c[1]*0.7152+c[2]*0.0722;}
function ratio(a,b){const values=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (values[0]+0.05)/(values[1]+0.05);}
const palettes=[...css.matchAll(/(?:^|\n)(#journal|html\[data-theme="dark"\] #journal)\s*\{([^}]+)\}/g)].map(m=>Object.fromEntries([...m[2].matchAll(/--journal-([\w-]+):\s*(#[\da-f]{6})/g)].map(m=>[m[1],m[2]])));
test('light and dark journal text meets AA normal-text contrast, including small metadata and badges',()=>{
 assert.equal(palettes.length,2);
 for(const [i,palette] of palettes.entries()){
  for(const surface of ['surface','latest-surface'])for(const role of ['heading','body','muted','accent']){
   const value=ratio(palette[role],palette[surface]);
   assert.ok(value>=4.5,`${i?'dark':'light'} ${role} on ${surface}: ${value.toFixed(2)}:1`);
  }
  assert.ok(ratio(palette.accent,palette.badge)>=4.5,'badge text must meet AA');
 }
});
