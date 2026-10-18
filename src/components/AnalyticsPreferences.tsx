import {useEffect,useState} from 'react';

export function AnalyticsPreferences() {
  const [enabled,setEnabled]=useState(false);
  useEffect(()=>{
    setEnabled(location.origin==='https://www.monitorarconsultoria.com.br' && !!document.querySelector('script[data-measurement-id]'));
  },[]);
  if(!enabled)return null;
  return <button type="button" className="analytics-preferences" onClick={()=>window.dispatchEvent(new Event('monitorar:analytics-preferences'))}>Preferências de cookies</button>;
}
