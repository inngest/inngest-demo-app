import { Inngest, EventSchemas, InngestMiddleware } from 'inngest';

import type { EventUnion } from './events';

export const inngest = new Inngest({
  id: 'demo-app',
  schemas: new EventSchemas().fromUnion<EventUnion>(),
  env: process.env.RENDER_GIT_BRANCH,
});
