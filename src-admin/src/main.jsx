import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';

import { CssBaseline } from '@mui/material';

import { Utils, Theme } from '@iobroker/adapter-react-v5';

import App from './App';

let themeName = Utils.getThemeName();
function build() {
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(<ThemeProvider theme={Theme(themeName)}>
        <CssBaseline />
        <App
            adapterName="device-manager"
            onThemeChange={_theme => {
                themeName = _theme;
                build();
            }}
        />
    </ThemeProvider>);
}

build();
