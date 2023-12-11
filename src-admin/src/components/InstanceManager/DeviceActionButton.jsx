import TooltipButton from './TooltipButton.jsx';
import { renderIcon, getTranslation } from './Utils.jsx';

export default function DeviceActionButton(props) {
    const {
        deviceId, action, refresh, deviceHandler,
    } = props;

    const tooltip = getTranslation(action.description);

    const icon = renderIcon(action);

    return <TooltipButton
        label={action.label || (icon ? null : action.id)}
        tooltip={tooltip}
        disabled={action.disabled}
        Icon={icon}
        onClick={deviceHandler(deviceId, action, refresh)}
    />;
}
