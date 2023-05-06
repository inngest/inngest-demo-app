import * as dotenv from "dotenv";

import express from "express";
import { serve } from "inngest/express";

dotenv.config();

import { functions, inngest } from "./inngest";

const PORT = 3030;

const app = express();

console.log(functions[0]);

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use("/api/inngest", serve(inngest, [...functions]));

app.listen(PORT, () => {
  console.log(`✅ Server started on localhost:${PORT}
➡️ Inngest running at http://localhost:${PORT}/api/inngest`);
});
