import { createContext, useState } from "react";
import BrowseScreen from "./components/BrowseScreen";
import Textarea from "./components/Textarea";
import {
  // eslint-disable-next-line
  Auth,
  getAuth,
  // eslint-disable-next-line
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { provider } from "./firebase/firebase-config";
import Sidebar from "./components/Sidebar";
import { AppBar, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Timer from "./components/Timer";

export const UserContext = createContext();
export const ContentContext = createContext();

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("ログインして下さい");
    signIn(auth, provider);
  }
});

/**
 *
 * @param {Auth} auth
 * @param {GoogleAuthProvider} provider
 */
const signIn = () => {
  signInWithPopup(auth, provider).catch((error) => {
    alert("ログインに失敗しました");
    const errorMessage = error.message;
    console.log(errorMessage);
  });
};

function App() {
  const userContextValue = {
    signIn,
  };

  const EMPTY_CONTENT = {
    id: "",
    title: "",
    text: "",
    created_at: "",
  };

  const [currentTargetContent, setCurrentTargetContent] = useState({
    ...EMPTY_CONTENT,
  });
  const [canEditContent, setCanEditContent] = useState(true);
  const [prevContent, setPrevContent] = useState({ ...EMPTY_CONTENT });
  const [contents, setContents] = useState([
    {
      id: "",
      title: "",
      text: "",
      created_at: "",
    },
  ]);
  const contentContextValue = {
    EMPTY_CONTENT,
    currentTargetContent,
    setCurrentTargetContent,
    canEditContent,
    setCanEditContent,
    prevContent,
    setPrevContent,
    contents,
    setContents,
  };

  const OPENED_DRAWER_WIDTH = "200px";

  const [drawerStatuses, setDrawerStatuses] = useState({
    open: false,
    width: 0,
  });

  const toggleDrawer = () => {
    setDrawerStatuses((prev) => ({
      open: !prev.open,
      width: prev.open ? 0 : OPENED_DRAWER_WIDTH,
    }));
  };

  const APP_BAR_HEIGHT = "52px";
  const TITLE_HEIGHT = "60px";
  const BUTTON_AREA_HEIGHT = "60px";

  document.onkeydown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target;
      const value = target.value;
      const before = value.substring(0, target.selectionStart);
      const after = value.substring(target.selectionEnd);
      target.value = before + "\t" + after;
      target.selectionStart = target.selectionEnd = before.length + 1;
    }

    if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      toggleDrawer();
    }
  };

  return (
    <ContentContext.Provider value={contentContextValue}>
      <UserContext.Provider value={userContextValue}>
        <AppBar
          position='static'
          sx={{
            height: APP_BAR_HEIGHT,
            pl: 2,
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <IconButton color='inherit' onClick={toggleDrawer}>
              <MenuIcon fontSize='large' />
            </IconButton>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Box sx={{ ml: drawerStatuses.width }}>
              <Timer />
            </Box>
          </Box>
        </AppBar>
        <Sidebar
          drawerStatuses={drawerStatuses}
          toggleDrawer={toggleDrawer}
          appBarHeight={APP_BAR_HEIGHT}
        />
        <Box
          sx={{
            width: `calc(100% - ${drawerStatuses.width})`,
            marginLeft: "auto",
            height: `calc(100vh - ${APP_BAR_HEIGHT})`,
          }}
        >
          {canEditContent ? (
            <Textarea
              appBarHeight={APP_BAR_HEIGHT}
              titleHeight={TITLE_HEIGHT}
              buttonAreaHeight={BUTTON_AREA_HEIGHT}
            />
          ) : (
            <BrowseScreen
              appBarHeight={APP_BAR_HEIGHT}
              titleHeight={TITLE_HEIGHT}
              buttonAreaHeight={BUTTON_AREA_HEIGHT}
            />
          )}
        </Box>
      </UserContext.Provider>
    </ContentContext.Provider>
  );
}

export default App;
