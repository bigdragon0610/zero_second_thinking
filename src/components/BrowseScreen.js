import { Box, Button, CardHeader, Container, Paper } from "@mui/material";
import { useContext } from "react";
import { ContentContext } from "../App";

const BrowseScreen = () => {
  const {
    EMPTY_CONTENT,
    currentTargetContent,
    setCurrentTargetContent,
    setCanEditContent,
    setPrevContent,
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

  return (
    <Container maxWidth='md' sx={{ py: 3 }}>
      <CardHeader
        title={currentTargetContent.title}
        sx={{ pl: 0 }}
      ></CardHeader>
      <Paper variant='outlined' sx={{ whiteSpace: "pre-wrap", p: 2 }} square>
        {currentTargetContent.text}
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "end", gap: 2, mt: 2 }}>
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
