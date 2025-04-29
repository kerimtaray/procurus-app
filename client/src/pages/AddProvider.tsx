import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { apiRequest, queryClient } from '@/lib/queryClient';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import useLanguage from '@/hooks/useLanguage';
import {
  PaymentTerms,
  CreditTerms,
  ProviderType,
  EquipmentHandled,
  PortsCovered,
  AirportsCovered,
  BorderCrossings,
  CargoTypesHandled,
  CurrencyType,
  bankingReferenceSchema,
  contactInfoSchema,
} from '@shared/schema';

// Create a schema for the form
const formSchema = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  rfc: z.string().min(1, { message: "RFC is required" }),
  paymentTerms: z.nativeEnum(PaymentTerms).optional(),
  creditTerms: z.nativeEnum(CreditTerms).optional(),
  bankingReferences: z.array(bankingReferenceSchema).optional(),
  quotationContact: contactInfoSchema.optional(),
  providerType: z.nativeEnum(ProviderType).optional(),
  equipmentHandled: z.array(z.nativeEnum(EquipmentHandled)).optional(),
  portsCovered: z.array(z.nativeEnum(PortsCovered)).optional(),
  airportsCovered: z.array(z.nativeEnum(AirportsCovered)).optional(),
  borderCrossings: z.array(z.nativeEnum(BorderCrossings)).optional(),
  cargoTypesHandled: z.array(z.nativeEnum(CargoTypesHandled)).optional(),
  storageYardsLocation: z.array(z.string()).optional(),
  currency: z.nativeEnum(CurrencyType).default(CurrencyType.MXN),
});

type ProviderFormValues = z.infer<typeof formSchema>;

// Create a component for adding a banking reference
const BankingReferenceForm = ({ index, onRemove, form }: any) => {
  const { language } = useLanguage();
  
  return (
    <div className="p-4 border rounded-md mb-4 relative">
      <button 
        type="button" 
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        ✕
      </button>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`bankingReferences.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'es' ? 'Nombre de Referencia' : 'Reference Name'}*
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`bankingReferences.${index}.email`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'es' ? 'Email' : 'Email'}
              </FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="example@company.com" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`bankingReferences.${index}.phone`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'es' ? 'Teléfono' : 'Phone'}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="+52 123 456 7890" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`bankingReferences.${index}.address`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'es' ? 'Dirección' : 'Address'}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

// Mexican states for storage yards location
const mexicanStates = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 
  'Chihuahua', 'Coahuila', 'Colima', 'Ciudad de México', 'Durango', 
  'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México', 
  'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 
  'Yucatán', 'Zacatecas'
];

// US states for storage yards location
const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// Canadian provinces for storage yards location
const canadianProvinces = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
  'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
  'Quebec', 'Saskatchewan', 'Yukon'
];

export default function AddProvider() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankingReferencesCount, setBankingReferencesCount] = useState(0);
  
  // Initialize form
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      rfc: "",
      bankingReferences: [],
      quotationContact: {
        name: "",
        phone: "",
        email: "",
      },
      equipmentHandled: [],
      portsCovered: [],
      airportsCovered: [],
      borderCrossings: [],
      cargoTypesHandled: [],
      storageYardsLocation: [],
      currency: CurrencyType.MXN,
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: ProviderFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create provider
      const provider = await apiRequest('/api/providers', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      // Show success message
      toast({
        title: language === 'es' ? 'Proveedor creado' : 'Provider created',
        description: language === 'es' 
          ? `${data.companyName} ha sido agregado a la base de datos`
          : `${data.companyName} has been added to the database`,
      });
      
      // Invalidate providers cache and redirect
      queryClient.invalidateQueries({ queryKey: ['/api/providers'] });
      setLocation('/provider-database');
    } catch (error) {
      console.error('Error creating provider:', error);
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es'
          ? 'Hubo un problema al crear el proveedor. Por favor, inténtalo de nuevo.'
          : 'There was a problem creating the provider. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Add a banking reference
  const addBankingReference = () => {
    const currentReferences = form.getValues('bankingReferences') || [];
    form.setValue('bankingReferences', [
      ...currentReferences,
      { name: '', email: '', phone: '', address: '' }
    ]);
    setBankingReferencesCount(prev => prev + 1);
  };
  
  // Remove a banking reference
  const removeBankingReference = (index: number) => {
    const currentReferences = form.getValues('bankingReferences') || [];
    const newReferences = [...currentReferences];
    newReferences.splice(index, 1);
    form.setValue('bankingReferences', newReferences);
    setBankingReferencesCount(prev => prev - 1);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar showBackButton backUrl="/provider-database" />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'es' ? 'Agregar Nuevo Proveedor' : 'Add New Provider'}
          </h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'es' ? 'Información Básica' : 'Basic Information'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'es' 
                      ? 'Información general del proveedor de transporte' 
                      : 'General information about the transport provider'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === 'es' ? 'Nombre de la Empresa' : 'Company Name'}*
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rfc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RFC*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="providerType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === 'es' ? 'Tipo de Proveedor' : 'Provider Type'}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue 
                                  placeholder={language === 'es' 
                                    ? 'Seleccionar tipo' 
                                    : 'Select type'}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(ProviderType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === 'es' ? 'Moneda' : 'Currency'}*
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue 
                                  placeholder={language === 'es' 
                                    ? 'Seleccionar moneda' 
                                    : 'Select currency'}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(CurrencyType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'es' ? 'Términos de Pago' : 'Payment Terms'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="paymentTerms"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            {language === 'es' ? 'Términos de Pago' : 'Payment Terms'}
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              {Object.values(PaymentTerms).map((term) => (
                                <div key={term} className="flex items-center space-x-2">
                                  <RadioGroupItem value={term} id={`payment-${term}`} />
                                  <Label htmlFor={`payment-${term}`}>{term}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="creditTerms"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            {language === 'es' ? 'Términos de Crédito' : 'Credit Terms'}
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              {Object.values(CreditTerms).map((term) => (
                                <div key={term} className="flex items-center space-x-2">
                                  <RadioGroupItem value={term} id={`credit-${term}`} />
                                  <Label htmlFor={`credit-${term}`}>{term}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'es' ? 'Referencias Bancarias' : 'Banking References'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: bankingReferencesCount }).map((_, index) => (
                    <BankingReferenceForm
                      key={index}
                      index={index}
                      onRemove={() => removeBankingReference(index)}
                      form={form}
                    />
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addBankingReference}
                  >
                    {language === 'es' ? '+ Agregar Referencia Bancaria' : '+ Add Banking Reference'}
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'es' ? 'Contacto para Cotizaciones' : 'Quotation Contact'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="quotationContact.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === 'es' ? 'Nombre' : 'Name'}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="quotationContact.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === 'es' ? 'Teléfono' : 'Phone'}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="quotationContact.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === 'es' ? 'Email' : 'Email'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="contact@company.com" 
                              {...field} 
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="equipment">
                  <AccordionTrigger className="p-4 bg-white rounded-t-lg border shadow-sm">
                    {language === 'es' ? 'Equipo y Cobertura' : 'Equipment & Coverage'}
                  </AccordionTrigger>
                  <AccordionContent className="border border-t-0 rounded-b-lg p-4 bg-white">
                    <div className="space-y-6">
                      {/* Equipment Handled */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {language === 'es' ? 'Equipo Manejado' : 'Equipment Handled'}
                        </h3>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <FormField
                            control={form.control}
                            name="equipmentHandled"
                            render={({ field }) => (
                              <FormItem>
                                <div className="grid grid-cols-1 gap-2">
                                  {Object.values(EquipmentHandled).map((equipment) => (
                                    <div key={equipment} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`equipment-${equipment}`}
                                        checked={field.value?.includes(equipment)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValue, equipment]);
                                          } else {
                                            field.onChange(
                                              currentValue.filter((value) => value !== equipment)
                                            );
                                          }
                                        }}
                                      />
                                      <Label htmlFor={`equipment-${equipment}`}>{equipment}</Label>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Ports Covered */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {language === 'es' ? 'Puertos Cubiertos' : 'Ports Covered'}
                        </h3>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <FormField
                            control={form.control}
                            name="portsCovered"
                            render={({ field }) => (
                              <FormItem>
                                <div className="grid grid-cols-1 gap-2">
                                  {Object.values(PortsCovered).map((port) => (
                                    <div key={port} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`port-${port}`}
                                        checked={field.value?.includes(port)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValue, port]);
                                          } else {
                                            field.onChange(
                                              currentValue.filter((value) => value !== port)
                                            );
                                          }
                                        }}
                                      />
                                      <Label htmlFor={`port-${port}`}>{port}</Label>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Airports Covered */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {language === 'es' ? 'Aeropuertos Cubiertos' : 'Airports Covered'}
                        </h3>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <FormField
                            control={form.control}
                            name="airportsCovered"
                            render={({ field }) => (
                              <FormItem>
                                <div className="grid grid-cols-1 gap-2">
                                  {Object.values(AirportsCovered).map((airport) => (
                                    <div key={airport} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`airport-${airport}`}
                                        checked={field.value?.includes(airport)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValue, airport]);
                                          } else {
                                            field.onChange(
                                              currentValue.filter((value) => value !== airport)
                                            );
                                          }
                                        }}
                                      />
                                      <Label htmlFor={`airport-${airport}`}>{airport}</Label>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Border Crossings */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {language === 'es' ? 'Cruces Fronterizos' : 'Border Crossings'}
                        </h3>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <FormField
                            control={form.control}
                            name="borderCrossings"
                            render={({ field }) => (
                              <FormItem>
                                <div className="grid grid-cols-1 gap-2">
                                  {Object.values(BorderCrossings).map((border) => (
                                    <div key={border} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`border-${border}`}
                                        checked={field.value?.includes(border)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValue, border]);
                                          } else {
                                            field.onChange(
                                              currentValue.filter((value) => value !== border)
                                            );
                                          }
                                        }}
                                      />
                                      <Label htmlFor={`border-${border}`}>{border}</Label>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Cargo Types */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {language === 'es' ? 'Tipos de Carga' : 'Cargo Types'}
                        </h3>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <FormField
                            control={form.control}
                            name="cargoTypesHandled"
                            render={({ field }) => (
                              <FormItem>
                                <div className="grid grid-cols-1 gap-2">
                                  {Object.values(CargoTypesHandled).map((cargo) => (
                                    <div key={cargo} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`cargo-${cargo}`}
                                        checked={field.value?.includes(cargo)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValue, cargo]);
                                          } else {
                                            field.onChange(
                                              currentValue.filter((value) => value !== cargo)
                                            );
                                          }
                                        }}
                                      />
                                      <Label htmlFor={`cargo-${cargo}`}>{cargo}</Label>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="storage" className="mt-4">
                  <AccordionTrigger className="p-4 bg-white rounded-t-lg border shadow-sm">
                    {language === 'es' ? 'Ubicaciones de Almacenes' : 'Storage Yard Locations'}
                  </AccordionTrigger>
                  <AccordionContent className="border border-t-0 rounded-b-lg p-4 bg-white">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {language === 'es' ? 'Estados de México' : 'Mexican States'}
                        </h3>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <FormField
                            control={form.control}
                            name="storageYardsLocation"
                            render={({ field }) => (
                              <FormItem>
                                <div className="grid grid-cols-1 gap-2">
                                  {mexicanStates.map((state) => (
                                    <div key={state} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`mx-${state}`}
                                        checked={field.value?.includes(state)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValue, state]);
                                          } else {
                                            field.onChange(
                                              currentValue.filter((value) => value !== state)
                                            );
                                          }
                                        }}
                                      />
                                      <Label htmlFor={`mx-${state}`}>{state}</Label>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {language === 'es' ? 'Estados de EE.UU.' : 'US States'}
                        </h3>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <FormField
                            control={form.control}
                            name="storageYardsLocation"
                            render={({ field }) => (
                              <FormItem>
                                <div className="grid grid-cols-1 gap-2">
                                  {usStates.map((state) => (
                                    <div key={state} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`us-${state}`}
                                        checked={field.value?.includes(state)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValue, state]);
                                          } else {
                                            field.onChange(
                                              currentValue.filter((value) => value !== state)
                                            );
                                          }
                                        }}
                                      />
                                      <Label htmlFor={`us-${state}`}>{state}</Label>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {language === 'es' ? 'Provincias de Canadá' : 'Canadian Provinces'}
                        </h3>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <FormField
                            control={form.control}
                            name="storageYardsLocation"
                            render={({ field }) => (
                              <FormItem>
                                <div className="grid grid-cols-1 gap-2">
                                  {canadianProvinces.map((province) => (
                                    <div key={province} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`ca-${province}`}
                                        checked={field.value?.includes(province)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValue, province]);
                                          } else {
                                            field.onChange(
                                              currentValue.filter((value) => value !== province)
                                            );
                                          }
                                        }}
                                      />
                                      <Label htmlFor={`ca-${province}`}>{province}</Label>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/provider-database')}
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? (language === 'es' ? 'Guardando...' : 'Saving...')
                    : (language === 'es' ? 'Guardar Proveedor' : 'Save Provider')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}