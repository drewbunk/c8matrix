import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { sessionId, meetingDateTime } = await req.json();

    if (!sessionId || !meetingDateTime) {
      return Response.json({ error: 'sessionId and meetingDateTime required' }, { status: 400 });
    }

    // Find client by stripe session ID
    const clients = await base44.asServiceRole.entities.Client.filter({ stripePaymentId: sessionId });
    const client = clients[0];

    if (!client) {
      return Response.json({ error: 'Client not found' }, { status: 404 });
    }

    // Get Google Calendar access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');

    // Create calendar event
    const startTime = new Date(meetingDateTime);
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes

    const calendarEvent = {
      summary: `${client.name} – Creator Nest Discovery`,
      description: `Discovery call with ${client.name}\n\nEmail: ${client.email}\nPhone: ${client.phone || 'Not provided'}\n\nPaid: $97`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'America/Phoenix',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/Phoenix',
      },
      attendees: [
        { email: 'drew@treadandtorque.com', organizer: true },
        { email: client.email },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'email', minutes: 60 },
        ],
      },
      guestsCanModify: false,
      sendUpdates: 'all',
    };

    const calendarResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/drew@treadandtorque.com/events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calendarEvent),
      }
    );

    if (!calendarResponse.ok) {
      const error = await calendarResponse.text();
      console.error('Calendar API error:', error);
      throw new Error('Failed to create calendar event');
    }

    const event = await calendarResponse.json();

    // Update client record
    await base44.asServiceRole.entities.Client.update(client.id, {
      meetingDateTime: startTime.toISOString(),
      googleCalendarEventId: event.id,
      status: 'meeting_scheduled',
    });

    // Send notification email to admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'Creator Nest Booking',
      to: 'drew@treadandtorque.com',
      subject: `🎉 New Paid Discovery Call: ${client.name}`,
      body: `New paid booking confirmed!

Client: ${client.name}
Email: ${client.email}
Phone: ${client.phone || 'Not provided'}
Meeting: ${startTime.toLocaleString('en-US', { timeZone: 'America/Phoenix' })} MST
Payment: $97 (Stripe Session: ${sessionId})

Calendar invite sent to both parties.
`,
    });

    return Response.json({ 
      success: true, 
      eventId: event.id,
      meetingLink: event.htmlLink 
    });

  } catch (error) {
    console.error('Schedule call error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});