import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
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
import AuthPage from '@/pages/auth-page';
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/lib/protected-route';

function Router() {
  return (
    <Switch>
      {/* Authentication */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/demo" component={Demo} />
      
      {/* Protected Routes */}
      <ProtectedRoute path="/" component={AgentDashboard} />
      <ProtectedRoute path="/provider-registration" component={ProviderRegistration} />
      <ProtectedRoute path="/agent-dashboard" component={AgentDashboard} />
      <ProtectedRoute path="/create-request" component={CreateRequest} />
      <ProtectedRoute path="/active-requests" component={ActiveRequests} />
      <ProtectedRoute path="/matching-results/:id" component={MatchingResults} />
      <ProtectedRoute path="/provider-dashboard" component={ProviderDashboard} />
      <ProtectedRoute path="/provider-active-jobs" component={ProviderActiveJobs} />
      <ProtectedRoute path="/submit-quote/:id" component={SubmitQuote} />
      <ProtectedRoute path="/review-bids/:id" component={ReviewBids} />
      <ProtectedRoute path="/client-proposal/:id" component={ClientProposal} />
      <ProtectedRoute path="/instruction-letter/:id" component={InstructionLetter} />
      <ProtectedRoute path="/feedback/:id" component={FeedbackForm} />
      <ProtectedRoute path="/view-analytics" component={AnalyticsDashboard} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Router />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
