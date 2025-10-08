import { useState, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";
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

  const handleConsultant = useCallback(() => {
    window.open('https://wa.me/5521999999999', '_blank');
  }, []);

  return (
    <>
      <Reveal delayMs={delayMs}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group" style={{ willChange: 'box-shadow' }}>
          <div className="h-64 md:h-72 lg:h-80 overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
              style={{ willChange: 'transform' }}
              loading="lazy" 
            />
          </div>
          <CardContent className="p-8 pt-6 pb-6 text-center flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
            <Button 
              onClick={handleExpand}
              className="btn-hero inline-block px-6 py-3 mt-2 bg-[#4fc106] hover:bg-[#43ad06] text-white"
            >
              Saiba mais
            </Button>
          </CardContent>
        </Card>
      </Reveal>

      {/* Modal/Overlay - Rendered via Portal outside the card */}
      {isExpanded && createPortal(
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
          style={{ 
            animation: 'fadeIn 200ms ease-out',
            willChange: 'opacity, transform'
          }}
        >
          <Card 
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              animation: 'slideIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              willChange: 'transform, opacity'
            }}
          >
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-primary">{title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="hover:bg-gray-100 rounded-full p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {fullDescription}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  <Button 
                    onClick={handleConsultant}
                    className="flex items-center gap-2 bg-[#4fc106] hover:bg-[#43ad06] text-white px-6 py-3"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Falar com um consultor
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleClose}
                    className="px-6 py-3"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>,
        document.body
      )}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: scale(0.95) translateY(20px) translateZ(0);
            }
            to { 
              opacity: 1;
              transform: scale(1) translateY(0) translateZ(0);
            }
          }
        `
      }} />
    </>
  );
};

export const ServiceCard = memo(ServiceCardComponent);
