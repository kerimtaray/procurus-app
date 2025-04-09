import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bid, BidStatus, ShipmentRequest, ShipmentRequestStatus } from '@shared/schema';
import { formatDate } from '@/lib/utils';
import useUserStore from '@/hooks/useUserRole';
import useLanguage from '@/hooks/useLanguage';
import { 
  TruckIcon, ClipboardIcon, ListChecksIcon, PhoneIcon, MessageSquareIcon, 
  AlertCircleIcon, CheckIcon, XIcon, PackageIcon, Calendar, Clock, DollarSign, 
  MapPin, AlertTriangle, User, ExternalLinkIcon, CalendarIcon
} from 'lucide-react';

type JobWithDetails = {
  id: number;
  requestId: string;
  clientName: string;
  route: string;
  pickupDate: Date | string;
  deliveryDate: Date | string;
  status: ShipmentRequestStatus;
  bidStatus: BidStatus;
  bidPrice?: number;
  bidCurrency?: string;
  cargoType: string;
  weight: number;
  vehicleType: string;
  clientApproved: boolean;
  specialInstructions?: string;
  contactPerson?: string;
  contactPhone?: string;
};

export default function ProviderActiveJobs() {
  const [_, setLocation] = useLocation();
  const { username, companyName } = useUserStore();
  const { language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'pending'>('all');
  const [selectedJob, setSelectedJob] = useState<JobWithDetails | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  // Translations
  const t = {
    activeJobs: language === 'es' ? 'Trabajos Activos' : 'Active Jobs',
    allJobs: language === 'es' ? 'Todos los Trabajos' : 'All Jobs',
    activeShipments: language === 'es' ? 'Envíos Activos' : 'Active Shipments',
    pendingApproval: language === 'es' ? 'Pendientes de Aprobación' : 'Pending Approval',
    jobId: language === 'es' ? 'ID Trabajo' : 'Job ID',
    client: language === 'es' ? 'Cliente' : 'Client',
    route: language === 'es' ? 'Ruta' : 'Route',
    pickup: language === 'es' ? 'Recogida' : 'Pickup',
    delivery: language === 'es' ? 'Entrega' : 'Delivery',
    status: language === 'es' ? 'Estado' : 'Status',
    quoteStatus: language === 'es' ? 'Estado de Cotización' : 'Quote Status',
    actions: language === 'es' ? 'Acciones' : 'Actions',
    view: language === 'es' ? 'Ver' : 'View',
    contact: language === 'es' ? 'Contactar' : 'Contact',
    jobDetails: language === 'es' ? 'Detalles del Trabajo' : 'Job Details',
    clientInfo: language === 'es' ? 'Información del Cliente' : 'Client Information',
    cargoInfo: language === 'es' ? 'Información de Carga' : 'Cargo Information',
    routeInfo: language === 'es' ? 'Información de Ruta' : 'Route Information',
    paymentInfo: language === 'es' ? 'Información de Pago' : 'Payment Information',
    contactInfo: language === 'es' ? 'Información de Contacto' : 'Contact Information',
    specialInstructions: language === 'es' ? 'Instrucciones Especiales' : 'Special Instructions',
    cargoType: language === 'es' ? 'Tipo de Carga' : 'Cargo Type',
    weight: language === 'es' ? 'Peso' : 'Weight',
    vehicleType: language === 'es' ? 'Tipo de Vehículo' : 'Vehicle Type',
    origin: language === 'es' ? 'Origen' : 'Origin',
    destination: language === 'es' ? 'Destino' : 'Destination',
    contactPerson: language === 'es' ? 'Persona de Contacto' : 'Contact Person',
    price: language === 'es' ? 'Precio' : 'Price',
    acceptedBy: language === 'es' ? 'Aceptado por' : 'Accepted by',
    clientApproved: language === 'es' ? 'Aprobado por Cliente' : 'Client Approved',
    pending: language === 'es' ? 'Pendiente' : 'Pending',
    accepted: language === 'es' ? 'Aceptado' : 'Accepted',
    inTransit: language === 'es' ? 'En Tránsito' : 'In Transit',
    completed: language === 'es' ? 'Completado' : 'Completed',
    cancelled: language === 'es' ? 'Cancelado' : 'Cancelled',
    contactLogistics: language === 'es' ? 'Contactar a Logística' : 'Contact Logistics',
    contactByWhatsapp: language === 'es' ? 'Contactar por WhatsApp' : 'Contact via WhatsApp',
    contactByPhone: language === 'es' ? 'Contactar por Teléfono' : 'Contact via Phone',
    backToDashboard: language === 'es' ? 'Volver al Panel' : 'Back to Dashboard',
    viewInstructions: language === 'es' ? 'Ver Carta de Instrucciones' : 'View Instruction Letter',
  };
  
  // Mock data for active jobs - in a real app, this would come from an API
  const mockJobs: JobWithDetails[] = [
    {
      id: 1,
      requestId: 'SHP2025001',
      clientName: 'Global Imports Inc.',
      route: 'Mexico City → Monterrey',
      pickupDate: new Date('2025-04-15'),
      deliveryDate: new Date('2025-04-16'),
      status: ShipmentRequestStatus.IN_TRANSIT,
      bidStatus: BidStatus.ACCEPTED,
      bidPrice: 45000,
      bidCurrency: 'MXN',
      cargoType: 'General Merchandise',
      weight: 5000,
      vehicleType: 'Dry Van',
      clientApproved: true,
      specialInstructions: 'Handle with care. Delivery needs signature from warehouse manager.',
      contactPerson: 'Juan Pérez',
      contactPhone: '+52 55 1234 5678',
    },
    {
      id: 2,
      requestId: 'SHP2025002',
      clientName: 'Tech Innovations',
      route: 'Guadalajara → Mexico City',
      pickupDate: new Date('2025-04-18'),
      deliveryDate: new Date('2025-04-19'),
      status: ShipmentRequestStatus.PENDING,
      bidStatus: BidStatus.ACCEPTED,
      bidPrice: 38500,
      bidCurrency: 'MXN',
      cargoType: 'Electronics',
      weight: 3500,
      vehicleType: 'Refrigerated',
      clientApproved: false,
      contactPerson: 'María Rodríguez',
      contactPhone: '+52 33 8765 4321',
    },
    {
      id: 3,
      requestId: 'SHP2025003',
      clientName: 'MexTrade Corp',
      route: 'Cancún → Mérida',
      pickupDate: new Date('2025-04-20'),
      deliveryDate: new Date('2025-04-20'),
      status: ShipmentRequestStatus.ASSIGNED,
      bidStatus: BidStatus.PENDING,
      cargoType: 'Construction Materials',
      weight: 8000,
      vehicleType: 'Flatbed',
      clientApproved: false,
      contactPerson: 'Carlos Sánchez',
      contactPhone: '+52 99 1122 3344',
    },
    {
      id: 4,
      requestId: 'SHP2025004',
      clientName: 'Industrial Solutions',
      route: 'Monterrey → Saltillo',
      pickupDate: new Date('2025-04-22'),
      deliveryDate: new Date('2025-04-22'),
      status: ShipmentRequestStatus.ASSIGNED,
      bidStatus: BidStatus.ACCEPTED,
      bidPrice: 28000,
      bidCurrency: 'MXN',
      cargoType: 'Industrial Equipment',
      weight: 6500,
      vehicleType: 'Flatbed',
      clientApproved: true,
      specialInstructions: 'Required special equipment for unloading.',
      contactPerson: 'Roberto López',
      contactPhone: '+52 81 5566 7788',
    },
    {
      id: 5,
      requestId: 'SHP2025005',
      clientName: 'Mex Logistics',
      route: 'Veracruz → Puebla',
      pickupDate: new Date('2025-04-25'),
      deliveryDate: new Date('2025-04-26'),
      status: ShipmentRequestStatus.COMPLETED,
      bidStatus: BidStatus.ACCEPTED,
      bidPrice: 32000,
      bidCurrency: 'MXN',
      cargoType: 'Automotive Parts',
      weight: 4800,
      vehicleType: 'Dry Van',
      clientApproved: true,
      contactPerson: 'Ana Torres',
      contactPhone: '+52 22 9988 7766',
    }
  ];
  
  // Filter jobs based on selected tab
  const filteredJobs = mockJobs.filter(job => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'active') return job.status === ShipmentRequestStatus.IN_TRANSIT || job.status === ShipmentRequestStatus.ASSIGNED;
    if (selectedTab === 'pending') return job.bidStatus === BidStatus.PENDING || (!job.clientApproved && job.bidStatus === BidStatus.ACCEPTED);
    return true;
  });
  
  // Open the details dialog
  const handleViewDetails = (job: JobWithDetails) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };
  
  // Open the contact dialog
  const handleContact = (job: JobWithDetails) => {
    setSelectedJob(job);
    setIsContactOpen(true);
  };
  
  // Handle WhatsApp contact
  const handleWhatsAppContact = () => {
    if (selectedJob && selectedJob.contactPhone) {
      const phoneNumber = selectedJob.contactPhone.replace(/\D/g, ''); // Remove non-digit characters
      const message = encodeURIComponent(`Hola, soy de ${companyName || username}. Tengo una consulta respecto al envío ${selectedJob.requestId}.`);
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };
  
  // Handle phone call
  const handlePhoneCall = () => {
    if (selectedJob && selectedJob.contactPhone) {
      window.open(`tel:${selectedJob.contactPhone.replace(/\D/g, '')}`, '_blank');
    }
  };
  
  // Go to instruction letter page
  const handleViewInstructions = (requestId: string) => {
    setLocation(`/instruction-letter/${requestId}`);
  };
  
  // Go back to dashboard
  const handleBackToDashboard = () => {
    setLocation('/provider-dashboard');
  };
  
  // Get badge color based on status
  const getStatusBadgeColor = (status: ShipmentRequestStatus) => {
    switch (status) {
      case ShipmentRequestStatus.PENDING:
        return 'bg-gray-100 text-gray-800';
      case ShipmentRequestStatus.ASSIGNED:
        return 'bg-blue-100 text-blue-800';
      case ShipmentRequestStatus.IN_TRANSIT:
        return 'bg-amber-100 text-amber-800';
      case ShipmentRequestStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case ShipmentRequestStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get badge color based on bid status
  const getBidStatusBadgeColor = (bidStatus: BidStatus, clientApproved: boolean) => {
    if (bidStatus === BidStatus.PENDING) {
      return 'bg-gray-100 text-gray-800';
    } else if (bidStatus === BidStatus.ACCEPTED) {
      return clientApproved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };
  
  // Get bid status text
  const getBidStatusText = (bidStatus: BidStatus, clientApproved: boolean) => {
    if (bidStatus === BidStatus.PENDING) {
      return t.pending;
    } else if (bidStatus === BidStatus.ACCEPTED) {
      return clientApproved ? t.clientApproved : t.accepted;
    } else {
      return 'Rejected';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton backUrl="/provider-dashboard" backText={t.backToDashboard} />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              {t.activeJobs}
            </h1>
            <p className="text-gray-600 mt-1">{companyName || username}</p>
          </div>
          
          <Tabs defaultValue="all" className="mb-6" onValueChange={(v) => setSelectedTab(v as any)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">{t.allJobs}</TabsTrigger>
              <TabsTrigger value="active">{t.activeShipments}</TabsTrigger>
              <TabsTrigger value="pending">{t.pendingApproval}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  {filteredJobs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t.jobId}</TableHead>
                            <TableHead>{t.client}</TableHead>
                            <TableHead>{t.route}</TableHead>
                            <TableHead>{t.pickup}</TableHead>
                            <TableHead>{t.status}</TableHead>
                            <TableHead>{t.quoteStatus}</TableHead>
                            <TableHead>{t.actions}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredJobs.map((job) => (
                            <TableRow key={job.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{job.requestId}</TableCell>
                              <TableCell>{job.clientName}</TableCell>
                              <TableCell>{job.route}</TableCell>
                              <TableCell>
                                {typeof job.pickupDate === 'string' 
                                  ? job.pickupDate 
                                  : formatDate(job.pickupDate, { month: 'short', day: 'numeric' })}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusBadgeColor(job.status)}>
                                  {job.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getBidStatusBadgeColor(job.bidStatus, job.clientApproved)}>
                                  {getBidStatusText(job.bidStatus, job.clientApproved)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex items-center text-xs"
                                    onClick={() => handleViewDetails(job)}
                                  >
                                    <ClipboardIcon className="h-3.5 w-3.5 mr-1" />
                                    {t.view}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex items-center text-xs"
                                    onClick={() => handleContact(job)}
                                  >
                                    <MessageSquareIcon className="h-3.5 w-3.5 mr-1" />
                                    {t.contact}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {selectedTab === 'pending' 
                          ? 'No pending approval jobs at the moment.' 
                          : selectedTab === 'active' 
                            ? 'No active shipments at the moment.' 
                            : 'No jobs found.'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="active" className="mt-0">
              {/* Same content as "all" tab but with filtered data */}
              <Card>
                <CardContent className="p-6">
                  {filteredJobs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t.jobId}</TableHead>
                            <TableHead>{t.client}</TableHead>
                            <TableHead>{t.route}</TableHead>
                            <TableHead>{t.pickup}</TableHead>
                            <TableHead>{t.status}</TableHead>
                            <TableHead>{t.quoteStatus}</TableHead>
                            <TableHead>{t.actions}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredJobs.map((job) => (
                            <TableRow key={job.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{job.requestId}</TableCell>
                              <TableCell>{job.clientName}</TableCell>
                              <TableCell>{job.route}</TableCell>
                              <TableCell>
                                {typeof job.pickupDate === 'string' 
                                  ? job.pickupDate 
                                  : formatDate(job.pickupDate, { month: 'short', day: 'numeric' })}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusBadgeColor(job.status)}>
                                  {job.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getBidStatusBadgeColor(job.bidStatus, job.clientApproved)}>
                                  {getBidStatusText(job.bidStatus, job.clientApproved)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex items-center text-xs"
                                    onClick={() => handleViewDetails(job)}
                                  >
                                    <ClipboardIcon className="h-3.5 w-3.5 mr-1" />
                                    {t.view}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex items-center text-xs"
                                    onClick={() => handleContact(job)}
                                  >
                                    <MessageSquareIcon className="h-3.5 w-3.5 mr-1" />
                                    {t.contact}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No active shipments</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        You don't have any active shipments at the moment.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              {/* Same content as "all" tab but with filtered data */}
              <Card>
                <CardContent className="p-6">
                  {filteredJobs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t.jobId}</TableHead>
                            <TableHead>{t.client}</TableHead>
                            <TableHead>{t.route}</TableHead>
                            <TableHead>{t.pickup}</TableHead>
                            <TableHead>{t.status}</TableHead>
                            <TableHead>{t.quoteStatus}</TableHead>
                            <TableHead>{t.actions}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredJobs.map((job) => (
                            <TableRow key={job.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{job.requestId}</TableCell>
                              <TableCell>{job.clientName}</TableCell>
                              <TableCell>{job.route}</TableCell>
                              <TableCell>
                                {typeof job.pickupDate === 'string' 
                                  ? job.pickupDate 
                                  : formatDate(job.pickupDate, { month: 'short', day: 'numeric' })}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusBadgeColor(job.status)}>
                                  {job.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getBidStatusBadgeColor(job.bidStatus, job.clientApproved)}>
                                  {getBidStatusText(job.bidStatus, job.clientApproved)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex items-center text-xs"
                                    onClick={() => handleViewDetails(job)}
                                  >
                                    <ClipboardIcon className="h-3.5 w-3.5 mr-1" />
                                    {t.view}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex items-center text-xs"
                                    onClick={() => handleContact(job)}
                                  >
                                    <MessageSquareIcon className="h-3.5 w-3.5 mr-1" />
                                    {t.contact}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ListChecksIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        You don't have any pending approval jobs at the moment.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Button variant="outline" onClick={handleBackToDashboard} className="mt-4">
            {t.backToDashboard}
          </Button>
        </div>
      </div>
      
      {/* Job Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <TruckIcon className="mr-2 h-5 w-5 text-primary" />
              {t.jobDetails} - {selectedJob?.requestId}
            </DialogTitle>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6">
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getStatusBadgeColor(selectedJob.status)}>
                  {selectedJob.status}
                </Badge>
                <Badge variant="outline" className={getBidStatusBadgeColor(selectedJob.bidStatus, selectedJob.clientApproved)}>
                  {getBidStatusText(selectedJob.bidStatus, selectedJob.clientApproved)}
                </Badge>
                {selectedJob.bidStatus === BidStatus.ACCEPTED && selectedJob.bidPrice && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {selectedJob.bidPrice} {selectedJob.bidCurrency}
                  </Badge>
                )}
              </div>
              
              {/* Client Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  {t.clientInfo}
                </h3>
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-sm"><span className="font-medium">{t.client}:</span> {selectedJob.clientName}</p>
                  <p className="text-sm"><span className="font-medium">{t.contactPerson}:</span> {selectedJob.contactPerson || 'N/A'}</p>
                </div>
              </div>
              
              {/* Cargo Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <PackageIcon className="h-4 w-4 mr-2 text-primary" />
                  {t.cargoInfo}
                </h3>
                <div className="bg-gray-50 rounded-md p-3">
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm"><span className="font-medium">{t.cargoType}:</span> {selectedJob.cargoType}</p>
                    <p className="text-sm"><span className="font-medium">{t.weight}:</span> {selectedJob.weight} kg</p>
                    <p className="text-sm"><span className="font-medium">{t.vehicleType}:</span> {selectedJob.vehicleType}</p>
                  </div>
                </div>
              </div>
              
              {/* Route Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  {t.routeInfo}
                </h3>
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-sm"><span className="font-medium">{t.route}:</span> {selectedJob.route}</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <p className="text-sm">
                      <span className="font-medium">{t.pickup}:</span> {' '}
                      {typeof selectedJob.pickupDate === 'string' 
                        ? selectedJob.pickupDate 
                        : formatDate(selectedJob.pickupDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">{t.delivery}:</span> {' '}
                      {typeof selectedJob.deliveryDate === 'string' 
                        ? selectedJob.deliveryDate 
                        : formatDate(selectedJob.deliveryDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Special Instructions */}
              {selectedJob.specialInstructions && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <AlertCircleIcon className="h-4 w-4 mr-2 text-primary" />
                    {t.specialInstructions}
                  </h3>
                  <div className="bg-gray-50 rounded-md p-3">
                    <p className="text-sm">{selectedJob.specialInstructions}</p>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
                
                {selectedJob.clientApproved && (
                  <Button 
                    className="bg-primary text-white" 
                    onClick={() => handleViewInstructions(selectedJob.requestId)}
                  >
                    <ClipboardIcon className="mr-2 h-4 w-4" />
                    {t.viewInstructions}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Contact Dialog */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <PhoneIcon className="mr-2 h-5 w-5 text-primary" />
              {t.contactLogistics} - {selectedJob?.requestId}
            </DialogTitle>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="font-medium text-gray-800 mb-2">{selectedJob.clientName}</h3>
                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">{t.contactPerson}:</span> {selectedJob.contactPerson}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {selectedJob.contactPhone}</p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button onClick={handleWhatsAppContact} className="bg-green-600 hover:bg-green-700 text-white">
                  <MessageSquareIcon className="mr-2 h-4 w-4" />
                  {t.contactByWhatsapp}
                </Button>
                
                <Button onClick={handlePhoneCall} variant="outline">
                  <PhoneIcon className="mr-2 h-4 w-4" />
                  {t.contactByPhone}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}