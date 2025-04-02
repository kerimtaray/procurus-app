import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import { 
  ShipmentRequest, 
  ShipmentRequestStatus,
  CargoType,
  PackagingType,
  VehicleType,
  AdditionalEquipment
} from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Truck,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Search,
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import useLanguageStore from '@/hooks/useLanguage';

export default function ActiveRequests() {
  const [_, setLocation] = useLocation();
  const { language } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  // Extend ShipmentRequest type with additional properties for the UI
  interface ExtendedShipmentRequest extends Omit<ShipmentRequest, 'requestorName' | 'company' | 'vehicleSize' | 'additionalEquipment' | 'assignedProviderId'> {
    totalBids?: number;
    pendingBids?: number;
    acceptedBids?: number;
    rejectedBids?: number;
    pickupInstructions?: string;
    deliveryInstructions?: string;
    budget?: number;
    currency?: string;
    bidDueDate?: Date;
    providerId?: number | null;
    requestorName: string;
    company: string;
    vehicleSize: string;
    additionalEquipment: AdditionalEquipment[];
    assignedProviderId: number | null;
  }
  
  // Placeholder data until we have real API implementation
  const dummyRequests: ExtendedShipmentRequest[] = [
    {
      id: 1,
      userId: 1,
      requestId: "REQ-1235",
      status: ShipmentRequestStatus.PENDING,
      cargoType: CargoType.GENERAL,
      weight: 1500,
      volume: 15,
      packagingType: PackagingType.PALLETS,
      vehicleType: VehicleType.DRY_VAN,
      specialRequirements: "None",
      pickupAddress: "Mexico City Warehouse, Block 3, Avenida Principal",
      pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      pickupContact: "Juan Gonzalez",
      pickupInstructions: "Call 30 minutes before arrival",
      deliveryAddress: "Guadalajara Distribution Center, Industrial Zone 5",
      deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      deliveryContact: "Maria Rodriguez",
      deliveryInstructions: "Delivery hours: 8am-5pm",
      budget: 2500,
      currency: "USD",
      bidDueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      providerId: null,
      totalBids: 5,
      pendingBids: 3,
      acceptedBids: 1,
      rejectedBids: 1,
      requestorName: "Miguel Gonzalez",
      company: "Importadora MG",
      vehicleSize: "Medium",
      additionalEquipment: [AdditionalEquipment.LIFTGATE],
      assignedProviderId: null
    },
    {
      id: 2,
      userId: 1,
      requestId: "REQ-1236",
      status: ShipmentRequestStatus.ASSIGNED,
      cargoType: CargoType.PERISHABLE,
      weight: 800,
      volume: 8,
      packagingType: PackagingType.BOXES,
      vehicleType: VehicleType.REFRIGERATED,
      specialRequirements: "Temperature controlled at -4°C",
      pickupAddress: "Veracruz Port, Terminal 3",
      pickupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      pickupContact: "Carlos Diaz",
      pickupInstructions: "Bring specialized equipment",
      deliveryAddress: "Mexico City Distribution Center, Cold Storage Area",
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      deliveryContact: "Ana Reyes",
      deliveryInstructions: "Immediate cold storage required",
      budget: 3200,
      currency: "USD",
      bidDueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      providerId: 3,
      totalBids: 4,
      pendingBids: 0,
      acceptedBids: 1,
      rejectedBids: 3,
      requestorName: "Alejandra Ruiz",
      company: "Frutos del Mar S.A.",
      vehicleSize: "Small",
      additionalEquipment: [AdditionalEquipment.BLANKETS],
      assignedProviderId: 3
    },
    {
      id: 3,
      userId: 1,
      requestId: "REQ-1237",
      status: ShipmentRequestStatus.PENDING,
      cargoType: CargoType.AUTOMOTIVE,
      weight: 2200,
      volume: 25,
      packagingType: PackagingType.CRATES,
      vehicleType: VehicleType.FLATBED,
      specialRequirements: "High value cargo, enhanced security",
      pickupAddress: "Monterrey Manufacturing Plant, Sector A",
      pickupDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      pickupContact: "Roberto Sanchez",
      pickupInstructions: "Security clearance required",
      deliveryAddress: "Puebla Assembly Plant, Building C",
      deliveryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      deliveryContact: "Eduardo Torres",
      deliveryInstructions: "Delivery window: 9am-11am only",
      budget: 3800,
      currency: "USD",
      bidDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      providerId: null,
      totalBids: 2,
      pendingBids: 2,
      acceptedBids: 0,
      rejectedBids: 0,
      requestorName: "Jorge Hernandez",
      company: "AutoMex Industries",
      vehicleSize: "Large",
      additionalEquipment: [AdditionalEquipment.LOAD_BARS, AdditionalEquipment.PALLET_JACK],
      assignedProviderId: null
    }
  ];

  // Fetch active requests
  const { data: requests, isLoading } = useQuery<ExtendedShipmentRequest[]>({
    queryKey: ['/api/shipment-requests/active'],
    // When real API is available
    // enabled: !!userId,
    initialData: dummyRequests // Remove this when using real API
  });

  // Format date display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Assigned':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Transit':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // View details of request and its bids
  const handleViewRequest = (id: number) => {
    setLocation(`/review-bids/${id}`);
  };
  
  // Filter requests based on search and status filters
  const filteredRequests = requests?.filter(request => {
    const matchesSearch = searchTerm === "" || 
      request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.cargoType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(request.status);
    
    return matchesSearch && matchesStatus;
  });

  // Get formatted status label
  const getStatusLabel = (status: string) => {
    if (language === 'es') {
      switch(status) {
        case 'Pending': return 'Pendiente';
        case 'Assigned': return 'Asignado';
        case 'In Transit': return 'En Tránsito';
        case 'Completed': return 'Completado';
        case 'Cancelled': return 'Cancelado';
        default: return status;
      }
    }
    return status;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton backUrl="/agent-dashboard" />
      
      <div className="flex-1 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>
                {language === 'es' ? 'Solicitudes Activas' : 'Active Requests'}
              </CardTitle>
              <CardDescription>
                {language === 'es' 
                  ? 'Gestiona y visualiza todas tus solicitudes de envío' 
                  : 'Manage and view all your shipment requests'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={language === 'es' ? "Buscar solicitudes..." : "Search requests..."}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        {language === 'es' ? 'Filtrar por Estado' : 'Filter by Status'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuCheckboxItem
                        checked={statusFilter.includes('Pending')}
                        onCheckedChange={(checked) => {
                          setStatusFilter(prev => 
                            checked 
                              ? [...prev, 'Pending']
                              : prev.filter(s => s !== 'Pending')
                          );
                        }}
                      >
                        {language === 'es' ? 'Pendiente' : 'Pending'}
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={statusFilter.includes('Assigned')}
                        onCheckedChange={(checked) => {
                          setStatusFilter(prev => 
                            checked 
                              ? [...prev, 'Assigned']
                              : prev.filter(s => s !== 'Assigned')
                          );
                        }}
                      >
                        {language === 'es' ? 'Asignado' : 'Assigned'}
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={statusFilter.includes('In Transit')}
                        onCheckedChange={(checked) => {
                          setStatusFilter(prev => 
                            checked 
                              ? [...prev, 'In Transit']
                              : prev.filter(s => s !== 'In Transit')
                          );
                        }}
                      >
                        {language === 'es' ? 'En Tránsito' : 'In Transit'}
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuSeparator />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-xs"
                        onClick={() => setStatusFilter([])}
                      >
                        {language === 'es' ? 'Limpiar Filtros' : 'Clear Filters'}
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button
                    onClick={() => setLocation('/create-request')}
                    className="bg-primary text-white"
                  >
                    {language === 'es' ? 'Nueva Solicitud' : 'New Request'}
                  </Button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-center p-8">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-opacity-25 border-t-primary rounded-full mb-4"></div>
                  <p className="text-gray-600">
                    {language === 'es' ? 'Cargando solicitudes...' : 'Loading requests...'}
                  </p>
                </div>
              ) : filteredRequests && filteredRequests.length > 0 ? (
                <div className="overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">{language === 'es' ? 'ID Solicitud' : 'Request ID'}</TableHead>
                        <TableHead>{language === 'es' ? 'Tipo de Carga' : 'Cargo Type'}</TableHead>
                        <TableHead>{language === 'es' ? 'Origen → Destino' : 'Origin → Destination'}</TableHead>
                        <TableHead>{language === 'es' ? 'Fecha Recogida' : 'Pickup Date'}</TableHead>
                        <TableHead>{language === 'es' ? 'Estado' : 'Status'}</TableHead>
                        <TableHead>{language === 'es' ? 'Cotizaciones' : 'Quotes'}</TableHead>
                        <TableHead className="text-right">{language === 'es' ? 'Acciones' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.requestId}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Package className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="truncate max-w-[150px]">{request.cargoType}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <div className="mb-1 truncate max-w-[200px]">{request.pickupAddress}</div>
                              <div className="flex items-center text-primary">
                                <Truck className="h-3 w-3 mr-1" />
                                <span className="truncate max-w-[200px]">{request.deliveryAddress}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {formatDate(request.pickupDate)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(request.status)} text-xs font-medium`}>
                              {getStatusLabel(request.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium">{request.totalBids || 0}</span>
                                  <span className="text-xs text-gray-500 ml-1">total</span>
                                </div>
                                {request.pendingBids && request.pendingBids > 0 && (
                                  <div className="flex items-center text-xs text-amber-600">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {request.pendingBids} {language === 'es' ? 'pendientes' : 'pending'}
                                  </div>
                                )}
                                {request.acceptedBids && request.acceptedBids > 0 && (
                                  <div className="flex items-center text-xs text-green-600">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    {request.acceptedBids} {language === 'es' ? 'aceptadas' : 'accepted'}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRequest(request.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">
                                {language === 'es' ? 'Ver cotizaciones' : 'View quotes'}
                              </span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-8 border rounded-md bg-white">
                  <div className="bg-gray-100 rounded-full p-3 inline-block mb-4">
                    <AlertCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    {language === 'es' ? 'No se encontraron solicitudes' : 'No requests found'}
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    {language === 'es' 
                      ? 'No hay solicitudes que coincidan con tus criterios de búsqueda o aún no has creado ninguna solicitud.' 
                      : 'There are no requests matching your search criteria or you haven\'t created any requests yet.'}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setLocation('/create-request')}
                  >
                    {language === 'es' ? 'Crear tu primera solicitud' : 'Create your first request'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}