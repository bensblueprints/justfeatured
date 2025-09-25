import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthWrapper } from "@/components/AuthWrapper";
import { PRChatbot } from "@/components/PRChatbot";
import { CartProvider } from "@/hooks/useCart";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import { Home } from "./pages/Home";


import { MediaUpload } from "./pages/MediaUpload";
import { PostCheckout } from "./pages/PostCheckout";
import { ReviewBoard } from "./pages/ReviewBoard";
import { Publications } from "./pages/Publications";
import { Checkout } from "./pages/Checkout";
import { Auth } from "./pages/Auth";
import { BlogPost } from "./pages/BlogPost";
import { SocialProofBlogPost } from "./pages/SocialProofBlogPost";
import StarterSelection from "./pages/StarterSelection";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import AdminUpload from "./pages/AdminUpload";
import BrandBundles from "./pages/BrandBundles";
import AdminPanel from "./pages/AdminPanel";
import AdminSetup from "./pages/AdminSetup";
import AdminManualImport from "./pages/AdminManualImport";
import InvoicePayment from "./pages/InvoicePayment";
import DigitalBillboardAdvertising from "./pages/services/DigitalBillboardAdvertising";
import InStoreDigitalAdvertising from "./pages/services/InStoreDigitalAdvertising";
import FacebookMarketing from "./pages/services/FacebookMarketing";
import FacebookAds from "./pages/services/FacebookAds";
import WebsiteDevelopment from "./pages/services/WebsiteDevelopment";
import SEO from "./pages/services/SEO";
import ArticleWriting from "./pages/services/ArticleWriting";

const queryClient = new QueryClient();

const App = () => {
  const { AuthGuardComponent } = useAuthGuard();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <ChatbotProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthWrapper>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/blog/trust-factor" element={<BlogPost />} />
                  <Route path="/blog/social-proof" element={<SocialProofBlogPost />} />
                  <Route path="/dashboard" element={<AdminPanel />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/media-upload/:id" element={<MediaUpload />} />
                  <Route path="/post-checkout" element={<PostCheckout />} />
                  <Route path="/review-board/:id" element={<ReviewBoard />} />
                  <Route path="/publications" element={<Publications />} />
                  <Route path="/starter-selection" element={<StarterSelection />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/admin-upload" element={<AdminUpload />} />
                  <Route path="/brand-bundles" element={<BrandBundles />} />
                  <Route path="/admin-setup" element={<AdminSetup />} />
                  <Route path="/admin-manual-import" element={<AdminManualImport />} />
                  <Route path="/invoice-payment/:token" element={<InvoicePayment />} />
                  <Route path="/services/digital-billboard-advertising" element={<DigitalBillboardAdvertising />} />
                  <Route path="/services/in-store-digital-advertising" element={<InStoreDigitalAdvertising />} />
                  <Route path="/services/facebook-marketing" element={<FacebookMarketing />} />
                  <Route path="/services/facebook-ads" element={<FacebookAds />} />
                  <Route path="/services/website-development" element={<WebsiteDevelopment />} />
                  <Route path="/services/seo" element={<SEO />} />
                  <Route path="/services/article-writing" element={<ArticleWriting />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <AuthGuardComponent />
                <PRChatbot />
              </AuthWrapper>
            </BrowserRouter>
          </ChatbotProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
