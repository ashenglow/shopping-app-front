import { useMemo } from "react";
import { useTheme, useMediaQuery } from "@material-ui/core";

const useResponsiveDesign = () => {
  const theme = useTheme();

  const isXSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmall = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLarge = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isXLarge = useMediaQuery(theme.breakpoints.up("lg"));

  return useMemo(
    () => ({
      iconSize: isXSmall
        ? "1.5rem"
        : isSmall
        ? "2rem"
        : isMedium
        ? "2.5rem"
        : isLarge
        ? "3rem"
        : "3.5rem",
      fontSize: isXSmall
        ? "14px"
        : isSmall
        ? "16px"
        : isMedium
        ? "18px"
        : isLarge
        ? "20px"
        : "22px",
      spacing: isXSmall
        ? "0.5rem"
        : isSmall
        ? "0.75rem"
        : isMedium
        ? "1rem"
        : isLarge
        ? "1.25rem"
        : "1.5rem",
      buttonPadding: isXSmall
        ? "0.5rem 1rem"
        : isSmall
        ? "0.75rem 1.5rem"
        : "1rem 2rem",
      containerMaxWidth: isXSmall
        ? "100%"
        : isSmall
        ? "540px"
        : isMedium
        ? "720px"
        : isLarge
        ? "960px"
        : "1140px",
      headerHeight: isXSmall ? "56px" : isSmall ? "64px" : "72px",
      footerHeight: isXSmall ? "48px" : isSmall ? "56px" : "64px",
    }),
    [isXSmall, isSmall, isMedium, isLarge, isXLarge]
  );
};

export default useResponsiveDesign;