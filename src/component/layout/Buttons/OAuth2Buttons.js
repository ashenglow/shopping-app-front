import { IconButton, Box, useTheme } from "@mui/material";
import { styled } from "@mui/styles";
import React from "react";
import { StyledTooltip } from "../MUI-comp/MuiStyles";

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
    if(providerName === "Naver"){
      return (
        <StyledTooltip
        title="네이버 정책에 따라 개발 환경에서는 미리 등록된 테스트 계정만 접근할 수 있습니다."
        placement="top"
        arrow
        >
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
      </StyledTooltip>
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


