import * as React from 'react';
import { Grid, TextField } from '@mui/material';
import InstanceList from './InstanceList';
import { InstanceActionButton } from './InstanceActionButton';

export default function TopBar(params) {
	const { socket, context, selectedInstance, setSelectedInstance, setFilter } = params;
	const [adapterInstance, setAdapterInstance] = React.useState(null);
	const [actions, setActions] = React.useState(null);

	let timeoutId = null;
	const handleFilterChange = (event) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			if (event.target.value === '') {
				setFilter(null);
			} else {
				setFilter(event.target.value);
			}
		}, 250);
	};

	React.useEffect(() => {
		console.log(adapterInstance?.actions);
		console.log(context);
		setActions(adapterInstance?.actions);
	}, [adapterInstance]);

	return (
		<Grid
			item
			container
			alignItems="center"
			style={{
				position: 'sticky',
				zIndex: 10,
				top: 0,
				marginBottom: '10px',
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 33%)',
			}}
		>
			<div style={{ position: 'relative', left: '10px', top: '5px' }}>
				{actions &&
					adapterInstance.actions.map((a) => (
						<InstanceActionButton key={a.id} action={a} context={context} />
					))}
			</div>
			<InstanceList
				style={{ marginLeft: '10px', marginRight: '10px' }}
				socket={socket}
				setSelectedInstance={setSelectedInstance}
				selectedInstance={selectedInstance}
				setAdapterInstance={setAdapterInstance}
				context={context}
			/>
			<TextField variant="standard" label="Filter by name" onChange={handleFilterChange} />
		</Grid>
	);
}
