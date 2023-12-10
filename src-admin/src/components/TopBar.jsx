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

/**
 * TopBar component
 * @param {object} params - Parameters
 * @param {object} params.context - Context object
 * @param {string} params.selectedInstance - Selected instance
 * @param {function} params.setSelectedInstance - Set selected instance
 * @param {function} params.setFilter - Set filter
 * @returns {Element}
 * @constructor
 */
export default function TopBar(params) {
    const {
        context,
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
            if (!localFilter) {
                setFilter(null);
            } else {
                setFilter(localFilter);
            }
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
        paddingBottom: '10px',
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
        left: '10px',
        top: '5px',
    };
    /** @type {object} */
    const textFieldStyle = {
        position: 'relative',
        top: '5px',
    };

    return <Paper style={paperStyle}>
        <Grid item container alignItems="center" style={gridStyle}>
            <div style={divStyle}>
                {actions && adapterInstance.actions.map(a =>
                    <InstanceActionButton key={a.id} action={a} context={context} />)}
            </div>
            <InstanceList
                setSelectedInstance={setSelectedInstance}
                selectedInstance={selectedInstance}
                setAdapterInstance={setAdapterInstance}
                context={context}
            />
            <TextField
                style={textFieldStyle}
                variant="standard"
                label={context.getTranslation('filterLabelText')}
                onChange={e => handleFilterChange(e.target.value)}
                value={localFilter}
                InputProps={{
                    endAdornment: filter ? <InputAdornment position="end">
                        <IconButton
                            onClick={() => handleFilterChange('')}
                            edge="end"
                        >
                            <Clear />
                        </IconButton>
                    </InputAdornment> : null,
                }}
            />
        </Grid>
    </Paper>;
}
