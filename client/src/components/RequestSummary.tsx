import { Card, CardContent } from '@/components/ui/card';
import { MapIcon, TruckIcon, CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ShipmentRequest, ShipmentRequestStatus } from '@shared/schema';
import { formatDate } from '@/lib/utils';

interface RequestSummaryProps {
  request: ShipmentRequest;
  showActions?: boolean;
  onClick?: () => void;
}

export default function RequestSummary({ request, showActions = false, onClick }: RequestSummaryProps) {
  // Format date
  const formatDateDisplay = (date: Date) => {
    return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get status badge color
  const getStatusColor = (status: ShipmentRequestStatus) => {
    switch (status) {
      case ShipmentRequestStatus.PENDING:
        return 'bg-amber-100 text-amber-800';
      case ShipmentRequestStatus.ASSIGNED:
        return 'bg-green-100 text-green-800';
      case ShipmentRequestStatus.IN_TRANSIT:
        return 'bg-blue-100 text-blue-800';
      case ShipmentRequestStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case ShipmentRequestStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Extract city names from addresses for simplified display
  const extractCityFromAddress = (address: string): string => {
    // Simple extraction - in a real app, this would be more sophisticated
    const parts = address.split(',');
    if (parts.length > 1) {
      return parts[parts.length - 2].trim();
    }
    return address;
  };

  const pickupCity = extractCityFromAddress(request.pickupAddress);
  const deliveryCity = extractCityFromAddress(request.deliveryAddress);

  return (
    <div 
      className={`border-b border-gray-200 pb-4 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`} 
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="bg-blue-100 text-blue-800 rounded-full h-8 w-8 flex items-center justify-center mr-2">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{request.requestId}</div>
            <div className="text-xs text-gray-500">Created: {formatDateDisplay(request.createdAt)}</div>
          </div>
        </div>
        <Badge variant="outline" className={getStatusColor(request.status)}>
          {request.status}
        </Badge>
      </div>
      <div className="text-sm text-gray-600">
        <div className="flex items-center mb-1">
          <MapIcon className="w-5 h-5 text-gray-400 mr-1" />
          <span>{pickupCity} → {deliveryCity}</span>
        </div>
        <div className="flex items-center mb-1">
          <TruckIcon className="w-5 h-5 text-gray-400 mr-1" />
          <span>{request.vehicleType} - {request.weight} kg</span>
        </div>
        <div className="flex items-center">
          <CalendarIcon className="w-5 h-5 text-gray-400 mr-1" />
          <span>Pickup: {formatDateDisplay(request.pickupDate)}</span>
        </div>
      </div>
      
      {showActions && (
        <div className="mt-3 flex justify-end">
          <button className="text-xs text-primary hover:text-primary/80 font-medium">
            View Details
          </button>
        </div>
      )}
    </div>
  );
}
