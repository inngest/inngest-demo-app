import * as dotenv from 'dotenv';

dotenv.config();

import { connect } from 'inngest/connect';
import express from 'express';
import { getFunctions, inngest } from './inngest/index';

const instanceId = process.env.RENDER_INSTANCE_ID || 'local';

console.log(
  `Worker: connecting (instanceId:${instanceId}, appVersion:${inngest.appVersion})`
);

const PORT = 3030;

function main() {
  const app = express();
  app.use(express.json());
  app.get('/', (req, res) => {
    res.json({ success: true, connectionStatus });
  });

  let connectionStatus = 'disconnected';

  connect(inngest, {
    functions: getFunctions(),
    instanceId: process.env.RENDER_INSTANCE_ID || 'local',
  })
    .then((connection) => {
      console.log('Worker: connected');
      connectionStatus = 'connected';
      connection.closed.then(() => {
        console.log('Worker: disconnected');
        connectionStatus = 'disconnected';
      });
    })
    .catch((err) => {
      console.log('Worker: failed to connect', err);
    });

  // Start the server for health checks
  app.listen(PORT, async () => {
    console.log(`✅ Server started on localhost:${PORT}`);
  });
}

main();
