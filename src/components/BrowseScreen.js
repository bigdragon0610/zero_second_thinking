import { Box, Button, CardHeader, Container, Paper } from "@mui/material";
import { useContext } from "react";
import { ContentContext } from "../App";

const BrowseScreen = () => {
  const {
    EMPTY_CONTENT,
    content,
    setContent,
    setCanEditContent,
    setPrevContent,
  } = useContext(ContentContext);

  const startEditing = () => {
    setCanEditContent(true);
    setPrevContent({ ...content });
  };

  const createNewContent = () => {
    setContent({ ...EMPTY_CONTENT });
    setPrevContent({ ...content });
    setCanEditContent(true);
  };

  return (
    <Container maxWidth='md' sx={{ py: 3 }}>
      <CardHeader title={content.title} sx={{ pl: 0 }}></CardHeader>
      <Paper variant='outlined' sx={{ whiteSpace: "pre-wrap", p: 2 }} square>
        {content.text}
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "end", gap: 2, mt: 2 }}>
        <Button variant='contained' onClick={createNewContent}>
          new
        </Button>
        <Button
          variant='contained'
          onClick={startEditing}
          disabled={!content.id}
        >
          edit
        </Button>
      </Box>
    </Container>
  );
};

export default BrowseScreen;
