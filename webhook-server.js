
import http from 'http';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local manually since we don't have dotenv installed
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim().replace(/^["']|["']$/g, ''); // Request quotes
            if (!process.env[key.trim()]) {
                process.env[key.trim()] = value;
            }
        }
    });
}

const PORT = 3000;
const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
// INTENTIONALLY using Service Role Key to bypass RLS for administrative updates
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!WEBHOOK_SECRET) console.warn("WARNING: LEMONSQUEEZY_WEBHOOK_SECRET is not set.");
if (!SUPABASE_URL) console.warn("WARNING: VITE_SUPABASE_URL is not set.");
if (!SUPABASE_SERVICE_KEY) console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. Database updates will fail.");

const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_KEY || '');

const server = http.createServer((req, res) => {
    if (req.method !== 'POST') {
        res.writeHead(405);
        res.end('Method Not Allowed');
        return;
    }

    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const rawBody = Buffer.concat(body);
        const signature = req.headers['x-signature'];

        if (!WEBHOOK_SECRET) {
            console.error("Server missing webhook secret.");
            res.writeHead(500);
            res.end("Server configuration error");
            return;
        }

        // Verify Signature
        const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature || '', 'utf8');

        if (
            !signature ||
            signatureBuffer.length !== digest.length ||
            !crypto.timingSafeEqual(digest, signatureBuffer)
        ) {
            console.error("Invalid signature.");
            res.writeHead(401);
            res.end('Invalid signature');
            return;
        }

        try {
            const payload = JSON.parse(rawBody.toString());
            const eventName = payload.meta.event_name;
            const customData = payload.meta.custom_data;
            const userId = customData?.user_id;

            console.log(`Received event: ${eventName} for User ID: ${userId}`);

            if (eventName === 'order_created' || eventName === 'order_paid') {
                if (userId) {
                    console.log(`Upgrading user ${userId} to premium...`);

                    const { error } = await supabase
                        .from('profiles')
                        .update({ tier: 'premium' })
                        .eq('id', userId);

                    if (error) {
                        console.error('Supabase update error:', error);
                        res.writeHead(500);
                        res.end('Database update failed');
                    } else {
                        console.log(`User ${userId} upgraded successfully.`);
                        res.writeHead(200);
                        res.end('Webhook processed');
                    }
                } else {
                    console.warn("No user_id found in custom_data. Skipping update.");
                    res.writeHead(200);
                    res.end('No user_id provided');
                }
            } else {
                res.writeHead(200);
                res.end('Event ignored');
            }

        } catch (err) {
            console.error("Error processing webhook:", err);
            res.writeHead(400);
            res.end('Invalid JSON');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Webhook server running on port ${PORT}`);
    console.log(`Expose this server: ngrok http ${PORT}`);
});
