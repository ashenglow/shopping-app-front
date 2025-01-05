import React, { Fragment, useState, useEffect } from "react";
import "./UpdateProfile.css";
import Loader from "../layout/Loader/Loader";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import CloseIcon from "@mui/icons-material/Close";
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

const UpdateProfile = ({  location }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const { message: errorMessage } = useSelector(
    (state) => state.error
  );
  const { isUpdated, loading, profile } = useSelector((state) => state.profile);

  // Track which fields have been modified by the user
  const [modifiedFields, setModifiedFields] = useState({
    nickname: false,
    password: false,
    email: false,
    address: {
      detailAddress: false
    }
  });
  const [formData, setFormData] = useState({
    userId:"",
    nickname: "",
    password: "",
    email: "",
    address: {
      zipcode: "",
      baseAddress: "",
      detailAddress: "",
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
    dispatch(getProfileEdit());
  }, []);

  useEffect(() => {
    if (profile) {
      console.log('Setting form data with profile:', profile);
      setFormData({
        nickname: profile.nickname || '',
        email: profile.email || '',
        userId: profile.userId || '',
        password: '',
        address: {
          zipcode: profile.address?.zipcode || '',
          baseAddress: profile.address?.baseAddress || '',
          detailAddress: profile.address?.detailAddress || '',
        }
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if( name. startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
      setModifiedFields(prev => ({
         ...prev, 
         address: {
          ...prev.address,
          [addressField]: true
         } }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setModifiedFields(prev => ({
        ...prev,
        [name]: true
      }))
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
            baseAddress: data.roadAddress,
            detailAddress: prev.address.detailAddress,
          },
        }));
        setModifiedFields(prev => ({
          ...prev,
          address: {
            ...prev.address,
            zipcode: true,
            baseAddress: true,
          }
        }))
      }
    }).open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateData = {
      userId: profile.userId,
    }

    // Only include modified fields
    if (modifiedFields.nickname) updateData.nickname = formData.nickname || profile.nickname;
    if (modifiedFields.email) updateData.email = formData.email || profile.email;
    if (formData.password.trim()) updateData.password = formData.password;

 // Handle address updates
 if (formData.address.zipcode || 
  formData.address.baseAddress || 
  modifiedFields.address.detailAddress) {
updateData.address = {
  zipcode: formData.address.zipcode || profile.address.zipcode,
  baseAddress: formData.address.baseAddress || profile.address.baseAddress,
  detailAddress: modifiedFields.address.detailAddress 
    ? formData.address.detailAddress 
    : profile.address.detailAddress
};
}

    dispatch(updateProfile(updateData));
  }

  if(loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
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
              value={formData.address?.zipcode}
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
              name="address.baseAddress"
              value={formData.address?.baseAddress}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Detailed Address"
              name="address.detailAddress"
              value={formData.address?.detailAddress}
              onChange={handleChange}
              placeholder="Apartment number, studio, floor, etc.(optional)" 
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
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
