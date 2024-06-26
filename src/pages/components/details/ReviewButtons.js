import { useEffect, useState } from "react";
import { Box, ButtonBase, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  editButtonStyle,
  buttonContainer,
  addButtonStyle,
} from "./ButtonStyles";
import { auth, db } from "../../../credentials";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ReviewModal from "../modals/ReviewModal";

export default function ReviewButtons(props) {
  const setModal = props.setModal;
  const closeModal = props.closeModal;
  const openModal = props.openModal;
  const getReviews = props.getReviews;
  const gameId = props.gameId.toString();
  const [reviewArray, setReviewArray] = useState([]);

  useEffect(() => {
    checkReview();
  }, []);

  useEffect(() => {
    let reviewed = false;

    reviewArray.forEach((review) => {
      if (review.gameId == gameId) {
        reviewed = true;
        setToggleAddEdit(editReviewBtn);
        setToggleRemove(removeReviewBtn);
      }
    });

    if (reviewed == false) {
      setToggleAddEdit(addReviewBtn);
      setToggleRemove(<div></div>);
    }
  }, [reviewArray]);

  const checkReview = async () => {
    try {
      let userDoc = await getDoc(doc(db, "GameDB", auth.currentUser.uid));
      userDoc = userDoc.data();

      setReviewArray(userDoc.reviews);
    } catch (error) {
      console.log(error.message);
    }
  };

  const removeReview = async () => {
    try {
      const arrayCopy = reviewArray.filter(
        (review) => review.gameId !== gameId
      );
      setReviewArray(arrayCopy);

      await updateDoc(doc(db, "GameDB", auth.currentUser.uid), {
        reviews: arrayCopy,
      }).then(() => {
        props.getReviews();
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const addReviewBtn = (
    <div>
      <ButtonBase
        sx={addButtonStyle}
        onClick={() => {
          openModal();
          setModal(
            <ReviewModal
              gameId={gameId}
              closeModal={closeModal}
              setReviewArray={setReviewArray}
              reviewArray={reviewArray}
              getReviews={getReviews}
            />
          );
        }}
      >
        Add Review <AddIcon fontSize="small" />
      </ButtonBase>
    </div>
  );

  const editReviewBtn = (
    <Tooltip title="Edit" placement="right">
      <ButtonBase
        sx={editButtonStyle}
        onClick={() => {
          openModal();
          setModal(
            <ReviewModal
              gameId={gameId}
              closeModal={closeModal}
              setReviewArray={setReviewArray}
              reviewArray={reviewArray}
              getReviews={getReviews}
            />
          );
        }}
      >
        Edit Review <EditIcon fontSize="small" />
      </ButtonBase>
    </Tooltip>
  );

  const removeReviewBtn = (
    <Tooltip title="Delete" placement="right">
      <ButtonBase sx={removeReviewStyle} onClick={removeReview}>
        Delete Review <RemoveIcon fontSize="small" />
      </ButtonBase>
    </Tooltip>
  );

  const [toggleAddEdit, setToggleAddEdit] = useState(addReviewBtn);
  const [toggleRemove, setToggleRemove] = useState(<div></div>);

  return (
    <Box sx={buttonContainer}>
      {toggleAddEdit}
      {toggleRemove}
    </Box>
  );
}

const removeReviewStyle = {
  padding: "8px",
  border: "1px solid #fff",
  borderRadius: "10px",
  mb: "10px",
  backgroundColor: "#cc4b4b",
  width: "150px",
  "&:hover": {
    filter: "brightness(80%)",
  },
  "svg": {
    marginLeft: "5px"
  }
};
