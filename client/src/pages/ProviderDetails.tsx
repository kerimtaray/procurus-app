import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Truck as TruckIcon, 
  Briefcase as BriefcaseIcon, 
  Phone as PhoneIcon, 
  Mail as MailIcon, 
  MapPin as MapPinIcon, 
  FileText as FileTextIcon, 
  CreditCard as CreditCardIcon,
  Check as CheckIcon,
  X as XIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Copy as CopyIcon
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import useLanguage from '@/hooks/useLanguage';
import {
  Provider,
  ProviderStatus,
  EquipmentHandled,
  CertificationType
} from '@shared/schema';

export default function ProviderDetails() {
  const { id } = useParams<{ id: string }>();
  const [_, navigate] = useLocation();
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProvider, setEditedProvider] = useState<Partial<Provider>>({});
  
  // Translations
  const t = {
    providerDetails: language === 'es' ? 'Detalles del Proveedor' : 'Provider Details',
    overview: language === 'es' ? 'Vista General' : 'Overview',
    services: language === 'es' ? 'Servicios' : 'Services',
    equipment: language === 'es' ? 'Equipamiento' : 'Equipment',
    coverage: language === 'es' ? 'Cobertura' : 'Coverage',
    contacts: language === 'es' ? 'Contactos' : 'Contacts',
    financialInfo: language === 'es' ? 'Información Financiera' : 'Financial Information',
    editProvider: language === 'es' ? 'Editar Proveedor' : 'Edit Provider',
    saveChanges: language === 'es' ? 'Guardar Cambios' : 'Save Changes',
    cancelEditing: language === 'es' ? 'Cancelar' : 'Cancel',
    approve: language === 'es' ? 'Aprobar' : 'Approve',
    reject: language === 'es' ? 'Rechazar' : 'Reject',
    companyInfo: language === 'es' ? 'Información de la Empresa' : 'Company Information',
    companyName: language === 'es' ? 'Nombre de la Empresa' : 'Company Name',
    rfc: language === 'es' ? 'RFC' : 'RFC',
    address: language === 'es' ? 'Dirección' : 'Address',
    website: language === 'es' ? 'Sitio Web' : 'Website',
    providerType: language === 'es' ? 'Tipo de Proveedor' : 'Provider Type',
    status: language === 'es' ? 'Estado' : 'Status',
    paymentTerms: language === 'es' ? 'Términos de Pago' : 'Payment Terms',
    creditTerms: language === 'es' ? 'Términos de Crédito' : 'Credit Terms',
    serviceAreas: language === 'es' ? 'Áreas de Servicio' : 'Service Areas',
    equipmentTypes: language === 'es' ? 'Tipos de Equipamiento' : 'Equipment Types',
    vehicleTypes: language === 'es' ? 'Tipos de Vehículos' : 'Vehicle Types',
    cargoTypes: language === 'es' ? 'Tipos de Carga' : 'Cargo Types',
    portsCovered: language === 'es' ? 'Puertos Cubiertos' : 'Ports Covered',
    airportsCovered: language === 'es' ? 'Aeropuertos Cubiertos' : 'Airports Covered',
    borderCrossings: language === 'es' ? 'Cruces Fronterizos' : 'Border Crossings',
    contactPerson: language === 'es' ? 'Persona de Contacto' : 'Contact Person',
    phone: language === 'es' ? 'Teléfono' : 'Phone',
    email: language === 'es' ? 'Correo Electrónico' : 'Email',
    position: language === 'es' ? 'Cargo' : 'Position',
    bankInfo: language === 'es' ? 'Información Bancaria' : 'Banking Information',
    bankName: language === 'es' ? 'Nombre del Banco' : 'Bank Name',
    accountNumber: language === 'es' ? 'Número de Cuenta' : 'Account Number',
    clabe: language === 'es' ? 'CLABE' : 'CLABE',
    certifications: language === 'es' ? 'Certificaciones' : 'Certifications',
    approved: language === 'es' ? 'Aprobado' : 'Approved',
    pending: language === 'es' ? 'Pendiente' : 'Pending',
    rejected: language === 'es' ? 'Rechazado' : 'Rejected',
    backToList: language === 'es' ? 'Volver a la Lista' : 'Back to List',
    notFound: language === 'es' ? 'Proveedor no encontrado' : 'Provider not found',
    savedSuccess: language === 'es' ? 'Cambios guardados exitosamente' : 'Changes saved successfully',
    approvedSuccess: language === 'es' ? 'Proveedor aprobado exitosamente' : 'Provider approved successfully',
    rejectedSuccess: language === 'es' ? 'Proveedor rechazado exitosamente' : 'Provider rejected successfully',
    errorSaving: language === 'es' ? 'Error al guardar cambios' : 'Error saving changes',
  };

  // Fetch provider details
  const { data: provider, isLoading } = useQuery<Provider>({
    queryKey: [`/api/providers/${id}`],
    enabled: !!id,
  });

  // Initialize form state when provider data is loaded
  useEffect(() => {
    if (provider) {
      setEditedProvider(provider);
    }
  }, [provider]);

  // Update provider mutation
  const updateProviderMutation = useMutation({
    mutationFn: async (data: Partial<Provider>) => {
      const response = await fetch(`/api/providers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update provider');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/providers/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/providers'] });
      toast({
        title: t.savedSuccess,
        variant: 'default',
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: t.errorSaving,
        variant: 'destructive',
      });
    },
  });

  // Update provider status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: ProviderStatus) => {
      const response = await fetch(`/api/providers/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/providers/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/providers'] });
      
      toast({
        title: variables === ProviderStatus.APPROVED 
          ? t.approvedSuccess 
          : t.rejectedSuccess,
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: t.errorSaving,
        variant: 'destructive',
      });
    },
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProvider(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save changes
  const handleSaveChanges = () => {
    updateProviderMutation.mutate(editedProvider);
  };

  // Handle status update
  const handleStatusUpdate = (status: ProviderStatus) => {
    updateStatusMutation.mutate(status);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: ProviderStatus }) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    let icon = null;
    
    switch (status) {
      case ProviderStatus.APPROVED:
        variant = "default";
        icon = <CheckIcon className="w-4 h-4 mr-1" />;
        break;
      case ProviderStatus.REJECTED:
        variant = "destructive";
        icon = <XIcon className="w-4 h-4 mr-1" />;
        break;
      default:
        variant = "secondary";
        icon = null;
    }
    
    return (
      <Badge variant={variant} className="flex items-center">
        {icon}
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar showBackButton backUrl="/provider-database" backText={t.backToList} />
        <div className="container mx-auto px-4 py-6 flex-1">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar showBackButton backUrl="/provider-database" backText={t.backToList} />
        <div className="container mx-auto px-4 py-6 flex-1">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.notFound}</h2>
              <Button onClick={() => navigate('/provider-database')}>
                {t.backToList}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar showBackButton backUrl="/provider-database" backText={t.backToList} />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{provider.companyName}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge status={provider.status} />
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            {!isEditing ? (
              <>
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <EditIcon className="h-4 w-4" />
                  {t.editProvider}
                </Button>
                
                {provider.status === ProviderStatus.PENDING && (
                  <>
                    <Button 
                      variant="default"
                      onClick={() => handleStatusUpdate(ProviderStatus.APPROVED)}
                      className="flex items-center gap-2"
                    >
                      <CheckIcon className="h-4 w-4" />
                      {t.approve}
                    </Button>
                    
                    <Button 
                      variant="destructive"
                      onClick={() => handleStatusUpdate(ProviderStatus.REJECTED)}
                      className="flex items-center gap-2"
                    >
                      <XIcon className="h-4 w-4" />
                      {t.reject}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="default"
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2"
                  disabled={updateProviderMutation.isPending}
                >
                  {updateProviderMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <SaveIcon className="h-4 w-4" />
                  )}
                  {t.saveChanges}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProvider(provider);
                  }}
                  className="flex items-center gap-2"
                >
                  <XIcon className="h-4 w-4" />
                  {t.cancelEditing}
                </Button>
              </>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="services">{t.services}</TabsTrigger>
            <TabsTrigger value="coverage">{t.coverage}</TabsTrigger>
            <TabsTrigger value="contacts">{t.contacts}</TabsTrigger>
            <TabsTrigger value="financial">{t.financialInfo}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BriefcaseIcon className="h-5 w-5 mr-2" />
                  {t.companyInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">{t.companyName}</Label>
                    {isEditing ? (
                      <Input
                        id="companyName"
                        name="companyName"
                        value={editedProvider.companyName || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="text-gray-700 font-medium">{provider.companyName}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rfc">{t.rfc}</Label>
                    {isEditing ? (
                      <Input
                        id="rfc"
                        name="rfc"
                        value={editedProvider.rfc || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="text-gray-700 font-medium">{provider.rfc}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">{t.address}</Label>
                    {isEditing ? (
                      <Textarea
                        id="address"
                        name="address"
                        value={editedProvider.address || ''}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    ) : (
                      <div className="text-gray-700 whitespace-pre-line">{provider.address || '-'}</div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">{t.website}</Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        name="website"
                        value={editedProvider.website || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="text-gray-700">
                        {provider.website ? (
                          <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {provider.website}
                          </a>
                        ) : (
                          '-'
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="providerType">{t.providerType}</Label>
                    {isEditing ? (
                      <Input
                        id="providerType"
                        name="providerType"
                        value={editedProvider.providerType || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="text-gray-700 font-medium">{provider.providerType || '-'}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>{t.status}</Label>
                    <div>
                      <StatusBadge status={provider.status} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  {t.paymentTerms}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">{t.paymentTerms}</Label>
                  {isEditing ? (
                    <Input
                      id="paymentTerms"
                      name="paymentTerms"
                      value={editedProvider.paymentTerms || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="text-gray-700 font-medium">{provider.paymentTerms || '-'}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="creditTerms">{t.creditTerms}</Label>
                  {isEditing ? (
                    <Input
                      id="creditTerms"
                      name="creditTerms"
                      value={editedProvider.creditTerms || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="text-gray-700 font-medium">{provider.creditTerms || '-'}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2" />
                  {t.serviceAreas}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {provider.serviceAreas?.map((area, index) => (
                    <Badge key={index} variant="outline" className="justify-center py-2">
                      {area}
                    </Badge>
                  )) || (
                    <div className="text-gray-500 italic col-span-full">
                      {language === 'es' ? 'No hay áreas de servicio registradas' : 'No service areas registered'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileTextIcon className="h-5 w-5 mr-2" />
                  {t.certifications}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {provider.certifications?.map((cert, index) => (
                    <Badge key={index} variant="outline" className="justify-center py-2">
                      {cert}
                    </Badge>
                  )) || (
                    <div className="text-gray-500 italic col-span-full">
                      {language === 'es' ? 'No hay certificaciones registradas' : 'No certifications registered'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="coverage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t.portsCovered}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {provider.portsCovered?.map((port, index) => (
                      <Badge key={index} variant="outline" className="justify-center py-2">
                        {port}
                      </Badge>
                    )) || (
                      <div className="text-gray-500 italic">
                        {language === 'es' ? 'No hay puertos registrados' : 'No ports registered'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t.airportsCovered}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {provider.airportsCovered?.map((airport, index) => (
                      <Badge key={index} variant="outline" className="justify-center py-2">
                        {airport}
                      </Badge>
                    )) || (
                      <div className="text-gray-500 italic">
                        {language === 'es' ? 'No hay aeropuertos registrados' : 'No airports registered'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{t.borderCrossings}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {provider.borderCrossings?.map((border, index) => (
                      <Badge key={index} variant="outline" className="justify-center py-2">
                        {border}
                      </Badge>
                    )) || (
                      <div className="text-gray-500 italic col-span-full">
                        {language === 'es' ? 'No hay cruces fronterizos registrados' : 'No border crossings registered'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  {t.contacts}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {provider.contacts?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.contactPerson}</TableHead>
                        <TableHead>{t.position}</TableHead>
                        <TableHead>{t.phone}</TableHead>
                        <TableHead>{t.email}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {provider.contacts.map((contact, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.position}</TableCell>
                          <TableCell>
                            <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                              {contact.phone}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                              {contact.email}
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-gray-500 italic">
                    {language === 'es' ? 'No hay contactos registrados' : 'No contacts registered'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  {t.bankInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {provider.bankingInfo ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{t.bankName}</Label>
                      <div className="text-gray-700 font-medium">
                        {provider.bankingInfo.bankName || '-'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t.accountNumber}</Label>
                      <div className="flex items-center space-x-2">
                        <div className="text-gray-700 font-medium">
                          {provider.bankingInfo.accountNumber || '-'}
                        </div>
                        {provider.bankingInfo.accountNumber && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={() => {
                              navigator.clipboard.writeText(provider.bankingInfo?.accountNumber || '');
                              toast({
                                title: 'Copied to clipboard',
                                duration: 2000,
                              });
                            }}
                          >
                            <CopyIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t.clabe}</Label>
                      <div className="flex items-center space-x-2">
                        <div className="text-gray-700 font-medium">
                          {provider.bankingInfo.clabe || '-'}
                        </div>
                        {provider.bankingInfo.clabe && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={() => {
                              navigator.clipboard.writeText(provider.bankingInfo?.clabe || '');
                              toast({
                                title: 'Copied to clipboard',
                                duration: 2000,
                              });
                            }}
                          >
                            <CopyIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">
                    {language === 'es' ? 'No hay información bancaria registrada' : 'No banking information registered'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}