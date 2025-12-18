import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ChatApp from "./pages/ChatApp";
import Auth from "./pages/Auth";
import TestFeatures from "./pages/TestFeatures";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AppDocumentation from "./components/AppDocumentation";
import BotsGallery from "./pages/BotsGallery";
import BotLauncher from "./pages/BotLauncher";
import BotCreator from "./pages/BotCreator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/chat" element={<ProtectedRoute><ChatApp /></ProtectedRoute>} />
          <Route path="/test-features" element={<TestFeatures />} />
          <Route path="/docs" element={<AppDocumentation />} />
          
          {/* Bot Routes */}
          <Route path="/bots" element={<ProtectedRoute><BotsGallery /></ProtectedRoute>} />
          <Route path="/bot/create" element={<ProtectedRoute><BotCreator /></ProtectedRoute>} />
          <Route path="/bot/:uuid" element={<ProtectedRoute><BotLauncher /></ProtectedRoute>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
