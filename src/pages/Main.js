import { useState, useEffect } from "react";
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
import { onAuthStateChanged, signOut } from "firebase/auth";
import SearchIcon from "@mui/icons-material/Search";
import VideogameAssetIcon from "@mui/icons-material/VideogameAssetTwoTone";
import Home from "./Home";
import Browse from "./Browse";
import User from "./User";
import DetailView from "./DetailView";
import LoginModal from "./components/modals/LoginModal";
import SignUpModal from "./components/modals/SignUpModal";

export default function Main() {
  const [authStateButtons, setAuthStateButtons] = useState(); //nav buttons (logged in or not)
  const [displayName, setDisplayName] = useState("Username");

  //----MODAL----\\
  const [modalBox, setModalBox] = useState("");
  const [toggleModal, setToggleModal] = useState(false);
  const closeModal = () => setToggleModal(false);
  const openModal = () => setToggleModal(true);
  const modals = [
    <LoginModal displayName={setDisplayName} close={closeModal} />,
    <SignUpModal displayName={setDisplayName} close={closeModal} />,
  ];

  //----ROUTING----\\
  const [gameId, setGameId] = useState();
  const pages = [
    <Home
      open={openModal}
      setModal={setModalBox}
      close={closeModal}
      displayName={setDisplayName}
    />,
    <Browse setId={setGameId} />,
    <User />,
    <DetailView id={gameId} />,
  ];
  const [curPage, setCurPage] = useState(pages[0]);
  const homePage = () => setCurPage(pages[0]);
  const browsePage = () => setCurPage(pages[1]);
  const userPage = () => setCurPage(pages[2]);

  //Changes UI if user state is changed (logged in/out)
  useEffect(() => {
    console.log(displayName);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthStateButtons(loggedInButtons);
        setDisplayName(user.displayName);
        console.log(displayName);
      } else {
        setAuthStateButtons(loggedOutButtons);
      }
    });
    console.log(displayName);
  }, []);

  //sets the current page if the game id changes
  useEffect(() => {
    if (gameId == null) {
      return;
    } else {
      setCurPage(pages[3]);
    }
  }, [gameId]);

  useEffect(() => {
    //this resets the game id to allow the user to return to the previous item
    //detail routing relies on the game id to change and if it does not the page will not change
    if (curPage.type.name != "DetailView") {
      setGameId(null);
    }
  }, [curPage]);

  const logout = () => {
    signOut(auth).then(() => {
      setDisplayName("");
    });
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
      <Button
        sx={navBtn}
        onClick={() => {
          openModal();
          setModalBox(modals[0]);
        }}
      >
        Login
      </Button>
      <Button
        sx={navBtn}
        onClick={() => {
          openModal();
          setModalBox(modals[1]);
        }}
      >
        Sign Up
      </Button>
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
        {displayName}
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
        <div>{modalBox}</div>
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
  margin: "15px 0",
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
  minHeight: "calc(100vh - 158px)",
  backgroundColor: "#555a68",
  borderRadius: "10px",
  overflow: "hidden",
};
