import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, CircularProgress, Alert } from "@mui/material";
import { Styledcontainer } from "../component/layout/MUI-comp/MuiStyles"; 
import { handleOAuth2Success } from "../actions/oauth2Action";
import { showNotification } from "../actions/notificationAction";
import { OAUTH2_ERROR_MESSAGES } from "../constants/oAuth2ErrorConstants";
import AddressCollection from "../component/layout/User/AddressCollection";
import { styled } from '@mui/material/styles';
import { setError } from "../actions/errorAction";



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
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [oAuth2UserData, setOAuth2UserData] = useState(null);

   const onAddressSubmitted = async () => {
    if(!oAuth2UserData) return;
try {
  await dispatch(handleOAuth2Success(oAuth2UserData));
  history.push('/');
} catch (error) {
  setAlertMessage("Failed to complete registration")
  setAlertOpen(true);
}
  };
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const errorType = params.get("errorType");
      const token = params.get("token") ? decodeURIComponent(params.get("token")) : null;
      const userId = params.get("userId") ? decodeURIComponent(params.get("userId")) : null;
      const nickname = params.get("nickname") ? decodeURIComponent(params.get("nickname")) : null;
      const isNewUser = params.get("isNewUser") === "true";

        if(errorType){
            setAlertMessage(OAUTH2_ERROR_MESSAGES[errorType] || OAUTH2_ERROR_MESSAGES.GENERIC_ERROR);
            setAlertOpen(true);
            setIsLoading(false);
            return;
        }

        if(!token || !userId){
          setAlertMessage("Login failed. Required information is missing.");
          setAlertOpen(true);
          setIsLoading(false);
          return;
        }

         // Store token immediately for subsequent requests
         localStorage.setItem("accessToken", token);
         localStorage.setItem("userId", userId);
          localStorage.setItem("nickname", nickname);

        if(isNewUser){
          setOAuth2UserData({
            accessToken: token, userId, nickname
          });
          setShowAddressForm(true);
          setIsLoading(false);
          
        }else {
         dispatch(handleOAuth2Success({
          accessToken: token,
                userId,
                nickname
         }))
         .then(() => {
          history.push("/")})
         .catch((error) => {
           setAlertMessage("OAuth2 login failed.")
           setAlertOpen(true);
         })
         .finally(() => {
           setIsLoading(false);
         });
        }
   
   }, [dispatch, history]);

  
    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    if (showAddressForm && oAuth2UserData) {
      return <AddressCollection
      oAuthUserData={oAuth2UserData}
      onSubmitComplete={onAddressSubmitted}
       />;
    }
    return (
       <>
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