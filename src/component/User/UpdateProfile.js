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
import { clearError } from "../../actions/errorAction";

const UpdateProfile = ({ history, location }) => {
  const dispatch = useDispatch();
  const alert = useAlert();


  const { message: errorMessage, type: errorType } = useSelector(
    (state) => state.error
  );
  const { isUpdated, loading, profile } = useSelector((state) => state.profile);
  const [formData, setFormData] = useState({
    id: null,
    password: "",
    address: {
      city: "",
      street: "",
      zipcode: "",
    },
    username: "",
  });
  const [initialFormData, setInitialFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["city", "street", "zipcode"].includes(name)) {
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const updateProfileSubmit = (e) => {
    e.preventDefault();
    const changedData = {};
    Object.keys(formData).forEach((key) => {
      if (key === "address") {
        changedData.address = {};
        Object.keys(formData.address).forEach((addressKey) => {
          if (
            formData.address[addressKey] !== initialFormData.address[addressKey]
          ) {
            changedData.address[addressKey] = formData.address[addressKey];
          }
        });
        if (Object.keys(changedData.address).length === 0) {
          delete changedData.address;
        }
      } else if (formData[key] !== initialFormData[key]) {
        changedData[key] = formData[key];
      }
    });
    if (Object.keys(changedData).length > 0) {
      dispatch(updateProfile({ id: formData.id, ...changedData }));
    } else {
      alert.info("No changes detected");
    }
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

    if (!profile ) {
      dispatch(getProfileEdit());
    } else {
      const newFormData = {
        id: null,
        username: profile.username,
        password: "",
        address: {
          city: profile.address?.city || "",
          street: profile.address?.street || "",
          zipcode: profile.address?.zipcode || "",
        },
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
    }
    if (isUpdated) {
      alert.success("Profile Updated Successfully");
      history.push("/account");
      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }
  }, [dispatch, alert, errorMessage, history, profile, isUpdated]);

  return (
    <div className="container">
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
                    placeholder="Username"
                    required
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="updateProfilePassword">
                  <input
                    type="password"
                    placeholder="New Password (leave blank to keep current)"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="updateProfileCity">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="City"
                    required
                    name="city"
                    value={formData.address.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="updateProfileStreet">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Street"
                    required
                    name="street"
                    value={formData.address.street}
                    onChange={handleChange}
                  />
                </div>

                <div className="updateProfileZipcode">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Zipcode"
                    required
                    name="zipcode"
                    value={formData.address.zipcode}
                    onChange={handleChange}
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
    </div>
  );
};

export default UpdateProfile;
