import React from 'react';
import { Container } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import useResponsiveDesign from './useResponsiveDesign';

const ResponsiveContainer = ({ children, ...props }) => {
    const theme = useTheme();
    const responsive = useResponsiveDesign();
  
    const isXSmall = useMediaQuery(theme.breakpoints.down('xs'));
    const isSmall = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
    const isMedium = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLarge = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
    let maxWidth = 'lg'; // Default to 'lg' for XLarge screens
  
    if (isXSmall) maxWidth = 'xs';
    else if (isSmall) maxWidth = 'sm';
    else if (isMedium) maxWidth = 'md';
    else if (isLarge) maxWidth = 'lg';
  
    return (
      <Container 
        maxWidth={maxWidth} 
        sx={{ 
          paddingLeft: responsive.spacing,
          paddingRight: responsive.spacing,
        }}
        {...props}
      >
        {children}
      </Container>
    );
  };

export default ResponsiveContainer;