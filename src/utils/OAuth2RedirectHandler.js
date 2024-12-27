import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Styledcontainer } from "../component/layout/MUI-comp/MuiStyles"; 
import { handleOAuth2Success } from "../actions/oauth2Action";

const OAuth2RedirectHandler = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        const handleOAuth2Redirect = async () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const userId = params.get("userId");
        const userName = params.get("nickname");
        const error = params.get("error");

        if (token) {
            try{
                await dispatch(handleOAuth2Success(token, userId, userName));
                history.push("/");     
            }
            catch(error){
                console.error("OAuth2 handling failed: ", error);
                history.push("/login");
            }
        } else if (error) {
           console.error("OAuth2 error: ", error);
            history.push("/login");
        }
    };

    handleOAuth2Redirect();
    }, [history]);
    return (
        <Styledcontainer>
            <CircularProgress />
        </Styledcontainer>
    
                );
}

export default OAuth2RedirectHandler;