// scripts/generate-svg-flags.js
const fs = require('fs');
const path = require('path');

const flagsDir = path.join(__dirname, '..', 'public', 'flags');

if (!fs.existsSync(flagsDir)) {
    fs.mkdirSync(flagsDir, { recursive: true });
}

// Basic flag templates (Colors and typical central symbols/text)
const flagData = {
    'ottoman': { bg: '#E30A17', fg: '#FFFFFF', symbol: '☾★' },
    'byzantine': { bg: '#b30000', fg: '#FFD700', symbol: 'B B\nB B' }, // Top left, bottom right B's
    'seljuk': { bg: '#007FFF', fg: '#FFFFFF', symbol: '🦅' }, // Double-headed eagle rep
    'roman': { bg: '#800000', fg: '#FFD700', symbol: 'SPQR' },
    'safavid': { bg: '#009900', fg: '#FFFF00', symbol: '🦁🌞' }, // Lion and Sun
    'timurid': { bg: '#000000', fg: '#FF0000', symbol: '❂❂❂' }, // Three red circles
    'golden_horde': { bg: '#FFD700', fg: '#000000', symbol: '☪' },
    'mamluk': { bg: '#FFFF00', fg: '#000000', symbol: '☾' },
    'gokturk': { bg: '#00BFFF', fg: '#FFFFFF', symbol: '🐺' }, // Wolf head
    'mughal': { bg: '#008000', fg: '#FFFF00', symbol: '🌞' },
    'ilkhanate': { bg: '#FF0000', fg: '#FFD700', symbol: '■' },
    'karakhanid': { bg: '#FF8C00', fg: '#FFFFFF', symbol: '🐅' },
    'qarakoyunlu': { bg: '#000000', fg: '#FFFFFF', symbol: '🐑' },
    'akkoyunlu': { bg: '#FFFFFF', fg: '#000000', symbol: '🐑' },
    'khwarazmian': { bg: '#000000', fg: '#FFD700', symbol: '☾' },
    'ghaznavid': { bg: '#000000', fg: '#FFD700', symbol: '🌙' },
    'uyghur': { bg: '#FFD700', fg: '#000000', symbol: '🐺' },
    'abbasid': { bg: '#000000', fg: '#FFFFFF', symbol: 'ﷲ' },
    'umayyad': { bg: '#FFFFFF', fg: '#000000', symbol: 'ﷲ' },
    'russian_empire': { bg: '#000000', fg: '#FFFF00', symbol: '🦅' }, // simplification
    'british_empire': { bg: '#00247D', fg: '#FFFFFF', symbol: '✝' },
    'french_empire': { bg: '#002395', fg: '#FFFFFF', symbol: '⚜' }
};

Object.entries(flagData).forEach(([filename, data]) => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40">
        <rect width="60" height="40" fill="${data.bg}" rx="4"/>
        <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="20" fill="${data.fg}" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${data.symbol}</text>
        <rect width="60" height="40" fill="none" stroke="#fff" stroke-width="2" rx="4" opacity="0.3"/>
    </svg>`;

    // Mapbox needs explicit Image loading. SVGs are often supported by modern browsers as images.
    // Saving as .svg
    fs.writeFileSync(path.join(flagsDir, `${filename}.svg`), svgContent);
    console.log(`Generated: ${filename}.svg`);
});
