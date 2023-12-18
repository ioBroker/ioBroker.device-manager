import React from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import GenericApp from '@iobroker/adapter-react-v5/GenericApp';
import Page from './components/Page';

import de from './i18n/de.json';
import en from './i18n/en.json';
import ru from './i18n/ru.json';
import pt from './i18n/pt.json';
import nl from './i18n/nl.json';
import fr from './i18n/fr.json';
import it from './i18n/it.json';
import es from './i18n/es.json';
import pl from './i18n/pl.json';
import uk from './i18n/uk.json';
import zhCn from './i18n/zh-cn.json';

/**
 * TabApp component
 * @extends {GenericApp<typeof App>}
 * @param {object} props
 * @param {string} props.instance - instance name
 * @param {string} props.language - language, e.g. 'en'
 * @param {Record<string, any>} props.socket - socket.io object
 * @param {Record<string, any>} props.themeType - theme type, e.g. 'light'
 * @param {Record<string, any>} props.themeName - theme name, e.g. 'blue'
 * @param {Record<string, any>} props.theme - theme object
 */
class App extends GenericApp {
    constructor(props) {
        const extendedProps = {
            ...props,
            bottomButtons: false,
            encryptedFields: [],
            /** @type {Record<string, Record<string, string>>} */
            translations: {
                en,
                de,
                ru,
                pt,
                nl,
                fr,
                it,
                es,
                pl,
                uk,
                'zh-cn': zhCn,
            },
        };

        // extendedProps.socket = {
        //     protocol: 'http:',
        //     host: '192.168.178.45',
        //     port: 8081,
        // };

        super(props, extendedProps);
    }

    // onConnectionReady() {
    //     // executed when connection is ready
    // }

    render() {
        if (!this.state.loaded) {
            return super.render();
        }
        const body = window.document.body;
        if (body && (
            (this.state.themeType === 'dark' && !body.className.includes('dark-theme')) ||
            (this.state.themeType === 'light' && body.className.includes('light-theme'))
        ))   {
            let className = body.className;
            className = className.replace('dark-theme', '').replace('light-theme', '');
            if (this.state.themeType === 'dark') {
                className += ' dark-theme';
            } else {
                className += ' light-theme';
            }
            className = className.trim();
            body.className = className;
        }

        /** @type {object} */
        const appStyle: React.CSSProperties = {
            overflow: 'hidden',
            width: '100%',
            height: '100%',
        };

        // className "device-manager-app" used in tests
        return <StyledEngineProvider injectFirst>
            <ThemeProvider theme={this.state.theme}>
                <div className="App device-manager-app" style={appStyle}>
                    <Page
                        selectedInstance=""
                        socket={this.socket}
                        uploadImagesToInstance={`${this.adapterName}.${this.instance}`}
                    />
                    {this.renderError()}
                    {this.renderToast()}
                </div>
            </ThemeProvider>
        </StyledEngineProvider>;
    }
}

export default App;
