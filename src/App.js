import { createContext, useState } from "react";
import BrowseScreen from "./components/BrowseScreen";
import Textarea from "./components/Textarea";

export const ContentContext = createContext();

function App() {
  const [content, setContent] = useState("");
  const [canEditContent, setCanEditContent] = useState(true);
  const value = {
    content,
    setContent,
    canEditContent,
    setCanEditContent,
  };

  return (
    <ContentContext.Provider value={value}>
      {canEditContent ? <Textarea /> : <BrowseScreen />}
    </ContentContext.Provider>
  );
}

export default App;
