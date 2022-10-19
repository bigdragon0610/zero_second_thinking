import { Button, Container, TextField } from "@mui/material";
import { useContext, useRef } from "react";
import { ContentContext } from "../App";

const Textarea = () => {
  const { content, setContent, setCanEditContent } = useContext(ContentContext);
  const inputRef = useRef();
  const onSubmit = () => {
    setContent(inputRef.current.value);
    setCanEditContent(false);
  };

  return (
    <Container component='form' maxWidth='md' sx={{ py: 2 }}>
      <TextField
        multiline
        fullWidth
        inputRef={inputRef}
        defaultValue={content}
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
