/* GA4 basic consent: no Google request before an explicit analytics choice. */
(() => {
  const id = document.currentScript?.dataset.measurementId;
  if (location.origin !== 'https://www.monitorarconsultoria.com.br' || !/^G-[A-Z0-9]{6,20}$/.test(id || '') || window.monitorarAnalyticsInstalled) return;
  window.monitorarAnalyticsInstalled = true;
  const storageKey = 'monitorar:analytics-consent:v1';
  let consent = null;
  let loaded = false;
  try { consent = localStorage.getItem(storageKey); } catch { /* Storage is optional. */ }
  const cleanLocation = () => location.origin + location.pathname;
  const cleanReferrer = () => { try { const url = new URL(document.referrer); return url.origin + url.pathname; } catch { return ''; } };
  const start = () => {
    if (loaded || consent !== 'granted') return;
    loaded = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    window.gtag('consent', 'update', {analytics_storage:'granted'});
    window.gtag('js', new Date());
    window.gtag('config', id, {send_page_view:true, page_location:cleanLocation(), page_referrer:cleanReferrer(), allow_google_signals:false, allow_ad_personalization_signals:false});
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  };
  const banner = document.createElement('section');
  banner.className = 'analytics-consent';
  banner.setAttribute('aria-label', 'Preferências de estatísticas');
  banner.innerHTML = '<p>Podemos usar cookies do Google Analytics para entender as visitas e melhorar o site? <a href="/politica-privacidade">Saiba mais</a>.</p><div><button type="button" data-choice="denied">Não permitir</button><button type="button" data-choice="granted">Permitir</button></div>';
  window.addEventListener('monitorar:analytics-preferences', () => { banner.hidden = false; banner.querySelector('button').focus(); });
  document.body.append(banner);
  banner.hidden = consent === 'granted' || consent === 'denied';
  banner.addEventListener('click', event => {
    const button = event.target.closest('button[data-choice]');
    if (!button) return;
    consent = button.dataset.choice;
    try { localStorage.setItem(storageKey, consent); } catch { /* Keep current-page preference. */ }
    banner.hidden = true;
    if (consent === 'granted') start();
    else if (loaded) {
      window['ga-disable-' + id] = true;
      // Clear GA first-party cookies at host and parent-domain scope.
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (!/^_ga(?:_|$)/.test(name)) continue;
        for (const domain of ['', '; domain=www.monitorarconsultoria.com.br', '; domain=monitorarconsultoria.com.br']) {
          document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + domain;
        }
      }
      location.reload();
    }
  });
  // One delegated listener covers institutional and editorial links, without
  // duplicating the existing local monitorar:contact_click events.
  document.addEventListener('click', event => {
    if (consent !== 'granted' || !loaded) return;
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;
    const url = new URL(anchor.href, location.href);
    const channel = url.protocol === 'tel:' ? 'phone' : url.protocol === 'mailto:' ? 'email' : ['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname) ? 'whatsapp' : null;
    if (!channel) return;
    window.gtag('event', 'contact_click', {contact_channel:channel, page_path:location.pathname, page_location:cleanLocation(), transport_type:'beacon'});
  });
  start();
})();
