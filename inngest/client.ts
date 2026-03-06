import { Inngest } from 'inngest';
import { extendedTracesMiddleware } from 'inngest/experimental';

export const inngest = new Inngest({
  id: 'demo-app',
  env: process.env.RENDER_GIT_BRANCH,
  middleware: [extendedTracesMiddleware()],
});
