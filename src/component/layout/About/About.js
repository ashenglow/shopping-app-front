import React from 'react';
import { useDispatch } from 'react-redux';
import { loginForTestAdmin, loginForTestUser } from '../../../actions/userAction';
import { useTheme } from '@mui/material/styles';
import { useScrollToTopHistory } from '../../../hooks/useScrollToTopHistory';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Button,
  Avatar, 
  Link
} from '@mui/material';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import { margin, styled } from '@mui/system';
const StyledButton = styled(Button)(({ theme }) => ({
  '&&.MuiButton-root': {
  border: '1px solid black',
  color: 'white',
  backgroundColor: 'black',
  borderRadius: '20px',
  padding: '6px 16px',
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255)',
  }},
}));

const About = () => {
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
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h2" gutterBottom align="center">
        About
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              About This Site
            </Typography>
            <Typography variant="body1" paragraph>
              이 웹사이트는 포트폴리오 및 이력서 목적으로 제작되었습니다. 
              방문자 여러분께서는 회원가입 없이 빠르게 로그인하실 수 있도록 
              Footer나 아래에 있는 버튼을 이용해 주세요. 
            </Typography>
            <Box>
            <StyledButton variant="outlined" onClick={handleLoginAdmin}>
                LOGIN AS ADMIN
              </StyledButton>
              <StyledButton variant="outlined" onClick={handleLoginUser}>
                LOGIN AS USER
              </StyledButton>
              </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              About Me
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                alt="about"
                src="https://placehold.co/600x400?text=Profile\nImage"
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h5">DH</Typography>
              <Typography variant="body1">
                Web Developer
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              This is a website made by DH. I'm passionate about creating 
              efficient and user-friendly web applications.
            </Typography>
            <Box>
              <Typography variant="h6" gutterBottom>
                Links
              </Typography>
              <Link href="https://drive.google.com/file/d/1jfIAWJ3ME70EGwBB73TYdKByHiaOJu3Q/view?usp=sharing" target="_blank" display="flex" alignItems="center" sx={{ mb: 1 }}>
                <ContactPageIcon sx={{ mr: 1 }} /> PDF 이력서
              </Link>
              <Link href="https://ashen-glow.notion.site/546d42ae6c224cdbab478c47a6e7e139?pvs=4" target="_blank" display="flex" alignItems="center" sx={{ mb: 1 }}>
                <SummarizeOutlinedIcon sx={{ mr: 1 }} /> 프로젝트 포트폴리오 노션
              </Link>
              <Link href="https://github.com/ashenglow/shopping-app" target="_blank" display="flex" alignItems="center" sx={{ mb: 1 }}>
                <GitHubIcon sx={{ mr: 1 }} /> GitHub (Backend)
              </Link>
              <Link href="https://github.com/ashenglow/shopping-app-front" target="_blank" display="flex" alignItems="center" sx={{ mb: 1 }}>
                <GitHubIcon sx={{ mr: 1 }} /> GitHub (Frontend)
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;