import fs from 'fs';
import path from 'path';

const outDir = 'docs';
const indexPath = path.join(outDir, 'index.html');
const index = fs.readFileSync(indexPath, { encoding: 'utf-8' });
const regex = /type="module" crossorigin/i;
const update = index.replace(regex, 'defer');

fs.writeFileSync(path.join(indexPath), update, { encoding: 'utf-8' });
