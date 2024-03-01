import { useState } from "react";
import { auth } from "../../credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Box, Typography, InputBase, ButtonBase } from "@mui/material";

export default function LoginModal(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalFeedback, setModalFeedback] = useState("");

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        props.status("signedIn")
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
