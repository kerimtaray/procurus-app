import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TruckIcon, UserIcon } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useState } from 'react';
import { UserRole } from '@shared/schema';
import useUserStore from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import useLanguageStore from '@/hooks/useLanguage';
import { t } from '@/lib/translations';
import LanguageSelector from '@/components/LanguageSelector';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [_, setLocation] = useLocation();
  const { setUser } = useUserStore();
  const { toast } = useToast();
  const { language } = useLanguageStore();

  const handleLogin = async (role: UserRole) => {
    setLoading(true);
    
    try {
      // For this mock login, we'll use a predefined username
      const username = role === UserRole.AGENT ? 'john.doe' : 'transportes.fast';
      const companyName = role === UserRole.AGENT ? 'Global Imports Inc.' : 'Transportes Fast';
      
      // Make API call to login
      const response = await apiRequest('POST', '/api/login', { username, role });
      const data = await response.json();
      
      // Set user in store
      setUser(username, role, companyName);
      
      // Redirect based on role
      if (role === UserRole.AGENT) {
        setLocation('/agent-dashboard');
      } else {
        setLocation('/provider-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "There was a problem logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <TruckIcon className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Procurus</span>
            </h1>
            <p className="text-gray-600">{t('platform', language)}</p>
          </div>
          
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">
            {t('selectLanguage', language) === "Seleccionar idioma" ? "Selecciona tu rol" : "Choose your role"}
          </h2>
          
          <div className="space-y-4">
            <Button
              onClick={() => handleLogin(UserRole.AGENT)}
              disabled={loading}
              className="w-full bg-primary text-white py-6 flex items-center justify-center space-x-2"
            >
              <UserIcon className="h-5 w-5" />
              <span>{t('loginAs', language)} {t('logisticAgent', language)}</span>
            </Button>
            
            <Button
              onClick={() => handleLogin(UserRole.PROVIDER)}
              disabled={loading}
              className="w-full bg-teal-700 text-white py-6 flex items-center justify-center space-x-2"
            >
              <TruckIcon className="h-5 w-5" />
              <span>{t('loginAs', language)} {t('transportProvider', language)}</span>
            </Button>
            
            <div className="text-center mt-6">
              <p className="text-gray-600">{t('newProvider', language)}</p>
              <Link href="/provider-registration">
                <a className="text-primary hover:underline font-medium">{t('registerHere', language)}</a>
              </Link>
            </div>
            
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-600 mb-2">{t('exploreAllPages', language)}</p>
              <Link href="/demo">
                <a className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                  {t('demoMode', language)}
                </a>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
