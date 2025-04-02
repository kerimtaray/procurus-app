import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileIcon, EditIcon, SendIcon, CheckIcon, XIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ShipmentRequest, ShipmentRequestStatus, Provider, Bid, BidStatus } from '@shared/schema';
import { generateClientProposalPDF } from '@/lib/pdfGenerator';
import { formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useLanguageStore from '@/hooks/useLanguage';
import useUserStore from '@/hooks/useUserRole';
import { queryClient, apiRequest } from '@/lib/queryClient';

export default function ClientProposal() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [marginPercent, setMarginPercent] = useState(10); // Default margin 10%
  const [step, setStep] = useState<'addMargin' | 'preview' | 'waitingResponse' | 'responseReceived'>('addMargin');
  const [clientResponded, setClientResponded] = useState<boolean | null>(null);
  const { language } = useLanguageStore();
  const { companyName: agentCompanyName, username: agentName } = useUserStore();
  
  // Fetch the active shipment request
  const { data: shipmentRequest, isLoading: loadingRequest } = useQuery<ShipmentRequest>({
    queryKey: [`/api/shipment-requests/${id}`],
    enabled: !!id
  });
  
  // Fetch the selected provider (from accepted bid)
  const { data: bids, isLoading: loadingBids } = useQuery<Bid[]>({
    queryKey: [`/api/bids`, { shipmentRequestId: id }],
    enabled: !!id
  });
  
  // Get the accepted bid
  const acceptedBid = bids?.find(bid => bid.status === BidStatus.ACCEPTED);
  
  // Fetch provider details for the accepted bid
  const { data: provider, isLoading: loadingProvider } = useQuery<Provider>({
    queryKey: [`/api/providers/${acceptedBid?.providerId}`],
    enabled: !!acceptedBid?.providerId
  });
  
  // Mutation to update request status
  const { mutate: updateRequestStatus } = useMutation({
    mutationFn: async (status: ShipmentRequestStatus) => {
      if (!id) return;
      return apiRequest(`/api/shipment-requests/${id}/status`, 'PATCH', {
        status
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/shipment-requests/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/shipment-requests'] });
      
      toast({
        title: "Success!",
        description: clientResponded 
          ? "Client has accepted the proposal. Provider has been notified."
          : "Client response has been recorded.",
      });
      
      // If accepted, we can now move to instruction letter
      if (clientResponded) {
        setTimeout(() => {
          setLocation(`/instruction-letter/${id}`);
        }, 1500);
      } else {
        // If rejected, go back to review bids to select another provider
        setTimeout(() => {
          setLocation(`/review-bids/${id}`);
        }, 1500);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update the request status.",
        variant: "destructive"
      });
      console.error(error);
    }
  });
  
  const isLoading = loadingRequest || loadingBids || loadingProvider;
  
  // Mock data (will be replaced with actual data from API)
  const mockShipmentRequest: ShipmentRequest = shipmentRequest || {
    id: parseInt(id || '0'),
    requestId: `REQ-1235`,
    userId: 1,
    requestorName: "Miguel Gonzalez",
    company: "Importadora MG",
    cargoType: "General Merchandise",
    weight: 5000,
    volume: 20,
    packagingType: "Pallets",
    specialRequirements: "Temperature control, handling instructions",
    vehicleType: "Dry Van",
    vehicleSize: "Medium",
    pickupAddress: "Mexico City Warehouse, Block 3, Avenida Principal",
    pickupDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    pickupContact: "Juan Perez",
    deliveryAddress: "Guadalajara Distribution Center, Industrial Zone 5",
    deliveryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    deliveryContact: "Maria Rodriguez",
    additionalEquipment: [],
    status: ShipmentRequestStatus.PENDING,
    assignedProviderId: null,
    createdAt: new Date()
  };
  
  const mockProvider: Provider = provider || {
    id: acceptedBid?.providerId || 1,
    userId: 2,
    companyName: "Transportes Fast",
    rfc: "TFA123456789",
    serviceAreas: [],
    vehicleTypes: [],
    certifications: [],
    score: 4.8,
    status: "Approved",
    createdAt: new Date()
  };
  
  // Calculate margin and total amount
  const baseAmount = acceptedBid?.price || 10000;
  const currency = acceptedBid?.currency || "MXN";
  const marginAmount = (baseAmount * marginPercent) / 100;
  const totalAmount = baseAmount + marginAmount;
  
  // Format date for display
  const formatDateDisplay = (date: Date) => {
    return formatDate(date, { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric'
    });
  };
  
  // Progress to next step
  const handleNextStep = () => {
    if (step === 'addMargin') {
      setStep('preview');
    }
  };
  
  // Go back to previous step
  const handleBack = () => {
    if (step === 'preview') {
      setStep('addMargin');
    } else if (step === 'waitingResponse' || step === 'responseReceived') {
      setStep('preview');
    }
  };
  
  // Generate and download PDF
  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    try {
      const pdfData = {
        requestId: mockShipmentRequest.requestId,
        date: formatDateDisplay(new Date()),
        
        // Client information
        clientCompanyName: mockShipmentRequest.company,
        clientContactName: mockShipmentRequest.requestorName,
        clientEmail: "email@client.com", // This would come from the client data
        clientPhone: "+52 55 1234 5678", // This would come from the client data
        
        // Agent information
        agentCompanyName: agentCompanyName,
        agentContactName: agentName,
        agentEmail: "agent@procurus.com", // This would come from the agent data
        agentPhone: "+52 55 9876 5432", // This would come from the agent data
        
        // Shipment details
        cargoType: mockShipmentRequest.cargoType,
        weight: `${mockShipmentRequest.weight} kg`,
        volume: `${mockShipmentRequest.volume} m³`,
        packageType: mockShipmentRequest.packagingType || 'Standard',
        vehicleType: mockShipmentRequest.vehicleType,
        specialRequirements: mockShipmentRequest.specialRequirements || 'None',
        
        // Pickup information
        pickupAddress: mockShipmentRequest.pickupAddress,
        pickupDateTime: `${formatDateDisplay(mockShipmentRequest.pickupDate)} | 9:00 AM - 12:00 PM`,
        pickupContactPerson: mockShipmentRequest.pickupContact || 'N/A',
        pickupInstructions: "Call warehouse before arrival",
        
        // Delivery information
        deliveryAddress: mockShipmentRequest.deliveryAddress,
        deliveryDateTime: `${formatDateDisplay(mockShipmentRequest.deliveryDate)} | 2:00 PM - 5:00 PM`,
        deliveryContactPerson: mockShipmentRequest.deliveryContact || 'N/A',
        deliveryInstructions: "Call one hour before arrival",
        
        // Commercial terms
        baseQuoteAmount: `${baseAmount.toLocaleString()} ${currency}`,
        agentMargin: `${marginAmount.toLocaleString()} ${currency} (${marginPercent}%)`,
        totalAmount: `${totalAmount.toLocaleString()} ${currency}`,
        paymentTerms: "Net 30 days",
        serviceLevel: "Standard",
        additionalFees: "None"
      };
      
      const pdfBlob = generateClientProposalPDF(pdfData);
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `proposal_${mockShipmentRequest.requestId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Move to waiting response step
      setStep('waitingResponse');
      
      toast({
        title: "Proposal generated!",
        description: "The proposal PDF has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate the PDF. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle client response (accepted or rejected)
  const handleClientResponse = (accepted: boolean) => {
    setClientResponded(accepted);
    setStep('responseReceived');
    
    // Update request status based on response
    if (accepted) {
      updateRequestStatus(ShipmentRequestStatus.ASSIGNED);
    } else {
      // Reset the provider selection
      // In a real implementation, you would need to update the bid status back to pending
      // and the request status would remain pending
      toast({
        title: "Proposal Rejected",
        description: "Please select another provider or modify the terms.",
      });
    }
  };
  
  // Render margin configuration step
  const renderMarginStep = () => {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {language === 'es' ? 'Añadir Margen de Agente' : 'Add Agent Margin'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'es' 
              ? 'Añada su margen de comisión al costo base proporcionado por el proveedor seleccionado.'
              : 'Add your commission margin to the base cost provided by the selected provider.'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="base-amount" className="text-gray-700">
                {language === 'es' ? 'Costo Base del Proveedor' : 'Provider Base Cost'}
              </Label>
              <Input 
                id="base-amount"
                value={`${baseAmount.toLocaleString()} ${currency}`}
                disabled
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                {language === 'es' 
                  ? 'Este es el costo cotizado por el proveedor seleccionado.'
                  : 'This is the quoted cost from the selected provider.'}
              </p>
            </div>
            
            <div>
              <Label htmlFor="margin-percent" className="text-gray-700">
                {language === 'es' ? 'Margen del Agente (%)' : 'Agent Margin (%)'}
              </Label>
              <Input 
                id="margin-percent"
                type="number"
                min="0"
                max="100"
                value={marginPercent}
                onChange={(e) => setMarginPercent(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                {language === 'es' 
                  ? 'Ingrese el porcentaje de margen que desea añadir.'
                  : 'Enter the margin percentage you want to add.'}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {language === 'es' ? 'Costo Base:' : 'Base Cost:'}
                </span>
                <span>{baseAmount.toLocaleString()} {currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {language === 'es' ? 'Margen del Agente:' : 'Agent Margin:'}
                </span>
                <span>{marginAmount.toLocaleString()} {currency} ({marginPercent}%)</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t border-gray-200">
                <span>
                  {language === 'es' ? 'Monto Total para Cliente:' : 'Total Amount for Client:'}
                </span>
                <span>{totalAmount.toLocaleString()} {currency}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleNextStep}
              className="bg-primary hover:bg-primary/90"
            >
              {language === 'es' ? 'Continuar a Vista Previa' : 'Continue to Preview'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Render proposal preview
  const renderProposalPreview = () => {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <FileIcon className="h-10 w-10 text-primary mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-800">
              {language === 'es' ? 'Propuesta de Servicio de Transporte' : 'Transportation Service Proposal'}
            </h1>
            <p className="text-gray-600">{mockShipmentRequest.requestId} | {formatDateDisplay(new Date())}</p>
          </div>
          
          <div className="border-t border-b border-gray-200 py-6 my-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {language === 'es' ? 'Información del Cliente' : 'Client Information'}
                </h2>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">{language === 'es' ? 'Empresa:' : 'Company:'}</span>
                    <span className="font-medium ml-2">{mockShipmentRequest.company}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{language === 'es' ? 'Contacto:' : 'Contact:'}</span>
                    <span className="font-medium ml-2">{mockShipmentRequest.requestorName}</span>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {language === 'es' ? 'Agente Logístico' : 'Logistics Agent'}
                </h2>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">{language === 'es' ? 'Empresa:' : 'Company:'}</span>
                    <span className="font-medium ml-2">{agentCompanyName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{language === 'es' ? 'Agente:' : 'Agent:'}</span>
                    <span className="font-medium ml-2">{agentName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              {language === 'es' ? 'Detalles del Envío' : 'Shipment Details'}
            </h2>
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">{language === 'es' ? 'Tipo de Carga' : 'Cargo Type'}</div>
                  <div className="font-medium">{mockShipmentRequest.cargoType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{language === 'es' ? 'Tipo de Vehículo' : 'Vehicle Type'}</div>
                  <div className="font-medium">{mockShipmentRequest.vehicleType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{language === 'es' ? 'Peso' : 'Weight'}</div>
                  <div className="font-medium">{mockShipmentRequest.weight} kg</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{language === 'es' ? 'Volumen' : 'Volume'}</div>
                  <div className="font-medium">{mockShipmentRequest.volume} m³</div>
                </div>
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              {language === 'es' ? 'Información de Transporte' : 'Transportation Information'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">
                  {language === 'es' ? 'Información de Recogida' : 'Pickup Information'}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">{language === 'es' ? 'Dirección' : 'Address'}</div>
                    <div className="font-medium">{mockShipmentRequest.pickupAddress}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{language === 'es' ? 'Fecha' : 'Date'}</div>
                    <div className="font-medium">{formatDateDisplay(mockShipmentRequest.pickupDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{language === 'es' ? 'Contacto' : 'Contact'}</div>
                    <div className="font-medium">{mockShipmentRequest.pickupContact || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">
                  {language === 'es' ? 'Información de Entrega' : 'Delivery Information'}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">{language === 'es' ? 'Dirección' : 'Address'}</div>
                    <div className="font-medium">{mockShipmentRequest.deliveryAddress}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{language === 'es' ? 'Fecha' : 'Date'}</div>
                    <div className="font-medium">{formatDateDisplay(mockShipmentRequest.deliveryDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{language === 'es' ? 'Contacto' : 'Contact'}</div>
                    <div className="font-medium">{mockShipmentRequest.deliveryContact || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              {language === 'es' ? 'Información de Precio' : 'Pricing Information'}
            </h2>
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">{language === 'es' ? 'Costo Base' : 'Base Cost'}</div>
                  <div className="font-medium">{baseAmount.toLocaleString()} {currency}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{language === 'es' ? 'Tarifa de Servicio' : 'Service Fee'}</div>
                  <div className="font-medium">{marginAmount.toLocaleString()} {currency} ({marginPercent}%)</div>
                </div>
                <div className="md:col-span-2 pt-2 mt-2 border-t border-blue-200">
                  <div className="text-sm font-medium text-blue-700">{language === 'es' ? 'Monto Total' : 'Total Amount'}</div>
                  <div className="text-xl font-bold text-blue-800">{totalAmount.toLocaleString()} {currency}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Render waiting for client response
  const renderWaitingResponse = () => {
    return (
      <Card className="mb-8">
        <CardContent className="p-6 text-center">
          <div className="bg-yellow-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold text-yellow-800 mb-3">
              {language === 'es' ? 'Esperando Respuesta del Cliente' : 'Waiting for Client Response'}
            </h2>
            <p className="text-yellow-700 mb-4">
              {language === 'es' 
                ? 'La propuesta ha sido enviada al cliente. Actualice esta página cuando reciba una respuesta.' 
                : 'The proposal has been sent to the client. Update this page when you receive a response.'}
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => handleClientResponse(true)}
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                <CheckIcon className="mr-2 h-4 w-4" />
                {language === 'es' ? 'Cliente Aceptó' : 'Client Accepted'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleClientResponse(false)}
                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              >
                <XIcon className="mr-2 h-4 w-4" />
                {language === 'es' ? 'Cliente Rechazó' : 'Client Rejected'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Render client response received
  const renderResponseReceived = () => {
    return (
      <Card className="mb-8">
        <CardContent className="p-6 text-center">
          {clientResponded ? (
            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <CheckIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-green-800 mb-3">
                {language === 'es' ? '¡Propuesta Aceptada!' : 'Proposal Accepted!'}
              </h2>
              <p className="text-green-700 mb-4">
                {language === 'es' 
                  ? 'El cliente ha aceptado la propuesta. Ahora puede generar la carta de instrucciones para el proveedor.'
                  : 'The client has accepted the proposal. You can now generate the instruction letter for the provider.'}
              </p>
              <Button 
                onClick={() => setLocation(`/instruction-letter/${id}`)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {language === 'es' ? 'Ir a Carta de Instrucciones' : 'Go to Instruction Letter'}
              </Button>
            </div>
          ) : (
            <div className="bg-red-50 p-6 rounded-lg mb-6">
              <XIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-800 mb-3">
                {language === 'es' ? 'Propuesta Rechazada' : 'Proposal Rejected'}
              </h2>
              <p className="text-red-700 mb-4">
                {language === 'es' 
                  ? 'El cliente ha rechazado la propuesta. Por favor, seleccione otro proveedor o modifique los términos.'
                  : 'The client has rejected the proposal. Please select another provider or modify the terms.'}
              </p>
              <Button 
                onClick={() => setLocation(`/review-bids/${id}`)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {language === 'es' ? 'Volver a Selección de Proveedores' : 'Back to Provider Selection'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        showBackButton
        backUrl={step === 'addMargin' ? `/review-bids/${id}` : '#'}
        backText={language === 'es' ? 'Volver a Cotizaciones' : 'Back to Quotes'}
      />
      
      <div className="flex-1 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {language === 'es' ? 'Propuesta para Cliente' : 'Client Proposal'}
          </h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {step === 'addMargin' && renderMarginStep()}
              {step === 'preview' && renderProposalPreview()}
              {step === 'waitingResponse' && renderWaitingResponse()}
              {step === 'responseReceived' && renderResponseReceived()}
              
              {step === 'preview' && (
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                  >
                    {language === 'es' ? 'Volver a Editar Margen' : 'Back to Edit Margin'}
                  </Button>
                  <div className="space-x-3">
                    <Button
                      onClick={handleGeneratePDF}
                      disabled={isGenerating}
                      className="bg-primary"
                    >
                      <FileIcon className="mr-2 h-4 w-4" />
                      {isGenerating 
                        ? (language === 'es' ? 'Generando...' : 'Generating...') 
                        : (language === 'es' ? 'Generar Propuesta PDF' : 'Generate Proposal PDF')}
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 'waitingResponse' && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  {language === 'es' ? 'Volver a Vista Previa' : 'Back to Preview'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}