import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { LogOut, Menu as MenuIcon } from 'lucide-react';
import { useLanguageStore } from '@/hooks/useLanguage';
import { t } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserRole } from '@shared/schema';
import useUserStore from '@/hooks/useUserRole';

interface NavbarProps {
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
}

export default function Navbar({ showBackButton = false, backUrl = "/", backText = "Back to Dashboard" }: NavbarProps) {
  const { username, role, companyName, resetUser } = useUserStore();
  const { language } = useLanguageStore();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get first letters of company name for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    resetUser();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Procurus</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <select
              value={language}
              onChange={(e) => useLanguageStore.setState({ language: e.target.value })}
              className="text-sm text-gray-600 border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>

            {/* Navigation links - desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href={role === UserRole.AGENT ? '/agent-dashboard' : '/provider-dashboard'}>
                <Button variant="ghost">
                  {t('dashboard', language)}
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                {t('logout', language)}
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback className="text-primary">
                    {companyName ? getInitials(companyName) : username?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium text-gray-700">{companyName || username}</div>
                  <div className="text-gray-500">{role === UserRole.AGENT ? t('agent', language) : t('provider', language)}</div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-primary"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 space-y-2">
            <Link href={role === UserRole.AGENT ? '/agent-dashboard' : '/provider-dashboard'}>
              <Button variant="ghost" className="w-full justify-start">
                {t('dashboard', language)}
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              {t('logout', language)}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}