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
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>ECOMMERCE.</h1>
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
        <h4>Follow Us</h4>
        <a href="http://instagram.com/meabhisingh">Instagram</a>
        <a href="http://youtube.com/6packprogramemr">Youtube</a>
        <a href="http://instagram.com/meabhisingh">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
