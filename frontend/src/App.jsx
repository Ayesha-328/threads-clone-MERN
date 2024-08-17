import {
  Box,
  Button,
  Container,
} from "@chakra-ui/react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./components/Header"
import Homepage from './pages/Homepage'
import AuthPage from "./pages/AuthPage"
import { useRecoilValue } from "recoil"
import userAtom from './atoms/userAtom'
import LogoutButton from "./components/LogoutButton"
import UpdateProfilePage from "./pages/UpadateProfilePage"
import CreatePost from "./components/CreatePost"
import ChatPage from "./pages/ChatPage"
import { useEffect } from "react"
import SettingsPage from "./pages/SettingsPage"



function App() {
  const user = useRecoilValue(userAtom);
  console.log(user)
  const {pathname} = useLocation()

  useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            // The user is no longer on the page or has minimized the window
        } else if (document.visibilityState === 'visible') {
            // The user has returned to the page
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}, []);


  return (
    <Box position={"relative"} w={'full'}>
    <Container maxW={pathname ==="/"? {base:"620px", md:"900px"} : "620px"} >
      <Header />
      <Routes>
        <Route path="/" element={user ? <Homepage /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
        <Route path="/:username" element={user ? (
          <>
            <UserPage />
            <CreatePost />
          </>
        )
          :
          (<UserPage />)} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/auth" />} />
        <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/auth" />} />
      </Routes>

      {/* {user && <LogoutButton />} */}

    </Container>
    </Box>
  )
}

export default App
