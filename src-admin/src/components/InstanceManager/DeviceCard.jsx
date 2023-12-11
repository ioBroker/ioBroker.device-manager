import React, { useEffect, useState } from 'react';

import {
    Paper, Button, Typography,
    Dialog, DialogActions, DialogContent, IconButton,
    Fab, DialogTitle,
} from '@mui/material';

import {
    MoreVert as MoreVertIcon,
    VideogameAsset as ControlIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

import DeviceActionButton from './DeviceActionButton.jsx';
import DeviceControl from './DeviceControl.jsx';
import DeviceStatus from './DeviceStatus.jsx';
import JsonConfig from './JsonConfig.jsx';
import DeviceImageUpload from './DeviceImageUpload.jsx';
import { getTranslation } from './Utils.jsx';
import {Icon} from '@iobroker/adapter-react-v5';

/**
 * Device Card Component
 * @param {object} params - Component parameters
 * @param {string} params.title - Title
 * @param {string} params.id - Device ID
 * @param {object} params.device - Device
 * @param {string} params.instanceId - Instance ID
 * @param {object} params.socket - socket object
 * @param {object} params.actionContext - Action Context
 * @param {object} params.uploadImagesToInstance - Instance, where the images should be uploaded to
 * @return {Element}
 * @constructor
 */
export default function DeviceCard(params) {
    const {
        title, device, instanceId, socket, deviceHandler, uploadImagesToInstance, controlHandler, controlStateHandler,
    } = params;
    const [shadow, setShadow] = React.useState('0px 4px 8px rgba(0, 0, 0, 0.1)');
    const [open, setOpen] = React.useState(false);
    const [details, setDetails] = React.useState();
    const [data, setData] = React.useState({});
    const [icon, setIcon] = useState(device.icon || './no_image.webp');
    const [showControlDialog, setShowControlDialog] = useState(false);
    // const [uploadedImage, setUploadedImage] = React.useState(null);

    const hasDetails = device.hasDetails;
    const status = !device.status ? [] : Array.isArray(device.status) ? device.status : [device.status];
    const colors = { primary: '#111', secondary: '#888' };

    useEffect(() => {
        async function fetchIcon() {
            if (!device.icon) {
                // try to load the icon from file storage
                const fileName = `${device.manufacturer ? `${device.manufacturer}_` : ''}${
                    device.model ? device.model : device.id
                }`;
                const url = `../files/${instanceId.replace('system.adapter.', '')}/${fileName}.webp`;

                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            setIcon(reader.result);
                        };
                        reader.readAsDataURL(blob);
                    } else {
                        throw new Error('Response not ok');
                    }
                } catch (error) {
                    setIcon('./no_image.webp');
                }
            }
        }

        fetchIcon()
            .catch(e => console.error(e));
    }, [device, instanceId]);

    /**
     * Load the device details
     * @return {Promise<void>}
     */
    const loadDetails = async () => {
        console.log(`Loading device details for ${device.id}... from ${instanceId}`);
        const result = await socket.sendTo(instanceId, 'dm:deviceDetails', device.id);
        console.log(`Got device details for ${device.id}:`, result);
        setDetails(result);
    };

    /**
     * Refresh the device details
     * @returns {void}
     */
    const refresh = () => {
        setDetails(undefined);
        loadDetails().catch(console.error);
    };

    /**
     * Open the modal
     * @returns {void}
     */
    const openModal = () => {
        if (open === false) {
            loadDetails().catch(console.error);
            setOpen(true);
        }
    };

    /**
     * Close the modal
     * @returns {void}
     */
    const handleClose = () => setOpen(false);

    const handleImageClick = async imageData => imageData && setIcon(imageData);

    /**
     * Copy the device ID to the clipboard
     * @returns {void}
     */
    const copyToClipboard = async () => {
        const textToCopy = device.id;
        const result = await navigator.clipboard.writeText(textToCopy);
        if (result) {
            console.log(`Failed to copy ${textToCopy} to clipboard!`);
        } else {
            // alert(`Copied ${textToCopy} to clipboard!`);
            alert(`${getTranslation('copied')} ${textToCopy} ${getTranslation('toClipboard')}!`);
        }
    };

    React.useEffect(() => setData(details?.data || {}), [details]);

    // Styles for the device card
    /** @type {CSSProperties} */
    const divStyle = {
        height: '100%',
    };
    /** @type {CSSProperties} */
    const cardStyle = {
        // backgroundColor: '#fafafa',
        width: 300,
        minHeight: 280,
        margin: '10px',
        overflow: 'hidden',
    };
    /** @type {CSSProperties} */
    const headerStyle = {
        display: 'flex',
        position: 'relative',
        justifyContent: 'space-between',
        minHeight: 60,
        color: '#000',
        padding: '0 10px 0 10px',
        backgroundColor: '#77c7ff8c',
        borderRadius: '4px 4px 0 0',
    };
    /** @type {CSSProperties} */
    const imgAreaStyle = {
        height: 45,
        width: 45,
        margin: 'auto',
        justifyContent: 'center',
        display: 'grid',
    };
    /** @type {CSSProperties} */
    const imgStyle = {
        zIndex: 2,
        maxWidth: '100%',
        maxHeight: '100%',
    };
    /** @type {CSSProperties} */
    const titleStyle = {
        color: '#333',
        width: '100%',
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 16,
        paddingLeft: 8,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };
    /** @type {CSSProperties} */
    const detailsButtonStyle = {
        right: 20,
        bottom: -20,
        position: 'absolute',
    };
    /** @type {CSSProperties} */
    const controlSwitchStyle = {
        right: 70,
        bottom: -20,
        position: 'absolute',
        backgroundColor: '#444',
        borderRadius: 50,
        width: 60,
        height: 40,
        paddingTop: 1,
    };
    const controlButtonStyle = {
        right: 65,
        bottom: -20,
        position: 'absolute',
    };
    /** @type {CSSProperties} */
    const bodyStyle = {
        height: 'calc(100% - 116px)',
        padding: '0 10px 10px 10px',
    };
    /** @type {CSSProperties} */
    const deviceInfoStyle = {
        padding: '20px 10px 10px 10px',
        height: 116,
    };
    /** @type {CSSProperties} */
    const statusStyle = {
        padding: '15px 15px 0 15px',
        height: 41,
    };

    const renderedDialog = open && details ? <Dialog
        open={!0}
        maxWidth="md"
        onClose={handleClose}
    >
        <DialogContent>
            <JsonConfig
                instanceId={instanceId}
                socket={socket}
                schema={details.schema}
                data={data}
                onChange={setData}
            />
        </DialogContent>
        <DialogActions>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClose}
                autoFocus
            >
                {getTranslation('closeButtonText')}
            </Button>
        </DialogActions>
    </Dialog> : null;

    let renderedControls;
    let controlDialog;
    let firstControl = device.controls?.[0];
    if (device.controls?.length === 1 && ((firstControl.type === 'icon' || firstControl.type === 'switch') && !firstControl.label)) {
        // control can be placed in button icon
        renderedControls = <div style={firstControl.type === 'switch' ? controlSwitchStyle: controlButtonStyle}>
            <DeviceControl
                control={firstControl}
                colors={colors}
                socket={socket}
                deviceId={device.id}
                controlHandler={controlHandler}
                controlStateHandler={controlStateHandler}
            />
        </div>;
    } else if (device.controls?.length) {
        // place button and show controls dialog
        renderedControls = <Fab size="small" onClick={() => setShowControlDialog(true)} style={controlButtonStyle}>
            <ControlIcon />
        </Fab>;
        if (showControlDialog) {
            controlDialog = <Dialog
                open={!0}
                onClose={() => setShowControlDialog(false)}
            >
                <DialogTitle>
                    {title}
                    <IconButton
                        style={{ position: 'absolute', top: 5, right: 5, zIndex: 10 }}
                        onClick={() => setShowControlDialog(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {device.controls.map(control =>
                        <DeviceControl key={control.id} control={firstControl} colors={colors} />)}
                </DialogContent>
            </Dialog>;
        }
    }

    const renderedActions = device.actions?.length ? <div
        style={{
            flex: 1,
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 60px)',
            gridTemplateRows: 'auto',
            paddingBottom: 5,
            height: 48,
        }}
    >
        {device.actions.map(a => <DeviceActionButton
            key={a.id}
            deviceId={device.id}
            action={a}
            deviceHandler={deviceHandler}
            refresh={refresh}
        />)}
    </div> : null;

    return <div style={divStyle}>
        <Paper
            style={cardStyle}
            sx={{
                '&:hover': {
                    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.4)',
                },
            }}
            // onMouseEnter={() => setShadow('0px 8px 12px rgba(0, 0, 0, 0.4)')}
            // onMouseLeave={() => setShadow('0px 4px 8px rgba(0, 0, 0, 0.1)')}
        >
            <div style={headerStyle}>
                <div style={imgAreaStyle}>
                    {uploadImagesToInstance ? <DeviceImageUpload
                        uploadImagesToInstance={uploadImagesToInstance}
                        instanceId={instanceId}
                        deviceId={device.id}
                        manufacturer={device.manufacturer}
                        model={device.model}
                        onImageSelect={handleImageClick}
                    /> : null}
                    <img src={icon} alt="placeholder" style={imgStyle} />
                </div>
                <div style={titleStyle}>{title}</div>
                {renderedControls}
                {hasDetails ? <Fab size="small" style={detailsButtonStyle} onClick={openModal} color="primary">
                    <MoreVertIcon />
                </Fab> : null}
            </div>
            <div style={statusStyle}>
                {status.map((s, i) => <DeviceStatus key={i} status={s} />)}
            </div>
            <div style={bodyStyle}>
                <Typography variant="body1" style={deviceInfoStyle}>
                    <div>
                        <span onClick={copyToClipboard}>
                            <b>ID:</b>
                            <span style={{ marginLeft: 4 }}>{device.id.replace(/.*\.\d\./, '')}</span>
                        </span>
                    </div>
                    <div>
                        {device.manufacturer ? <span>
                            <b style={{ marginRight: 4 }}>
                                {getTranslation('manufacturer')}
                                :
                            </b>
                            {device.manufacturer}
                        </span> : null}
                    </div>
                    <div>
                        {device.model ? <span>
                            <b style={{ marginRight: 4 }}>
                                {getTranslation('model')}
                                :
                            </b>
                            {device.model}
                        </span> : null}
                    </div>
                </Typography>
                {renderedActions}
            </div>
        </Paper>
        {renderedDialog}
        {controlDialog}
    </div>;
}
