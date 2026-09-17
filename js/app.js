import { locations } from './data/locations.js';
import { getState, setState } from './state/store.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const alphaPrices = {
  sandefjord: {
    cokeZero:[['KIWI','6 × 1,5 L',96.9,true,false],['REMA 1000','4 × 1,5 L',64.9,false,false],['MENY','4 × 1,5 L',105,false,true]],
    pepsiMax:[['KIWI','6 × 1,5 L',99,true,false],['Obs','1 × 1,5 L',30.5,false,false],['SPAR','6 × 1,5 L',89.9,true,false]]
  },
  tromso: {
    cokeZero:[['EUROSPAR','4 × 1,5 L',99,true,true],['KIWI','1 × 1,5 L',34.9,false,false],['Obs','1 × 1,5 L',33.5,false,false]],
    pepsiMax:[['EUROSPAR','6 × 1,5 L',99,true,true],['KIWI','6 × 1,5 L',99,true,false],['Obs','1 × 1,5 L',30.5,false,false]]
  },
  stavanger: {
    cokeZero:[['KIWI','6 × 1,5 L',96.9,false,false],['REMA 1000','4 × 1,5 L',64.9,false,false],['MENY','4 × 1,5 L',105,false,true]],
    pepsiMax:[['KIWI','6 × 1,5 L',99,true,false],['Obs','1 × 1,5 L',30.5,false,false],['SPAR','6 × 1,5 L',89.9,true,false]]
  },
  stromstad: {
    cokeZero:[['MaxiMat','4 × 1,5 L',149,true,false],['Nordby Mat','1 × 1,5 L',34.9,false,false]],
    pepsiMax:[['MaxiMat','4 × 1,5 L',139,true,false],['Nordby Mat','1 × 1,5 L',32.9,false,false]]
  }
};

const volumeOf = pack => { const m=pack.match(/(?:(\d+)\s*×\s*)?([\d,.]+)\s*L/i); return m ? (Number(m[1]||1)*Number(m[2].replace(',','.'))) : 1.5; };
const money = (n,currency) => new Intl.NumberFormat(currency==='SEK'?'sv-SE':'nb-NO',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2}).format(n);

function render(){
  const state=getState(), loc=locations[state.location] || locations.sandefjord, data=alphaPrices[state.location] || alphaPrices.sandefjord;
  $('#locationLabel').textContent=loc.name;
  $$('#locationMenu [data-location]').forEach(b=>b.classList.toggle('active',b.dataset.location===state.location));
  $$('.card').forEach(card=>{
    const product=card.dataset.product;
    card.hidden=state.productFilter!=='all' && state.productFilter!==product;
    let rows=(data[product]||[]).map(x=>({store:x[0],pack:x[1],price:x[2],offer:x[3],member:x[4],ppl:x[2]/volumeOf(x[1])}));
    if(state.offerOnly) rows=rows.filter(x=>x.offer);
    if(state.memberOnly) rows=rows.filter(x=>x.member);
    rows.sort(state.sort==='total'?(a,b)=>a.price-b.price:state.sort==='store'?(a,b)=>a.store.localeCompare(b.store):(a,b)=>a.ppl-b.ppl);
    const list=card.querySelector('.price-list');
    list.innerHTML=rows.length?rows.map(x=>`<div class="price-row"><div class="store-logo">${x.store}</div><div class="price-meta">${x.pack}<small>${money(x.ppl,loc.currency)} ${loc.currency}/L${x.member?' · MEDLEMSPRIS':x.offer?' · TILBUD':''}</small></div><div class="amount ${x.offer||x.member?'offer':''}">${money(x.price,loc.currency)} <small>${loc.currency}</small></div></div>`).join(''):'<div class="empty-state">Ingen priser matcher filtrene.</div>';
  });
}

$('#locationButton').addEventListener('click',()=>$('#locationMenu').classList.toggle('open'));
$('#locationMenu').addEventListener('click',e=>{const b=e.target.closest('[data-location]');if(!b)return;setState({location:b.dataset.location});$('#locationMenu').classList.remove('open');render();});
document.addEventListener('click',e=>{if(!e.target.closest('.location-wrap'))$('#locationMenu').classList.remove('open')});

const modal=$('#aboutModal');
function closeAbout(){modal.classList.remove('open');document.body.style.overflow='';}
$$('[data-about]').forEach(b=>b.addEventListener('click',()=>{modal.classList.add('open');document.body.style.overflow='hidden';}));
$$('[data-close-about]').forEach(b=>b.addEventListener('click',closeAbout));
modal.addEventListener('click',e=>{if(e.target===modal)closeAbout()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAbout()});

let nectarClicks=0,toastTimer;
$('#nectarEgg').addEventListener('click',()=>{if(++nectarClicks<5)return;nectarClicks=0;const t=$('#toast');t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2500);});

$$('.tab').forEach(b=>b.addEventListener('click',()=>{$$('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');setState({productFilter:b.dataset.product});render();}));
$('#offerOnly').addEventListener('change',e=>{setState({offerOnly:e.target.checked});render();});
$('#memberOnly').addEventListener('change',e=>{setState({memberOnly:e.target.checked});render();});
$('#sortMode').addEventListener('change',e=>{setState({sort:e.target.value});render();});

render();
