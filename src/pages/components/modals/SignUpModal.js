import { useState } from "react";
import { auth, db } from "../../../credentials";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Box, Typography, InputBase, ButtonBase } from "@mui/material";

export default function SignUpModal(props) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [modalFeedback, setModalFeedback] = useState("");

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((credentials) => {
        const user = credentials.user;

        let userObj = {
          bio: "",
          favorites: [],
          lists: [],
          played: [],
          reviews: [],
          topfive: [],
          toplay: [],
          uid: user.uid,
          username: username,
        };

        updateProfile(user, {
          displayName: username,
        });

        createUserDoc(user, userObj);

        setModalFeedback("");
        props.close();
      })
      .catch((error) => {
        let code = error.code.split("/")[1].replace("-", " ");
        setModalFeedback(`Error: ${code}`);
      });
  };

  const createUserDoc = async (user, userObj) => {
    try {
      await setDoc(doc(db, "GameDB", user.uid), userObj);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Box sx={modalStyle} color={"#000"}>
      <Typography sx={{ fontSize: "23px", color: "#fff" }}>Sign Up</Typography>
      <InputBase
        placeholder="Email"
        sx={modalInput}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <InputBase
        placeholder="Username"
        sx={modalInput}
        onChange={(e) => setUsername(e.currentTarget.value)}
      />
      <InputBase
        placeholder="Password"
        type="password"
        sx={modalInput}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <InputBase
        placeholder="Password"
        type="password"
        sx={modalInput}
        onChange={(e) => setPasswordCheck(e.currentTarget.value)}
      />
      <ButtonBase
        sx={modalBtn}
        onClick={() => {
          if (password == passwordCheck) {
            signup();
          } else {
            setModalFeedback("Passwords must match!");
          }
        }}
      >
        Sign Up
      </ButtonBase>
      <Typography sx={{ color: "red", textAlign: "center" }}>
        {modalFeedback}
      </Typography>
    </Box>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: "40%",
  bgcolor: "#40434e",
  display: "flex",
  flexDirection: "column",
  padding: "10px",
  borderRadius: "10px",
  textAlign: "center",
  alignItems: "center",
  justifyContent: "space-evenly",
};

const modalInput = {
  width: "80%",
  border: "1px solid #fff",
  borderRadius: "10px",
  padding: "5px",
  pl: "10px",
  color: "#fff",
};

const modalBtn = {
  width: "50%",
  padding: "10px",
  borderRadius: "10px",
  color: "#fff",
  bgcolor: "#2e7f2e",
};
