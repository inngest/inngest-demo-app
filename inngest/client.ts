import { Inngest, EventSchemas } from 'inngest';

import type { Events } from './events';

export const inngest = new Inngest({
  name: 'Demo App',
  schemas: new EventSchemas().fromRecord<Events>(),
  env: process.env.RENDER_GIT_BRANCH,
});
