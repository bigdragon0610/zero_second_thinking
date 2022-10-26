import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
} from "@mui/material";
import { useContext } from "react";
import { ContentContext } from "../App";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const Sidebar = ({ drawerStatuses, toggleDrawer, appBarHeight }) => {
  const { setContent, canEditContent } = useContext(ContentContext);

  const contents = [
    {
      id: "test",
      title: "test",
      text: "test content\ntest",
    },
    {
      id: "test2",
      title: "test2",
      text: "test2 content\ntest2",
    },
    {
      id: "test3",
      title: "test3",
      text: "test3 content\ntest3",
    },
  ];

  const showOldContent = (content) => {
    setContent({ ...content });
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
