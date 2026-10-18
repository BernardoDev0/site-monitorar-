import business from '../../content/business.json';
export const CONTACT = {whatsapp:business.whatsapp,phone:business.phone,email:business.email};
export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de conversar sobre uma proposta com a Monitorar Consultoria.")}`;
export function recordContactClick(channel: "whatsapp" | "phone" | "email") {
  window.dispatchEvent(new CustomEvent("monitorar:contact_click", {detail: {channel, path: window.location.pathname}}));
}

export function whatsAppMessageUrl(message: string) { return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`; }
