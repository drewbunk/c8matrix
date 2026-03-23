import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-12-18.acacia',
});

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not set');
      return Response.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }
    
    // Verify webhook signature
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
    
    console.log('Webhook event:', event.type);
    
    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      console.log('Payment completed:', {
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
        amount: session.amount_total,
      });
      
      // Send SMS alert for payment
      const amountFormatted = `$${(session.amount_total / 100).toFixed(2)}`;
      const customerEmail = session.customer_details?.email || 'Unknown';
      
      base44.asServiceRole.functions.invoke('sendSMSAlert', {
        message: `💰 Payment received: ${amountFormatted} from ${customerEmail}`,
        alertType: 'payment'
      }).catch(err => console.error('SMS alert failed:', err));
    }
    
    return Response.json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
});