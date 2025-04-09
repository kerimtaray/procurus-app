import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, MessageCircle, ChevronDown, ChevronUp, Check, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Provider } from '@shared/schema';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useLanguageStore from '@/hooks/useLanguage';

interface ProviderCardProps {
  provider: Provider & { matchPercentage?: number };
  requestId: string;
  isSelected: boolean;
  onToggleSelect: () => void;
}

export default function ProviderCard({ provider, requestId, isSelected, onToggleSelect }: ProviderCardProps) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const { language } = useLanguageStore();
  
  // Generate initials from company name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate whatsapp link with pre-filled message
  const getWhatsAppLink = () => {
    const message = encodeURIComponent(
      `Hello ${provider.companyName}! We have a new shipping request (${requestId}). Please provide a quote at: https://procurus.com/quote/${requestId}`
    );
    return `https://wa.me/?text=${message}`;
  };

  // Copy message to clipboard
  const handleCopyMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hello ${provider.companyName}! We have a new shipping request (${requestId}). Please provide a quote at: https://procurus.com/quote/${requestId}`;
    navigator.clipboard.writeText(message);
    
    toast({
      title: "Message copied",
      description: "Quote request message copied to clipboard",
    });
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Generate star rating
  const renderStarRating = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <span className="text-amber-500 flex">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
      </span>
    );
  };

  // Determine match color based on percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 80) return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Handle checkbox click without toggling expanded state
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect();
  };

  return (
    <Card 
      className={`border ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200'} overflow-hidden mb-3 hover:border-primary/50 transition-colors cursor-pointer`}
      onClick={toggleExpanded}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className="mr-3"
            onClick={handleCheckboxClick}
          >
            <Checkbox checked={isSelected} />
          </div>
          <div className={`${provider.companyName === 'Transportes Fast' ? 'bg-primary' : (provider.companyName === 'EcoTransport' ? 'bg-green-600' : 'bg-purple-600')} text-white rounded-full h-8 w-8 flex items-center justify-center mr-3`}>
            <span className="text-xs">{getInitials(provider.companyName)}</span>
          </div>
          <div>
            <h2 className="text-base font-medium text-gray-800">{provider.companyName}</h2>
            <div className="flex items-center text-xs">
              {renderStarRating(provider.score || 0)}
              <span className="text-gray-600 ml-1">{provider.score || 0}/5 ({provider.completedJobs || 0} trips)</span>
              {provider.matchPercentage && (
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${getMatchColor(provider.matchPercentage)}`}>
                  {provider.matchPercentage}% Match
                </span>
              )}
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-xs text-gray-600">{provider.vehicleTypes.slice(0, 2).join(', ')}{provider.vehicleTypes.length > 2 ? '...' : ''}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 mr-1"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {expanded && (
        <CardContent className="bg-gray-50 border-t p-3">
          <div className="grid md:grid-cols-3 gap-4 mb-3">
            <div>
              <div className="text-xs text-gray-500">Vehicle Types</div>
              <div className="text-xs font-medium">{provider.vehicleTypes.join(', ')}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Service Areas</div>
              <div className="text-xs font-medium">{provider.serviceAreas.join(', ')}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Avg. Response Time</div>
              <div className="text-xs font-medium">{provider.responseTime} hours</div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-3">
            <div>
              <div className="text-xs text-gray-500">On-Time Rate</div>
              <div className="text-xs font-medium">{provider.onTimeRate}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Currency</div>
              <div className="text-xs font-medium">{provider.currency}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Certifications</div>
              <div className="text-xs font-medium">{provider.certifications?.length ? provider.certifications.join(', ') : '-'}</div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="flex items-center h-7 text-xs px-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info className="mr-1 h-3 w-3" />
                  {language === 'es' ? 'Más Detalles' : 'More Details'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <div className={`${provider.companyName === 'Transportes Fast' ? 'bg-primary' : (provider.companyName === 'EcoTransport' ? 'bg-green-600' : 'bg-purple-600')} text-white rounded-full h-8 w-8 flex items-center justify-center mr-3`}>
                      <span className="text-xs">{getInitials(provider.companyName)}</span>
                    </div>
                    {provider.companyName}
                  </DialogTitle>
                  <DialogDescription>
                    {renderStarRating(provider.score || 0)}
                    <span className="text-gray-600 ml-1">{provider.score || 0}/5 ({provider.completedJobs || 0} trips)</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">{language === 'es' ? 'Ubicación' : 'Location'}</h4>
                      <p className="text-sm text-gray-600">{(provider as any).location || 'Ciudad de México, México'}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700">{language === 'es' ? 'Años de Operación' : 'Years in Operation'}</h4>
                      <p className="text-sm text-gray-600">{(provider as any).yearsOfOperation || 5} {language === 'es' ? 'años' : 'years'}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700">{language === 'es' ? 'Flota' : 'Fleet'}</h4>
                      <div className="text-sm text-gray-600">
                        <ul className="list-disc list-inside">
                          <li>12 {language === 'es' ? 'camiones' : 'trucks'}</li>
                          <li>8 {language === 'es' ? 'remolques' : 'trailers'}</li>
                          <li>3 {language === 'es' ? 'unidades refrigeradas' : 'refrigerated units'}</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700">{language === 'es' ? 'Servicios Especiales' : 'Special Services'}</h4>
                      <p className="text-sm text-gray-600">
                        {language === 'es' 
                          ? 'Rastreo en tiempo real, entrega urgente, manejo de carga especial'
                          : 'Real-time tracking, urgent delivery, special cargo handling'}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700">{language === 'es' ? 'Clientes Principales' : 'Main Clients'}</h4>
                      <p className="text-sm text-gray-600">Walmart, Coca-Cola, Nestlé</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-green-600 text-white text-xs px-3 py-1.5 rounded flex items-center hover:bg-green-700 transition"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="mr-1 h-3 w-3" />
              {language === 'es' ? 'Contactar por WhatsApp' : 'Contact via WhatsApp'}
            </a>
            <Button 
              variant="outline" 
              onClick={handleCopyMessage} 
              className="flex items-center h-7 text-xs px-3"
            >
              <Copy className="mr-1 h-3 w-3" />
              {language === 'es' ? 'Copiar Mensaje' : 'Copy Message'}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
