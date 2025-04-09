import React from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import DashboardSummary from '@/components/DashboardSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserRole } from '@shared/schema';
import useUserStore from '@/hooks/useUserRole';
import useLanguage from '@/hooks/useLanguage';
import { ArrowLeftIcon } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [_, setLocation] = useLocation();
  const { role } = useUserStore();
  const { language } = useLanguage();
  
  // Traducciones
  const t = {
    analyticsDashboard: language === 'es' ? 'Panel de Análisis' : 'Analytics Dashboard',
    description: language === 'es' 
      ? 'Visualiza el rendimiento y las tendencias de tu negocio con estadísticas detalladas'
      : 'Visualize your business performance and trends with detailed statistics',
    backToDashboard: language === 'es' ? 'Volver al Dashboard' : 'Back to Dashboard',
    performanceMetrics: language === 'es' ? 'Métricas de Rendimiento' : 'Performance Metrics',
    quotes: language === 'es' ? 'Cotizaciones' : 'Quotes',
    revenue: language === 'es' ? 'Ingresos' : 'Revenue',
    conversion: language === 'es' ? 'Conversión' : 'Conversion',
    response: language === 'es' ? 'Respuesta' : 'Response',
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {t.analyticsDashboard}
              </h1>
              <p className="text-gray-600 mt-1">
                {t.description}
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setLocation('/')}
              className="flex items-center"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              {t.backToDashboard}
            </Button>
          </div>
          
          {/* Additional Metrics Section moved to the top as requested */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t.performanceMetrics}</CardTitle>
                <CardDescription>
                  {language === 'es' 
                    ? 'Métricas de rendimiento adicionales detalladas por período' 
                    : 'Additional performance metrics detailed by period'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Quotes Metric */}
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500">{t.quotes}</h3>
                      <span className="text-green-600 bg-green-50 text-xs px-2 py-1 rounded-full font-medium">
                        +12%
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-2xl font-bold">267</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'es' ? 'vs 238 último mes' : 'vs 238 last month'}
                      </p>
                    </div>
                    <div className="mt-3 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  {/* Revenue Metric */}
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500">{t.revenue}</h3>
                      <span className="text-green-600 bg-green-50 text-xs px-2 py-1 rounded-full font-medium">
                        +8%
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-2xl font-bold">$487K</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'es' ? 'vs $450K último mes' : 'vs $450K last month'}
                      </p>
                    </div>
                    <div className="mt-3 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  
                  {/* Conversion Metric */}
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500">{t.conversion}</h3>
                      <span className="text-green-600 bg-green-50 text-xs px-2 py-1 rounded-full font-medium">
                        +5%
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-2xl font-bold">48%</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'es' ? 'vs 43% último mes' : 'vs 43% last month'}
                      </p>
                    </div>
                    <div className="mt-3 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>
                  
                  {/* Response Time Metric */}
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500">{t.response}</h3>
                      <span className="text-red-600 bg-red-50 text-xs px-2 py-1 rounded-full font-medium">
                        +2%
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-2xl font-bold">2.1h</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'es' ? 'vs 1.8h último mes' : 'vs 1.8h last month'}
                      </p>
                    </div>
                    <div className="mt-3 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Dashboard Summary with charts - Moved below performance metrics */}
          <div className="mb-8">
            <DashboardSummary role={role || UserRole.AGENT} />
          </div>
        </div>
      </div>
    </div>
  );
}