import { useState, useCallback, memo } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { WHATSAPP_URL, recordContactClick } from "@/lib/contact";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, LucideIcon } from "lucide-react";
import { Reveal } from "@/components/Reveal";

interface ServiceCardWithIconProps {
  title: string;
  icon: LucideIcon;
  description: string;
  fullDescription: string;
  delayMs?: number;
  imageSrc?: string;
}

const ServiceCardWithIconComponent = ({ title, icon: Icon, description, fullDescription, imageSrc, delayMs = 0 }: ServiceCardWithIconProps) => {
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
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group" style={{ willChange: 'box-shadow' }}>
          <div className="h-48 md:h-52 relative">
            {imageSrc ? (
              <>
                <img src={imageSrc} alt={title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-3 p-3 bg-gradient-to-r from-primary to-secondary rounded-full shadow-md">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="p-6 bg-gradient-to-r from-primary to-secondary rounded-full">
                  <Icon className="h-12 w-12 text-white" />
                </div>
              </div>
            )}
          </div>
          <CardContent className="p-6 text-center flex flex-col h-full">
            <h3 className="text-xl font-bold text-primary mb-1">{title}</h3>
            <p className="text-muted-foreground mb-2 leading-relaxed text-sm flex-grow">{description}</p>
            <DialogTrigger asChild><Button
              onClick={handleExpand}
              className="btn-hero inline-block px-4 py-2 text-sm mt-auto bg-[#4fc106] hover:bg-[#43ad06] text-white"
            >
              Saiba mais
            </Button></DialogTrigger>
          </CardContent>
        </Card>
      </Reveal>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

export const ServiceCardWithIcon = memo(ServiceCardWithIconComponent);
