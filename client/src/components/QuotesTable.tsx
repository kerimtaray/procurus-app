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
  SearchIcon, XCircleIcon, CheckCircleIcon, ClockIcon
} from 'lucide-react';
import { ShipmentRequest, ShipmentRequestStatus } from '@shared/schema';
import { formatDate } from '@/lib/utils';
import useLanguage from '@/hooks/useLanguage';

// Datos de muestra ampliados para representar cotizaciones de CRM
interface QuoteData {
  id: number;
  requestId: string;
  clientName: string;
  date: Date;
  status: string; // Usando string en lugar de ShipmentRequestStatus para mayor flexibilidad
  value: number;
  potentialProfit: number;
  responseTime: string;
  lastActivity: Date;
  origin: string;
  destination: string;
}

interface QuotesTableProps {
  data?: QuoteData[];
  loading?: boolean;
}

export default function QuotesTable({ data = [], loading = false }: QuotesTableProps) {
  const [_, setLocation] = useLocation();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Traducción
  const t = {
    quotes: language === 'es' ? 'Cotizaciones' : 'Quotes',
    search: language === 'es' ? 'Buscar...' : 'Search...',
    status: language === 'es' ? 'Estado' : 'Status',
    all: language === 'es' ? 'Todos' : 'All',
    pending: language === 'es' ? 'Pendiente' : 'Pending',
    approved: language === 'es' ? 'Aprobada' : 'Approved',
    assigned: language === 'es' ? 'Asignada' : 'Assigned',
    rejected: language === 'es' ? 'Rechazada' : 'Rejected',
    sortBy: language === 'es' ? 'Ordenar por' : 'Sort by',
    date: language === 'es' ? 'Fecha' : 'Date',
    client: language === 'es' ? 'Cliente' : 'Client',
    value: language === 'es' ? 'Valor' : 'Value',
    profit: language === 'es' ? 'Ganancia' : 'Profit',
    id: language === 'es' ? 'ID' : 'ID',
    requestId: language === 'es' ? 'ID de Solicitud' : 'Request ID',
    potentialProfit: language === 'es' ? 'Ganancia Potencial' : 'Potential Profit',
    responseTime: language === 'es' ? 'Tiempo de Respuesta' : 'Response Time',
    lastActivity: language === 'es' ? 'Última Actividad' : 'Last Activity',
    action: language === 'es' ? 'Acción' : 'Action',
    view: language === 'es' ? 'Ver' : 'View',
    noResults: language === 'es' ? 'No se encontraron cotizaciones' : 'No quotes found',
    loading: language === 'es' ? 'Cargando cotizaciones...' : 'Loading quotes...',
    route: language === 'es' ? 'Ruta' : 'Route',
    clearFilters: language === 'es' ? 'Limpiar filtros' : 'Clear filters',
    filters: language === 'es' ? 'Filtros' : 'Filters',
  };

  // Datos de muestra - en una implementación real, estos vendrían de una API
  const sampleData: QuoteData[] = [
    {
      id: 1,
      requestId: 'REQ-2023-001',
      clientName: 'Global Imports Inc.',
      date: new Date('2023-10-15'),
      status: 'Pending',
      value: 45000,
      potentialProfit: 9000,
      responseTime: '4h',
      lastActivity: new Date('2023-10-16'),
      origin: 'Mexico City',
      destination: 'Monterrey'
    },
    {
      id: 2,
      requestId: 'REQ-2023-002',
      clientName: 'Industrial Solutions',
      date: new Date('2023-10-18'),
      status: 'Approved',
      value: 78500,
      potentialProfit: 15700,
      responseTime: '2h',
      lastActivity: new Date('2023-10-19'),
      origin: 'Guadalajara',
      destination: 'Mexico City'
    },
    {
      id: 3,
      requestId: 'REQ-2023-003',
      clientName: 'Tech Innovations',
      date: new Date('2023-10-20'),
      status: 'Assigned',
      value: 52300,
      potentialProfit: 10460,
      responseTime: '1h',
      lastActivity: new Date('2023-10-21'),
      origin: 'Cancun',
      destination: 'Merida'
    },
    {
      id: 4,
      requestId: 'REQ-2023-004',
      clientName: 'Mega Retail Corp.',
      date: new Date('2023-10-22'),
      status: 'Rejected',
      value: 31200,
      potentialProfit: 6240,
      responseTime: '5h',
      lastActivity: new Date('2023-10-23'),
      origin: 'Veracruz',
      destination: 'Puebla'
    },
    {
      id: 5,
      requestId: 'REQ-2023-005',
      clientName: 'Agro Enterprises',
      date: new Date('2023-10-25'),
      status: 'Pending',
      value: 67800,
      potentialProfit: 13560,
      responseTime: '3h',
      lastActivity: new Date('2023-10-26'),
      origin: 'Monterrey',
      destination: 'Saltillo'
    },
  ];

  // Combinamos datos reales (si existen) con datos de muestra
  const allQuotes = data.length > 0 ? data : sampleData;

  // Aplicar filtros y ordenación
  const filteredQuotes = allQuotes
    .filter(quote => 
      (statusFilter === 'all' || quote.status.toLowerCase() === statusFilter.toLowerCase()) &&
      (quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       quote.requestId.toLowerCase().includes(searchTerm.toLowerCase()))
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
        case 'value':
          return sortDirection === 'asc'
            ? a.value - b.value
            : b.value - a.value;
        case 'profit':
          return sortDirection === 'asc'
            ? a.potentialProfit - b.potentialProfit
            : b.potentialProfit - a.potentialProfit;
        default:
          return 0;
      }
    });

  // Función para obtener el color del badge según el estado
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'rejected':
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
      case 'approved':
        return <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />;
      case 'assigned':
        return <FileIcon className="h-3.5 w-3.5 mr-1" />;
      case 'rejected':
        return <XCircleIcon className="h-3.5 w-3.5 mr-1" />;
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
          <CardTitle>{t.quotes}</CardTitle>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-60">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder={t.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="pending">{t.pending}</SelectItem>
                <SelectItem value="approved">{t.approved}</SelectItem>
                <SelectItem value="assigned">{t.assigned}</SelectItem>
                <SelectItem value="rejected">{t.rejected}</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sort By */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder={t.sortBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">{t.date}</SelectItem>
                <SelectItem value="client">{t.client}</SelectItem>
                <SelectItem value="value">{t.value}</SelectItem>
                <SelectItem value="profit">{t.profit}</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Clear Filters Button */}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={clearFilters}
              title={t.clearFilters}
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
                <TableHead>{t.requestId}</TableHead>
                <TableHead>{t.client}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead>{t.route}</TableHead>
                <TableHead>{t.value}</TableHead>
                <TableHead>{t.potentialProfit}</TableHead>
                <TableHead className="text-right">{t.action}</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">{t.loading}</TableCell>
                </TableRow>
              ) : filteredQuotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">{t.noResults}</TableCell>
                </TableRow>
              ) : (
                filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{quote.requestId}</TableCell>
                    <TableCell>{quote.clientName}</TableCell>
                    <TableCell>{formatDate(quote.date, { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeClass(quote.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(quote.status)}
                          {quote.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600">{quote.origin} → {quote.destination}</span>
                    </TableCell>
                    <TableCell>${quote.value.toLocaleString()}</TableCell>
                    <TableCell>${quote.potentialProfit.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setLocation(`/matching-results/${quote.id}`)}
                        className="h-8 w-8 p-0"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">{t.view}</span>
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