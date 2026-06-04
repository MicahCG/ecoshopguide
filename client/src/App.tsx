import { Switch, Route, Redirect as WouterRedirect, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Home from "@/pages/Home";
import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";
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
import NewsletterPopup from "@/components/NewsletterPopup";

const BlogRedirect = () => <WouterRedirect to="/blog" />;

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
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/pages/about" component={AboutUs} />
      <Route path="/pages/contact" component={Contact} />
      <Route path="/pages/privacy-policy" component={PrivacyPolicy} />
      <Route path="/pages/terms-of-service" component={TermsOfService} />
      <Route path="/shop-the-look" component={ShopTheLook} />
      <Route path="/shop-the-look/:category" component={IdeaListCategory} />
      <Route path="/pages/dreamy-boho-garden-wedding" component={DreamyBohoGardenWedding} />
      <Route path="/pages/enchanted-forest-retreat" component={EnchantedForestRetreat} />
      <Route path="/pages/warm-boho-living-room" component={WarmBohoLivingRoom} />
      <Route path="/pages/cozy-apartment-living-room" component={CozyApartmentLivingRoom} />
      <Route path="/pages/jungle-spa-retreat" component={JungleSpaRetreat} />
      <Route path="/pages/jungle-spa-vibes" component={JungleSpaVibes} />
      <Route path="/pages/cozy-dorm-room" component={CozyDormRoom} />
      {/* Legacy redirects */}
      <Route path="/shop" component={BlogRedirect} />
      <Route path="/shop/:rest*" component={BlogRedirect} />
      <Route path="/products" component={BlogRedirect} />
      <Route path="/products/:rest*" component={BlogRedirect} />
      <Route path="/collections" component={BlogRedirect} />
      <Route path="/collections/:rest*" component={BlogRedirect} />
      <Route path="/wellness" component={BlogRedirect} />
      <Route path="/wellness/:rest*" component={BlogRedirect} />
      <Route path="/bedroom" component={BlogRedirect} />
      <Route path="/bedroom/:rest*" component={BlogRedirect} />
      <Route path="/category" component={BlogRedirect} />
      <Route path="/category/:rest*" component={BlogRedirect} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GoogleAnalytics />
        <ScrollToTop />
        <Toaster />
        <Router />
        <NewsletterPopup />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
