import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

function deleteFoldersRecursive(delPath, exceptions) {
    if (fs.existsSync(delPath)) {
        const stat = fs.statSync(delPath);
        if (stat.isDirectory()) {
            const files = fs.readdirSync(delPath);
            for (const file of files) {
                const curPath = `${delPath}/${file}`;
                if (exceptions && exceptions.find(e => curPath.endsWith(e))) {
                    continue;
                }

                const _stat = fs.statSync(curPath);
                if (_stat.isDirectory()) {
                    deleteFoldersRecursive(curPath);
                    fs.rmdirSync(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            }
        } else {
            fs.unlinkSync(delPath);
        }
    }
}

function copyRecursiveSync(src, dest, ignoreFiles, renameFiles) {
    const exists = fs.existsSync(src);
    if (!exists) {
        return;
    }
    const stats = fs.statSync(src);
    const isDirectory = stats.isDirectory();
    if (isDirectory) {
        !fs.existsSync(dest) && fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(childItemName =>
            copyRecursiveSync(`${src}/${childItemName}`, `${dest}/${childItemName}`));
    } else {
        if (ignoreFiles && ignoreFiles.includes(src)) {
            return;
        }
        if (renameFiles && renameFiles[src]) {
            dest = `${dest}/${renameFiles[src]}`;
        }
        fs.copyFileSync(src, dest);
    }
}

deleteFoldersRecursive(`${__dirname}/../admin`);

// copyRecursiveSync(
//     `${__dirname}/build`,
//     `${__dirname}/../admin`,
//     [],
//     {
//         'index.html': 'tab_m.html',
//     },
// );
