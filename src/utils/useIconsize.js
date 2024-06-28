import { useMediaQuery, useTheme } from "@mui/material";
const useIconsize = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("xs", "md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  if (isSmallScreen) {
    return "3vmax";
  } else if (isMediumScreen) {
    return "3.5vmax";
  } else if (isLargeScreen) {
    return "4vmax";
  } else {
    return "3vmax";
  }
};

export default useIconsize;
