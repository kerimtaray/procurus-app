import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import ProviderCard from '@/components/ProviderCard';
import { ShipmentRequest, Provider } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon, EditIcon, CheckIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';

export default function MatchingResults() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [showingMore, setShowingMore] = useState(false);
  
  // Fetch shipment request details
  const { data: shipmentRequest, isLoading: loadingRequest } = useQuery<ShipmentRequest>({
    queryKey: [`/api/shipment-requests/${id}`],
  });
  
  // Fetch matching providers
  const { data: matchingProviders, isLoading: loadingProviders } = useQuery<Provider[]>({
    queryKey: [`/api/shipment-requests/${id}/match`],
    enabled: !!id,
  });
  
  // Get all providers if user clicks "Show more providers"
  const { data: allProviders, isLoading: loadingAllProviders } = useQuery<Provider[]>({
    queryKey: ['/api/providers'],
    enabled: showingMore,
  });
  
  // Handle showing more providers
  const handleShowMoreProviders = () => {
    setShowingMore(true);
  };
  
  // Handle edit request
  const handleEditRequest = () => {
    // For now, just go back to create request page
    setLocation('/create-request');
  };
  
  // Handle return to dashboard
  const handleReturnToDashboard = () => {
    setLocation('/agent-dashboard');
  };
  
  // Determine which providers to display
  const providersToDisplay = showingMore ? allProviders : matchingProviders;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton backUrl="/agent-dashboard" />
      
      <div className="flex-1 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Recommended Providers</h1>
                {loadingRequest ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
                ) : (
                  <div className="bg-blue-100 text-blue-800 rounded-md px-3 py-1">
                    Request ID: {shipmentRequest?.requestId}
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">AI Matching System</h3>
                    <p className="text-sm text-blue-700 mt-1">Our system has analyzed your request and found the following best matches based on vehicle type, availability, service area, and historical performance.</p>
                  </div>
                </div>
              </div>
              
              {/* Provider Cards */}
              <div className="space-y-6">
                {loadingProviders ? (
                  <div className="text-center p-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-opacity-25 border-t-primary rounded-full mb-4"></div>
                    <p className="text-gray-600">Finding the best matches for your request...</p>
                  </div>
                ) : providersToDisplay && providersToDisplay.length > 0 ? (
                  providersToDisplay.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      requestId={shipmentRequest?.requestId || ''}
                    />
                  ))
                ) : (
                  <div className="text-center p-8">
                    <p className="text-gray-600">No matching providers found.</p>
                  </div>
                )}
              </div>
              
              {!showingMore && matchingProviders && matchingProviders.length > 0 && (
                <div className="mt-8">
                  <Button 
                    variant="ghost" 
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                    onClick={handleShowMoreProviders}
                  >
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Show more providers
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleEditRequest}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Edit Request
            </Button>
            
            <Button
              className="flex items-center"
              onClick={handleReturnToDashboard}
            >
              <CheckIcon className="mr-2 h-4 w-4" />
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
