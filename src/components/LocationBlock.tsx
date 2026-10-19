import { CONTACT, recordContactClick } from '@/lib/contact';
import business from '../../content/business.json';

const phoneLabel = CONTACT.phone.replace(/^\+55(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');

// Company identity from content/business.json, shown as plain HTML so crawlers read it without JavaScript.
export function LocationBlock({ heading }: { heading?: string }) {
  return <section className="editorial-local">
    {heading && <h2>{heading}</h2>}
    <p>{`${business.description.split('. ')[0]}.`}</p>
    <address><strong>{business.name}</strong><br />{business.address.streetAddress}<br />{`${business.address.addressLocality}/${business.address.addressRegion}`}</address>
    <p><a href={`tel:${CONTACT.phone}`} onClick={() => recordContactClick('phone')}>{phoneLabel}</a> · <a href={`mailto:${CONTACT.email}`} onClick={() => recordContactClick('email')}>{CONTACT.email}</a></p>
  </section>;
}
