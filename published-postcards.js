// Public journal loader: only records explicitly approved for publication.
(async()=>{'use strict';const cfg=window.JOURNEY_MESSAGES_CONFIG;if(!cfg?.url||!cfg?.publishableKey)return;
try{const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.49.8');
const db=createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const {data,error}=await db.from('journey_postcards').select('id,title,message,title_en,message_en,photo_path,photo_alt,photo_alt_en,travel_date').eq('published',true).order('created_at',{ascending:false}).limit(60);
if(error)throw error;
const entries=[];
for(const p of data||[]){const photos=[];if(p.photo_path){const {data:signed,error:err}=await db.storage.from('journey-postcards').createSignedUrl(p.photo_path,3600);if(!err&&signed?.signedUrl)photos.push({src:signed.signedUrl,alt:p.photo_alt||'',alt_en:p.photo_alt_en||''})}
entries.push({date:p.travel_date,title:p.title,message:p.message,title_en:p.title_en,message_en:p.message_en,photos});
}
window.JOURNEY_CLOUD_POSTCARDS=entries;window.renderJourneyJournal?.();
}catch(err){console.warn('Published postcards unavailable',err)}
})();