import React from "react";
import useResponsiveDesign from "../../../hooks/useResponsiveDesign";
import { is } from "core-js/core/object";

const ResponsiveUrlOpener = ({ urls, onOpen, 
    windowFeatures = 'width=800,height=600', children }) => {
        const { isXSmall, isSmall } = useResponsiveDesign();

        const openUrl = () => {
            if(onOpen){
                onOpen();
            }
        }

        let url;
        if (isXSmall || isSmall) {
            url = urls.mobile || urls.default;
        } else if(navigator.userAgent.match(/Android/i)){
            url = urls.app || urls.default;
        } else if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){
            url = urls.app || urls.default;
        } else {
            url = urls.pc || urls.default;
        }

        if(isXSmall || isSmall){
            window.location.href = url;
        } else {
            window.open(url, "_blank", windowFeatures);
        }
        
        return (
            <div onClick={openUrl}>
                {children}
            </div>
        )
    
}

export default ResponsiveUrlOpener