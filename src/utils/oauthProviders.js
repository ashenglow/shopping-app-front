import GoogleIcon from '@mui/icons-material/Google';

const createOAuthProviders = ( handleOAuth2Login ) => [
    {
        name: "Google",
        Icon: GoogleIcon,
        onClick: () => handleOAuth2Login("google")
    },
    {
        name: "Naver",
        imgSrc: "https://i.ibb.co/cFh62SV/btn-G.png",
        onClick: () => handleOAuth2Login("naver")
    },
    {
        name: "Kakao",
        imgSrc:  "https://i.ibb.co/TLkBZX7/kakaotalk-sharing-btn-small-ov.png",
        onClick: () => handleOAuth2Login("kakao")
    }
]

export default createOAuthProviders;



