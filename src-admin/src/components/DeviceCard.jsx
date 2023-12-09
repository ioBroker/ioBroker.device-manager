import React, { useEffect, useState } from 'react';

import {
    Paper, Button, Typography,
    Dialog, DialogActions, DialogContent,
} from '@mui/material';

import { MoreVert as MoreVertIcon } from '@mui/icons-material';

import DeviceActionButton from './DeviceActionButton';
import DeviceStatus from './DeviceStatus';
import JsonConfig from './JsonConfig';
import DeviceImageUpload from './DeviceImageUpload';

/**
 * Device Card Component
 * @param {object} params - Component parameters
 * @param {string} params.title - Title
 * @param {string} params.key - Key
 * @param {object} params.device - Device
 * @param {string} params.instanceId - Instance ID
 * @param {object} params.context - Tab App Context
 * @param {object} params.actionContext - Action Context
 * @return {Element}
 * @constructor
 */
export default function DeviceCard(params) {
    const {
        title, key, device, instanceId, context, actionContext,
    } = params;
    const [shadow, setShadow] = React.useState('0px 4px 8px rgba(0, 0, 0, 0.1)');
    const [open, setOpen] = React.useState(false);
    const [details, setDetails] = React.useState();
    const [data, setData] = React.useState({});
    const [icon, setIcon] = useState(device.icon || './no_image.webp');
    // const [uploadedImage, setUploadedImage] = React.useState(null);

    const hasDetails = device.hasDetails;
    const status = !device.status ? [] : Array.isArray(device.status) ? device.status : [device.status];

    useEffect(() => {
        async function fetchIcon() {
            if (!device.icon) {
                // try to load the icon from file storage
                const fileName = `${device.manufacturer ? `${device.manufacturer}_` : ''}${
                    device.model ? device.model : device.id
                }`;
                const url = `../files/${context.instanceId.replace('system.adapter.', '')}/${fileName}.webp`;

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
    }, [device, context.instanceId]);

    /**
     * Load the device details
     * @return {Promise<void>}
     */
    const loadDetails = async () => {
        console.log(`Loading device details for ${device.id}... from ${instanceId}`);
        const result = await context.socket.sendTo(instanceId, 'dm:deviceDetails', device.id);
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

    const handleImageClick = async imageData => {
        if (imageData) {
            setIcon(imageData);
        }
    };

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
            alert(`${context.getTranslation('copied')} ${textToCopy} ${context.getTranslation('toClipboard')}!`);
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
        width: '300px',
        minHeight: '280px',
        margin: '10px',
        boxShadow: shadow,
        overflow: 'hidden',
    };
    /** @type {CSSProperties} */
    const headerStyle = {
        display: 'flex',
        position: 'relative',
        justifyContent: 'space-between',
        minHeight: '60px',
        color: '#000',
        padding: '0 10px 0 10px',
        backgroundColor: '#77c7ff8c',
        borderRadius: '4px 4px 0 0',
    };
    /** @type {CSSProperties} */
    const imgAreaStyle = {
        height: '45px',
        width: '45px',
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
        fontSize: '16px',
        fontWeight: 'bold',
        paddingTop: '16px',
        paddingLeft: '8px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };
    /** @type {CSSProperties} */
    const detailsButtonStyle = {
        right: '20px',
        width: '40px',
        minWidth: '40px',
        bottom: '-20px',
        height: '40px',
        position: 'absolute',
        padding: 0,
        fill: 'currentСolor',
        border: 'none',
        borderRadius: '50%',
        color: '#fff',
        display: 'block',
        marginTop: '10px',
        transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        fontSize: '1.5rem',
        flexShrink: 0,
        boxShadow:
            'rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px',
    };
    /** @type {CSSProperties} */
    const bodyStyle = {
        height: 'Calc(100% - 116px)',
    };
    /** @type {CSSProperties} */
    const deviceInfoStyle = {
        padding: '20px 10px 10px 10px',
        height: '100px',
    };
    /** @type {CSSProperties} */
    const statusStyle = {
        padding: '15px 15px 0 15px',
        height: '41px',
    };

    return <div style={divStyle} key={key}>
        <Paper
            style={cardStyle}
            onMouseEnter={() => setShadow('0px 8px 12px rgba(0, 0, 0, 0.4)')}
            onMouseLeave={() => setShadow('0px 4px 8px rgba(0, 0, 0, 0.1)')}
        >
            <div style={headerStyle}>
                <div style={imgAreaStyle}>
                    <DeviceImageUpload
                        context={context}
                        instanceId={instanceId}
                        deviceId={device.id}
                        manufacturer={device.manufacturer}
                        model={device.model}
                        onImageSelect={handleImageClick}
                    />
                    <img src={icon} alt="placeholder" style={imgStyle} />
                </div>
                <div style={titleStyle}>{title}</div>
                {hasDetails ? <Button variant="contained" style={detailsButtonStyle} onClick={openModal}>
                    <MoreVertIcon />
                </Button> : null}
            </div>
            <div style={statusStyle}>
                {status.map((s, i) => <DeviceStatus key={i} status={s} context={context} />)}
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
                                {context.getTranslation('manufacturer')}
                                :
                            </b>
                            {device.manufacturer}
                        </span> : null}
                    </div>
                    <div>
                        {device.model ? <span>
                            <b style={{ marginRight: 4 }}>
                                {context.getTranslation('model')}
                                :
                            </b>
                            {device.model}
                        </span> : null}
                    </div>
                </Typography>
                {device.actions?.length && <div
                    style={{
                        flex: '1',
                        position: 'relative',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 60px)',
                        gridTemplateRows: 'auto',
                        paddingBottom: '5px',
                        height: '60px',
                    }}
                >
                    {device.actions.map(a => <DeviceActionButton
                        key={a.id}
                        deviceId={device.id}
                        action={a}
                        actionContext={actionContext}
                        context={context}
                        refresh={refresh}
                    />)}
                </div>}
            </div>
        </Paper>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                {details && <JsonConfig
                    instanceId={instanceId}
                    socket={context.socket}
                    schema={details.schema}
                    data={data}
                    onChange={setData}
                />}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    </div>;
}
