import * as payments from './payments';
import * as emails from './emails';
import * as test from './test';

const functions = [...Object.values(emails), ...Object.values(payments)];

// Only set the cron trigger to run in production, not branch envs
if (
  !Boolean(process.env.RENDER_GIT_BRANCH) &&
  process.env.RENDER_GIT_BRANCH === 'main'
) {
  console.log('Not a pull request preview, adding test cron');
  functions.push(...Object.values(test));
}

export { functions };

export { inngest } from './client';
