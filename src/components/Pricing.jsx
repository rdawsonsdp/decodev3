import React, { useEffect } from 'react';

/**
 * Stripe Pricing Table embed
 * Reads env vars (NEXT_PUBLIC_* or REACT_APP_*) at build time.
 * If vars missing, shows a helpful message.
 */
const Pricing = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  const pricingTableId = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID || process.env.REACT_APP_STRIPE_PRICING_TABLE_ID;
  const hostedUrl = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_URL || process.env.REACT_APP_STRIPE_PRICING_TABLE_URL;

  useEffect(() => {
    // If embedded mode, inject Stripe script
    if (publishableKey && pricingTableId) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/pricing-table.js';
      script.async = true;
      document.body.appendChild(script);
      return () => { document.body.removeChild(script); };
    }
  }, [publishableKey, pricingTableId]);

  if (hostedUrl && !(publishableKey && pricingTableId)) {
    // If a hosted URL is provided and we aren't embedding, redirect now.
    window.location.href = hostedUrl;
    return null;
  }

  if (!(publishableKey && pricingTableId)) {
    return (
      <div style={{maxWidth: 720, margin: '40px auto', padding: 16}}>
        <h2>Pricing</h2>
        <p>To embed your Stripe Pricing Table here, set the following environment variables on Vercel:</p>
        <pre style={{background:'#f8fafc', padding:12, borderRadius:8, overflowX:'auto'}}>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID=prctbl_...
        </pre>
        <p>Or set <code>NEXT_PUBLIC_STRIPE_PRICING_TABLE_URL</code> for a hosted page link.</p>
      </div>
    );
  }

  return (
    <div style={{maxWidth: 960, margin: '40px auto', padding: 16}}>
      <div style={{textAlign:'center', marginBottom: 12}}>
        <h2>Choose your Premium plan</h2>
        <p>Unlock full access to Decode Your Kid.</p>
      </div>
      <stripe-pricing-table
        pricing-table-id={pricingTableId}
        publishable-key={publishableKey}
      ></stripe-pricing-table>
    </div>
  );
};

export default Pricing;
