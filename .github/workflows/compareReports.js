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

function formatSize(size, diff) {
  if (size === null) {
    return '-';
  }

  const formattedSize = (size / 1024).toFixed(3) + 'kb';

  if (diff === null) {
    return formattedSize;
  }

  if (!diff) {
    return formattedSize;
  }

  return formattedSize + ' ' + (diff < 0 ? '🟢' : '🟡');
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
  const diff = oldSize && newSize ? calculateDiff(oldSize, newSize) : null;

  tableRows += `
    <tr>
      <td>${pkg}</td>
      <td>${formatSize(oldSize)}</td>
      <td>${formatSize(newSize, diff)}</td>
      <td>${diff ? formatSize(diff) : '-'}</td>
    </tr>
  `;
}

console.log(`
<table>
  <thead>
    <th>path</th>
    <th>main</th>
    <th>this</th>
    <th>diff</th>
  </thead>
  <tbody>
    ${tableRows}
  </tbody>
</table>
`);
