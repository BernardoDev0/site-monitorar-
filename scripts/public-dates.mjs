/** Dates of the public version, never the time of the build. */
export function publicModifiedAt(page) {
 const dates=[page?.first_published_at,page?.substantive_updated_at].filter(value=>value!=null);
 if(!dates.length)return null;
 if(dates.some(value=>!Number.isFinite(Date.parse(value))))throw new Error('Invalid public content date');
 return dates.reduce((latest,value)=>Date.parse(value)>Date.parse(latest)?value:latest);
}
