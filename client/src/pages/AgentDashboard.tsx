import React from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import BookingsTable from '@/components/BookingsTable';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { UserRole, ShipmentRequest } from '@shared/schema';
import useUserStore from '@/hooks/useUserRole';
import useLanguage from '@/hooks/useLanguage';
import { PlusIcon, BarChart3Icon, UsersIcon } from 'lucide-react';

export default function AgentDashboard() {
  const [_, navigate] = useLocation();
  const { username, companyName } = useUserStore();
  const { language } = useLanguage();
  
  // Fetch requests
  const { data: shipmentRequests = [], isLoading } = useQuery({
    queryKey: ['/api/shipment-requests'],
    select: (data: ShipmentRequest[]) => data,
  });

  // Translations
  const t = {
    welcome: language === 'es' ? 'Bienvenido' : 'Welcome',
    createRequest: language === 'es' ? 'Crear Solicitud' : 'Create Request',
    dashboard: language === 'es' ? 'Panel' : 'Dashboard',
    analytics: language === 'es' ? 'Ver Análisis' : 'View Analytics',
    totalBookings: language === 'es' ? 'Total de Solicitudes' : 'Total Bookings',
    pendingBookings: language === 'es' ? 'Solicitudes Pendientes' : 'Pending Bookings',
    assignedBookings: language === 'es' ? 'Solicitudes Asignadas' : 'Assigned Bookings',
    potentialProfit: language === 'es' ? 'Ganancia Potencial' : 'Potential Profit',
    totalQuotesReceived: language === 'es' ? 'Ofertas Recibidas' : 'Quotes Received',
    avgQuotesPerBooking: language === 'es' ? 'Prom. Ofertas/Solicitud' : 'Avg. Quotes/Booking',
  };

  // Datos dummy para el dashboard (como se solicitó)
  // Estos datos serían reemplazados por datos reales en producción
  const totalBookings = 24;
  const pendingBookings = 8;
  const assignedBookings = 16;
  const potentialProfit = 345600; // MXN
  const totalQuotesReceived = 78;
  const avgQuotesPerBooking = "3.2";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Header section with greeting and action buttons */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t.welcome}, {username}
              </h1>
              <p className="text-gray-600">{companyName}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate('/view-analytics')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <BarChart3Icon className="h-4 w-4" />
                {t.analytics}
              </Button>
              
              <Button 
                onClick={() => navigate('/create-request')}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                {t.createRequest}
              </Button>
            </div>
          </div>
          
          {/* Key Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard 
              title={t.totalBookings} 
              value={totalBookings} 
              icon="clipboard" 
              iconColor="blue" 
            />
            <StatCard 
              title={t.pendingBookings} 
              value={pendingBookings} 
              icon="clock" 
              iconColor="amber" 
            />
            <StatCard 
              title={t.assignedBookings} 
              value={assignedBookings} 
              icon="check" 
              iconColor="green" 
            />
            <StatCard 
              title={t.potentialProfit} 
              value={`$${potentialProfit.toLocaleString()}`} 
              icon="dollar-sign" 
              iconColor="green" 
            />
            <StatCard 
              title={t.totalQuotesReceived} 
              value={totalQuotesReceived} 
              icon="activity" 
              iconColor="purple" 
            />
            <StatCard 
              title={t.avgQuotesPerBooking} 
              value={avgQuotesPerBooking} 
              icon="trending-up" 
              iconColor="blue" 
            />
          </div>
          
          {/* CRM-style Bookings Table */}
          <div>
            <BookingsTable 
              data={shipmentRequests} 
              loading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}