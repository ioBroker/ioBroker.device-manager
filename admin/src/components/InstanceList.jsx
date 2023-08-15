// import Connection from '@iobroker/adapter-react-v5/Connection';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function InstanceList(params) {
	const { socket, context, setSelectedInstance, selectedInstance, setAdapterInstance } = params;
	const [instanceList, setInstanceList] = React.useState({});

	React.useEffect(() => {
		const loadAdapters = async () => {
			console.log('Waiting for connection');
			await socket.waitForFirstConnection();
			console.log('Loading adapters...');
			const result = await socket.sendTo('device-manager.0', 'listInstances');
			setInstanceList(result);
			console.log({ result });
		};
		loadAdapters().catch(console.error);
	}, []);

	React.useEffect(() => {
		if (selectedInstance !== '') {
			loadInstanceInfos().catch(console.error);
		}
	}, [selectedInstance]);

	const handleStateChange = (event) => {
		setSelectedInstance(event.target.value);
	};

	const loadInstanceInfos = async () => {
		console.log(`Loading instance infos for ${selectedInstance}...`);
		const info = await socket.sendTo(selectedInstance, 'dm:instanceInfo');
		console.log('instanceInfo', { result: info });
		if (!info || typeof info !== 'object' || info.apiVersion !== 'v1') {
			throw new Error(
				`Message returned from sendTo() doesn't look like one from DeviceManagement, did you accidentally handle the message in your adapter? ${JSON.stringify(
					info,
				)}`,
			);
		}
		setAdapterInstance(info);
	};

	const actionContext = {
		instanceHandler: (action) => {
			return async () => await socket.sendTo(selectedInstance, 'dm:instanceAction', { actionId: action.id });
		},
		deviceHandler: (deviceId, action, refresh) => {
			return async () =>
				await socket.sendTo(selectedInstance, 'dm:deviceAction', { actionId: action.id, deviceId }, refresh);
		},
	};

	context.action = actionContext;

	return (
		<div>
			<FormControl>
				<InputLabel id="instance-select-label" style={{ top: '10px' }}>
					Instance
				</InputLabel>
				<Select
					labelId="instance-select-label"
					id="instance-select"
					value={selectedInstance}
					label="Select Instance"
					onChange={handleStateChange}
					displayEmpty
					variant="standard"
					sx={{ minWidth: 120 }}
				>
					{Object.entries(instanceList).map(([id]) => (
						<MenuItem key={id} value={id}>
							{id}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
}
