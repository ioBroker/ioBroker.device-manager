import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TooltipButton from './TooltipButton';
import FaOrImageIcon from './FaOrImgIcon';

/**
 * InstanceList component
 * @param {object} params - Parameters
 * @param {object} params.context - Context object
 * @param {string} params.selectedInstance - Selected instance
 * @param {function} params.setSelectedInstance - Set selected instance
 * @param {function} params.setAdapterInstance - Set adapter instance
 * @returns {Element}
 * @constructor
 */
export default function InstanceList(params) {
    const {
        context, setSelectedInstance, selectedInstance, setAdapterInstance,
    } = params;
    const [instanceList, setInstanceList] = React.useState({});

    /**
     * Load adapters
     * @returns {void}
     */
    React.useEffect(() => {
        const loadAdapters = async () => {
            console.log('Waiting for connection');
            await context.socket.waitForFirstConnection();

            console.log('Loading adapters...');
            // const result = await context.socket.sendTo('device-manager.0', 'listInstances');
            const res = await context.socket.getObjectViewSystem('instance', 'system.adapter.', 'system.adapter.\u9999');
            const dmInstances = {};
            for (const id in res) {
                if (!res[id]?.common?.messagebox) {
                    continue;
                }
                if (!res[id].common.supportedMessages?.deviceManager) {
                    continue;
                }

                const instanceName = id.substring('system.adapter.'.length);
                try {
                    // Check if the instance is alive by getting the state alive
                    const alive = await context.socket.getState(`system.adapter.${instanceName}.alive`);
                    if (!alive || !alive.val) {
                        continue;
                    }

                    const instance = parseInt(instanceName.split('.').pop()) || 0;
                    dmInstances[instanceName] = {
                        title: '',
                        instance,
                    };
                } catch (error) {
                    console.error(error);
                }
            }

            setInstanceList(dmInstances);
            console.log(`Load Adapters result: ${JSON.stringify(dmInstances)}`);
        };
        loadAdapters().catch(console.error);
    }, [context.socket]);

    /**
     *     Handle state change
     *     @param {object} event - Event object
     *     @param {string} event.target.value - Selected instance
     *     @returns {void}
     */
    const handleStateChange = event => setSelectedInstance(event.target.value);

    const loadInstanceInfos = async () => {
        console.log(`Loading instance infos for ${selectedInstance}...`);
        const info = await context.socket.sendTo(selectedInstance, 'dm:instanceInfo');
        if (!info || typeof info !== 'object' || info.apiVersion !== 'v1') {
            throw new Error(
                `Message returned from sendTo() doesn't look like one from DeviceManagement, did you accidentally handle the message in your adapter? ${JSON.stringify(
                    info,
                )}`,
            );
        }
        setAdapterInstance(info);
    };

    /**
     * Load instance infos
     * @returns {void}
     */
    React.useEffect(() => {
        if (selectedInstance !== '') {
            loadInstanceInfos().catch(console.error);
        }
    }, [selectedInstance]);

    /** @type {object} */
    const instanceListStyle = {
        marginLeft: '10px',
        marginRight: '10px',
        display: 'grid',
        justifyContent: 'center',
        position: 'relative',
        top: '5px',
    };

    return <div style={instanceListStyle}>
        <div>
            <TooltipButton
                tooltip={context.getTranslation('refreshInstanceList')}
                Icon={<FaOrImageIcon icon="fa-solid fa-arrows-rotate" />}
                onClick={() => loadInstanceInfos().catch(console.error)}
            />
            <FormControl>
                <InputLabel id="instance-select-label" style={{ top: '10px' }}>
                    {context.getTranslation('instanceLabelText')}
                </InputLabel>
                <Select
                    labelId="instance-select-label"
                    id="instance-select"
                    value={selectedInstance}
                    onChange={handleStateChange}
                    displayEmpty
                    variant="standard"
                    sx={{ minWidth: 120 }}
                >
                    {Object.entries(instanceList).map(([id]) => <MenuItem key={id} value={id}>
                        {id}
                    </MenuItem>)}
                </Select>
            </FormControl>
        </div>
    </div>;
}
