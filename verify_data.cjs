const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/data.json', 'utf8'));
const targetIds = Array.from({length: 15}, (_, i) => `3.${i + 22}`);
const result = data.filter(item => targetIds.includes(item.id));

console.log(JSON.stringify(result, null, 2));
