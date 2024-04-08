import { useEffect, useState } from "react";
import { Box, ButtonBase, Typography, MenuItem, Select } from "@mui/material";
import { auth, db } from "../../../credentials";
import { doc, updateDoc } from "firebase/firestore";
import { modalBtn, selectStyle, modalStyle } from "./ModalStyles";

export default function ReviewModal(props) {
  const gameId = props.gameId;
  const topObject = props.topObject;
  const setTopObject = props.setTopObject;
  const checkTop5 = props.checkTop5;
  const close = props.closeModal;
  const [place, setPlace] = useState(1);

  const addToTop5 = async () => {
    let objectCopy = topObject;

    for (const prop in objectCopy) {
      if (prop == place) {
        objectCopy[prop] = gameId;
      }
    }

    setTopObject(objectCopy);

    try {
      await updateDoc(doc(db, "GameDB", auth.currentUser.uid), {
        topfive: objectCopy,
      }).then(() => {
        close();
        checkTop5();
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Box sx={modalStyle} color={"#000"}>
      <Typography sx={{ fontSize: "23px", color: "#fff" }}>
        Choose a place
      </Typography>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={place}
        label="Place"
        onChange={(e) => setPlace(e.target.value)}
        sx={selectStyle}
      >
        <MenuItem value={1}>1st</MenuItem>
        <MenuItem value={2}>2nd</MenuItem>
        <MenuItem value={3}>3rd</MenuItem>
        <MenuItem value={4}>4th</MenuItem>
        <MenuItem value={5}>5th</MenuItem>
      </Select>
      <ButtonBase sx={modalBtn} onClick={addToTop5}>
        Add to Top 5
      </ButtonBase>
    </Box>
  );
}
