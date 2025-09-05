import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { PostCheckout } from "./pages/PostCheckout";
import { ReviewBoard } from "./pages/ReviewBoard";
import { Publications } from "./pages/Publications";
import { Checkout } from "./pages/Checkout";
import { Auth } from "./pages/Auth";
import { BlogPost } from "./pages/BlogPost";
import StarterSelection from "./pages/StarterSelection";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/blog/trust-factor" element={<BlogPost />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post-checkout" element={<PostCheckout />} />
          <Route path="/review-board/:id" element={<ReviewBoard />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/starter-selection" element={<StarterSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
