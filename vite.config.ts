import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  const webhookMiddleware = () => ({
    name: 'lemon-squeezy-webhook',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/webhook/payments' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            const signature = req.headers['x-signature'];
            const secret = env.LEMON_SQUEEZY_WEBHOOK_SECRET || 'my-secret-password';

            const hmac = crypto.createHmac('sha256', secret);
            const digest = hmac.update(body).digest('hex');

            if (signature !== digest) {
              console.error('Invalid signature for webhook');
              res.statusCode = 401;
              res.end('Invalid signature');
              return;
            }

            try {
              const payload = JSON.parse(body);
              const eventName = payload.meta.event_name;
              const userId = payload.meta.custom_data?.user_id;

              console.log('--- REMOTE WEBHOOK RECEIVED ---');
              console.log(`Event: ${eventName}`);
              console.log(`User ID: ${userId}`);
              console.log(`Calculated Signature: ${digest}`);
              console.log(`Received Signature: ${signature}`);

              // Detailed check for matching logic
              if (signature !== digest) {
                console.error('!!! SIGNATURE MISMATCH !!! check LEMON_SQUEEZY_WEBHOOK_SECRET');
              } else {
                console.log('Signature Verified.');
              }

              if ((eventName === 'order_created' || eventName === 'subscription_created') && userId) {
                const supabaseUrl = env.VITE_SUPABASE_URL;
                const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

                console.log(`Supabase URL exists: ${!!supabaseUrl}`);
                console.log(`Service Key exists: ${!!supabaseServiceKey}`);

                if (supabaseUrl && supabaseServiceKey) {
                  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

                  // First check if profile exists
                  const { data: profileCheck, error: checkError } = await supabaseAdmin
                    .from('profiles')
                    .select('id, tier')
                    .eq('id', userId)
                    .single();

                  console.log('Current Profile:', profileCheck, 'Error:', checkError?.message);

                  const { data: updateData, error } = await supabaseAdmin
                    .from('profiles')
                    .upsert({ id: userId, tier: 'premium' })
                    .select();

                  if (error) {
                    console.error('FAILED to update profile:', error.message);
                    console.error('Error Details:', error);
                  } else {
                    console.log('SUCCESS: Profile updated:', updateData);
                  }
                } else {
                  console.error('MISSING CRITICAL ENV VARS: ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
                }
              } else {
                console.log('Ignored event or missing user_id. Payload dump:', JSON.stringify(payload, null, 2));
              }
              res.statusCode = 200;
              res.end('OK');
            } catch (err) {
              console.error('Error processing webhook payload:', err);
              res.statusCode = 500;
              res.end('Error processing webhook');
            }
          });
        } else {
          next();
        }
      });
    }
  });

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true
    },
    plugins: [react(), webhookMiddleware()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
