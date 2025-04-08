import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import {
  MoreHorizontalIcon, FileIcon, EyeIcon, FilterIcon,
  SearchIcon, XCircleIcon, CheckCircleIcon, ClockIcon,
  TruckIcon, DollarSignIcon, AlertCircleIcon
} from 'lucide-react';
import { ShipmentRequest, ShipmentRequestStatus } from '@shared/schema';
import { formatDate } from '@/lib/utils';
import useLanguageStore from '@/hooks/useLanguage';
import { translations } from '@/lib/translations';

// Datos extendidos para shipment requests
interface BookingData {
  id: number;
  requestId: string;
  clientName: string;
  date: Date;
  status: string;
  providersContacted: number;
  quotesReceived: number;
  bestOffer: number | null;
  potentialProfit: number;
  urgency: 'high' | 'medium' | 'low';
  origin: string;
  destination: string;
}

interface BookingsTableProps {
  data?: ShipmentRequest[];
  loading?: boolean;
}

export default function BookingsTable({ data = [], loading = false }: BookingsTableProps) {
  const [_, setLocation] = useLocation();
  const { language } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Función para transformar datos de solicitudes a formato de BookingData
  const transformRequestsToBookings = (requests: ShipmentRequest[]): BookingData[] => {
    // En una implementación real, estos datos vendrían de las relaciones de la API
    return requests.map(req => {
      // Simulación de datos para la demostración
      const providersContacted = Math.floor(Math.random() * 8) + 1;
      const quotesReceived = Math.floor(Math.random() * providersContacted);
      const bestOffer = quotesReceived > 0 ? Math.floor(Math.random() * 50000) + 10000 : null;
      const potentialProfit = bestOffer ? Math.floor(bestOffer * 0.2) : 0;
      const urgencyOptions: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
      const urgency = urgencyOptions[Math.floor(Math.random() * 3)];
      
      return {
        id: req.id,
        requestId: req.requestId,
        clientName: req.requestorName,
        date: req.createdAt,
        status: req.status,
        providersContacted,
        quotesReceived,
        bestOffer,
        potentialProfit,
        urgency,
        origin: req.pickupAddress.split(',')[0],
        destination: req.deliveryAddress.split(',')[0]
      };
    });
  };

  // Datos de muestra - en una implementación real, estos vendrían de la API
  const sampleData: BookingData[] = [
    {
      id: 1,
      requestId: 'REQ-2023-001',
      clientName: 'Global Imports Inc.',
      date: new Date('2023-10-15'),
      status: 'Pending',
      providersContacted: 5,
      quotesReceived: 3,
      bestOffer: 42500,
      potentialProfit: 8500,
      urgency: 'high',
      origin: 'Mexico City',
      destination: 'Monterrey'
    },
    {
      id: 2,
      requestId: 'REQ-2023-002',
      clientName: 'Industrial Solutions',
      date: new Date('2023-10-18'),
      status: 'Assigned',
      providersContacted: 4,
      quotesReceived: 4,
      bestOffer: 67800,
      potentialProfit: 13560,
      urgency: 'medium',
      origin: 'Guadalajara',
      destination: 'Mexico City'
    },
    {
      id: 3,
      requestId: 'REQ-2023-003',
      clientName: 'Tech Innovations',
      date: new Date('2023-10-20'),
      status: 'In Transit',
      providersContacted: 3,
      quotesReceived: 2,
      bestOffer: 51200,
      potentialProfit: 10240,
      urgency: 'low',
      origin: 'Cancun',
      destination: 'Merida'
    },
    {
      id: 4,
      requestId: 'REQ-2023-004',
      clientName: 'Mega Retail Corp.',
      date: new Date('2023-10-22'),
      status: 'Pending',
      providersContacted: 6,
      quotesReceived: 0,
      bestOffer: null,
      potentialProfit: 0,
      urgency: 'high',
      origin: 'Veracruz',
      destination: 'Puebla'
    },
    {
      id: 5,
      requestId: 'REQ-2023-005',
      clientName: 'Agro Enterprises',
      date: new Date('2023-10-25'),
      status: 'Completed',
      providersContacted: 3,
      quotesReceived: 3,
      bestOffer: 72300,
      potentialProfit: 14460,
      urgency: 'medium',
      origin: 'Monterrey',
      destination: 'Saltillo'
    },
  ];

  // Combinamos datos reales (si existen) con datos de muestra
  let bookings: BookingData[] = [];
  if (data.length > 0) {
    bookings = transformRequestsToBookings(data);
  } else {
    bookings = sampleData;
  }

  // Aplicar filtros y ordenación
  const filteredBookings = bookings
    .filter(booking => 
      (statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase()) &&
      (booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       booking.requestId.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortDirection === 'asc' 
            ? a.date.getTime() - b.date.getTime() 
            : b.date.getTime() - a.date.getTime();
        case 'client':
          return sortDirection === 'asc'
            ? a.clientName.localeCompare(b.clientName)
            : b.clientName.localeCompare(a.clientName);
        case 'offers':
          return sortDirection === 'asc'
            ? a.quotesReceived - b.quotesReceived
            : b.quotesReceived - a.quotesReceived;
        case 'profit':
          return sortDirection === 'asc'
            ? a.potentialProfit - b.potentialProfit
            : b.potentialProfit - a.potentialProfit;
        case 'urgency':
          const urgencyValue = { high: 3, medium: 2, low: 1 };
          return sortDirection === 'asc'
            ? urgencyValue[a.urgency] - urgencyValue[b.urgency]
            : urgencyValue[b.urgency] - urgencyValue[a.urgency];
        default:
          return 0;
      }
    });

  // Función para obtener el color del badge según el estado
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'in transit':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Función para obtener el ícono del estado
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <ClockIcon className="h-3.5 w-3.5 mr-1" />;
      case 'assigned':
        return <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />;
      case 'in transit':
        return <TruckIcon className="h-3.5 w-3.5 mr-1" />;
      case 'completed':
        return <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />;
      case 'cancelled':
        return <XCircleIcon className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  // Función para mostrar el icono de urgencia
  const getUrgencyIcon = (urgency: 'high' | 'medium' | 'low') => {
    switch (urgency) {
      case 'high':
        return <AlertCircleIcon className="h-3.5 w-3.5 text-red-500" />;
      case 'medium':
        return <AlertCircleIcon className="h-3.5 w-3.5 text-amber-500" />;
      case 'low':
        return <AlertCircleIcon className="h-3.5 w-3.5 text-green-500" />;
      default:
        return null;
    }
  };

  // Función para manejar el cambio de dirección de ordenación
  const handleSortChange = (sortKey: string) => {
    if (sortBy === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortKey);
      setSortDirection('desc');
    }
  };

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('date');
    setSortDirection('desc');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>{translations.bookings[language]}</CardTitle>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-60">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder={translations.search[language]}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder={translations.status[language]} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translations.all[language]}</SelectItem>
                <SelectItem value="pending">{translations.pending[language]}</SelectItem>
                <SelectItem value="assigned">{translations.assigned[language]}</SelectItem>
                <SelectItem value="in transit">{translations.inTransit[language]}</SelectItem>
                <SelectItem value="completed">{translations.completed[language]}</SelectItem>
                <SelectItem value="cancelled">{translations.cancelled[language]}</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sort By */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder={translations.sortBy[language]} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">{translations.date[language]}</SelectItem>
                <SelectItem value="client">{translations.client[language]}</SelectItem>
                <SelectItem value="offers">{translations.offers[language]}</SelectItem>
                <SelectItem value="profit">{translations.profit[language]}</SelectItem>
                <SelectItem value="urgency">{translations.urgency[language]}</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Clear Filters Button */}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={clearFilters}
              title={translations.clearFilters[language]}
              className="h-10 w-10"
            >
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <div className="flex items-center gap-1">
                    {translations.urgency[language]}
                  </div>
                </TableHead>
                <TableHead>{translations.requestId[language]}</TableHead>
                <TableHead>{translations.client[language]}</TableHead>
                <TableHead>{translations.route[language]}</TableHead>
                <TableHead>{translations.status[language]}</TableHead>
                <TableHead>{translations.providersContacted[language]}</TableHead>
                <TableHead>{translations.quotesReceived[language]}</TableHead>
                <TableHead>{translations.bestOffer[language]}</TableHead>
                <TableHead>{translations.potentialProfit[language]}</TableHead>
                <TableHead className="text-right">{translations.action[language]}</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">{translations.loading[language]}</TableCell>
                </TableRow>
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">{translations.noResults[language]}</TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex justify-center">
                        {getUrgencyIcon(booking.urgency)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{booking.requestId}</TableCell>
                    <TableCell>{booking.clientName}</TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600">{booking.origin} → {booking.destination}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeClass(booking.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{booking.providersContacted}</TableCell>
                    <TableCell className="text-center">{booking.quotesReceived}</TableCell>
                    <TableCell>
                      {booking.bestOffer 
                        ? <span className="font-semibold">${booking.bestOffer.toLocaleString()}</span>
                        : <span className="text-gray-500 text-xs">{translations.noQuotes[language]}</span>
                      }
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600 font-semibold">
                        ${booking.potentialProfit.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLocation(`/review-bids/${booking.id}`)}
                        className="text-xs"
                      >
                        <DollarSignIcon className="h-3.5 w-3.5 mr-1" />
                        {translations.viewQuotes[language]}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}