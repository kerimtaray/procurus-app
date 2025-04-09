import { 
  User, InsertUser, users, 
  Provider, InsertProvider, providers, 
  ShipmentRequest, InsertShipmentRequest, shipmentRequests,
  Bid, InsertBid, bids,
  Feedback, InsertFeedback, feedback,
  UserRole, VehicleType, ServiceArea, CertificationType, CurrencyType, ProviderStatus,
  ShipmentRequestStatus, CargoType, PackagingType, AdditionalEquipment,
  BidStatus, AvailabilityStatus, FeedbackRating, OnTimePerformance, CargoCondition, ReuseStatus
} from "@shared/schema";

// mock data for providers to use in AI matching
const mockProviders = [
  {
    id: 1,
    companyName: "Transportes Fast",
    vehicleTypes: [VehicleType.DRY_VAN, VehicleType.FLATBED, VehicleType.CONTAINER],
    serviceAreas: [ServiceArea.NORTH, ServiceArea.CENTRAL],
    certifications: [CertificationType.ISO9001, CertificationType.OEA],
    currency: CurrencyType.MXN,
    score: 4.5,
    onTimeRate: 98,
    responseTime: 0.8,
    completedJobs: 24,
    location: "Ciudad de México, México",
    yearsOfOperation: 8
  },
  {
    id: 2,
    companyName: "EcoTransport",
    vehicleTypes: [VehicleType.DRY_VAN, VehicleType.REFRIGERATED],
    serviceAreas: [ServiceArea.NATIONWIDE],
    certifications: [CertificationType.ISO14001],
    currency: CurrencyType.MXN, // Cambiado a MXN para hacerlo mexicano
    score: 4.0,
    onTimeRate: 97,
    responseTime: 1.2,
    completedJobs: 18,
    location: "Monterrey, Nuevo León, México",
    yearsOfOperation: 5
  },
  {
    id: 3,
    companyName: "Mex Logistics",
    vehicleTypes: [VehicleType.DRY_VAN, VehicleType.FLATBED],
    serviceAreas: [ServiceArea.SOUTH, ServiceArea.EAST],
    certifications: [],
    currency: CurrencyType.MXN,
    score: 3.5,
    onTimeRate: 95,
    responseTime: 1.5,
    completedJobs: 16,
    location: "Guadalajara, Jalisco, México",
    yearsOfOperation: 4
  },
  {
    id: 4,
    companyName: "Transportes Azteca",
    vehicleTypes: [VehicleType.REFRIGERATED, VehicleType.TANKER],
    serviceAreas: [ServiceArea.CENTRAL, ServiceArea.WEST],
    certifications: [CertificationType.CTPAT, CertificationType.ISO9001],
    currency: CurrencyType.MXN,
    score: 4.7,
    onTimeRate: 99,
    responseTime: 0.5,
    completedJobs: 32,
    location: "Puebla, México",
    yearsOfOperation: 12
  },
  {
    id: 5,
    companyName: "LogisMex Express",
    vehicleTypes: [VehicleType.DRY_VAN, VehicleType.CONTAINER, VehicleType.OTHER],
    serviceAreas: [ServiceArea.NATIONWIDE],
    certifications: [CertificationType.OEA],
    currency: CurrencyType.MXN,
    score: 4.2,
    onTimeRate: 96,
    responseTime: 1.0,
    completedJobs: 27,
    location: "Querétaro, México",
    yearsOfOperation: 6
  }
];

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Provider operations
  getProvider(id: number): Promise<Provider | undefined>;
  getProviderByUserId(userId: number): Promise<Provider | undefined>;
  getAllProviders(): Promise<Provider[]>;
  getTopProviders(limit: number): Promise<Provider[]>;
  createProvider(provider: InsertProvider): Promise<Provider>;
  updateProviderStatus(id: number, status: ProviderStatus): Promise<Provider>;
  
  // Shipment request operations
  getShipmentRequest(id: number): Promise<ShipmentRequest | undefined>;
  getShipmentRequestByRequestId(requestId: string): Promise<ShipmentRequest | undefined>;
  getShipmentRequestsByUserId(userId: number): Promise<ShipmentRequest[]>;
  createShipmentRequest(request: any): Promise<ShipmentRequest>; // Usando any para evitar problemas con las fechas
  updateShipmentRequestStatus(id: number, status: ShipmentRequestStatus): Promise<ShipmentRequest>;
  assignProvider(requestId: number, providerId: number): Promise<ShipmentRequest>;
  
  // Bid operations
  getBid(id: number): Promise<Bid | undefined>;
  getBidsByShipmentRequestId(shipmentRequestId: number): Promise<Bid[]>;
  getBidsByProviderId(providerId: number): Promise<Bid[]>;
  createBid(bid: InsertBid): Promise<Bid>;
  updateBidStatus(id: number, status: BidStatus): Promise<Bid>;
  
  // Feedback operations
  getFeedback(id: number): Promise<Feedback | undefined>;
  getFeedbackByShipmentRequestId(shipmentRequestId: number): Promise<Feedback | undefined>;
  getFeedbacksByProviderId(providerId: number): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;

  // AI matching operation
  findMatchingProviders(shipmentRequestId: number): Promise<Provider[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  // Maps to store data
  private users: Map<number, User>;
  private providers: Map<number, Provider>;
  private shipmentRequests: Map<number, ShipmentRequest>;
  private bids: Map<number, Bid>;
  private feedbacks: Map<number, Feedback>;
  
  // Auto-increment IDs
  private userCurrentId: number;
  private providerCurrentId: number;
  private shipmentRequestCurrentId: number;
  private bidCurrentId: number;
  private feedbackCurrentId: number;
  
  constructor() {
    this.users = new Map();
    this.providers = new Map();
    this.shipmentRequests = new Map();
    this.bids = new Map();
    this.feedbacks = new Map();
    
    this.userCurrentId = 1;
    this.providerCurrentId = 1;
    this.shipmentRequestCurrentId = 1;
    this.bidCurrentId = 1;
    this.feedbackCurrentId = 1;
    
    // Crear usuarios predeterminados para demo
    // Usuario Agente (Usuario para agente logístico)
    const agentUser: User = {
      id: this.userCurrentId++,
      username: "agente",
      // La contraseña es "agente123"
      password: "6e2ec28cdfbf691f7d397f450fc4b872f5fa5a2d48c0d99aaaaaaa8be43ab46d.8e96caef0d05fc99", 
      role: UserRole.AGENT,
      companyName: "Global Imports Inc.",
      createdAt: new Date()
    };
    this.users.set(agentUser.id, agentUser);
    
    // Usuario Proveedor (Usuario para transportista)
    const providerUser: User = {
      id: this.userCurrentId++,
      username: "proveedor",
      // La contraseña es "proveedor123"
      password: "6e2ec28cdfbf691f7d397f450fc4b872f5fa5a2d48c0d99aaaaaaa8be43ab46d.8e96caef0d05fc99",
      role: UserRole.PROVIDER,
      companyName: "Transportes Fast",
      createdAt: new Date()
    };
    this.users.set(providerUser.id, providerUser);
    
    // Add mock data for providers
    mockProviders.forEach(provider => {
      this.providers.set(provider.id, {
        ...provider,
        userId: provider.id,
        rfc: `RFC${provider.id}12345XYZ`,
        status: ProviderStatus.APPROVED,
        createdAt: new Date()
      } as Provider);
    });
    
    // Add a sample shipment request for demo purposes
    // Añadir manualmente un registro para demostración sin usar el método
    const demoId = this.shipmentRequestCurrentId++;
    const demoRequest: ShipmentRequest = {
      id: demoId,
      requestId: "SHP2025001",
      userId: 1,
      requestorName: "Global Imports Inc.",
      company: "Global Imports Inc.",
      cargoType: CargoType.GENERAL,
      weight: 1500,
      volume: 25,
      packagingType: PackagingType.PALLETS,
      specialRequirements: "Carga de alto valor. Se requiere monitoreo continuo.",
      pickupAddress: "Av. Industrial 123, Zona Central, CDMX",
      deliveryAddress: "Blvd. Logístico 456, Zona Norte, Monterrey",
      // Ahora las fechas son strings en la base de datos
      pickupDate: "2025-04-15T09:00:00",
      deliveryDate: "2025-04-17T14:00:00",
      pickupContact: "Juan Pérez",
      deliveryContact: "María Gómez",
      vehicleType: VehicleType.DRY_VAN,
      vehicleSize: "Grande",
      additionalEquipment: [AdditionalEquipment.LIFTGATE, AdditionalEquipment.PALLET_JACK],
      status: ShipmentRequestStatus.PENDING,
      assignedProviderId: null,
      createdAt: new Date()
    };
    
    this.shipmentRequests.set(demoId, demoRequest);
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Provider operations
  async getProvider(id: number): Promise<Provider | undefined> {
    return this.providers.get(id);
  }
  
  async getProviderByUserId(userId: number): Promise<Provider | undefined> {
    return Array.from(this.providers.values()).find(
      (provider) => provider.userId === userId
    );
  }
  
  async getAllProviders(): Promise<Provider[]> {
    return Array.from(this.providers.values());
  }
  
  async getTopProviders(limit: number): Promise<Provider[]> {
    return Array.from(this.providers.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  async createProvider(insertProvider: InsertProvider): Promise<Provider> {
    const id = this.providerCurrentId++;
    // Use a default userId of 0 for now (will be updated when linked to a user)
    const provider: Provider = { 
      ...insertProvider, 
      id, 
      userId: 0,
      score: 0,
      onTimeRate: 0,
      responseTime: 0,
      completedJobs: 0,
      createdAt: new Date() 
    };
    this.providers.set(id, provider);
    return provider;
  }
  
  async updateProviderStatus(id: number, status: ProviderStatus): Promise<Provider> {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    const updatedProvider = { ...provider, status };
    this.providers.set(id, updatedProvider);
    return updatedProvider;
  }
  
  // Shipment request operations
  async getShipmentRequest(id: number): Promise<ShipmentRequest | undefined> {
    const request = this.shipmentRequests.get(id);
    
    // Si no se encuentra la solicitud, devolver la primera disponible (para demostración)
    if (!request) {
      // Devolver la primera solicitud que exista
      const firstRequest = Array.from(this.shipmentRequests.values())[0];
      if (firstRequest) {
        return firstRequest;
      }
    }
    
    return request;
  }
  
  async getShipmentRequestByRequestId(requestId: string): Promise<ShipmentRequest | undefined> {
    return Array.from(this.shipmentRequests.values()).find(
      (request) => request.requestId === requestId
    );
  }
  
  async getShipmentRequestsByUserId(userId: number): Promise<ShipmentRequest[]> {
    return Array.from(this.shipmentRequests.values()).filter(
      (request) => request.userId === userId
    );
  }
  
  async createShipmentRequest(insertRequest: any): Promise<ShipmentRequest> {
    const id = this.shipmentRequestCurrentId++;
    const requestId = `REQ-${1234 + id}`;
    
    // Creamos un objeto request con campos obligatorios por defecto
    // Esto evita errores de tipo y permite que funcione el formulario
    const request: any = { 
      ...insertRequest, 
      id, 
      requestId,
      userId: 0, // Default value, will be updated when linked to a user
      status: ShipmentRequestStatus.PENDING,
      assignedProviderId: null,
      createdAt: new Date() 
    };
    
    this.shipmentRequests.set(id, request);
    return request;
  }
  
  async updateShipmentRequestStatus(id: number, status: ShipmentRequestStatus): Promise<ShipmentRequest> {
    const request = this.shipmentRequests.get(id);
    if (!request) {
      throw new Error(`Shipment request with ID ${id} not found`);
    }
    
    const updatedRequest = { ...request, status };
    this.shipmentRequests.set(id, updatedRequest);
    return updatedRequest;
  }
  
  async assignProvider(requestId: number, providerId: number): Promise<ShipmentRequest> {
    const request = this.shipmentRequests.get(requestId);
    if (!request) {
      throw new Error(`Shipment request with ID ${requestId} not found`);
    }
    
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Provider with ID ${providerId} not found`);
    }
    
    const updatedRequest = { 
      ...request, 
      assignedProviderId: providerId,
      status: ShipmentRequestStatus.ASSIGNED 
    };
    
    this.shipmentRequests.set(requestId, updatedRequest);
    return updatedRequest;
  }
  
  // Bid operations
  async getBid(id: number): Promise<Bid | undefined> {
    return this.bids.get(id);
  }
  
  async getBidsByShipmentRequestId(shipmentRequestId: number): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter(
      (bid) => bid.shipmentRequestId === shipmentRequestId
    );
  }
  
  async getBidsByProviderId(providerId: number): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter(
      (bid) => bid.providerId === providerId
    );
  }
  
  async createBid(insertBid: InsertBid): Promise<Bid> {
    const id = this.bidCurrentId++;
    
    // Asegurarnos de que validUntil sea un objeto Date o null
    const validUntil = insertBid.validUntil 
      ? (insertBid.validUntil instanceof Date ? insertBid.validUntil : new Date(insertBid.validUntil as any)) 
      : null;
      
    const bid: Bid = { 
      ...insertBid, 
      id,
      validUntil, // Usar el valor procesado
      status: BidStatus.PENDING,
      createdAt: new Date() 
    };
    
    this.bids.set(id, bid);
    return bid;
  }
  
  async updateBidStatus(id: number, status: BidStatus): Promise<Bid> {
    const bid = this.bids.get(id);
    if (!bid) {
      throw new Error(`Bid with ID ${id} not found`);
    }
    
    const updatedBid = { ...bid, status };
    this.bids.set(id, updatedBid);
    return updatedBid;
  }
  
  // Feedback operations
  async getFeedback(id: number): Promise<Feedback | undefined> {
    return this.feedbacks.get(id);
  }
  
  async getFeedbackByShipmentRequestId(shipmentRequestId: number): Promise<Feedback | undefined> {
    return Array.from(this.feedbacks.values()).find(
      (feedback) => feedback.shipmentRequestId === shipmentRequestId
    );
  }
  
  async getFeedbacksByProviderId(providerId: number): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values()).filter(
      (feedback) => feedback.providerId === providerId
    );
  }
  
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = this.feedbackCurrentId++;
    const feedbackItem: Feedback = { 
      ...insertFeedback, 
      id,
      createdAt: new Date() 
    };
    
    this.feedbacks.set(id, feedbackItem);
    
    // Update provider score based on feedback
    this.updateProviderScoreFromFeedback(insertFeedback.providerId, insertFeedback.rating);
    
    return feedbackItem;
  }

  // AI matching operation - DEMO VERSION
  async findMatchingProviders(shipmentRequestId: number): Promise<Provider[]> {
    // Para propósitos de demostración, siempre devolvemos proveedores aunque el shipmentRequestId no exista
    
    // Get all approved providers
    const allProviders = Array.from(this.providers.values())
      .filter(provider => provider.status === ProviderStatus.APPROVED || provider.status === undefined);
    
    // Asigna porcentajes de coincidencia de demostración
    const providersWithMatches = allProviders.map((provider, index) => {
      // Asignamos porcentajes descendentes: 95%, 88%, 81%...
      const matchScore = 95 - (index * 7);
      
      return {
        ...provider,
        matchPercentage: matchScore,
        // Asegurando que todos los providers tengan estas propiedades para visualización
        onTimeRate: provider.onTimeRate || 95,
        responseTime: provider.responseTime || 1.5,
        completedJobs: provider.completedJobs || 20
      } as Provider;
    });
    
    // Ordenamos por porcentaje de coincidencia
    return providersWithMatches
      .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
  }
  
  // Helper method to update provider score based on feedback
  private updateProviderScoreFromFeedback(providerId: number, rating: FeedbackRating): void {
    const provider = this.providers.get(providerId);
    if (!provider) {
      return;
    }
    
    // Get all feedback for this provider
    const providerFeedback = Array.from(this.feedbacks.values()).filter(
      feedback => feedback.providerId === providerId
    );
    
    // Calculate new score
    const totalRating = providerFeedback.reduce((sum, feedback) => sum + feedback.rating, 0);
    const newScore = totalRating / providerFeedback.length;
    
    // Update provider
    const updatedProvider = { 
      ...provider, 
      score: newScore,
      completedJobs: providerFeedback.length 
    };
    
    this.providers.set(providerId, updatedProvider);
  }
}

export const storage = new MemStorage();
