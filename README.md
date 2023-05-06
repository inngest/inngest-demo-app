# Inngest Demo app

This app is a simple Node.js app that serves several functions for demoing Inngest.

This app works in the following ways:

1. It has several Inngest functions (w/ and w/out steps)
2. Some functions throw errors at random to simulate failures
3. A cron function runs every 2 minutes to send fake events to your local all

## Usage

### Run the app locally with the Inngest dev server

```
# Install app dependencies
yarn
# Run the app in development mode
yarn dev
# In a separate shell session, run the dev server
npx inngest-cli@latest dev -u http://localhost:3030/api/inngest
```

### Deploy

```
# TBD
```

### Send test events

If you'd like to manually send a bunch of test events, use the `yarn send` command:

```shell
yarn send
# Send a specific number of events
yarn send 500
# Send a specific event type
yarn send 30 app/account.created
```
