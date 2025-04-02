import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserRole } from '@shared/schema';
import useUserStore from '@/hooks/useUserRole';
import { useLocation } from 'wouter';
import useLanguageStore from '@/hooks/useLanguage';
import { t } from '@/lib/translations';
import LanguageSelector from '@/components/LanguageSelector';

export default function Demo() {
  const [_, setLocation] = useLocation();
  const { setUser } = useUserStore();
  const { language } = useLanguageStore();
  
  // Function to handle automatic login and redirection
  const goToPage = (path: string, role: UserRole = UserRole.AGENT) => {
    // Login with appropriate role
    const username = role === UserRole.AGENT ? 'john.doe' : 'transportes.fast';
    const companyName = role === UserRole.AGENT ? 'Global Imports Inc.' : 'Transportes Fast';
    
    setUser(username, role, companyName);
    
    // Navigate to the requested page
    setLocation(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <Card className="max-w-4xl w-full">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Procurus</span> {t('demoMode', language)}
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            {language === 'es' ? 
              'Utiliza estos accesos directos para ver las diferentes pantallas de la aplicación sin tener que completar todos los pasos previos.' :
              'Use these shortcuts to view the different screens of the application without having to complete all the previous steps.'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Páginas de Agente Logístico' : 'Logistics Agent Pages'}
              </h2>
              
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => goToPage('/agent-dashboard', UserRole.AGENT)}
              >
                {t('agentDashboard', language)}
              </Button>
              
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => goToPage('/create-request', UserRole.AGENT)}
              >
                {t('createRequest', language)}
              </Button>

              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => goToPage('/active-requests', UserRole.AGENT)}
              >
                {language === 'es' ? 'Solicitudes Activas' : 'Active Requests'}
              </Button>
              
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => goToPage('/matching-results/1', UserRole.AGENT)}
              >
                {t('matchingResults', language)}
              </Button>
              
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => goToPage('/review-bids/1', UserRole.AGENT)}
              >
                {t('reviewQuotes', language)}
              </Button>
              
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => goToPage('/instruction-letter/1', UserRole.AGENT)}
              >
                {t('instructionLetter', language)}
              </Button>
              
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => goToPage('/feedback/1', UserRole.AGENT)}
              >
                {t('feedback', language)}
              </Button>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Páginas de Proveedor de Transporte' : 'Transport Provider Pages'}
              </h2>
              
              <Button 
                className="w-full justify-start bg-teal-700 hover:bg-teal-800"
                onClick={() => goToPage('/provider-dashboard', UserRole.PROVIDER)}
              >
                {t('providerDashboard', language)}
              </Button>
              
              <Button 
                className="w-full justify-start bg-teal-700 hover:bg-teal-800"
                onClick={() => goToPage('/submit-quote/1', UserRole.PROVIDER)}
              >
                {t('submitQuote', language)}
              </Button>
              
              <Button 
                className="w-full justify-start bg-teal-700 hover:bg-teal-800"
                onClick={() => goToPage('/provider-registration')}
              >
                {t('providerRegistration', language)}
              </Button>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-700 mb-2">
                  {t('otherPages', language)}
                </h2>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setLocation('/')}
                >
                  {t('loginPage', language)}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}