import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";
import { format } from "date-fns"; // Import this if using date-fns
import { AiFillDelete } from "react-icons/ai";
import useShowToast from "../hooks/useShowToast"
import { useRecoilState, useSetRecoilState } from 'recoil';
import conversationsAtom from "../atoms/messagesAtom";

const Message = ({ ownMessage, message, setMessages }) => {
	// const selectedConversation = useRecoilValue(selectedConversationAtom);
	const user = useRecoilValue(userAtom);
	const [imgLoaded, setImgLoaded] = useState(false);
	const showToast= useShowToast()
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const [conversations,setConversations] = useRecoilState(conversationsAtom);
	const apiUrl = import.meta.env.VITE_API_URL;
	// Format the message time
	const formattedTime = format(new Date(message.createdAt), "h:mm a"); // Example using date-fns

	const handleDeleteMessage = async () => {
		if (!window.confirm("Are you sure you want to delete this message for everyone?")) return;
		
		try {
			const res = await fetch(`${apiUrl}/messages/${message._id}`, {
				method: "DELETE",
			});
	
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error", 5000);
				return;
			}
	
			showToast("Message deleted successfully", "", "success", 5000);
	
			// Update local messages state
			setMessages(prev => prev.filter(m => m._id !== message._id));
	
			// Update conversations state
			setConversations(prev => {
				return prev.map(conv => {
					if (conv._id === selectedConversation._id) {
						// Check if the deleted message was the last message
						if (conv.lastMessage &&
							conv.lastMessage.text === message.text && conv.lastMessage.sender===message.sender
							) {
	
							return {
								...conv,
								lastMessage:{
									text: "message deleted",
									senser:"null"
								}
							};
						}
					}
					return conv;
				});
			});

	
		} catch (error) {
			showToast("Error", error, "error", 5000);
		}
	};
	

	return (
		<>
			{ownMessage ? (
				<Flex gap={1} alignSelf={"flex-end"}>
					{message.text && (
						<Flex 
						alignItems={'center'}  
						gap={1}
						_hover={{
							"& > .delete-box": {
							  display: "block",
							},
						  }}
						>
							<Box color={'red.400'}  className="delete-box" display={'none'} cursor={'pointer'}>
							<AiFillDelete onClick={handleDeleteMessage} size={20}/>
							</Box>
						<Flex bg={"green.800"} flexDir={'column'} maxW={"350px"} px={2} borderRadius={"md"}>
							<Text color={"white"}>{message.text}</Text>
							<Flex alignSelf={"flex-end"}>
								<Text fontSize={'10px'} color="gray.500">
									{formattedTime}
								</Text>
								<Box ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
									<BsCheck2All size={16} />

								</Box>
							</Flex>
						</Flex>
							
						</Flex>
					)}
					{message.img && !imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.img}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={4}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.img && imgLoaded && (
						<Flex flexDir={'column'} gap={1} mt={5} w={"200px"}>
							<Image src={message.img} alt='Message image' borderRadius={4} />
							<Flex alignSelf={"flex-end"}>
								<Text fontSize={'10px'} color="gray.500">
									{formattedTime}
								</Text>
								<Box ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
									<BsCheck2All size={16} />

								</Box>
							</Flex>
						</Flex>
					)}

					<Avatar src={user.profilePic} w='7' h={7} />
				</Flex>
			) : (
				<Flex gap={1}>
					<Flex direction="column" alignItems="center">
						<Avatar src={selectedConversation.userProfilePic} w='7' h={7} />
					</Flex>

					{message.text && (
						<Flex flexDir={'column'} maxW={"350px"} bg={"gray.400"} px={2} borderRadius={"md"} >
							<Text color={"black"} >
								{message.text}
							</Text>
							<Flex alignSelf={"flex-end"}>
								<Text fontSize={'10px'} color="gray.500">
									{formattedTime}
								</Text>
							</Flex>

						</Flex>
					)}
					{message.img && !imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.img}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={4}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.img && imgLoaded && (
						<Flex flexDir={'column'} gap={1} mt={5} w={"200px"}>
							<Image src={message.img} alt='Message image' borderRadius={4} />
							<Flex alignSelf={"flex-end"}>
								<Text fontSize={'10px'} color="gray.500">
									{formattedTime}
								</Text>
							</Flex>
						</Flex>

					)}
				</Flex>
			)}
		</>
	);
};

export default Message;
