import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId, action = 'create' } = await req.json();

    if (!bookingId) {
      return Response.json({ error: 'bookingId is required' }, { status: 400 });
    }

    // Get the booking
    const bookings = await base44.asServiceRole.entities.Booking.filter({ id: bookingId });
    const booking = bookings[0];

    if (!booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Get Google Calendar access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');

    if (action === 'delete' && booking.googleCalendarEventId) {
      // Delete from Google Calendar
      const deleteResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${booking.googleCalendarEventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (deleteResponse.ok) {
        await base44.asServiceRole.entities.Booking.update(bookingId, {
          googleCalendarEventId: null,
        });
        return Response.json({ success: true, action: 'deleted' });
      }
    }

    // Create or update event
    const event = {
      summary: `${booking.serviceType || 'Booking'} - ${booking.clientName}`,
      description: `Client: ${booking.clientName}\nEmail: ${booking.clientEmail}\n${booking.clientPhone ? `Phone: ${booking.clientPhone}\n` : ''}${booking.notes ? `\nNotes: ${booking.notes}` : ''}`,
      start: {
        dateTime: booking.startDateTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: booking.endDateTime,
        timeZone: 'UTC',
      },
      attendees: [
        { email: booking.clientEmail },
      ],
    };

    let calendarResponse;

    if (action === 'update' && booking.googleCalendarEventId) {
      // Update existing event
      calendarResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${booking.googleCalendarEventId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );
    } else {
      // Create new event
      calendarResponse = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );
    }

    if (!calendarResponse.ok) {
      const error = await calendarResponse.text();
      return Response.json({ error: 'Failed to sync with Google Calendar', details: error }, { status: 500 });
    }

    const calendarEvent = await calendarResponse.json();

    // Update booking with calendar event ID
    await base44.asServiceRole.entities.Booking.update(bookingId, {
      googleCalendarEventId: calendarEvent.id,
    });

    return Response.json({ 
      success: true, 
      eventId: calendarEvent.id,
      action: action === 'update' ? 'updated' : 'created'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});