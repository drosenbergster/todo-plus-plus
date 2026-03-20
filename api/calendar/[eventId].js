import { calFetch } from '../_gcal.js';

export default async function handler(req, res) {
  const { eventId } = req.query;

  if (req.method === 'DELETE') {
    try {
      await calFetch(`/calendars/primary/events/${encodeURIComponent(eventId)}`, { method: 'DELETE' });
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
      const body = {};
      if (summary !== undefined) body.summary = summary;
      if (start !== undefined) body.start = start;
      if (end !== undefined) body.end = end;

      const data = await calFetch(`/calendars/primary/events/${encodeURIComponent(eventId)}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
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
