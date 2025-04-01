import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TruckIcon, CheckCircleIcon, ClockIcon, TruckIcon as TruckIcon2, 
  BellIcon, StarIcon, ClipboardListIcon
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: 'truck' | 'check' | 'clock' | 'network' | 'bell' | 'star' | 'clipboard';
  iconColor: 'blue' | 'green' | 'amber' | 'purple';
}

export default function StatCard({ title, value, icon, iconColor }: StatCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'truck':
        return <TruckIcon className="h-5 w-5" />;
      case 'check':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'clock':
        return <ClockIcon className="h-5 w-5" />;
      case 'network':
        return <TruckIcon2 className="h-5 w-5" />;
      case 'bell':
        return <BellIcon className="h-5 w-5" />;
      case 'star':
        return <StarIcon className="h-5 w-5" />;
      case 'clipboard':
        return <ClipboardListIcon className="h-5 w-5" />;
      default:
        return <ClipboardListIcon className="h-5 w-5" />;
    }
  };

  const getIconBgColor = () => {
    switch (iconColor) {
      case 'blue':
        return 'bg-blue-100';
      case 'green':
        return 'bg-green-100';
      case 'amber':
        return 'bg-amber-100';
      case 'purple':
        return 'bg-purple-100';
      default:
        return 'bg-blue-100';
    }
  };

  const getIconColor = () => {
    switch (iconColor) {
      case 'blue':
        return 'text-primary';
      case 'green':
        return 'text-green-600';
      case 'amber':
        return 'text-amber-500';
      case 'purple':
        return 'text-purple-600';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
          <div className={`${getIconBgColor()} p-3 rounded-full ${getIconColor()}`}>
            {getIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
