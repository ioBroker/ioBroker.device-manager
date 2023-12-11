import * as React from 'react';

import {
    Grid,
    TextField,
    Paper,
    InputAdornment,
    IconButton,
} from '@mui/material';

import { Clear } from '@mui/icons-material';

import InstanceList from './InstanceList';
import InstanceActionButton from './InstanceActionButton';
import { getTranslation } from './InstanceManager/Utils';

/**
 * TopBar component
 * @param {object} params - Parameters
 * @param {object} params.socket - Socket Object
 * @param {object} params.instanceHandler - handler for instance actions
 * @param {string} params.selectedInstance - Selected instance
 * @param {function} params.setSelectedInstance - Set selected instance
 * @param {function} params.setFilter - Set filter
 * @returns {Element}
 * @constructor
 */
export default function TopBar(params) {
    const {
        socket,
        instanceHandler,
        selectedInstance,
        setSelectedInstance,
        setFilter,
        filter,
    } = params;
    const [adapterInstance, setAdapterInstance] = React.useState(null);
    const [actions, setActions] = React.useState(null);
    const [localFilter, setLocalFilter] = React.useState(filter || '');

    let timeoutId = null;

    /**
     * Handle filter change
     * @param {string} value - Filter value
     * @returns {void}
     */
    const handleFilterChange = value => {
        setLocalFilter(value);
        timeoutId && clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            timeoutId = null;
            setFilter(localFilter);
        }, 250);
    };

    /**
     * Load instance actions
     * @returns {void}
     */
    React.useEffect(() => {
        setActions(adapterInstance?.actions);
    }, [adapterInstance]);

    /** @type {object} */
    const paperStyle = {
        position: 'sticky',
        zIndex: 10,
        top: 0,
        paddingBottom: 10,
    };
    /** @type {object} */
    const gridStyle = {
        // position: 'sticky',
        // zIndex: 10,
        // top: 0,
        // marginBottom: '10px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 33%)',
    };
    /** @type {object} */
    const divStyle = {
        position: 'relative',
        left: 10,
        top: 5,
    };
    /** @type {object} */
    const textFieldStyle = {
        position: 'relative',
        top: 5,
        width: 200
    };

    return <Paper style={paperStyle}>
        <Grid item container alignItems="center" style={gridStyle}>
            <div style={divStyle}>
                {actions?.map(a =>
                    <InstanceActionButton
                        key={a.id}
                        action={a}
                        instanceHandler={instanceHandler}
                    />)}
            </div>
            <InstanceList
                setSelectedInstance={setSelectedInstance}
                selectedInstance={selectedInstance}
                setAdapterInstance={setAdapterInstance}
                socket={socket}
            />
            <div style={{ textAlign: 'right' }}>
                <TextField
                    style={textFieldStyle}
                    variant="standard"
                    label={getTranslation('filterLabelText')}
                    onChange={e => handleFilterChange(e.target.value)}
                    value={localFilter}
                    InputProps={{
                        endAdornment: localFilter ? <InputAdornment position="end">
                            <IconButton
                                onClick={() => handleFilterChange('')}
                                edge="end"
                            >
                                <Clear />
                            </IconButton>
                        </InputAdornment> : null,
                    }}
                />
            </div>
        </Grid>
    </Paper>;
}
