import fs from 'fs';
import path from 'path';

const REQUIRED_DESKTOP_VARS = [
    'VITE_AUTH_URL',
];

const REQUIRED_BACKEND_VARS = [
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
    'SENDGRID_API_KEY',
    'DB'
];

function validateEnv(dir, vars, isBackend = false) {
    const envPath = path.join(dir, isBackend ? 'wrangler.toml' : '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error(`❌ Missing ${envPath}`);
        return false;
    }

    const content = fs.readFileSync(envPath, 'utf-8');
    let missing = [];

    vars.forEach(v => {
        if (!content.includes(v)) {
            missing.push(v);
        }
    });

    if (missing.length > 0) {
        console.error(`❌ ${dir} is missing: ${missing.join(', ')}`);
        return false;
    }

    console.log(`✅ ${dir} environment is valid.`);
    return true;
}

const desktopDir = path.join(process.cwd(), 'apps/desktop');
const backendDir = path.join(process.cwd(), 'backend');

const dValid = validateEnv(desktopDir, REQUIRED_DESKTOP_VARS);
const bValid = validateEnv(backendDir, REQUIRED_BACKEND_VARS, true);

if (!dValid || !bValid) {
    process.exit(1);
}
