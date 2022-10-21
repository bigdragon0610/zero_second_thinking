import { Button, Container, Input, TextField } from "@mui/material";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useContext, useRef } from "react";
import { ContentContext } from "../App";
import { db } from "../firebase/firebase-config";

const Textarea = () => {
  const { content, setContent, setCanEditContent } = useContext(ContentContext);
  const titleRef = useRef();
  const textRef = useRef();
  const onSubmit = () => {
    if (content.id) {
      updateContent(content.id, titleRef.current.value, textRef.current.value);
    } else {
      createContent(titleRef.current.value, textRef.current.value);
    }
    setCanEditContent(false);
  };

  const createContent = async (title, text) => {
    const updated_at = new Date();
    const docRef = await addDoc(collection(db, "contents"), {
      title: title,
      text: text,
      updated_at: updated_at,
    });
    setContent({
      id: docRef.id,
      title: title,
      text: text,
      updated_at: updated_at,
    });
  };

  const updateContent = async (id, title, text) => {
    const updated_at = new Date();
    await setDoc(doc(db, "contents", id), {
      title: title,
      text: text,
      updated_at: updated_at,
    });
    setContent({
      id: id,
      title: title,
      text: text,
      updated_at: updated_at,
    });
  };

  return (
    <Container component='form' maxWidth='md' sx={{ py: 2 }}>
      <Input
        sx={{ mb: 3, width: "50%" }}
        placeholder='title'
        inputRef={titleRef}
        defaultValue={content.title}
      />
      <TextField
        multiline
        fullWidth
        inputRef={textRef}
        defaultValue={content.text}
        placeholder='text'
      />
      <Button
        variant='contained'
        sx={{ mt: 2, ml: "auto", display: "block" }}
        onClick={onSubmit}
      >
        send
      </Button>
    </Container>
  );
};

export default Textarea;
