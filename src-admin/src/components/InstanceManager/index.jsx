import {
    IconButton, InputAdornment, TextField, AppBar,
    Toolbar,
} from '@mui/material';

import { Clear } from '@mui/icons-material';

import DeviceCard from './DeviceCard.jsx';
import { getTranslation } from './Utils.jsx';
import Communication from './Communication.jsx';
import InstanceActionButton from '../InstanceActionButton.jsx';

/**
 * Device List Component
 * @param {object} params - Component parameters
 * @param {object} params.socket - socket object
 * @param {string} params.selectedInstance - Selected instance
 * @param {string} params.uploadImagesToInstance - Instance to upload images to
 * @param {string} params.filter - Filter
 * @param {string} params.empbedded - true if this list used with multiple instances and false if only with one
 * @param {string} params.title - Title in appbar (only in non-embedded mode)
 * @returns {*[]} - Array of device cards
 */
export default class DeviceList extends Communication {
    constructor(props) {
        super(props);

        this.state.devices = [];
        this.state.filteredDevices = [];
        this.state.filter = '';
        this.state.instanceInfo = null;
        this.state.loading = null;
        this.state.alive = null;

        this.lastPropsFilter = this.props.filter;
        this.lastInstance = '';
        this.filterTimeout = null;
    }

    async componentDidMount() {
        if (!this.props.empbedded) {
            try {
                // check if instance is alive
                const alive = await this.props.socket.getState(`system.adapter.${this.props.selectedInstance}.alive`);
                this.props.socket.unsubscribeState(`system.adapter.${this.props.selectedInstance}.alive`, this.aliveHandler);
                if (!alive || !alive.val) {
                    this.setState({ alive: false });
                    return;
                }
                const instanceInfo = await this.loadInstanceInfos(this.props.socket);
                this.setState({ alive: true, instanceInfo });
            } catch (error) {
                console.error(error);
                this.setState({ alive: false });
            }
        }

        try {
            await this.loadData();
        } catch (error) {
            console.error(error);
        }
    }

    componentWillUnmount() {
        if (!this.props.empbedded) {
            this.props.socket.unsubscribeState(`system.adapter.${this.props.selectedInstance}.alive`, this.aliveHandler);
        }
    }

    aliveHandler = (id, state) => {
        if (id === `system.adapter.${this.props.selectedInstance}.alive`) {
            const alive = !!state?.val;
            if (alive !== this.state.alive) {
                this.setState({ alive }, () => {
                    if (alive) {
                        this.componentDidMount().catch(console.error);
                    }
                });
            }
        }
    }

    /**
    * Load devices
    * @returns {Promise<void>}
    */
    async loadData() {
        this.setState({ loading: true });
        console.log(`Loading devices for ${this.props.selectedInstance}...`);
        const devices = await this.loadDevices();

        if (!devices || !Array.isArray(devices)) {
            throw new Error(
                `Message returned from sendTo() doesn't look like one from DeviceManagement, did you accidentally handle the message in your adapter? ${JSON.stringify(
                    devices,
                )}`,
            );
        }

        this.setState({ devices, loading: false }, () =>
            this.applyFilter());
    };

    applyFilter() {
        const filter = this.props.empbedded ? this.props.filter : this.state.filter;

        // filter devices name
        if (filter) {
            const filteredDevices = this.state.devices.filter(device =>
                device.name.toLowerCase().includes(filter.toLowerCase()));
            this.setState({ filteredDevices });
        } else {
            this.setState({ filteredDevices: this.state.devices });
        }
    }

    handleFilterChange(filter) {
        this.setState({ filter }, () => {
            this.filterTimeout && clearTimeout(this.filterTimeout);
            this.filterTimeout = setTimeout(() => {
                this.filterTimeout = null;
                this.applyFilter();
            }, 250);
        });
    }

    renderContent() {
        /** @type {object} */
        const emptyStyle = {
            padding: 25,
        };

        if (this.props.empbedded && this.lastPropsFilter !== this.props.filter) {
            this.lastPropsFilter = this.props.filter;
            setTimeout(() => this.applyFilter(), 50);
        }
        if (this.props.empbedded && this.lastInstance !== this.props.selectedInstance) {
            this.lastInstance = this.props.selectedInstance;
            setTimeout(() => this.loadData().catch(console.error), 50);
        }

        let list;
        if (!this.props.empbedded && !this.state.alive) {
            list = <div style={emptyStyle}>
                <span>{getTranslation('instanceNotAlive')}</span>
            </div>;
        } else if (!this.state.devices.length && this.props.selectedInstance) {
            list = <div style={emptyStyle}>
                <span>{getTranslation('noDevicesFoundText')}</span>
            </div>;
        } else if (this.state.devices.length && !this.state.filteredDevices.length) {
            list = <div style={emptyStyle}>
                <span>{getTranslation('allDevicesFilteredOut')}</span>
            </div>
        } else {
            list = this.state.filteredDevices.map(device => <DeviceCard
                key={device.id}
                title={device.name}
                device={device}
                instanceId={this.props.selectedInstance}
                uploadImagesToInstance={this.props.uploadImagesToInstance}
                deviceHandler={this.deviceHandler}
                controlHandler={this.controlHandler}
                controlStateHandler={this.controlStateHandler}
                socket={this.props.socket}
            />);
        }

        if (this.props.empbedded) {
            return list;
        }

        return <div style={{ width: '100%', height: '100%', overflow: 'hidden'}}>
            <Toolbar variant="dense" style={{ backgroundColor: '#777', display: 'flex' }}>
                {this.props.title}
                {this.state.alive && this.state.instanceInfo?.actions?.length ? <div
                    style={{
                        marginLeft: 20,
                    }}
                >
                    {this.state.instanceInfo.actions.map(action =>
                        <InstanceActionButton
                            key={action.id}
                            action={action}
                            instanceHandler={this.instanceHandler}
                        />)}
                </div> : null}

                <div style={{ flexGrow: 1 }}/>

                {this.state.alive ? <TextField
                    variant="standard"
                    style={{ width: 200 }}
                    size="small"
                    label={getTranslation('filterLabelText')}
                    onChange={e => this.handleFilterChange(e.target.value)}
                    value={this.state.filter}
                    InputProps={{
                        endAdornment: this.state.filter ? <InputAdornment position="end">
                            <IconButton
                                onClick={() => this.handleFilterChange('')}
                                edge="end"
                            >
                                <Clear/>
                            </IconButton>
                        </InputAdornment> : null,
                    }}
                /> : null}
            </Toolbar>
            <div
                style={{
                    width: '100%',
                    height: 'calc(100% - 48px)',
                    overflow: 'auto',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    display: 'grid',
                }}
            >
                {list}
            </div>
        </div>
    }
}
