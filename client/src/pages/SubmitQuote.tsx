import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { insertBidSchema, ShipmentRequest, AvailabilityStatus, CurrencyType } from '@shared/schema';
import useUserStore from '@/hooks/useUserRole';
import { formatDate } from '@/lib/utils';

// Extend the insert schema for the form
const formSchema = insertBidSchema.extend({
  transitTimeUnit: z.enum(['hours', 'days']),
  // Asegurarse de que validUntil acepte tanto string como Date para el formulario
  validUntil: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
});

type BidFormValues = z.infer<typeof formSchema>;

export default function SubmitQuote() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch shipment request details - using mock data for now
  const mockShipmentRequest: ShipmentRequest = {
    id: parseInt(id || '0'),
    requestId: `REQ-${id}`,
    userId: 1,
    requestorName: "John Doe",
    company: "Global Imports Inc.",
    cargoType: "General Merchandise",
    weight: 5000,
    volume: 20,
    packagingType: "Pallets",
    specialRequirements: "Liftgate, Load Bars",
    pickupAddress: "Av. Reforma 123, Col. Juárez, Mexico City, CP 06600",
    deliveryAddress: "Av. Constitución 456, Col. Centro, Monterrey, CP 64000",
    pickupDate: new Date("2023-05-15"),
    deliveryDate: new Date("2023-05-16"),
    pickupContact: "Miguel Rodriguez | +52 55 9876 5432",
    deliveryContact: "Laura Sánchez | +52 81 1234 5678",
    vehicleType: "Dry Van",
    vehicleSize: "Large (12 ton)",
    additionalEquipment: ["Liftgate", "Load Bars"],
    status: "Pending",
    assignedProviderId: null,
    createdAt: new Date("2023-05-11")
  };
  
  // Get provider info from user store
  const { companyName } = useUserStore();
  const providerId = 1; // In a real app, this would come from auth state
  
  // Initialize form with default values
  const form = useForm<BidFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipmentRequestId: parseInt(id || '0'),
      providerId: providerId,
      price: undefined,
      currency: CurrencyType.MXN,
      transitTime: undefined,
      transitTimeUnit: 'days',
      availability: undefined,
      validUntil: undefined,
      notes: '',
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: BidFormValues) => {
    setIsSubmitting(true);
    
    try {
      // validUntil ya es un objeto Date gracias a la transformación en el schema
      // Submit to API
      const response = await apiRequest('POST', '/api/bids', data);
      const bid = await response.json();
      
      toast({
        title: 'Quote Submitted',
        description: 'Your quote has been submitted successfully.',
      });
      
      // Redirect back to provider dashboard
      setLocation('/provider-dashboard');
    } catch (error) {
      console.error('Quote submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was a problem submitting your quote. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    setLocation('/provider-dashboard');
  };
  
  // Extract city names from addresses for simplified display
  const extractCityFromAddress = (address: string): string => {
    const parts = address.split(',');
    if (parts.length > 1) {
      return parts[parts.length - 2].trim();
    }
    return address;
  };
  
  const pickupCity = extractCityFromAddress(mockShipmentRequest.pickupAddress);
  const deliveryCity = extractCityFromAddress(mockShipmentRequest.deliveryAddress);
  
  // Format date
  const formatDateDisplay = (date: Date) => {
    return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton backUrl="/provider-dashboard" backText="Back to Dashboard" />
      
      <div className="flex-1 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Submit Quote</h1>
                <div className="bg-blue-100 text-blue-800 rounded-md px-3 py-1">
                  Request ID: {mockShipmentRequest.requestId}
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Request Details</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Shipment Information</h3>
                      <div className="space-y-2">
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-32">Client:</span>
                          <span className="text-sm font-medium text-gray-900">{mockShipmentRequest.company}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-32">Cargo Type:</span>
                          <span className="text-sm font-medium text-gray-900">{mockShipmentRequest.cargoType}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-32">Weight:</span>
                          <span className="text-sm font-medium text-gray-900">{mockShipmentRequest.weight} kg</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-32">Vehicle Type:</span>
                          <span className="text-sm font-medium text-gray-900">{mockShipmentRequest.vehicleType}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-32">Special Req:</span>
                          <span className="text-sm font-medium text-gray-900">{mockShipmentRequest.additionalEquipment?.join(', ') || 'None'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Route & Timing</h3>
                      <div className="space-y-2">
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-32">Origin:</span>
                          <span className="text-sm font-medium text-gray-900">{pickupCity}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-32">Destination:</span>
                          <span className="text-sm font-medium text-gray-900">{deliveryCity}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-32">Pickup Date:</span>
                          <span className="text-sm font-medium text-gray-900">{formatDateDisplay(mockShipmentRequest.pickupDate)}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-32">Delivery Date:</span>
                          <span className="text-sm font-medium text-gray-900">{formatDateDisplay(mockShipmentRequest.deliveryDate)}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-32">Distance:</span>
                          <span className="text-sm font-medium text-gray-900">~900 km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Your Quote</h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Quote*</FormLabel>
                              <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-7 pr-12"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                </FormControl>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 sm:text-sm">MXN</span>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="transitTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Transit Time*</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="Duration"
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
                            name="transitTimeUnit"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>&nbsp;</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="hours">Hours</SelectItem>
                                    <SelectItem value="days">Days</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability*</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select availability" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(AvailabilityStatus).map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
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
                          name="validUntil"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valid Until</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Any special considerations, conditions, or details about your quote..."
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-2"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-teal-700 hover:bg-teal-800"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Quote'}
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
