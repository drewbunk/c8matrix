import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const { message, alertType } = await req.json();
    
    const base44 = createClientFromRequest(req);
    
    // Get alert settings
    const settings = await base44.asServiceRole.entities.SiteSettings.list();
    const siteSettings = settings[0];
    
    if (!siteSettings) {
      return Response.json({ error: 'Settings not found' }, { status: 404 });
    }
    
    // Check if alerts are enabled for this type
    const alertEnabled = alertType === 'message' 
      ? siteSettings.alertOnMessages 
      : siteSettings.alertOnPayments;
    
    if (!alertEnabled || !siteSettings.alertPhoneNumber) {
      return Response.json({ 
        success: false, 
        message: 'Alerts not enabled or phone number not set' 
      });
    }
    
    // Send SMS via Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');
    
    if (!accountSid || !authToken || !twilioPhone) {
      console.error('Twilio credentials missing');
      return Response.json({ error: 'Twilio not configured' }, { status: 500 });
    }
    
    const auth = btoa(`${accountSid}:${authToken}`);
    const body = new URLSearchParams({
      To: siteSettings.alertPhoneNumber,
      From: twilioPhone,
      Body: message,
    });
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Twilio error:', error);
      return Response.json({ error: 'Failed to send SMS' }, { status: 500 });
    }
    
    return Response.json({ success: true });
    
  } catch (error) {
    console.error('SMS alert error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});