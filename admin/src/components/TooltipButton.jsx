import React from 'react';
import Typography from '@mui/material/Typography';
import { IconButton, Tooltip } from '@mui/material';

export function TooltipButton(props) {
	const { tooltip, label, toggle, disabled, Icon, ...other } = props;
	//const IconButton = toggle ? ToggleButton : Button;
	const text = !!label && <Typography variant="button">{label}</Typography>;
	//const Btn = ToggleButton;
	return !!disabled ? <IconButton disabled={true} size="large" {...other}>
		{Icon} {text}
	</IconButton> :
		<Tooltip title={tooltip}>
			<IconButton {...other} size="large">
				{Icon} {text}
			</IconButton>
		</Tooltip>;
}
