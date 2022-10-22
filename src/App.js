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

  const [content, setContent] = useState({
    id: "",
    title: "",
    text: "",
    created_at: "",
  });
  const [canEditContent, setCanEditContent] = useState(true);
  const contentContextValue = {
    content,
    setContent,
    canEditContent,
    setCanEditContent,
  };

  return (
    <ContentContext.Provider value={contentContextValue}>
      <UserContext.Provider value={userContextValue}>
        {canEditContent ? <Textarea /> : <BrowseScreen />}
      </UserContext.Provider>
    </ContentContext.Provider>
  );
}

export default App;
