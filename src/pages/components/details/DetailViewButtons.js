import { useState, useEffect } from "react";
import { Box, ButtonBase } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { auth, db } from "../../../credentials";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default function DetailViewButtons(props) {
  const gameId = props.gameId.toString();
  const [favArray, setFavArray] = useState([]);
  const [playedArray, setPlayedArray] = useState([]);
  const [wantArray, setWantArray] = useState([]);

  //runs on component mount
  useEffect(() => {
    checkArrays();
  }, []);

  //runs on mount and when favArray is changed
  useEffect(() => {
    favArray.forEach((game) => {
      game == gameId ? setToggleFav(removeFavBtn) : setToggleFav(addFavBtn);
    });
    favArray.length === 0 && setToggleFav(addFavBtn);
  }, [favArray]);

  useEffect(() => {
    playedArray.forEach((game) => {
      game == gameId
        ? setTogglePlayed(removePlayedBtn)
        : setTogglePlayed(addPlayedBtn);
    });
    playedArray.length === 0 && setTogglePlayed(addPlayedBtn);
  }, [playedArray]);

  useEffect(() => {
    wantArray.forEach((game) => {
      game == gameId ? setToggleWant(removeWantBtn) : setToggleWant(addWantBtn);
    });
    wantArray.length === 0 && setToggleWant(addWantBtn);
  }, [wantArray]);

  const checkArrays = async () => {
    try {
      let userDoc = await getDoc(doc(db, "GameDB", auth.currentUser.uid));
      userDoc = userDoc.data();

      setFavArray(userDoc.favorites);
      setPlayedArray(userDoc.played);
      setWantArray(userDoc.toplay);
    } catch (error) {
      console.log(error.message);
    }
  };

  const addToFavorites = async () => {
    setFavArray([...favArray, gameId]);

    await updateDoc(doc(db, "GameDB", auth.currentUser.uid), {
      favorites: arrayUnion(gameId),
    }).catch((error) => {
      console.log(error.message);
    });
  };

  const removeFromFavorites = async () => {
    setFavArray(favArray.filter((game) => game != gameId));

    await updateDoc(doc(db, "GameDB", auth.currentUser.uid), {
      favorites: arrayRemove(gameId),
    }).catch((error) => {
      console.log(error.message);
    });
  };

  const addToPlayed = async () => {
    setPlayedArray([...playedArray, gameId]);

    await updateDoc(doc(db, "GameDB", auth.currentUser.uid), {
      played: arrayUnion(gameId),
    }).catch((error) => {
      console.log(error.message);
    });
  };

  const removeFromPlayed = async () => {
    setPlayedArray(favArray.filter((game) => game != gameId));

    await updateDoc(doc(db, "GameDB", auth.currentUser.uid), {
      played: arrayRemove(gameId),
    }).catch((error) => {
      console.log(error.message);
    });
  };

  const addToWant = async () => {
    setWantArray([...wantArray, gameId]);

    await updateDoc(doc(db, "GameDB", auth.currentUser.uid), {
      toplay: arrayUnion(gameId),
    }).catch((error) => {
      console.log(error.message);
    });
  };

  const removeFromWant = async () => {
    setWantArray(wantArray.filter((game) => game != gameId));

    await updateDoc(doc(db, "GameDB", auth.currentUser.uid), {
      toplay: arrayRemove(gameId),
    }).catch((error) => {
      console.log(error.message);
    });
  };

  const addFavBtn = (
    <div>
      <ButtonBase sx={addButtonStyle} onClick={addToFavorites}>
        Add to "Favorites" <AddIcon fontSize="small" />
      </ButtonBase>
    </div>
  );

  const removeFavBtn = (
    <div>
      <ButtonBase sx={removeButtonStyle} onClick={removeFromFavorites}>
        Favorited <CheckIcon fontSize="small" />
      </ButtonBase>
    </div>
  );

  const addPlayedBtn = (
    <div>
      <ButtonBase sx={addButtonStyle} onClick={addToPlayed}>
        Add to "Played" <AddIcon fontSize="small" />
      </ButtonBase>
    </div>
  );

  const removePlayedBtn = (
    <div>
      <ButtonBase sx={removeButtonStyle} onClick={removeFromPlayed}>
        Played <CheckIcon fontSize="small" />
      </ButtonBase>
    </div>
  );

  const addWantBtn = (
    <div>
      <ButtonBase sx={addButtonStyle} onClick={addToWant}>
        Add to "To Play" <AddIcon fontSize="small" />
      </ButtonBase>
    </div>
  );

  const removeWantBtn = (
    <div>
      <ButtonBase sx={removeButtonStyle} onClick={removeFromWant}>
        To Play <CheckIcon fontSize="small" />
      </ButtonBase>
    </div>
  );

  const [toggleFav, setToggleFav] = useState(addFavBtn);
  const [togglePlayed, setTogglePlayed] = useState(addPlayedBtn);
  const [toggleWant, setToggleWant] = useState(addWantBtn);

  return (
    <Box sx={buttonContainer}>
      {toggleFav}
      {togglePlayed}
      {toggleWant}
    </Box>
  );
}

const buttonContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  mt: "10px",
};

const addButtonStyle = {
  padding: "8px",
  border: "1px solid #fff",
  borderRadius: "10px",
  mb: "10px",
  "&:hover": {
    backgroundColor: "green",
    filter: "brightness(90%)",
  },
};

const removeButtonStyle = {
  padding: "8px",
  border: "1px solid #fff",
  borderRadius: "10px",
  mb: "10px",
  backgroundColor: "green",
  "&:hover": {
    backgroundColor: "red",
    filter: "brightness(90%)",
  },
};
