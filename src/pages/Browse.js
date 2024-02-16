import { useState, useEffect } from "react";
import { apiKey } from "../credentials";
import {
  Button,
  Container,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { DetailView } from "./DetailView";

export default function Browse(props) {
  const [gameList, setGameList] = useState([]);
  const [apiReturn, setApiReturn] = useState({});
  const [page, setPage] = useState(1);
  const [url, setUrl] = useState(
    `https://api.rawg.io/api/games?key=${apiKey}&page=${page}`
  );

  const nextPage = () => {
    setPage(apiReturn.next.split("=")[2]);
  };
  const prevPage = () => {
    if (page == 2) {
      setPage(1);
    } else {
      setPage(apiReturn.previous.split("=")[2]);
    }
  };

  useEffect(() => {
    const getGames = async () => {
      const result = await fetch(url);
      result.json().then((data) => {
        setGameList(data.results);
        setApiReturn(data);
        console.log("queried");
      });
    };
    getGames();
  }, [url]);

  useEffect(() => {
    setUrl(`https://api.rawg.io/api/games?key=${apiKey}&page=${page}`);
  }, [page]);

  return (
    <div>
      <p>{props.name}</p>
      <ImageList sx={{}} cols={4} rowHeight={100} gap={20}>
        {gameList.map((game, idx) => (
          <ImageListItem
            key={idx}
            onClick={() => {
              props.details(game.id)
            }}
            sx={{
              cursor:"pointer",
              backgroundImage: `url(${game.background_image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "top",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${game.background_image})`,
              },
              "&:hover p": {
                opacity: "1",
                transition: "opacity 0.2s ease-in",
              },
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                opacity: "0",
              }}
            >
              {game.name}
            </Typography>
            <Typography
              sx={{
                color: "#bbb9b9",
                opacity: "0",
              }}
            >
              {game.tba == false ? game.released.split("-")[0] : "TBA"}
            </Typography>
          </ImageListItem>
        ))}
      </ImageList>

      <Container sx={{ textAlign: "center" }}>
        {page != 1 ? <Button onClick={prevPage}>Previous</Button> : <div></div>}
        <Button onClick={nextPage}>Next</Button>
      </Container>
    </div>
  );
}
