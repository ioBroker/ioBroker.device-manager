import * as React from 'react';
import DeviceCard from './DeviceCard';

/**
 * Device List Component
 * @param {object} params - Component parameters
 * @param {object} params.context - Tab App Context
 * @param {string} params.selectedInstance - Selected instance
 * @param {object} params.devices - Devices
 * @param {function} params.setDevices - Set devices
 * @param {boolean} params.loaded - Loaded
 * @param {function} params.setLoaded - Set loaded
 * @param {string} params.filter - Filter
 * @param {boolean} params.refresh - Refresh
 * @param {function} params.setRefresh - Set refresh
 * @returns {*[]} - Array of device cards
 */
export default function DeviceList(params) {
	const { context, selectedInstance, devices, setDevices, loaded, setLoaded, filter, refresh, setRefresh } = params;
	const [lastInstance, setLastInstance] = React.useState('');

	let resetLoadedTimeout = null;

	/**
	 * Listen for changes and Load devices
	 * @returns {Promise<void>}
	 */
	React.useEffect(() => {
		if (selectedInstance !== '' && selectedInstance !== lastInstance && loaded === false) {
			setLastInstance(selectedInstance);
			loadData().catch(console.error);
			return;
		}
		if (refresh === true) {
			loadData().catch(console.error);
			setRefresh(false);
			return;
		}
		if (filter !== null && filter !== '' && selectedInstance !== '' && loaded === false) {
			loadData().catch(console.error);
		} else if (filter === null && selectedInstance !== '' && loaded === false) {
			loadData().catch(console.error);
		}
	}, [selectedInstance, filter, refresh]);

	/**
	 * Load devices
	 * @returns {Promise<void>}
	 */
	const loadData = async () => {
		clearTimeout(resetLoadedTimeout);
		console.log(`Loading devices for ${selectedInstance}...`);
		const devices = await context.socket.sendTo(selectedInstance, 'dm:listDevices');
		if (!devices || !Array.isArray(devices)) {
			throw new Error(
				`Message returned from sendTo() doesn't look like one from DeviceManagement, did you accidentally handle the message in your adapter? ${JSON.stringify(
					devices,
				)}`,
			);
		}
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

	/**
	 * Action context
	 * @type {{deviceHandler: (function(string, object, object, *): function(): *), socket, getTranslation: *}}
	 */
	const actionContext = {
		socket: context.socket,
		deviceHandler: (deviceId, action, refresh) => {
			return () => context.sendActionToInstance('dm:deviceAction', { actionId: action.id, deviceId }, refresh);
		},
		getTranslation: context.getTranslation,
	};
	// TODO: Return message if no devices are found
	return Object.entries(devices).map(([key, device]) => (
		<DeviceCard
			title={device.name}
			key={device.id}
			device={device}
			instanceId={selectedInstance}
			actionContext={actionContext}
			context={context}
		/>
	));
}
