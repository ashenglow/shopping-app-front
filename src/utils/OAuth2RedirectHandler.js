import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import { Styledcontainer } from "../component/layout/MUI-comp/MuiStyles"; 
import { handleOAuth2Success } from "../actions/oauth2Action";

const OAuth2RedirectHandler = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const userId = params.get("userId");
        const userName = params.get("nickname");

        if (token && userId) {
            dispatch(handleOAuth2Success(token, userId, userName))
                .then(() => {
                    history.replace("/");
                })
                .catch((error) => {
                    console.error(error);
                    history.replace("/login");
                });
        } else {
            history.replace("/login");
        }
    }, [dispatch, history, location]);
    return (
        <Styledcontainer>
            <CircularProgress />
        </Styledcontainer>
    
                );
}

export default OAuth2RedirectHandler;