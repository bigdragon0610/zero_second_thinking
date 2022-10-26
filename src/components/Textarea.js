import { Box, Button, Container, Input, TextField } from "@mui/material";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useContext, useRef } from "react";
import { ContentContext, UserContext } from "../App";
import { db } from "../firebase/firebase-config";

const Textarea = () => {
  const { content, setContent, setCanEditContent, prevContent } =
    useContext(ContentContext);
  const { uid, signIn } = useContext(UserContext);

  const textRef = useRef();

  const onSubmit = () => {
    if (!uid) {
      alert("ログインして下さい");
      signIn();
      return;
    }
    setCanEditContent(false);
    if (!content.id) {
      createContent(content.title, textRef.current.value);
    } else {
      updateContent(content.id, content.title, textRef.current.value);
    }
  };

  const createContent = async (title, text) => {
    const updated_at = new Date();
    const docRef = await addDoc(collection(db, "contents"), {
      title: title,
      text: text,
      uid: uid,
      updated_at: updated_at,
    });
    setContent({
      id: docRef.id,
      title: title,
      text: text,
      updated_at: updated_at,
    });
  };

  const cancelEditing = () => {
    setCanEditContent(false);
    setContent({ ...prevContent });
  };

  const updateContent = async (id, title, text) => {
    const updated_at = new Date();
    await setDoc(doc(db, "contents", id), {
      title: title,
      text: text,
      uid: uid,
      updated_at: updated_at,
    });
    setContent({
      id: id,
      title: title,
      text: text,
      updated_at: updated_at,
    });
  };

  const onTitleChange = (e) => {
    setContent((prev) => ({ ...prev, title: e.target.value }));
  };

  return (
    <Container component='form' maxWidth='md' sx={{ py: 3 }}>
      <Input
        sx={{ mb: 3, width: "50%" }}
        value={content.title}
        onChange={onTitleChange}
        placeholder='title'
      />
      <TextField
        multiline
        fullWidth
        inputRef={textRef}
        defaultValue={content.text}
        placeholder='text'
      />
      <Box sx={{ display: "flex", justifyContent: "end", gap: 2, mt: 2 }}>
        <Button variant='contained' onClick={cancelEditing}>
          cancel
        </Button>
        <Button
          variant='contained'
          onClick={onSubmit}
          disabled={!content.title}
        >
          send
        </Button>
      </Box>
    </Container>
  );
};

export default Textarea;
