import { getCalendar } from '../_gcal.js';

export default async function handler(req, res) {
  const { eventId } = req.query;
  const cal = getCalendar();

  if (req.method === 'DELETE') {
    try {
      await cal.events.delete({ calendarId: 'primary', eventId });
      res.json({ ok: true });
    } catch (err) {
      console.error('[calendar/delete]', err.message);
      res.json({ ok: false, error: 'unknown', message: err.message });
    }
    return;
  }

  if (req.method === 'PATCH') {
    try {
      const { summary, start, end } = req.body;
      const requestBody = {};
      if (summary !== undefined) requestBody.summary = summary;
      if (start !== undefined) requestBody.start = start;
      if (end !== undefined) requestBody.end = end;

      const { data } = await cal.events.patch({
        calendarId: 'primary',
        eventId,
        requestBody,
      });

      res.json({
        ok: true,
        event: {
          id: data.id,
          title: data.summary ?? '(No title)',
          start: data.start?.dateTime ?? data.start?.date ?? null,
          end: data.end?.dateTime ?? data.end?.date ?? null,
          htmlLink: data.htmlLink ?? null,
        },
      });
    } catch (err) {
      console.error('[calendar/update]', err.message);
      res.json({ ok: false, error: 'unknown', message: err.message });
    }
    return;
  }

  res.status(405).json({ ok: false, message: 'Method not allowed' });
}
