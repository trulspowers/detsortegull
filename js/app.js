import { locations } from './data/locations.js';
import { getState, setState } from './state/store.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function syncLocation(){
  const state=getState(), loc=locations[state.location] || locations.sandefjord;
  $('#locationLabel').textContent=loc.name;
  $$('#locationMenu [data-location]').forEach(b=>b.classList.toggle('active',b.dataset.location===state.location));
}

$('#locationButton').addEventListener('click',()=>$('#locationMenu').classList.toggle('open'));
$('#locationMenu').addEventListener('click',e=>{ const b=e.target.closest('[data-location]'); if(!b)return; setState({location:b.dataset.location}); syncLocation(); $('#locationMenu').classList.remove('open'); });
document.addEventListener('click',e=>{if(!e.target.closest('.location-wrap')) $('#locationMenu').classList.remove('open')});

const modal=$('#aboutModal');
function closeAbout(){ modal.classList.remove('open'); document.body.style.overflow=''; }
$$('[data-about]').forEach(b=>b.addEventListener('click',()=>{modal.classList.add('open');document.body.style.overflow='hidden';}));
$$('[data-close-about]').forEach(b=>b.addEventListener('click',closeAbout));
modal.addEventListener('click',e=>{if(e.target===modal)closeAbout()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAbout()});

let nectarClicks=0, toastTimer;
$('#nectarEgg').addEventListener('click',()=>{ if(++nectarClicks<5)return; nectarClicks=0; const t=$('#toast'); t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2500); });

$$('.tab').forEach(b=>b.addEventListener('click',()=>{ $$('.tab').forEach(x=>x.classList.remove('active')); b.classList.add('active'); setState({productFilter:b.dataset.product}); }));
$('#offerOnly').addEventListener('change',e=>setState({offerOnly:e.target.checked}));
$('#memberOnly').addEventListener('change',e=>setState({memberOnly:e.target.checked}));
$('#sortMode').addEventListener('change',e=>setState({sort:e.target.value}));

syncLocation();
