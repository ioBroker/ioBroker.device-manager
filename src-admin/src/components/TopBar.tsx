import React, { Component } from 'react';

import {
    Grid,
    TextField,
    Paper,
    InputAdornment,
    IconButton, Tooltip,
} from '@mui/material';

import {
    Clear,
    Refresh,
} from '@mui/icons-material';

import { Connection } from '@iobroker/adapter-react-v5';
import { ActionBase } from '@iobroker/dm-utils/build/types/base';
import { InstanceDetails } from '@iobroker/dm-utils/build/types/api';

import InstanceList from './InstanceList';
import InstanceActionButton from './InstanceManager/InstanceActionButton';
import { getTranslation } from './InstanceManager/Utils';

interface TopBarProps {
    socket: Connection;
    instanceHandler: (action: ActionBase<'api'>) => () => void;
    selectedInstance: string;
    setSelectedInstance: (instance: string) => void;
    setFilter: (filter: string) => void;
    commandHandler: null |((command: string) => void);
}

interface TopBarState {
    adapterInstance: InstanceDetails | null;
    localFilter: string;
    alive: false;
}

/**
 * TopBar component
 * @param {object} params - Parameters
 * @param {object} params.socket - Socket Object
 * @param {object} params.instanceHandler - handler for instance actions
 * @param {string} params.selectedInstance - Selected instance
 * @param {function} params.setSelectedInstance - Set selected instance
 * @param {function} params.setFilter - Set filter
 * @constructor
 */
class TopBar extends Component<TopBarProps, TopBarState> {
    private timeoutId: ReturnType<typeof setTimeout> | null = null;

    constructor(props: TopBarProps) {
        super(props);
        this.state = {
            adapterInstance: null,
            localFilter: '',
            alive: false,
        };
    }

    /**
     * Handle filter change
     * @param filter - Filter value
     */
    handleFilterChange(filter: string): void {
        this.setState({ localFilter: filter });
        this.timeoutId && clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.timeoutId = null;
            this.props.setFilter(this.state.localFilter);
        }, 250);
    }

    render() {
        /** @type {object} */
        const paperStyle: React.CSSProperties = {
            position: 'sticky',
            zIndex: 10,
            top: 0,
            paddingBottom: 10,
        };
        /** @type {object} */
        const gridStyle: React.CSSProperties = {
            // position: 'sticky',
            // zIndex: 10,
            // top: 0,
            // marginBottom: '10px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 33%)',
        };
        /** @type {object} */
        const divStyle: React.CSSProperties = {
            position: 'relative',
            left: 10,
            top: 5,
        };
        /** @type {object} */
        const textFieldStyle: React.CSSProperties = {
            position: 'relative',
            top: 5,
            width: 200,
        };

        return <Paper style={paperStyle}>
            <Grid item container alignItems="center" style={gridStyle}>
                <div style={divStyle}>
                    {this.props.selectedInstance ? <Tooltip title={getTranslation('refreshTooltip')}>
                        <span>
                            <IconButton
                                onClick={() => this.state.alive && this.props.commandHandler && this.props.commandHandler('refresh')}
                                disabled={!this.state.alive}
                                size="small"
                            >
                                <Refresh />
                            </IconButton>
                        </span>
                    </Tooltip> : null}
                    {this.state.adapterInstance?.actions?.map(a => <InstanceActionButton
                        key={a.id}
                        action={a}
                        instanceHandler={this.props.instanceHandler}
                    />)}
                </div>
                <InstanceList
                    setSelectedInstance={this.props.setSelectedInstance}
                    selectedInstance={this.props.selectedInstance}
                    setAdapterInstance={adapterInstance => this.setState({ adapterInstance })}
                    socket={this.props.socket}
                    reportAliveState={alive => this.setState({ alive })}
                />
                <div style={{ textAlign: 'right' }}>
                    <TextField
                        style={textFieldStyle}
                        variant="standard"
                        label={getTranslation('filterLabelText')}
                        onChange={e => this.handleFilterChange(e.target.value)}
                        value={this.state.localFilter}
                        InputProps={{
                            endAdornment: this.state.localFilter ? <InputAdornment position="end">
                                <IconButton
                                    onClick={() => this.handleFilterChange('')}
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
}

export default TopBar;
