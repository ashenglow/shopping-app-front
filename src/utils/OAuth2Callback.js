import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CircularProgress, Container, Box } from "@mui/material";

export default function OAuth2Callback() {
    const history = useHistory();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const error = params.get("error");
        if (token) {
            localStorage.setItem("token", token);
            history.push("/");
        } else if (error) {
            history.push("/login");
        }
    }, [history]);
    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        </Container>
    );
}