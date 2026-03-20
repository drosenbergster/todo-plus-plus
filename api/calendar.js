import { calFetch } from './_gcal.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  try {
    const now = new Date();
    const weekLater = new Date(now);
    weekLater.setDate(weekLater.getDate() + 7);

    const params = new URLSearchParams({
      timeMin: now.toISOString(),
      timeMax: weekLater.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 50,
    });

    const data = await calFetch(`/calendars/primary/events?${params}`);
    const events = (data.items ?? []).map(evt => ({
      id: evt.id,
      title: evt.summary ?? '(No title)',
      start: evt.start?.dateTime ?? evt.start?.date ?? null,
      end: evt.end?.dateTime ?? evt.end?.date ?? null,
      allDay: !evt.start?.dateTime,
      location: evt.location ?? null,
      htmlLink: evt.htmlLink ?? null,
    }));

    res.json({ ok: true, events });
  } catch (err) {
    console.error('[calendar]', err.message);
    res.json({ ok: false, error: 'unknown', message: err.message });
  }
}
