import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Snackbar, Alert } from '@mui/material'
import { hideNotification } from '../../../../actions/notificationAction'

const FlexibleNotification = () => {
    const dispatch = useDispatch();
    const { open, message, severity } = useSelector((state) => state.notification);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        dispatch(hideNotification());
      };
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
    )
     
    
}

export default FlexibleNotification