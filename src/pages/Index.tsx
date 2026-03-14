import { useEffect, useRef, useCallback } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const Index = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendConfig = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({
      type: 'SUPABASE_CONFIG',
      url: SUPABASE_URL,
      key: SUPABASE_KEY,
    }, '*');
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'GET_SUPABASE_CONFIG') {
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
