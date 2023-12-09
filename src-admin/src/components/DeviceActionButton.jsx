import { Button } from '@mui/material';

import {
    Delete,
    Edit,
} from '@mui/icons-material';

import {
    Icon,
} from '@iobroker/adapter-react-v5';

import TooltipButton from './TooltipButton';

export default function DeviceActionButton(props) {
    const {
        deviceId, action, refresh, context, actionContext,
    } = props;

    const tooltip = context.getTranslation(action.description);

    let icon;

    if (action.icon?.startsWith('fa-')) {
        const iconStyle = action.icon.split(' ').map(s => s.trim()).filter(s => s !== 'fa-solid');
        if (iconStyle.includes('fa-trash-can')) {
            icon = <Delete />;
        } else  if (iconStyle.includes('fa-pen')) {
            icon = <Edit />;
        } else {
            icon = <Button title={iconStyle.join(' ')}>{action.id}</Button>;
        }
    } else if (action.icon?.startsWith('data:image')) {
        icon = <Icon src={action.icon} />;
    } else if (action.id === 'edit') {
        icon = <Edit />;
    } else if (action.id === 'delete') {
        icon = <Delete />;
    }

    return <TooltipButton
        // style={{ fontSize: '1.2rem' }}
        tooltip={tooltip}
        disabled={action.disabled}
        Icon={icon}
        onClick={actionContext.deviceHandler(deviceId, action, context, refresh)}
    />;
}
