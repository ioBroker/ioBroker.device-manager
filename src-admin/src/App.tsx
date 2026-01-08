import React from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import {
    GenericApp,
    Loader,
    type IobTheme,
    type GenericAppProps,
    type GenericAppState,
    type ThemeName,
    type ThemeType,
    I18n,
} from '@iobroker/adapter-react-v5';

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
import DeviceList from './components/DeviceManager';

interface AppState extends GenericAppState {
    isFloatComma: boolean;
    dateFormat: string;
}
const styles: { appStyle: React.CSSProperties } = {
    appStyle: {
        overflow: 'hidden',
        width: '100%',
        height: '100%',
    },
};

/**
 * TabApp component
 * @extends {GenericApp<typeof App>}
 * @param props
 * @param props.instance - instance name
 * @param props.language - language, e.g. 'en'
 * @param props.socket - socket.io object
 * @param props.themeType - theme type, e.g. 'light'
 * @param props.themeName - theme name, e.g. 'blue'
 * @param props.theme - theme object
 */
export default class App extends GenericApp<GenericAppProps, AppState> {
    constructor(props: GenericAppProps) {
        const extendedProps = {
            ...props,
            bottomButtons: false,
            encryptedFields: [],
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
        super(props, extendedProps);

        this.state = {
            ...this.state,
            isFloatComma: true,
            dateFormat: 'DD.MM.YYYY',
        };
    }

    async onConnectionReady(): Promise<void> {
        super.onConnectionReady();
        const systemConfig = await this.socket.getSystemConfig();
        this.setState({
            isFloatComma: systemConfig?.common.isFloatComma ?? true,
            dateFormat: systemConfig?.common.dateFormat || 'DD.MM.YYYY',
        });
    }

    render() {
        if (!this.state.loaded) {
            return (
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={this.state.theme}>
                        <Loader themeType={this.state.themeType} />
                    </ThemeProvider>
                </StyledEngineProvider>
            );
        }

        return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={this.state.theme}>
                    <div
                        className="App"
                        style={styles.appStyle}
                    >
                        <DeviceList
                            socket={this.socket}
                            themeType={this.state.themeType as ThemeType}
                            themeName={this.state.themeName as ThemeName}
                            theme={this.state.theme as IobTheme}
                            isFloatComma={this.state.isFloatComma}
                            dateFormat={this.state.dateFormat}
                        />
                    </div>
                    {this.renderError()}
                    {this.renderToast()}
                </ThemeProvider>
            </StyledEngineProvider>
        );
    }
}
