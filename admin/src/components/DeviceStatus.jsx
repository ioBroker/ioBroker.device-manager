import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import Battery20Icon from '@mui/icons-material/Battery20';
import Battery30Icon from '@mui/icons-material/Battery30';
import Battery50Icon from '@mui/icons-material/Battery50';
import Battery60Icon from '@mui/icons-material/Battery60';
import Battery80Icon from '@mui/icons-material/Battery80';
import Battery90Icon from '@mui/icons-material/Battery90';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { FaOrImageIcon } from './FaOrImgIcon';

/**
 * Device Status component
 * @param {object} params - Parameters
 * @param {object} params.status - Status object, e.g. { connection: 'connected', battery: 100, rssi: -50 }
 * @param {object} params.context - Context object
 * @returns {React.JSX.Element|null}
 * @constructor
 */
export function DeviceStatus(params) {
	const { status, context } = params;
	if (!status) {
		return null;
	}

	/** @type {object} */
	const linkIconStyle = {
		fill: '#00ac00',
	};
	/** @type {object} */
	const linkOffIconStyle = {
		fill: '#ff0000',
	};
	/** @type {object} */
	const divStatusStyle = {
		marginLeft: '5px',
		marginRight: '5px',
	};

	/** @type {object} */
	let batteryIconTooltip;
	if (typeof status.battery === 'number') {
		if (status.battery >= 96 && status.battery <= 100) {
			batteryIconTooltip = <BatteryFullIcon />;
		} else if (status.battery >= 90 && status.battery <= 95) {
			batteryIconTooltip = <Battery90Icon />;
		} else if (status.battery >= 80 && status.battery <= 89) {
			batteryIconTooltip = <Battery80Icon />;
		} else if (status.battery >= 60 && status.battery <= 79) {
			batteryIconTooltip = <Battery60Icon />;
		} else if (status.battery >= 50 && status.battery <= 59) {
			batteryIconTooltip = <Battery50Icon />;
		} else if (status.battery >= 30 && status.battery <= 49) {
			batteryIconTooltip = <Battery30Icon />;
		} else if (status.battery >= 20 && status.battery <= 29) {
			batteryIconTooltip = <Battery20Icon />;
		} else {
			batteryIconTooltip = <BatteryAlertIcon />;
		}
	}

	return (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			{status.connection === 'connected' && (
				<div style={{ ...divStatusStyle, display: 'flex', alignItems: 'center' }}>
					<Tooltip title={context.getTranslation('connectedIconTooltip')}>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<LinkIcon style={linkIconStyle} />
						</div>
					</Tooltip>
				</div>
			)}

			{status.connection === 'disconnected' && (
				<div style={{ ...divStatusStyle, display: 'flex', alignItems: 'center' }}>
					<Tooltip title={context.getTranslation('disconnectedIconTooltip')}>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<LinkOffIcon style={linkOffIconStyle} />
						</div>
					</Tooltip>
				</div>
			)}

			{status.rssi && (
				<div style={{ ...divStatusStyle, display: 'flex', alignItems: 'center' }}>
					<Tooltip title="RSSI">
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<NetworkCheckIcon />
							<p style={{ fontSize: 'small', margin: 0 }}>{status.rssi}</p>
						</div>
					</Tooltip>
				</div>
			)}

			{typeof status.battery === 'number' && (
				<div style={{ ...divStatusStyle, display: 'flex', alignItems: 'center' }}>
					<Tooltip title={context.getTranslation('batteryTooltip')}>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							{batteryIconTooltip}
							<p style={{ fontSize: 'small', margin: 0 }}>{status.battery}%</p>
						</div>
					</Tooltip>
				</div>
			)}

			{typeof status.battery === 'string' && (
				<div style={{ ...divStatusStyle, display: 'flex', alignItems: 'center' }}>
					<Tooltip title={context.getTranslation('batteryTooltip')}>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<BatteryFullIcon />
							{status.battery.includes('V') || status.battery.includes('mV') ? (
								<p style={{ fontSize: 'small', margin: 0 }}>{status.battery} V</p>
							) : (
								<p style={{ fontSize: 'small', margin: 0 }}>{status.battery} mV</p>
							)}
						</div>
					</Tooltip>
				</div>
			)}

			{typeof status.battery === 'boolean' && (
				<div style={{ ...divStatusStyle, display: 'flex', alignItems: 'center' }}>
					<Tooltip title={context.getTranslation('batteryTooltip')}>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<BatteryAlertIcon />
							<p style={{ fontSize: 'small', margin: 0 }}></p>
						</div>
					</Tooltip>
				</div>
			)}
		</div>
	);
}
