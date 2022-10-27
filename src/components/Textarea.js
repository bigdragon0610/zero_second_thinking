import { Box, Button, Container, Input, TextField } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useContext, useRef } from "react";
import { ContentContext, UserContext } from "../App";
import { db } from "../firebase/firebase-config";

const Textarea = () => {
  const {
    currentTargetContent,
    setCurrentTargetContent,
    setCanEditContent,
    prevContent,
    setContents,
  } = useContext(ContentContext);
  const { signIn } = useContext(UserContext);

  const textRef = useRef();

  const onSubmit = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("ログインして下さい");
        signIn();
        return;
      }
      setCanEditContent(false);
      if (!currentTargetContent.id) {
        createContent(
          currentTargetContent.title,
          textRef.current.value,
          user.uid
        );
      } else {
        updateContent(currentTargetContent, textRef.current.value, user.uid);
      }
    });
  };

  const createContent = async (title, text, uid) => {
    const created_at = new Date();
    const docRef = await addDoc(collection(db, "contents"), {
      title: title,
      text: text,
      uid: uid,
      created_at: created_at,
    });
    const createdContent = {
      id: docRef.id,
      title: title,
      text: text,
      created_at: created_at,
    };
    setCurrentTargetContent({
      ...createdContent,
    });
    setContents((prev) => [{ ...createdContent }, ...prev]);
  };

  const cancelEditing = () => {
    setCanEditContent(false);
    setCurrentTargetContent({ ...prevContent });
  };

  const updateContent = async (content, text, uid) => {
    await setDoc(doc(db, "contents", content.id), {
      title: content.title,
      text: text,
      uid: uid,
      created_at: content.created_at,
    });
    setCurrentTargetContent({ ...content, text: text });
    setContents((prev) => {
      prev.forEach((prevContent) => {
        if (prevContent.id === content.id) {
          prevContent.title = content.title;
          prevContent.text = text;
        }
      });
      return prev;
    });
  };

  const onTitleChange = (e) => {
    setCurrentTargetContent((prev) => ({ ...prev, title: e.target.value }));
  };

  return (
    <Container component='form' maxWidth='md' sx={{ py: 3 }}>
      <Input
        sx={{ mb: 3, width: "50%" }}
        value={currentTargetContent.title}
        onChange={onTitleChange}
        placeholder='title'
      />
      <TextField
        multiline
        fullWidth
        inputRef={textRef}
        defaultValue={currentTargetContent.text}
        placeholder='text'
      />
      <Box sx={{ display: "flex", justifyContent: "end", gap: 2, mt: 2 }}>
        <Button variant='contained' onClick={cancelEditing}>
          cancel
        </Button>
        <Button
          variant='contained'
          onClick={onSubmit}
          disabled={!currentTargetContent.title}
        >
          send
        </Button>
      </Box>
    </Container>
  );
};

export default Textarea;
