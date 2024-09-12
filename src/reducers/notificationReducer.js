import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from "../constants/notificationConstants";

const initialState ={
    open: false,
    message: "",
    severity: "info",
}
export const notificationReducer = (state = initialState, action) => {  
    switch (action.type) {
        case SHOW_NOTIFICATION:
            return {
                ...state,
                open: true,
                message: action.payload.message,
                severity: action.payload.severity,
            };
            case HIDE_NOTIFICATION:
                return {
                    ...state,
                    open: false,
                };

        default:
            return state;
    }
}