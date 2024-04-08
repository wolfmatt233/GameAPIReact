export const buttonContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

export const addButtonStyle = {
  padding: "8px",
  border: "1px solid #fff",
  borderRadius: "10px",
  justifyContent: "center",
  mb: "10px",
  width: "150px",
  "&:hover": {
    backgroundColor: "green",
    filter: "brightness(90%)",
  },
  svg: {
    marginLeft: "5px",
  },
};

export const editButtonStyle = {
  padding: "8px",
  border: "1px solid #fff",
  borderRadius: "10px",
  mb: "10px",
  backgroundColor: "green",
  transition: "background-color 0.5s",
  width: "150px",
  "&:hover": {
    backgroundColor: "orange",
    filter: "brightness(90%)",
  },
  svg: {
    marginLeft: "5px",
  },
};

export const removeButtonStyle = {
  padding: "8px",
  border: "1px solid #fff",
  borderRadius: "10px",
  mb: "10px",
  backgroundColor: "green",
  transition: "background-color, 0.5s",
  width: "150px",
  "&:hover": {
    backgroundColor: "#cc4b4b",
    filter: "brightness(90%)",
  },
  svg: {
    marginLeft: "5px",
  },
};
