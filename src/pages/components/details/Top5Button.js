import { useEffect, useState } from "react";
import { ButtonBase, Tooltip } from "@mui/material";
import { addButtonStyle, removeButtonStyle } from "./ButtonStyles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../credentials";
import Top5Modal from "../modals/Top5Modal";

export default function Top5Button(props) {
  const setModal = props.setModal;
  const closeModal = props.closeModal;
  const openModal = props.openModal;
  const gameId = props.gameId.toString();
  const [topObject, setTopObject] = useState({});

  useEffect(() => {
    checkTop5();
  }, []);

  useEffect(() => {
    let added = false;

    for (const prop in topObject) {
      if (topObject[prop] == gameId) {
        added = true;
        setToggleBtn(removeBtn);
      }
    }

    if (added == false) {
      setToggleBtn(addBtn);
    }
  }, [topObject]);

  const checkTop5 = async () => {
    try {
      let userDoc = await getDoc(doc(db, "GameDB", auth.currentUser.uid));
      userDoc = userDoc.data();

      setTopObject(userDoc.topfive);
    } catch (error) {
      console.log(error.message);
    }
  };

  const remove = async () => {
    try {
      let objectCopy = topObject;

      for (const prop in objectCopy) {
        if (objectCopy[prop] == gameId) {
          objectCopy[prop] = "";
        }
      }

      setTopObject(objectCopy);

      await updateDoc(doc(db, "GameDB", auth.currentUser.uid), {
        topfive: objectCopy,
      }).then(() => {
        checkTop5();
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const addBtn = (
    <div>
      <ButtonBase
        sx={addButtonStyle}
        onClick={() => {
          openModal();
          setModal(
            <Top5Modal
              gameId={gameId}
              closeModal={closeModal}
              topObject={topObject}
              setTopObject={setTopObject}
              checkTop5={checkTop5}
            />
          );
        }}
      >
        Add to Top 5 <AddIcon fontSize="small" />
      </ButtonBase>
    </div>
  );

  const removeBtn = (
    <Tooltip title="Remove" placement="right">
      <ButtonBase sx={removeButtonStyle} onClick={remove}>
        On Top Five <CheckIcon fontSize="small" />
      </ButtonBase>
    </Tooltip>
  );

  const [toggleBtn, setToggleBtn] = useState(addBtn);

  return <div>{toggleBtn}</div>;
}
