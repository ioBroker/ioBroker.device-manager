import React, { Component } from 'react';

import {
    InputLabel,
    MenuItem,
    FormControl,
    Select,
} from '@mui/material';

// import { Refresh } from '@mui/icons-material';

import { Connection } from '@iobroker/adapter-react-v5';
import { InstanceDetails } from '@iobroker/dm-utils/build/types/api';

// import TooltipButton from './InstanceManager/TooltipButton';
import { getTranslation } from './InstanceManager/Utils';

interface InstanceListProps {
    socket: Connection;
    setSelectedInstance: (instance: string) => void;
    selectedInstance: string;
    setAdapterInstance: any;
}

interface InstanceListState {
    instanceList: {
        [key: string]: {
            title: string;
            instance: number;
            disabled: boolean;
        };
    };
}

/**
 * InstanceList component
 * @param {object} params - Parameters
 * @param {object} params.socket - Socket object
 * @param {string} params.selectedInstance - Selected instance
 * @param {function} params.setSelectedInstance - Set selected instance
 * @param {function} params.setAdapterInstance - Set adapter instance
 * @returns {Element}
 * @constructor
 */
class InstanceList extends Component<InstanceListProps, InstanceListState> {
    private aliveSubscribes: string[] = [];
    private selectedInstance: string;

    constructor(props: InstanceListProps) {
        super(props);
        this.state = {
            instanceList: {},
        };
        this.aliveSubscribes = [];
        this.selectedInstance = this.props.selectedInstance;
    }

    async loadAdapters() {
        console.log('Waiting for connection');
        await this.props.socket.waitForFirstConnection();

        console.log('Loading adapters...');
        const res = await this.props.socket.getObjectViewSystem('instance', 'system.adapter.', 'system.adapter.\u9999');
        const instanceList = {};
        for (const id in res) {
            if (!res[id]?.common?.messagebox || !res[id].common.supportedMessages?.deviceManager) {
                continue;
            }

            const instanceName = id.substring('system.adapter.'.length);
            try {
                // Check if the instance is alive by getting the state alive
                const alive = await this.props.socket.getState(`system.adapter.${instanceName}.alive`);

                const instance = parseInt(instanceName.split('.').pop() || '') || 0;
                instanceList[instanceName] = {
                    title: '',
                    instance,
                    disabled: !alive?.val
                };
            } catch (error) {
                console.error(error);
            }
        }

        // unsubscribe from
        for (let i = 0; i < this.aliveSubscribes.length; i++) {
            if (!instanceList[this.aliveSubscribes[i]]) {
                this.props.socket.unsubscribeState(`system.adapter.${this.aliveSubscribes[i]}.alive`, this.onAliveChanged);
            }
        }

        // subscribe to new
        for (const id in instanceList) {
            if (!this.aliveSubscribes.includes(id)) {
                await this.props.socket.subscribeState(`system.adapter.${id}.alive`, this.onAliveChanged);
                this.aliveSubscribes.push(id);
            }
        }

        this.setState( { instanceList });
        console.log(`Load Adapters result: ${JSON.stringify(instanceList)}`);
    };

    onAliveChanged: ioBroker.StateChangeHandler = (id: string, state: ioBroker.State | null | undefined) => {
        if (id.endsWith('.alive')) {
            const instanceName = id.substring('system.adapter.'.length, id.length - '.alive'.length);
            const disabled = !state?.val;
            if (this.state.instanceList[instanceName] && this.state.instanceList[instanceName].disabled !== disabled) {
                const instanceList = JSON.parse(JSON.stringify(this.state.instanceList));
                instanceList[instanceName].disabled = !state?.val;
                this.setState({ instanceList });
            }
        }
    };

    onInstanceChanged = (id:string) => {
        if (id.split('.').length === 4) { // system.adapter.matter.0
            this.loadAdapters().catch(console.error);
        }
    };

    componentDidMount() {
        this.loadAdapters().catch(console.error);


        this.props.socket.subscribeObject('system.adapter.*', this.onInstanceChanged)
            .catch(console.error);
    }

    async componentWillUnmount() {
        await this.props.socket.unsubscribeObject('system.adapter.*', this.onInstanceChanged);
        for (let i = 0; i < this.aliveSubscribes.length; i++) {
            this.props.socket.unsubscribeState(`system.adapter.${this.aliveSubscribes[i]}.alive`, this.onAliveChanged);
        }
    }

    async loadInstanceInfos() {
        console.log(`Loading instance infos for ${this.props.selectedInstance}...`);
        const info: InstanceDetails = await this.props.socket.sendTo(this.props.selectedInstance, 'dm:instanceInfo');
        if (!info || typeof info !== 'object' || info.apiVersion !== 'v1') {
            throw new Error(
                `Message returned from sendTo() doesn't look like one from DeviceManagement, did you accidentally handle the message in your adapter? ${JSON.stringify(
                    info,
                )}`,
            );
        }
        this.props.setAdapterInstance(info);
    };

    render() {
        if (this.selectedInstance !== this.props.selectedInstance) {
            this.selectedInstance = this.props.selectedInstance;
            setTimeout(() => this.loadInstanceInfos().catch(console.error), 100);

        }
        /** @type {object} */
        const instanceListStyle: React.CSSProperties = {
            marginLeft: 10,
            marginRight: 10,
            display: 'grid',
            justifyContent: 'center',
            position: 'relative',
            top: 5,
        };

        return <div style={instanceListStyle}>
            <div>
                {/* <TooltipButton
            tooltip={getTranslation('refreshInstanceList')}
            Icon={<Refresh />}
            onClick={() => loadInstanceInfos().catch(console.error)}
        /> */}
                <FormControl>
                    <InputLabel id="instance-select-label" style={{ top: '10px' }}>
                        {getTranslation('instanceLabelText')}
                    </InputLabel>
                    <Select
                        labelId="instance-select-label"
                        id="instance-select"
                        value={this.props.selectedInstance}
                        onChange={e => this.props.setSelectedInstance(e.target.value)}
                        displayEmpty
                        variant="standard"
                        sx={{ minWidth: 120 }}
                    >
                        {Object.keys(this.state.instanceList).map(id => <MenuItem key={id} value={id} disabled={this.state.instanceList[id].disabled}>
                            {id}
                        </MenuItem>)}
                    </Select>
                </FormControl>
            </div>
        </div>;
    }
}

export default InstanceList;
