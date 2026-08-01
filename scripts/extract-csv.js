const fs = require('fs');
const transcriptPath = "C:\\Users\\aruna\\.gemini\\antigravity\\brain\\c13d995c-a816-4f60-a701-0603c2314429\\.system_generated\\logs\\transcript_full.jsonl";

const text = fs.readFileSync(transcriptPath, 'utf8');
const match = text.match(/hscode,tariff_description([\s\S]*?)("\})/g);

if (match) {
  let content = match[match.length - 1];
  content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  content = content.substring(0, content.length - 2);
  fs.writeFileSync('data/customs.csv', content);
  console.log('Successfully wrote data/customs.csv, length:', content.length);
} else {
  console.log('Not found');
}
