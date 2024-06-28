import React from "react";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import { useHistory } from "react-router-dom";
import useIconsize from "../../../utils/useIconsize";
import logo from "../../../images/logo.png";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import UserOptions from "./UserOptions";
import NavBar from "./NavBar";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const history = useHistory();
  const iconSize = useIconsize();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOptionsOpen, setUserOptionsOpen] = useState(false);
  const userOptionsButtonRef = useRef(null);

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleUserOptions = () => {
    setUserOptionsOpen(!userOptionsOpen);
  };

  const handleUserOptionsOpen = () => {
    setUserOptionsOpen(true);
  };

  const handleUserOptionsClose = () => {
    setUserOptionsOpen(false);
  };

  return (
    <>
      <div className="menuBox">
        <div className="leftButtons">
          <IconButton onClick={() => history.push("/")} className="homeIconBtn">
            <HomeIcon sx={{ fontSize: iconSize }} className="homeIcon" />
          </IconButton>
          <div
            className="icon-button-container"
            onMouseEnter={handleMenuOpen}
            onMouseLeave={handleMenuClose}
          >
            <IconButton className="navbarIconBtn">
              <MenuIcon sx={{ fontSize: iconSize }} />
            </IconButton>
            <NavBar open={menuOpen} onClose={setMenuOpen} />
          </div>
        </div>
        <div className="rightButtons">
          {isAuthenticated === true ? (
            <div className="icon-button-container" onClick={handleUserOptions}>
              <IconButton className="userOptionsBtn" ref={userOptionsButtonRef}>
                <AccountCircleIcon sx={{ fontSize: iconSize }} />
              </IconButton>
              <UserOptions
                open={userOptionsOpen}
                onClose={setUserOptionsOpen}
                anchorEl={userOptionsButtonRef.current}
              />
            </div>
          ) : (
            <IconButton
              className="loginIconBtn"
              onClick={() => history.push("/login")}
            >
              <LoginIcon sx={{ fontSize: iconSize }} />
            </IconButton>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
