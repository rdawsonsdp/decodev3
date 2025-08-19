export const ACCESS = { FREE: 'free', PREMIUM: 'premium' };
export const isPremium = (tier) => tier === ACCESS.PREMIUM;

export const DEFAULT_TIER = ACCESS.PREMIUM;

const env = (k) => (process.env[k] || '');

export const getCheckoutUrl = () => {
  // 1) Hosted Stripe Pricing Table share link (fastest path)
  const hostedPricing = env('NEXT_PUBLIC_STRIPE_PRICING_TABLE_URL') || env('REACT_APP_STRIPE_PRICING_TABLE_URL');
  if (hostedPricing) return hostedPricing;

  // 2) Embedded pricing table route if we have IDs/keys
  const pricingId = env('NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID') || env('REACT_APP_STRIPE_PRICING_TABLE_ID');
  const pubKey = env('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY') || env('REACT_APP_STRIPE_PUBLISHABLE_KEY');
  if (pricingId && pubKey) return '/pricing';

  // 3) Fallback to a single checkout link
  return env('NEXT_PUBLIC_CHECKOUT_URL') || env('REACT_APP_CHECKOUT_URL') || '/subscribe';
};
