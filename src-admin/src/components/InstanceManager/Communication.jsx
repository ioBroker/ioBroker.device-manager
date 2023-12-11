import { Component } from 'react';

import {
    Button, Dialog,
    DialogActions,
    DialogContent, DialogContentText, DialogTitle,
    Snackbar, LinearProgress, CircularProgress, Backdrop,
} from '@mui/material';

import { getTranslation } from './Utils.jsx';
import JsonConfig from './JsonConfig.jsx';

/**
 * Device List Component
 * @param {object} params - Component parameters
 * @param {object} params.socket - socket object
 * @param {string} params.selectedInstance - Selected instance
 * @param {string} params.filter - Filter
 * @returns {*[]} - Array of device cards
 */
export default class Communication extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: false,
            showToast: null,
            message: null,
            confirm: null,
            form: null,
            progress: null,
        };

        /**
         * Action context
         * @type function(string, object, refresh): function(): *)
         */
        this.instanceHandler = action => () => this.sendActionToInstance('dm:instanceAction', { actionId: action.id });
        this.deviceHandler = (deviceId, action, refresh) => () => this.sendActionToInstance('dm:deviceAction', { deviceId, actionId: action.id }, refresh);
        this.controlHandler = (deviceId, control, state) => () => this.sendControlToInstance('dm:deviceControl', { deviceId, controlId: control.id, state });
        this.controlStateHandler = (deviceId, control) => () => this.sendControlToInstance('dm:deviceControlState', { deviceId, controlId: control.id });
    }

    sendActionToInstance = (command, messageToSend, refresh) => {
        const send = async () => {
            this.setState({ showSpinner: true });
            /** @type {object} */
            const response = await this.props.socket.sendTo(this.props.selectedInstance, command, messageToSend);
            /** @type {string} */
            const type = response.type;
            console.log(`Response: ${response.type}`);
            switch (type) {
                case 'message':
                    console.log(`Message received: ${response.message}`);
                    this.setState({
                        message: {
                            message: response.message,
                            handleClose: () => this.setState({ message: null }, () =>
                                this.sendActionToInstance('dm:actionProgress', { origin: response.origin })),
                        },
                    });
                    break;

                case 'confirm':
                    console.log(`Confirm received: ${response.confirm}`);
                    this.setState({
                        confirm: {
                            message: response.confirm,
                            handleClose: confirmation => this.setState({ confirm: null }, () =>
                                this.sendActionToInstance('dm:actionProgress', {
                                    origin: response.origin,
                                    confirm: confirmation,
                                })),
                        },
                    });
                    break;

                case 'form':
                    console.log('Form received');
                    this.setState({
                        form: {
                            ...response.form,
                            handleClose: data => this.setState({ form: null }, () => {
                                console.log(`Form ${JSON.stringify(data)}`);
                                this.sendActionToInstance('dm:actionProgress', {
                                    origin: response.origin,
                                    data,
                                });
                            }),
                        },
                    });
                    break;

                case 'progress':
                    if (this.state.progress) {
                        const progress = { ...this.state.progress, ...response.progress };
                        this.setState({ progress });
                    } else {
                        this.setState({ progress: response.progress });
                    }
                    this.sendActionToInstance('dm:actionProgress', { origin: response.origin });
                    break;

                case 'result':
                    console.log('Response content', response.result);
                    if (response.result.refresh) {
                        if (response.result.refresh === true) {
                            this.loadData().catch(console.error);
                            console.log('Refreshing all');
                        } else if (response.result.refresh === 'instance') {
                            console.log(`Refreshing instance infos: ${this.props.selectedInstance}`);
                        } else if (response.result.refresh === 'device') {
                            if (refresh) {
                                console.log(`Refreshing device infos: ${this.props.selectedInstance}`);
                                // TODO: send command to get info only about one device. Now all devices are reloaded
                                this.loadData().catch(console.error);
                            }
                        } else {
                            console.log('Not refreshing anything');
                        }
                    }
                    if (response.result.error) {
                        console.error(`Error: ${response.result.error}`);
                        this.setState({ showToast: response.result.error.message });
                    } else if (response.result.state !== undefined) {
                        // update control state
                    }
                    this.setState({ showSpinner: false });
                    break;
                default:
                    console.log(`Unknown response type: ${type}`);
                    this.setState({ showSpinner: false });
                    break;
            }
        };

        send().catch(console.error);
    };

    sendControlToInstance = async (command, messageToSend) => {
        /** @type {object} */
        const response = await this.props.socket.sendTo(this.props.selectedInstance, command, messageToSend);
        /** @type {string} */
        const type = response.type;
        console.log(`Response: ${response.type}`);
        if (response.type === 'result') {
            console.log('Response content', response.result);
            if (response.result.error) {
                console.error(`Error: ${response.result.error}`);
                this.setState({ showToast: response.result.error.message });
            } else if (response.result.state !== undefined) {
                return response.result.state;
            }
        } else {
            console.warn('Unexpected response type', type);
        }

        return null;
    };

    loadDevices() {
        return this.props.socket.sendTo(this.props.selectedInstance, 'dm:listDevices');
    }

    loadInstanceInfos() {
        return this.props.socket.sendTo(this.props.selectedInstance, 'dm:instanceInfo');
    }

    renderMessageDialog() {
        if (!this.state.message) {
            return null;
        }

        return <Dialog
            open={!0}
            onClose={() => this.state.message.handleClose()}
            hideBackdrop
            aria-describedby="message-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="message-dialog-description">{this.state.message.message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.state.message.handleClose()} autoFocus hideBackdrop>
                    {getTranslation('okButtonText')}
                </Button>
            </DialogActions>
        </Dialog>;
    }

    renderConfirmDialog() {
        if (!this.state.confirm) {
            return null;
        }
        return <Dialog
            open={!0}
            onClose={() => this.state.confirm.handleClose()}
            hideBackdrop
            aria-describedby="confirm-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {getTranslation(this.state.confirm.message)}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.state.confirm.handleClose(true)}
                    autoFocus
                    hideBackdrop
                >
                    {getTranslation('yesButtonText')}
                </Button>
                <Button
                    variant="contained"
                    color="grey"
                    onClick={() => this.state.confirm.handleClose(false)}
                    autoFocus
                    hideBackdrop
                >
                    {getTranslation('noButtonText')}
                </Button>
            </DialogActions>
        </Dialog>;
    }

    renderSnackbar() {
        return <Snackbar
            open={!!this.state.showToast}
            autoHideDuration={6000}
            onClose={() => this.setState({ showToast: null })}
            message={this.state.showToast}
        />;
    }

    renderFormDialog() {
        if (!this.state.form) {
            return null;
        }
        return <Dialog open={!0} onClose={() => this.state.form.handleClose()} hideBackdrop>
            <DialogTitle>{getTranslation(this.state.form.title)}</DialogTitle>
            <DialogContent>
                <JsonConfig
                    instanceId={this.props.selectedInstance}
                    schema={this.state.form.schema}
                    data={this.state.form.data}
                    socket={this.props.socket}
                    onChange={data => {
                        console.log('handleFormChange', { data });
                        const form = { ...this.state.form };
                        form.data = data;
                        this.setState({ form });
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.state.form.handleClose(this.state.form.data)}
                    autoFocus
                    hideBackdrop
                >
                    {getTranslation('okButtonText')}
                </Button>
                <Button
                    variant="contained"
                    color="grey"
                    onClick={() => this.state.form.handleClose()}
                    hideBackdrop
                >
                    {getTranslation('cancelButtonText')}
                </Button>
            </DialogActions>
        </Dialog>;
    }

    renderProgressDialog() {
        if (!this.state.progress?.open) {
            return null;
        }

        return <Dialog
            open={!0}
            onClose={() => {}}
            hideBackdrop
        >
            <LinearProgress variant="determinate" value={this.state.progress?.progress || 0} />
        </Dialog>;
    }

    renderContent() {
        return null;
    }

    renderSpinner() {
        if (!this.state.showSpinner && !this.state.progress?.open && !this.state.message && !this.state.confirm && !this.state.form) {
            return null;
        }
        return <Backdrop style={{ zIndex: 1000 }} open={!0}>
            <CircularProgress />
        </Backdrop>;
    }

    render() {
        return <>
            {this.renderSnackbar()}
            {this.renderContent()}
            {this.renderSpinner()}
            {this.renderConfirmDialog()}
            {this.renderMessageDialog()}
            {this.renderFormDialog()}
            {this.renderProgressDialog()}
        </>;
    }
}
