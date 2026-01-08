import React from 'react';
import { createRoot } from 'react-dom/client';
import pack from '../package.json';
import App from './App';
import * as serviceWorker from './serviceWorker';

declare global {
    interface Window {
        sentryDSN: string;
        adapterName: string | undefined;
    }
}

window.adapterName = 'device-manager';

console.log(`iobroker.${window.adapterName}@${pack.version}`);

const container = window.document.getElementById('root');

if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
