import { LOGIN_SUCCESS, LOGIN_FAIL } from "../constants/userConstants";
import { showNotification } from "./notificationAction";
import { setError } from "./errorAction";

export const handleOAuth2Success = (token, userId, userName) => (dispatch) => {
    try{
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);

        dispatch({ 
            type: LOGIN_SUCCESS, 
            payload:{
                accessToken: token,
                role: 'USER'
            } 
        });
        dispatch(showNotification("Login Successful", "success" ));
        return Promise.resolve();
        
    }catch(error){
        dispatch(setError("OAuth2 login failed", LOGIN_FAIL));
        return Promise.reject(error);
}
};