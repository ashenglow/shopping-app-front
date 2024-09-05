import { useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { initiatePayment, approvePayment } from "../../actions/paymentAction";
import Loader from "../layout/Loader/Loader";
import { useUserInfo } from "../../utils/userContext";
import { v4 as uuidv4 } from "uuid";
const KakaoPayment = ({ orderInfo, userId }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { loading, error, paymentUrl, paymentResult, tid } = useSelector(
    (state) => state.payment
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pgToken = queryParams.get("pg_token");
    if (pgToken && paymentResult) {
      const transactionId = localStorage.getItem("transactionId");
      dispatch(
        approvePayment({
          transactionId,
          userId,
          pgToken,
          orderItems: orderInfo.map((item) => ({
            itemId: item.id,
            count: item.count,
          })),
        })
      );
    }
  }, [dispatch, location, paymentResult, orderInfo, userId]);

  const handlePayment = () => {
    const transactionId = uuidv4();
    localStorage.setItem("transactionId", transactionId);
    const paymentInfo = {
      transactionId,
      userId,
      itemId:
        orderInfo.length > 1
          ? orderInfo.map((item) => item.id)
          : orderInfo[0].id,
      itemName:
        orderInfo.length > 1
          ? `${orderInfo[0].name}외 ${orderInfo.length - 1}건`
          : orderInfo[0].name,
      quantity: orderInfo.reduce((acc, item) => acc + item.count, 0),
      totalAmount: orderInfo.reduce(
        (acc, item) => acc + item.price * item.count,
        0
      ),
    };
    dispatch(initiatePayment(paymentInfo));
  };
  return (
    <div className="container">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div>
            <button onClick={handlePayment} disabled={loading}>
              Pay with Kakao
            </button>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default KakaoPayment;
