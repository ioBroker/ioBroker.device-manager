import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
// import { DeviceDetails, JsonFormData } from '@jey-cee/dm-utils';
// import { DeviceInfo } from '@jey-cee/dm-utils/build/types/api';
import * as React from 'react';
import { DeviceActionButton } from './DeviceActionButton';
// import { ActionContext } from './DeviceList';
import { DeviceStatus } from './DeviceStatus';
import { JsonConfig } from './JsonConfig';

export function DeviceRow(props) {
	const { instance, device, hasDetails, hasActions, context } = props;

	const [open, setOpen] = React.useState(false);
	const [details, setDetails] = React.useState();
	const [data, setData] = React.useState({});

	const loadDetails = async () => {
		console.log(`Loading device details for ${device.id}...`);
		const result = await context.socket.sendTo(instance, 'dm:deviceDetails', device.id);
		console.log(`Got device details for ${device.id}:`, result);
		setDetails(result);
	};
	/*const refresh = () => {
		setDetails(undefined);
		loadDetails().catch(console.error);
	};*/

	React.useEffect(() => setData(details?.data || {}), [details]);

	React.useEffect(() => {
		if (!open) {
			setDetails(undefined);
			return;
		}
		loadDetails().catch(console.error);
	}, [open]);

	const status = !device.status ? [] : Array.isArray(device.status) ? device.status : [device.status];

	return (
		<>
			<TableRow>
				{hasDetails && (
					<TableCell>
						{device.hasDetails && (
							<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
								{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
							</IconButton>
						)}
					</TableCell>
				)}
				<TableCell>{device.id}</TableCell>
				<TableCell>{device.name}</TableCell>
				<TableCell>
					{status.map((s, i) => (
						<DeviceStatus key={i} status={s}></DeviceStatus>
					))}
				</TableCell>
				{hasActions && (
					<TableCell>
						{!!device.actions?.length && (
							<ButtonGroup size="small" sx={{ height: 36 }}>
								{device.actions.map((a) => (
									<DeviceActionButton
										key={a.id}
										deviceId={device.id}
										action={a}
										refresh={refresh}
										context={context}
									/>
								))}
							</ButtonGroup>
						)}
					</TableCell>
				)}
			</TableRow>
			{open && (
				<TableRow>
					<TableCell colSpan={hasActions ? 5 : 4} sx={{ backgroundColor: '#EEEEEE' }}>
						{details && (
							<JsonConfig
								instanceId={instance}
								socket={context.socket}
								schema={details.schema}
								data={data}
								onChange={setData}
							/>
						)}
					</TableCell>
				</TableRow>
			)}
		</>
	);
}
