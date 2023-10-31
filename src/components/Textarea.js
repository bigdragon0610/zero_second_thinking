import { Box, Button, Container, Input, TextField } from '@mui/material'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { useContext } from 'react'
import { ContentContext } from '../App'
import { db } from '../firebase/firebase-config'
import { Editor } from '@monaco-editor/react'
import { isMobile } from 'react-device-detect'

const Textarea = ({ appBarHeight, titleHeight, buttonAreaHeight }) => {
  const {
    currentTargetContent,
    setCurrentTargetContent,
    setCanEditContent,
    prevContent,
    setContents,
  } = useContext(ContentContext)

  const onSubmit = () => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert('ログインして下さい')
        return
      }
      setCanEditContent(false)
      if (!currentTargetContent.id) {
        createContent(
          currentTargetContent.title,
          currentTargetContent.text,
          user.uid
        )
      } else {
        updateContent(currentTargetContent, currentTargetContent.text, user.uid)
      }
    })
  }

  const createContent = async (title, text, uid) => {
    const created_at = new Date()
    const docRef = await addDoc(collection(db, 'contents'), {
      title: title,
      text: text,
      uid: uid,
      created_at: created_at,
    })
    const createdContent = {
      id: docRef.id,
      title: title,
      text: text,
      created_at: created_at,
    }
    setCurrentTargetContent({
      ...createdContent,
    })
    setContents((prev) => [{ ...createdContent }, ...prev])
  }

  const cancelEditing = () => {
    setCanEditContent(false)
    setCurrentTargetContent({ ...prevContent })
  }

  const updateContent = async (content, text, uid) => {
    await setDoc(doc(db, 'contents', content.id), {
      title: content.title,
      text: text,
      uid: uid,
      created_at: content.created_at,
    })
    setCurrentTargetContent({ ...content, text: text })
    setContents((prev) => {
      prev.forEach((prevContent) => {
        if (prevContent.id === content.id) {
          prevContent.title = content.title
          prevContent.text = text
        }
      })
      return prev
    })
  }

  const onTitleChange = (e) => {
    setCurrentTargetContent((prev) => ({ ...prev, title: e.target.value }))
  }

  const onTextChange = (e) => {
    setCurrentTargetContent((prev) => ({
      ...prev,
      text: e.target.value,
    }))
  }

  const onTextChangeMonaco = (value) => {
    setCurrentTargetContent((prev) => ({
      ...prev,
      text: value,
    }))
  }

  const preventSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const onTabKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.target
      const value = target.value
      const before = value.substring(0, target.selectionStart)
      const after = value.substring(target.selectionEnd)
      target.value = before + '\t' + after
      target.selectionStart = target.selectionEnd = before.length + 1
    }
  }

  return (
    <Container component="form" maxWidth="md">
      <Box sx={{ height: titleHeight, lineHeight: titleHeight }}>
        <Input
          sx={{
            width: '50%',
          }}
          value={currentTargetContent.title}
          onChange={onTitleChange}
          placeholder="title"
          onKeyDown={preventSubmit}
        />
        {!isMobile && (
          <Box display={'inline-block'} width={'50%'} textAlign={'end'}>
            <Button
              variant="contained"
              onClick={cancelEditing}
              sx={{ marginRight: 2 }}
            >
              cancel
            </Button>
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={!currentTargetContent.title}
            >
              save
            </Button>
          </Box>
        )}
      </Box>
      {isMobile ? (
        <TextField
          multiline
          fullWidth
          defaultValue={currentTargetContent.text}
          placeholder="text"
          sx={{
            overflow: 'scroll',
            maxHeight: `calc(100vh - ${appBarHeight} - ${titleHeight} - ${buttonAreaHeight})`,
            tabSize: 4,
          }}
          onChange={onTextChange}
          onKeyDown={onTabKeyDown}
        />
      ) : (
        <Box sx={{ border: 1, borderColor: 'grey.400' }}>
          <Editor
            height={`calc(100vh - ${appBarHeight} - ${titleHeight} - ${buttonAreaHeight})`}
            defaultLanguage="markdown"
            defaultValue={currentTargetContent.text}
            onChange={onTextChangeMonaco}
          />
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          gap: 2,
          height: buttonAreaHeight,
          py: 1.5,
        }}
      >
        <Button variant="contained" onClick={cancelEditing}>
          cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!currentTargetContent.title}
        >
          save
        </Button>
      </Box>
    </Container>
  )
}

export default Textarea
