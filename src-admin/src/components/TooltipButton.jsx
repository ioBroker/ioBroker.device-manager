import { IconButton, Tooltip, Typography } from '@mui/material';

export default function TooltipButton(props) {
    const {
        tooltip, label, disabled, Icon, ...other
    } = props;
    // const IconButton = toggle ? ToggleButton : Button;
    const text = !!label && <Typography variant="button">{label}</Typography>;
    // const Btn = ToggleButton;
    return <Tooltip title={tooltip}>
        <IconButton {...other} disabled={disabled} size="small">
            {Icon}
            {text ? <span style={{ marginLeft: 4 }}>{text}</span> : null}
        </IconButton>
    </Tooltip>;
}
