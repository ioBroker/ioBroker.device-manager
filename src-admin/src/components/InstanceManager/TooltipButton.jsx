import { IconButton, Tooltip, Typography } from '@mui/material';

export default function TooltipButton(props) {
    const {
        tooltip, label, disabled, Icon, ...other
    } = props;

    const text = !!label && <Typography variant="button" style={{ marginLeft: 4 }}>{label}</Typography>;

    if (tooltip) {
        return <Tooltip title={tooltip}>
            <span>
                <IconButton {...other} disabled={disabled} size="small">
                    {Icon}
                    {text}
                </IconButton>
            </span>
        </Tooltip>;
    }

    return <IconButton {...other} disabled={disabled} size="small">
        {Icon}
        {text}
    </IconButton>;
}
