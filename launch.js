const mineflayer = require('mineflayer');
const ProxyAgent = require('proxy-agent');
const fs = require('fs');
const path = require('path');

const TOKENS_FILE = path.join(__dirname, 'tokens.json');
const PROXY_FILE = path.join(__dirname, 'proxies.txt');

function loadTokens() {
  if (!fs.existsSync(TOKENS_FILE)) throw new Error('tokens.json not found');
  return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
}

function loadProxies() {
  if (!fs.existsSync(PROXY_FILE)) return [];
  return fs.readFileSync(PROXY_FILE, 'utf8')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);
}

async function launchBots(server, port = 25565) {
  const tokens = loadTokens();
  const proxies = loadProxies();
  tokens.forEach((t, i) => {
    const agent = proxies[i] ? new ProxyAgent(proxies[i]) : undefined;
    const bot = mineflayer.createBot({
      host: server,
      port,
      username: t.uuid,
      session: {
        accessToken: t.accessToken,
        profile: { id: t.uuid, name: t.name }
      },
      agent
    });
    bot.once('login', () => {
      console.log(`${t.name} joined`);
      bot.chat('Hello world');
    });
    bot.on('end', () => console.log(`${t.name} disconnected`));
    bot.on('error', err => console.log(`${t.name} error:`, err.message));
  });
}

if (require.main === module) {
  const [,, host, port] = process.argv;
  if (!host) {
    console.log('Usage: node launch.js <server> [port]');
    process.exit(1);
  }
  launchBots(host, parseInt(port || '25565'));
}
