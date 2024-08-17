import React from 'react'
import { Link } from 'react-router-dom'
import { Flex, 
    Avatar, 
    Box, 
    Image,  
    MenuButton,
    Menu,
    MenuList,
    MenuItem , 
    Text } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'


const UserPost = ({ postImg, postTitle, likes, replies }) => {
    return (
        <Link to={"/markzuckerberg/post/1"}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar
                        size={{ base: "sm", md: "md" }}
                        name="Mark Zuckerberg"
                        src="/images/zuck-avatar.png" />
                    <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        <Avatar
                            size="xs"
                            name="John doe"
                            src='https://bit.ly/dan-abramov'
                            position={"absolute"}
                            top={"0px"}
                            left={"15px"}
                            padding={"2px"}
                        />
                        <Avatar
                            size="xs"
                            name="John doe"
                            src='https://bit.ly/kent-c-dodds'
                            position={"absolute"}
                            bottom={"0px"}
                            right={"-5px"}
                            padding={"2px"}
                        />
                        <Avatar
                            size="xs"
                            name="John doe"
                            src='https://bit.ly/code-beast'
                            position={"absolute"}
                            bottom={"0px"}
                            left={"4px"}
                            padding={"2px"}
                        />
                    </Box>
                </Flex>

                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"}>markzuckerberg</Text>
                            <Image src="/images/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"} onClick={(e) => e.preventDefault()}>
                            <Text fontSize={"sm"} color={"gray.light"} >1d</Text>
                                    <Menu>
  <MenuButton>
                                    <BsThreeDots/>
  </MenuButton>
  <MenuList bg={"gray.dark"}>
    <MenuItem bg={"gray.dark"}>Download</MenuItem>
    <MenuItem bg={"gray.dark"}>Copy Post Link</MenuItem>
    <MenuItem bg={"gray.dark"}>Mark as Draft</MenuItem>
  </MenuList>
</Menu>
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>
                        {postTitle}
                    </Text>

                    {postImg && (
                        <Box
                            borderRadius={6}
                            overflow={"hidden"}
                            border={"1px solid"}
                            borderColor={"gray.light"}>
                            <Image src={postImg} w={"full"} />
                        </Box>
                    )}



                    <Flex gap={3} my={1}>
                        <Actions />
                    </Flex>

                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize={{ base: "xs", md: "sm", 'lg': "md" }}>
                            {replies} replies
                        </Text>
                        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                        <Text color={"gray.light"} fontSize={{ base: "xs", md: "sm", 'lg': "md" }}>
                            {likes} likes
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    )
}

export default UserPost