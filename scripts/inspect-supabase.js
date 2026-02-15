const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log("Searching for 'Çetinkaya' or 'Cetinkaya' in 'places'...");
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .or('name.ilike.%Çetinkaya%,name.ilike.%Cetinkaya%');

    if (error) {
        console.error("Error:", error);
    } else {
        if (data.length > 0) {
            console.log(`Found ${data.length} matching rows.`);
            console.log("Sample Data:", data[0]);
        } else {
            console.log("No matching rows found in Supabase.");
        }
    }
}

inspect();
