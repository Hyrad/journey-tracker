const {test}=require('node:test');
const assert=require('node:assert/strict');
const {normalize,resolve,DEFAULTS}=require('../feature-settings.js');
const trip={departure:'2026-10-24T15:00:00-04:00',end:'2026-11-07T06:00:00-05:00',arrivals:['2026-10-27T08:00:00-04:00','2026-11-07T06:00:00-05:00']};
test('automatic departure switches off exactly at departure',()=>{
 const before=resolve({},trip,Date.parse(trip.departure)-1),at=resolve({},trip,Date.parse(trip.departure));
 assert.equal(before.phase,'upcoming');assert.equal(before.departureCountdown,true);assert.equal(at.phase,'active');assert.equal(at.departureCountdown,false);assert.equal(at.nextArrival,true);
});
test('automatic remaining and arrival countdowns stop when trip finishes',()=>{
 const complete=resolve({},trip,Date.parse(trip.end));assert.equal(complete.phase,'complete');assert.equal(complete.departureCountdown,false);assert.equal(complete.remainingDays,false);assert.equal(complete.nextArrival,false);
});
test('a future trip reactivates automatic countdowns without clearing preferences',()=>{
 const next={departure:'2027-02-01T15:00:00-05:00',end:'2027-02-08T06:00:00-05:00',arrivals:['2027-02-03T08:00:00-05:00']};
 const prefs=normalize({vesselTracking:true,mapAccuracy:false,preview:false});
 const result=resolve(prefs,next,Date.parse('2027-01-31T12:00:00Z'));assert.equal(result.departureCountdown,true);assert.equal(result.vesselTracking,true);assert.equal(result.mapAccuracy,false);assert.equal(result.preview,false);
});
test('saved hide overrides automatic visibility across trip changes',()=>{
 assert.equal(resolve({departureCountdown:'off'},trip,Date.parse(trip.departure)-1000).departureCountdown,false);
 const next={...trip,departure:'2027-01-01T00:00:00Z',end:'2027-01-08T00:00:00Z'};
 assert.equal(resolve({departureCountdown:'off'},next,Date.parse('2026-12-31T00:00:00Z')).departureCountdown,false);
});
test('explicit show remains distinct from automatic and persistent sections are independent',()=>{
 const result=resolve({departureCountdown:'on',remainingDays:'off',nextArrival:'off',vesselTracking:true},trip,Date.parse('2026-10-25T12:00:00Z'));
 assert.equal(result.departureCountdown,true);assert.equal(result.remainingDays,false);assert.equal(result.nextArrival,false);assert.equal(result.vesselTracking,true);assert.equal(result.mapAccuracy,false);
});
test('defaults hide preview and optional panels; bad stored values are ignored',()=>{
 assert.deepEqual(normalize(),DEFAULTS);assert.equal(normalize({preview:'true',remainingDays:'bad',vesselTracking:null}).preview,false);assert.equal(normalize({remainingDays:'bad'}).remainingDays,'auto');assert.deepEqual(normalize({unrelated:'value'}),DEFAULTS);
});
test('unknown dates fail closed for automatic features',()=>{
 const unknown=resolve({}, {departure:null,end:null,arrivals:[]});assert.equal(unknown.phase,'unknown');assert.equal(unknown.departureCountdown,false);assert.equal(unknown.remainingDays,false);assert.equal(unknown.nextArrival,false);
});
