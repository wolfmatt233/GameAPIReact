import { useState, useEffect } from "react";
import { Box, Link, Typography } from "@mui/material";
import { apiKey } from "../credentials";
import parse from "html-react-parser";
import DetailViewButtons from "./components/details/DetailViewButtons";
import ReviewDisplay from "./components/details/ReviewDisplay";

export default function DetailView(props) {
  const [gameId, setGameId] = useState(props.id);
  const [apiReturn, setApiReturn] = useState({});
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [stores, setStores] = useState([]);
  const [rating, setRating] = useState({});
  const [date, setDate] = useState();
  const [metascore, setMetascore] = useState();
  const [platforms, setPlatforms] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [description, setDescription] = useState("");
  const [gameUrl, setGameUrl] = useState(
    `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`
  );

  useEffect(() => {
    setGameId(props.id);
    setGameUrl(gameUrl);

    if (rating == null) {
      setRating("pending");
    } else if (date == null) {
      setDate("TBA");
    } else if (metascore == null) {
      setMetascore = "N/A";
    }
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
        setDate(data.released);
        setMetascore(data.metacritic);
        setPlatforms(data.parent_platforms);
        setDevelopers(data.developers);
        setPublishers(data.publishers);
        const parseDesc = parse(data.description);
        setDescription(parseDesc);
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
          {/* Genres */}
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

          {/* Tags */}
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

          {/* Stores */}
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

          {/* Rating */}
          <Box
            component="img"
            sx={{ width: "50px" }}
            alt="rating"
            src={`./assets/esrb_${rating.slug}.png`}
          />

          <DetailViewButtons gameId={gameId} />
        </Box>
        <Box sx={detailRight}>
          <Box sx={detailBar}>
            <Typography sx={barText}>Released: {date}</Typography>
            <Typography sx={barText}>Metascore: {metascore}</Typography>
            <Box>
              {platforms.map((platform, idx) => {
                platform = platform.platform.slug;
                if (platform == "pc") {
                  platform = "windows";
                } else if (platform == "mac") {
                  platform = "apple";
                }
                let icon = `fa-brands fa-${platform}`;

                return <i className={icon} key={idx} style={iconStyle}></i>;
              })}
            </Box>
          </Box>
          <Box sx={articleBox}>
            <Box sx={devContainer}>
              <Box sx={{mr: "20px"}}>
                <Typography sx={articleDevPub}>Publisher(s)</Typography>
                {publishers.map((publisher, idx) => (
                  <Typography key={idx} sx={listItem}>
                    {publisher.name}
                  </Typography>
                ))}
              </Box>
              <Box>
                <Typography sx={articleDevPub}>Developer(s)</Typography>
                {developers.map((developer, idx) => (
                  <Typography key={idx} sx={listItem}>
                    {developer.name}
                  </Typography>
                ))}
              </Box>
            </Box>
            <Box
              component="img"
              sx={articleImg}
              alt="header"
              src={apiReturn.background_image_additional}
            />

            <Box sx={paragraphStyle}>{description}</Box>
          </Box>
        </Box>
      </Box>
      <ReviewDisplay gameId={gameId} />
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
  display: "flex",
  backgroundImage: "linear-gradient(to top left, black, transparent)",
  minHeight: "calc(100vh - 328px)",
  padding: "0 10%",
  mt: "-4px",
  pb: "20px",
};

const detailLeft = {
  width: "20%",
  color: "#fff",
  mt: "54px",
};

const sideItem = {
  color: "#bbb9b9",
  display: "inline-block",
  wordWrap: "break-word",
  fontSize: "13px",
};

const detailRight = {
  width: "80%",
};

const detailBar = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  padding: "15px 0",
};

const iconStyle = {
  color: "#fff",
  marginRight: "7px",
};

const barText = {
  color: "#fff",
  fontSize: "16px",
  letterSpacing: "1.2px",
};

const articleBox = {
  padding: "30px",
};

const devContainer = {
  display: "flex",
};

const articleDevPub = {
  color: "#fff",
  fontSize: "19px",
};

const listItem = {
  color: "#fff",
  display: "list-item",
  ml: "25px",
  fontSize: "15px",
};

const articleImg = {
  height: "300px",
  width: "100%",
  objectFit: "cover",
  objectPosition: "0 50%",
  margin: "20px 0",
  borderRadius: "10px",
};

const paragraphStyle = {
  color: "#fff",
  lineHeight: "28px",
};
