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
    completedJobs: 24
  },
  {
    id: 2,
    companyName: "EcoTransport",
    vehicleTypes: [VehicleType.DRY_VAN, VehicleType.REFRIGERATED],
    serviceAreas: [ServiceArea.NATIONWIDE],
    certifications: [CertificationType.ISO14001],
    currency: CurrencyType.USD,
    score: 4.0,
    onTimeRate: 97,
    responseTime: 1.2,
    completedJobs: 18
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
    completedJobs: 16
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
  createShipmentRequest(request: InsertShipmentRequest): Promise<ShipmentRequest>;
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
    return this.shipmentRequests.get(id);
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
  
  async createShipmentRequest(insertRequest: InsertShipmentRequest): Promise<ShipmentRequest> {
    const id = this.shipmentRequestCurrentId++;
    const requestId = `REQ-${1234 + id}`;
    
    const request: ShipmentRequest = { 
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
    const bid: Bid = { 
      ...insertBid, 
      id,
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

  // AI matching operation
  async findMatchingProviders(shipmentRequestId: number): Promise<Provider[]> {
    const request = this.shipmentRequests.get(shipmentRequestId);
    if (!request) {
      throw new Error(`Shipment request with ID ${shipmentRequestId} not found`);
    }
    
    // Get all approved providers
    const allProviders = Array.from(this.providers.values())
      .filter(provider => provider.status === ProviderStatus.APPROVED);
    
    // Calculate match score for each provider
    const scoredProviders = allProviders.map(provider => {
      let score = 0;
      
      // Check vehicle type compatibility
      if (provider.vehicleTypes.includes(request.vehicleType as VehicleType)) {
        score += 40;
      }
      
      // Check service area
      const pickupAddressLower = request.pickupAddress.toLowerCase();
      const deliveryAddressLower = request.deliveryAddress.toLowerCase();
      
      let areaMatch = false;
      
      if (provider.serviceAreas.includes(ServiceArea.NATIONWIDE)) {
        areaMatch = true;
      } else {
        for (const area of provider.serviceAreas) {
          if (
            pickupAddressLower.includes(area.toLowerCase()) || 
            deliveryAddressLower.includes(area.toLowerCase())
          ) {
            areaMatch = true;
            break;
          }
        }
      }
      
      if (areaMatch) {
        score += 30;
      }
      
      // Add points for on-time rate
      score += (provider.onTimeRate / 5);
      
      // Add points for completed jobs (experience)
      score += Math.min(provider.completedJobs, 20);
      
      // Add points for fast response time
      const responseTimeScore = Math.max(0, 10 - (provider.responseTime * 5));
      score += responseTimeScore;
      
      return {
        provider,
        score,
        matchPercentage: Math.round(score)
      };
    });
    
    // Sort by score descending and return top 3
    return scoredProviders
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => ({
        ...item.provider,
        matchPercentage: item.matchPercentage
      }) as Provider);
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
