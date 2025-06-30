# Minecraft Bulk Bot Launcher

This project provides two scripts:

- `login.js` – Authenticate Microsoft Minecraft accounts via device code flow and store their access tokens in `tokens.json`.
- `launch.js` – Launch multiple bots using stored tokens with optional proxies.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add proxies to `proxies.txt` (one per line). Leave empty if no proxies are needed.
3. Run `node login.js` for each Microsoft account you wish to store.
4. Start bots:
   ```bash
   node launch.js <server> [port]
   ```

If `login.js` reports `403 Forbidden`, double-check that the account owns
Minecraft Java Edition and that the device code was completed before the
timeout.

Bots will join sequentially with their stored credentials and send a greeting message.
