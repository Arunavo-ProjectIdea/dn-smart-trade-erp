const fs = require('fs');
const transcriptPath = "C:\\Users\\aruna\\.gemini\\antigravity\\brain\\c13d995c-a816-4f60-a701-0603c2314429\\.system_generated\\logs\\transcript_full.jsonl";
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
for (const line of lines) {
  if (!line) continue;
  const json = JSON.parse(line);
  if (json.type === 'USER_INPUT' && json.content.includes('hscode,tariff_description')) {
    const text = json.content;
    const startIdx = text.indexOf('hscode,tariff_description');
    const csvData = text.substring(startIdx);
    fs.writeFileSync('data/customs.csv', csvData);
    console.log('Extracted to data/customs.csv');
    break;
  }
}
