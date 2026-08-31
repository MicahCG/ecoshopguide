import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ecoTrack } from '@/lib/analytics';

function trackChatButtonClick(): void {
  ecoTrack('chat_button_click', {
    action: 'mailto',
    destination: 'livebambana@gmail.com',
  });
}

export default function FloatingChatButton() {
  const [hasStickyBar, setHasStickyBar] = useState(false);

  useEffect(() => {
    // Watch for the sticky buy bar appearing on product pages (mobile only)
    const checkStickyBar = () => {
      const stickyBar = document.querySelector('[data-testid="button-buy-now-sticky"]');
      setHasStickyBar(!!stickyBar && window.innerWidth < 1024);
    };

    checkStickyBar();

    // Re-check on scroll and resize since sticky bar appears/disappears
    const observer = new MutationObserver(checkStickyBar);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', checkStickyBar);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkStickyBar);
    };
  }, []);

  const handleClick = () => {
    trackChatButtonClick();
    window.location.href = 'mailto:livebambana@gmail.com?subject=Question about Bambana';
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed right-4 sm:right-6 z-[60] flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ${
        hasStickyBar ? 'bottom-20' : 'bottom-6'
      }`}
      aria-label="Chat with us"
      data-testid="button-chat"
    >
      <MessageCircle className="w-4 h-4" />
      <span className="text-sm font-medium hidden sm:inline">Chat with us</span>
    </button>
  );
}
