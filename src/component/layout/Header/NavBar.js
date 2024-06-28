import React, { useState, useRef, Fragment, useEffect } from "react";
import "./NavBar.css";
import { Link, useHistory } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import logo from "../../../images/logo.png";

const Navbar = ({ open, onClose }) => {
  const history = useHistory();
  const navRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      onClose(false);
    }
  };
  return (
    <Fragment>
      <div
        ref={navRef}
        className={`nav-container ${open ? "nav-open" : "nav-closed"}`}
        onMouseEnter={() => onClose(true)}
        onMouseLeave={() => onClose(false)}
      >
        <div className="nav nav1">
          <img
            className="logoReactNavbar"
            src={logo}
            alt="Logo"
            onClick={() => history.push("/")}
          />
        </div>
        <div className="nav nav2">
          <a href="/" className="nav-link">
            Home
          </a>
          <a href="/products" className="nav-link">
            Products
          </a>
        </div>
        <div className="nav nav3">
          <a href="/contact" className="nav-link">
            Contact
          </a>
          <a href="/about" className="nav-link">
            About
          </a>
        </div>
        <div className="nav nav4">
          <IconButton className="search-icon">
            <SearchIcon />
          </IconButton>
        </div>
      </div>
    </Fragment>
  );
};

export default Navbar;
