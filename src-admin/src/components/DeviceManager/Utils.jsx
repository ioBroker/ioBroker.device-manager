import {
    Add, Delete, Edit,
    Refresh, Search,
    Wifi, WifiOff, Bluetooth,
    BluetoothDisabled,
    Visibility,
    LinkOff, Link as LinkIcon,
    NotListedLocation,
} from '@mui/icons-material';

import {
    Icon,
} from '@iobroker/adapter-react-v5';

// eslint-disable-next-line import/prefer-default-export
export function renderIcon(action) {
    if (action.icon?.startsWith('fa-') || action.icon?.startsWith('fas')) {
        const iconStyle = action.icon.split(' ').map(s => s.trim()).filter(s => s !== 'fa-solid');

        if (iconStyle.includes('fa-trash-can') || iconStyle.includes('fa-trash')) {
            return <Delete />;
        }
        if (iconStyle.includes('fa-pen')) {
            return <Edit />;
        }
        if (iconStyle.includes('fa-redo-alt')) {
            return <Refresh />;
        }
        if (iconStyle.includes('fa-plus')) {
            return <Add />;
        }
        if (iconStyle.includes('fa-wifi')) {
            return <Wifi />;
        }
        if (iconStyle.includes('fa-wifi-slash')) {
            return <WifiOff />;
        }
        if (iconStyle.includes('fa-bluetooth')) {
            return <Bluetooth />;
        }
        if (iconStyle.includes('fa-bluetooth-slash')) {
            return <BluetoothDisabled />;
        }
        if (iconStyle.includes('fa-eye')) {
            return <Visibility />;
        }
        if (iconStyle.includes('fa-search')) {
            return <Search />;
        }
        if (iconStyle.includes('fa-unlink')) {
            return <LinkOff />;
        }
        if (iconStyle.includes('fa-link')) {
            return <LinkIcon />;
        }
        if (iconStyle.includes('fa-search-location')) {
            return <NotListedLocation />;
        }
        return null;
    }
    if (action.icon?.startsWith('data:image')) {
        return <Icon src={action.icon} />;
    }
    if (action.id === 'edit' || action.id === 'rename') {
        return <Edit />;
    }
    if (action.id === 'delete') {
        return <Delete />;
    }
    if (action.id === 'refresh') {
        return <Refresh />;
    }
    if (action.id === 'newDevice' || action.id === 'new' || action.id === 'add') {
        return <Add />;
    }
    if (action.id === 'discover' || action.id === 'search') {
        return <Search />;
    }
    if (action.id === 'unpairDevice') {
        return <LinkOff />;
    }
    if (action.id === 'pairDevice') {
        return <LinkIcon />;
    }
    if (action.id === 'identify') {
        return <NotListedLocation />;
    }

    return null;
}
