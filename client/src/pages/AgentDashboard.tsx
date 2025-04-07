import React from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import QuotesTable from '@/components/QuotesTable';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole, ShipmentRequest } from '@shared/schema';
import useUserStore from '@/hooks/useUserRole';
import useLanguage from '@/hooks/useLanguage';
import { PlusIcon, BarChart3Icon } from 'lucide-react';

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
    summary: language === 'es' ? 'Resumen' : 'Summary',
    activeQuotes: language === 'es' ? 'Cotizaciones Activas' : 'Active Quotes',
    recentActivity: language === 'es' ? 'Actividad Reciente' : 'Recent Activity',
    totalQuotes: language === 'es' ? 'Total de Cotizaciones' : 'Total Quotes',
    pendingQuotes: language === 'es' ? 'Cotizaciones Pendientes' : 'Pending Quotes',
    approvedQuotes: language === 'es' ? 'Cotizaciones Aprobadas' : 'Approved Quotes',
    potentialProfit: language === 'es' ? 'Ganancia Potencial' : 'Potential Profit',
    conversionRate: language === 'es' ? 'Tasa de Conversión' : 'Conversion Rate',
    avgResponseTime: language === 'es' ? 'Tiempo Respuesta Prom.' : 'Avg. Response Time',
  };

  // Stats calculations
  const totalQuotes = shipmentRequests.length;
  const pendingQuotes = shipmentRequests.filter(req => req.status === 'Pending').length;
  const approvedQuotes = shipmentRequests.filter(req => req.status === 'Assigned').length; // Using 'Assigned' instead of 'Approved'
  
  // For the demo, calculating some metrics with mock data
  const potentialProfit = shipmentRequests.length * 12000; // Simplified calculation
  const conversionRate = shipmentRequests.length > 0 ? 
    Math.round((approvedQuotes / totalQuotes) * 100) : 0;
  const avgResponseTime = "3.2h";

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
              title={t.totalQuotes} 
              value={totalQuotes} 
              icon="clipboard" 
              iconColor="blue" 
            />
            <StatCard 
              title={t.pendingQuotes} 
              value={pendingQuotes} 
              icon="clock" 
              iconColor="amber" 
            />
            <StatCard 
              title={t.approvedQuotes} 
              value={approvedQuotes} 
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
              title={t.conversionRate} 
              value={`${conversionRate}%`} 
              icon="activity" 
              iconColor="purple" 
            />
            <StatCard 
              title={t.avgResponseTime} 
              value={avgResponseTime} 
              icon="trending-up" 
              iconColor="blue" 
            />
          </div>
          
          {/* CRM-style Quotes Table */}
          <div>
            <QuotesTable loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}