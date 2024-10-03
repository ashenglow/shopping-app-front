import React, {useEffect} from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Link,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/system';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../../actions/userAction';
import { showNotification } from '../MUI-comp/MuiNotification/notificationSlice';
import { clearError } from '../../../actions/errorAction';
import { Redirect} from 'react-router-dom';
const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: '#000000',
  color: 'white',
  padding: theme.spacing(4, 0),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 0),
  },
  '& .MuiTypography-root': {
    backgroundColor: 'transparent !important',
    color: 'white',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  '&&.MuiButton-root': {
  border: '1px solid white',
  color: 'white',
  borderRadius: '20px',
  padding: '6px 16px',
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255)',
  }},
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: '4px',
  backgroundColor: 'black !important',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255) !important',
    color: 'black',
    textDecoration: 'none',
  },
}));

const Footer = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { errorMessage } = useSelector((state) => state.error);
const { isAuthenticated } = useSelector((state) => state.user);
  const handleLoginAdmin = () => {
    dispatch(login({ username: "admin", password: "1234" }))
   
  };

  const handleLoginUser = () => {
    dispatch(login({ username: "user2", password: "1234" }));
    
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (errorMessage) {
      dispatch(clearError());
    }

  }, [dispatch, errorMessage]);

  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Quick Login
            </Typography>
            <Box>
              <StyledButton variant="outlined" onClick={handleLoginAdmin}>
                LOGIN AS ADMIN
              </StyledButton>
              <StyledButton variant="outlined" onClick={handleLoginUser}>
                LOGIN AS USER
              </StyledButton>
              <StyledButton variant="outlined" onClick={handleLogout}>
                LOGOUT
              </StyledButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Links
            </Typography>
            <StyledLink href="https://www.notion.so/ashen-glow/portfolio-300405db13254028a02ca9a779b09384?pvs=4" target="_blank">
              <ContactPageIcon sx={{ mr: 1 }} /> Profile Notion
            </StyledLink>
            <StyledLink href="https://www.notion.so/ashen-glow/546d42ae6c224cdbab478c47a6e7e139?pvs=4" target="_blank">
              <SummarizeOutlinedIcon sx={{ mr: 1 }} /> Project Portfolio
            </StyledLink>
            <StyledLink href="https://github.com/ashenglow/shopping-app" target="_blank">
              <GitHubIcon sx={{ mr: 1 }} /> GitHub (Backend)
            </StyledLink>
            <StyledLink href="https://github.com/ashenglow/shopping-app-front" target="_blank">
              <GitHubIcon sx={{ mr: 1 }} /> GitHub (Frontend)
            </StyledLink>
          </Grid>
        </Grid>
        {!isMobile && (
          <Typography variant="body2" align="center" sx={{ mt: 4, color: 'white' }}>
            © 2024 Soolé. All rights reserved.
          </Typography>
        )}
      </Container>
    </StyledFooter>
  );
};

export default Footer;
