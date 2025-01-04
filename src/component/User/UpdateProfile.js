import React, { Fragment, useState, useEffect } from "react";
import "./UpdateProfile.css";
import Loader from "../layout/Loader/Loader";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import CloseIcon from "@mmui/icons-material/Close";
import {
  Container, 
  Paper,
  TextField,
  Button,
  Avatar,
  Grid,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Dialog,
} from "@mui/material"
import { styled } from '@mui/system';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateProfile, getProfileEdit } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";
import { clearError } from "../../actions/errorAction";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: '40px auto',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  margin: '0 auto 20px',
}));

const StyledForm = styled('form')({
  width: '100%',
});

const UpdateProfile = ({ history, location }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const { message: errorMessage } = useSelector(
    (state) => state.error
  );
  const { isUpdated, loading, profile } = useSelector((state) => state.profile);
  const [formData, setFormData] = useState({
    nickname: "",
    password: "",
    email: "",
    address: {
      zipcode: "",
      address1: "",
      address2: "",
      roadAddress: "",
      jibunAddress: "",
    },
  });
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [addressIframe, setAddressIframe] = useState(null);

  const [initialFormData, setInitialFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  useEffect(() => {
    // Load daum postcode iframe when the component mounts
    const script = document.createElement("script");
    script.src = `//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (errorMessage) {
      alert.error(errorMessage);
      dispatch(clearError());
    }

    if (isUpdated) {
      history.push("/account");
      dispatch({ type: UPDATE_PROFILE_RESET });
      alert.success("Profile Updated Successfully");
    }
  }, [dispatch, alert, errorMessage, history, isUpdated]);

  useEffect(() => {
    if (profile) {
      setFormData({
       ...profile,
        password: "", // don't show existing password
      });
      setAvatarPreview(profile.avatar.url);
    } else {
      dispatch(getProfileEdit());
    }
  }, [profile, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if( name. startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
    
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setFormData( prev => ({
          ...prev,
          address: {
            ...prev.address,
            zipcode: data.zonecode,
            address1: data.roadAddress || data.jibunAddress,
            roadAddress: data.roadAddress,
            jibunAddress: data.jibunAddress,
          },
        }));
        setShowAddressDialog(false);
      }
    }).open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  }

  return (
    <Container>
    <StyledPaper elevation={3}>
      <StyledAvatar src={profile?.userImg || '/default-avatar.png'} />
      <Typography variant="h5" align="center" gutterBottom>
        Update Profile
      </Typography>

      <StyledForm onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="password"
              label="New Password (leave blank to keep current)"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Zipcode"
              name="address.zipcode"
              value={formData.address.zipcode}
              InputProps={{ readOnly: true }}
            />
            <Button 
              variant="outlined" 
              onClick={handleAddressSearch}
              sx={{ mt: 1 }}
            >
              Search Address
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address.address1"
              value={formData.address.address1}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Detailed Address"
              name="address.address2"
              value={formData.address.address2}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Profile'}
            </Button>
          </Grid>
        </Grid>
      </StyledForm>
    </StyledPaper>
  </Container>
  );
};

export default UpdateProfile;
