import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const { customerName, customerEmail, customerPhone } = await req.json();

    if (!customerName || !customerEmail) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: 'price_1SoLs4EbxXzXBraI69wfXiWb',
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/book-call?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`,
      customer_email: customerEmail,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        customer_name: customerName,
        customer_phone: customerPhone || '',
      },
    });

    // Create client record (payment completed, meeting not yet scheduled)
    await base44.asServiceRole.entities.Client.create({
      name: customerName,
      email: customerEmail,
      phone: customerPhone || '',
      stripePaymentId: session.id,
      amountPaid: 9700,
      status: 'payment_completed',
    });

    return Response.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Discovery checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});