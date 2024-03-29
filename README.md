# Inngest Demo app

This app is a simple Node.js app that serves several functions for demoing Inngest.

This app works in the following ways:

1. It has several Inngest functions (w/ and w/out steps)
2. Some functions throw errors at random to simulate failures
3. A cron function runs every 10 minutes to send fake events to your local app

## Usage

### Run the app locally with the Inngest dev server

```
# Install app dependencies
pnpm
# Run the app in development mode
pnpm dev
# In a separate shell session, run the dev server
npx inngest-cli@latest dev -u http://localhost:3030/api/inngest
```

### Deploy

This application is deployed to Render automatically on ever push to the `main` branch on Github.

### Send test events

If you'd like to manually send a bunch of test events, use the `pnpm send` command:

```shell
pnpm send
# Send a specific number of events
pnpm send 500
# Send a specific event type
pnpm send 30 app/account.created
```
