import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import { Styledcontainer } from "../component/layout/MUI-comp/MuiStyles"; 
import { handleOAuth2Success } from "../actions/oauth2Action";

const OAuth2RedirectHandler = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
            const hash = window.location.hash;
            if (hash.includes("oauth2/callback")) {
                const params = new URLSearchParams(hash.split("?")[1]); 
                
                const token = params.get("token");
                const userId = params.get("userId");
                const userName = params.get("nickname");

                if (token && userId) {
                  dispatch(handleOAuth2Success(token, userId, userName))
                  .then(() => {
                      window.history.replaceState(null, null, "/");
                      history.replace("/");
                  })
                  .catch((error) => {
                      console.log(error);
                      history.replace("/login");
                  });
                }else{
                    history.replace("/login");
                }
                
            }
   


    }, [dispatch, history]);
    return (
        <Styledcontainer>
            <CircularProgress />
        </Styledcontainer>
    
                );
}

export default OAuth2RedirectHandler;