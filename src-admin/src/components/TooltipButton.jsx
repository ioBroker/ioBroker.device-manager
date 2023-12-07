import { IconButton, Tooltip, Typography } from '@mui/material';

export default function TooltipButton(props) {
    const {
        tooltip, label, disabled, Icon, ...other
    } = props;
    // const IconButton = toggle ? ToggleButton : Button;
    const text = !!label && <Typography variant="button">{label}</Typography>;
    // const Btn = ToggleButton;
    return disabled ? <IconButton disabled size="large" {...other}>
        {Icon}
        <span style={{ marginLeft: 4 }}>{text}</span>
    </IconButton> :
        <Tooltip title={tooltip}>
            <IconButton {...other} size="large">
                {Icon}
                <span style={{ marginLeft: 4 }}>{text}</span>
            </IconButton>
        </Tooltip>;
}
