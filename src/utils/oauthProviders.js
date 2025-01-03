import GoogleIcon from '@mui/icons-material/Google';
import { handleOAuth2Login } from "./oauth2";
const createOAuthProviders = ( handleOAuth2Login ) => [
    {
        name: "google",
        icon: GoogleIcon,
        onclick: () => handleOAuth2Login("google")
    },
    {
        name: "Naver",
        imgUrl: "https://i.ibb.co/cFh62SV/btn-G.png",
        onclick: () => handleOAuth2Login("naver")
    },
    {
        name: "Kakao",
        imgUrl:  "https://i.ibb.co/TLkBZX7/kakaotalk-sharing-btn-small-ov.png",
        onclick: () => handleOAuth2Login("kakao")
    }
]

export default createOAuthProviders;