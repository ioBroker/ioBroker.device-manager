import React from 'react';

import {
    Grid,
    Paper,
} from '@mui/material';

import { getTranslation } from '@iobroker/dm-gui-components/Utils';
// import DeviceList from '@iobroker/dm-gui-components';
import DeviceList from './InstanceManager';

import Communication, { CommunicationProps, CommunicationState } from './InstanceManager/Communication';
import TopBar from './TopBar';

interface PageProps extends CommunicationProps {
    /* Instance to upload images to, like `adapterName.X` */
    uploadImagesToInstance?: string;
 }

 interface PageState extends CommunicationState {
     filter: string;
     selectedInstance: string;
     commandHandler: null | ((command: string) => void);
 }

/**
 * Page - Main page
 * @param {object} params - Parameters
 * @param {object} params.socket - Socket object
 * @param {object} params.uploadImagesToInstance - Instance to upload images to
 * @returns {Element}
 * @constructor
 */
export default class Page extends Communication<PageProps, PageState> {
    constructor(props) {
        super(props);
        Object.assign(this.state, {
            selectedInstance: window.localStorage.getItem('dm.selectedInstance') || '',
            filter: '',
            commandHandler: null,
        });
    }

    renderContent() {
        /** @type {object} */
        const gridStyle = {
            justifyContent: 'center',
            alignItems: 'stretch',
        };
        /** @type {object} */
        const emptyStyle = {
            padding: 25,
        };

        // TODO: Show toast while action cannot be executed because of broken session or reload page

        return <div className="App-header" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <Paper elevation={1} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <TopBar
                    selectedInstance={this.state.selectedInstance}
                    setSelectedInstance={selectedInstance => {
                        window.localStorage.setItem('dm.selectedInstance', selectedInstance);
                        this.setState({ selectedInstance });
                    }}
                    setFilter={filter => this.setState({ filter })}
                    socket={this.props.socket}
                    instanceHandler={this.instanceHandler}
                    commandHandler={this.state.commandHandler}
                />
                <div
                    style={{
                        width: '100%',
                        height: 'calc(100% - 66px)',
                        overflow: 'auto',
                        marginTop: 8,
                    }}
                >
                    <Grid container style={gridStyle}>
                        {!this.state.selectedInstance && <div style={emptyStyle}>
                            <span>{getTranslation('noInstanceSelectedText')}</span>
                        </div>}
                        <DeviceList
                            embedded
                            uploadImagesToInstance={this.props.uploadImagesToInstance}
                            selectedInstance={this.state.selectedInstance}
                            filter={this.state.filter}
                            socket={this.props.socket}
                            registerHandler={handler => this.setState({ commandHandler: handler })}
                        />
                    </Grid>
                </div>
            </Paper>
        </div>;
    }
}
