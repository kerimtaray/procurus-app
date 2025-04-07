import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import DashboardSummary from '@/components/DashboardSummary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShipmentRequest, UserRole } from '@shared/schema';
import { formatDate } from '@/lib/utils';
import useUserStore from '@/hooks/useUserRole';
import useLanguage from '@/hooks/useLanguage';
import { TruckIcon, CheckIcon, BellIcon, StarIcon, EyeIcon, ArrowRightIcon, TrendingUpIcon } from 'lucide-react';

export default function ProviderDashboard() {
  const [_, setLocation] = useLocation();
  const { username, companyName } = useUserStore();
  const { language } = useLanguage();
  
  // Mock data for active jobs
  const activeJobs = [
    {
      id: 'JOB-2452',
      client: 'Acme Imports',
      route: 'Cancun → Merida',
      pickupDate: '2023-05-12',
      status: 'In Transit'
    },
    {
      id: 'JOB-2451',
      client: 'Global Logistics',
      route: 'Mexico City → Puebla',
      pickupDate: '2023-05-11',
      status: 'Preparing'
    },
    {
      id: 'JOB-2450',
      client: 'MexTrade Corp.',
      route: 'Monterrey → Saltillo',
      pickupDate: '2023-05-10',
      status: 'Arrived'
    }
  ];
  
  // Translations
  const t = {
    providerDashboard: language === 'es' ? 'Panel de Control - Proveedor' : 'Provider Dashboard',
    welcome: language === 'es' ? 'Bienvenido,' : 'Welcome,',
    newRequests: language === 'es' ? 'Nuevas Solicitudes' : 'New Requests',
    activeShipments: language === 'es' ? 'Envíos Activos' : 'Active Shipments',
    completedJobs: language === 'es' ? 'Trabajos Completados' : 'Completed Jobs',
    rating: language === 'es' ? 'Calificación' : 'Rating',
    quoteRequests: language === 'es' ? 'Solicitudes de Cotización' : 'Quote Requests',
    requestedOn: language === 'es' ? 'Solicitado el:' : 'Requested on:',
    route: language === 'es' ? 'Ruta' : 'Route',
    vehicleType: language === 'es' ? 'Tipo de Vehículo' : 'Vehicle Type',
    pickupDate: language === 'es' ? 'Fecha de Recogida' : 'Pickup Date',
    cargoType: language === 'es' ? 'Tipo de Carga' : 'Cargo Type',
    weight: language === 'es' ? 'Peso' : 'Weight',
    deliveryDate: language === 'es' ? 'Fecha de Entrega' : 'Delivery Date',
    submitQuote: language === 'es' ? 'Enviar Cotización' : 'Submit Quote',
    activeJobs: language === 'es' ? 'Trabajos Activos' : 'Active Jobs',
    upcoming: language === 'es' ? 'Próximos' : 'Upcoming',
    jobId: language === 'es' ? 'ID Trabajo' : 'Job ID',
    client: language === 'es' ? 'Cliente' : 'Client',
    pickup: language === 'es' ? 'Recogida' : 'Pickup',
    status: language === 'es' ? 'Estado' : 'Status',
    actions: language === 'es' ? 'Acciones' : 'Actions',
    view: language === 'es' ? 'Ver' : 'View',
    newLabel: language === 'es' ? 'Nuevo' : 'New',
    viewAll: language === 'es' ? 'Ver todos' : 'View all',
    income: language === 'es' ? 'Ingresos' : 'Income',
    week: language === 'es' ? 'esta semana' : 'this week',
    upComingJobs: language === 'es' ? 'Próximos Trabajos' : 'Upcoming Jobs',
  };
  
  // Handle submitting a quote
  const handleSubmitQuote = (requestId: string) => {
    setLocation(`/submit-quote/${requestId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header section with welcome message */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              {t.providerDashboard}
            </h1>
            <p className="text-gray-600 mt-1">{t.welcome} <span className="font-semibold">{companyName || username}</span></p>
          </div>
          
          {/* KPI Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title={t.newRequests}
              value="3"
              icon="bell"
              iconColor="blue"
            />
            
            <StatCard
              title={t.activeShipments}
              value="5"
              icon="truck"
              iconColor="green"
            />
            
            <StatCard
              title={t.completedJobs}
              value="24"
              icon="check"
              iconColor="amber"
            />
            
            <StatCard
              title={t.rating}
              value="4.5/5"
              icon="star"
              iconColor="purple"
            />
          </div>
          
          {/* Dashboard Charts Summary */}
          <div className="mb-8">
            <DashboardSummary role={UserRole.PROVIDER} />
          </div>

          {/* Income and Upcoming Jobs (New horizontal cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{t.income}</CardTitle>
                <CardDescription>$24,780 MXN {t.week}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold flex items-center text-green-600">
                  +12.5%
                  <TrendingUpIcon className="ml-2 h-6 w-6" />
                </div>
                <div className="absolute right-4 top-4 bg-green-100 text-green-800 rounded-full p-3">
                  <span className="sr-only">Income</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t.upComingJobs}</CardTitle>
                <CardDescription>{t.upcoming}: 3</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {activeJobs.slice(0, 2).map((job, index) => (
                    <div key={job.id} className="flex items-center justify-between p-2 rounded-md bg-gray-50 hover:bg-gray-100">
                      <div className="flex items-center">
                        <div className={`w-2 h-10 rounded-full mr-3 ${
                          job.status === 'In Transit' ? 'bg-amber-500' : 
                          job.status === 'Preparing' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <div className="font-medium">{job.client}</div>
                          <div className="text-sm text-gray-500">{job.route}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(new Date(job.pickupDate), { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-primary flex items-center justify-center" onClick={() => {}}>
                  {t.viewAll} <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* New Quote Requests Section */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle>{t.quoteRequests}</CardTitle>
            </CardHeader>
            
            <CardContent>
              {/* Request 1 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 hover:shadow-md transition-shadow">
                <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-800">REQ-1235 - Global Imports Inc.</h3>
                    <p className="text-sm text-gray-600">{t.requestedOn} May 11, 2023</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {t.newLabel}
                  </Badge>
                </div>
                
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">{t.route}</div>
                      <div className="text-sm font-medium">Mexico City → Monterrey</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t.vehicleType}</div>
                      <div className="text-sm font-medium">Dry Van</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t.pickupDate}</div>
                      <div className="text-sm font-medium">May 15, 2023</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">{t.cargoType}</div>
                      <div className="text-sm font-medium">General Merchandise</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t.weight}</div>
                      <div className="text-sm font-medium">5,000 kg</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t.deliveryDate}</div>
                      <div className="text-sm font-medium">May 16, 2023</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleSubmitQuote('1235')}
                    className="w-full mt-4 bg-teal-700 hover:bg-teal-800"
                  >
                    {t.submitQuote}
                  </Button>
                </div>
              </div>
              
              {/* Request 2 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-800">REQ-1234 - MexTrade Corp.</h3>
                    <p className="text-sm text-gray-600">{t.requestedOn} May 10, 2023</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {t.newLabel}
                  </Badge>
                </div>
                
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">{t.route}</div>
                      <div className="text-sm font-medium">Guadalajara → Mexico City</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t.vehicleType}</div>
                      <div className="text-sm font-medium">Flatbed</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t.pickupDate}</div>
                      <div className="text-sm font-medium">May 18, 2023</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">{t.cargoType}</div>
                      <div className="text-sm font-medium">Construction Materials</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t.weight}</div>
                      <div className="text-sm font-medium">8,500 kg</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t.deliveryDate}</div>
                      <div className="text-sm font-medium">May 19, 2023</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleSubmitQuote('1234')}
                    className="w-full mt-4 bg-teal-700 hover:bg-teal-800"
                  >
                    {t.submitQuote}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Active Jobs Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t.activeJobs}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.jobId}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.client}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.route}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.pickup}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.status}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activeJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{job.id}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{job.client}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{job.route}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(new Date(job.pickupDate), { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant="outline" className={
                            job.status === 'In Transit' 
                              ? 'bg-amber-100 text-amber-800' 
                              : job.status === 'Preparing' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                          }>
                            {job.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            {t.view}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
