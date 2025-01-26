import React, { Fragment, useEffect, useState } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import PinDropIcon from "@material-ui/icons/PinDrop";
import HomeIcon from "@material-ui/icons/Home";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import PublicIcon from "@material-ui/icons/Public";
import PhoneIcon from "@material-ui/icons/Phone";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import { Country, State } from "country-state-city";
import { useAlert } from "react-alert";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { getProfileEdit, updateProfile } from "../../actions/userAction";
import { setShippingAddress } from "../../actions/checkoutAction";
import Loader from "../layout/Loader/Loader";
import { Paper, Typography, Grid, Button, TextField, Box } from "@mui/material";

const Shipping = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { selectedItems } = useSelector((state) => state.checkout);
  console.log('Checkout State Items:', selectedItems);
const { profile, loading } = useSelector((state) => state.profile);
  const [address, setAddress] = useState({
    zipcode: "",
    baseAddress:"",
    detailAddress:""
  });
 const [shouldUpdateDefault, setShouldUpdateDefault] = useState(false);

 useEffect(() => {
   if(!selectedItems || selectedItems?.length === 0){
     history.push("/cart");
   }
 }, [history, selectedItems])

  useEffect(() => {
    dispatch(getProfileEdit());
  }, [dispatch]);

  useEffect(() => {
    // pre-fill form if user has an address
    if(profile?.address){
      setAddress(prev => ({
        ...prev,
        zipcode: profile?.address?.zipcode || "",
        baseAddress: profile?.address?.baseAddress || "",
        detailAddress: profile?.address?.detailAddress || ""
      }))
    }
  }, [profile])

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddress( prev => ({
          ...prev,
          zipcode: data.zonecode,
          baseAddress: data.roadAddress,
          detailAddress: prev.detailAddress,
        }));
      }
    }).open();
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  }
  const shippingSubmit = async (e) => {
    e.preventDefault();
    if(shouldUpdateDefault){
      await dispatch(updateProfile({
        ...profile,
        address
      }))
    }
    dispatch(setShippingAddress(address));
    history.push("/order/confirm")
  };

if(loading) return <Loader />

  return (
    <div className="container">
      <Fragment>
        <MetaData title="Shipping Details" />

        <CheckoutSteps activeStep={0} />

        <Paper sx={{ maxWidth: 600, mx: "auto", p: 3, mt: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Shipping Details
          </Typography>

            <form
              className="shippingForm"
              onSubmit={shippingSubmit}
            >
               <Grid container spacing={3}>
               <Grid item xs={12}>
           
              <TextField
                fullWidth
                label="Zipcode"
                name="zipcode"
                value={address.zipcode}
                InputProps={{ readOnly: true }}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddressSearch}
                sx={{ mt: 1}}
              >
                Search Address
              </Button>
              </Grid>
              <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="baseAddress"
                value={address.baseAddress}
                InputProps={{ readOnly: true }}
              />
              </Grid>
              <Grid item xs={12}>
              <TextField
                fullWidth
                label="Detailed Address"
                name="detailAddress"
                value={address.detailAddress}
                onChange={handleChange}
                placeholder="Apartment number, floor, etc."
              />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <input
                    type="checkbox"
                    checked={shouldUpdateDefault}
                    onChange={(e) => setShouldUpdateDefault(e.target.checked)}
                  />
                  <Typography sx={{ ml: 1 }}>
                    Save as default address
                  </Typography>
                </Box>
              </Grid>
      

          
              <Grid item xs={12}>
              <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!address.zipcode || !address.baseAddress}
            >
              Continue to Order
            </Button>
            </Grid>
            </Grid>
            </form>
 
        </Paper>
      </Fragment>
    </div>
  );
};

export default Shipping;
