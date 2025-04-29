import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Provider, ProviderStatus } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import { Check, Edit, MapPin, Building, Phone, Mail, Globe, Truck, Calendar, Clock, DollarSign, FileText, Languages, Award } from "lucide-react";
import { translateUI, useLanguageStore } from "@/lib/translations";

// Define a schema for the updatable fields
const updateProviderSchema = z.object({
  address: z.string().optional(),
  website: z.string().optional(),
  bankingInfo: z.object({
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    clabe: z.string().optional(),
  }).optional(),
});

type UpdateProviderFormValues = z.infer<typeof updateProviderSchema>;

export default function ProviderDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { language } = useLanguageStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const t = (key: string) => translateUI(key, language);

  // Fetch provider details
  const { data: provider, isLoading, error } = useQuery<Provider>({
    queryKey: ["/api/providers", Number(id)],
    queryFn: async () => {
      const response = await fetch(`/api/providers/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch provider");
      }
      return response.json();
    },
  });

  // Define form with default values
  const form = useForm<UpdateProviderFormValues>({
    resolver: zodResolver(updateProviderSchema),
    defaultValues: {
      address: "",
      website: "",
      bankingInfo: {
        bankName: "",
        accountNumber: "",
        clabe: "",
      },
    },
  });

  // Update form default values when provider data is loaded
  useEffect(() => {
    if (provider) {
      form.reset({
        address: provider.address || "",
        website: provider.website || "",
        bankingInfo: provider.bankingInfo ? {
          bankName: provider.bankingInfo.bankName || "",
          accountNumber: provider.bankingInfo.accountNumber || "",
          clabe: provider.bankingInfo.clabe || "",
        } : {
          bankName: "",
          accountNumber: "",
          clabe: "",
        },
      });
    }
  }, [provider, form]);

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: async (status: ProviderStatus) => {
      const response = await apiRequest(`/api/providers/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: translateUI("Status updated", language),
        description: translateUI("The provider status has been updated successfully", language),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/providers", Number(id)] });
    },
    onError: (error: Error) => {
      toast({
        title: translateUI("Error", language),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update provider mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateProviderFormValues) => {
      const response = await apiRequest(`/api/providers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: translateUI("Provider updated", language),
        description: translateUI("The provider information has been updated successfully", language),
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/providers", Number(id)] });
    },
    onError: (error: Error) => {
      toast({
        title: translateUI("Error", language),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (status: ProviderStatus) => {
    statusMutation.mutate(status);
  };

  const onSubmit = (data: UpdateProviderFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Navbar showBackButton backUrl="/providers" backText={t("Back to providers")} />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>{t("Loading provider details...")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="container mx-auto p-4">
        <Navbar showBackButton backUrl="/providers" backText={t("Back to providers")} />
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mt-4">
          <h3 className="text-lg font-semibold">{t("Error")}</h3>
          <p>{t("Failed to load provider details. Please try again.")}</p>
          <Button variant="outline" className="mt-2" onClick={() => setLocation("/providers")}>
            {t("Return to providers list")}
          </Button>
        </div>
      </div>
    );
  }

  const StatusBadge = ({ status }: { status: ProviderStatus }) => {
    let className = "bg-gray-200 text-gray-800";
    
    if (status === ProviderStatus.APPROVED) {
      className = "bg-green-100 text-green-800";
    } else if (status === ProviderStatus.REJECTED) {
      className = "bg-red-100 text-red-800";
    } else if (status === ProviderStatus.PENDING) {
      className = "bg-yellow-100 text-yellow-800";
    }
    
    return (
      <Badge className={className}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar showBackButton backUrl="/providers" backText={t("Back to providers")} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Provider header */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{provider.companyName}</CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>{t("RFC")}: {provider.rfc}</span>
                    </div>
                    <div className="hidden sm:block">•</div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{t("Member since")}: {new Date(provider.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="hidden sm:block">•</div>
                    <StatusBadge status={provider.status} />
                  </div>
                </div>
                
                <div className="flex gap-2 items-center">
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      {t("Edit")}
                    </Button>
                  )}
                  
                  {provider.status === ProviderStatus.PENDING && (
                    <>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatusUpdate(ProviderStatus.APPROVED)}
                        disabled={statusMutation.isPending}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {t("Approve")}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleStatusUpdate(ProviderStatus.REJECTED)}
                        disabled={statusMutation.isPending}
                      >
                        {t("Reject")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="general">{t("General Information")}</TabsTrigger>
              <TabsTrigger value="services">{t("Services")}</TabsTrigger>
              <TabsTrigger value="financial">{t("Financial")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Contact Information")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("Address")}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={t("Enter company address")} 
                                  className="resize-none" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("Website")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t("Enter company website")} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="pt-4 flex justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                            disabled={updateMutation.isPending}
                          >
                            {t("Cancel")}
                          </Button>
                          <Button 
                            type="submit"
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? t("Saving...") : t("Save Changes")}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("Address")}</h3>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <p>{provider.address || t("No address provided")}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("Website")}</h3>
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          {provider.website ? (
                            <a 
                              href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {provider.website}
                            </a>
                          ) : (
                            <p>{t("No website provided")}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>{t("Performance Metrics")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-900 mb-1">{t("Rating")}</h3>
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-blue-700" />
                        <span className="text-xl font-bold text-blue-700">
                          {provider.score ? provider.score.toFixed(1) : "N/A"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-green-900 mb-1">{t("On-time Rate")}</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-700" />
                        <span className="text-xl font-bold text-green-700">
                          {provider.onTimeRate ? `${provider.onTimeRate}%` : "N/A"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-purple-900 mb-1">{t("Completed Jobs")}</h3>
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-purple-700" />
                        <span className="text-xl font-bold text-purple-700">
                          {provider.completedJobs || "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>{t("Contact Persons")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {provider.contacts && provider.contacts.length > 0 ? (
                    <div className="space-y-4">
                      {provider.contacts.map((contact, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground">{contact.position}</p>
                          <div className="mt-2 space-y-1">
                            {contact.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                                  {contact.email}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{t("No contact persons provided")}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Services Offered")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">{t("Provider Type")}</h3>
                      <Badge variant="outline" className="bg-blue-50">
                        {provider.providerType || t("Not specified")}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">{t("Vehicle Types")}</h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.vehicleTypes && provider.vehicleTypes.length > 0 ? (
                          provider.vehicleTypes.map((type, index) => (
                            <Badge key={index} variant="outline" className="bg-green-50">
                              {type}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">{t("No vehicle types specified")}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">{t("Equipment Handled")}</h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.equipmentHandled && provider.equipmentHandled.length > 0 ? (
                          provider.equipmentHandled.map((equipment, index) => (
                            <Badge key={index} variant="outline" className="bg-amber-50">
                              {equipment}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">{t("No equipment types specified")}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">{t("Service Areas")}</h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.serviceAreas && provider.serviceAreas.length > 0 ? (
                          provider.serviceAreas.map((area, index) => (
                            <Badge key={index} variant="outline" className="bg-purple-50">
                              {area}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">{t("No service areas specified")}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">{t("Cargo Types Handled")}</h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.cargoTypesHandled && provider.cargoTypesHandled.length > 0 ? (
                          provider.cargoTypesHandled.map((cargo, index) => (
                            <Badge key={index} variant="outline" className="bg-red-50">
                              {cargo}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">{t("No cargo types specified")}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">{t("Certifications")}</h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.certifications && provider.certifications.length > 0 ? (
                          provider.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="bg-indigo-50">
                              {cert}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">{t("No certifications specified")}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="financial">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Financial Information")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Form {...form}>
                      <form className="space-y-4">
                        <h3 className="font-medium">{t("Banking Information")}</h3>
                        <FormField
                          control={form.control}
                          name="bankingInfo.bankName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("Bank Name")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t("Enter bank name")} 
                                  {...field} 
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bankingInfo.accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("Account Number")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t("Enter account number")} 
                                  {...field} 
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bankingInfo.clabe"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("CLABE")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t("Enter CLABE")} 
                                  {...field} 
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">{t("Payment Terms")}</h3>
                        <p>
                          {provider.paymentTerms || t("Not specified")}
                          {provider.creditTerms && provider.paymentTerms === "Credit" && (
                            <span className="ml-2 text-muted-foreground">({provider.creditTerms})</span>
                          )}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">{t("Banking Information")}</h3>
                        {provider.bankingInfo ? (
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm text-muted-foreground">{t("Bank Name")}:</span>
                              <p>{provider.bankingInfo.bankName || t("Not provided")}</p>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">{t("Account Number")}:</span>
                              <p>{provider.bankingInfo.accountNumber || t("Not provided")}</p>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">{t("CLABE")}:</span>
                              <p>{provider.bankingInfo.clabe || t("Not provided")}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">{t("No banking information provided")}</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">{t("Currency")}</h3>
                        <p>{provider.currency}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t("Quick Actions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open(`mailto:${provider.contacts?.[0]?.email || ''}`)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {t("Contact Provider")}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setLocation(`/providers/${id}/history`)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {t("View History")}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setLocation(`/providers/${id}/documents`)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t("View Documents")}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{t("Coverage")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {provider.portsCovered && provider.portsCovered.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium">{t("Ports Covered")}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.portsCovered.map((port, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-xs">
                          {port}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {provider.airportsCovered && provider.airportsCovered.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium">{t("Airports Covered")}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.airportsCovered.map((airport, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50 text-xs">
                          {airport}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {provider.borderCrossings && provider.borderCrossings.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium">{t("Border Crossings")}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.borderCrossings.map((crossing, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-xs">
                          {crossing}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {provider.storageYardsLocation && provider.storageYardsLocation.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium">{t("Storage Yard Locations")}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.storageYardsLocation.map((location, index) => (
                        <Badge key={index} variant="outline" className="bg-amber-50 text-xs">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {(!provider.portsCovered || provider.portsCovered.length === 0) &&
                 (!provider.airportsCovered || provider.airportsCovered.length === 0) &&
                 (!provider.borderCrossings || provider.borderCrossings.length === 0) &&
                 (!provider.storageYardsLocation || provider.storageYardsLocation.length === 0) && (
                  <p className="text-muted-foreground text-sm">{t("No coverage information provided")}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}