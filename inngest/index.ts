import * as payments from './payments';
import * as emails from './emails';
import * as test from './test';

export const functions = [
  ...Object.values(emails),
  ...Object.values(payments),
  ...Object.values(test),
];

export { inngest } from './client';
