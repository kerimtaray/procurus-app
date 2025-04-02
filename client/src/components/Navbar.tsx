import { Link, useLocation } from 'wouter';
import { 
  TruckIcon, 
  UserIcon, 
  ChevronDownIcon, 
  LogOutIcon, 
  SettingsIcon, 
  LayoutDashboardIcon, 
  ClipboardListIcon,
  PlusCircleIcon, 
  ListChecksIcon,
  UserCheckIcon,
  MenuIcon
} from 'lucide-react';
import { useState } from 'react';
import useUserStore from '@/hooks/useUserRole';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserRole } from '@shared/schema';
import useLanguageStore from '@/hooks/useLanguage';
import { t } from '@/lib/translations';
import LanguageSelector from '@/components/LanguageSelector';

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

  // Define navigation items based on user role
  const navItems = role === UserRole.AGENT ? [
    {
      name: language === 'es' ? 'Panel Principal' : 'Dashboard',
      icon: <LayoutDashboardIcon className="h-4 w-4 mr-2" />,
      href: '/agent-dashboard',
      active: location === '/agent-dashboard'
    },
    {
      name: language === 'es' ? 'Nueva Solicitud' : 'New Request',
      icon: <PlusCircleIcon className="h-4 w-4 mr-2" />,
      href: '/create-request',
      active: location === '/create-request'
    },
    {
      name: language === 'es' ? 'Solicitudes Activas' : 'Active Requests',
      icon: <ClipboardListIcon className="h-4 w-4 mr-2" />,
      href: '/active-requests',
      active: location === '/active-requests'
    },
    {
      name: language === 'es' ? 'Revisar Cotizaciones' : 'Review Quotes',
      icon: <ListChecksIcon className="h-4 w-4 mr-2" />,
      href: '/review-bids/1', // Will need dynamic ID in real app
      active: location.startsWith('/review-bids/')
    }
  ] : [
    {
      name: language === 'es' ? 'Panel Principal' : 'Dashboard',
      icon: <LayoutDashboardIcon className="h-4 w-4 mr-2" />,
      href: '/provider-dashboard',
      active: location === '/provider-dashboard'
    },
    {
      name: language === 'es' ? 'Cotizar Solicitudes' : 'Submit Quotes',
      icon: <TruckIcon className="h-4 w-4 mr-2" />,
      href: '/submit-quote/1', // Will need dynamic ID in real app
      active: location.startsWith('/submit-quote/')
    }
  ];
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Navigation Bar */}
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={role === UserRole.AGENT ? '/agent-dashboard' : '/provider-dashboard'}>
              <div className="flex items-center cursor-pointer">
                <TruckIcon className={`h-6 w-6 mr-2 ${role === UserRole.AGENT ? 'text-primary' : 'text-teal-700'}`} />
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Procurus</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                  item.active 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                }`}>
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
          
          {/* User dropdown and mobile menu button */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <>
                <Link href={backUrl}>
                  <Button variant="ghost" className="text-gray-600 hover:text-primary">
                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    {backText}
                  </Button>
                </Link>
                <span className="text-gray-600">|</span>
              </>
            )}
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-primary"
            >
              <MenuIcon className="h-6 w-6" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center text-gray-600">
                  <Avatar className={`h-8 w-8 mr-2 ${role === UserRole.AGENT ? 'bg-primary' : 'bg-teal-700'} text-white`}>
                    <AvatarFallback>{getInitials(companyName || username)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{companyName || username}</span>
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>{role === UserRole.AGENT ? 
                    (language === 'es' ? 'Tu Perfil' : 'Your Profile') : 
                    (language === 'es' ? 'Perfil de Empresa' : 'Company Profile')}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>{language === 'es' ? 'Configuración' : 'Settings'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <LanguageSelector />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>{language === 'es' ? 'Cerrar sesión' : 'Sign out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 space-y-1 border-t">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center px-4 py-2 text-base font-medium cursor-pointer ${
                  item.active 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                }`}>
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
