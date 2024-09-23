import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from "../constants/notificationConstants";

export const showNotification = (message, severity = "info") =>({
        type: SHOW_NOTIFICATION,
        payload: { message, severity},
    });


export const hideNotification = () => async (dispatch) => {
    dispatch({
        type: HIDE_NOTIFICATION,
    });
}