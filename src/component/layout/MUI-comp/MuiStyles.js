import { styled } from '@mui/material/styles';
import { Paper, Button, Avatar } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
    margin: theme.spacing(1),
    backgroundColor: theme.palette.common.black
}));

export const StyledForm = styled('form')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(1)
}));

export const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(2, 0),
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    '&:hover': {
        backgroundColor: theme.palette.grey[800]
    }
}));

export const StyledOutlinedButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    borderColor: theme.palette.common.black,
    color: theme.palette.common.black,
    '&:hover': {
        backgroundColor: theme.palette.grey[100],
        borderColor: theme.palette.common.black
    }
}));

export const StyledDivider = styled('div')(({ theme }) => ({
    margin: theme.spacing(2, 0),
    display: 'flex',
    alignItems: 'center',
    '&::before, &::after': {
        content: '""',
        flex: 1,
        borderBottom: `1px solid ${theme.palette.divider}`
    }
}));

export const OAuthButtonContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2)
}));

export const Styledcontainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
}))