import React, { useState, useEffect } from 'react'
import {
    VStack,
    Box,
    Flex,
    Avatar,
    Text,
    Link,
    MenuButton,
    Menu,
    Portal,
    MenuList,
    MenuItem,
    useToast,
    Button,
    useColorModeValue
} from '@chakra-ui/react'
import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import {useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom'
import {Link as RouterLink} from "react-router-dom"
import useFollowUnfollow from '../hooks/useFollowUnfollow'

const UserHeader = ({user}) => {
    const toast = useToast()
    const currentUser = useRecoilValue(userAtom); //logged in user
const {handleFollowUnfollow, updating, following} = useFollowUnfollow(user)



    const copyUrl = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            toast({ description: "Profile Link Copied", isClosable: true, duration: 3000 })
        })
    }

    
    return (
        <VStack gap={4} alignItems={"start"}>

            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"} textTransform={"capitalize"}>{user.name}</Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text fontSize={{base:"xs",md:"sm",'lg':"md"}} bg={useColorModeValue("gray.300","gray.dark")} color={"gray.light"} px={2} py={1} borderRadius={"full"}>
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    {user.profilePic 
                    &&
                    <Avatar
                        name={user.name}
                        src={user.profilePic}
                        size={{base:"md",md:"lg"}} />
}
{!user.profilePic &&
                    <Avatar
                    name={user.name}
                    src='https://bit.ly/broken-link'
                    size={{base:"md",md:"lg"}} /> 
                    }
                    
                </Box>
            </Flex>

            <Text>{user.bio}</Text>

            {currentUser?._id === user._id ? (
                <Link as={RouterLink} to='/update'>
                <Button size={"sm"}>Update Profile</Button></Link>

            )
        :
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>{following ? "Unfollow" : "Follow"}</Button>
        }

            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"} fontSize={{base:"xs",md:"sm",'lg':"md"}}>{user.followers.length || 0} followers</Text>
                    <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"} fontSize={{base:"xs",md:"sm",'lg':"md"}}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className='icon-container'>
                        <BsInstagram size={24} cursor={"pointer"} />
                    </Box>
                    <Box className='icon-container'>
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"} />
                                <Portal>
                                    <MenuList bg={"gray.dark"}>
                                        <MenuItem onClick={copyUrl} bg={"gray.dark"}>Copy Link</MenuItem>
                                    </MenuList>
                                </Portal>

                            </MenuButton>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>

            <Flex w={"full"}>
                <Flex
                    flex={1}
                    borderBottom={"1.5px solid white"}
                    justifyContent={"center"}
                    pb={3}
                    cursor={"pointer"}>
                    <Text
                        fontWeight={"bold"}

                    >Thread</Text>
                </Flex>
                <Flex flex={1}
                    borderBottom={"1px solid gray"}
                    justifyContent={"center"}
                    pb={3}
                    cursor={"pointer"}
                    color={"gray.light"}>
                    <Text
                        fontWeight={"bold"}

                    >Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    )
}

export default UserHeader