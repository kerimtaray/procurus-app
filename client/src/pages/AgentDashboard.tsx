import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import RequestSummary from '@/components/RequestSummary';
import DashboardSummary from '@/components/DashboardSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TrendingUpIcon, TrendingDownIcon, ArrowRightIcon, PlusIcon } from 'lucide-react';
import { ShipmentRequest, Provider, UserRole } from '@shared/schema';
import useUserStore from '@/hooks/useUserRole';
import useLanguage from '@/hooks/useLanguage';

export default function AgentDashboard() {
  const [_, setLocation] = useLocation();
  const { username, role, companyName } = useUserStore();
  const { language } = useLanguage();
  
  // Define a type for providers with nullable fields
  type ProviderWithNullableFields = Provider & {
    onTimeRate: number | null;
    responseTime: number | null;
    completedJobs: number | null;
  };
  
  // Query top providers
  const { data: topProviders, isLoading: loadingProviders } = useQuery<ProviderWithNullableFields[]>({
    queryKey: ['/api/providers/top'],
  });
  
  // Query recent requests
  const { data: recentRequests, isLoading: loadingRequests } = useQuery<ShipmentRequest[]>({
    queryKey: ['/api/shipment-requests'],
  });
  
  // Translations
  const t = {
    agentDashboard: language === 'es' ? 'Panel de Control - Agente' : 'Agent Dashboard',
    newRequest: language === 'es' ? 'Nueva Solicitud' : 'New Request',
    welcome: language === 'es' ? 'Bienvenido,' : 'Welcome,',
    statistics: language === 'es' ? 'Estadísticas' : 'Statistics',
    activeRequests: language === 'es' ? 'Solicitudes Activas' : 'Active Requests',
    completedShipments: language === 'es' ? 'Envíos Completados' : 'Completed Shipments',
    avgResponseTime: language === 'es' ? 'Tiempo Prom. Respuesta' : 'Avg. Response Time',
    providerNetwork: language === 'es' ? 'Red de Proveedores' : 'Provider Network',
    topProviders: language === 'es' ? 'Mejores Proveedores' : 'Top Performing Providers',
    provider: language === 'es' ? 'Proveedor' : 'Provider',
    onTimeRate: language === 'es' ? 'Puntualidad' : 'On-Time Rate',
    responseTime: language === 'es' ? 'Tiempo Respuesta' : 'Response Time',
    completedJobs: language === 'es' ? 'Trabajos Completados' : 'Completed Jobs',
    rating: language === 'es' ? 'Calificación' : 'Rating',
    recentRequests: language === 'es' ? 'Solicitudes Recientes' : 'Recent Requests',
    noRequests: language === 'es' ? 'No se encontraron solicitudes recientes.' : 'No recent requests found.',
    loadingRequests: language === 'es' ? 'Cargando solicitudes...' : 'Loading requests...',
    loadingProviders: language === 'es' ? 'Cargando proveedores...' : 'Loading providers...',
    viewAll: language === 'es' ? 'Ver todos' : 'View all',
    actions: language === 'es' ? 'Acciones' : 'Actions'
  };
  
  // Get initials for provider avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Map colors for provider avatars
  const getAvatarColor = (index: number) => {
    const colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800'];
    return colors[index % colors.length];
  };
  
  // Render star rating
  const renderStarRating = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex text-amber-400">
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
      </div>
    );
  };
  
  // Handle creating a new request
  const handleCreateRequest = () => {
    setLocation('/create-request');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header section with welcome and new request button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {t.agentDashboard}
              </h1>
              <p className="text-gray-600 mt-1">{t.welcome} <span className="font-semibold">{companyName || username}</span></p>
            </div>
            
            <Button
              onClick={handleCreateRequest}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-md flex items-center space-x-2 shadow-md transform hover:scale-105 transition-transform"
            >
              <PlusIcon className="h-5 w-5" />
              <span>{t.newRequest}</span>
            </Button>
          </div>
          
          {/* KPI Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title={t.activeRequests}
              value="12"
              icon="clipboard"
              iconColor="blue"
            />
            
            <StatCard
              title={t.completedShipments}
              value="48"
              icon="check"
              iconColor="green"
            />
            
            <StatCard
              title={t.avgResponseTime}
              value="1.8h"
              icon="clock"
              iconColor="amber"
            />
            
            <StatCard
              title={t.providerNetwork}
              value="26"
              icon="network"
              iconColor="purple"
            />
          </div>
          
          {/* Dashboard Charts Summary */}
          <div className="mb-8">
            <DashboardSummary role={UserRole.AGENT} />
          </div>
          
          {/* Recent activity and Top providers sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Requests */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle>{t.recentRequests}</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary flex items-center" onClick={() => setLocation('/active-requests')}>
                  {t.viewAll} <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {loadingRequests ? (
                    <div className="text-sm text-gray-500">{t.loadingRequests}</div>
                  ) : recentRequests && recentRequests.length > 0 ? (
                    recentRequests.slice(0, 3).map((request) => (
                      <RequestSummary 
                        key={request.id} 
                        request={request} 
                        showActions 
                        onClick={() => setLocation(`/matching-results/${request.id}`)}
                      />
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">{t.noRequests}</div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <Button 
                    onClick={handleCreateRequest}
                    variant="outline"
                    className="w-full flex items-center justify-center mx-auto"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    {t.newRequest}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Top Providers Section */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>{t.topProviders}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.provider}</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.onTimeRate}</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.responseTime}</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.rating}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loadingProviders ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-center text-sm text-gray-500">
                            {t.loadingProviders}
                          </td>
                        </tr>
                      ) : (
                        topProviders?.map((provider, index) => (
                          <tr key={provider.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className={`h-8 w-8 ${getAvatarColor(index)} mr-2`}>
                                  <AvatarFallback>{getInitials(provider.companyName)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{provider.companyName}</div>
                                  <div className="text-xs text-gray-500">{provider.serviceAreas.join(', ')}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`mr-2 ${(provider.onTimeRate || 0) > 90 ? 'text-green-600' : 'text-amber-600'}`}>
                                  {(provider.onTimeRate || 0) > 90 ? <TrendingUpIcon className="h-4 w-4" /> : <TrendingDownIcon className="h-4 w-4" />}
                                </div>
                                <div className="text-sm text-gray-900">{provider.onTimeRate || 0}%</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{provider.responseTime || 0}h</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {renderStarRating(provider.score || 0)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
