import * as dotenv from 'dotenv';

import express from 'express';
import { serve } from 'inngest/express';

dotenv.config();

import { getFunctions, inngest } from './inngest/index';

const PORT = 3030;

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
  res.json({ success: true });
});

const functions = getFunctions();

app.use(
  '/api/inngest',
  serve({
    client: inngest,
    functions,
  })
);

app.listen(PORT, async () => {
  console.log(`✅ Server started on localhost:${PORT}
➡️ Inngest running at http://localhost:${PORT}/api/inngest`);

  // Attempt to self-register the app after deploy
  if (process.env.RENDER_EXTERNAL_URL) {
    console.log(
      `Attempting self-register. Functions: `,
      functions.map((f) => f.name).join(', ')
    );
    const inngestURL = new URL('/api/inngest', process.env.RENDER_EXTERNAL_URL);
    const result = await fetch(inngestURL, {
      method: 'PUT',
    });
    await sleep(2000);
    try {
      const json = await result.json();
      console.log(
        `Register attempted:`,
        inngestURL.toString(),
        result.status,
        json
      );
    } catch (err) {
      console.log(
        `Register failed:`,
        inngestURL.toString(),
        result.status,
        result.body
      );
    }
  }
});

function sleep(t: number): Promise<void> {
  return new Promise((res) => {
    return setTimeout(res, t);
  });
}
