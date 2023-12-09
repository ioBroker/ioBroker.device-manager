import {
    Add, Delete, Edit,
    Refresh, Search,
} from '@mui/icons-material';

import {
    Icon,
} from '@iobroker/adapter-react-v5';

// eslint-disable-next-line import/prefer-default-export
export function renderIcon(action) {
    if (action.icon?.startsWith('fa-')) {
        const iconStyle = action.icon.split(' ').map(s => s.trim()).filter(s => s !== 'fa-solid');

        if (iconStyle.includes('fa-trash-can')) {
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
        if (iconStyle.includes('fa-search')) {
            return <Search />;
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

    return null;
}
