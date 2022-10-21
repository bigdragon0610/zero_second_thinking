import { Button, CardHeader, Container, Paper } from "@mui/material";
import { useContext } from "react";
import { ContentContext } from "../App";

const BrowseScreen = () => {
  const { content, setCanEditContent } = useContext(ContentContext);
  return (
    <Container maxWidth='md' sx={{ py: 2 }}>
      <CardHeader title={content.title}></CardHeader>
      <Paper variant='outlined' sx={{ whiteSpace: "pre-wrap", p: 2 }} square>
        {content.text}
      </Paper>
      <Button
        variant='contained'
        sx={{ mt: 2, ml: "auto", display: "block" }}
        onClick={() => setCanEditContent(true)}
      >
        edit
      </Button>
    </Container>
  );
};

export default BrowseScreen;
