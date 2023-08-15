import React from 'react';
import { Paper, Button, Typography, Modal, Box, Dialog, DialogActions, DialogContent } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DeviceDetails, JsonFormData } from '@jey-cee/dm-utils';
import { DeviceInfo } from '@jey-cee/dm-utils/build/types/api';
import { DeviceActionButton } from './DeviceActionButton';
import { ActionContext } from './DeviceList';
import { DeviceStatus } from './DeviceStatus';
import { JsonConfig } from './JsonConfig';

export default function DeviceCard2(params) {
	const { title, key, device, socket, instanceId, context } = params;
	const [shadow, setShadow] = React.useState('0px 4px 8px rgba(0, 0, 0, 0.1)');
	const [open, setOpen] = React.useState(false);
	const [details, setDetails] = React.useState();
	const [data, setData] = React.useState({});
	const [overlay, setOverlay] = React.useState('none');

	const hasDetails = device.hasDetails;
	const hasActions = device.actions?.length > 0;
	const status = !device.status ? [] : Array.isArray(device.status) ? device.status : [device.status];

	const getTranslation = (text) => {
		if (typeof text === 'string') {
			return text;
		} else if (typeof text === 'object') {
			return text[socket.systemLang] || '';
		} else {
			return '';
		}
	};

	const loadDetails = async () => {
		console.log(`Loading device details for ${device.id}... from ${instanceId}`);
		const result = await context.socket.sendTo(instanceId, 'dm:deviceDetails', device.id);
		console.log(`Got device details for ${device.id}:`, result);
		setDetails(result);
	};
	const refresh = () => {
		setDetails(undefined);
		loadDetails().catch(console.error);
	};

	const openModal = () => {
		console.log('Open Modal');
		if (open === false) {
			loadDetails().catch(console.error);
			setOpen(true);
		}
	};

	const handleClose = () => setOpen(false);

	React.useEffect(() => setData(details?.data || {}), [details]);

	// Styles for the device card
	const cardStyle = {
		backgroundColor: '#fafafa',
		width: '300px',
		minHeight: '230px',
		margin: '10px',
		boxShadow: shadow,
		overflow: 'hidden',
	};

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

	const bodyStyle = {
		height: 'Calc(100% - 60px)',
	};

	const deviceInfoStyle = {
		padding: '20px 10px 10px 10px',
	};

	const statusStyle = {
		padding: '15px 15px 0 15px',
	};

	return (
		<div>
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
					{device.hasDetails ? (
						<Button variant="contained" style={detailsButtonStyle} onClick={openModal}>
							<MoreVertIcon />
						</Button>
					) : null}
				</div>
				<div style={statusStyle}>
					{status.map((s, i) => (
						<DeviceStatus key={i} status={s}></DeviceStatus>
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
									<b>Manufacturer:</b> {device.manufacturer}
								</span>
							) : null}
						</div>
						<div>
							{device.model ? (
								<span>
									<b>Model:</b> {device.model}
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
									refresh={refresh}
									context={context}
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
