import React, { Fragment,  useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { useHistory, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from '@mui/material/styles';
import { login, register, loginForTestAdmin, loginForTestUser } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { clearError } from "../../actions/errorAction";
import {
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  IconButton
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useScrollToTopHistory } from '../../hooks/useScrollToTopHistory';
import { margin, styled } from '@mui/system';
import { StyledPaper, StyledButton, StyledForm, StyledAvatar, StyledButtonContainer,
  StyledOutlinedButton, StyledDivider,
  OAuthButtonContainer
 } from "../layout/MUI-comp/MuiStyles";
import { handleOAuth2Success } from "../../actions/oauth2Action";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";



const LoginSignUp = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigateAndScrollToTop = useScrollToTopHistory();
  const handleLoginAdmin = () => {
    dispatch(loginForTestAdmin())
    .then(() => navigateAndScrollToTop("/"))
  };

  const handleLoginUser = () => {
    dispatch(loginForTestUser())
    .then(() => navigateAndScrollToTop("/"))
    
  };

  const handleOAuth2Login = async (provider) => {
    try{
      //redirect to the authorization URL
      window.location.href = `${process.env.REACT_APP_API_URL}/oauth2/authorization/${provider}`;
    } catch (error) {
      console.log("OAuth2 login failed: ", error);
    }
  }

  const alert = useAlert();
  const history = useHistory();
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { message: errorMessage } = useSelector((state) => state.error);
  const [tabValue, setTabValue] = useState(0);
  const [loginUser, setLoginUser] = useState({ userId: '', password: '' });
  const [registerUser, setRegisterUser] = useState({
    userId: '',
    nickname: '',
    password: '',
    email: '',
    address: { city: '', street: '', zipcode: '' }
  });

  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if(token){
      dispatch(handleOAuth2Success(token));
      history.push('/');
      return;
    }
    if (errorMessage) {
      alert.error(errorMessage);
      dispatch(clearError());
    }
    if (isAuthenticated) {
      history.push(tabValue === 0 ? '/account' : '/');
    }
  }, [dispatch, alert, history, errorMessage, isAuthenticated, tabValue]);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginUser));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    dispatch(register(registerUser));
  };

  const handleLoginChange = (e) => {
    setLoginUser({ ...loginUser, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    if (e.target.name.includes('.')) {
      const [parent, child] = e.target.name.split('.');
      setRegisterUser({
        ...registerUser,
        [parent]: { ...registerUser[parent], [child]: e.target.value }
      });
    } else {
      setRegisterUser({ ...registerUser, [e.target.name]: e.target.value });
    }
  };


  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <StyledAvatar>
          <LockOutlinedIcon />
        </StyledAvatar>
        <Typography component="h1" variant="h5">
          {tabValue === 0 ? 'Sign In' : 'Sign Up'}
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        {tabValue === 0 && (
          <StyledForm onSubmit={handleLoginSubmit}>
           <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="userId"
              label="UserId"
              name="userId"
              autoComplete="userId"
              autoFocus
              value={loginUser.userId}
              onChange={handleLoginChange}
            />
          
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={loginUser.password}
              onChange={handleLoginChange}
            />
       
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </StyledButton>

            <StyledDivider>or</StyledDivider>

            <OAuthButtonContainer>
              <IconButton onClick={() => handleOAuth2Login('google')}
                size="large">
                <GoogleIcon />
              </IconButton>
            </OAuthButtonContainer>

          </StyledForm>
        )}
        {tabValue === 1 && (
          <StyledForm onSubmit={handleRegisterSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="userId"
              label="UserId"
              name="userId"
              autoComplete="userId"
              autoFocus
              value={registerUser.userId}
              onChange={handleRegisterChange}
            />
             <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="nickname"
              label="Nickname"
              name="nickname"
              autoComplete="nickname"
              autoFocus
              value={registerUser.nickname}
              onChange={handleRegisterChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={registerUser.password}
              onChange={handleRegisterChange}
            />

             <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={registerUser.email}
              onChange={handleRegisterChange}
            />
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="address.city"
              label="City"
              value={registerUser.address.city}
              onChange={handleRegisterChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="address.street"
              label="Street"
              value={registerUser.address.street}
              onChange={handleRegisterChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="address.zipcode"
              label="Zipcode"
              value={registerUser.address.zipcode}
              onChange={handleRegisterChange}
            />
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
    
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
           </StyledButton>
          </StyledForm>
        )}
      </StyledPaper>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StyledOutlinedButton onClick={handleLoginAdmin}>
                LOGIN AS ADMIN
              </StyledOutlinedButton>
              <StyledOutlinedButton onClick={handleLoginUser}>
                LOGIN AS USER
              </StyledOutlinedButton>
              </Box>
    </Container>
  );
};


export default LoginSignUp;
