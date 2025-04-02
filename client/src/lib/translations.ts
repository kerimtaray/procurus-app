import { Language } from '@/hooks/useLanguage';

type TranslationKey = 
  | 'login'
  | 'logisticAgent'
  | 'transportProvider'
  | 'loginAs'
  | 'newProvider'
  | 'registerHere'
  | 'demoMode'
  | 'exploreAllPages'
  | 'agentDashboard'
  | 'providerDashboard'
  | 'createRequest'
  | 'matchingResults'
  | 'instructionLetter'
  | 'feedback'
  | 'submitQuote'
  | 'providerRegistration'
  | 'otherPages'
  | 'loginPage'
  | 'welcomeTo'
  | 'platform'
  | 'selectLanguage'
  | 'english'
  | 'spanish';

type Translations = {
  [key in TranslationKey]: {
    en: string;
    es: string;
  }
};

export const translations: Translations = {
  login: {
    en: 'Login',
    es: 'Iniciar Sesión'
  },
  logisticAgent: {
    en: 'Logistics Agent',
    es: 'Agente Logístico'
  },
  transportProvider: {
    en: 'Transport Provider',
    es: 'Proveedor de Transporte'
  },
  loginAs: {
    en: 'Login as',
    es: 'Ingresar como'
  },
  newProvider: {
    en: 'New provider?',
    es: '¿Nuevo proveedor?'
  },
  registerHere: {
    en: 'Register here',
    es: 'Regístrate aquí'
  },
  demoMode: {
    en: 'Demo Mode',
    es: 'Modo Demostración'
  },
  exploreAllPages: {
    en: 'Want to explore all pages?',
    es: '¿Quieres explorar todas las páginas?'
  },
  agentDashboard: {
    en: 'Agent Dashboard',
    es: 'Panel de Agente'
  },
  providerDashboard: {
    en: 'Provider Dashboard',
    es: 'Panel de Proveedor'
  },
  createRequest: {
    en: 'Create Request',
    es: 'Crear Solicitud'
  },
  matchingResults: {
    en: 'Matching Results',
    es: 'Resultados de Coincidencia'
  },
  instructionLetter: {
    en: 'Instruction Letter',
    es: 'Carta de Instrucción'
  },
  feedback: {
    en: 'Feedback',
    es: 'Retroalimentación'
  },
  submitQuote: {
    en: 'Submit Quote',
    es: 'Enviar Cotización'
  },
  providerRegistration: {
    en: 'Provider Registration',
    es: 'Registro de Proveedor'
  },
  otherPages: {
    en: 'Other Pages',
    es: 'Otras Páginas'
  },
  loginPage: {
    en: 'Login Page',
    es: 'Página de Inicio de Sesión'
  },
  welcomeTo: {
    en: 'Welcome to',
    es: 'Bienvenido a'
  },
  platform: {
    en: 'Logistics Marketplace Platform',
    es: 'Plataforma de Mercado Logístico'
  },
  selectLanguage: {
    en: 'Select language',
    es: 'Seleccionar idioma'
  },
  english: {
    en: 'English',
    es: 'Inglés'
  },
  spanish: {
    en: 'Spanish',
    es: 'Español'
  }
};

export const t = (key: TranslationKey, language: Language): string => {
  return translations[key][language];
};