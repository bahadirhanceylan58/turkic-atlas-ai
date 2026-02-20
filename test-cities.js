const { getCitiesForYear } = require('./lib/historicalCityNames');
const year = 273;
const cities = getCitiesForYear(year);
console.log(`Year: ${year}`);
console.log(`Cities found: ${cities.length}`);
if (cities.length > 0) {
    console.log('Sample Cities:');
    cities.slice(0, 5).forEach(c => console.log(`- ${c.historicalName} (${c.modernName})`));
} else {
    console.log('No cities found for this year!');
}
