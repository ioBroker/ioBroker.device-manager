import TooltipButton from './TooltipButton';
import { renderIcon } from './Utils.jsx';

export default function InstanceActionButton(params) {
    const { action, context } = params;

    const tooltip = context.getTranslation(action?.description ? action.description : '');
    const title = context.getTranslation(action?.title ? action.title : '');

    const icon = renderIcon(action);

    return <TooltipButton
        tooltip={tooltip}
        label={title}
        disabled={action.disabled}
        Icon={icon}
        onClick={context.action.instanceHandler(action)}
    />;
}
