import React, { Fragment,  useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { useHistory} from "react-router-dom";
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
import { OAuth2LoginButtonContainer } from "../layout/Buttons/OAuth2Buttons";
import createOAuthProviders from "../../utils/oauthProviders";

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
    address: { 
      zipcode: '', 
      baseAddress: '', 
      detailAddress: '' }
  });
  const oauthProviders = createOAuthProviders(handleOAuth2Login);
 
  useEffect(() => {
   
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

// Add useEffect for loading Daum Postcode script
useEffect(() => {
  const script = document.createElement('script');
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);


// Add handleAddressSearch function
const handleAddressSearch = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      setRegisterUser(prev => ({
        ...prev,
        address: {
          ...prev.address,
          zipcode: data.zonecode,
          baseAddress: data.roadAddress,
          detailAddress: prev.address.detailAddress,
        }
      }));
    }
  }).open();
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
              <OAuth2LoginButtonContainer providers={oauthProviders} />
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
      name="address.zipcode"
      label="Zipcode"
      value={registerUser.address.zipcode}
      InputProps={{ readOnly: true }}
    />
    <Button 
      variant="outlined" 
      onClick={handleAddressSearch}
      sx={{ mt: 1, mb: 2 }}
    >
      Search Address
    </Button>

    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      name="address.baseAddress"
      label="Address"
      value={registerUser.address.baseAddress}
      InputProps={{ readOnly: true }}
    />

    <TextField
      variant="outlined"
      margin="normal"
      fullWidth
      name="address.detailAddress"
      label="Detailed Address"
      value={registerUser.address.detailAddress}
      onChange={handleRegisterChange}
      placeholder="Apartment number, studio, floor, etc.(optional)"
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

