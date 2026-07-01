const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const targets = ['src', 'seed.js'];
const files = [];

function collect(filePath) {
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
        for (const item of fs.readdirSync(filePath)) {
            collect(path.join(filePath, item));
        }
        return;
    }

    if (filePath.endsWith('.js')) {
        files.push(filePath);
    }
}

for (const target of targets) {
    collect(path.join(root, target));
}

let failed = false;

for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', file], {
        encoding: 'utf8'
    });

    if (result.status !== 0) {
        failed = true;
        console.error(result.stderr || result.stdout);
    }
}

if (failed) {
    process.exit(1);
}

console.log(`Chequeo sintactico OK (${files.length} archivos JS).`);
