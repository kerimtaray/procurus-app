import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import RequestSummary from '@/components/RequestSummary';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShipmentRequest, Provider } from '@shared/schema';
import useUserStore from '@/hooks/useUserRole';

export default function AgentDashboard() {
  const [_, setLocation] = useLocation();
  const { username, role } = useUserStore();
  
  // Query top providers
  const { data: topProviders, isLoading: loadingProviders } = useQuery<Provider[]>({
    queryKey: ['/api/providers/top'],
  });
  
  // Query recent requests (mock data for now)
  const { data: recentRequests, isLoading: loadingRequests } = useQuery<ShipmentRequest[]>({
    queryKey: ['/api/shipment-requests'],
  });
  
  // Get initials for provider avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Map colors for provider avatars
  const getAvatarColor = (index: number) => {
    const colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800'];
    return colors[index % colors.length];
  };
  
  // Render star rating
  const renderStarRating = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex text-amber-400">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
      </div>
    );
  };
  
  // Handle creating a new request
  const handleCreateRequest = () => {
    setLocation('/create-request');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Agent Dashboard</h1>
            <button
              onClick={handleCreateRequest}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center space-x-2 shadow-md transform hover:scale-105 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Nueva Solicitud</span>
            </button>
          </div>
          
          {/* KPI Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Active Requests"
              value="12"
              icon="clipboard"
              iconColor="blue"
            />
            
            <StatCard
              title="Completed Shipments"
              value="48"
              icon="check"
              iconColor="green"
            />
            
            <StatCard
              title="Avg. Response Time"
              value="1.8h"
              icon="clock"
              iconColor="amber"
            />
            
            <StatCard
              title="Provider Network"
              value="26"
              icon="network"
              iconColor="purple"
            />
          </div>
          
          {/* Top Providers Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Providers</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Jobs</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingProviders ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-3 text-center text-sm text-gray-500">
                          Loading providers...
                        </td>
                      </tr>
                    ) : (
                      topProviders?.map((provider, index) => (
                        <tr key={provider.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className={`h-8 w-8 ${getAvatarColor(index)} mr-2`}>
                                <AvatarFallback>{getInitials(provider.companyName)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{provider.companyName}</div>
                                <div className="text-xs text-gray-500">{provider.serviceAreas.join(', ')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{provider.onTimeRate}%</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{provider.responseTime}h</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{provider.completedJobs}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {renderStarRating(provider.score || 0)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Activity & Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Requests */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Requests</h2>
                <div className="space-y-4">
                  {loadingRequests ? (
                    <div className="text-sm text-gray-500">Loading requests...</div>
                  ) : recentRequests && recentRequests.length > 0 ? (
                    recentRequests.map((request) => (
                      <RequestSummary 
                        key={request.id} 
                        request={request} 
                        showActions 
                        onClick={() => setLocation(`/matching-results/${request.id}`)}
                      />
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No recent requests found.</div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <button 
                    onClick={handleCreateRequest}
                    className="flex items-center justify-center mx-auto px-4 py-2 bg-primary/10 text-primary font-medium rounded-md hover:bg-primary/20 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Nueva Solicitud
                  </button>
                </div>
              </CardContent>
            </Card>
            
            {/* Performance Metrics */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Request Fulfillment Rate</span>
                      <span className="text-sm text-gray-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Provider Response Rate</span>
                      <span className="text-sm text-gray-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">On-Time Delivery</span>
                      <span className="text-sm text-gray-600">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Cost Efficiency</span>
                      <span className="text-sm text-gray-600">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Most Active Regions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-lg font-semibold text-gray-800">Central</div>
                        <div className="text-sm text-gray-500">42% of shipments</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-lg font-semibold text-gray-800">North</div>
                        <div className="text-sm text-gray-500">31% of shipments</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
