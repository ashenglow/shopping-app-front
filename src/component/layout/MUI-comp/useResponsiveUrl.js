import { useMemo } from "react";
import useResponsiveDesign from "../../../hooks/useResponsiveDesign";
const useResponsiveUrl = (urls) => {
    const { isXSmall, isSmall } = useResponsiveDesign();
    
    const responsiveUrl = useMemo(() =>{
        if (!urls) return null;
        if(isXSmall || isSmall){
            return urls.mobile || urls.default;
        } else if(navigator.userAgent.match(/Android/i)){
            return urls.app || urls.default;
        } else if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){
            return urls.app || urls.default;
        } else {
            return urls.pc || urls.default;
        }
    }, [isXSmall, isSmall, urls]);
   
    return responsiveUrl;
};

export default useResponsiveUrl;