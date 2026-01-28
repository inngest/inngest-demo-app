// import { type AnyInngestFunction } from 'inngest/components/InngestFunction';
import * as ai from './ai';
import * as payments from './payments';
import * as emails from './emails';
import * as test from './test';
import * as rss from './rss';

const functions = [
  ...Object.values(ai),
  ...Object.values(emails),
  ...Object.values(payments),
  ...Object.values(rss)
];

// We use a function to do this in order to dynamically add the cron test function
export function getFunctions() {
  console.log('Get functions', process.env.RENDER_GIT_BRANCH);
  // Only set the cron trigger to run in production, not branch envs
  if (
    !Boolean(process.env.RENDER_GIT_BRANCH) ||
    process.env.RENDER_GIT_BRANCH === 'main'
  ) {
    console.log('Not a pull request preview, adding test cron');
    functions.push(...Object.values(test));
  }
  return functions;
}

export { inngest } from './client';
