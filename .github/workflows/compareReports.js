const fs = require('fs');
const path = require('path');

function readJsonFile(filePath) {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  return null;
}

function calculateDiff(oldSize, newSize) {
  return newSize - oldSize;
}

function formatSize(size) {
  if (size === null) {
    return '-';
  }

  const formattedSize = (size / 1024).toFixed(3) + 'kb';
  return formattedSize;
}

const packagesDir = './packages';
const oldPackagesDir = './old/packages';
const packages = [...new Set([...fs.readdirSync(packagesDir), ...fs.readdirSync(oldPackagesDir)])];

let tableRows = '';

for (const pkg of packages) {
  const oldReport = readJsonFile(path.join(oldPackagesDir, pkg, 'report.json'));
  const newReport = readJsonFile(path.join(packagesDir, pkg, 'report.json'));

  const oldSize = oldReport ? oldReport[0].gzipSize : null;
  const newSize = newReport ? newReport[0].gzipSize : null;
  let diff = oldSize && newSize ? calculateDiff(oldSize, newSize) : null;

  if (oldSize === null) {
    diff = newSize;;
  }

  if (newSize === null) {
    diff = oldSize;;
  }

  let diffText = '-';
  let diffEmoji = '';
  diffText = diff < 0 ? '-' : '+' + formatSize(diff);
  diffEmoji = diff < 0 ? '🟢' : '🟡';

  tableRows += `
    <tr>
      <td>${pkg}</td>
      <td>${formatSize(oldSize)}</td>
      <td>${formatSize(newSize, diff)}</td>
      <td>${diffText} ${diffEmoji}</td>
    </tr>
  `.trim();
}

console.log(`
<table>
  <thead>
    <th>package</th>
    <th>old</th>
    <th>new</th>
    <th>diff</th>
  </thead>
  <tbody>
    ${tableRows}
  </tbody>
</table>
`.trim());
