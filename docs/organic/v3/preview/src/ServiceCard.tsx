import { useState, useCallback, memo } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { WHATSAPP_URL, recordContactClick } from "@/lib/contact";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";

interface ServiceCardProps {
  title: string;
  image: string;
  description: string;
  fullDescription: string;
  delayMs?: number;
}

const ServiceCardComponent = ({ title, image, description, fullDescription, delayMs = 0 }: ServiceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
  }, []);



  return (
    <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
      <Reveal delayMs={delayMs}>
        <Card className="erm-offering" data-reveal>
          <div className="h-64 md:h-72 lg:h-80 overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover" 
              
              loading="lazy" 
            />
          </div>
          <CardContent className="p-8 pt-6 pb-6 text-center flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
            <DialogTrigger asChild><Button
              onClick={handleExpand}
              className="btn-hero inline-block px-6 py-3 mt-2 bg-[#4fc106] hover:bg-[#43ad06] text-white"
            >
              Saiba mais
            </Button></DialogTrigger>
          </CardContent>
        </Card>
      </Reveal>

      <DialogContent className="erm-dialog max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl text-primary pr-10">{title}</DialogTitle>
        <DialogDescription className="text-base leading-relaxed">{fullDescription}</DialogDescription>
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button asChild><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => recordContactClick("whatsapp")}><MessageCircle className="h-5 w-5 mr-2" />Falar com um consultor</a></Button>
          <DialogClose asChild><Button variant="outline" onClick={handleClose}>Fechar</Button></DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ServiceCard = memo(ServiceCardComponent);
