import { Button } from "@mui/material"
import { IconButton } from "@mui/material";

const OAuthIconButton = ({ onClick, imgUrl, alt, providerName, Icon}) => {
    if(Icon) {
        return (
            <IconButton
            onClick={onClick}
            size="large"
            aria-label={`Login with ${providerName}`}
            className="mx-2"
            >
                <Icon />
            </IconButton>
        )
    }
    
    
    return (
        <Button
        onClick={onClick}
        className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity duration-200 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mx-2"
        type="button"
        area-label={`Login with ${providerName}`}
        >
         <img
         src={imgUrl}
         alt={alt || `${providerName} Login`}
         className="w-6 h-6 object-contain"
         />       
        </Button>
    )
}

export const OAuth2LoginButtonContainer = ({providers}) => {
    // { name: string, imgUrl: string, onClick: function, alt?: string }
    return (
       <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
        {providers.map((provider) => (
            <OAuthIconButton 
            key={provider.name}
            onClick={provider.onClick}
            imgUrl={provider.imgUrl}
            alt={provider.alt}
            providerName={provider.name}
            />
        ))}

        </div>     
    )
}

