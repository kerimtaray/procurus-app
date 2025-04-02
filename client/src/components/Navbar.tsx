import { Link } from 'wouter';
import { TruckIcon, UserIcon, ChevronDownIcon, LogOutIcon, SettingsIcon } from 'lucide-react';
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

            {role === UserRole.AGENT && !showBackButton && (
              <>
                <Link href="/create-request">
                  <Button variant="ghost" className="text-gray-600 hover:text-primary">
                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    {language === 'es' ? 'Nueva Solicitud' : 'New Request'}
                  </Button>
                </Link>
                <span className="text-gray-600">|</span>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center text-gray-600">
                  <Avatar className={`h-8 w-8 mr-2 ${role === UserRole.AGENT ? 'bg-primary' : 'bg-teal-700'} text-white`}>
                    <AvatarFallback>{getInitials(companyName || username)}</AvatarFallback>
                  </Avatar>
                  <span>{companyName || username}</span>
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
      </div>
    </nav>
  );
}
