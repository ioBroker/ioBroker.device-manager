import * as React from 'react';
import DeviceCard2 from './DeviceCard2';

export default function DeviceList(params) {
	const { socket, context, selectedInstance, filter } = params;
	const [loaded, setLoaded] = React.useState(false);
	const [devices, setDevices] = React.useState([]);
	const [showSpinner, setShowSpinner] = React.useState(false);
	const [openDialog, setOpenDialog] = React.useState();
	const [message, setMessage] = React.useState();
	const [confirm, setConfirm] = React.useState();
	const [form, setForm] = React.useState();
	const [progress, setProgress] = React.useState();
	const [lastInstance, setLastInstance] = React.useState('');

	let resetLoadedTimeout = null;

	React.useEffect(() => {
		if (selectedInstance !== '' && selectedInstance !== lastInstance && loaded === false) {
			setLastInstance(selectedInstance);
			loadData().catch(console.error);
			return;
		}
		if (filter !== null && filter !== '' && selectedInstance !== '' && loaded === false) {
			loadData().catch(console.error);
		} else if (filter === null && selectedInstance !== '' && loaded === false) {
			loadData().catch(console.error);
		}
	}, [selectedInstance, filter]);

	const loadData = async () => {
		clearTimeout(resetLoadedTimeout);
		console.log(`Loading devices for ${selectedInstance}...`);
		const devices = await socket.sendTo(selectedInstance, 'dm:listDevices');
		if (!devices || !Array.isArray(devices)) {
			throw new Error(
				`Message returned from sendTo() doesn't look like one from DeviceManagement, did you accidentally handle the message in your adapter? ${JSON.stringify(
					devices,
				)}`,
			);
		}
		console.log('listDevices', { result: devices });
		// filter devices name
		if (filter !== null) {
			const filteredDevices = devices.filter((device) =>
				device.name.toLowerCase().includes(filter.toLowerCase()),
			);
			setDevices(filteredDevices);
		} else {
			setDevices(devices);
		}

		setLoaded(true);
		resetLoadedTimeout = setTimeout(() => {
			setLoaded(false);
		}, 500);
	};

	const getTranslation = (text) => {
		if (typeof text === 'string') {
			return text;
		} else if (typeof text === 'object') {
			return text[socket.systemLang] || '';
		} else {
			return '';
		}
	};

	const sendActionToInstance = (command, message, refresh) => {
		const send = async () => {
			setShowSpinner(true);
			const result = await socket.sendTo(selectedInstance, command, message);
			const response = result;
			const type = response.type;
			switch (type) {
				case 'message':
					setMessage({
						message: response.message,
						handleClose: () => {
							setOpenDialog(undefined);
							sendActionToInstance('dm:actionProgress', { origin: response.origin });
						},
					});
					setOpenDialog('message');
					break;
				case 'confirm':
					setConfirm({
						message: response.confirm,
						handleClose: (confirm) => {
							setOpenDialog(undefined);
							sendActionToInstance('dm:actionProgress', { origin: response.origin, confirm });
						},
					});
					setOpenDialog('confirm');
					break;
				case 'form':
					setForm({
						...response.form,
						handleClose: (data) => {
							console.log(JSON.stringify({ data }));
							sendActionToInstance('dm:actionProgress', {
								origin: response.origin,
								data: data,
							});
							setForm(undefined);
							setOpenDialog(undefined);
						},
					});
					setOpenDialog('form');
					break;
				case 'progress':
					if (openDialog === 'progress') {
						setProgress((old) => ({ ...old, ...response.progress }));
					} else {
						setProgress(response.progress);
					}
					setOpenDialog(response.progress?.open ? 'progress' : undefined);
					sendActionToInstance('dm:actionProgress', { origin: response.origin });
					break;
				case 'result':
					if (response.result.refresh === true || response.result.refresh === 'instance') {
						setDevices([]);
						await loadData();
					} else if (response.result.refresh === 'device') {
						if (refresh) {
							refresh();
						}
					} else {
						console.log('Not refreshing anything');
					}
					setShowSpinner(false);
					break;
			}
		};
		send().catch(console.error);
	};

	const actionContext = {
		socket: socket,
		instanceHandler: (action) => {
			return () => sendActionToInstance('dm:instanceAction', { actionId: action.id });
		},
		deviceHandler: (deviceId, action, refresh) => {
			return () => sendActionToInstance('dm:deviceAction', { actionId: action.id, deviceId }, refresh);
		},
		getTranslation: getTranslation,
	};

	const handleChange = (_event, isExpanded) => {
		if (!isExpanded || loaded) {
			return;
		}

		setLoaded(true);
		loadData().catch(console.error);
	};

	const handleFormChange = (data) => {
		console.log('handleFormChange', { data });
		setForm((old) => (old ? { ...old, data } : undefined));
	};

	return Object.entries(devices).map(([key, device]) => (
		<DeviceCard2
			title={device.name}
			key={device.id}
			device={device}
			socket={socket}
			instanceId={selectedInstance}
			context={actionContext}
		/>
	));
}
