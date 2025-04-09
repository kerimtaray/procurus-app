import { Switch, Route, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Login from '@/pages/Login';
import ProviderRegistration from '@/pages/ProviderRegistration';
import AgentDashboard from '@/pages/AgentDashboard';
import CreateRequest from '@/pages/CreateRequest';
import MatchingResults from '@/pages/MatchingResults';
import ProviderDashboard from '@/pages/ProviderDashboard';
import ProviderActiveJobs from '@/pages/ProviderActiveJobs';
import SubmitQuote from '@/pages/SubmitQuote';
import ReviewBids from '@/pages/ReviewBids';
import InstructionLetter from '@/pages/InstructionLetter';
import FeedbackForm from '@/pages/FeedbackForm';
import ActiveRequests from '@/pages/ActiveRequests';
import ClientProposal from '@/pages/ClientProposal';
import AnalyticsDashboard from '@/pages/AnalyticsDashboard';
import NotFound from '@/pages/not-found';
import Demo from '@/pages/Demo';
import useUserStore from '@/hooks/useUserRole';
import { useEffect } from 'react';

function Router() {
  const [location, setLocation] = useLocation();
  const { isLoggedIn, role } = useUserStore();

  // Temporarily disable redirects to allow viewing all pages
  useEffect(() => {
    // Disabled redirection for testing purposes
    console.log('Auth state:', isLoggedIn ? 'logged in' : 'not logged in');
    // Original code:
    // if (!isLoggedIn && location !== '/' && location !== '/provider-registration') {
    //   setLocation('/');
    // }
  }, [isLoggedIn, location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/demo" component={Demo} />
      <Route path="/provider-registration" component={ProviderRegistration} />
      <Route path="/agent-dashboard" component={AgentDashboard} />
      <Route path="/create-request" component={CreateRequest} />
      <Route path="/active-requests" component={ActiveRequests} />
      <Route path="/matching-results/:id" component={MatchingResults} />
      <Route path="/provider-dashboard" component={ProviderDashboard} />
      <Route path="/provider-active-jobs" component={ProviderActiveJobs} />
      <Route path="/submit-quote/:id" component={SubmitQuote} />
      <Route path="/review-bids/:id" component={ReviewBids} />
      <Route path="/client-proposal/:id" component={ClientProposal} />
      <Route path="/instruction-letter/:id" component={InstructionLetter} />
      <Route path="/feedback/:id" component={FeedbackForm} />
      <Route path="/view-analytics" component={AnalyticsDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
