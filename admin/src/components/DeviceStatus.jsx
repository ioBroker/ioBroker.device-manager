import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { FaOrImageIcon } from './FaOrImgIcon';

export function DeviceStatus(props) {
	const { status } = props;
	if (!status) {
		return null;
	}

	const linkIconStyle = {
		fill: '#00ac00',
	};

	const linkOffIconStyle = {
		fill: '#ff0000',
	};

	if (typeof status === 'string') {
		switch (status) {
			case 'connected':
				return (
					<Tooltip title="Connected">
						<LinkIcon style={linkIconStyle} />
					</Tooltip>
				);
			case 'disconnected':
				return (
					<Tooltip title="Disconnected">
						<LinkOffIcon style={linkOffIconStyle} />
					</Tooltip>
				);
			default:
				return null;
		}
	}
	return (
		<Tooltip title={status.description || false}>
			<FaOrImageIcon icon={status.icon} />
		</Tooltip>
	);
}
