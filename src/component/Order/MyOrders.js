import React, { Fragment, useEffect, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./myOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { myOrders } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";
import LaunchIcon from "@material-ui/icons/Launch";
import { clearError } from "../../actions/errorAction";

const MyOrders = () => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const { loading, orders } = useSelector((state) => state.myOrders);
  const { message: errorMessage, type: errorType } = useSelector(
    (state) => state.error
  );
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Order Details",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.row.id}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];
  const rows = [];

  orders &&
    orders.forEach((item, index) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item.orderId,
        status: item.status,
        amount: item.totalPrice,
      });
    });
  useEffect(() => {
    dispatch(myOrders());
  }, [dispatch, alert, errorType, errorMessage]);

  useEffect(() => {
    if (errorMessage) {
      alert.error(errorMessage);
      dispatch(clearError());
    }
  }, [dispatch, errorMessage, alert]);

  return (
    <div className="container">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {/* <MetaData title={`${userInfo.name} - Orders`} /> */}

          <div className="myOrdersContainer">
            <div className="myOrdersPageBox">
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                className="myOrdersTable"
                autoHeight
              />

              {/* <Typography id="myOrdersHeading">{userInfo.name}'s Orders</Typography> */}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default MyOrders;
