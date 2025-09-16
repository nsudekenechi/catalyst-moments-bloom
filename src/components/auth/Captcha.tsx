import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';

export type CaptchaProvider = 'turnstile' | 'hcaptcha' | 'auto';

export interface CaptchaProps {
  provider?: CaptchaProvider;
  siteKey?: string; // Public site key from your CAPTCHA provider
  className?: string;
}

export interface CaptchaHandle {
  getToken: () => string | null;
  reset: () => void;
}

declare global {
  interface Window {
    turnstile?: any;
    hcaptcha?: any;
  }
}

const DEFAULT_TURNSTILE_SITEKEY = '1x00000000000000000000AA'; // Test site key
const DEFAULT_HCAPTCHA_SITEKEY = '10000000-ffff-ffff-ffff-000000000001'; // Test site key

const Captcha = forwardRef<CaptchaHandle, CaptchaProps>(
  ({ provider = 'auto', siteKey, className }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [activeProvider, setActiveProvider] = useState<'turnstile' | 'hcaptcha' | null>(null);

    useImperativeHandle(ref, () => ({
      getToken: () => token,
      reset: () => {
        try {
          if (activeProvider === 'turnstile' && window.turnstile && widgetIdRef.current) {
            window.turnstile.reset(widgetIdRef.current);
            setToken(null);
          } else if (activeProvider === 'hcaptcha' && window.hcaptcha && widgetIdRef.current !== null) {
            window.hcaptcha.reset(widgetIdRef.current);
            setToken(null);
          }
        } catch (e) {
          // no-op
        }
      }
    }), [token, activeProvider]);

    useEffect(() => {
      const node = containerRef.current;
      if (!node) return;

      // Decide provider
      const shouldUseTurnstile = provider === 'turnstile' || (provider === 'auto' && window.turnstile);
      const shouldUseHCaptcha = provider === 'hcaptcha' || (provider === 'auto' && !shouldUseTurnstile && window.hcaptcha);

      // Render Turnstile if available
      if (shouldUseTurnstile && window.turnstile) {
        setActiveProvider('turnstile');
        widgetIdRef.current = window.turnstile.render(node, {
          sitekey: siteKey || DEFAULT_TURNSTILE_SITEKEY,
          callback: (t: string) => setToken(t),
          'error-callback': () => setToken(null),
          'expired-callback': () => setToken(null),
          theme: 'auto'
        });
        return;
      }

      // Render hCaptcha if available
      if (shouldUseHCaptcha && window.hcaptcha) {
        setActiveProvider('hcaptcha');
        widgetIdRef.current = window.hcaptcha.render(node, {
          sitekey: siteKey || DEFAULT_HCAPTCHA_SITEKEY,
          callback: (t: string) => setToken(t),
          'error-callback': () => setToken(null),
          'expired-callback': () => setToken(null),
          theme: 'auto'
        });
        return;
      }

      // If neither loaded yet, retry shortly
      const id = window.setTimeout(() => {
        if (!containerRef.current) return;
        if (window.turnstile || window.hcaptcha) {
          // trigger re-run
          if (provider === 'auto') {
            // force re-render by updating state
            setActiveProvider(null);
          }
        }
      }, 500);

      return () => window.clearTimeout(id);
    }, [provider, siteKey]);

    return (
      <div className={className}>
        <div ref={containerRef} />
        {!token && (
          <p className="mt-2 text-xs text-muted-foreground">
            Complete the CAPTCHA to continue. If verification keeps failing, ensure the site key in Supabase Auth matches this widget.
          </p>
        )}
      </div>
    );
  }
);

Captcha.displayName = 'Captcha';
export default Captcha;
