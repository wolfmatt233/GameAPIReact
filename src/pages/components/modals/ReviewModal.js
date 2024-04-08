import { useEffect, useState } from "react";
import { Box, ButtonBase, Typography, InputBase, Rating } from "@mui/material";
import { auth, db } from "../../../credentials";
import { doc, updateDoc } from "firebase/firestore";
import { modalBtn, modalInput, modalStyle, ratingStyle } from "./ModalStyles";

export default function ReviewModal(props) {
  const gameId = props.gameId;
  const close = props.closeModal;
  const setReviewArray = props.setReviewArray;
  const reviewArray = props.reviewArray;
  const getReviews = props.getReviews;
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [modalFeedback, setModalFeedback] = useState("");
  const [buttonText, setButtonText] = useState("");

  useEffect(() => {
    setReviewInfo();
  }, []);

  const setReviewInfo = () => {
    let reviewed = false;

    reviewArray.forEach((review) => {
      if (review.gameId == gameId) {
        reviewed = true;
        setRating(parseFloat(review.starScore));
        setReviewText(review.reviewText);
      }
    });

    if (reviewed == true) {
      setButtonText("Edit Review");
    } else {
      setButtonText("Add Review");
    }
  };

  const editReview = async () => {
    try {
      let user = auth.currentUser;
      if (rating < 0.5 || rating > 5) {
        setModalFeedback("Rating must be between 0.5 and 5");
        return;
      }

      const arrayCopy = reviewArray.slice();

      arrayCopy.forEach((review) => {
        if (review.gameId == gameId) {
          review.reviewText = reviewText;
          review.starScore = rating.toString();
        }
      });

      setReviewArray(arrayCopy);

      await updateDoc(doc(db, "GameDB", user.uid), {
        reviews: reviewArray,
      }).then(() => {
        getReviews();
        close();
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const addReview = async () => {
    try {
      let user = auth.currentUser;
      if (rating < 0.5 || rating > 5) {
        setModalFeedback("Rating must be between 0.5 and 5");
        return;
      }

      const reviewObj = {
        reviewText: reviewText,
        starScore: rating.toString(),
        likes: [],
        gameId: gameId,
        user: user.displayName,
      };

      let arrayCopy = reviewArray.slice();
      arrayCopy.push(reviewObj);

      setReviewArray(arrayCopy);

      await updateDoc(doc(db, "GameDB", user.uid), {
        reviews: arrayCopy,
      }).then(() => {
        getReviews();
        close();
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Box sx={modalStyle} color={"#000"}>
      <Typography sx={{ fontSize: "23px", color: "#fff" }}>
        {buttonText}
      </Typography>
      <InputBase
        multiline
        rows={7}
        placeholder="Review here..."
        value={reviewText}
        sx={modalInput}
        onChange={(e) => setReviewText(e.currentTarget.value)}
      />
      <Rating
        sx={ratingStyle}
        value={rating}
        precision={0.5}
        onChange={(e) => {
          setRating(parseFloat(e.currentTarget.value));
        }}
      />
      <ButtonBase
        sx={modalBtn}
        onClick={() => {
          reviewArray.forEach((review) => {
            if (review.gameId == gameId) {
              editReview();
            } else {
              addReview();
            }
          });
        }}
      >
        {buttonText}
      </ButtonBase>
      <Typography sx={{ color: "red", textAlign: "center" }}>
        {modalFeedback}
      </Typography>
    </Box>
  );
}
