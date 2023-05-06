import { InngestFunction } from "inngest/components/InngestFunction";
import { Events } from "./events";
import * as payments from "./payments";
import * as emails from "./emails";
import * as test from "./test";

export const functions: InngestFunction<Events>[] = [
  ...Object.values(emails),
  ...Object.values(payments),
  ...Object.values(test),
];

export { inngest } from "./client";
