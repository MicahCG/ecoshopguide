import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { ecoTrack, initAnalytics } from '@/lib/analytics';

export default function SiteAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    ecoTrack('page_view', { page_path: location });
  }, [location]);

  return null;
}
