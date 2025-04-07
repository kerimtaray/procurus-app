import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  SimpleLineChart, 
  MultiLineChart,
  SimpleBarChart,
  SimplePieChart,
  SimpleAreaChart,
  sampleLineData,
  sampleMultiLineData,
  sampleBarData,
  samplePieData,
  sampleAreaData
} from '@/components/ui/charts';
import { UserRole } from '@shared/schema';
import useLanguage from '@/hooks/useLanguage';

interface DashboardSummaryProps {
  role: UserRole;
}

export default function DashboardSummary({ role }: DashboardSummaryProps) {
  const { language } = useLanguage();
  const isAgent = role === UserRole.AGENT;
  
  const translations = {
    dashboardSummary: language === 'es' ? 'Resumen de Actividad' : 'Activity Summary',
    performance: language === 'es' ? 'Rendimiento' : 'Performance',
    overview: language === 'es' ? 'Vista General' : 'Overview',
    analytics: language === 'es' ? 'Analíticas' : 'Analytics',
    requestsOverTime: language === 'es' ? 'Solicitudes a lo largo del tiempo' : 'Requests Over Time',
    shipmentStatus: language === 'es' ? 'Estado de Envíos' : 'Shipment Status',
    regionalActivity: language === 'es' ? 'Actividad Regional' : 'Regional Activity',
    vehicleDistribution: language === 'es' ? 'Distribución de Vehículos' : 'Vehicle Distribution',
    completedVsActive: language === 'es' ? 'Completados vs. Activos' : 'Completed vs. Active',
    onTimeDelivery: language === 'es' ? 'Entregas a Tiempo' : 'On-Time Delivery',
    revenuePerMonth: language === 'es' ? 'Ingresos por Mes' : 'Revenue Per Month',
    pendingShipments: language === 'es' ? 'Envíos Pendientes' : 'Pending Shipments',
    increasedFromLast: language === 'es' ? 'más que el mes pasado' : 'increase from last month',
    completed: language === 'es' ? 'Completados' : 'Completed',
    active: language === 'es' ? 'Activos' : 'Active',
    overview_subtitle: language === 'es' 
      ? 'Resumen del rendimiento y métricas clave' 
      : 'Summary of performance and key metrics',
    analytics_subtitle: language === 'es'
      ? 'Análisis detallado y tendencias'
      : 'Detailed analysis and trends',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{translations.dashboardSummary}</h2>
        <p className="text-muted-foreground">
          {language === 'es' 
            ? 'Visualiza el rendimiento y las tendencias logísticas de tu negocio' 
            : 'Visualize your business logistics performance and trends'}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{translations.overview}</TabsTrigger>
          <TabsTrigger value="analytics">{translations.analytics}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gráfico principal de líneas de tiempo */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>{translations.requestsOverTime}</CardTitle>
                <CardDescription>{translations.overview_subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleLineChart 
                  data={sampleLineData} 
                  color={isAgent ? '#3b82f6' : '#14b8a6'} 
                  height={250}
                />
              </CardContent>
            </Card>

            {/* Gráfico de barras - Actividad Regional */}
            <Card>
              <CardHeader>
                <CardTitle>{translations.regionalActivity}</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart 
                  data={sampleBarData} 
                  color={isAgent ? '#a855f7' : '#0ea5e9'} 
                  height={200}
                />
              </CardContent>
            </Card>

            {/* Gráfico circular - Distribución de vehículos o Estado de envíos */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isAgent ? translations.shipmentStatus : translations.vehicleDistribution}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart 
                  data={samplePieData} 
                  height={200}
                  label={false}
                />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {samplePieData.map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7'][index % 4] }}
                      ></div>
                      <span className="text-gray-600">{item.name}</span>
                      <span className="ml-auto font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gráfico de líneas múltiples - Completados vs Activos */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>{translations.completedVsActive}</CardTitle>
                <CardDescription>{translations.analytics_subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <MultiLineChart 
                  data={sampleMultiLineData}
                  lines={[
                    { dataKey: 'completed', stroke: '#22c55e', name: translations.completed },
                    { dataKey: 'active', stroke: '#f59e0b', name: translations.active }
                  ]}
                  height={250}
                />
              </CardContent>
            </Card>

            {/* Gráfico de área - Entregas a tiempo */}
            <Card>
              <CardHeader>
                <CardTitle>{translations.onTimeDelivery}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">92%</span>
                  <span className="text-sm text-green-600 flex items-center">
                    +5.2% 
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="ml-1 text-xs text-gray-500">{translations.increasedFromLast}</span>
                  </span>
                </div>
                <SimpleAreaChart 
                  data={sampleAreaData} 
                  color="#22c55e" 
                  height={200}
                />
              </CardContent>
            </Card>

            {/* Gráfico específico según el rol */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isAgent ? translations.pendingShipments : translations.revenuePerMonth}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAgent ? (
                  <SimpleBarChart 
                    data={sampleBarData.slice(0, 3)} 
                    color="#f59e0b" 
                    height={200}
                    horizontal={true}
                  />
                ) : (
                  <SimpleLineChart 
                    data={sampleLineData} 
                    color="#a855f7" 
                    height={200}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}