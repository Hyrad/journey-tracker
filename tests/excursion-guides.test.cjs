const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const read=f=>fs.readFileSync(require('node:path').join(__dirname,'..',f),'utf8');
class Element {
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.textContent='';}
 append(...nodes){for(const n of nodes)n.parentElement=this;this.children.push(...nodes);}
 prepend(n){n.parentElement=this;this.children.unshift(n);}
 replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 querySelector(tag){return this.children.find(n=>n.tagName===tag)||null;}
}
const all=(n,tag)=>n.children.flatMap(c=>[...(c.tagName===tag?[c]:[]),...all(c,tag)]);
const text=n=>n.textContent+n.children.map(text).join(' ');
function fixture({date='2026-10-29',storageFails=false}={}){
 let lang='fr';const events={},guides=Array.from({length:7},()=>new Element('div'));
 const document={readyState:'complete',getElementById:id=>guides[Number(id.replace('guide',''))],createElement:t=>new Element(t),addEventListener:(type,fn)=>events[type]=fn};
 const ctx={window:{addEventListener:()=>{}},document,location:{hash:''},localStorage:{getItem:()=>{if(storageFails)throw Error('blocked');return lang},setItem:()=>{throw Error('Unexpected write')}},setTimeout:fn=>fn()};
 vm.createContext(ctx);vm.runInContext(`const days=[['${date}','Cozumel, Mexico']];`+read('excursion-guides-data.js')+read('excursion-guides.js'),ctx);
 return {guides,ctx,switchTo(l){lang=l;events.click({target:{closest:()=>true}});}};
}
test('Cozumel-only plan switches FR/EN/FR with four steps and persistent safety above disclosure',()=>{
 const f=fixture();assert.deepEqual(f.guides.map(x=>x.children.length),[0,0,1,0,0,0,0]);
 const panel=f.guides[2].children[0];
 for(const lang of ['fr','en','fr']){f.switchTo(lang);assert.equal(panel.dataset.status,'planned');assert.equal(panel.dataset.ownTranslation,'true');assert.equal(all(panel,'li').length,4);assert.match(text(panel),/60–75/);assert.match(text(panel),lang==='fr'?/17 h 30/:/5:30 PM/);const safety=all(panel,'aside')[0];assert.equal(safety.parentElement,panel);assert.match(text(safety),lang==='fr'?/18 h 30.*non vérifiée/:/6:30 PM.*not independently verified/);assert.match(text(safety),lang==='fr'?/sans conversion/:/no conversion/);assert.match(text(panel),lang==='fr'?/Planifié \/ provisoire/:/Planned \/ provisional/);assert.equal(all(panel,'a').length,4);for(const a of all(panel,'a')){assert.ok(a.href.startsWith('https://'));assert.equal(a.rel,'noopener noreferrer');}}
 panel.querySelector('details').open=false;f.switchTo('en');assert.equal(panel.querySelector('details').open,false);
});
test('plan is absent for a different visit date; unavailable storage defaults to French',()=>{
 assert.ok(fixture({date:'2027-10-29'}).guides.every(g=>g.children.length===0));
 assert.match(text(fixture({storageFails:true}).guides[2]),/Plan du jour — Cozumel/);
});
test('map destination is explicit but does not assume an outbound origin or a return pier',()=>{
 const p=fixture().ctx.window.JOURNEY_EXCURSION_GUIDES[0];const u=new URL(p.links.walk);assert.equal(u.searchParams.get('travelmode'),'walking');assert.ok(u.searchParams.get('destination').includes('Chankanaab'));assert.equal(u.searchParams.has('origin'),false);
});
const luminance=hex=>hex.match(/[0-9a-f]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
test('excursion light/dark text and links meet AA on both surfaces',()=>{
 const rules=[...read('excursion-guides.css').matchAll(/--excursion-surface:(#[\da-f]{6});--excursion-ink:(#[\da-f]{6});--excursion-alert:(#[\da-f]{6});--excursion-link:(#[\da-f]{6})/g)];assert.equal(rules.length,2);
 for(const [,surface,ink,alert,link] of rules)for(const bg of [surface,alert])for(const fg of [ink,link]){const [hi,lo]=[luminance(bg),luminance(fg)].sort((a,b)=>b-a);assert.ok((hi+.05)/(lo+.05)>=4.5);}
});
