import { Switch, Route, Redirect as WouterRedirect, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteAnalytics from "@/components/GoogleAnalytics";
import Home from "@/pages/Home";
import AboutUs from "@/pages/AboutUs";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import ShopTheLook from "@/pages/ShopTheLook";
import IdeaListCategory from "@/pages/IdeaListCategory";
import DreamyBohoGardenWedding from "@/pages/DreamyBohoGardenWedding";
import EnchantedForestRetreat from "@/pages/EnchantedForestRetreat";
import WarmBohoLivingRoom from "@/pages/WarmBohoLivingRoom";
import CozyApartmentLivingRoom from "@/pages/CozyApartmentLivingRoom";
import JungleSpaRetreat from "@/pages/JungleSpaRetreat";
import JungleSpaVibes from "@/pages/JungleSpaVibes";
import CozyDormRoom from "@/pages/CozyDormRoom";
import NotFound from "@/pages/not-found";
import WeddingCollection from "@/pages/WeddingCollection";
import DormCollection from "@/pages/DormCollection";
import FallHalloweenCollection from "@/pages/FallHalloweenCollection";
import WeddingLook from "@/pages/WeddingLook";
import ShopifyProductPage from "@/pages/ShopifyProduct";
import { ShopifyCartProvider } from "@/components/ShopifyCart";

const StorefrontRedirect = () => <WouterRedirect to="/shop-the-look" />;

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={StorefrontRedirect} />
      <Route path="/blog/:slug" component={StorefrontRedirect} />
      <Route path="/pages/about" component={AboutUs} />
      <Route path="/pages/contact" component={Contact} />
      <Route path="/pages/privacy-policy" component={PrivacyPolicy} />
      <Route path="/pages/terms-of-service" component={TermsOfService} />
      <Route path="/shop-the-look" component={ShopTheLook} />
      <Route path="/shop-the-look/weddings" component={WeddingCollection} />
      <Route path="/shop-the-look/dorm" component={DormCollection} />
      <Route path="/shop-the-look/fall-halloween" component={FallHalloweenCollection} />
      <Route path="/wedding/:look" component={WeddingLook} />
      <Route path="/shop-the-look/:category" component={IdeaListCategory} />
      <Route path="/collections/wedding" component={WeddingCollection} />
      <Route path="/collections/fall-halloween" component={FallHalloweenCollection} />
      <Route path="/products/:handle" component={ShopifyProductPage} />
      <Route path="/pages/dreamy-boho-garden-wedding" component={DreamyBohoGardenWedding} />
      <Route path="/pages/enchanted-forest-retreat" component={EnchantedForestRetreat} />
      <Route path="/pages/warm-boho-living-room" component={WarmBohoLivingRoom} />
      <Route path="/pages/cozy-apartment-living-room" component={CozyApartmentLivingRoom} />
      <Route path="/pages/jungle-spa-retreat" component={JungleSpaRetreat} />
      <Route path="/pages/jungle-spa-vibes" component={JungleSpaVibes} />
      <Route path="/pages/cozy-dorm-room" component={CozyDormRoom} />
      {/* Legacy redirects */}
      <Route path="/shop" component={StorefrontRedirect} />
      <Route path="/shop/:rest*" component={StorefrontRedirect} />
      <Route path="/products" component={StorefrontRedirect} />
      <Route path="/collections" component={StorefrontRedirect} />
      <Route path="/wellness" component={StorefrontRedirect} />
      <Route path="/wellness/:rest*" component={StorefrontRedirect} />
      <Route path="/bedroom" component={StorefrontRedirect} />
      <Route path="/bedroom/:rest*" component={StorefrontRedirect} />
      <Route path="/category" component={StorefrontRedirect} />
      <Route path="/category/:rest*" component={StorefrontRedirect} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ShopifyCartProvider>
          <SiteAnalytics />
          <ScrollToTop />
          <Toaster />
          <Router />
          <Analytics />
        </ShopifyCartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
