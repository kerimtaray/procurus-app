import { jsPDF } from "jspdf";

interface InstructionLetterData {
  requestId: string;
  date: string;
  
  // Client information
  clientCompanyName: string;
  clientContactName: string;
  clientEmail: string;
  clientPhone: string;
  
  // Provider information
  providerCompanyName: string;
  providerRfc: string;
  providerDriverName: string;
  providerPhone: string;
  
  // Shipment details
  cargoType: string;
  weight: string;
  volume: string;
  packageType: string;
  vehicleType: string;
  specialRequirements: string;
  
  // Pickup information
  pickupAddress: string;
  pickupDateTime: string;
  pickupContactPerson: string;
  pickupInstructions: string;
  
  // Delivery information
  deliveryAddress: string;
  deliveryDateTime: string;
  deliveryContactPerson: string;
  deliveryInstructions: string;
  
  // Commercial terms
  quoteAmount: string;
  paymentTerms: string;
  serviceLevel: string;
  additionalFees: string;
}

export const generateInstructionLetterPDF = (data: InstructionLetterData): Blob => {
  const doc = new jsPDF();
  
  // Set font sizes
  const TITLE_FONT_SIZE = 18;
  const HEADING_FONT_SIZE = 14;
  const SUBHEADING_FONT_SIZE = 12;
  const TEXT_FONT_SIZE = 10;
  
  // Set colors
  const PRIMARY_COLOR = [37, 99, 235]; // Blue color in RGB
  
  // Add header
  doc.setFontSize(TITLE_FONT_SIZE);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.text("Shipping Instruction Letter", 105, 20, { align: "center" });
  doc.setFontSize(TEXT_FONT_SIZE);
  doc.text(`${data.requestId} | Generated on ${data.date}`, 105, 28, { align: "center" });
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 35, 190, 35);
  
  // Client and Provider Information
  doc.setFontSize(HEADING_FONT_SIZE);
  doc.setTextColor(60, 60, 60);
  doc.text("Client Information", 20, 45);
  
  doc.setFontSize(TEXT_FONT_SIZE);
  doc.text(`Company: ${data.clientCompanyName}`, 20, 55);
  doc.text(`Contact: ${data.clientContactName}`, 20, 62);
  doc.text(`Email: ${data.clientEmail}`, 20, 69);
  doc.text(`Phone: ${data.clientPhone}`, 20, 76);
  
  doc.setFontSize(HEADING_FONT_SIZE);
  doc.text("Transportation Provider", 110, 45);
  
  doc.setFontSize(TEXT_FONT_SIZE);
  doc.text(`Company: ${data.providerCompanyName}`, 110, 55);
  doc.text(`RFC: ${data.providerRfc}`, 110, 62);
  doc.text(`Driver: ${data.providerDriverName}`, 110, 69);
  doc.text(`Phone: ${data.providerPhone}`, 110, 76);
  
  // Horizontal line
  doc.line(20, 85, 190, 85);
  
  // Shipment Details
  doc.setFontSize(HEADING_FONT_SIZE);
  doc.text("Shipment Details", 20, 95);
  
  doc.setFillColor(245, 245, 245); // Light gray background
  doc.rect(20, 100, 170, 30, "F");
  
  doc.setFontSize(TEXT_FONT_SIZE);
  doc.text(`Cargo Type: ${data.cargoType}`, 25, 108);
  doc.text(`Weight: ${data.weight}`, 25, 115);
  doc.text(`Volume: ${data.volume}`, 25, 122);
  
  doc.text(`Package Type: ${data.packageType}`, 100, 108);
  doc.text(`Vehicle Type: ${data.vehicleType}`, 100, 115);
  doc.text(`Special Requirements: ${data.specialRequirements}`, 100, 122);
  
  // Transportation Instructions
  doc.setFontSize(HEADING_FONT_SIZE);
  doc.text("Transportation Instructions", 20, 140);
  
  // Pickup Information
  doc.setFillColor(245, 245, 245);
  doc.rect(20, 145, 80, 50, "F");
  
  doc.setFontSize(SUBHEADING_FONT_SIZE);
  doc.text("Pickup Information", 25, 153);
  
  doc.setFontSize(TEXT_FONT_SIZE);
  doc.text("Address:", 25, 160);
  const pickupAddressLines = doc.splitTextToSize(data.pickupAddress, 70);
  doc.text(pickupAddressLines, 25, 167);
  
  doc.text(`Date & Time: ${data.pickupDateTime}`, 25, 177);
  doc.text(`Contact: ${data.pickupContactPerson}`, 25, 184);
  doc.text(`Instructions: ${data.pickupInstructions}`, 25, 191);
  
  // Delivery Information
  doc.setFillColor(245, 245, 245);
  doc.rect(110, 145, 80, 50, "F");
  
  doc.setFontSize(SUBHEADING_FONT_SIZE);
  doc.text("Delivery Information", 115, 153);
  
  doc.setFontSize(TEXT_FONT_SIZE);
  doc.text("Address:", 115, 160);
  const deliveryAddressLines = doc.splitTextToSize(data.deliveryAddress, 70);
  doc.text(deliveryAddressLines, 115, 167);
  
  doc.text(`Date & Time: ${data.deliveryDateTime}`, 115, 177);
  doc.text(`Contact: ${data.deliveryContactPerson}`, 115, 184);
  doc.text(`Instructions: ${data.deliveryInstructions}`, 115, 191);
  
  // Commercial Terms
  doc.setFontSize(HEADING_FONT_SIZE);
  doc.text("Commercial Terms", 20, 205);
  
  doc.setFillColor(245, 245, 245);
  doc.rect(20, 210, 170, 30, "F");
  
  doc.setFontSize(TEXT_FONT_SIZE);
  doc.text(`Quote Amount: ${data.quoteAmount}`, 25, 218);
  doc.text(`Payment Terms: ${data.paymentTerms}`, 25, 225);
  doc.text(`Service Level: ${data.serviceLevel}`, 100, 218);
  doc.text(`Additional Fees: ${data.additionalFees}`, 100, 225);
  
  // Signature section
  doc.line(20, 250, 190, 250);
  
  doc.setFontSize(TEXT_FONT_SIZE);
  doc.text("This document represents the formal agreement between the client and provider for the transportation service described above.", 105, 258, { align: "center" });
  
  doc.line(50, 275, 90, 275);
  doc.line(120, 275, 160, 275);
  
  doc.text(data.clientContactName, 70, 280, { align: "center" });
  doc.text(data.clientCompanyName, 70, 285, { align: "center" });
  
  doc.text(data.providerDriverName, 140, 280, { align: "center" });
  doc.text(data.providerCompanyName, 140, 285, { align: "center" });
  
  // Footer
  doc.setFontSize(8);
  doc.text(`Generated by LogiConnect | Document ID: INST-${Math.floor(Math.random() * 100000)}`, 105, 295, { align: "center" });
  
  return doc.output("blob");
};
