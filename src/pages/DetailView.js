import { useState, useEffect } from "react";
import { Box, Link, Typography, ListItem } from "@mui/material";
import { apiKey, auth, db } from "../credentials";
import parse from "html-react-parser";
import DetailViewButtons from "./components/details/DetailViewButtons";
import ReviewDisplay from "./components/details/ReviewDisplay";
import ReviewButtons from "./components/details/ReviewButtons";
import { collection, getDocs, query } from "firebase/firestore";
import Top5Button from "./components/details/Top5Button";

export default function DetailView(props) {
  const setModal = props.setModal;
  const closeModal = props.closeModal;
  const openModal = props.openModal;
  const gameId = props.id;
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

  //rerendering for review changes
  const [reviewsArr, setReviewsArr] = useState([]);

  useEffect(() => {
    getReviews();
    setGameUrl(gameUrl);
    props.openLoading();

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
        props.closeLoading();
      });
  }, [gameUrl]);

  const getReviews = async () => {
    setReviewsArr([]);
    try {
      const querySnapshot = await getDocs(query(collection(db, "GameDB")));

      querySnapshot.forEach((doc) => {
        doc.data().reviews.forEach((review) => {
          if (review.gameId === gameId.toString()) {
            setReviewsArr((prev) => [...prev, review]);
          }
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 158px)" }}>
      <Box
        component="img"
        sx={headerImage}
        alt="header"
        src={apiReturn.background_image}
      ></Box>
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
              if (idx == genres.length - 1) {
                return (
                  <Typography sx={sideItem} key={idx}>
                    {genre.name}
                  </Typography>
                );
              } else {
                return (
                  <Typography sx={sideItem} key={idx}>
                    {genre.name} |&nbsp;
                  </Typography>
                );
              }
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
              if (idx == tags.length - 1) {
                return (
                  <Typography sx={sideItem} key={idx}>
                    {tag.name}
                  </Typography>
                );
              } else {
                return (
                  <Typography sx={sideItem} key={idx}>
                    {tag.name} |&nbsp;
                  </Typography>
                );
              }
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
            sx={{ width: "50px", mb: "10px" }}
            alt="rating"
            src={`./assets/esrb_${rating.slug}.png`}
          />

          {auth.currentUser === null ? (
            <div></div>
          ) : (
            <div>
              <DetailViewButtons gameId={gameId} />
              <Top5Button
                gameId={gameId}
                setModal={setModal}
                closeModal={closeModal}
                openModal={openModal}
              />
              <ReviewButtons
                gameId={gameId}
                setModal={setModal}
                closeModal={closeModal}
                openModal={openModal}
                getReviews={getReviews}
              />
            </div>
          )}
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
            <Box
              component="img"
              sx={articleImg}
              alt="header"
              src={apiReturn.background_image_additional}
            />
            <Typography sx={articleDevPub}>Publisher(s)</Typography>
            <ListItem sx={list}>
              {publishers.map((publisher, idx) => {
                if (idx == publishers.length - 1) {
                  return (
                    <Typography key={idx} sx={listItem}>
                      {publisher.name}
                    </Typography>
                  );
                } else {
                  return (
                    <Typography key={idx} sx={listItem}>
                      {publisher.name},&nbsp;
                    </Typography>
                  );
                }
              })}
            </ListItem>

            <Typography sx={articleDevPub}>Developer(s)</Typography>
            <ListItem sx={list}>
              {developers.map((developer, idx) => {
                if (idx == developers.length - 1) {
                  return (
                    <Typography key={idx} sx={listItem}>
                      {developer.name}
                    </Typography>
                  );
                } else {
                  return (
                    <Typography key={idx} sx={listItem}>
                      {developer.name},&nbsp;
                    </Typography>
                  );
                }
              })}
            </ListItem>

            <Box sx={paragraphStyle}>{description}</Box>
          </Box>
        </Box>
      </Box>
      <ReviewDisplay gameId={gameId} reviewsArr={reviewsArr} />
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
  position: "relative",
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
  pt: "0px",
};

const articleDevPub = {
  color: "#fff",
  fontSize: "19px",
};

const list = {
  color: "#fff",
  ml: "25px",
  fontSize: "15px",
  display: "list-item"
};

const listItem = {
  display:"inline-block",
};

const articleImg = {
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
