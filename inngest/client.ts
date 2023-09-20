import { Inngest, EventSchemas } from 'inngest';

import type { Events } from './events';

export const inngest = new Inngest({
  name: 'Demo App',
  schemas: new EventSchemas().fromRecord<Events>(),
  eventKey: process.env.IS_PULL_REQUEST
    ? process.env.INNGEST_BRANCH_EVENT_KEY
    : process.env.INNGEST_EVENT_KEY,
  env: process.env.RENDER_GIT_BRANCH,
});
