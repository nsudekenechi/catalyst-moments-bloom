export type CaptchaProvider = 'turnstile' | 'hcaptcha' | 'auto';

// Update these values when you have your actual site key from Supabase Auth settings
export const CAPTCHA_PROVIDER: CaptchaProvider = 'auto';
export const CAPTCHA_SITE_KEY: string | undefined = undefined; // e.g. '0x00000000000000000000000000000000000000' or Turnstile sitekey
