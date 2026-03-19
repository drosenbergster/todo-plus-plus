import express from 'express';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';

const execFileAsync = promisify(execFile);
const app = express();
const PORT = 3001;

const gwsBin = path.join(os.homedir(), '.npm-global', 'bin', 'gws');

async function runGws(args) {
  const env = { ...process.env, PATH: `${path.dirname(gwsBin)}:${process.env.PATH}` };
  const { stdout } = await execFileAsync(gwsBin, args, { env, timeout: 15000 });
  return JSON.parse(stdout);
}

app.get('/api/calendar', async (_req, res) => {
  try {
    const now = new Date();
    const weekLater = new Date(now);
    weekLater.setDate(weekLater.getDate() + 7);

    const timeMin = now.toISOString();
    const timeMax = weekLater.toISOString();

    const data = await runGws([
      'calendar', 'events', 'list',
      '--params', JSON.stringify({
        calendarId: 'primary',
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 50,
      }),
    ]);

    const items = data?.items ?? [];

    const events = items.map(evt => ({
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
    const msg = err.message ?? String(err);

    if (msg.includes('ENOENT') || msg.includes('not found'))
      return res.json({ ok: false, error: 'gws_not_installed', message: 'gws CLI not found. Run: npm install -g @googleworkspace/cli' });

    if (msg.includes('auth') || msg.includes('credential') || msg.includes('token'))
      return res.json({ ok: false, error: 'not_authenticated', message: 'Not authenticated. Run: gws auth setup && gws auth login -s calendar' });

    console.error('[calendar]', msg);
    res.json({ ok: false, error: 'unknown', message: msg });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Todo++ API server running on http://localhost:${PORT}`);
});
