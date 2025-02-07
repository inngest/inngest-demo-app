import { Inngest, EventSchemas, InngestMiddleware } from 'inngest';

import type { EventUnion } from './events';

const env = ['main', 'staging'].includes(process.env.RENDER_GIT_BRANCH)
  ? null
  : process.env.RENDER_GIT_BRANCH;

console.log('DEBUG env=', env);

export const inngest = new Inngest({
  id: 'demo-app',
  schemas: new EventSchemas().fromUnion<EventUnion>(),
  env,
  appVersion: process.env.RENDER_GIT_COMMIT || 'local',
});
