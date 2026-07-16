'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { trackServiceView, trackWhatsAppClick } from '@/lib/tracking';

type ServiceCTAButtonProps = {
  serviceId: string;
  serviceTitle: string;
  whatsappUrl: string;
  buttonLocation: string;
  className?: string;
  children?: React.ReactNode;
};

export function ServiceCTAButton({ 
  serviceId, 
  serviceTitle, 
  whatsappUrl, 
  buttonLocation,
  className,
  children
}: ServiceCTAButtonProps) {
  
  const handleClick = () => {
    trackServiceView(serviceId, { service_name: serviceTitle });
    
    if (whatsappUrl.includes('whatsapp') || whatsappUrl.includes('wa.me')) {
      trackWhatsAppClick(buttonLocation, serviceId);
    }
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children ? children : (
        <Button className="w-full gap-2">
          Solicitar Presupuesto
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </a>
  );
}
