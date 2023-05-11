import { createContext, useState, useEffect } from 'react'
import BrowseScreen from './components/BrowseScreen'
import Textarea from './components/Textarea'
import { getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import { provider } from './firebase/firebase-config'
import Sidebar from './components/Sidebar'
import { AppBar, Box, IconButton, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LoginIcon from '@mui/icons-material/Login'
import Timer from './components/Timer'

export const UserContext = createContext()
export const ContentContext = createContext()

const auth = getAuth()

const signIn = () => {
  signInWithPopup(auth, provider).catch((error) => {
    alert('ログインに失敗しました')
    const errorMessage = error.message
    console.log(errorMessage)
  })
}

function App() {
  const EMPTY_CONTENT = {
    id: '',
    title: '',
    text: '',
    created_at: '',
  }

  const [loginUser, setLoginUser] = useState(null)
  const [currentTargetContent, setCurrentTargetContent] = useState({
    ...EMPTY_CONTENT,
  })
  const [canEditContent, setCanEditContent] = useState(true)
  const [prevContent, setPrevContent] = useState({ ...EMPTY_CONTENT })
  const [contents, setContents] = useState([
    {
      id: '',
      title: '',
      text: '',
      created_at: '',
    },
  ])
  const contentContextValue = {
    EMPTY_CONTENT,
    currentTargetContent,
    setCurrentTargetContent,
    canEditContent,
    setCanEditContent,
    prevContent,
    setPrevContent,
    contents,
    setContents,
  }

  const OPENED_DRAWER_WIDTH = '200px'

  const [drawerStatuses, setDrawerStatuses] = useState({
    open: false,
    width: 0,
  })

  const toggleDrawer = () => {
    setDrawerStatuses((prev) => ({
      open: !prev.open,
      width: prev.open ? 0 : OPENED_DRAWER_WIDTH,
    }))
  }

  const APP_BAR_HEIGHT = '52px'
  const TITLE_HEIGHT = '60px'
  const BUTTON_AREA_HEIGHT = '60px'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoginUser(user)
      } else {
        setLoginUser(null)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <ContentContext.Provider value={contentContextValue}>
      <AppBar
        position="static"
        sx={{
          height: APP_BAR_HEIGHT,
          position: 'relative',
        }}
      >
        <Box marginLeft={3}>
          <IconButton color="inherit" onClick={toggleDrawer}>
            <MenuIcon fontSize="large" />
          </IconButton>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box sx={{ ml: drawerStatuses.width }}>
            <Timer />
          </Box>
        </Box>
        <Box
          position="absolute"
          top="50%"
          right={0}
          marginRight={3}
          sx={{ transform: 'translateY(-50%)' }}
        >
          <IconButton
            color="inherit"
            sx={{
              display: `${loginUser ? 'none' : 'flex'}`,
              flexDirection: 'column',
            }}
            onClick={signIn}
          >
            <LoginIcon fontSize="medium" />
            <Typography
              variant="caption"
              sx={{ fontSize: '10px', fontWeight: 'bold' }}
            >
              Login
            </Typography>
          </IconButton>
        </Box>
      </AppBar>
      <Sidebar
        drawerStatuses={drawerStatuses}
        toggleDrawer={toggleDrawer}
        appBarHeight={APP_BAR_HEIGHT}
        loginUser={loginUser}
      />
      <Box
        sx={{
          width: `calc(100% - ${drawerStatuses.width})`,
          marginLeft: 'auto',
          height: `calc(100vh - ${APP_BAR_HEIGHT})`,
        }}
      >
        {canEditContent ? (
          <Textarea
            appBarHeight={APP_BAR_HEIGHT}
            titleHeight={TITLE_HEIGHT}
            buttonAreaHeight={BUTTON_AREA_HEIGHT}
          />
        ) : (
          <BrowseScreen
            appBarHeight={APP_BAR_HEIGHT}
            titleHeight={TITLE_HEIGHT}
            buttonAreaHeight={BUTTON_AREA_HEIGHT}
          />
        )}
      </Box>
    </ContentContext.Provider>
  )
}

export default App
