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
 * @type {(_theme: Theme) => import("@material-ui/styles").StyleRules}
 */

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
        super(props, extendedProps);
    }

    // onConnectionReady() {
    //     // executed when connection is ready
    // }

    render() {
        if (!this.state.loaded) {
            return super.render();
        }
        /** @type {object} */
        const appStyle = {
            overflow: 'hidden',
            width: '100%',
            height: '100%',
        };

        return <div className="App" style={appStyle}>
            <Page context={this} />
            {this.renderError()}
            {this.renderToast()}
        </div>;
    }
}

export default App;
