import { useState } from "react";
import { auth } from "../../../credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Box, Typography, InputBase, ButtonBase } from "@mui/material";
import {modalBtn, modalInput, modalStyle} from "./ModalStyles";

export default function LoginModal(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalFeedback, setModalFeedback] = useState("");

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        props.displayName(userCredential.user.displayName);
        setModalFeedback("");
        props.close();
      })
      .catch((error) => {
        let code = error.code.split("/")[1].replace("-", " ");
        setModalFeedback(`Error: ${code}`);
      });
  };

  return (
    <Box sx={modalStyle} color={"#000"}>
      <Typography sx={{ fontSize: "23px", color: "#fff" }}>Sign In</Typography>
      <InputBase
        placeholder="Email"
        sx={modalInput}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <InputBase
        placeholder="Password"
        type="password"
        sx={modalInput}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <ButtonBase sx={modalBtn} onClick={login}>
        Sign In
      </ButtonBase>
      <Typography sx={{ color: "red", textAlign: "center" }}>
        {modalFeedback}
      </Typography>
    </Box>
  );
}
