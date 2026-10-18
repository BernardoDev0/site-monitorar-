export function verificationMeta(env=process.env) {
 return [['GOOGLE_SITE_VERIFICATION','google-site-verification'],['BING_SITE_VERIFICATION','msvalidate.01']].map(([key,name])=>{
  const value=env[key]?.trim();if(!value)return '';
  if(!/^[A-Za-z0-9_-]{10,200}$/.test(value))throw new Error('Invalid site verification token: '+key);
  return `<meta name="${name}" content="${value}"/>`;
 }).join('');
}
