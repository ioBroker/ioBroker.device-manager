import * as React from 'react';

import GenericApp from '@iobroker/adapter-react-v5/GenericApp';
import theme from '@iobroker/adapter-react-v5/Theme';
import Page from './components/Page';

/**
 * @type {(_theme: Theme) => import("@material-ui/styles").StyleRules}
 */

/**
 * TabApp component
 * @extends {GenericApp<typeof TabApp>}
 * @param {object} props
 * @param {string} props.instance - instance name
 * @param {string} props.language - language, e.g. 'en'
 * @param {Record<string, any>} props.socket - socket.io object
 * @param {Record<string, any>} props.themeType - theme type, e.g. 'light'
 * @param {Record<string, any>} props.themeName - theme name, e.g. 'blue'
 * @param {Record<string, any>} props.theme - theme object
 */
class TabApp extends GenericApp {
	constructor(props) {
		const extendedProps = {
			...props,
			bottomButtons: false,
			encryptedFields: [],
			/** @type {Record<string, Record<string, string>>} */
			translations: {
				en: require('../i18n/en.json'),
				de: require('../i18n/de.json'),
				ru: require('../i18n/ru.json'),
				pt: require('../i18n/pt.json'),
				nl: require('../i18n/nl.json'),
				fr: require('../i18n/fr.json'),
				it: require('../i18n/it.json'),
				es: require('../i18n/es.json'),
				pl: require('../i18n/pl.json'),
				'zh-cn': require('../i18n/zh-cn.json'),
			},
		};
		super(props, extendedProps);
	}

	onConnectionReady() {
		// executed when connection is ready
	}

	render() {
		if (!this.state.loaded) {
			return super.render();
		}
		/** @type {object} */
		const appStyle = {
			overflow: 'auto',
			minHeight: '100vh',
		};

		return (
			<div className="App" style={appStyle}>
				<Page context={this} />
				{this.renderError()}
				{this.renderToast()}
			</div>
		);
	}
}

export default TabApp;
