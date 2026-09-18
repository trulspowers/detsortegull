const listeners = new Set();
const savedLocation = localStorage.getItem('sorteGullLocation') || 'sandefjord';
const state = { location:savedLocation, productFilter:'all', offerOnly:false, memberOnly:false, sort:'pricePerLiter', favorites:JSON.parse(localStorage.getItem('sorteGullFavs') || '[]'), prices:[] };
export const getState = () => ({...state});
export function setState(patch){ Object.assign(state,patch); if(patch.location) localStorage.setItem('sorteGullLocation',state.location); listeners.forEach(fn=>fn(getState())); }
export function subscribe(fn){ listeners.add(fn); return ()=>listeners.delete(fn); }
