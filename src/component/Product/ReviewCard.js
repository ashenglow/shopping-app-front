import { Rating } from "@mui/material";
import React from "react";
import profilePng from "../../images/Profile.png";

const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };
  const reviewUserImg = review.userImg ? review.userImg : profilePng;
  return (
    <div className="reviewCard">
      <img src={reviewUserImg} alt="User" />
      <p>{review.nickname}</p>
      <Rating {...options} />
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
