export function analyticsHead(id, {preview=false}={}) {
 if(preview || !id?.trim())return '';
 if(!/^G-[A-Z0-9]{6,20}$/.test(id))throw new Error('Invalid GA4 measurement ID');
 return `<link rel="stylesheet" href="/analytics-consent.css"/><script defer src="/analytics.js" data-measurement-id="${id}"></script>`;
}
