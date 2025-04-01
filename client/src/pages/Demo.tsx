import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserRole } from '@shared/schema';
import useUserStore from '@/hooks/useUserRole';
import { useLocation } from 'wouter';

export default function Demo() {
  const [_, setLocation] = useLocation();
  const { setUser } = useUserStore();
  
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
      <Card className="max-w-4xl w-full">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">LogiConnect Demo Navigator</h1>
          <p className="text-gray-600 mb-8 text-center">
            Utiliza estos accesos directos para ver las diferentes pantallas de la aplicación sin tener que completar todos los pasos previos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Páginas de Agente Logístico</h2>
              
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => goToPage('/agent-dashboard', UserRole.AGENT)}
              >
                Panel de Agente
              </Button>
              
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => goToPage('/create-request', UserRole.AGENT)}
              >
                Crear Solicitud
              </Button>
              
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => goToPage('/matching-results/1', UserRole.AGENT)}
              >
                Resultados de Coincidencia
              </Button>
              
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => goToPage('/instruction-letter/1', UserRole.AGENT)}
              >
                Carta de Instrucción
              </Button>
              
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => goToPage('/feedback/1', UserRole.AGENT)}
              >
                Formulario de Retroalimentación
              </Button>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Páginas de Proveedor de Transporte</h2>
              
              <Button 
                className="w-full justify-start bg-teal-700 hover:bg-teal-800"
                onClick={() => goToPage('/provider-dashboard', UserRole.PROVIDER)}
              >
                Panel de Proveedor
              </Button>
              
              <Button 
                className="w-full justify-start bg-teal-700 hover:bg-teal-800"
                onClick={() => goToPage('/submit-quote/1', UserRole.PROVIDER)}
              >
                Enviar Cotización
              </Button>
              
              <Button 
                className="w-full justify-start bg-teal-700 hover:bg-teal-800"
                onClick={() => goToPage('/provider-registration')}
              >
                Registro de Proveedor
              </Button>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Otros</h2>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setLocation('/')}
                >
                  Página de Inicio de Sesión
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}