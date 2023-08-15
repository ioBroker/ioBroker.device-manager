import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@iobroker/adapter-react-v5/Theme';
import Utils from '@iobroker/adapter-react-v5/Components/Utils';
import TabApp from './tab-app';

let themeName = Utils.getThemeName();

function build() {
	ReactDOM.render(
		<ThemeProvider theme={theme(themeName)}>
			<TabApp
				adapterName="device-manager"
				onThemeChange={(_theme) => {
					themeName = _theme;
					build();
				}}
			/>
		</ThemeProvider>,
		document.getElementById('root'),
	);
}

build();
