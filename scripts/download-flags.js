// scripts/download-flags.js
const fs = require('fs');
const https = require('https');
const path = require('path');

const flagsDir = path.join(__dirname, '..', 'public', 'flags');

if (!fs.existsSync(flagsDir)) {
    fs.mkdirSync(flagsDir, { recursive: true });
}

// Map of local filename -> direct Wikimedia image URL (or raw GitHub equivalent)
// We use Wikipedia/Wikimedia standard SVG or PNG links.
const flags = {
    'ottoman.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Flag_of_the_Ottoman_Empire_%281844%E2%80%931922%29.svg/320px-Flag_of_the_Ottoman_Empire_%281844%E2%80%931922%29.svg.png',
    'byzantine.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Flag_of_the_Palaiologos_Emperor.svg/320px-Flag_of_the_Palaiologos_Emperor.svg.png',
    'seljuk.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Seljuk_Eagle.svg/320px-Seljuk_Eagle.svg.png',
    'roman.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Vexilloid_of_the_Roman_Empire.svg/320px-Vexilloid_of_the_Roman_Empire.svg.png',
    'safavid.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Flag_of_Safavid_Iran_%281502-1524%29.svg/320px-Flag_of_Safavid_Iran_%281502-1524%29.svg.png',
    'timurid.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Flag_of_the_Timurid_Empire.svg/320px-Flag_of_the_Timurid_Empire.svg.png',
    'golden_horde.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Flag_of_the_Golden_Horde.svg/320px-Flag_of_the_Golden_Horde.svg.png',
    'mamluk.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Flag_of_Mamluk_Sultanate.svg/320px-Flag_of_Mamluk_Sultanate.svg.png',
    'gokturk.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_the_G%C3%B6kt%C3%BCrk_Khaganate.svg/320px-Flag_of_the_G%C3%B6kt%C3%BCrk_Khaganate.svg.png',
    'mughal.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Flag_of_the_Mughal_Empire.svg/320px-Flag_of_the_Mughal_Empire.svg.png',
    'ilkhanate.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Flag_of_the_Ilkhanate.svg/320px-Flag_of_the_Ilkhanate.svg.png',
    'karakhanid.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Kara-Khanid_Khanate_flag.svg/320px-Kara-Khanid_Khanate_flag.svg.png', // Fallback or accurate if available, using placeholder if not. Let's try to get valid ones or they fail gracefully.
    'qarakoyunlu.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Qara_Qoyunlu_Flag.svg/320px-Qara_Qoyunlu_Flag.svg.png',
    'akkoyunlu.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Aq_Qoyunlu_flag.svg/320px-Aq_Qoyunlu_flag.svg.png',
    'khwarazmian.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Flag_of_the_Khwarazmian_Empire.svg/320px-Flag_of_the_Khwarazmian_Empire.svg.png',
    'ghaznavid.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Flag_of_the_Ghaznavid_Empire_according_to_the_Catalan_Atlas.svg/320px-Flag_of_the_Ghaznavid_Empire_according_to_the_Catalan_Atlas.svg.png',
    'uyghur.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Uyghur_Khaganate_flag.svg/320px-Uyghur_Khaganate_flag.svg.png',
    'abbasid.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Black_Flag.svg/320px-Black_Flag.svg.png',
    'umayyad.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Umayyad_Flag.svg/320px-Umayyad_Flag.svg.png',
    'russian_empire.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/320px-Flag_of_Russia.svg.png',
    'british_empire.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/320px-Flag_of_the_United_Kingdom_%283-5%29.svg.png',
    'french_empire.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/320px-Flag_of_France.svg.png'
};

Object.entries(flags).forEach(([filename, url]) => {
    const destPath = path.join(flagsDir, filename);
    const file = fs.createWriteStream(destPath);

    const options = {
        headers: {
            'User-Agent': 'TurkicAtlasAI/1.0 (https://github.com/yourusername/turkic-atlas-ai) Node.js'
        }
    };

    https.get(url, options, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${filename}`);
            });
        } else {
            console.error(`Failed to download ${filename} - Status: ${response.statusCode}`);
            file.close();
            fs.unlink(destPath, () => { }); // Delete empty/failed file
        }
    }).on('error', (err) => {
        console.error(`Error downloading ${filename}: ${err.message}`);
        file.close();
        fs.unlink(destPath, () => { });
    });
});
