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
    quotesOverTime: language === 'es' ? 'Cotizaciones a lo largo del tiempo' : 'Quotes Over Time',
    quoteStatus: language === 'es' ? 'Estado de Cotizaciones' : 'Quote Status',
    grossProfit: language === 'es' ? 'Ganancia Bruta' : 'Gross Profit',
    regionalActivity: language === 'es' ? 'Actividad Regional' : 'Regional Activity',
    vehicleDistribution: language === 'es' ? 'Distribución de Vehículos' : 'Vehicle Distribution',
    completedVsActive: language === 'es' ? 'Completadas vs. Activas' : 'Completed vs. Active',
    acceptanceRate: language === 'es' ? 'Tasa de Aceptación' : 'Acceptance Rate',
    quoteResponseTime: language === 'es' ? 'Tiempo de Respuesta' : 'Response Time',
    quotesPerDay: language === 'es' ? 'Cotizaciones por Día' : 'Quotes per Day',
    revenuePerMonth: language === 'es' ? 'Ingresos por Mes' : 'Revenue Per Month',
    pendingQuotes: language === 'es' ? 'Cotizaciones Pendientes' : 'Pending Quotes',
    conversionRate: language === 'es' ? 'Tasa de Conversión' : 'Conversion Rate',
    increasedFromLast: language === 'es' ? 'más que el mes pasado' : 'increase from last month',
    completed: language === 'es' ? 'Completadas' : 'Completed',
    active: language === 'es' ? 'Activas' : 'Active',
    overview_subtitle: language === 'es' 
      ? 'Resumen del rendimiento y métricas clave' 
      : 'Summary of performance and key metrics',
    analytics_subtitle: language === 'es'
      ? 'Análisis detallado y tendencias'
      : 'Detailed analysis and trends',
    profitability: language === 'es' ? 'Rentabilidad' : 'Profitability',
    approved: language === 'es' ? 'Aprobadas' : 'Approved',
    rejected: language === 'es' ? 'Rechazadas' : 'Rejected',
    pending: language === 'es' ? 'Pendientes' : 'Pending',
    potentialProfit: language === 'es' ? 'Ganancia Potencial' : 'Potential Profit',
    achievedProfit: language === 'es' ? 'Ganancia Lograda' : 'Achieved Profit',
  };

  // Datos de muestra específicos para procurement
  const procurementQuoteStatusData = [
    { name: translations.approved, value: 45 },
    { name: translations.rejected, value: 30 },
    { name: translations.pending, value: 25 }
  ];

  const profitData = [
    { name: 'Ene', potencial: 48000, logrado: 32000 },
    { name: 'Feb', potencial: 52000, logrado: 40000 },
    { name: 'Mar', potencial: 61000, logrado: 45000 },
    { name: 'Abr', potencial: 57000, logrado: 38000 },
    { name: 'May', potencial: 65000, logrado: 50000 },
    { name: 'Jun', potencial: 72000, logrado: 54000 },
  ];

  const quotesPerDayData = [
    { name: 'Lun', value: 12 },
    { name: 'Mar', value: 18 },
    { name: 'Mié', value: 15 },
    { name: 'Jue', value: 20 },
    { name: 'Vie', value: 22 },
  ];

  const conversionRateOverTimeData = [
    { name: 'S1', value: 35 },
    { name: 'S2', value: 42 },
    { name: 'S3', value: 38 },
    { name: 'S4', value: 45 },
    { name: 'S5', value: 48 },
    { name: 'S6', value: 52 },
  ];

  if (isAgent) {
    // Contenido específico para el rol de Agente (Procurement)
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{translations.dashboardSummary}</h2>
          <p className="text-muted-foreground">
            {language === 'es' 
              ? 'Visualiza el rendimiento y las tendencias de procurement de tu negocio' 
              : 'Visualize your business procurement performance and trends'}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{translations.overview}</TabsTrigger>
            <TabsTrigger value="analytics">{translations.analytics}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gráfico principal - Cotizaciones en el tiempo */}
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>{translations.quotesOverTime}</CardTitle>
                  <CardDescription>{translations.overview_subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleLineChart 
                    data={sampleLineData} 
                    color="#3b82f6" 
                    height={250}
                  />
                </CardContent>
              </Card>

              {/* Gráfico circular - Estado de cotizaciones */}
              <Card>
                <CardHeader>
                  <CardTitle>{translations.quoteStatus}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimplePieChart 
                    data={procurementQuoteStatusData} 
                    height={200}
                    label={false}
                    colors={['#22c55e', '#f43f5e', '#f59e0b']}
                  />
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {procurementQuoteStatusData.map((item, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: index === 0 ? '#22c55e' : index === 1 ? '#f43f5e' : '#f59e0b' }}
                        ></div>
                        <span className="text-gray-600">{item.name}</span>
                        <span className="ml-auto font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de barras - Cotizaciones por día */}
              <Card>
                <CardHeader>
                  <CardTitle>{translations.quotesPerDay}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleBarChart 
                    data={quotesPerDayData} 
                    color="#a855f7" 
                    height={200}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gráfico de líneas múltiples - Ganancia potencial vs. lograda */}
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>{translations.grossProfit}</CardTitle>
                  <CardDescription>{translations.analytics_subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <MultiLineChart 
                    data={profitData}
                    lines={[
                      { dataKey: 'potencial', stroke: '#a855f7', name: translations.potentialProfit },
                      { dataKey: 'logrado', stroke: '#22c55e', name: translations.achievedProfit }
                    ]}
                    height={250}
                  />
                </CardContent>
              </Card>

              {/* Gráfico de área - Tasa de conversión */}
              <Card>
                <CardHeader>
                  <CardTitle>{translations.conversionRate}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">48%</span>
                    <span className="text-sm text-green-600 flex items-center">
                      +6.2% 
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <span className="ml-1 text-xs text-gray-500">{translations.increasedFromLast}</span>
                    </span>
                  </div>
                  <SimpleAreaChart 
                    data={conversionRateOverTimeData} 
                    color="#3b82f6" 
                    height={200}
                  />
                </CardContent>
              </Card>

              {/* Gráfico de barras - Tiempo de respuesta */}
              <Card>
                <CardHeader>
                  <CardTitle>{translations.quoteResponseTime}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleBarChart 
                    data={[
                      {name: '<1h', value: 35},
                      {name: '1-4h', value: 45},
                      {name: '4-24h', value: 15},
                      {name: '>24h', value: 5}
                    ]} 
                    color="#f59e0b" 
                    height={200}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  } else {
    // Contenido para el rol de Proveedor (mantener el original)
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
                    color="#14b8a6" 
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
                    color="#0ea5e9" 
                    height={200}
                  />
                </CardContent>
              </Card>

              {/* Gráfico circular - Distribución de vehículos */}
              <Card>
                <CardHeader>
                  <CardTitle>{translations.vehicleDistribution}</CardTitle>
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
                  <CardTitle>{translations.acceptanceRate}</CardTitle>
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

              {/* Gráfico de líneas - Ingresos por mes */}
              <Card>
                <CardHeader>
                  <CardTitle>{translations.revenuePerMonth}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleLineChart 
                    data={sampleLineData} 
                    color="#a855f7" 
                    height={200}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
}