import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileIcon, EditIcon, SendIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ShipmentRequest, Provider } from '@shared/schema';
import { generateInstructionLetterPDF } from '@/lib/pdfGenerator';
import { formatDate } from '@/lib/utils';

export default function InstructionLetter() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mock data for shipment request
  const mockShipmentRequest: ShipmentRequest = {
    id: parseInt(id || '0'),
    requestId: `REQ-1235`,
    userId: 1,
    requestorName: "John Doe",
    company: "Global Imports Inc.",
    cargoType: "General Merchandise",
    weight: 5000,
    volume: 20,
    packagingType: "Pallets",
    specialRequirements: "Temperature control, handling instructions",
    pickupAddress: "Av. Reforma 123, Col. Juárez, Mexico City, CP 06600",
    deliveryAddress: "Av. Constitución 456, Col. Centro, Monterrey, CP 64000",
    pickupDate: new Date("2023-05-15"),
    deliveryDate: new Date("2023-05-16"),
    pickupContact: "Miguel Rodriguez | +52 55 9876 5432",
    deliveryContact: "Laura Sánchez | +52 81 1234 5678",
    vehicleType: "Dry Van",
    vehicleSize: "Large (12 ton)",
    additionalEquipment: ["Liftgate", "Load Bars"],
    status: "Assigned",
    assignedProviderId: 1,
    createdAt: new Date("2023-05-11")
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
  
  // Format date
  const formatDateDisplay = (date: Date, includeTime = false) => {
    return formatDate(date, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      ...(includeTime ? { hour: 'numeric', minute: 'numeric' } : {})
    });
  };

  // Handle generate PDF
  const handleGeneratePDF = () => {
    setIsGenerating(true);
    
    try {
      // Prepare data for PDF generation
      const letterData = {
        requestId: mockShipmentRequest.requestId,
        date: formatDateDisplay(new Date()),
        
        // Client information
        clientCompanyName: mockShipmentRequest.company,
        clientContactName: mockShipmentRequest.requestorName,
        clientEmail: "john.doe@globalimports.com",
        clientPhone: "+52 55 1234 5678",
        
        // Provider information
        providerCompanyName: mockProvider.companyName,
        providerRfc: mockProvider.rfc,
        providerDriverName: "Carlos Mendez",
        providerPhone: "+52 81 8765 4321",
        
        // Shipment details
        cargoType: mockShipmentRequest.cargoType,
        weight: `${mockShipmentRequest.weight} kg`,
        volume: `${mockShipmentRequest.volume} m³`,
        packageType: mockShipmentRequest.packagingType || 'Standard',
        vehicleType: mockShipmentRequest.vehicleType,
        specialRequirements: mockShipmentRequest.specialRequirements || 'None',
        
        // Pickup information
        pickupAddress: mockShipmentRequest.pickupAddress,
        pickupDateTime: `${formatDateDisplay(mockShipmentRequest.pickupDate)} | 9:00 AM - 12:00 PM`,
        pickupContactPerson: mockShipmentRequest.pickupContact || 'N/A',
        pickupInstructions: "Report to security gate. Bring safety equipment. Loading dock #5.",
        
        // Delivery information
        deliveryAddress: mockShipmentRequest.deliveryAddress,
        deliveryDateTime: `${formatDateDisplay(mockShipmentRequest.deliveryDate)} | 2:00 PM - 5:00 PM`,
        deliveryContactPerson: mockShipmentRequest.deliveryContact || 'N/A',
        deliveryInstructions: "Call one hour before arrival. Unloading at warehouse B.",
        
        // Commercial terms
        quoteAmount: "$12,500 MXN",
        paymentTerms: "Net 15 days",
        serviceLevel: "Standard",
        additionalFees: "Liftgate: $500 MXN"
      };
      
      // Generate PDF
      const pdfBlob = generateInstructionLetterPDF(letterData);
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${mockShipmentRequest.requestId}_Instruction_Letter.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "PDF Generated",
        description: "The instruction letter has been downloaded.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "PDF Generation Failed",
        description: "There was a problem generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle edit
  const handleEdit = () => {
    toast({
      title: "Edit Mode",
      description: "Edit functionality would be implemented here.",
    });
  };
  
  // Handle share
  const handleShare = () => {
    toast({
      title: "Share Options",
      description: "Share functionality would be implemented here.",
    });
  };
  
  // Return to dashboard
  const handleReturnToDashboard = () => {
    setLocation('/agent-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton backUrl="/agent-dashboard" />
      
      <div className="flex-1 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="shadow-lg mb-6">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <FileIcon className="h-10 w-10 text-primary mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-gray-800">Shipping Instruction Letter</h1>
                <p className="text-gray-600">{mockShipmentRequest.requestId} | Generated on {formatDateDisplay(new Date())}</p>
              </div>
              
              <div className="border-t border-b border-gray-200 py-6 my-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Client Information</h2>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600">Company:</span>
                        <span className="font-medium ml-2">{mockShipmentRequest.company}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Contact:</span>
                        <span className="font-medium ml-2">{mockShipmentRequest.requestorName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium ml-2">john.doe@globalimports.com</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium ml-2">+52 55 1234 5678</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Transportation Provider</h2>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600">Company:</span>
                        <span className="font-medium ml-2">{mockProvider.companyName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">RFC:</span>
                        <span className="font-medium ml-2">{mockProvider.rfc}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Driver:</span>
                        <span className="font-medium ml-2">Carlos Mendez</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium ml-2">+52 81 8765 4321</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">Shipment Details</h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Cargo Type</div>
                        <div className="font-medium">{mockShipmentRequest.cargoType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Weight</div>
                        <div className="font-medium">{mockShipmentRequest.weight} kg</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Volume</div>
                        <div className="font-medium">{mockShipmentRequest.volume} m³</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Package Type</div>
                        <div className="font-medium">{mockShipmentRequest.packagingType || 'Standard'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Vehicle Type</div>
                        <div className="font-medium">{mockShipmentRequest.vehicleType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Special Requirements</div>
                        <div className="font-medium">{mockShipmentRequest.additionalEquipment?.join(', ') || 'None'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">Transportation Instructions</h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-md font-medium text-gray-700 mb-2">Pickup Information</h3>
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm text-gray-500">Address</div>
                            <div className="font-medium">{mockShipmentRequest.pickupAddress}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Date & Time</div>
                            <div className="font-medium">{formatDateDisplay(mockShipmentRequest.pickupDate)} | 9:00 AM - 12:00 PM</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Contact Person</div>
                            <div className="font-medium">{mockShipmentRequest.pickupContact || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Instructions</div>
                            <div className="font-medium">Report to security gate. Bring safety equipment. Loading dock #5.</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-medium text-gray-700 mb-2">Delivery Information</h3>
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm text-gray-500">Address</div>
                            <div className="font-medium">{mockShipmentRequest.deliveryAddress}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Date & Time</div>
                            <div className="font-medium">{formatDateDisplay(mockShipmentRequest.deliveryDate)} | 2:00 PM - 5:00 PM</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Contact Person</div>
                            <div className="font-medium">{mockShipmentRequest.deliveryContact || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Instructions</div>
                            <div className="font-medium">Call one hour before arrival. Unloading at warehouse B.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">Commercial Terms</h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Quote Amount</div>
                        <div className="font-medium">$12,500 MXN</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Payment Terms</div>
                        <div className="font-medium">Net 15 days</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Service Level</div>
                        <div className="font-medium">Standard</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Additional Fees</div>
                        <div className="font-medium">Liftgate: $500 MXN</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 text-center">
                <p className="text-gray-600 mb-6">This document represents the formal agreement between {mockShipmentRequest.company} and {mockProvider.companyName} for the transportation service described above.</p>
                
                <div className="flex justify-center space-x-6 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-16 border-b border-gray-400 mb-2"></div>
                    <span className="text-sm font-medium">{mockShipmentRequest.requestorName}</span>
                    <span className="text-xs text-gray-500">{mockShipmentRequest.company}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-16 border-b border-gray-400 mb-2"></div>
                    <span className="text-sm font-medium">Carlos Mendez</span>
                    <span className="text-xs text-gray-500">{mockProvider.companyName}</span>
                  </div>
                </div>
                
                <div className="text-gray-500 text-xs">
                  Generated by LogiConnect | Document ID: INST-{Math.floor(Math.random() * 100000)}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleEdit}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <div className="space-x-3">
              <Button
                className="flex items-center"
                onClick={handleGeneratePDF}
                disabled={isGenerating}
              >
                <FileIcon className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </Button>
              <Button
                className="flex items-center bg-teal-700 hover:bg-teal-800"
                onClick={handleShare}
              >
                <SendIcon className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
