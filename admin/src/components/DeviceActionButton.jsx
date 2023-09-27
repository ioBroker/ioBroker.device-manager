// import { DeviceAction } from '@jey-cee/dm-utils/build/types/api';
import React from 'react';
// import { ActionContext } from './DeviceList';
import { FaOrImageIcon } from './FaOrImgIcon';
import { TooltipButton } from './TooltipButton';

export function DeviceActionButton(props) {
	const { deviceId, action, refresh, context, actionContext } = props;

	const tooltip = context.getTranslation(action.description);

	return (
		<TooltipButton
			style={{ fontSize: '1.2rem' }}
			tooltip={tooltip}
			disabled={action.disabled}
			Icon={<FaOrImageIcon icon={action.icon} />}
			onClick={actionContext.deviceHandler(deviceId, action, context, refresh)}
		/>
	);
}
