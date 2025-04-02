import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import { ShipmentRequest, Provider } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon, EditIcon, CheckIcon, MessageSquare, Check, ChevronsUpDown, ChevronDown, ChevronUp, Copy, SearchIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import useLanguageStore from '@/hooks/useLanguage';
import { t } from '@/lib/translations';

export default function MatchingResults() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { language } = useLanguageStore();
  const [showingMore, setShowingMore] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([]);
  const [openProviderId, setOpenProviderId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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
  const allAvailableProviders = showingMore ? allProviders : matchingProviders;
  
  // Filter providers based on search query
  const providersToDisplay = allAvailableProviders?.filter(provider => 
    searchQuery === '' || 
    provider.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle select provider
  const toggleSelectProvider = (provider: Provider) => {
    if (selectedProviders.some(p => p.id === provider.id)) {
      setSelectedProviders(selectedProviders.filter(p => p.id !== provider.id));
    } else {
      setSelectedProviders([...selectedProviders, provider]);
    }
  };

  // Select all providers
  const selectAllProviders = () => {
    if (providersToDisplay && providersToDisplay.length > 0) {
      if (selectedProviders.length === providersToDisplay.length) {
        setSelectedProviders([]);
      } else {
        setSelectedProviders([...providersToDisplay]);
      }
    }
  };

  // Toggle provider details
  const toggleProviderDetails = (providerId: number) => {
    if (openProviderId === providerId) {
      setOpenProviderId(null);
    } else {
      setOpenProviderId(providerId);
    }
  };

  // Generate WhatsApp message
  const generateWhatsAppMessage = (provider: Provider) => {
    return `Hello ${provider.companyName}! We have a new shipping request (${shipmentRequest?.requestId}). Please provide a quote at: https://procurus.com/quote/${shipmentRequest?.requestId}`;
  };

  // Copy message to clipboard
  const handleCopyMessage = (provider: Provider) => {
    const message = generateWhatsAppMessage(provider);
    navigator.clipboard.writeText(message);
    
    toast({
      title: language === 'es' ? "Mensaje copiado" : "Message copied",
      description: language === 'es' ? "Mensaje de solicitud copiado al portapapeles" : "Quote request message copied to clipboard",
    });
  };

  // Contact multiple providers via WhatsApp
  const contactSelectedProviders = () => {
    if (selectedProviders.length === 0) {
      toast({
        title: language === 'es' ? "Ningún proveedor seleccionado" : "No providers selected",
        description: language === 'es' ? "Por favor selecciona al menos un proveedor" : "Please select at least one provider",
        variant: "destructive"
      });
      return;
    }

    // For the first provider, open WhatsApp
    const provider = selectedProviders[0];
    const message = encodeURIComponent(generateWhatsAppMessage(provider));
    window.open(`https://wa.me/?text=${message}`, '_blank');

    // For the rest, show a message with instructions
    if (selectedProviders.length > 1) {
      toast({
        title: language === 'es' ? "Contactar proveedores adicionales" : "Contact additional providers",
        description: language === 'es' 
          ? `Se abrió WhatsApp para ${provider.companyName}. Contacta los ${selectedProviders.length - 1} proveedores restantes usando el botón individual en cada uno.` 
          : `WhatsApp opened for ${provider.companyName}. Contact the remaining ${selectedProviders.length - 1} providers using the individual button on each.`,
      });
    }
  };

  // Generate star rating
  const renderStarRating = (score: number | null) => {
    if (score === null) score = 0;
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

  // Generate initials from company name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton backUrl="/agent-dashboard" />
      
      <div className="flex-1 bg-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  {language === 'es' ? 'Proveedores Recomendados' : 'Recommended Providers'}
                </h1>
                {loadingRequest ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
                ) : (
                  <div className="bg-blue-100 text-blue-800 rounded-md px-3 py-1">
                    {language === 'es' ? 'ID de Solicitud: ' : 'Request ID: '}{shipmentRequest?.requestId}
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
                    <h3 className="text-sm font-medium text-blue-800">
                      {language === 'es' ? 'Sistema de Coincidencia IA' : 'AI Matching System'}
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      {language === 'es' 
                        ? 'Nuestro sistema ha analizado tu solicitud y encontrado las mejores coincidencias basadas en tipo de vehículo, disponibilidad, área de servicio y desempeño histórico.'
                        : 'Our system has analyzed your request and found the following best matches based on vehicle type, availability, service area, and historical performance.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              {providersToDisplay && (
                <div className="flex mb-6">
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder={language === 'es' ? "Buscar proveedor por nombre..." : "Search provider by name..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 py-2"
                    />
                  </div>
                </div>
              )}

              {/* Bulk Action Bar */}
              {providersToDisplay && providersToDisplay.length > 0 && (
                <div className="flex justify-between items-center mb-6 bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="select-all"
                      checked={selectedProviders.length === providersToDisplay.length && selectedProviders.length > 0}
                      onCheckedChange={selectAllProviders}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium text-gray-700 cursor-pointer">
                      {language === 'es' ? 'Seleccionar todos' : 'Select all'}
                    </label>
                    {selectedProviders.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedProviders.length} {language === 'es' ? 'seleccionados' : 'selected'}
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={contactSelectedProviders}
                    disabled={selectedProviders.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {language === 'es' ? 'Contactar seleccionados' : 'Contact selected'}
                  </Button>
                </div>
              )}
              
              {/* Provider List */}
              <div className="space-y-2">
                {loadingProviders ? (
                  <div className="text-center p-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-opacity-25 border-t-primary rounded-full mb-4"></div>
                    <p className="text-gray-600">
                      {language === 'es' 
                        ? 'Buscando las mejores coincidencias para tu solicitud...'
                        : 'Finding the best matches for your request...'}
                    </p>
                  </div>
                ) : providersToDisplay && providersToDisplay.length > 0 ? (
                  <div className="rounded-md border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-10 px-3 py-3"></th>
                          <th className="w-1/4 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {language === 'es' ? 'Proveedor' : 'Provider'}
                          </th>
                          <th className="w-1/4 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            {language === 'es' ? 'Tipo de Vehículo' : 'Vehicle Type'}
                          </th>
                          <th className="w-1/4 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            {language === 'es' ? 'Área de Servicio' : 'Service Area'}
                          </th>
                          <th className="w-1/6 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {language === 'es' ? 'Coincidencia' : 'Match'}
                          </th>
                          <th className="w-10 px-3 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {providersToDisplay.map((provider) => (
                          <Collapsible
                            key={provider.id}
                            open={openProviderId === provider.id}
                            onOpenChange={() => toggleProviderDetails(provider.id)}
                            className="w-full"
                          >
                            <tr className={openProviderId === provider.id ? "bg-gray-50" : "hover:bg-gray-50"}>
                              <td className="px-3 py-4 whitespace-nowrap">
                                <Checkbox 
                                  checked={selectedProviders.some(p => p.id === provider.id)}
                                  onCheckedChange={() => toggleSelectProvider(provider)}
                                />
                              </td>
                              <td className="px-3 py-4">
                                <div className="flex items-center">
                                  <div className={`${provider.companyName === 'Transportes Fast' ? 'bg-primary' : (provider.companyName === 'EcoTransport' ? 'bg-green-600' : 'bg-purple-600')} text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0`}>
                                    <span className="text-xs">{getInitials(provider.companyName)}</span>
                                  </div>
                                  <div className="ml-3 overflow-hidden">
                                    <div className="text-sm font-medium text-gray-900 truncate">{provider.companyName}</div>
                                    <div className="flex items-center text-xs mt-1">
                                      {renderStarRating(provider.score)}
                                      <span className="text-gray-500 ml-1">{provider.score}/5</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-4 hidden md:table-cell">
                                <div className="text-sm text-gray-900 truncate">
                                  {provider.vehicleTypes.join(', ')}
                                </div>
                              </td>
                              <td className="px-3 py-4 hidden lg:table-cell">
                                <div className="text-sm text-gray-900 truncate">
                                  {provider.serviceAreas.join(', ')}
                                </div>
                              </td>
                              <td className="px-3 py-4 text-center">
                                {provider.matchPercentage && (
                                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getMatchColor(provider.matchPercentage)}`}>
                                    {provider.matchPercentage}%
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-right">
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    {openProviderId === provider.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                  </Button>
                                </CollapsibleTrigger>
                              </td>
                            </tr>
                            <CollapsibleContent>
                              <tr>
                                <td colSpan={6} className="px-3 py-4 bg-gray-50 border-t border-gray-100">
                                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                      <div className="text-xs text-gray-500">{language === 'es' ? 'Tipos de Vehículo' : 'Vehicle Types'}</div>
                                      <div className="text-sm font-medium">{provider.vehicleTypes.join(', ')}</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-500">{language === 'es' ? 'Áreas de Servicio' : 'Service Areas'}</div>
                                      <div className="text-sm font-medium">{provider.serviceAreas.join(', ')}</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-500">{language === 'es' ? 'Tiempo de Respuesta Prom.' : 'Avg. Response Time'}</div>
                                      <div className="text-sm font-medium">{provider.responseTime} {language === 'es' ? 'horas' : 'hours'}</div>
                                    </div>
                                  </div>
                                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                      <div className="text-xs text-gray-500">{language === 'es' ? 'Tasa de Puntualidad' : 'On-Time Rate'}</div>
                                      <div className="text-sm font-medium">{provider.onTimeRate}%</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-500">{language === 'es' ? 'Moneda' : 'Currency'}</div>
                                      <div className="text-sm font-medium">{provider.currency}</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-500">{language === 'es' ? 'Certificaciones' : 'Certifications'}</div>
                                      <div className="text-sm font-medium">{provider.certifications?.length ? provider.certifications.join(', ') : '-'}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-end space-x-3 mt-4">
                                    <a 
                                      href={`https://wa.me/?text=${encodeURIComponent(generateWhatsAppMessage(provider))}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="bg-green-600 text-white px-4 py-2 rounded flex items-center hover:bg-green-700 transition"
                                    >
                                      <MessageSquare className="mr-2 h-4 w-4" />
                                      {language === 'es' ? 'Contactar por WhatsApp' : 'Contact via WhatsApp'}
                                    </a>
                                    <Button variant="outline" onClick={() => handleCopyMessage(provider)} className="flex items-center">
                                      <Copy className="mr-2 h-4 w-4" />
                                      {language === 'es' ? 'Copiar Mensaje' : 'Copy Message'}
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-gray-600">
                      {language === 'es' ? 'No se encontraron proveedores coincidentes.' : 'No matching providers found.'}
                    </p>
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
              {language === 'es' ? 'Listo' : 'Done'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
