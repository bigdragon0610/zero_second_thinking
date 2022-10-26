import { createContext, useEffect, useState } from "react";
import BrowseScreen from "./components/BrowseScreen";
import Textarea from "./components/Textarea";
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { provider } from "./firebase/firebase-config";
import Sidebar from "./components/Sidebar";
import { AppBar, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

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
  const [uid, setUid] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });
  }, []);

  const userContextValue = {
    uid,
    signIn,
  };

  const EMPTY_CONTENT = {
    id: "",
    title: "",
    text: "",
    created_at: "",
  };

  const [content, setContent] = useState({ ...EMPTY_CONTENT });
  const [canEditContent, setCanEditContent] = useState(true);
  const [prevContent, setPrevContent] = useState({ ...EMPTY_CONTENT });
  const contentContextValue = {
    EMPTY_CONTENT,
    content,
    setContent,
    canEditContent,
    setCanEditContent,
    prevContent,
    setPrevContent,
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

  return (
    <ContentContext.Provider value={contentContextValue}>
      <UserContext.Provider value={userContextValue}>
        <AppBar
          position='static'
          sx={{
            height: APP_BAR_HEIGHT,
            pl: 2,
          }}
        >
          <Box>
            <IconButton color='inherit' onClick={toggleDrawer}>
              <MenuIcon fontSize='large' />
            </IconButton>
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
          }}
        >
          {canEditContent ? <Textarea /> : <BrowseScreen />}
        </Box>
      </UserContext.Provider>
    </ContentContext.Provider>
  );
}

export default App;
