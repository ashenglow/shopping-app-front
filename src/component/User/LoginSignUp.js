import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { useHistory, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../../actions/userAction";
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
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled } from '@mui/system';


const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { message: errorMessage } = useSelector((state) => state.error);
  const [tabValue, setTabValue] = useState(0);
  const [loginUser, setLoginUser] = useState({ username: '', password: '' });
  const [registerUser, setRegisterUser] = useState({
    username: '',
    password: '',
    address: { city: '', street: '', zipcode: '' }
  });

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


  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper>
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
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={loginUser.username}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </StyledForm>
        )}
        {tabValue === 1 && (
          <StyledForm onSubmit={handleRegisterSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={registerUser.username}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
          </StyledForm>
        )}
      </StyledPaper>
    </Container>
  );
};


export default LoginSignUp;
