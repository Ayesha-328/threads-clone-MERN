import { Flex
    , useColorModeValue,
    useColorMode,
    WrapItem,
    Avatar,
    AvatarBadge,
    Stack,
    Image,
    Text,
    Box

} from '@chakra-ui/react'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from  "../atoms/userAtom"
import {BsCheck2All} from 'react-icons/bs'
import { selectedConversationAtom } from '../atoms/messagesAtom'

const Conversations = ({conversation, isOnline}) => {
    const recipient=conversation.participants[0]
    const lastMessage= conversation.lastMessage;
    const currentUser = useRecoilValue(userAtom)
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const bgColor = useColorModeValue("gray.300", "gray.dark");

   
  return (
    <Flex
    my={1}
    gap={4}
    alignItems={'center'}
    p={1}
    _hover={{
        cursor:"pointer",
        bg: useColorModeValue("gray.300","gray.dark"),
    }
    }
    borderRadius={'md'}
    onClick={()=>setSelectedConversation({
        _id: conversation._id,
        userId : recipient._id,
        userProfilePic:recipient.profilePic,
        username:recipient.username,
        mock:conversation.mock,
    })}
    bg={selectedConversation?._id === conversation._id ? bgColor: ""}
    >
<WrapItem>
    <Avatar size={{base:'xs', sm: 'sm', md: 'md'}} src={recipient?.profilePic ||'https://bit.ly/broken-link'}>
    <AvatarBadge boxSize='1em' bg={isOnline ?'green.500':'red.500'} />
    </Avatar>
</WrapItem>

<Stack direction={'column'} fontSize={'sm'}>
<Text fontWeight='700' display={'flex'} alignItems={'center'}
>
    {recipient.username} 
    <Image src='/images/verified.png' w={4} ml={1}/>
</Text>
<Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1} >
    {currentUser._id === lastMessage?.sender ? (
        <Box color={lastMessage.seen ? "blue.400" : ""}>
            <BsCheck2All  size={16}/>
        </Box>
        ) :"" }
        <Text>
{lastMessage?.text.length >18 ? `${lastMessage?.text.substring(0,18)}...` : lastMessage?.text || "🖼️"}

        </Text>
</Text>
</Stack>
    </Flex>
  )
}

export default Conversations