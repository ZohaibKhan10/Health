
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Today from "@/pages/Today";
import Habits from "@/pages/Habits";
import Journal from "@/pages/Journal";
import Affirmations from "@/pages/Affirmations";
import Meditations from "@/pages/Meditations";
import Coach from "@/pages/Coach";
import MoodAnalytics from "@/pages/MoodAnalytics";
import MoodTracker from "@/pages/MoodTracker";
import NotFound from "@/pages/NotFound";
import DocumentReader from "@/pages/DocumentReader";
import Wellness from "@/pages/Wellness";
import { ensureDailyAffirmation } from "@/services/dataService";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("user") !== null;
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Ensure we have a daily affirmation on app load
  useEffect(() => {
    ensureDailyAffirmation();
    
    // Check if user is logged in
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HelmetProvider>
          <Helmet>
            <title>SereniFlow</title>
          </Helmet>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="/" element={<Today />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/affirmations" element={<Affirmations />} />
                <Route path="/meditations" element={<Meditations />} />
                <Route path="/coach" element={<Coach />} />
                <Route path="/mood" element={<MoodTracker />} />
                <Route path="/mood/analytics" element={<MoodAnalytics />} />
                <Route path="/documents" element={<DocumentReader />} />
                <Route path="/wellness" element={<Wellness />} />
                <Route path="/settings" element={<Today />} />
                <Route path="/explore" element={<Today />} />
                <Route path="/profile" element={<Today />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </HelmetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;