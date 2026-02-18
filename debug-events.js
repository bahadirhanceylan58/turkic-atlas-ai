require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEvents() {
    console.log(`Fetching historical_events...`);
    const { data, error } = await supabase
        .from('historical_events')
        .select('*');

    if (error) {
        console.error('❌ Error fetching events:', error);
    } else {
        console.log(`✅ Success! Found ${data.length} events.`);
        if (data.length > 0) {
            console.log('First event:', data[0]);
        } else {
            console.log('Table is empty.');
        }
    }
}

checkEvents();
