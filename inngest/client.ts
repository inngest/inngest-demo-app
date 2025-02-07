import { Inngest, EventSchemas, InngestMiddleware } from 'inngest';

import type { EventUnion } from './events';

export const inngest = new Inngest({
  id: 'demo-app',
  schemas: new EventSchemas().fromUnion<EventUnion>(),
  env: ['main', 'staging'].includes(process.env.RENDER_GIT_BRANCH)
    ? null
    : process.env.RENDER_GIT_BRANCH,
  appVersion: process.env.RENDER_GIT_COMMIT || 'local',
});
