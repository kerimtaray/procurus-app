import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import ProviderCard from '@/components/ProviderCard';
import { ShipmentRequest, Provider } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon, EditIcon, CheckIcon, MessageCircle, ArrowDownIcon, ArrowUpIcon, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import useLanguageStore from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export default function MatchingResults() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { language } = useLanguageStore();
  const [showingMore, setShowingMore] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'match' | 'score'>('match');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
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

  // Helper to toggle the selection of a provider
  const toggleSelectProvider = (providerId: number) => {
    setSelectedProviders(current => 
      current.includes(providerId) 
        ? current.filter(id => id !== providerId)
        : [...current, providerId]
    );
  };

  // Helper to toggle the selection of all providers
  const toggleSelectAll = () => {
    if (providersToDisplay?.length) {
      if (selectedProviders.length === providersToDisplay.length) {
        // If all are selected, deselect all
        setSelectedProviders([]);
      } else {
        // Otherwise, select all
        setSelectedProviders(providersToDisplay.map(p => p.id));
      }
    }
  };

  // Handle bulk contact
  const handleBulkContact = () => {
    if (selectedProviders.length === 0) {
      toast({
        title: language === 'es' ? "Ningún proveedor seleccionado" : "No providers selected",
        description: language === 'es' 
          ? "Por favor selecciona al menos un proveedor" 
          : "Please select at least one provider",
        variant: "destructive",
      });
      return;
    }

    const selectedProvidersList = providersToDisplay?.filter(p => selectedProviders.includes(p.id)) || [];
    
    // Create a message for all selected providers
    const message = encodeURIComponent(
      `Hello! I'm sending a shipment request (${shipmentRequest?.requestId}) to multiple carriers. ` +
      `Please provide a quote at: https://procurus.com/quote/${shipmentRequest?.requestId}`
    );
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/?text=${message}`, '_blank');
    
    toast({
      title: language === 'es' ? "Mensaje preparado" : "Message prepared",
      description: language === 'es'
        ? `Contactando ${selectedProviders.length} proveedores`
        : `Contacting ${selectedProviders.length} providers`,
    });
  };
  
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

  // Sort and filter providers
  const getFilteredAndSortedProviders = () => {
    if (!providersToDisplay) return [];
    
    // Filter by search term
    let filtered = providersToDisplay;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = providersToDisplay.filter(p => 
        p.companyName.toLowerCase().includes(term) ||
        p.vehicleTypes.some(vt => vt.toLowerCase().includes(term)) ||
        p.serviceAreas.some(sa => sa.toLowerCase().includes(term))
      );
    }
    
    // Add matchPercentage property to each provider if it doesn't exist
    const enhancedProviders = filtered.map(p => {
      // If provider already has matchPercentage, use it
      if ((p as any).matchPercentage !== undefined) {
        return p;
      }
      
      // Otherwise generate a mock matchPercentage based on their score
      const score = p.score || 0;
      const matchPercentage = Math.round(70 + score * 5); // Generate a percentage between 70-95%
      return {
        ...p,
        matchPercentage
      };
    });
    
    // Sort providers
    return [...enhancedProviders].sort((a, b) => {
      if (sortBy === 'match') {
        const aMatch = (a as any).matchPercentage || 0;
        const bMatch = (b as any).matchPercentage || 0;
        return sortOrder === 'desc' ? bMatch - aMatch : aMatch - bMatch;
      } else {
        // Sort by score
        const aScore = a.score || 0;
        const bScore = b.score || 0;
        return sortOrder === 'desc' ? bScore - aScore : aScore - bScore;
      }
    });
  };
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(current => current === 'desc' ? 'asc' : 'desc');
  };
  
  // Change sort field
  const changeSortBy = (field: 'match' | 'score') => {
    if (sortBy === field) {
      toggleSortOrder();
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // Determine which providers to display
  const providersToDisplay = showingMore ? allProviders : matchingProviders;
  
  // Get filtered and sorted providers
  const displayProviders = getFilteredAndSortedProviders();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton backUrl="/agent-dashboard" />
      
      <div className="flex-1 bg-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Card className="mb-6 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    {language === 'es' ? 'Proveedores Recomendados' : 'Recommended Providers'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {selectedProviders.length 
                      ? language === 'es' 
                        ? `${selectedProviders.length} proveedores seleccionados` 
                        : `${selectedProviders.length} providers selected`
                      : language === 'es'
                        ? 'Selecciona proveedores para contactar'
                        : 'Select providers to contact'
                    }
                  </p>
                </div>
                {loadingRequest ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
                ) : (
                  <div className="bg-blue-100 text-blue-800 rounded-md px-3 py-1">
                    Request ID: {shipmentRequest?.requestId}
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-5">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xs font-medium text-blue-800">
                      {language === 'es' ? 'Sistema de Coincidencia IA' : 'AI Matching System'}
                    </h3>
                    <p className="text-xs text-blue-700 mt-0.5">
                      {language === 'es' 
                        ? 'Nuestro sistema ha analizado tu solicitud y encontró las siguientes mejores coincidencias basadas en tipo de vehículo, disponibilidad, área de servicio y desempeño histórico.'
                        : 'Our system has analyzed your request and found the following best matches based on vehicle type, availability, service area, and historical performance.'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action bar with bulk contact and search */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div className="flex items-center space-x-2">
                  {selectedProviders.length > 0 && (
                    <Button 
                      onClick={handleBulkContact}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center text-sm h-9"
                    >
                      <MessageCircle className="mr-1.5 h-4 w-4" />
                      {language === 'es' ? 'Contactar Seleccionados' : 'Contact Selected'}
                    </Button>
                  )}
                  
                  <div 
                    className="flex items-center space-x-1 cursor-pointer text-sm text-gray-600"
                    onClick={toggleSelectAll}
                  >
                    <Checkbox 
                      checked={providersToDisplay?.length ? selectedProviders.length === providersToDisplay.length : false} 
                      className="h-4 w-4"
                    />
                    <span className="text-xs">
                      {language === 'es' ? 'Seleccionar todos' : 'Select all'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-60">
                    <Search className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder={language === 'es' ? "Buscar proveedores..." : "Search providers..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9 text-sm w-full"
                    />
                  </div>
                  
                  <div className="flex text-xs space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`h-9 text-xs px-2 ${sortBy === 'match' ? 'border-primary text-primary' : ''}`}
                      onClick={() => changeSortBy('match')}
                    >
                      {language === 'es' ? 'Coincidencia' : 'Match'}
                      {sortBy === 'match' && (
                        sortOrder === 'desc' 
                          ? <ArrowDownIcon className="ml-1 h-3 w-3" /> 
                          : <ArrowUpIcon className="ml-1 h-3 w-3" />
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`h-9 text-xs px-2 ${sortBy === 'score' ? 'border-primary text-primary' : ''}`}
                      onClick={() => changeSortBy('score')}
                    >
                      {language === 'es' ? 'Calificación' : 'Rating'}
                      {sortBy === 'score' && (
                        sortOrder === 'desc' 
                          ? <ArrowDownIcon className="ml-1 h-3 w-3" /> 
                          : <ArrowUpIcon className="ml-1 h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Provider Cards */}
              <div className="mb-3">
                {loadingProviders ? (
                  <div className="text-center p-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-opacity-25 border-t-primary rounded-full mb-4"></div>
                    <p className="text-gray-600">
                      {language === 'es' 
                        ? 'Buscando las mejores coincidencias para tu solicitud...' 
                        : 'Finding the best matches for your request...'}
                    </p>
                  </div>
                ) : displayProviders.length > 0 ? (
                  displayProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      requestId={shipmentRequest?.requestId || ''}
                      isSelected={selectedProviders.includes(provider.id)}
                      onToggleSelect={() => toggleSelectProvider(provider.id)}
                    />
                  ))
                ) : (
                  <div className="text-center p-8">
                    <p className="text-gray-600">
                      {language === 'es' 
                        ? 'No se encontraron proveedores coincidentes.' 
                        : 'No matching providers found.'}
                    </p>
                  </div>
                )}
              </div>
              
              {!showingMore && matchingProviders && matchingProviders.length > 0 && (
                <div className="mt-5">
                  <Button 
                    variant="ghost" 
                    className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                    onClick={handleShowMoreProviders}
                  >
                    <PlusCircleIcon className="mr-1.5 h-4 w-4" />
                    {language === 'es' ? 'Mostrar más proveedores' : 'Show more providers'}
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
              {language === 'es' ? 'Editar Solicitud' : 'Edit Request'}
            </Button>
            
            <Button
              className="flex items-center"
              onClick={handleReturnToDashboard}
            >
              <CheckIcon className="mr-2 h-4 w-4" />
              {language === 'es' ? 'Finalizado' : 'Done'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
