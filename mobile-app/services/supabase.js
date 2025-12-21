import { createClient } from '@supabase/supabase-js';

// Same Supabase credentials as web app
const supabaseUrl = 'https://okjtycflldzztdynffzh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ranR5Y2ZsbGR6enRkeW5mZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMDEyODQsImV4cCI6MjA4MTc3NzI4NH0.yjpEI4paXw1mb4a8v9YvZSYfHaYmnuR3dCVfwQ-oen4';

console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 Anon Key:', supabaseAnonKey.substring(0, 20) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Quick connectivity check
supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
        console.error('❌ Supabase connection failed:', error.message);
    } else {
        console.log('✅ Supabase connected successfully!');
        if (data.session) {
            console.log('👤 Active Session found for:', data.session.user.email);
        } else {
            console.log('ℹ️ No active session (ready for Login)');
        }
    }
});

