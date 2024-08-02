import React, { Fragment, useState, useEffect } from "react";
import "./UpdateProfile.css";
import Loader from "../layout/Loader/Loader";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, getProfileEdit } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";
import { useUserInfo } from "../../utils/userContext";
import { clearError } from "../../actions/errorActions";

const UpdateProfile = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const userInfo = useUserInfo();
  const { message: errorMessage, type: errorType } = useSelector(
    (state) => state.error
  );
  const { isUpdated, loading, profile } = useSelector((state) => state.profile);
  const [id, setId] = useState(userInfo.id);
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState({
    city: "",
    street: "",
    zipcode: "",
  });
  const [username, setUsername] = useState(userInfo.name);
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const updateAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const updateProfileSubmit = (e) => {
    e.preventDefault();
    const formData = {
      id,
      username,
      password,
      address,
    };
    // myForm.set("avatar", avatar);
    dispatch(updateProfile(formData));
  };

  // const updateProfileDataChange = (e) => {
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     if (reader.readyState === 2) {
  //       setAvatarPreview(reader.result);
  //       setAvatar(reader.result);
  //     }
  //   };

  //   reader.readAsDataURL(e.target.files[0]);
  // };
  useEffect(() => {
    if (errorMessage) {
      alert.error(errorMessage);
      dispatch(clearError());
    }
  }, [dispatch, errorMessage, alert]);

  useEffect(() => {
    if (profile) {
      setId(profile.id);
      setUsername(profile.name);
      setPassword(profile.password);
      setAddress(profile.address);
    }

    if (isUpdated) {
      alert.success("Profile Updated Successfully");
      history.push("/account");

      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }
  }, [dispatch, alert, history, profile, isUpdated]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Profile" />
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>

              <form
                className="updateProfileForm"
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder={username}
                    required
                    disabled
                    name="username"
                    value={username}
                  />
                </div>
                <div className="updateProfilePassword">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="updateProfileCity">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="City"
                    required
                    name="city"
                    value={address.city}
                    onChange={updateAddressChange}
                  />
                </div>

                <div className="updateProfileStreet">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Street"
                    required
                    name="street"
                    value={address.street}
                    onChange={updateAddressChange}
                  />
                </div>

                <div className="updateProfileZipcode">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Zipcode"
                    required
                    name="zipcode"
                    value={address.zipcode}
                    onChange={updateAddressChange}
                  />
                </div>
                {/* <div id="updateProfileImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div> */}
                <input
                  type="submit"
                  value="Update"
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateProfile;
