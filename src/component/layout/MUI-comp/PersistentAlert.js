import { Alert, IconButton, Collapse, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

const StyledAlert = styled(Alert)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: theme.zIndex.modal + 1,
  width: 'calc(100% - 32px)',
  maxWidth: theme.spacing(50),
  boxShadow: theme.shadows[8],
}));


const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  zIndex: theme.zIndex.modal,
}));

const PersistentAlert = ({ open, message, onClose, severity }) => {
    if (!open) return null;

  return (
  
        <StyledAlert
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {message}
        </StyledAlert>


  );
};

export default PersistentAlert;
