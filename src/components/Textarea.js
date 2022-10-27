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
      updateContent(content, textRef.current.value);
    }
  };

  const createContent = async (title, text) => {
    const created_at = new Date();
    const docRef = await addDoc(collection(db, "contents"), {
      title: title,
      text: text,
      uid: uid,
      created_at: created_at,
    });
    setContent({
      id: docRef.id,
      title: title,
      text: text,
      created_at: created_at,
    });
  };

  const cancelEditing = () => {
    setCanEditContent(false);
    setContent({ ...prevContent });
  };

  const updateContent = async (content, text) => {
    await setDoc(doc(db, "contents", content.id), {
      title: content.title,
      text: text,
      uid: uid,
      created_at: content.created_at,
    });
    setContent({ ...content, text: text });
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
