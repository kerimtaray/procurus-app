import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShipmentRequest, UserRole } from '@shared/schema';
import { formatDate } from '@/lib/utils';
import useUserStore from '@/hooks/useUserRole';

export default function ProviderDashboard() {
  const [_, setLocation] = useLocation();
  const { username, companyName } = useUserStore();
  
  // Mock data for active jobs
  const activeJobs = [
    {
      id: 'JOB-2452',
      client: 'Acme Imports',
      route: 'Cancun → Merida',
      pickupDate: '2023-05-12',
      status: 'In Transit'
    },
    {
      id: 'JOB-2451',
      client: 'Global Logistics',
      route: 'Mexico City → Puebla',
      pickupDate: '2023-05-11',
      status: 'Preparing'
    },
    {
      id: 'JOB-2450',
      client: 'MexTrade Corp.',
      route: 'Monterrey → Saltillo',
      pickupDate: '2023-05-10',
      status: 'Arrived'
    }
  ];
  
  // Handle submitting a quote
  const handleSubmitQuote = (requestId: string) => {
    setLocation(`/submit-quote/${requestId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Provider Dashboard</h1>
          
          {/* KPI Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="New Requests"
              value="3"
              icon="bell"
              iconColor="blue"
            />
            
            <StatCard
              title="Active Shipments"
              value="5"
              icon="truck"
              iconColor="green"
            />
            
            <StatCard
              title="Completed Jobs"
              value="24"
              icon="check"
              iconColor="amber"
            />
            
            <StatCard
              title="Rating"
              value="4.5/5"
              icon="star"
              iconColor="purple"
            />
          </div>
          
          {/* New Quote Requests Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">New Quote Requests</h2>
              
              {/* Request 1 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-800">REQ-1235 - Global Imports Inc.</h3>
                    <p className="text-sm text-gray-600">Requested on: May 11, 2023</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    New
                  </Badge>
                </div>
                
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Route</div>
                      <div className="text-sm font-medium">Mexico City → Monterrey</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Vehicle Type</div>
                      <div className="text-sm font-medium">Dry Van</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Pickup Date</div>
                      <div className="text-sm font-medium">May 15, 2023</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Cargo Type</div>
                      <div className="text-sm font-medium">General Merchandise</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Weight</div>
                      <div className="text-sm font-medium">5,000 kg</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Delivery Date</div>
                      <div className="text-sm font-medium">May 16, 2023</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleSubmitQuote('1235')}
                    className="w-full mt-4 bg-teal-700 hover:bg-teal-800"
                  >
                    Submit Quote
                  </Button>
                </div>
              </div>
              
              {/* Request 2 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-800">REQ-1234 - MexTrade Corp.</h3>
                    <p className="text-sm text-gray-600">Requested on: May 10, 2023</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    New
                  </Badge>
                </div>
                
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Route</div>
                      <div className="text-sm font-medium">Guadalajara → Mexico City</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Vehicle Type</div>
                      <div className="text-sm font-medium">Flatbed</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Pickup Date</div>
                      <div className="text-sm font-medium">May 18, 2023</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Cargo Type</div>
                      <div className="text-sm font-medium">Construction Materials</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Weight</div>
                      <div className="text-sm font-medium">8,500 kg</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Delivery Date</div>
                      <div className="text-sm font-medium">May 19, 2023</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleSubmitQuote('1234')}
                    className="w-full mt-4 bg-teal-700 hover:bg-teal-800"
                  >
                    Submit Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Active Jobs Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Jobs</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activeJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{job.id}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{job.client}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{job.route}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(new Date(job.pickupDate), { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant="outline" className={
                            job.status === 'In Transit' 
                              ? 'bg-amber-100 text-amber-800' 
                              : job.status === 'Preparing' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                          }>
                            {job.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Button variant="link" className="text-primary hover:text-blue-700">
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
