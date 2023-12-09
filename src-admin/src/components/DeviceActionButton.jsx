import TooltipButton from './TooltipButton';
import { renderIcon } from './Utils.jsx';

export default function DeviceActionButton(props) {
    const {
        deviceId, action, refresh, context, actionContext,
    } = props;

    const tooltip = context.getTranslation(action.description);

    const icon = renderIcon(action);

    return <TooltipButton
        label={action.label || (icon ? null : action.id)}
        tooltip={tooltip}
        disabled={action.disabled}
        Icon={icon}
        onClick={actionContext.deviceHandler(deviceId, action, context, refresh)}
    />;
}
