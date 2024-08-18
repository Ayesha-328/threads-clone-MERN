import { Flex, useColorModeValue, Text, Image, Divider, Avatar, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import React, { useEffect, useState, useRef } from 'react'
import Message from './Message'
import MessageInput from './MessageInput'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import conversationsAtom, { readUnreadMessageAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from "../atoms/userAtom"
import { useSocket } from './../context/SocketContext'
import MessageSound from '../assets/sound/message.mp3'
const MessageContainer = () => {
    const showToast = useShowToast()
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const [loadingMessages, setLoadingMessages] = useState(true)
    const [messages, setMessages] = useState([])
    const currentUser = useRecoilValue(userAtom)
    const { socket, onlineUsers } = useSocket()
    const online = onlineUsers.includes(selectedConversation.userId)
    const setConversations = useSetRecoilState(conversationsAtom)
    const messageEndRef = useRef(null)
    const [unreadMessagesCount , setUnreadMessageCount] = useRecoilState(readUnreadMessageAtom)
    const apiUrl = import.meta.env.VITE_API_URL;


    useEffect(() => {
        const handleNewMessage = (message) => {
            const isCurrentConversation = selectedConversation._id === message.conversationId;
            const isUserFocused = document.hasFocus();
            const isCurrentPageChat = window.location.pathname.includes('/chat');
    
            // If the message is from the current conversation, add it to the messages
            // if (isCurrentConversation) {
            //     setMessages(prev => [...prev, message])
            // }

            if(!isCurrentConversation || !isUserFocused || !isCurrentPageChat){
                const sound = new Audio(MessageSound);
                sound.play();
            }

    
            // Update the last message preview for the relevant conversation
            setConversations(prev => {
                const updatedConv = prev.map(conversation => {
                    if (conversation._id === message.conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: message.text,
                                sender: message.sender,
                            }
                        }
                    }
                    return conversation;
                });
                return updatedConv;
            });
        }
    
        socket.on("newMessage", handleNewMessage);
    
        return () => socket.off("newMessage", handleNewMessage);
    
    }, [socket, selectedConversation._id, setConversations]);
    
    
      


    useEffect(() => {
        const getMessages = async () => {
            setLoadingMessages(true)
            setMessages([])
            try {
                if (selectedConversation.mock) return
                const res = await fetch(`${apiUrl}/messages/${selectedConversation.userId}`,{
                    credentials: "include", // This will send cookies with the request
                })
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error", 5000)
                    return
                }
                setMessages(data)

            } catch (error) {
                showToast("Error", error.message, "error", 5000)
            } finally {
                setLoadingMessages(false)
            }
        }
        getMessages();

    }, [selectedConversation])

    useEffect(() => {
		const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
		if (lastMessageIsFromOtherUser) {
			socket.emit("markMessagesAsSeen", {
				conversationId: selectedConversation._id,
				userId: selectedConversation.userId,
			});
            // Reset the unread message count when the message is marked as seen
            setUnreadMessageCount(0)
        
		}

		socket.on("messagesSeen", ({ conversationId }) => {
			if (selectedConversation._id === conversationId) {
				setMessages((prev) => {
					const updatedMessages = prev.map((message) => {
						if (!message.seen) {
							return {
								...message,
								seen: true,
							};
						}
						return message;
					});
					return updatedMessages;
				});
			}
		});
	}, [socket, currentUser._id, messages, selectedConversation, setUnreadMessageCount]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return <Flex
        flex={70}
        bg={useColorModeValue("gray.200", 'gray.dark')}
        borderRadius={'md'}
        flexDirection={'column'}
        p={2}
    >
        {/* Message Header */}
        <Flex w={'full'} h={12} alignItems={'center'} gap={2}>
            <Avatar src={selectedConversation?.userProfilePic || ""} size={'sm'} />
            <Flex flexDirection={'column'}>
                <Text display={'flex'} alignItems={'center'}>
                    {selectedConversation.username}
                    <Image src="/images/verified.png" w={4} h={4} ml={1} />
                </Text>
                {online && <Text fontSize={'xs'} color={'gray.light'}>Online</Text>}
            </Flex>
        </Flex>

        <Divider />

        {/* Messages */}
        <Flex flexDir={'column'} gap={4} my={4} h={'400px'} overflowY={'auto'} px={2}>
            {loadingMessages && (
                [...Array(5)].map((_, i) => {
                    return <Flex
                        key={i}
                        gap={2}
                        alignItems={'center'}
                        p={1}
                        borderRadius={'md'}
                        alignSelf={i % 2 === 0 ? 'flex-start' : 'flex-end'}
                    >
                        {i % 2 === 0 && (
                            <SkeletonCircle size={7} />
                        )}
                        <Flex flexDir={'column'} gap={2}>
                            <Skeleton h={'8px'} w={'250px'} />
                            <Skeleton h={'8px'} w={'250px'} />
                            <Skeleton h={'8px'} w={'250px'} />
                        </Flex>
                        {i % 2 !== 0 && (
                            <SkeletonCircle size={7} />
                        )}
                    </Flex>
                })
            )}


            {!loadingMessages && (
                messages.map((message) => (
                    <Flex
                        key={message._id}
                        direction={"column"}
                        ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
                    >
                        <Message
                            message={message}
                            ownMessage={currentUser._id === message.sender}
                            setMessages={setMessages} />
                    </Flex>

                ))

            )}


        </Flex>
        <MessageInput setMessages={setMessages} />
    </Flex>

}

export default MessageContainer