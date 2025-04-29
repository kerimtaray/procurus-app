import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { Loader2, Plus, Search, Upload, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Provider, ProviderStatus } from '@shared/schema';
import useLanguage from '@/hooks/useLanguage';

export default function ProviderDatabase() {
  const [_, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useLanguage();
  
  // Fetch providers
  const { data: providers, isLoading } = useQuery<Provider[]>({
    queryKey: ['/api/providers'],
  });

  // Filter providers based on search term
  const filteredProviders = providers?.filter(provider => 
    provider.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.rfc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status badge component
  const StatusBadge = ({ status }: { status: ProviderStatus }) => {
    let color;
    let icon;
    
    switch (status) {
      case ProviderStatus.APPROVED:
        color = 'bg-green-100 text-green-800';
        icon = <Check className="w-4 h-4 mr-1" />;
        break;
      case ProviderStatus.REJECTED:
        color = 'bg-red-100 text-red-800';
        icon = <X className="w-4 h-4 mr-1" />;
        break;
      default:
        color = 'bg-yellow-100 text-yellow-800';
        icon = <Loader2 className="w-4 h-4 mr-1 animate-spin" />;
    }
    
    return (
      <span className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${color}`}>
        {icon}
        {status}
      </span>
    );
  };

  // Handle provider click
  const handleProviderClick = (providerId: number) => {
    setLocation(`/provider-details/${providerId}`);
  };

  // Handle add new provider
  const handleAddProvider = () => {
    setLocation('/add-provider');
  };

  // Handle upload CSV/Excel
  const handleUpload = () => {
    setLocation('/upload-providers');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar showBackButton backUrl="/agent-dashboard" />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'es' ? 'Base de Datos de Proveedores' : 'Provider Database'}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleUpload}>
              <Upload className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Importar Excel' : 'Import Excel'}
            </Button>
            <Button onClick={handleAddProvider}>
              <Plus className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Nuevo Proveedor' : 'New Provider'}
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {language === 'es' ? 'Proveedores Registrados' : 'Registered Providers'}
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'es' ? 'Buscar proveedor...' : 'Search provider...'}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  {language === 'es' ? 'Todos' : 'All'}
                </TabsTrigger>
                <TabsTrigger value="approved">
                  {language === 'es' ? 'Aprobados' : 'Approved'}
                </TabsTrigger>
                <TabsTrigger value="pending">
                  {language === 'es' ? 'Pendientes' : 'Pending'}
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  {language === 'es' ? 'Rechazados' : 'Rejected'}
                </TabsTrigger>
              </TabsList>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <TabsContent value="all" className="m-0">
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{language === 'es' ? 'Nombre de la Empresa' : 'Company Name'}</TableHead>
                            <TableHead>{language === 'es' ? 'RFC' : 'RFC'}</TableHead>
                            <TableHead>{language === 'es' ? 'Tipo de Proveedor' : 'Provider Type'}</TableHead>
                            <TableHead>{language === 'es' ? 'Términos de Pago' : 'Payment Terms'}</TableHead>
                            <TableHead>{language === 'es' ? 'Estado' : 'Status'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProviders?.length ? (
                            filteredProviders.map((provider) => (
                              <TableRow 
                                key={provider.id}
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleProviderClick(provider.id)}
                              >
                                <TableCell className="font-medium">{provider.companyName}</TableCell>
                                <TableCell>{provider.rfc}</TableCell>
                                <TableCell>{provider.providerType || '-'}</TableCell>
                                <TableCell>{provider.paymentTerms || '-'}</TableCell>
                                <TableCell>
                                  <StatusBadge status={provider.status} />
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                {searchTerm
                                  ? (language === 'es' ? 'No se encontraron proveedores con ese criterio de búsqueda' : 'No providers found with that search criteria')
                                  : (language === 'es' ? 'No hay proveedores registrados' : 'No providers registered yet')}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  {/* Tabs for future implementation */}
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}