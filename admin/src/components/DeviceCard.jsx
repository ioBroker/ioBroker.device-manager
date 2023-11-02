import React from 'react';
import { Paper, Button, Typography, Dialog, DialogActions, DialogContent } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DeviceActionButton } from './DeviceActionButton';
import { DeviceStatus } from './DeviceStatus';
import { JsonConfig } from './JsonConfig';

/**
 * Device Card Component
 * @param {object} params - Component parameters
 * @param {string} params.title - Title
 * @param {string} params.key - Key
 * @param {object} params.device - Device
 * @param {string} params.instanceId - Instance ID
 * @param {object} params.context - Tab App Context
 * @param {object} params.actionContext - Action Context
 * @return {Element}
 * @constructor
 */
export default function DeviceCard(params) {
	const { title, key, device, instanceId, context, actionContext } = params;
	const [shadow, setShadow] = React.useState('0px 4px 8px rgba(0, 0, 0, 0.1)');
	const [open, setOpen] = React.useState(false);
	const [details, setDetails] = React.useState();
	const [data, setData] = React.useState({});

	const hasDetails = device.hasDetails;
	const hasActions = device.actions?.length > 0;
	const status = !device.status ? [] : Array.isArray(device.status) ? device.status : [device.status];

	/**
	 * Load the device details
	 * @return {Promise<void>}
	 */
	const loadDetails = async () => {
		console.log(`Loading device details for ${device.id}... from ${instanceId}`);
		const result = await context.socket.sendTo(instanceId, 'dm:deviceDetails', device.id);
		console.log(`Got device details for ${device.id}:`, result);
		setDetails(result);
	};

	/**
	 * Refresh the device details
	 * @returns {void}
	 */
	const refresh = () => {
		setDetails(undefined);
		loadDetails().catch(console.error);
	};

	/**
	 * Open the modal
	 * @returns {void}
	 */
	const openModal = () => {
		if (open === false) {
			loadDetails().catch(console.error);
			setOpen(true);
		}
	};

	/**
	 * Close the modal
	 * @returns {void}
	 */
	const handleClose = () => setOpen(false);

	React.useEffect(() => setData(details?.data || {}), [details]);

	// Styles for the device card
	/** @type {CSSProperties} */
	const divStyle = {
		height: '100%',
	};
	/** @type {CSSProperties} */
	const cardStyle = {
		//backgroundColor: '#fafafa',
		width: '300px',
		minHeight: '280px',
		margin: '10px',
		boxShadow: shadow,
		overflow: 'hidden',
	};
	/** @type {CSSProperties} */
	const headerStyle = {
		display: 'flex',
		position: 'relative',
		justifyContent: 'space-between',
		minHeight: '60px',
		color: '#000',
		padding: '0 10px 0 10px',
		backgroundColor: '#77c7ff8c',
		borderRadius: '4px 4px 0 0',
	};
	/** @type {CSSProperties} */
	const imgStyle = {
		top: 0,
		left: 0,
		width: '45px',
		height: '45px',
		margin: 'auto 0',
		zIndex: 2,
		position: 'relative',
		backgroundSize: 'cover',
	};
	/** @type {CSSProperties} */
	const titleStyle = {
		color: '#333',
		width: '100%',
		fontSize: '16px',
		fontWeight: 'bold',
		paddingTop: '16px',
		paddingLeft: '8px',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	};
	/** @type {CSSProperties} */
	const detailsButtonStyle = {
		right: '20px',
		width: '40px',
		minWidth: '40px',
		bottom: '-20px',
		height: '40px',
		position: 'absolute',
		padding: 0,
		fill: 'currentcolor',
		border: 'none',
		borderRadius: '50%',
		color: '#fff',
		display: 'block',
		marginTop: '10px',
		transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		fontSize: '1.5rem',
		flexShrink: 0,
		boxShadow:
			'rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px',
	};
	/** @type {CSSProperties} */
	const bodyStyle = {
		height: 'Calc(100% - 116px)',
	};
	/** @type {CSSProperties} */
	const deviceInfoStyle = {
		padding: '20px 10px 10px 10px',
		height: '100px',
	};
	/** @type {CSSProperties} */
	const statusStyle = {
		padding: '15px 15px 0 15px',
		height: '41px',
	};

	// TODO: Add possibility to change/upload device icon
	// TODO: Button Copy-to-clipboard for device ID with namespace

	return (
		<div style={divStyle}>
			<Paper
				key={key}
				style={cardStyle}
				onMouseEnter={() => setShadow('0px 8px 12px rgba(0, 0, 0, 0.4)')}
				onMouseLeave={() => setShadow('0px 4px 8px rgba(0, 0, 0, 0.1)')}
			>
				<div style={headerStyle}>
					<img
						src={device.icon || '/adapter/device-manager/no_image.webp'}
						alt="placeholder image"
						style={imgStyle}
					/>
					<div style={titleStyle}>{title}</div>
					{hasDetails ? (
						<Button variant="contained" style={detailsButtonStyle} onClick={openModal}>
							<MoreVertIcon />
						</Button>
					) : null}
				</div>
				<div style={statusStyle}>
					{status.map((s, i) => (
						<DeviceStatus key={i} status={s} context={context}></DeviceStatus>
					))}
				</div>
				<div style={bodyStyle}>
					<Typography variant="body1" style={deviceInfoStyle}>
						<div>
							<span>
								<b>ID:</b> {device.id.replace(/.*\.\d\./, '')}
							</span>
						</div>
						<div>
							{device.manufacturer ? (
								<span>
									<b>{context.getTranslation('manufacturer')}:</b> {device.manufacturer}
								</span>
							) : null}
						</div>
						<div>
							{device.model ? (
								<span>
									<b>{context.getTranslation('model')}:</b> {device.model}
								</span>
							) : null}
						</div>
					</Typography>
					{hasActions && !!device.actions?.length && (
						<div
							style={{
								flex: '1',
								position: 'relative',
								display: 'grid',
								gridTemplateColumns: 'repeat(5, 60px)',
								gridTemplateRows: 'auto',
								paddingBottom: '5px',
								height: '60px',
							}}
						>
							{device.actions.map((a) => (
								<DeviceActionButton
									key={a.id}
									deviceId={device.id}
									action={a}
									actionContext={actionContext}
									context={context}
									refresh={refresh}
								/>
							))}
						</div>
					)}
				</div>
			</Paper>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
					{details && (
						<JsonConfig
							instanceId={instanceId}
							socket={context.socket}
							schema={details.schema}
							data={data}
							onChange={setData}
						/>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} autoFocus>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
