import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import Loader from '../Loader/Loader';


const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  color: theme.palette.text.primary,
  boxShadow: 'none !important',
}));

const Logo = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  textAlign: 'center',
  margin: '0',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Montserrat, sans-serif',
  letterSpacing: '-0.02em',
  fontSize: '2rem !important',
  color: '#333333',
  margin: '0',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.5rem',
  },
}));


const LogoSubtext = styled(Typography)(({ theme }) => ({
  fontFamily: 'Open Sans, sans-serif',
  fontWeight: 200,
  fontSize: '0.875rem',
  color: '#8b6d43',
  letterSpacing: '0.05em',
  margin: '0',
  [theme.breakpoints.down('md')]: {
    fontSize: '0.75rem',
  },
}));

const NavIcons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
}));

const Header = ({initialized}) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Products', path: '/products' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' },
  ];
 if (!initialized) {
    return <Skeleton variant="rectangular" height={64} />
  }
  

  return (
    <StyledAppBar position="static" elevation={1}>
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Logo to="/">
          <LogoText variant="h1">Soolé</LogoText>
          
        </Logo>
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {menuItems.map((item) => (
              <StyledLink
                key={item.text}
                to={item.path}
                sx={{
                  mx: 2,
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                }}
              >
                {item.text}
              </StyledLink>
            ))}
          </Box>
        )}
        <NavIcons>
          <IconButton color="inherit" component={Link} to="/">
            <HomeIcon />
          </IconButton>
          {isAuthenticated && (
             <IconButton color="inherit" component={Link} to="/cart">
             <ShoppingCartIcon />
           </IconButton>
          )}
         
          <IconButton
            color="inherit"
            component={Link}
            to={isAuthenticated ? '/account' : '/login'}
          >
            {isAuthenticated ? <PersonIcon /> : <LoginIcon />}
           
          </IconButton>
        </NavIcons>
      </Toolbar>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              onClick={toggleDrawer}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </StyledAppBar>
  );
};

export default Header;