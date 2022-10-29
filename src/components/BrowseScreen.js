import { Box, Button, Container, Paper } from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import { useContext } from "react";
import { ContentContext } from "../App";
import { db } from "../firebase/firebase-config";

const BrowseScreen = () => {
  const {
    EMPTY_CONTENT,
    currentTargetContent,
    setCurrentTargetContent,
    setCanEditContent,
    setPrevContent,
    setContents,
  } = useContext(ContentContext);

  const startEditing = () => {
    setCanEditContent(true);
    setPrevContent({ ...currentTargetContent });
  };

  const createNewContent = () => {
    setCurrentTargetContent({ ...EMPTY_CONTENT });
    setPrevContent({ ...currentTargetContent });
    setCanEditContent(true);
  };

  const deleteContent = async () => {
    if (!window.confirm("削除しますか？")) {
      return;
    }
    await deleteDoc(doc(db, "contents", currentTargetContent.id));
    setCurrentTargetContent({ ...EMPTY_CONTENT });
    setContents((prev) =>
      prev.filter((prev) => prev.id !== currentTargetContent.id)
    );
  };

  return (
    <Container maxWidth='md' sx={{ py: 3 }}>
      <Box
        title={currentTargetContent.title}
        sx={{
          pl: 0,
          my: 2,
          fontSize: "20px",
          whiteSpace: "nowrap",
          overflow: "scroll",
          maxWidth: "100%",
        }}
      >
        {currentTargetContent.title}
      </Box>
      <Paper
        variant='outlined'
        sx={{
          whiteSpace: "pre-wrap",
          p: 2,
          maxHeight: "75vh",
          overflow: "scroll",
        }}
        square
      >
        {currentTargetContent.text}
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "end", gap: 2, mt: 2 }}>
        <Button
          variant='contained'
          onClick={deleteContent}
          disabled={!currentTargetContent.id}
        >
          delete
        </Button>
        <Button variant='contained' onClick={createNewContent}>
          new
        </Button>
        <Button
          variant='contained'
          onClick={startEditing}
          disabled={!currentTargetContent.id}
        >
          edit
        </Button>
      </Box>
    </Container>
  );
};

export default BrowseScreen;
