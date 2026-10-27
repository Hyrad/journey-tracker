const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const html=read('index.html');

function fixture(language,index){
 let lang=language;
 const events={},pending=[];
 const status={dataset:{},children:[],_text:'',set textContent(value){this._text=value;this.children=[];},get textContent(){return this._text+this.children.map(e=>e.textContent).join('');},appendChild(el){this.children.push(el);}};
 const context={document:{getElementById:()=>status,createElement:()=>({textContent:''}),addEventListener:(type,fn)=>events[type]=fn},localStorage:{getItem:()=>lang},renderJournal:()=>{},setTimeout:fn=>pending.push(fn)};
 vm.createContext(context);
 vm.runInContext(read('trip-data.js')+`\nlet selected=${index};`+html.slice(html.indexOf('const portOrder='),html.indexOf('const guideNumbers=')),context);
 vm.runInContext(html.slice(html.indexOf('function renderSelectedDestination(){'),html.indexOf('function setDay(n){')),context);
 const listener=html.split('\n').find(line=>line.startsWith("document.addEventListener('click',event=>{if(event.target.closest('#languageSwitch'))"));
 vm.runInContext(listener,context);
 const original=vm.runInContext('JSON.stringify(days)',context);
 return {status,render(){context.renderSelectedDestination();},switchTo(language){lang=language;events.click({target:{closest:()=>true}});pending.splice(0).forEach(fn=>fn());},assertUnchanged(){assert.equal(vm.runInContext('selected',context),index);assert.equal(vm.runInContext('JSON.stringify(days)',context),original);}};
}

test('all selected destinations have complete FR/EN status without changing itinerary or selection',()=>{
 for(const lang of ['fr','en'])for(let index=0;index<15;index++){
  const f=fixture(lang,index);f.render();
  assert.ok(f.status._text.startsWith(lang==='fr'?'Destination sélectionnée : ':'Selected destination: '));
  assert.equal(f.status.dataset.ownTranslation,'true');
  assert.equal(f.status.children.length,1);
  assert.ok(f.status.children[0].textContent.endsWith(lang==='fr'?'itinéraire prévu uniquement':'schedule only'));
  if(index===3){assert.ok(f.status._text.includes('#2 · Roatán, Honduras'));assert.ok(f.status.children[0].textContent.includes(lang==='fr'?'27 oct. · Escale':'Oct 27 · Port of call'));}
  if(index===1)assert.ok(f.status._text.endsWith(lang==='fr'?'En mer':'At sea'));
  f.assertUnchanged();
 }
});

test('language switching updates the selected status while keeping the same destination',()=>{
 const f=fixture('fr',3);f.render();
 for(const lang of ['en','fr','en','fr']){
  f.switchTo(lang);
  assert.ok(f.status._text.startsWith(lang==='fr'?'Destination sélectionnée : ':'Selected destination: '));
  assert.ok(f.status.children[0].textContent.includes(lang==='fr'?'Escale':'Port of call'));
  f.assertUnchanged();
 }
});

function luminance(hex){const c=hex.match(/[0-9a-f]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4);return c[0]*0.2126+c[1]*0.7152+c[2]*0.0722;}
test('selected-destination title and small metadata meet AA in both themes',()=>{
 const rules=[...html.matchAll(/(?:^|\n)(#now|html\[data-theme="dark"\] #now)\{([^}]+)\}/g)];
 assert.equal(rules.length,2);
 for(const rule of rules){
  const p=Object.fromEntries([...rule[2].matchAll(/--status-(\w+):(#[\da-f]{6})/g)].map(m=>[m[1],m[2]]));
  for(const role of ['title','meta']){
   const [high,low]=[luminance(p[role]),luminance(p.surface)].sort((a,b)=>b-a);
   const ratio=(high+0.05)/(low+0.05);
   assert.ok(ratio>=4.5,`${rule[1]} ${role}: ${ratio.toFixed(2)}:1`);
  }
 }
});
