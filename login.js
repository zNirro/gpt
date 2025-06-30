const { Authflow, Titles } = require('prismarine-auth');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TOKENS_FILE = path.join(__dirname, 'tokens.json');

function readTokens() {
  if (!fs.existsSync(TOKENS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveTokens(tokens) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

async function login(email) {
  console.log(`Starting device code auth for ${email}...`);
  const flow = new Authflow(email, path.join(__dirname, 'cache'), {
    flow: 'live',
    authTitle: Titles.MinecraftJava,
    deviceType: 'Win32'
  }, ({ user_code, verification_uri }) => {
    console.log(`\nOpen ${verification_uri} and enter code: ${user_code}\n`);
  });

  const { token, profile } = await flow.getMinecraftJavaToken({ fetchProfile: true });

  const tokens = readTokens();
  tokens.push({
    email,
    accessToken: token,
    refreshToken: undefined,
    uuid: profile.id,
    name: profile.name
  });
  saveTokens(tokens);
  console.log(`Stored tokens for ${profile.name}`);
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Microsoft account email: ', async (email) => {
    rl.close();
    try {
      await login(email.trim());
    } catch (err) {
      console.error('Failed to login:', err.message);
    }
  });
}

if (require.main === module) {
  main();
}
