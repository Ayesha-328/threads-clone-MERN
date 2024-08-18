import {
    Box,
    Flex,
    Text,
    Button,
    Input,
    useColorModeValue,
    Skeleton,
    SkeletonCircle,
    Badge
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'
import Conversations from '../components/Conversations'
import { GiConversation } from 'react-icons/gi'
import MessageContainer from '../components/MessageContainer'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import conversationsAtom, { readUnreadMessageAtom } from '../atoms/messagesAtom'
import { selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'
import { useSocket } from './../context/SocketContext'

const ChatPage = () => {
    const showToast = useShowToast()
    const [loadingConversations, setLoadingConversations] = useState(true)
    const [conversations, setConversations] = useRecoilState(conversationsAtom)
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const [searchText, setSearchText] = useState("")
    const [searchingUser, setSearchingUser] = useState(false)
    const currentUser = useRecoilValue(userAtom)
    const { socket, onlineUsers } = useSocket()
    const unreadMessagesCount = useRecoilValue(readUnreadMessageAtom)
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        socket?.on("messagesSeen", ({ conversationId }) => {
            setConversations(prev => {
                const updatedConv = prev.map(conv => {
                    if (conv._id === conversationId) {
                        return {
                            ...conv,
                            lastMessage: { ...conv.lastMessage, seen: true }
                        }
                    }
                    return conv
                })
                return updatedConv
            })
        })

    }, [socket, setConversations])


    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await fetch(`${apiUrl}/messages/conversations`,{
                    credentials: "include", // This will send cookies with the request
                })
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error", 5000)
                    return
                }
                setConversations(data)

            } catch (error) {
                showToast("Error", error.message, "error", 5000)

            } finally {
                setLoadingConversations(false)
            }
        }
        getConversations()
    }, [showToast, setConversations, onlineUsers])

    const handleConversationSearch = async (e) => {
        e.preventDefault();
        setSearchingUser(true);
        try {
            const res = await fetch(`${apiUrl}/users/profile/${searchText}`,{
                credentials: "include", // This will send cookies with the request
            })
            const searchUser = await res.json()

            if (searchUser.error) {
                showToast("Error", searchUser.error, "error", 5000)
                return
            }

            const messagingYourself = searchUser._id === currentUser._id
            if (messagingYourself) return showToast("Error", "You can not message yourself", "error", 5000)

            const conversationAlreadyExsits = conversations.find(conv => conv.participants[0]._id === searchUser._id)
            if (conversationAlreadyExsits) {
                setSelectedConversation({
                    _id: conversationAlreadyExsits._id,
                    userId: searchUser._id,
                    username: searchUser.username,
                    userProfilePic: searchUser.profilePic
                })
            }

            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: "",
                    sender: ""
                },
                _id: Date.now(),
                participants: [{
                    _id: searchUser._id,
                    username: searchUser.username,
                    profilePic: searchUser.profilePic

                }]
            }
            setConversations((prevConv) => [...prevConv, mockConversation])


        } catch (error) {
            showToast("Error", error.message, "error", 5000)

        } finally {
            setSearchingUser(false)
        }
    }

    return (
        <Box position={'absolute'}
            left={'50%'}
            w={{ base: '100%', md: '80%', lg: '750px' }}
            transform={'translateX(-50%)'}
            p={4}
        >
            <Flex
                gap={4}
                flexDirection={{
                    base: "column",
                    md: 'row'
                }}
                maxW={{ sm: '400px', md: 'full' }}
                mx={'auto'}
            >
                <Flex
                    flex={30}
                    flexDirection={'column'}
                    maxW={{
                        sm: '250px',
                        md: 'full'
                    }
                    }
                    mx={'auto  '}
                >
                    <Text fontWeight={700} color={useColorModeValue("gray.600", 'gray.400')}>
                        Your Conversations
                        {unreadMessagesCount > 0 && (
                            <Badge ml={2} colorScheme="red">
                                {unreadMessagesCount}
                            </Badge>
                        )}
                    </Text>
                    <form onSubmit={handleConversationSearch}>
                        <Flex alignItems={'center'} gap={2}>
                            <Input placeholder='Search' name='searchText' onChange={(e) => setSearchText(e.target.value)} />
                            <Button size={'sm'} onClick={handleConversationSearch} isLoading={searchingUser}>
                                <SearchIcon />
                            </Button>
                        </Flex>
                    </form>

                    {loadingConversations ? (
                        [0, 1, 2, 3, 4].map((_, i) => (
                            <Flex key={i} gap={4} alignItems={'center'} p={'1'} borderRadius={'md'}>
                                <Box>
                                    <SkeletonCircle size={10} />
                                </Box>
                                <Flex w={'full'} flexDirection={'column'} gap={3}>
                                    <Skeleton h={'10px'} w={'80px'} />
                                    <Skeleton h={'8px'} w={'90% '} />
                                </Flex>
                            </Flex>
                        ))
                    )
                        :
                        conversations.map((conv) => {
                            return <Conversations key={conv._id} isOnline={onlineUsers.includes(conv.participants[0]._id)} conversation={conv} />
                        })

                    }



                </Flex>

                {selectedConversation._id ? (
                    <MessageContainer />
                )
                    :
                    (
                        <Flex
                            flex={70}
                            borderRadius={'md'}
                            p={2}
                            flexDirection={'column'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            height={'400px'}
                        >
                            <GiConversation size={100} />
                            <Text fontSize={20}>Select a conversation to start a chat.</Text>
                        </Flex>
                    )
                }


            </Flex>
        </Box>
    )
}

export default ChatPage