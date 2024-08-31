import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";
import { login, logout } from "../../../actions/userAction";
import { useDispatch } from "react-redux";

const Footer = () => {
  const dispatch = useDispatch();
  const handleLoginAdmin = () => {
    const adminForm = {
      username: "admin",
      password: "1234",
    };
    dispatch(login(adminForm));
  };

  const handleLoginUser = () => {
    const userForm = {
      username: "user2",
      password: "1234",
    };
    dispatch(login(userForm));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>Go to profile</h4>
        {/* <p>Go to profile</p> */}
        <a href="https://www.notion.so/ashen-glow/portfolio-300405db13254028a02ca9a779b09384?pvs=4">
          Profile Notion
        </a>
        {/* <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" /> */}
      </div>

      <div className="midFooter">
        <h1></h1>
        <div>
          <button onClick={handleLoginAdmin}>
            Login as<br></br>Admin
          </button>
          <button onClick={handleLoginUser}>
            Login as<br></br>User
          </button>
        </div>
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
        {/* <p>High Quality is our first priority</p>

        <p>Copyrights 2021 &copy; MeAbhiSingh</p> */}
      </div>

      <div className="rightFooter">
        <h4>Link</h4>
        <a href="https://www.notion.so/ashen-glow/546d42ae6c224cdbab478c47a6e7e139?pvs=4">
          Project Notion
        </a>
        <a href="https://github.com/ashenglow/shopping-app">
          Github&#40;Back&#41;
        </a>
        <a href="https://github.com/ashenglow/shopping-app-front">
          Github&#40;Front&#41;
        </a>
      </div>
    </footer>
  );
};

export default Footer;
