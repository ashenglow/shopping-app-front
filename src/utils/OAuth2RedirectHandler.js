import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import { Styledcontainer } from "../component/layout/MUI-comp/MuiStyles"; 
import { handleOAuth2Success } from "../actions/oauth2Action";

const OAuth2RedirectHandler = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleOAuth2Redirect = async () => {
            const hash = window.location.hash;
            if (hash.includes("oauth2/callback")) {
                const params = new URLSearchParams(hash.split("?")[1]); 
                const token = params.get("token");
                const userId = params.get("userId");
                const userName = params.get("nickname");
                if (token && userId && userName) {
                    await dispatch(handleOAuth2Success(token, userId, userName));
                    window.location.href = "/";
                }
                
            }
    };

    handleOAuth2Redirect();
    }, [dispatch]);
    return (
        <Styledcontainer>
            <CircularProgress />
        </Styledcontainer>
    
                );
}

export default OAuth2RedirectHandler;