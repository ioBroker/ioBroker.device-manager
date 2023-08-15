import * as React from 'react';
import { Grid, Paper } from '@mui/material';
import TopBar from './TopBar';
import DeviceList from './DeviceList';

export default function Page(params) {
	const { socket, context } = params;
	const [selectedInstance, setSelectedInstance] = React.useState('');
	const [filter, setFilter] = React.useState(null);

	const getTranslation = (text) => {
		if (typeof text === 'string') {
			return text;
		} else if (typeof text === 'object') {
			return text[socket.systemLang] || '';
		} else {
			return '';
		}
	};

	context.getTranslation = getTranslation;

	return (
		<div className="App-header">
			<Paper elevation={1}>
				<TopBar
					selectedInstance={selectedInstance}
					setSelectedInstance={setSelectedInstance}
					socket={socket}
					filter={filter}
					setFilter={setFilter}
					context={context}
				/>
				<Grid
					container
					style={{
						justifyContent: 'center',
						alignItems: 'stretch',
					}}
				>
					<DeviceList selectedInstance={selectedInstance} socket={socket} filter={filter} context={context} />
				</Grid>
			</Paper>
		</div>
	);
}
