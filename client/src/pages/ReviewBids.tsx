import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import { 
  ShipmentRequest, 
  Provider, 
  Bid, 
  BidStatus,
  VehicleType,
  ServiceArea,
  CertificationType,
  ProviderStatus
} from '@shared/schema';

// Extended provider type for mock data which includes additional properties not in the schema
interface ExtendedProvider extends Provider {
  contactPerson?: string;
  email?: string;
  phone?: string;
  insuranceProvider?: string;
  yearsInBusiness?: number;
  fleetSize?: number;
}
import { Button } from '@/components/ui/button';
import { 
  CheckIcon, 
  XIcon, 
  MessageCircle, 
  ThumbsUp, 
  Send, 
  DollarSign, 
  Clock, 
  Truck, 
  Calendar, 
  BarChart4, 
  AlertTriangle,
  Clipboard 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { apiRequest, queryClient } from '@/lib/queryClient';
import useLanguageStore from '@/hooks/useLanguage';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ReviewBids() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { language } = useLanguageStore();
  const [selectedBidId, setSelectedBidId] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<{ [key: number]: boolean }>({});
  
  // Fetch shipment request details
  const { data: shipmentRequest, isLoading: loadingRequest } = useQuery<ShipmentRequest>({
    queryKey: [`/api/shipment-requests/${id}`],
  });

  // Estado local para bids (necesario para manejar actualizaciones manuales)
  const [localBids, setLocalBids] = useState<Bid[]>([]);
  
  // Fetch bids for this request
  const { data: bids, isLoading: loadingBids } = useQuery<Bid[]>({
    queryKey: [`/api/shipment-requests/${id}/bids`],
    // Simulating this endpoint which doesn't exist yet
    queryFn: async () => {
      try {
        // For demo purposes always return dummy data
        const isDemoMode = true; // We'll always show demo data for now
        if (isDemoMode) {
          console.log("Demo mode - returning example bids");
          const dummyBids = generateDummyBids();
          setLocalBids(dummyBids);
          return dummyBids;
        }
        
        const response = await apiRequest('GET', `/api/bids?shipmentRequestId=${id}`);
        const bidsData = await response.json();
        
        // If no real bids exist, use demo data in any case
        if (!bidsData || bidsData.length === 0) {
          console.log("No bids found, using example data");
          return generateDummyBids();
        }
        
        return bidsData;
      } catch (error) {
        console.error('Error fetching bids:', error);
        // Return dummy data for demo
        return generateDummyBids();
      }
    }
  });

  // Fetch provider details for each bid
  const { data: providers, isLoading: loadingProviders } = useQuery<ExtendedProvider[]>({
    queryKey: ['/api/providers'],
    enabled: !!bids && bids.length > 0,
    // For demo purposes, provide example providers if the API is empty
    initialData: [
      {
        id: 1,
        userId: 1,
        companyName: 'Transportes Fast',
        rfc: 'TFA123456789',
        contactPerson: 'Carlos Rodriguez',
        email: 'carlos@transportesfast.com',
        phone: '+52 555 1234 567',
        serviceAreas: [ServiceArea.NORTH, ServiceArea.CENTRAL],
        vehicleTypes: [VehicleType.DRY_VAN, VehicleType.REFRIGERATED],
        certifications: [CertificationType.ISO9001, CertificationType.CTPAT],
        insuranceProvider: 'Seguros GNP',
        yearsInBusiness: 12,
        fleetSize: 45,
        score: 4.7,
        status: ProviderStatus.APPROVED,
        createdAt: new Date()
      },
      {
        id: 2,
        userId: 2,
        companyName: 'EcoTransport',
        rfc: 'ECO987654321',
        contactPerson: 'Ana Martinez',
        email: 'ana@ecotransport.mx',
        phone: '+52 555 9876 543',
        serviceAreas: [ServiceArea.NATIONWIDE],
        vehicleTypes: [VehicleType.CONTAINER, VehicleType.FLATBED],
        certifications: [CertificationType.ISO14001],
        insuranceProvider: 'Qualitas Seguros',
        yearsInBusiness: 8,
        fleetSize: 28,
        score: 4.2,
        status: ProviderStatus.APPROVED,
        createdAt: new Date()
      },
      {
        id: 3,
        userId: 3,
        companyName: 'LogiMex Premium',
        rfc: 'LMP555666777',
        contactPerson: 'Roberto Gomez',
        email: 'roberto@logimex.com.mx',
        phone: '+52 555 4444 333',
        serviceAreas: [ServiceArea.CENTRAL, ServiceArea.SOUTH],
        vehicleTypes: [VehicleType.TANKER, VehicleType.DRY_VAN],
        certifications: [CertificationType.OEA, CertificationType.ISO9001],
        insuranceProvider: 'AXA Seguros',
        yearsInBusiness: 15,
        fleetSize: 60,
        score: 4.9,
        status: ProviderStatus.APPROVED,
        createdAt: new Date()
      },
      {
        id: 4,
        userId: 4,
        companyName: 'Transportadora Mexicana',
        rfc: 'TME888999000',
        contactPerson: 'Gabriela Sanchez',
        email: 'gabi@transmex.mx',
        phone: '+52 555 2222 111',
        serviceAreas: [ServiceArea.EAST, ServiceArea.WEST],
        vehicleTypes: [VehicleType.FLATBED, VehicleType.CONTAINER],
        certifications: [CertificationType.CTPAT],
        insuranceProvider: 'Mapfre',
        yearsInBusiness: 10,
        fleetSize: 35,
        score: 4.3,
        status: ProviderStatus.APPROVED,
        createdAt: new Date()
      },
      {
        id: 5,
        userId: 5,
        companyName: 'Fletes Rápidos',
        rfc: 'FRA111222333',
        contactPerson: 'Javier Ortiz',
        email: 'javier@fletesrapidos.com',
        phone: '+52 555 6666 777',
        serviceAreas: [ServiceArea.NORTH, ServiceArea.EAST],
        vehicleTypes: [VehicleType.DRY_VAN, VehicleType.CONTAINER],
        certifications: [CertificationType.ISO9001],
        insuranceProvider: 'HDI Seguros',
        yearsInBusiness: 6,
        fleetSize: 22,
        score: 3.8,
        status: ProviderStatus.APPROVED,
        createdAt: new Date()
      }
    ]
  });

  // Accept bid mutation
  const acceptBidMutation = useMutation({
    mutationFn: async (bidId: number) => {
      // In a real implementation, you would call an API endpoint
      try {
        const response = await apiRequest('PATCH', `/api/bids/${bidId}/status`, { 
          status: BidStatus.ACCEPTED 
        });
        return await response.json();
      } catch (error) {
        console.error('Error accepting bid:', error);
        // Simulate success for demo
        return { success: true, bidId };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/shipment-requests/${id}/bids`] });
      queryClient.invalidateQueries({ queryKey: [`/api/bids`] });
      
      toast({
        title: language === 'es' ? 'Oferta aceptada' : 'Bid Accepted',
        description: language === 'es' 
          ? 'Has aceptado la oferta seleccionada' 
          : 'You have accepted the selected bid',
      });
    }
  });

  // Reject bid mutation
  const rejectBidMutation = useMutation({
    mutationFn: async (bidId: number) => {
      try {
        const response = await apiRequest('PATCH', `/api/bids/${bidId}/status`, { 
          status: BidStatus.REJECTED 
        });
        return await response.json();
      } catch (error) {
        console.error('Error rejecting bid:', error);
        // Simulate success for demo
        return { success: true, bidId };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/shipment-requests/${id}/bids`] });
      queryClient.invalidateQueries({ queryKey: [`/api/bids`] });
      
      toast({
        title: language === 'es' ? 'Oferta rechazada' : 'Bid Rejected',
        description: language === 'es' 
          ? 'Has rechazado la oferta seleccionada' 
          : 'You have rejected the selected bid',
      });
    }
  });

  // Handle selection of a bid
  const handleSelectBid = (bidId: number) => {
    setSelectedBidId(bidId === selectedBidId ? null : bidId);
  };

  // Accept the selected bid
  const handleAcceptBid = () => {
    if (!selectedBidId) {
      toast({
        title: language === 'es' ? 'No hay oferta seleccionada' : 'No Bid Selected',
        description: language === 'es' 
          ? 'Por favor selecciona una oferta para aceptar' 
          : 'Please select a bid to accept',
        variant: 'destructive',
      });
      return;
    }

    // Simulación local para modo demo (actualizar estado local)
    if (localBids.length > 0) {
      const updatedBids = localBids.map(bid => {
        if (bid.id === selectedBidId) {
          return { ...bid, status: BidStatus.ACCEPTED };
        }
        return bid;
      });
      
      setLocalBids(updatedBids);
      
      // Usamos el valor actualizado en lugar de bids
      queryClient.setQueryData([`/api/shipment-requests/${id}/bids`], updatedBids);
      
      toast({
        title: language === 'es' ? 'Oferta aceptada' : 'Bid Accepted',
        description: language === 'es' 
          ? 'Has aceptado la oferta seleccionada' 
          : 'You have accepted the selected bid',
      });
      
      setSelectedBidId(null);
    } else {
      // Si no estamos en modo demo o no hay bids locales, utilizamos la mutación
      acceptBidMutation.mutate(selectedBidId);
    }
  };
  
  // States for managing UI
  const [marginPercentage, setMarginPercentage] = useState<number>(15);
  const [showMarginModal, setShowMarginModal] = useState<boolean>(false);
  const [selectedAcceptedBid, setSelectedAcceptedBid] = useState<number | null>(null);
  const [showClientApprovalModal, setShowClientApprovalModal] = useState<boolean>(false);
  
  // Cancel bid confirmation mutation
  const cancelBidMutation = useMutation({
    mutationFn: async (bidId: number) => {
      try {
        const response = await apiRequest('PATCH', `/api/bids/${bidId}/status`, { 
          status: BidStatus.PENDING
        });
        return await response.json();
      } catch (error) {
        console.error('Error cancelling approved bid:', error);
        // Simulate success for demo
        return { success: true, bidId };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/shipment-requests/${id}/bids`] });
      queryClient.invalidateQueries({ queryKey: [`/api/bids`] });
      
      toast({
        title: language === 'es' ? 'Aprobación cancelada' : 'Approval Cancelled',
        description: language === 'es' 
          ? 'La oferta ha vuelto a estado pendiente' 
          : 'The quote has been returned to pending status',
      });
    }
  });
  
  // Handle cancellation of an approved bid
  const handleCancelApprovedBid = (bidId: number) => {
    // Simulación local para modo demo (actualizar estado local)
    if (localBids.length > 0) {
      const updatedBids = localBids.map(bid => {
        if (bid.id === bidId) {
          return { ...bid, status: BidStatus.PENDING };
        }
        return bid;
      });
      
      setLocalBids(updatedBids);
      
      // Usamos el valor actualizado en lugar de bids
      queryClient.setQueryData([`/api/shipment-requests/${id}/bids`], updatedBids);
      
      toast({
        title: language === 'es' ? 'Aprobación cancelada' : 'Approval Cancelled',
        description: language === 'es' 
          ? 'La oferta ha vuelto a estado pendiente' 
          : 'The quote has been returned to pending status',
      });
    } else {
      // Si no estamos en modo demo o no hay bids locales, utilizamos la mutación
      cancelBidMutation.mutate(bidId);
    }
  };
  
  // Calculate price with margin
  const calculatePriceWithMargin = (basePrice: number, marginPercent: number): number => {
    return basePrice * (1 + marginPercent / 100);
  };

  // Reject a specific bid
  const handleRejectBid = (bidId: number) => {
    rejectBidMutation.mutate(bidId);
  };

  // Send feedback to a provider
  const handleSendFeedback = (bidId: number, providerId: number) => {
    // In a real implementation, you would navigate to a feedback form
    // For this demo, we'll just simulate sending feedback
    setFeedbackSent(prev => ({ ...prev, [bidId]: true }));
    
    toast({
      title: language === 'es' ? 'Retroalimentación enviada' : 'Feedback Sent',
      description: language === 'es' 
        ? 'Has enviado retroalimentación al proveedor' 
        : 'You have sent feedback to the provider',
    });
  };

  // Navigate to dashboard
  const handleBackToDashboard = () => {
    setLocation('/agent-dashboard');
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

  // Get provider details for a bid
  const getProviderForBid = (bid: Bid): ExtendedProvider | undefined => {
    if (!providers) return undefined;
    return providers.find((p) => p.id === bid.providerId);
  };

  // Get status badge color
  const getStatusBadgeColor = (status: BidStatus) => {
    switch(status) {
      case BidStatus.ACCEPTED:
        return 'bg-green-100 text-green-800 border-green-200';
      case BidStatus.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Determine if a bid is selectable (only pending bids can be selected)
  const isBidSelectable = (bid: Bid) => {
    return bid.status === BidStatus.PENDING;
  };

  // For demo purposes only: generate dummy bids if the API doesn't exist yet
  const generateDummyBids = () => {
    return [
      {
        id: 1,
        shipmentRequestId: Number(id),
        providerId: 1, // Transportes Fast
        price: 2500,
        currency: 'USD',
        transitTime: 3,
        transitTimeUnit: 'days',
        availability: 'Confirmed - Available as requested',
        notes: 'Podemos manejar este envío con nuestra flota estándar. Contamos con seguro incluido y rastreo en tiempo real.',
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: BidStatus.PENDING,
        createdAt: new Date()
      },
      {
        id: 2,
        shipmentRequestId: Number(id),
        providerId: 2, // EcoTransport
        price: 2350,
        currency: 'USD',
        transitTime: 4,
        transitTimeUnit: 'days',
        availability: 'Partial - Available with adjustments',
        notes: 'Ofrecemos la tarifa más competitiva pero necesitamos un día adicional para la entrega. Incluye 2 horas de tiempo de espera sin cargo.',
        validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: BidStatus.PENDING,
        createdAt: new Date()
      },
      {
        id: 3,
        shipmentRequestId: Number(id),
        providerId: 3, // Mex Logistics
        price: 2800,
        currency: 'USD',
        transitTime: 2,
        transitTimeUnit: 'days',
        availability: 'Confirmed - Available as requested',
        notes: 'Servicio premium con entrega express y seguimiento en tiempo real. Incluye seguro de carga por valor completo.',
        validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: BidStatus.PENDING, // Cambiado a PENDING
        createdAt: new Date()
      },
      {
        id: 4,
        shipmentRequestId: Number(id),
        providerId: 4, // Transportes Azteca
        price: 2650,
        currency: 'USD',
        transitTime: 3,
        transitTimeUnit: 'days',
        availability: 'Confirmed - Available as requested',
        notes: 'Transporte con certificación OEA y equipo especializado para manejo seguro de la carga.',
        validUntil: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        status: BidStatus.PENDING, // Cambiado a PENDING
        createdAt: new Date()
      },
      {
        id: 5,
        shipmentRequestId: Number(id),
        providerId: 5, // LogisMex Express
        price: 2900,
        currency: 'USD',
        transitTime: 2,
        transitTimeUnit: 'days',
        availability: 'Confirmed - Available as requested',
        notes: 'Ofrecemos servicio premium con vehículos nuevos y conductores certificados. Garantía de entrega a tiempo.',
        validUntil: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // Ya no vencido
        status: BidStatus.PENDING,
        createdAt: new Date()
      }
    ];
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  // Check if a bid has expired
  const isBidExpired = (bid: Bid) => {
    return bid.validUntil && new Date(bid.validUntil) < new Date();
  };

  const sortedBids = bids ? [...bids].sort((a, b) => a.price - b.price) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton backUrl="/agent-dashboard" />
      
      <div className="flex-1 bg-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Card className="mb-6 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    {language === 'es' ? 'Revisar Cotizaciones' : 'Review Quotes'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'es' 
                      ? 'Selecciona la mejor oferta para tu solicitud de envío' 
                      : 'Select the best quote for your shipment request'}
                  </CardDescription>
                </div>
                {loadingRequest ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
                ) : (
                  <div className="bg-blue-100 text-blue-800 rounded-md px-3 py-1">
                    Request ID: {shipmentRequest?.requestId}
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {loadingBids || loadingProviders ? (
                <div className="text-center p-8">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-opacity-25 border-t-primary rounded-full mb-4"></div>
                  <p className="text-gray-600">
                    {language === 'es' 
                      ? 'Cargando cotizaciones...' 
                      : 'Loading quotes...'}
                  </p>
                </div>
              ) : sortedBids.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>{language === 'es' ? 'Proveedor' : 'Provider'}</TableHead>
                        <TableHead>{language === 'es' ? 'Precio' : 'Price'}</TableHead>
                        <TableHead>{language === 'es' ? 'Tiempo de Tránsito' : 'Transit Time'}</TableHead>
                        <TableHead>{language === 'es' ? 'Disponibilidad' : 'Availability'}</TableHead>
                        <TableHead>{language === 'es' ? 'Válido Hasta' : 'Valid Until'}</TableHead>
                        <TableHead>{language === 'es' ? 'Estado' : 'Status'}</TableHead>
                        <TableHead className="text-right">{language === 'es' ? 'Acciones' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedBids.map((bid) => {
                        const provider = getProviderForBid(bid);
                        const isExpired = isBidExpired(bid);
                        const isSelectable = isBidSelectable(bid) && !isExpired;
                        
                        return (
                          <TableRow 
                            key={bid.id} 
                            className={`${bid.status === BidStatus.ACCEPTED ? 'bg-green-50' : ''} 
                                       ${selectedBidId === bid.id ? 'bg-blue-50' : ''}`}
                          >
                            <TableCell className="align-middle">
                              {isSelectable && (
                                <Checkbox 
                                  checked={selectedBidId === bid.id}
                                  onCheckedChange={() => handleSelectBid(bid.id)}
                                  className="ml-1"
                                />
                              )}
                              {bid.status === BidStatus.ACCEPTED && (
                                <ThumbsUp className="text-green-600 h-5 w-5 ml-1" />
                              )}
                              {bid.status === BidStatus.REJECTED && (
                                <XIcon className="text-red-600 h-5 w-5 ml-1" />
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className={`h-8 w-8 ${
                                  provider?.companyName === 'Transportes Fast' ? 'bg-blue-600' : 
                                  provider?.companyName === 'EcoTransport' ? 'bg-green-600' : 
                                  provider?.companyName === 'Mex Logistics' ? 'bg-purple-600' :
                                  provider?.companyName === 'Transportes Azteca' ? 'bg-red-600' :
                                  provider?.companyName === 'LogisMex Express' ? 'bg-amber-600' :
                                  'bg-slate-600'
                                } text-white`}>
                                  <AvatarFallback>{provider ? getInitials(provider.companyName) : 'N/A'}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{provider?.companyName || 'Unknown Provider'}</div>
                                  <div className="text-xs text-gray-500">
                                    {provider?.vehicleTypes?.slice(0, 2).join(', ') || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-primary">
                                {formatCurrency(bid.price, bid.currency)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm">
                                <Clock className="h-3 w-3 mr-1 text-gray-500" />
                                {bid.transitTime} {bid.transitTimeUnit}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {bid.availability}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                                <span className={`text-sm ${isExpired ? 'text-red-600 font-medium' : ''}`}>
                                  {bid.validUntil ? formatDate(bid.validUntil) : 'N/A'}
                                  {isExpired && (
                                    <span className="ml-1">
                                      <AlertTriangle className="h-3 w-3 inline text-red-500" />
                                    </span>
                                  )}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusBadgeColor(bid.status)} text-xs font-medium`}>
                                {bid.status === BidStatus.PENDING && (language === 'es' ? 'Pendiente' : 'Pending')}
                                {bid.status === BidStatus.ACCEPTED && (language === 'es' ? 'Aceptada' : 'Accepted')}
                                {bid.status === BidStatus.REJECTED && (language === 'es' ? 'Rechazada' : 'Rejected')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                              {bid.status === BidStatus.PENDING && !isExpired && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-green-600 mr-1"
                                    onClick={() => {
                                      handleSelectBid(bid.id);
                                      handleAcceptBid();
                                    }}
                                    title={language === 'es' ? 'Aceptar oferta' : 'Accept bid'}
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600"
                                    onClick={() => handleRejectBid(bid.id)}
                                    title={language === 'es' ? 'Rechazar oferta' : 'Reject bid'}
                                  >
                                    <XIcon className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              {bid.status !== BidStatus.PENDING && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`h-8 p-0 text-xs ${feedbackSent[bid.id] ? 'text-gray-400' : 'text-blue-600'}`}
                                  onClick={() => handleSendFeedback(bid.id, bid.providerId)}
                                  disabled={feedbackSent[bid.id]}
                                >
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  {feedbackSent[bid.id] 
                                    ? (language === 'es' ? 'Enviado' : 'Sent') 
                                    : (language === 'es' ? 'Feedback' : 'Feedback')}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  
                  {sortedBids.length > 0 && sortedBids.some(bid => bid.status === BidStatus.PENDING) && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={handleAcceptBid}
                        disabled={!selectedBidId}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckIcon className="mr-2 h-4 w-4" />
                        {language === 'es' ? 'Aceptar Oferta Seleccionada' : 'Accept Selected Quote'}
                      </Button>
                    </div>
                  )}
                  
                  {/* Accepted Quotes Section */}
                  {(localBids.length > 0 ? localBids : sortedBids).some(bid => bid.status === BidStatus.ACCEPTED) && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">
                          {language === 'es' ? 'Cotizaciones Aprobadas' : 'Approved Quotes'}
                        </h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {language === 'es' ? 'Listas para Propuesta' : 'Ready for Proposal'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        {(localBids.length > 0 ? localBids : sortedBids).filter(bid => bid.status === BidStatus.ACCEPTED).map((bid) => {
                          const provider = getProviderForBid(bid);
                          const priceWithMargin = calculatePriceWithMargin(bid.price, marginPercentage);
                          
                          return (
                            <Card key={bid.id} className="border-green-200 shadow-sm">
                              <CardContent className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                                      {language === 'es' ? 'Proveedor' : 'Provider'}
                                    </h4>
                                    <div className="flex items-center">
                                      <Avatar className={`h-10 w-10 ${
                                        provider?.companyName === 'Transportes Fast' ? 'bg-blue-600' : 
                                        provider?.companyName === 'EcoTransport' ? 'bg-green-600' : 
                                        provider?.companyName === 'Mex Logistics' ? 'bg-purple-600' :
                                        provider?.companyName === 'Transportes Azteca' ? 'bg-red-600' :
                                        provider?.companyName === 'LogisMex Express' ? 'bg-amber-600' :
                                        'bg-slate-600'
                                      } text-white mr-3`}>
                                        <AvatarFallback>{provider ? getInitials(provider.companyName) : 'N/A'}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">{provider?.companyName || 'Unknown Provider'}</div>
                                        <div className="text-xs text-gray-500">
                                          {provider?.certifications?.join(', ') || 'No certifications'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                                      {language === 'es' ? 'Detalles del Servicio' : 'Service Details'}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <div className="text-xs text-gray-500">
                                          {language === 'es' ? 'Tiempo de Tránsito' : 'Transit Time'}
                                        </div>
                                        <div className="flex items-center">
                                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                          <span className="font-medium">{bid.transitTime} {bid.transitTimeUnit}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-gray-500">
                                          {language === 'es' ? 'Disponibilidad' : 'Availability'}
                                        </div>
                                        <Badge variant="outline" className="mt-1 text-xs">
                                          {bid.availability}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                                      {language === 'es' ? 'Información de Precio' : 'Pricing Information'}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <div className="text-xs text-gray-500">
                                          {language === 'es' ? 'Precio de Proveedor' : 'Provider Price'}
                                        </div>
                                        <div className="text-lg font-semibold text-primary">
                                          {formatCurrency(bid.price, bid.currency)}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-gray-500">
                                          {language === 'es' ? 'Precio Final (con margen)' : 'Final Price (with margin)'}
                                        </div>
                                        <div className="text-lg font-semibold text-green-600">
                                          {formatCurrency(priceWithMargin, bid.currency)}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          {language === 'es' ? `Margen: ${marginPercentage}%` : `Margin: ${marginPercentage}%`}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="col-span-1 md:col-span-3 border-t pt-3 mt-2">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {language === 'es' ? 'Aprobado el ' : 'Approved on '} 
                                        {formatDate(new Date())}
                                      </div>
                                      <div className="flex space-x-2">
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setSelectedAcceptedBid(bid.id);
                                            setShowMarginModal(true);
                                          }}
                                          className="text-xs"
                                        >
                                          <DollarSign className="h-4 w-4 mr-1" />
                                          {language === 'es' ? 'Ajustar Margen' : 'Adjust Margin'}
                                        </Button>
                                        <Button
                                          onClick={() => setLocation(`/client-proposal/${id}`)} 
                                          className="bg-primary text-white text-xs"
                                        >
                                          <Send className="h-4 w-4 mr-1" />
                                          {language === 'es' ? 'Generar Propuesta' : 'Generate Proposal'}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setSelectedAcceptedBid(bid.id);
                                            setShowClientApprovalModal(true);
                                          }}
                                          className="bg-green-600 text-white text-xs hover:bg-green-700"
                                        >
                                          <CheckIcon className="h-4 w-4 mr-1" />
                                          {language === 'es' ? '¿Cliente Aprobó?' : 'Client Approved?'}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => handleCancelApprovedBid(bid.id)}
                                          className="bg-gray-100 text-gray-700 text-xs hover:bg-gray-200"
                                        >
                                          <XIcon className="h-4 w-4 mr-1" />
                                          {language === 'es' ? 'Cancelar Aprobación' : 'Cancel Approval'}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="bg-gray-100 rounded-full p-3 inline-block mb-4">
                    <Clipboard className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    {language === 'es' ? 'No hay cotizaciones todavía' : 'No quotes yet'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'es' 
                      ? 'Los proveedores aún no han enviado cotizaciones para esta solicitud.' 
                      : 'Providers have not submitted quotes for this request yet.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Request details summary */}
          {shipmentRequest && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {language === 'es' ? 'Detalles de la Solicitud' : 'Request Details'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-primary" />
                      {language === 'es' ? 'Información de Carga' : 'Cargo Information'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">{language === 'es' ? 'Tipo de Carga' : 'Cargo Type'}</p>
                        <p className="font-medium">{shipmentRequest.cargoType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{language === 'es' ? 'Peso' : 'Weight'}</p>
                        <p className="font-medium">{shipmentRequest.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{language === 'es' ? 'Tipo de Vehículo' : 'Vehicle Type'}</p>
                        <p className="font-medium">{shipmentRequest.vehicleType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{language === 'es' ? 'Empaque' : 'Packaging'}</p>
                        <p className="font-medium">{shipmentRequest.packagingType}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      {language === 'es' ? 'Fechas y Lugares' : 'Dates & Locations'}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">{language === 'es' ? 'Recogida' : 'Pickup'}</p>
                        <p className="font-medium">{shipmentRequest.pickupAddress}</p>
                        <p className="text-xs text-gray-600">{formatDate(shipmentRequest.pickupDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{language === 'es' ? 'Entrega' : 'Delivery'}</p>
                        <p className="font-medium">{shipmentRequest.deliveryAddress}</p>
                        <p className="text-xs text-gray-600">{formatDate(shipmentRequest.deliveryDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
            >
              {language === 'es' ? 'Volver al Panel' : 'Back to Dashboard'}
            </Button>
            
            {((localBids.length > 0 ? localBids : sortedBids) && (localBids.length > 0 ? localBids : sortedBids).some(bid => bid.status === BidStatus.ACCEPTED)) && (
              <Button
                className="bg-primary text-white"
                onClick={() => setLocation(`/client-proposal/${id}`)}
              >
                <Send className="mr-2 h-4 w-4" />
                {language === 'es' ? 'Generar Propuesta para Cliente' : 'Generate Client Proposal'}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Margin Adjustment Modal */}
      {showMarginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {language === 'es' ? 'Ajustar Margen' : 'Adjust Margin'}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-3">
                {language === 'es' 
                  ? 'Especifica el porcentaje de margen que quieres añadir al precio del proveedor para la propuesta final al cliente.' 
                  : 'Specify the margin percentage you want to add to the provider price for the final client proposal.'}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">5%</span>
                  <span className="text-sm font-medium">25%</span>
                  <span className="text-sm font-medium">50%</span>
                </div>
                
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={marginPercentage}
                  onChange={(e) => setMarginPercentage(parseInt(e.target.value))}
                  className="w-full"
                />
                
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'es' ? 'Porcentaje de Margen' : 'Margin Percentage'}
                  </label>
                  <div className="flex items-center w-20 h-9 rounded-md border border-input bg-transparent pl-3 pr-2 text-sm">
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={marginPercentage}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 5 && value <= 50) {
                          setMarginPercentage(value);
                        }
                      }}
                      className="border-0 p-0 w-full focus:outline-none focus:ring-0"
                    />
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
              </div>
              
              {/* Preview calculation */}
              {selectedAcceptedBid && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {language === 'es' ? 'Vista Previa' : 'Preview'}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {(() => {
                      const selectedBid = bids?.find(b => b.id === selectedAcceptedBid);
                      if (!selectedBid) return null;
                      
                      const originalPrice = selectedBid.price;
                      const finalPrice = calculatePriceWithMargin(originalPrice, marginPercentage);
                      const marginAmount = finalPrice - originalPrice;
                      
                      return (
                        <>
                          <div>
                            <span className="text-gray-500">{language === 'es' ? 'Precio Original' : 'Original Price'}</span>
                            <div className="font-medium">{formatCurrency(originalPrice, selectedBid.currency)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">{language === 'es' ? 'Precio Final' : 'Final Price'}</span>
                            <div className="font-medium text-green-600">{formatCurrency(finalPrice, selectedBid.currency)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">{language === 'es' ? 'Monto del Margen' : 'Margin Amount'}</span>
                            <div className="font-medium text-primary">{formatCurrency(marginAmount, selectedBid.currency)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">{language === 'es' ? 'Porcentaje' : 'Percentage'}</span>
                            <div className="font-medium">{marginPercentage}%</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-3 border-t">
              <Button
                variant="outline"
                onClick={() => setShowMarginModal(false)}
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </Button>
              <Button
                onClick={() => {
                  // In a real implementation, we would save this margin to the database
                  toast({
                    title: language === 'es' ? 'Margen actualizado' : 'Margin updated',
                    description: language === 'es' 
                      ? `El margen se ha establecido en ${marginPercentage}%` 
                      : `Margin has been set to ${marginPercentage}%`,
                  });
                  setShowMarginModal(false);
                }}
                className="bg-primary text-white"
              >
                {language === 'es' ? 'Aplicar Margen' : 'Apply Margin'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Client Approval Modal */}
      {showClientApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {language === 'es' ? '¿El cliente aprobó la propuesta?' : 'Did the client approve the proposal?'}
            </h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">
                {language === 'es' 
                  ? 'Confirme si el cliente ha aprobado la propuesta. Una vez aprobada, se asignará el proveedor seleccionado y se generará la carta de instrucción.' 
                  : 'Confirm if the client has approved the proposal. Once approved, the selected provider will be assigned and an instruction letter will be generated.'}
              </p>
              
              {selectedAcceptedBid && (() => {
                const selectedBid = bids?.find(b => b.id === selectedAcceptedBid);
                const provider = selectedBid ? getProviderForBid(selectedBid) : null;
                
                if (!selectedBid || !provider) return null;
                
                return (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3 mb-2">
                      <Avatar className={`h-10 w-10 bg-green-600 text-white`}>
                        <AvatarFallback>{getInitials(provider.companyName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{provider.companyName}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(selectedBid.price, selectedBid.currency)}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            
            <div className="flex justify-center space-x-3 pt-3 border-t">
              <Button
                variant="outline"
                onClick={() => setShowClientApprovalModal(false)}
                className="border-gray-300"
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </Button>
              <Button
                onClick={() => {
                  // In a real implementation, we would update the request status to "Assigned"
                  // and generate the instruction letter
                  if (!id || !selectedAcceptedBid) return;
                  
                  // Update request status to "ASSIGNED"
                  apiRequest('PATCH', `/api/shipment-requests/${id}/status`, {
                    status: "Assigned"
                  })
                  .then(() => {
                    queryClient.invalidateQueries({ queryKey: [`/api/shipment-requests/${id}`] });
                    queryClient.invalidateQueries({ queryKey: ['/api/shipment-requests'] });
                    
                    toast({
                      title: language === 'es' ? '¡Propuesta aprobada!' : 'Proposal approved!',
                      description: language === 'es' 
                        ? 'La solicitud ha sido asignada al proveedor seleccionado.' 
                        : 'The request has been assigned to the selected provider.',
                    });
                    
                    // Navigate to the instruction letter page
                    setTimeout(() => {
                      setLocation(`/instruction-letter/${id}`);
                    }, 1000);
                  })
                  .catch(error => {
                    console.error('Error updating request status:', error);
                    toast({
                      title: language === 'es' ? 'Error' : 'Error',
                      description: language === 'es' 
                        ? 'No se pudo actualizar el estado de la solicitud.' 
                        : 'Failed to update the request status.',
                      variant: 'destructive'
                    });
                  })
                  .finally(() => {
                    setShowClientApprovalModal(false);
                  });
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Confirmar Aprobación' : 'Confirm Approval'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowClientApprovalModal(false);
                  toast({
                    title: language === 'es' ? 'Propuesta no aprobada' : 'Proposal not approved',
                    description: language === 'es' 
                      ? 'Se ha registrado que el cliente no aprobó la propuesta.' 
                      : 'It has been recorded that the client did not approve the proposal.',
                  });
                }}
                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              >
                <XIcon className="h-4 w-4 mr-2" />
                {language === 'es' ? 'No Aprobó' : 'Not Approved'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}