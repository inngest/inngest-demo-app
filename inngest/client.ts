import { Inngest } from "inngest";

import type { Events } from "./events";

export const inngest = new Inngest<Events>({
  name: "Demo App",
});
