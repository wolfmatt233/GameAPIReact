import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import hero from "../assets/home-hero.jpg";

export default function Home() {
  return (
    <div>
      <Box sx={homeHero}>
        <Typography sx={heroText}>
          Review and log the games you are playing! Check out what others think,
          too!
        </Typography>
        <Button variant="contained" color="error" sx={heroBtn}>Create an account today!</Button>
      </Box>
    </div>
  );
}

const homeHero = {
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${hero})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  minHeight: "calc(100vh - 128px)",
  width: "100%",
  borderRadius: "10px",
  position: "relative",
};

const heroText = {
  position: "absolute",
  top: "50%",
  left: "50%",
  lineHeight: "33px",
  transform: "translate(-50%, -90%)",
  textAlign: "center",
  width: "290px",
  fontSize: "1.6em",
  color: "#fff",
};

const heroBtn = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, 100%)",
  textTransform: "none",
  fontSize: "17px"
}
