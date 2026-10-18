import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL, recordContactClick } from "@/lib/contact";
export function WhatsAppButton() {
  return <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Conversar com a Monitorar no WhatsApp" onClick={() => recordContactClick("whatsapp")} className="fixed bottom-6 right-4 z-50 h-14 w-14 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"><MessageCircle aria-hidden="true" size={26}/></a>;
}
