require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPlace(query) {
    console.log(`Searching for "${query}"...`);
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .ilike('name', `%${query}%`);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Results:', data.length);
        data.forEach(p => {
            console.log(`- ID: ${p.id}, Name: ${p.name}, Type: ${p.type}`);
            console.log(`  Lat: ${p.lat}, Lng: ${p.lng}`);
        });
    }
}

checkPlace('kangal');
