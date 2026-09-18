export const PACK_COUNTS=new Set([4,6,8,12,24]);
export const RETAILERS={
  KIWI:{name:'KIWI',aliases:['kiwi']},
  COOP_EXTRA:{name:'Extra',aliases:['extra','coop extra']},
  COOP_OBS:{name:'Obs',aliases:['obs','coop obs']},
  COOP_MEGA:{name:'Coop Mega',aliases:['coop mega']},
  COOP_PRIX:{name:'Coop Prix',aliases:['coop prix','prix']},
  COOP_MARKED:{name:'Coop Marked',aliases:['coop marked']},
  REMA_1000:{name:'REMA 1000',aliases:['rema 1000','rema']},
  MENY_NO:{name:'MENY',aliases:['meny']},
  SPAR_NO:{name:'SPAR',aliases:['spar']},
  EUROSPAR:{name:'EUROSPAR',aliases:['eurospar']},
  BUNNPRIS:{name:'Bunnpris',aliases:['bunnpris']},
  JOKER_NO:{name:'Joker',aliases:['joker']},
  EUROPRIS_NO:{name:'Europris',aliases:['europris']}
};
export const LOCATION_CHAINS={
  sandefjord:['KIWI','COOP_EXTRA','COOP_OBS','REMA_1000','MENY_NO','SPAR_NO','JOKER_NO','COOP_PRIX','EUROPRIS_NO'],
  horten:['KIWI','COOP_EXTRA','REMA_1000','MENY_NO','SPAR_NO','JOKER_NO'],
  tromso:['KIWI','COOP_EXTRA','COOP_OBS','REMA_1000','EUROSPAR','SPAR_NO','JOKER_NO','BUNNPRIS'],
  stavanger:['KIWI','COOP_EXTRA','COOP_OBS','REMA_1000','MENY_NO','SPAR_NO','JOKER_NO']
};
export const productName=name=>{const n=String(name||'').toLowerCase();if(n.includes('pepsi')&&n.includes('max')&&!/(lemon|lime|mango|koffeinfri|electric|cherry)/.test(n))return'Pepsi Max';if((n.includes('coca')||n.includes('coke'))&&(n.includes('zero')||n.includes('uten sukker')||n.includes('sukkerfri'))&&!/(koffeinfri|cherry|vanilla|lime|lemon)/.test(n))return'Coca-Cola Zero';return null};
export function parsePackage(text='',weight=null,unit=''){const raw=String(text||'').toLowerCase().replace(/,/g,'.');let count=1,z=null,m;
  m=raw.match(/(\d{1,2})\s*(?:stk|pk|pakk|pack|bx)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*(ml|l)\b/);if(m){count=+m[1];z=+m[2]*(m[3]==='ml'?0.001:1)}
  if(!z&&(m=raw.match(/(\d+(?:\.\d+)?)\s*(ml|l)\s*[x×]\s*(\d{1,2})\b/))){z=+m[1]*(m[2]==='ml'?0.001:1);count=+m[3]}
  if(count===1&&(m=raw.match(/(\d{1,2})\s*(?:stk|pk|pakk|pack|bx)\b/)))count=+m[1];
  if(!z&&(m=raw.match(/(\d+(?:\.\d+)?)\s*l\b/)))z=+m[1];
  if(!z&&(m=raw.match(/(\d{2,4})\s*ml\b/)))z=+m[1]/1000;
  const w=Number(weight),u=String(unit||'').toLowerCase();if((!z||z>2)&&Number.isFinite(w)){const total=u==='ml'?w/1000:u==='l'?w:null;if(total){if(count>1)z=total/count;else if(total<=2)z=total}}
  if(!z||z<0.2||z>2)return null;
  const sizeKey=Math.abs(z-.33)<.035?'033':Math.abs(z-.5)<.035?'05':Math.abs(z-1.5)<.08?'15':'other';
  const label=sizeKey==='033'?'0,33 L':sizeKey==='05'?'0,5 L':sizeKey==='15'?'1,5 L':String(Math.round(z*100)/100).replace('.',',')+' L';
  return{sizeKey,unitLiters:z,count,liters:z*count,pack:count>1?`${count} × ${label}`:label,packageType:count>1?'multipack':'single'};
}
export function retailerCode(name=''){const n=String(name).toLowerCase().replace(/image/g,'').trim();for(const [code,r] of Object.entries(RETAILERS))if(r.aliases.some(a=>n===a||n.startsWith(a+' ')||n.includes(a)))return code;return null}
export const retailerName=code=>RETAILERS[code]?.name||code;
export const canonicalKey=x=>`${x.product}|${x.chainCode}|${x.pack}`;
export const decode=s=>String(s||'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&oslash;/g,'ø').replace(/&aring;/g,'å').replace(/&aelig;/g,'æ');
export const stripHtml=s=>decode(String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
