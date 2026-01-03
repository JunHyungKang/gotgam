const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Simple env parser for .env.local
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env.local');
        if (!fs.existsSync(envPath)) {
            console.warn('Warning: .env.local not found at', envPath);
            return;
        }
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            // Basic parsing: KEY=VALUE
            // Ignores comments
            if (line.trim().startsWith('#')) return;
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                // Remove quotes if present
                value = value.replace(/^['"](.*)['"]$/, '$1');
                process.env[key] = value;
            }
        });
    } catch (e) {
        console.error('Error loading .env.local', e);
    }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.');
    console.log('Current env keys:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Connecting to Supabase at:', supabaseUrl);
    console.log('Fetching orders to generate activity...');

    const { data, error } = await supabase
        .from('orders')
        .select('id')
        .limit(1);

    if (error) {
        console.error('Supabase Error:', error);
        process.exit(1);
    }

    console.log('Success! Supabase activity generated.');
    console.log('Data sample:', data);
}

main();
