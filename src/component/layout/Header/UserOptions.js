import React, { Fragment, useRef, useContext } from "react";
import "./Header.css";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import useIconsize from "../../../utils/useIconsize";
import { clearError } from "../../../actions/errorAction";

const UserOptions = ({ open, onClose, anchorEl }) => {
  const { user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const navRef = useRef(null);
  const iconSize = useIconsize();
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { message: errorMessage, type: errorType } = useSelector(
    (state) => state.error
  );
  const dashboard = () => {
    history.push("/admin/dashboard");
    onClose();
  };

  const orders = () => {
    history.push("/orders");
    onClose();
  };
  const cart = () => {
    history.push("/cart");
    onClose();
  };
  const account = () => {
    history.push("/account");
    onClose();
  };
  const logoutUser = () => {
    dispatch(logout());
    alert.success("Logout Successfully");
    onClose();
  };

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      onClose(false);
    }
  };

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart`,
      func: cart,
      // count: cartItems.length,
    },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (user?.role === "ADMIN") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  return (
    <Fragment>
      <div className="menu-container">
        <Menu
          anchorEl={anchorEl}
          open={Boolean(open)}
          onClose={onClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {options.map((item) => (
            <MenuItem key={item.name} onClick={item.func}>
              {item.icon}
              {item.name}
              {/* <span className="nav-text">{item.name}</span>
              {item.count > 0 && (
                <span className="cart-length">{item.count}</span>
              )} */}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </Fragment>
  );
};

export default UserOptions;
