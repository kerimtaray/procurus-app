import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Provider } from '@shared/schema';

interface ProviderCardProps {
  provider: Provider & { matchPercentage?: number };
  requestId: string;
}

export default function ProviderCard({ provider, requestId }: ProviderCardProps) {
  const { toast } = useToast();
  
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
      `Hello ${provider.companyName}! We have a new shipping request (${requestId}). Please provide a quote at: https://logiconnect.com/quote/${requestId}`
    );
    return `https://wa.me/?text=${message}`;
  };

  // Copy message to clipboard
  const handleCopyMessage = () => {
    const message = `Hello ${provider.companyName}! We have a new shipping request (${requestId}). Please provide a quote at: https://logiconnect.com/quote/${requestId}`;
    navigator.clipboard.writeText(message);
    
    toast({
      title: "Message copied",
      description: "Quote request message copied to clipboard",
    });
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

  return (
    <Card className="border border-gray-200 overflow-hidden mb-6">
      <CardHeader className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <div className={`${provider.companyName === 'Transportes Fast' ? 'bg-primary' : (provider.companyName === 'EcoTransport' ? 'bg-green-600' : 'bg-purple-600')} text-white rounded-full h-10 w-10 flex items-center justify-center`}>
            <span>{getInitials(provider.companyName)}</span>
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-800">{provider.companyName}</h2>
            <div className="flex items-center text-sm">
              {renderStarRating(provider.score)}
              <span className="text-gray-600 ml-1">{provider.score}/5 ({provider.completedJobs} trips)</span>
            </div>
          </div>
        </div>
        {provider.matchPercentage && (
          <div className={`rounded-full px-3 py-1 text-sm font-medium ${getMatchColor(provider.matchPercentage)}`}>
            {provider.matchPercentage}% Match
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">Vehicle Types</div>
            <div className="text-sm font-medium">{provider.vehicleTypes.join(', ')}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Service Areas</div>
            <div className="text-sm font-medium">{provider.serviceAreas.join(', ')}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Avg. Response Time</div>
            <div className="text-sm font-medium">{provider.responseTime} hours</div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">On-Time Rate</div>
            <div className="text-sm font-medium">{provider.onTimeRate}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Currency</div>
            <div className="text-sm font-medium">{provider.currency}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Certifications</div>
            <div className="text-sm font-medium">{provider.certifications?.length ? provider.certifications.join(', ') : '-'}</div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-4">
          <a 
            href={getWhatsAppLink()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center hover:bg-green-700 transition"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact via WhatsApp
          </a>
          <Button variant="outline" onClick={handleCopyMessage} className="flex items-center">
            <Copy className="mr-2 h-4 w-4" />
            Copy Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
