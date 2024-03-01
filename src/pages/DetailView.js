import { useState, useEffect } from "react";
import { Box, Link, Typography } from "@mui/material";
import { apiKey } from "../credentials";

export default function DetailView(props) {
  const [gameId, setGameId] = useState(props.id);
  const [apiReturn, setApiReturn] = useState({});
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [stores, setStores] = useState([]);
  const [rating, setRating] = useState({});
  const [gameUrl, setGameUrl] = useState(
    `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`
  );

  useEffect(() => {
    setGameId(props.id);
    setGameUrl(gameUrl);
  }, []);

  useEffect(() => {
    fetch(gameUrl)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setApiReturn(data);
        setGenres(data.genres);
        setTags(data.tags);
        setStores(data.stores);
        setRating(data.esrb_rating);
      });
  }, [gameUrl]);

  return (
    <Box sx={{ minHeight: "calc(100vh - 158px)" }}>
      <Box
        component="img"
        sx={headerImage}
        alt="header"
        src={apiReturn.background_image}
      />
      <Typography sx={headerTitle}>{apiReturn.name}</Typography>
      <Box sx={detailContainer}>
        <Box sx={detailLeft}>
          <Typography
            sx={{
              borderBottom: "1px solid #555a68",
            }}
          >
            Genres:
          </Typography>
          <Box sx={{ mb: "10px" }}>
            {genres.map((genre, idx) => {
              return (
                <Typography sx={sideItem} key={idx}>
                  {genre.name} |&nbsp;
                </Typography>
              );
            })}
          </Box>
          <Typography
            sx={{
              borderBottom: "1px solid #555a68",
            }}
          >
            Tags:
          </Typography>
          <Box sx={{ mb: "10px" }}>
            {tags.map((tag, idx) => {
              return (
                <Typography sx={sideItem} key={idx}>
                  {tag.name} |&nbsp;
                </Typography>
              );
            })}
          </Box>
          <Typography
            sx={{
              borderBottom: "1px solid #555a68",
            }}
          >
            Stores:
          </Typography>
          <Box sx={{ mb: "10px" }}>
            {stores.map((store, idx) => {
              return (
                <Box key={idx} sx={{ display: "inline-block" }}>
                  <Link
                    href={`https://${store.store.domain}`}
                    sx={{ fontSize: "14px" }}
                  >
                    {store.store.name}
                  </Link>
                  <span>,&nbsp;</span>
                </Box>
              );
            })}
          </Box>
          <Box
            component="img"
            sx={{ width: "50px" }}
            alt="rating"
            src={`./assets/esrb_${rating.slug}.png`}
          />
        </Box>
        <Box></Box>
      </Box>
    </Box>
  );
}

const headerImage = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  backgroundPosition: "top",
  objectPosition: "0 12%",
  filter: "brightness(50%)",
};

const headerTitle = {
  color: "#fff",
  position: "absolute",
  fontSize: "2em",
  top: "26%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const detailContainer = {
  backgroundImage: "linear-gradient(to top left, black, transparent)",
  minHeight: "calc(100vh - 328px)",
  padding: "0 5%",
  mt: "-4px",
};

const detailLeft = {
  width: "20%",
  color: "#fff",
};

const sideItem = {
  color: "#bbb9b9",
  display: "inline-block",
  wordWrap: "break-word",
  fontSize: "13px",
};
