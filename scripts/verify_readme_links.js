const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('README.md', 'utf8');
const regex = /(?:src|href)="([^"]+)"/g;
let match;
const links = [];
while ((match = regex.exec(content)) !== null) {
  const url = match[1];
  if (url.startsWith('./public') || url.startsWith('public') || url.startsWith('./dist') || url.startsWith('evidence')) {
    links.push(url);
  }
}

console.log('Total local media links in README.md:', links.length);
let missing = 0;
for (const link of links) {
  const cleanPath = link.replace(/^\.\//, '');
  if (!fs.existsSync(cleanPath)) {
    console.error('MISSING:', link, '->', cleanPath);
    missing++;
  }
}
if (missing === 0) {
  console.log('All local media links in README.md exist!');
} else {
  console.error(`Total missing links: ${missing}`);
}
