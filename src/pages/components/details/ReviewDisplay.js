import { useEffect, useState } from "react";
import { Box, Typography, ButtonBase } from "@mui/material";
import { auth } from "../../../credentials";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function ReviewDisplay(props) {
  const reviewsArr = props.reviewsArr;
  const [totalScore, setTotalScore] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    setTotalScore(0);
    reviewsArr.forEach((review) => {
      let score = parseFloat(review.starScore);
      setTotalScore((prev) => prev + score);
    });
  }, [reviewsArr]);

  useEffect(() => {
    let avg = totalScore / reviewsArr.length;
    avg = Math.round(avg * 100) / 100;
    setAvgScore(avg);
  }, [totalScore]);

  const addLike = () => {
    console.log("added");
  };

  const removeLike = () => {
    console.log("removed");
  };

  const displayList = reviewsArr.map((review, idx) => {
    let likeColor = "#fff";
    let score = review.starScore.split(".");
    let half = parseInt(score[1]);
    let updateFunc = () => {};
    score = parseInt(score[0]);
    score = [...Array(score).keys()];

    if (auth.currentUser !== null) {
      review.likes.forEach((like) => {
        if (auth.currentUser.displayName == like) {
          updateFunc = addLike;
          likeColor = "red";
        } else {
          updateFunc = removeLike;
        }
      });
    }

    return (
      <Box sx={reviewBox} key={idx}>
        <Box sx={reviewTop}>
          <Typography sx={reviewBy}>Review by</Typography>
          <Typography sx={reviewUser}>{review.user}</Typography>
          <Box sx={starStyle}>
            {score.map((num) => (
              <StarIcon fontSize="small" key={num} />
            ))}
            {!isNaN(half) ? (
              <StarHalfIcon fontSize="small" key="half-star" />
            ) : (
              <div></div>
            )}
          </Box>
        </Box>
        <Typography sx={reviewText}>{review.reviewText}</Typography>
        <ButtonBase onClick={updateFunc}>
          <FavoriteIcon fontSize="small" sx={{ mr: "3px", color: likeColor }} />
          {review.likes.length} Likes
        </ButtonBase>
      </Box>
    );
  });

  return (
    <Box sx={reviewsContainer}>
      <Typography sx={reviewTitle}>Reviews</Typography>
      <Typography sx={avgTitle}>Review Avg: {avgScore}</Typography>
      <Box>{displayList}</Box>
    </Box>
  );
}

const reviewsContainer = {
  padding: "20px 10%",
  backgroundImage: "linear-gradient(to bottom left, black, transparent)",
  textAlign: "center",
  color: "#fff",
};

const reviewTitle = {
  fontWeight: "100",
  fontSize: "34px",
  mb: "5px",
};

const avgTitle = {
  color: "#bbb9b9",
  mb: "20px",
};

const reviewBox = {
  backgroundColor: "#484c58",
  boxShadow: "0 2px 10px 0px #2f3139",
  borderRadius: "10px",
  padding: "10px 15px",
  mb: "20px",
  textAlign: "start",
};

const reviewTop = {
  display: "flex",
  alignItems: "center",
};

const reviewBy = {
  color: "#bbb9b9",
  fontSize: "14px",
};

const reviewUser = {
  color: "#fff",
  margin: "0 4px",
};

const starStyle = {
  color: "#ffd700",
  fontSize: "10px",
};

const reviewText = {
  padding: "10px",
};
