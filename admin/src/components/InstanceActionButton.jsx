import React from 'react';
// import { ActionContext } from './DeviceList';
import { FaOrImageIcon } from './FaOrImgIcon';
import { TooltipButton } from './TooltipButton';

export function InstanceActionButton(params) {
	const { action, context } = params;

	const tooltip = context.getTranslation(action?.description ? action.description : '');

	return (
		<TooltipButton
			tooltip={tooltip}
			label={action.title}
			disabled={action.disabled}
			Icon={<FaOrImageIcon icon={action.icon} />}
			onClick={context.action.instanceHandler(action)}
		/>
	);
}
