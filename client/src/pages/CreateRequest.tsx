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
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import Navbar from '@/components/Navbar';
import { 
  insertShipmentRequestSchema, 
  CargoType, 
  PackagingType, 
  VehicleType, 
  AdditionalEquipment 
} from '@shared/schema';
import useUserStore from '@/hooks/useUserRole';

// Extend the insert schema for form validation
// La clave aquí es que las fechas sean tratadas como strings en TODA la aplicación
const formSchema = z.object({
  requestorName: z.string().min(1),
  company: z.string().min(1),
  cargoType: z.nativeEnum(CargoType),
  weight: z.number(),
  volume: z.number().optional().nullable(),
  packagingType: z.nativeEnum(PackagingType).optional().nullable(),
  specialRequirements: z.string().optional().nullable().default(""),
  pickupAddress: z.string().min(1),
  deliveryAddress: z.string().min(1),
  // String puro, sin transformaciones
  pickupDate: z.string().min(1, { message: "Pickup date is required" }),
  deliveryDate: z.string().min(1, { message: "Delivery date is required" }),
  pickupContact: z.string().optional().nullable().default(""),
  deliveryContact: z.string().optional().nullable().default(""),
  vehicleType: z.nativeEnum(VehicleType),
  vehicleSize: z.string().optional().nullable().default(""),
  additionalEquipment: z.array(z.nativeEnum(AdditionalEquipment)).optional().nullable().default([]),
});

type ShipmentRequestFormValues = z.infer<typeof formSchema>;

export default function CreateRequest() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { username, companyName } = useUserStore();

  // Initialize form with default values
  const form = useForm<ShipmentRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestorName: username || "John Doe",
      company: companyName || "Global Imports Inc.",
      cargoType: undefined,
      weight: undefined,
      volume: undefined,
      packagingType: undefined,
      specialRequirements: "",
      pickupAddress: "",
      deliveryAddress: "",
      pickupDate: "",
      deliveryDate: "",
      pickupContact: "",
      deliveryContact: "",
      vehicleType: undefined,
      vehicleSize: "",
      additionalEquipment: [],
    },
  });

  // Handle form submission
  const onSubmit = async (data: ShipmentRequestFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Form data before submission:", data); // Debug log
      
      // Ensure we have valid dates by checking them
      if (!data.pickupDate || !data.deliveryDate) {
        throw new Error("Pickup date and delivery date are required");
      }
      
      // Enviamos los datos directamente sin conversiones
      // Simplemente mandamos la data original para evitar problemas con tipos
      
      console.log("Formatted data for submission:", data); // Debug log
      
      // Submit to API - Importante: ya no hacemos más transformaciones
      const response = await apiRequest('POST', '/api/shipment-requests', data);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating request");
      }
      
      const shipmentRequest = await response.json();
      
      // Success toast
      toast({
        title: "Request Created",
        description: `Your logistics request ${shipmentRequest.requestId} has been created.`,
      });
      
      // Redirect to matching results page
      queryClient.invalidateQueries({ queryKey: ['/api/shipment-requests'] });
      setLocation(`/matching-results/${shipmentRequest.id}`);
    } catch (error) {
      console.error("Create request error:", error);
      toast({
        title: "Error Creating Request",
        description: error instanceof Error ? error.message : "There was a problem creating your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton backUrl="/agent-dashboard" />
      
      <div className="flex-1 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Logistics Request</h1>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* General Information */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      General Information
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Request ID</Label>
                          <Input
                            value="Auto-generated"
                            disabled
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Request Date</Label>
                          <Input
                            value={new Date().toLocaleDateString()}
                            disabled
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="requestorName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Requestor Name*</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company*</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Cargo Information */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      Cargo Information
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cargoType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cargo Type*</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select cargo type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(CargoType).map((type) => (
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
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (kg)*</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g. 5000"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="volume"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Volume (m³)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g. 20"
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    field.onChange(val ? parseFloat(val) : undefined);
                                  }}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="packagingType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Packaging Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || undefined}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select packaging" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(PackagingType).map((type) => (
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
                          name="specialRequirements"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Special Requirements</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Temperature control, handling instructions, etc."
                                  className="resize-none"
                                  rows={3}
                                  value={field.value ?? ""}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Route Information */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Route Information
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="pickupAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pickup Address*</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Full address including postal code"
                                    rows={2}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="deliveryAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Delivery Address*</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Full address including postal code"
                                    rows={2}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="pickupDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pickup Date*</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="deliveryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Delivery Date*</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="pickupContact"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pickup Contact Person</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Name and phone number"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    ref={field.ref}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="deliveryContact"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Delivery Contact Person</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Name and phone number"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    ref={field.ref}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vehicle Requirements */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h2.05a2.5 2.5 0 014.9 0H19a1 1 0 011 1v5a1 1 0 01-1 1h-.05a2.5 2.5 0 01-4.9 0H14a1 1 0 01-1-1V8a1 1 0 011-1z" />
                      </svg>
                      Vehicle Requirements
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="vehicleType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Type*</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || undefined}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select vehicle type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(VehicleType).map((type) => (
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
                          name="vehicleSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Size</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || undefined}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="small">Small (3.5 ton)</SelectItem>
                                  <SelectItem value="medium">Medium (7.5 ton)</SelectItem>
                                  <SelectItem value="large">Large (12 ton)</SelectItem>
                                  <SelectItem value="extra_large">Extra Large (24 ton)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="additionalEquipment"
                          render={() => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Additional Equipment</FormLabel>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.values(AdditionalEquipment).map((equip) => (
                                  <FormField
                                    key={equip}
                                    control={form.control}
                                    name="additionalEquipment"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={equip}
                                          className="flex items-center p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(equip)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value || [], equip])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== equip
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="ml-2 cursor-pointer font-normal">
                                            {equip}
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
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-2"
                      onClick={() => setLocation('/agent-dashboard')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
