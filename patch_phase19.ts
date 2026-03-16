import fs from 'fs';
import path from 'path';

const UPDATED_DATA_PATH = 'public/data_updated_3_22_3_36.json';
const HAN_BAL_PATH = '4.han bal.txt';
const DAN_PATH = '7.dan.txt';

interface WordMeanings {
  [word: string]: string;
}

interface YogaData {
  id: string;
  '4.han bal': string;
  word_meanings?: WordMeanings;
}

const targetIds = Array.from({ length: 15 }, (_, i) => `3.${22 + i}`);

async function patch() {
  const rawUpdated = fs.readFileSync(UPDATED_DATA_PATH, 'utf-8');
  const updatedData: YogaData[] = JSON.parse(rawUpdated);

  // 1. Patch 4.han bal.txt
  let hanBalContent = fs.readFileSync(HAN_BAL_PATH, 'utf-8').split('\n');
  updatedData.forEach(item => {
    if (targetIds.includes(item.id)) {
      const lineId = item.id.replace('.', '-');
      const index = hanBalContent.findIndex(line => line.trim().startsWith(lineId));
      if (index !== -1) {
        hanBalContent[index] = `${lineId} ${item['4.han bal']}`;
      } else {
        // 만약 없다면 추가 (보수적 접근)
        hanBalContent.push(`${lineId} ${item['4.han bal']}`);
      }
    }
  });
  fs.writeFileSync(HAN_BAL_PATH, hanBalContent.join('\n'), 'utf-8');
  console.log('Patched 4.han bal.txt');

  // 2. Patch 7.dan.txt
  // 단어 해석 데이터는 여러 줄에 걸쳐 있을 수 있음. 
  // 7.dan.txt 구조: 3-22 아래에 단어 <의미> 반복. 
  // json의 word_meanings: { "word": "meaning" }
  let danLines = fs.readFileSync(DAN_PATH, 'utf-8').split('\n');
  
  updatedData.forEach(item => {
    if (targetIds.includes(item.id)) {
      const lineId = item.id.replace('.', '-');
      const startIdx = danLines.findIndex(line => line.trim() === lineId);
      
      if (startIdx !== -1) {
        // 기존 3-22 구역 삭제 (다음 ID가 나올 때까지)
        let endIdx = startIdx + 1;
        while (endIdx < danLines.length && !/^\d+-\d+$/.test(danLines[endIdx].trim())) {
          endIdx++;
        }
        
        const newMeanings = Object.entries(item.word_meanings || {}).map(([word, meaning]) => `  ${word} ${meaning}`);
        danLines.splice(startIdx + 1, endIdx - (startIdx + 1), ...newMeanings);
      } else {
        // 구역이 없으면 마지막에 추가
        danLines.push(lineId);
        Object.entries(item.word_meanings || {}).forEach(([word, meaning]) => {
          danLines.push(`  ${word} ${meaning}`);
        });
      }
    }
  });

  fs.writeFileSync(DAN_PATH, danLines.join('\n'), 'utf-8');
  console.log('Patched 7.dan.txt');
}

patch().catch(err => {
  console.error(err);
  process.exit(1);
});
