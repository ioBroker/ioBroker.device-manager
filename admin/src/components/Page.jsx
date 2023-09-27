import * as React from 'react';
import {
	Backdrop,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	Paper,
} from '@mui/material';
import TopBar from './TopBar';
import DeviceList from './DeviceList';
import { JsonConfig } from './JsonConfig';

/**
 * Page - Main page
 * @param {object} params - Parameters
 * @param {object} params.context - Tab App Context
 * @param {object} params.context.socket - Socket object
 * @returns {Element}
 * @constructor
 */
export default function Page(params) {
	const { context } = params;
	/**
	 * selectedInstance - Instance selected in the instance list, setSelctedInstance is called by the instance list
	 * @type {string}
	 * @default ''
	 * @description '' = no instance selected, string = instance name with instance number
	 * @example 'admin.0'
	 */
	const [selectedInstance, setSelectedInstance] = React.useState('');
	/**
	 * filter - Filter for device name, setFilter is called by the top bar
	 * @type {string}
	 * @default null
	 * @description null = no filter, string = filter for device name
	 */
	const [filter, setFilter] = React.useState(null);
	/**
	 * Show spinner
	 * @type {boolean}
	 * @default false
	 * @description true = show spinner, false = hide spinner
	 */
	const [showSpinner, setShowSpinner] = React.useState(false);
	/**
	 * Open dialog
	 * @type {string}
	 * @default undefined
	 * @description undefined = no dialog, 'message' = message dialog, 'confirm' = confirm dialog, 'form' = form dialog, 'progress' = progress dialog
	 * @example 'message'
	 */
	const [openDialog, setOpenDialog] = React.useState('');
	/**
	 * Message dialog
	 * @type {{message: string, handleClose: function}}
	 * @default undefined
	 * @description undefined = no message dialog, {message: string, handleClose: function} = message dialog
	 * @example {message: 'Message', handleClose: () => {setOpenDialog(undefined)}}
	 */
	const [message, setMessage] = React.useState();
	/**
	 * Confirm dialog
	 * @type {{message: string, handleClose: function}}
	 * @default undefined
	 * @description undefined = no confirm dialog, {message: string, handleClose: function} = confirm dialog
	 * @example {message: 'Confirm', handleClose: (confirm) => {setOpenDialog(undefined)}}
	 */
	const [confirm, setConfirm] = React.useState();
	/**
	 * Form dialog
	 * @type {{title: string, schema: object, data: object, handleClose: function}}
	 * @default undefined
	 * @description undefined = no form dialog, {title: string, schema: object, data: object, handleClose: function} = form dialog
	 * @example {title: 'Form', schema: {}, data: {}, handleClose: (data) => {setOpenDialog(undefined)}}
	 */
	const [form, setForm] = React.useState();
	/**
	 * Progress dialog
	 * @type {{title: string, message: string, progress: object}}
	 * @default undefined
	 * @description undefined = no progress dialog, {title: string, message: string, progress: object} = progress dialog
	 * @example {title: 'Progress', message: 'Progress', progress: {open: true, message: 'Progress', percent: 50}}
	 */
	const [progress, setProgress] = React.useState();
	/**
	 * Devices
	 * @type {object[]}
	 * @default []
	 * @description [] = no devices, object[] = devices
	 * @example [{id: 'device.0', name: 'Device', type: 'device', role: 'device', icon: 'device', hasDetails: true, hasActions: true, status: {connection: 'connected', rssi: '-60 dBm', battery: 100}}]
	 */
	const [devices, setDevices] = React.useState([]);
	/**
	 * Loaded
	 * @type {boolean}
	 * @default false
	 * @description true = loaded, false = not loaded
	 */
	const [loaded, setLoaded] = React.useState(false);
	/**
	 * Refresh devices
	 * @type {boolean}
	 * @default false
	 * @description true = refresh devices, false = don't refresh devices
	 */
	const [refreshDevices, setRefreshDevices] = React.useState(false);

	/**
	 * Get Translation
	 * @param {string | object} text - Text to translate
	 * @returns {string}
	 */
	context.getTranslation = (text) => {
		if (typeof text === 'string') {
			return text;
		} else if (typeof text === 'object') {
			return text[context.socket.systemLang] || '';
		} else {
			return '';
		}
	};

	context.sendActionToInstance = (command, message, refresh) => {
		const send = async () => {
			setShowSpinner(true);
			/** @type {object} */
			const response = await context.socket.sendTo(selectedInstance, command, message);
			/** @type {string} */
			const type = response.type;
			console.log('Response: ' + response.type);
			switch (type) {
				case 'message':
					console.log('Message empfangen: ' + response.message);
					setMessage({
						message: response.message,
						handleClose: () => {
							setOpenDialog(undefined);
							context.sendActionToInstance('dm:actionProgress', { origin: response.origin });
						},
					});
					setOpenDialog('message');
					break;
				case 'confirm':
					console.log('Confirm empfangen: ' + response.confirm);
					setConfirm({
						message: response.confirm,
						handleClose: (confirm) => {
							setOpenDialog(undefined);
							context.sendActionToInstance('dm:actionProgress', {
								origin: response.origin,
								confirm,
							});
						},
					});
					setOpenDialog('confirm');
					break;
				case 'form':
					console.log('Form empfangen');
					setForm({
						...response.form,
						handleClose: (data) => {
							console.log('Form ' + JSON.stringify({ data }));
							context.sendActionToInstance('dm:actionProgress', {
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
					context.sendActionToInstance('dm:actionProgress', { origin: response.origin });
					break;
				case 'result':
					if (response.result.refresh === true) {
						setDevices([]);
						//await loadData();
						setRefreshDevices(true);
						console.log('Refreshing all');
					} else if (response.result.refresh === 'instance') {
						console.log('Refreshing instance infos: ' + selectedInstance);
					} else if (response.result.refresh === 'device') {
						if (refresh) {
							setDevices([]);
							setRefreshDevices(true);
							console.log('Refreshing device infos: ' + selectedInstance);
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

	/**
	 * Handle form change
	 * @param {object} data
	 * @returns {Promise<void>}
	 */
	const handleFormChange = (data) => {
		console.log('handleFormChange', { data });
		setForm((old) => (old ? { ...old, data } : undefined));
	};

	context.action = {
		instanceHandler: (action) => {
			return async () => await context.sendActionToInstance('dm:instanceAction', { actionId: action.id });
		},
	};

	/** @type {object} */
	const cancelButtonText = {
		en: 'Cancel',
		de: 'Abbrechen',
		ru: 'Отмена',
		pt: 'Cancelar',
		nl: 'Annuleren',
		fr: 'Annuler',
		it: 'Annulla',
		es: 'Cancelar',
		pl: 'Anuluj',
		'zh-cn': '取消',
		uk: 'Скасувати',
	};
	/** @type {object} */
	const okButtonText = {
		en: 'OK',
		de: 'OK',
		ru: 'OK',
		pt: 'OK',
		nl: 'OK',
		fr: 'OK',
		it: 'OK',
		es: 'OK',
		pl: 'OK',
		'zh-cn': 'OK',
		uk: 'OK',
	};
	/** @type {object} */
	const yesButtonText = {
		en: 'Yes',
		de: 'Ja',
		ru: 'Да',
		pt: 'Sim',
		nl: 'Ja',
		fr: 'Oui',
		it: 'Sì',
		es: 'Sí',
		pl: 'Tak',
		'zh-cn': '是',
		uk: 'Так',
	};
	/** @type {object} */
	const noButtonText = {
		en: 'No',
		de: 'Nein',
		ru: 'Нет',
		pt: 'Não',
		nl: 'Nee',
		fr: 'Non',
		it: 'No',
		es: 'No',
		pl: 'Nie',
		'zh-cn': '没有',
		uk: 'Ні',
	};

	/** @type {object} */
	const gridStyle = {
		justifyContent: 'center',
		alignItems: 'stretch',
	};
	/** @type {object} */
	const backdropStyle = {
		zIndex: 1000,
	};

	// TODO: Show toast while action cannot be executed because of broken session

	return (
		<div className="App-header">
			<div className="App-header">
				<Paper elevation={1}>
					<TopBar
						selectedInstance={selectedInstance}
						setSelectedInstance={setSelectedInstance}
						filter={filter}
						setFilter={setFilter}
						context={context}
					/>
					<Grid container style={gridStyle}>
						<DeviceList
							selectedInstance={selectedInstance}
							filter={filter}
							context={context}
							devices={devices}
							setDevices={setDevices}
							loaded={loaded}
							setLoaded={setLoaded}
							refresh={refreshDevices}
							setRefresh={setRefreshDevices}
						/>
					</Grid>
				</Paper>
				<Backdrop style={backdropStyle} open={showSpinner}>
					{!openDialog && <CircularProgress></CircularProgress>}
				</Backdrop>
				<Dialog
					open={openDialog === 'message'}
					onClose={() => message?.handleClose()}
					hideBackdrop={true}
					aria-describedby="message-dialog-description"
				>
					<DialogContent>
						<DialogContentText id="message-dialog-description">{message?.message}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => message?.handleClose()} autoFocus hideBackdrop={true}>
							OK
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={openDialog === 'confirm'}
					onClose={() => confirm?.handleClose()}
					hideBackdrop={true}
					aria-describedby="confirm-dialog-description"
				>
					<DialogContent>
						<DialogContentText id="confirm-dialog-description">
							{context.getTranslation(confirm?.message)}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => confirm?.handleClose(false)} autoFocus hideBackdrop={true}>
							{context.getTranslation(noButtonText)}
						</Button>
						<Button onClick={() => confirm?.handleClose(true)} autoFocus hideBackdrop={true}>
							{context.getTranslation(yesButtonText)}
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog open={openDialog === 'form'} onClose={() => form?.handleClose()} hideBackdrop={true}>
					<DialogTitle>{context.getTranslation(form?.title)}</DialogTitle>
					<DialogContent>
						{form && (
							<JsonConfig
								instanceId={selectedInstance}
								schema={form.schema}
								data={form.data}
								socket={context.socket}
								onChange={handleFormChange}
							/>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={() => form?.handleClose()} hideBackdrop={true}>
							{context.getTranslation(cancelButtonText)}
						</Button>
						<Button onClick={() => form?.handleClose(form?.data)} autoFocus hideBackdrop={true}>
							{context.getTranslation(okButtonText)}
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</div>
	);
}
