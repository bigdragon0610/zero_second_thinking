import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ContentContext } from "../App";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Sidebar = ({ drawerStatuses, toggleDrawer, appBarHeight }) => {
  const { setCurrentTargetContent, canEditContent } =
    useContext(ContentContext);

  const [contents, setContents] = useState([
    {
      id: "",
      title: "",
      text: "",
      created_at: "",
    },
  ]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      const q = query(
        collection(db, "contents"),
        where("uid", "==", user.uid),
        orderBy("created_at", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetchedContents = [];
      querySnapshot.forEach((doc) => {
        fetchedContents.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      if (fetchedContents.length) {
        setContents([...fetchedContents]);
      }
    });
  }, []);

  const showOldContent = (content) => {
    setCurrentTargetContent({ ...content });
  };

  return (
    <Drawer open={drawerStatuses.open} variant='persistent'>
      <Box
        sx={{ height: appBarHeight, display: "flex", justifyContent: "end" }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List dense={true}>
        {contents.map((content) => {
          return (
            <ListItemButton
              sx={{
                width: "200px",
                display: "block",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                fontSize: "14px",
              }}
              onClick={() => showOldContent(content)}
              disabled={canEditContent}
            >
              {content.title}
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
