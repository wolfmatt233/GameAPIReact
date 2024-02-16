import { useState, useEffect } from "react";
import Home from "./Home";
import Browse from "./Browse";
import User from "./User";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Typography,
  Container,
  InputBase,
  ButtonBase,
  Modal,
  Input,
  Paper,
} from "@mui/material";
import { auth } from "../credentials";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import SearchIcon from "@mui/icons-material/Search";
import VideogameAssetIcon from "@mui/icons-material/VideogameAssetTwoTone";
import DetailView from "./DetailView";

export default function Main() {
  const [authStateButtons, setAuthStateButtons] = useState(); //nav buttons (logged in or not)
  const [toggleModal, setToggleModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalFeedback, setModalFeedback] = useState("");
  const [gameId, setGameId] = useState();
  const detailPage = (id) => setGameId(id);
  const pages = [
    <Home />,
    <Browse details={detailPage} />,
    <User />,
    <DetailView id={gameId} />,
  ];
  const [curPage, setCurPage] = useState(pages[0]);

  const closeModal = () => setToggleModal(false);
  const openModal = () => setToggleModal(true);
  const homePage = () => setCurPage(pages[0]);
  const browsePage = () => setCurPage(pages[1]);
  const userPage = () => setCurPage(pages[2]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthStateButtons(loggedInButtons);
      } else {
        setAuthStateButtons(loggedOutButtons);
      }
    });
  }, []);

  useEffect(() => {
    setCurPage(pages[3]);
  }, [gameId]);

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setModalFeedback("");
      })
      .catch((error) => {
        let code = error.code.split("/")[1].replace("-", " ");
        setModalFeedback(`Error: ${code}`);
      });
  };

  const logout = () => {
    signOut(auth);
  };

  const loggedOutButtons = (
    <Container
      sx={{
        width: "25%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 0,
      }}
    >
      <Button sx={navBtn} onClick={browsePage}>
        Browse
      </Button>
      <Button sx={navBtn} onClick={openModal}>
        Login
      </Button>
      <Button sx={navBtn}>Sign Up</Button>
    </Container>
  );

  const loggedInButtons = (
    <Container
      sx={{
        width: "25%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 0,
      }}
    >
      <Button sx={navBtn} onClick={browsePage}>
        Browse
      </Button>
      <Button sx={navBtn} onClick={userPage}>
        Logged In
      </Button>
      <Button sx={navBtn} onClick={logout}>
        Log Out
      </Button>
    </Container>
  );

  return (
    <div>
      <Box sx={{ padding: 0 }}>
        <AppBar
          position="static"
          sx={{ backgroundColor: primColor, boxShadow: "none" }}
        >
          <Toolbar sx={navbarStyle}>
            <Container sx={{ width: "20%", margin: 0 }}>
              <ButtonBase sx={navTitle} onClick={homePage}>
                <VideogameAssetIcon
                  fontSize="large"
                  color="error"
                  sx={{ pr: "5px" }}
                />
                Gallant Games Gallery
              </ButtonBase>
            </Container>

            <Container sx={{ width: "40%", margin: 0 }}>
              <Paper sx={navSearchContainer}>
                <InputBase placeholder="Search" sx={navSearch} />
                <ButtonBase>
                  <SearchIcon />
                </ButtonBase>
              </Paper>
            </Container>

            {authStateButtons}
          </Toolbar>
        </AppBar>
      </Box>

      <Box sx={app}>{curPage}</Box>

      <Box>
        <Typography sx={footerStyle}>
          &copy;Matthew Wolf 2024 | IUPUI Capstone Project
        </Typography>
      </Box>

      <Modal open={toggleModal} onClose={closeModal}>
        <Box sx={modalStyle}>
          <Input
            placeholder="Email"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <Input
            placeholder="Password"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Button onClick={login}>Sign In</Button>
          <Typography sx={{ color: "red", textAlign: "center" }}>
            {modalFeedback}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

//----CSS COMPONENT STYLING----\\

const primColor = "#40434e";

const footerStyle = {
  color: "#fff",
  textAlign: "center",
  margin: "20px 0",
};

const navbarStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const navSearchContainer = {
  width: "100%",
  border: "1px solid #fff",
  borderRadius: "10px",
  pr: "5px",
  color: "#fff",
  display: "flex",
  bgcolor: primColor,
  boxShadow: "0",
};

const navSearch = {
  width: "100%",
  padding: "2px 10px",
  borderRadius: "10px",
  color: "#fff",
  display: "flex",
  bgcolor: primColor,
};

const navTitle = {
  color: "#fff",
  fontSize: "18px",
  letterSpacing: "2px",
  whiteSpace: "nowrap",
};

const navBtn = {
  color: "#fff",
  borderRadius: 0,
  textTransform: "none",
  fontSize: "16px",
  "&:hover": {
    backgroundColor: "transparent",
    borderBottom: "1px solid #fff",
  },
};

const app = {
  minHeight: "calc(100vh - 128px)",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "#fff",
  display: "flex",
  flexDirection: "column",
  padding: "10px",
  borderRadius: "10px",
};
