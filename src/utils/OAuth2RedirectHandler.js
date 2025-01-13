import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, CircularProgress, Alert } from "@mui/material";
import { Styledcontainer } from "../component/layout/MUI-comp/MuiStyles"; 
import { handleOAuth2Success } from "../actions/oauth2Action";
import { showNotification } from "../actions/notificationAction";
import { OAUTH2_ERROR_MESSAGES } from "../constants/oAuth2ErrorConstants";
import LoginSignUp from "../component/User/LoginSignUp";
import { styled } from '@mui/material/styles';

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
  
const OAuth2RedirectHandler = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const errorType = params.get("errorType");
        const encodedToken = params.get("token");
        const encodedUserId = params.get("userId");
        const encodedUserName = params.get("nickname");

        if(errorType){
            setAlertMessage(OAUTH2_ERROR_MESSAGES[errorType] || OAUTH2_ERROR_MESSAGES.GENERIC_ERROR);
            setAlertOpen(true);
            setIsLoading(false);
            return;
        }
        
        const token = encodedToken ? decodeURIComponent(encodedToken) : null;
        const userId = encodedUserId ? decodeURIComponent(encodedUserId) : null;
        const userName = encodedUserName ? decodeURIComponent(encodedUserName) : null;

       
        if (token && userId) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);

            dispatch(handleOAuth2Success(token, userId, userName))
                .then(() => {
                    history.replace("/");
                    
                })
                .catch(() => {
                    setAlertMessage(OAUTH2_ERROR_MESSAGES.GENERIC_ERROR);
                    setAlertOpen(true);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setAlertMessage("Login failed. Required information is missing.");
            setAlertOpen(true);
            setIsLoading(false);
        }
    }, [dispatch, history, location]);

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };
    return (
       <>
    <LoginSignUp /> 
    {isLoading && (
      <LoadingOverlay>
        <CircularProgress />
      </LoadingOverlay>
    )}
    {alertOpen && (
        <StyledAlert severity="error" onClose={handleCloseAlert}>
          {alertMessage}
        </StyledAlert>
      )}
       </>
    
                );
}

export default OAuth2RedirectHandler;