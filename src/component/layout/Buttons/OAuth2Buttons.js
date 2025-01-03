import { IconButton, Box, useTheme } from "@mui/material";
import { styled } from "@mui/styles";
import React from "react";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    padding: '12px',
    '& img': {
      width: '24px',
      height: '24px',
      objectFit: 'contain'
    }
  }));
  const ButtonContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2)
  }));
const OAuthIconButton = ({ onClick, imgSrc, alt, providerName, Icon}) => {
    if(Icon) {
        return (
            <StyledIconButton 
        onClick={onClick}
        size="large"
        aria-label={`Login with ${providerName}`}
      >
        <Icon />
      </StyledIconButton>
        )
    }
    
    
    return (
        <StyledIconButton
        onClick={onClick}
        size="large"
        aria-label={`Login with ${providerName}`}
      >
        <img 
          src={imgSrc} 
          alt={alt || `${providerName} login`}
        />
      </StyledIconButton>
    )
}

export const OAuth2LoginButtonContainer = ({providers = []}) => {
    const theme = useTheme();
    // { name: string, imgSrc: string, onClick: function, alt?: string }
    if (!Array.isArray(providers)) {
        console.warn('OAuth2ButtonContainer: providers prop must be an array');
        return null;
      }
    
      return (
        <ButtonContainer>
          {providers.map((provider, index) => (
            <OAuthIconButton
              key={provider.name || index}
              onClick={provider.onClick}
              imgSrc={provider.imgSrc}
              alt={provider.alt}
              providerName={provider.name}
              Icon={provider.Icon}
            />
          ))}
        </ButtonContainer>
      );
}


