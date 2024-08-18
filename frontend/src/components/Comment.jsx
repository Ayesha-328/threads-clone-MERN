import {
    Flex,
    Avatar,
    Box,
    Image,
    MenuButton,
    Menu,
    MenuList,
    MenuItem,
    Text,
    Divider,
    Button,
  } from '@chakra-ui/react'
  import { BsThreeDots } from 'react-icons/bs'
  import Actions from '../components/Actions'
  import { useState } from 'react'
  import { Link } from 'react-router-dom'
  import {formatDistanceToNowStrict} from 'date-fns'

const Comment = ({reply}) => {
    const [liked, setLiked] = useState(false);
    
    return (
        <>
            <Divider />
        <Flex gap={3} py={5}>
        <Link to={`/${reply.username}`}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar
                    size={{ base: "sm", md: "md" }}
                    name={reply.username}
                    src={reply.userProfilePic} />
            </Flex>
            </Link>

            <Flex flex={1} flexDirection={"column"} gap={1}>
                <Flex justifyContent={"space-between"} w={"full"}>
                <Link to={`/${reply.username}`}>
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"} >{reply.username}</Text>
                    </Flex>

                    </Link>
                    <Flex gap={4} alignItems={"center"} onClick={(e) => e.preventDefault()}>
                        <Text fontSize={"xs"} width={36} textAlign={'right'} color={"gray.light"} >{reply.createdAt && formatDistanceToNowStrict(new Date(reply.createdAt))}</Text>
                        {/* <Menu>
                            <MenuButton>
                                <BsThreeDots />
                            </MenuButton>
                            <MenuList bg={"gray.dark"}>
                                <MenuItem bg={"gray.dark"}>Download</MenuItem>
                                <MenuItem bg={"gray.dark"}>Copy Post Link</MenuItem>
                                <MenuItem bg={"gray.dark"}>Mark as Draft</MenuItem>
                            </MenuList>
                        </Menu> */}
                    </Flex>
                </Flex>

                <Text fontSize={"base"}>
                    {reply.text}
                </Text>

                {/* <Flex gap={3}>
                    <Actions liked={liked} setLiked={setLiked}/>
                </Flex> */}

                {/* <Text color={"gray.light"} fontSize={{ base: "xs", md: "sm", 'lg': "md" }}>
                    {likes+(liked?1:0)} likes
                </Text> */}
            </Flex>
        </Flex>
        </>
    )
}

export default Comment