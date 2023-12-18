import React, { Component } from 'react';

import {
    Button, Fab,
    Switch, Slider, Select, TextField, MenuItem,
    InputAdornment, IconButton,
} from '@mui/material';

import { Clear } from '@mui/icons-material';

import { ColorPicker } from '@iobroker/adapter-react-v5';

import { ControlBase, ControlState } from '@iobroker/dm-utils/build/types/base';

import { renderIcon, getTranslation } from './Utils';

import './style.css';

interface DeviceControlProps {
    deviceId: string;
    control: any;
    socket: any;
    controlHandler: (deviceId: string, control: ControlBase, state: ControlState) => () => Promise<ioBroker.State | null>;
    controlStateHandler: (deviceId: string, control: ControlBase) => () => Promise<ioBroker.State | null>;
    colors: any;
    disabled?: boolean;
}

interface DeviceControlState {
    value: any;
    ts: number;
}

/**
 * Device Control component
 * @param {object} props - Parameters
 * @param {object} props.control - Control object
 * @param {object} props.socket - Socket object
 * @param {object} props.controlHandler - Control handler to set the state
 * @param {object} props.controlStateHandler - Control handler to read the state
 * @returns {React.JSX.Element|null}
 * @constructor
 */
export default class DeviceControl extends Component<DeviceControlProps, DeviceControlState> {
    constructor(props: DeviceControlProps) {
        super(props);
        this.state = {
            value: props.control.state?.val,
            ts: props.control.state?.ts,
        };
    }

    componentDidMount() {
        if (this.props.control.stateId) {
            this.props.socket.subscribeState(this.props.control.stateId, this.stateHandler);
        }
    }

    stateHandler = async (id: string, state: ioBroker.State) => {
        if (id === this.props.control.stateId && state) {
            // request new state
            if (this.props.control.type !== 'button') {
                const newState: ioBroker.State | null = await (this.props.controlStateHandler(this.props.deviceId, this.props.control)());
                if (newState?.ts && (!this.state.ts || newState.ts > this.state.ts)) {
                    this.setState({
                        value: newState.val,
                        ts: newState.ts,
                    });
                }
            }
        }
    };

    componentWillUnmount() {
        if (this.props.control.stateId) {
            this.props.socket.unsubscribeState(this.props.control.stateId, this.stateHandler);
        }
    }

    static getDerivedStateFromProps(props: DeviceControlProps, state: DeviceControlState) {
        if (props.control.state?.ts && (!state.ts || props.control.state?.ts > state.ts)) {
            return {
                value: props.control.state.val,
                ts: props.control.state.ts,
            };
        }

        return null;
    }

    async sendControl(deviceId: string, control: ControlBase, value: ControlState) {
        const result = await (this.props.controlHandler(deviceId, control, value)());
        if (result?.ts && (!this.state.ts || result?.ts > this.state.ts)) {
            this.setState({
                value: result.val,
                ts: result.ts,
            });
        }
    }

    wrapControl(content: React.JSX.Element, style?: React.CSSProperties, noTitle?: boolean): React.JSX.Element {
        const tooltip = getTranslation(this.props.control.description) || this.props.control.stateId;
        const icon = renderIcon(this.props.control, this.props.colors, this.state.value);
        const label = getTranslation(this.props.control.label);
        return <div
            title={tooltip}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...style,
            }}
        >
            {!noTitle && icon ? <span style={{ display: 'flex', alignItems: 'center' }}>
                {icon}
                <span style={{ fontWeight: 'bold' }}>{label}</span>
            </span> : noTitle ? null : <span style={{ fontWeight: 'bold' }}>{label}</span>}
            {content}
        </div>;
    }

    renderButton() {
        const tooltip = getTranslation(this.props.control.description) || this.props.control.stateId;
        const icon = renderIcon(this.props.control, this.props.colors, this.state.value);
        const label = getTranslation(this.props.control.label);

        const style: React.CSSProperties = {
            minWidth: 210,
        };

        let content: React.JSX.Element;
        if (!this.props.control.label) {
            content = <Fab
                disabled={this.props.disabled}
                title={tooltip}
                onClick={() => this.sendControl(this.props.deviceId, this.props.control, true)}
            >
                {icon}
            </Fab>;
        } else {
            content = <Button
                variant="contained"
                disabled={this.props.disabled}
                title={tooltip}
                onClick={() => this.sendControl(this.props.deviceId, this.props.control, true)}
                style={style}
                startIcon={icon}
            >
                {label}
            </Button>;
        }
        return this.wrapControl(content, { justifyContent: 'end' }, true);
    }

    renderSwitch() {
        return this.wrapControl(<Switch
            disabled={this.props.disabled}
            checked={!!this.state.value}
            onChange={e => this.sendControl(this.props.deviceId, this.props.control, e.target.checked)}
        />);
    }

    getColor() {
        let color;
        if (this.state.value) {
            color = this.props.control.colorOn || 'primary';
        } else if (this.props.control.type === 'switch') {
            color = this.props.control.color;
        }
        if (color === 'primary') {
            return this.props.colors.primary;
        }
        if (color === 'secondary') {
            return this.props.colors.secondary;
        }
        return color;
    }

    renderSelect() {
        return this.wrapControl(<Select
            variant="standard"
            disabled={this.props.disabled}
            value={this.state.value === undefined ? '' : this.state.value}
            onChange={e => this.sendControl(this.props.deviceId, this.props.control, e.target.value)}
        >
            {this.props.control.options.map(option => <MenuItem value={option.value}>{option.label}</MenuItem>)}
        </Select>);
    }

    renderSlider() {
        return this.wrapControl(<Slider
            min={this.props.control.min}
            max={this.props.control.max}
            disabled={this.props.disabled}
            value={this.state.value || 0}
            onChange={((e, newValue) => this.sendControl(this.props.deviceId, this.props.control, newValue as number))}
        />);
    }

    renderColor() {
        return this.wrapControl(<ColorPicker
            disabled={this.props.disabled}
            value={this.state.value as string || ''}
            onChange={rgba => this.sendControl(this.props.deviceId, this.props.control, rgba)}
        />);
    }

    renderText() {
        return this.wrapControl(<TextField
            variant="standard"
            disabled={this.props.disabled}
            value={this.state.value === undefined ? '' : this.state.value}
            onChange={e => this.sendControl(this.props.deviceId, this.props.control, e.target.value)}
            InputProps={{
                startAdornment: this.props.control.unit ? <InputAdornment position="start">
                    {this.props.control.unit}
                </InputAdornment> : null,
                endAdornment: this.state.value ? <InputAdornment position="end">
                    <IconButton
                        onClick={() => this.sendControl(this.props.deviceId, this.props.control, '')}
                        edge="end"
                    >
                        <Clear />
                    </IconButton>
                </InputAdornment> : null,
            }}
        />);
    }

    renderNumber() {
        return this.wrapControl(<TextField
            variant="standard"
            type="number"
            inputProps={{
                min: this.props.control.min,
                max: this.props.control.max,
            }}
            disabled={this.props.disabled}
            value={this.state.value === undefined ? '' : this.state.value}
            onChange={e => this.sendControl(this.props.deviceId, this.props.control, e.target.value)}
        />);
    }

    renderIcon() {
        const tooltip = getTranslation(this.props.control.description);
        const icon = renderIcon(this.props.control, this.props.colors, this.state.value);
        const color = this.getColor();

        let content: React.JSX.Element;
        const style: React.CSSProperties = {
            color: color === this.props.colors.primary || color === this.props.colors.secondary ? undefined : color,
            minWidth: 150,
        };

        if (!this.props.control.label) {
            content = <Fab
                disabled={this.props.disabled}
                size="small"
                title={tooltip}
                color={color === this.props.colors.primary ? 'primary' : (color === this.props.colors.secondary ? 'secondary' : undefined)}
                style={style}
                onClick={() => this.sendControl(this.props.deviceId, this.props.control, !this.state.value)}
            >
                {icon}
            </Fab>;
        } else {
            content = <Button
                disabled={this.props.disabled}
                title={tooltip}
                color={color === this.props.colors.primary ? 'primary' : (color === this.props.colors.secondary ? 'secondary' : undefined)}
                style={style}
                onClick={() => this.sendControl(this.props.deviceId, this.props.control, !this.state.value)}
                startIcon={icon}
            >
                {this.props.control.label}
            </Button>;
        }

        return this.wrapControl(content, { justifyContent: 'end' });
    }

    renderInfo() {
        return this.wrapControl(<span style={{ marginLeft: 10 }}>
            <span
                key={`${this.state.value}_value`}
                className="new-value"
            >
                {this.state.value}
            </span>
            {this.props.control.unit ? <span style={{ marginLeft: 5, opacity: 0.4 }}>{this.props.control.unit}</span> : null}
        </span>);
    }

    render() {
        if (this.props.control.type === 'button') {
            return this.renderButton();
        }

        if (this.props.control.type === 'icon') {
            return this.renderIcon();
        }

        if (this.props.control.type === 'switch') {
            return this.renderSwitch();
        }

        if (this.props.control.type === 'slider') {
            return this.renderSlider();
        }

        if (this.props.control.type === 'info') {
            return this.renderInfo();
        }

        if (this.props.control.type === 'select') {
            return this.renderSelect();
        }

        if (this.props.control.type === 'color') {
            return this.renderColor();
        }

        if (this.props.control.type === 'number') {
            return this.renderNumber();
        }

        if (this.props.control.type === 'text') {
            return this.renderText();
        }

        return <div style={{ color: 'red' }}>{this.props.control.type}</div>;
    }
}
