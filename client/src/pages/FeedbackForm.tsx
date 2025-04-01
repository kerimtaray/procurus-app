import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { StarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { insertFeedbackSchema, ShipmentRequest, Provider, FeedbackRating, OnTimePerformance, CargoCondition, ReuseStatus } from '@shared/schema';
import { formatDate } from '@/lib/utils';

// Extend the insert schema for the form
const formSchema = insertFeedbackSchema;

type FeedbackFormValues = z.infer<typeof formSchema>;

export default function FeedbackForm() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState<FeedbackRating>(0);
  
  // Mock data for completed shipment
  const mockShipmentRequest: ShipmentRequest = {
    id: parseInt(id || '0'),
    requestId: `REQ-1232`,
    userId: 1,
    requestorName: "John Doe",
    company: "Global Imports Inc.",
    cargoType: "General Merchandise",
    weight: 3000,
    volume: 15,
    packagingType: "Pallets",
    specialRequirements: "",
    pickupAddress: "Av. Kukulkan 123, Zona Hotelera, Cancun, QR 77500",
    deliveryAddress: "Calle 60 456, Centro, Merida, YUC 97000",
    pickupDate: new Date("2023-05-07"),
    deliveryDate: new Date("2023-05-08"),
    pickupContact: "",
    deliveryContact: "",
    vehicleType: "Flatbed",
    vehicleSize: "Medium (7.5 ton)",
    additionalEquipment: [],
    status: "Completed",
    assignedProviderId: 1,
    createdAt: new Date("2023-05-05")
  };
  
  // Mock data for provider
  const mockProvider: Provider = {
    id: 1,
    userId: 1,
    companyName: "Transportes Fast",
    rfc: "TFA123456ABC",
    vehicleTypes: ["Dry Van", "Flatbed", "Container"],
    serviceAreas: ["North", "Central"],
    currency: "MXN",
    certifications: ["ISO 9001", "OEA"],
    status: "Approved",
    score: 4.5,
    onTimeRate: 98,
    responseTime: 0.8,
    completedJobs: 24,
    createdAt: new Date("2023-01-15")
  };
  
  // Initialize form with default values
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipmentRequestId: parseInt(id || '0'),
      providerId: mockProvider.id,
      rating: FeedbackRating.FIVE,
      onTimePerformance: OnTimePerformance.ON_TIME,
      cargoCondition: CargoCondition.PERFECT,
      comments: '',
      wouldReuse: ReuseStatus.YES,
    },
  });
  
  // Handle rating selection
  const handleRatingClick = (starRating: FeedbackRating) => {
    setRating(starRating);
    form.setValue('rating', starRating);
  };
  
  // Handle form submission
  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Submit to API
      const response = await apiRequest('POST', '/api/feedback', data);
      const feedback = await response.json();
      
      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for providing feedback on your transportation provider.',
      });
      
      // Redirect back to agent dashboard
      setLocation('/agent-dashboard');
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was a problem submitting your feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle skip feedback
  const handleSkipFeedback = () => {
    toast({
      title: 'Feedback Skipped',
      description: 'You can provide feedback later from the shipment details page.',
    });
    setLocation('/agent-dashboard');
  };
  
  // Format date
  const formatDateDisplay = (date: Date) => {
    return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' });
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton backUrl="/agent-dashboard" />
      
      <div className="flex-1 bg-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <div className="text-amber-400 flex justify-center mb-3">
                  <StarIcon className="h-10 w-10 fill-current" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Provider Feedback</h1>
                <p className="text-gray-600">{mockShipmentRequest.requestId} | Completed on {formatDateDisplay(mockShipmentRequest.deliveryDate)}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center mr-3">
                    <span>TF</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{mockProvider.companyName}</h2>
                    <p className="text-sm text-gray-600">{pickupCity} → {deliveryCity} | {formatDateDisplay(mockShipmentRequest.pickupDate)}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Vehicle Type</div>
                    <div className="text-sm font-medium">{mockShipmentRequest.vehicleType} - {mockShipmentRequest.weight} kg</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Driver</div>
                    <div className="text-sm font-medium">Carlos Mendez</div>
                  </div>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Service Evaluation</h2>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Overall Rating*</FormLabel>
                            <div className="flex space-x-1 text-2xl">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => handleRatingClick(star as FeedbackRating)}
                                  className={`text-amber-400 hover:text-amber-500 focus:outline-none`}
                                >
                                  {star <= (rating || 0) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                  )}
                                </button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="onTimePerformance"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>On-Time Performance*</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-2"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={OnTimePerformance.EARLY} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Early arrival
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={OnTimePerformance.ON_TIME} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    On-time
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={OnTimePerformance.SLIGHT_DELAY} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Slight delay (&lt; 2 hours)
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={OnTimePerformance.SIGNIFICANT_DELAY} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Significant delay (&gt; 2 hours)
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={OnTimePerformance.VERY_LATE} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Very late (&gt; 1 day)
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cargoCondition"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Cargo Condition*</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-2"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={CargoCondition.PERFECT} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Perfect condition
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={CargoCondition.MINOR_ISSUES} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Minor issues, no impact
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={CargoCondition.SOME_DAMAGE} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Some damage reported
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={CargoCondition.SIGNIFICANT_DAMAGE} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Significant damage
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="comments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Comments</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Share your experience with this provider..."
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="wouldReuse"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Would you use this provider again?*</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={ReuseStatus.YES} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Yes
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={ReuseStatus.MAYBE} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Maybe
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={ReuseStatus.NO} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    No
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-2"
                      onClick={handleSkipFeedback}
                    >
                      Skip
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
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
