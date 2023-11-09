import { Box, Button, Container, Paper } from '@mui/material'
import { deleteDoc, doc } from 'firebase/firestore'
import { useContext } from 'react'
import { ContentContext } from '../App'
import { db } from '../firebase/firebase-config'
import { isMobile } from 'react-device-detect'
import { Editor } from '@monaco-editor/react'

const BrowseScreen = ({ appBarHeight, titleHeight, buttonAreaHeight }) => {
  const {
    EMPTY_CONTENT,
    currentTargetContent,
    setCurrentTargetContent,
    setCanEditContent,
    setPrevContent,
    setContents,
  } = useContext(ContentContext)

  const startEditing = () => {
    setCanEditContent(true)
    setPrevContent({ ...currentTargetContent })
  }

  const createNewContent = () => {
    setCurrentTargetContent({ ...EMPTY_CONTENT })
    setPrevContent({ ...currentTargetContent })
    setCanEditContent(true)
  }

  const deleteContent = async () => {
    if (!window.confirm('削除しますか？')) {
      return
    }
    await deleteDoc(doc(db, 'contents', currentTargetContent.id))
    setCurrentTargetContent({ ...EMPTY_CONTENT })
    setContents((prev) =>
      prev.filter((prev) => prev.id !== currentTargetContent.id)
    )
  }

  return (
    <Container maxWidth="md">
      <Box
        title={currentTargetContent.title}
        sx={{
          lineHeight: titleHeight,
          mt: currentTargetContent.title ? 0 : 1,
          pt: 0.5,
          mb: -0.5,
          display: 'block',
          fontSize: '20px',
          whiteSpace: 'nowrap',
          overflow: 'scroll',
          maxWidth: '100%',
        }}
      >
        {currentTargetContent.title}
      </Box>
      {isMobile ? (
        <Paper
          variant="outlined"
          sx={{
            display: currentTargetContent.text ? 'block' : 'none',
            whiteSpace: 'pre-wrap',
            p: 1.5,
            maxHeight: `calc(100vh - ${appBarHeight} - ${titleHeight} - ${buttonAreaHeight})`,
            overflow: 'scroll',
            tabSize: 4,
          }}
          square
        >
          {currentTargetContent.text}
        </Paper>
      ) : (
        <Box
          sx={{
            display: currentTargetContent.text ? 'block' : 'none',
            border: 1,
            borderColor: 'grey.400',
          }}
        >
          <Editor
            height={`calc(100vh - ${appBarHeight} - ${titleHeight} - ${buttonAreaHeight})`}
            defaultLanguage="markdown"
            defaultValue={currentTargetContent.text}
            options={{
              readOnly: true,
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          height: buttonAreaHeight,
          py: 1.5,
          display: 'flex',
          justifyContent: 'end',
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={deleteContent}
          disabled={!currentTargetContent.id}
        >
          delete
        </Button>
        <Button variant="contained" onClick={createNewContent}>
          new
        </Button>
        <Button
          variant="contained"
          onClick={startEditing}
          disabled={!currentTargetContent.id}
        >
          edit
        </Button>
      </Box>
    </Container>
  )
}

export default BrowseScreen
