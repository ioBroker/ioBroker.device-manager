import {
    useState, useEffect, useCallback,
} from 'react';

import {
    ButtonGroup,
    IconButton,
    TableCell,
    TableRow,
} from '@mui/material';

import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';

// import { DeviceDetails, JsonFormData } from '@jey-cee/dm-utils';
// import { DeviceInfo } from '@jey-cee/dm-utils/build/types/api';
import DeviceActionButton from './DeviceActionButton';
// import { ActionContext } from './DeviceList';
import DeviceStatus from './DeviceStatus';
import JsonConfig from './JsonConfig';

export default function DeviceRow(props) {
    const {
        instance, device, hasDetails, hasActions, context,
    } = props;

    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState();
    const [data, setData] = useState({});

    const loadDetails = useCallback(async () => {
        console.log(`Loading device details for ${device.id}...`);
        const result = await context.socket.sendTo(instance, 'dm:deviceDetails', device.id);
        console.log(`Got device details for ${device.id}:`, result);
        setDetails(result);
    }, [context.socket, device.id, instance]);

    const refresh = useCallback(() => {
        setDetails(undefined);
        loadDetails().catch(console.error);
    }, [loadDetails]);

    useEffect(() => setData(details?.data || {}), [details]);

    useEffect(() => {
        if (!open) {
            setDetails(undefined);
            return;
        }
        loadDetails().catch(console.error);
    }, [open, loadDetails]);

    const status = !device.status ? [] : Array.isArray(device.status) ? device.status : [device.status];

    return <>
        <TableRow>
            {hasDetails && <TableCell>
                {device.hasDetails && <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>}
            </TableCell>}
            <TableCell>{device.id}</TableCell>
            <TableCell>{device.name}</TableCell>
            <TableCell>
                {status.map((s, i) => <DeviceStatus key={i} status={s}></DeviceStatus>)}
            </TableCell>
            {hasActions && <TableCell>
                {!!device.actions?.length && <ButtonGroup size="small" sx={{ height: 36 }}>
                    {device.actions.map(a => <DeviceActionButton
                        key={a.id}
                        deviceId={device.id}
                        action={a}
                        refresh={refresh}
                        context={context}
                    />)}
                </ButtonGroup>}
            </TableCell>}
        </TableRow>
        {open && <TableRow>
            <TableCell colSpan={hasActions ? 5 : 4} sx={{ backgroundColor: '#EEEEEE' }}>
                {details && <JsonConfig
                    instanceId={instance}
                    socket={context.socket}
                    schema={details.schema}
                    data={data}
                    onChange={setData}
                />}
            </TableCell>
        </TableRow>}
    </>;
}
