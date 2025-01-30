import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { TextField, Button, Paper, Typography, Box, Grid, CircularProgress } from "@mui/material";
import { updateProfile } from "../../../actions/userAction";
import { StyledPaper, StyledButton, StyledForm } from "../MUI-comp/MuiStyles";
import { handleOAuth2Success } from "../../../actions/oauth2Action";

const AddressCollection = ( { oAuthUserData, onSubmitComplete }) => {
    const dispatch = useDispatch();
    const history = useHistory();
const [formData, setFormData] = useState({
    userId: oAuthUserData.userId,
    nickname: oAuthUserData.nickname,
    address: {
        zipcode: "",
        baseAddress: "",
        detailAddress: "",
    },
})
useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
        document.body.removeChild(script);
    }
}, []);

const handleChange = (e) => {
    const { name, value } = e.target;
    if(name.startsWith("address.")) {
        const addressField = name.split(".")[1];
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [addressField]: value,
            },
        }))
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: value,
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
        }
    }).open();
};

const handleSubmit =  (e) => {
    e.preventDefault();

        dispatch(updateProfile(formData))
        .then(() => {
            if(onSubmitComplete){
                return onSubmitComplete();
            }
        })
        .catch((error) => {
            console.error("Failed to update address", error)
        });
}



return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
    <StyledPaper sx={{ width: '100%', maxWidth: 'sm', p: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Complete Your Profile
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        Please provide your shipping address to complete registration
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
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
              name="address.baseAddress"
              value={formData.address.baseAddress}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Detailed Address"
              name="address.detailAddress"
              value={formData.address.detailAddress}
              onChange={handleChange}
              placeholder="Apartment number, studio, floor, etc.(optional)"
            />
          </Grid>

          <Grid item xs={12}>
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={!formData.address.zipcode || !formData.address.baseAddress}
            >
              Complete Registration
            </StyledButton>
          </Grid>
        </Grid>
      </form>
    </StyledPaper>
  </Box>
)
}

export default AddressCollection;