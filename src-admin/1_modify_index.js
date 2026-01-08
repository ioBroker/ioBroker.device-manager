import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

setTimeout(() => {
    let text = fs.readFileSync(`${__dirname}/../admin/tab_m.html`, 'utf8');
    text = text.replace(
        `<script>
          const script = document.createElement('script');
            window.registerSocketOnLoad = function (cb) {
                window.socketLoadedHandler = cb;
            };
            script.onload = function () {
                typeof window.socketLoadedHandler === 'function' && window.socketLoadedHandler();
            };
            setTimeout(() => {
                script.src = window.location.port.startsWith('300')
                    ? \`${window.location.protocol}//${window.location.hostname}:8082/lib/js/socket.io.js\`
                    : '%PUBLIC_URL%/../../lib/js/socket.io.js';
            }, 1000);

            document.head.appendChild(script);
        </script>`,
        '<script src="../../lib/js/socket.io.js"></script>',
    );
    fs.writeFileSync(`${__dirname}/../admin/tab_m.html`, text, 'utf8');
    process.exit();
}, 500);
