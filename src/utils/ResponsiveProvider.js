import { useEffect } from "react";
import useResponsiveDesign from "./useResponsiveDesign";

const ResponsiveProvider = ({ children }) => {
  const responsive = useResponsiveDesign();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--icon-size", responsive.iconSize);
    root.style.setProperty("--font-size", responsive.fontSize);
    root.style.setProperty("--spacing", responsive.spacing);
    root.style.setProperty("--button-padding", responsive.buttonPadding);
    // root.style.setProperty(
    //   "--container-max-width",
    //   responsive.containerMaxWidth
    // );
    root.style.setProperty("--header-height", responsive.headerHeight);
    root.style.setProperty("--footer-height", responsive.footerHeight);
  }, [responsive]);

  return <>{children}</>;
};

export default ResponsiveProvider;