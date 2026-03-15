import { useEffect, useRef, useCallback } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const ADMOB_ID = import.meta.env.VITE_ADMOB_ID || '';
const STRIPE_STARTER_URL = import.meta.env.VITE_STRIPE_STARTER_URL || '';
const STRIPE_PRO_URL = import.meta.env.VITE_STRIPE_PRO_URL || '';
const STRIPE_ANNUAL_URL = import.meta.env.VITE_STRIPE_ANNUAL_URL || '';

const Index = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendConfig = useCallback(() => {
    const targetOrigin = window.location.origin;
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'APP_CONFIG',
        url: SUPABASE_URL,
        key: SUPABASE_KEY,
        admobId: ADMOB_ID,
        stripeLinks: {
          starter: STRIPE_STARTER_URL,
          pro: STRIPE_PRO_URL,
          annual: STRIPE_ANNUAL_URL,
        },
      },
      targetOrigin,
    );
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'GET_APP_CONFIG' || e.data?.type === 'GET_SUPABASE_CONFIG') {
        sendConfig();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [sendConfig]);

  return (
    <iframe
      ref={iframeRef}
      src="/app.html"
      title="SnapCaption"
      onLoad={sendConfig}
      style={{
        width: '100vw',
        height: '100vh',
        border: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default Index;
