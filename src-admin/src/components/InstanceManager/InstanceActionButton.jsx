import TooltipButton from './TooltipButton.jsx';
import { renderIcon, getTranslation } from './Utils.jsx';

export default function InstanceActionButton(params) {
    const { action, instanceHandler } = params;

    const tooltip = getTranslation(action?.description ? action.description : '');
    const title = getTranslation(action?.title ? action.title : '');

    const icon = renderIcon(action);

    return <TooltipButton
        tooltip={tooltip}
        label={title}
        disabled={action.disabled}
        Icon={icon}
        onClick={instanceHandler(action)}
    />;
}
