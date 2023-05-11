import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
} from '@mui/material'
import { useContext, useEffect } from 'react'
import { ContentContext } from '../App'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '../firebase/firebase-config'
import { useRef } from 'react'

const Sidebar = ({ drawerStatuses, toggleDrawer, appBarHeight, loginUser }) => {
  const {
    currentTargetContent,
    setCurrentTargetContent,
    canEditContent,
    setCanEditContent,
    contents,
    setContents,
  } = useContext(ContentContext)

  const ref = useRef(true)
  useEffect(() => {
    if (ref.current) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          toggleDrawer()
        }
      })
      ref.current = false
    }
  }, [toggleDrawer])

  useEffect(() => {
    const getContents = async () => {
      if (!loginUser) {
        return
      }
      const q = query(
        collection(db, 'contents'),
        where('uid', '==', loginUser.uid),
        orderBy('created_at', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const fetchedContents = []
      querySnapshot.forEach((doc) => {
        fetchedContents.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      if (fetchedContents.length) {
        setContents([...fetchedContents])
      }
    }
    getContents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginUser])

  const showOldContent = (content) => {
    setCurrentTargetContent({ ...content })
    setCanEditContent(false)
  }

  const canShowOldContent = canEditContent
    ? !currentTargetContent.title && !currentTargetContent.text
    : true

  return (
    <Drawer open={drawerStatuses.open} variant="persistent">
      <Box
        sx={{ height: appBarHeight, display: 'flex', justifyContent: 'end' }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List
        dense={true}
        sx={{
          maxHeight: `calc(100vh - ${appBarHeight})`,
          overflow: 'scroll',
        }}
      >
        {contents.map((content) => {
          return (
            <ListItemButton
              key={content.id}
              sx={{
                width: '200px',
                display: 'block',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                fontSize: '14px',
              }}
              onClick={() => showOldContent(content)}
              disabled={!canShowOldContent}
            >
              {content.title}
            </ListItemButton>
          )
        })}
      </List>
    </Drawer>
  )
}

export default Sidebar
