import { create } from 'zustand';

export type Language = 'en' | 'es';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
}));

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
  | 'reviewQuotes'
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
  | 'spanish'
  // Dashboard y booking terms
  | 'welcome'
  | 'bookings'
  | 'totalBookings'
  | 'pendingBookings'
  | 'assignedBookings'
  | 'potentialProfit'
  | 'totalQuotesReceived'
  | 'avgQuotesPerBooking'
  | 'viewAnalytics'
  | 'search'
  | 'status'
  | 'all'
  | 'pending'
  | 'assigned'
  | 'inTransit'
  | 'completed'
  | 'cancelled'
  | 'sortBy'
  | 'date'
  | 'client'
  | 'offers'
  | 'profit'
  | 'urgency'
  | 'high'
  | 'medium'
  | 'low'
  | 'requestId'
  | 'providersContacted'
  | 'quotesReceived'
  | 'bestOffer'
  | 'route'
  | 'action'
  | 'viewQuotes'
  | 'noResults'
  | 'loading'
  | 'noQuotes'
  | 'clearFilters';

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
  reviewQuotes: {
    en: 'Review Quotes',
    es: 'Revisar Cotizaciones'
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
    en: 'AI Procurement Platform',
    es: 'Plataforma de Adquisiciones IA'
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
  },
  // Dashboard y booking terms
  welcome: {
    en: 'Welcome',
    es: 'Bienvenido'
  },
  bookings: {
    en: 'Bookings',
    es: 'Solicitudes de Viaje'
  },
  totalBookings: {
    en: 'Total Bookings',
    es: 'Total de Solicitudes'
  },
  pendingBookings: {
    en: 'Pending Bookings',
    es: 'Solicitudes Pendientes'
  },
  assignedBookings: {
    en: 'Assigned Bookings',
    es: 'Solicitudes Asignadas'
  },
  potentialProfit: {
    en: 'Potential Profit',
    es: 'Ganancia Potencial'
  },
  totalQuotesReceived: {
    en: 'Quotes Received',
    es: 'Ofertas Recibidas'
  },
  avgQuotesPerBooking: {
    en: 'Avg. Quotes/Booking',
    es: 'Prom. Ofertas/Solicitud'
  },
  viewAnalytics: {
    en: 'View Analytics',
    es: 'Ver Análisis'
  },
  search: {
    en: 'Search...',
    es: 'Buscar...'
  },
  status: {
    en: 'Status',
    es: 'Estado'
  },
  all: {
    en: 'All',
    es: 'Todos'
  },
  pending: {
    en: 'Pending',
    es: 'Pendiente'
  },
  assigned: {
    en: 'Assigned',
    es: 'Asignada'
  },
  inTransit: {
    en: 'In Transit',
    es: 'En Tránsito'
  },
  completed: {
    en: 'Completed',
    es: 'Completada'
  },
  cancelled: {
    en: 'Cancelled',
    es: 'Cancelada'
  },
  sortBy: {
    en: 'Sort by',
    es: 'Ordenar por'
  },
  date: {
    en: 'Date',
    es: 'Fecha'
  },
  client: {
    en: 'Client',
    es: 'Cliente'
  },
  offers: {
    en: 'Offers',
    es: 'Ofertas'
  },
  profit: {
    en: 'Profit',
    es: 'Ganancia'
  },
  urgency: {
    en: 'Urgency',
    es: 'Urgencia'
  },
  high: {
    en: 'High',
    es: 'Alta'
  },
  medium: {
    en: 'Medium',
    es: 'Media'
  },
  low: {
    en: 'Low',
    es: 'Baja'
  },
  requestId: {
    en: 'Request ID',
    es: 'ID de Solicitud'
  },
  providersContacted: {
    en: 'Prov. Contacted',
    es: 'Prov. Contactados'
  },
  quotesReceived: {
    en: 'Quotes Received',
    es: 'Ofertas Recibidas'
  },
  bestOffer: {
    en: 'Best Offer',
    es: 'Mejor Oferta'
  },
  route: {
    en: 'Route',
    es: 'Ruta'
  },
  action: {
    en: 'Action',
    es: 'Acción'
  },
  viewQuotes: {
    en: 'View Quotes',
    es: 'Ver Ofertas'
  },
  noResults: {
    en: 'No bookings found',
    es: 'No se encontraron solicitudes'
  },
  loading: {
    en: 'Loading bookings...',
    es: 'Cargando solicitudes...'
  },
  noQuotes: {
    en: 'No quotes',
    es: 'Sin ofertas'
  },
  clearFilters: {
    en: 'Clear filters',
    es: 'Limpiar filtros'
  }
};

export const t = (key: TranslationKey, language: Language): string => {
  return translations[key][language];
};

// Función de traducción general para usar en cualquier cadena
export const translateUI = (key: string, language: Language): string => {
  // Primero intentamos buscar en las traducciones predefinidas
  if (key in translations) {
    return translations[key as TranslationKey][language];
  }
  
  // Si no existe como clave, devolvemos la cadena original
  return key;
};