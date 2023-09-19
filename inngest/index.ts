import * as payments from './payments';
import * as emails from './emails';
import * as test from './test';

export const functions = [...Object.values(emails), ...Object.values(payments)];

// Only set the cron trigger to run in production, not branch envs
if (!process.env.IS_PULL_REQUEST) {
  console.log('Not a pull request preview, adding test cron');
  functions.push(...Object.values(test));
}

export { inngest } from './client';
