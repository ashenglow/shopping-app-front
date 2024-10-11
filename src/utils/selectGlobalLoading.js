import { createSelector } from "reselect";

export const selectGlobalLoading = createSelector(
    state => state.user.loading,
    state => state.product.loading,
    state => state.cart.loading,
    state => state.order.loading,
    state => state.payment.loading,
    (userLoading, productLoading, cartLoading, orderLoading, paymentLoading) =>  
        userLoading || productLoading || cartLoading || orderLoading || paymentLoading
);