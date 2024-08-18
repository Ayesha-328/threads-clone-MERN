import React, { useEffect } from 'react'
import { Flex, Image, Link, useColorMode, Button, Badge, Box } from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from '../atoms/userAtom'
import { AiFillHome } from 'react-icons/ai'
import { RxAvatar } from 'react-icons/rx'
import { Link as RouterLink } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import useLogout from '../hooks/useLogout'
import authScreenAtom from '../atoms/authAtom'
import { useSetRecoilState } from 'recoil'
import { BsFillChatQuoteFill } from 'react-icons/bs'
import { MdOutlineSettings } from 'react-icons/md'
import { readUnreadMessageAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import { useSocket } from './../context/SocketContext'
import MessageSound from '../assets/sound/message.mp3'

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const user = useRecoilValue(userAtom)
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom)
  const [unreadMessageCount, setUnreadMessageCount] = useRecoilState(readUnreadMessageAtom)
  const { socket } = useSocket()
  const selectedConversation = useRecoilValue(selectedConversationAtom)

  useEffect(() => {
    socket?.on("newMessage", (message) => {
        if (!message.seen && selectedConversation._id !== message.conversationId ) {
          console.log('selected conversation'+ selectedConversation._id)
          console.log('message.conversaion'+ message.conversationId)
            setUnreadMessageCount(prev => prev + 1);
           
        }
    });
}, [socket]);


  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {user && (
        <Link as={RouterLink} to={"/"}>
          <AiFillHome size={24} />
        </Link>
      )}
      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
          Login
        </Link>
      )}
      <Image
        cursor={"pointer"}
        w={6}
        alt='logo'
        src={colorMode === "dark" ? "/images/light-logo.svg" : "/images/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {user && (
        <Flex alignItems={'center'} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Link as={RouterLink} to={`/settings`}>
            <MdOutlineSettings size={24} />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <Box position={'relative'}>
              <BsFillChatQuoteFill size={20} />
            </Box>
            {unreadMessageCount > 0 && (
              <Badge position={'absolute'} top={-2} color={'white'} ml={2} bg={'red.500'} borderRadius={'full'}>
                {unreadMessageCount}
              </Badge>
            )}
          </Link>
          <Button size={"xs"} onClick={logout}>
            <FiLogOut />
          </Button>
        </Flex>
      )}
      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
          Sign Up
        </Link>
      )}
    </Flex>
  )
}

export default Header
