import * as dotenv from 'dotenv';

import express from 'express';
import { serve } from 'inngest/express';

dotenv.config();

import { functions, inngest } from './inngest';

const PORT = 3030;

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
  res.json({ success: true });
});

app.use('/api/inngest', serve(inngest, [...functions]));

app.listen(PORT, async () => {
  console.log(`✅ Server started on localhost:${PORT}
➡️ Inngest running at http://localhost:${PORT}/api/inngest`);

  // Attempt to self-register the app after deploy
  if (process.env.RENDER_EXTERNAL_URL) {
    const inngestURL = new URL('/api/inngest', process.env.RENDER_EXTERNAL_URL);
    const result = await fetch(inngestURL, {
      method: 'PUT',
    });
    const json = await result.json();
    console.log(`Register attempted:`, result.status, json);
  }
});
