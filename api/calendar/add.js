import { getCalendar } from '../_gcal.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim())
      return res.status(400).json({ ok: false, error: 'missing_text', message: 'Event text is required.' });

    const cal = getCalendar();
    const { data } = await cal.events.quickAdd({
      calendarId: 'primary',
      text: text.trim(),
    });

    res.json({
      ok: true,
      event: {
        id: data.id,
        title: data.summary ?? text.trim(),
        start: data.start?.dateTime ?? data.start?.date ?? null,
        end: data.end?.dateTime ?? data.end?.date ?? null,
        htmlLink: data.htmlLink ?? null,
      },
    });
  } catch (err) {
    console.error('[calendar/add]', err.message);
    res.json({ ok: false, error: 'unknown', message: err.message });
  }
}
