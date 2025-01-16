import { LOGIN_SUCCESS, LOGIN_FAIL } from "../constants/userConstants";
import { showNotification } from "./notificationAction";
import { setError } from "./errorAction";

export const handleOAuth2Success = (oAuth2UserData) => async (dispatch) => {
    const token = oAuth2UserData.accessToken;
    const userId = oAuth2UserData.userId;
    const nickname = oAuth2UserData.nickname;

    try{
        await dispatch({ 
            type: LOGIN_SUCCESS, 
            payload:{
                isAuthenticated: true,
                loading: false,
                accessToken: token,
                userId,
                nickname: nickname,
                role: 'USER'
            } 
        });

        dispatch(showNotification("Login Successful", "success" ));
        return Promise.resolve();
        
    }catch(error){
        dispatch({ 
            type: LOGIN_FAIL, 
            payload: error.message ||"OAuth2 login failed" });
        dispatch(setError("OAuth2 login failed", LOGIN_FAIL));
        dispatch(showNotification("OAuth2 login failed", "error" ));
            return Promise.reject(error);
}
};