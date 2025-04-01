import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TruckIcon, UploadIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertProviderSchema, VehicleType, ServiceArea, CertificationType, CurrencyType } from '@shared/schema';

// Extend the insert schema with multi-select fields for checkboxes
const formSchema = insertProviderSchema.extend({
  vehicleTypes: z.array(z.nativeEnum(VehicleType)).min(1, { message: 'Select at least one vehicle type' }),
  serviceAreas: z.array(z.nativeEnum(ServiceArea)).min(1, { message: 'Select at least one service area' }),
  certifications: z.array(z.nativeEnum(CertificationType)).optional(),
});

type ProviderFormValues = z.infer<typeof formSchema>;

export default function ProviderRegistration() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define form with default values
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      rfc: '',
      vehicleTypes: [],
      serviceAreas: [],
      currency: undefined,
      certifications: [],
      status: 'Pending',
    },
  });

  // Handle form submission
  const onSubmit = async (data: ProviderFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Make API request to register provider
      const response = await apiRequest('POST', '/api/providers', data);
      const provider = await response.json();
      
      toast({
        title: 'Registration successful!',
        description: 'Your provider profile has been submitted for approval.',
      });
      
      // Redirect to login page
      setLocation('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: 'There was a problem with your registration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-slate-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TruckIcon className="text-primary h-6 w-6 mr-2" />
              <span className="font-bold text-xl text-gray-800">LogiConnect</span>
            </div>
            <div className="flex items-center">
              <a 
                href="/"
                className="text-gray-600 hover:text-primary flex items-center"
              >
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      <Card className="max-w-4xl mx-auto mt-20">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Transport Provider Registration</h1>
          <p className="text-gray-600 mb-8">Complete the form below to join our platform and connect with logistics agents.</p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your company name" 
                          {...field} 
                        />
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
                        <Input 
                          placeholder="e.g. ABC123456XYZ" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="vehicleTypes"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base">Vehicle Types*</FormLabel>
                    <div className="grid md:grid-cols-3 gap-3">
                      {Object.values(VehicleType).map((type) => (
                        <FormField
                          key={type}
                          control={form.control}
                          name="vehicleTypes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={type}
                                className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(type)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, type])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== type
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="ml-2 cursor-pointer font-normal">
                                  {type}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="serviceAreas"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base">Service Areas*</FormLabel>
                    <div className="grid md:grid-cols-3 gap-3">
                      {Object.values(ServiceArea).map((area) => (
                        <FormField
                          key={area}
                          control={form.control}
                          name="serviceAreas"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={area}
                                className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(area)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, area])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== area
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="ml-2 cursor-pointer font-normal">
                                  {area}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Currency*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={CurrencyType.MXN}>Mexican Peso (MXN)</SelectItem>
                          <SelectItem value={CurrencyType.USD}>US Dollar (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="certifications"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-base">Certifications</FormLabel>
                      <div className="space-y-2">
                        {Object.values(CertificationType).map((cert) => (
                          <FormField
                            key={cert}
                            control={form.control}
                            name="certifications"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={cert}
                                  className="flex items-center"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(cert)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value || [], cert])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== cert
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="ml-2 cursor-pointer font-normal">
                                    {cert}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Documents</h3>
                <div className="space-y-4">
                  <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                    <UploadIcon className="mx-auto text-gray-400 h-8 w-8 mb-2" />
                    <p className="text-sm text-gray-600">Upload your business license</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                    >
                      Select File
                    </Button>
                  </div>
                  
                  <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                    <UploadIcon className="mx-auto text-gray-400 h-8 w-8 mb-2" />
                    <p className="text-sm text-gray-600">Upload your insurance policy</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
