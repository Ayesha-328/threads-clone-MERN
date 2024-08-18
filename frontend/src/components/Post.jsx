import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import useShowToast from "../hooks/useShowToast"
import {formatDistanceToNowStrict} from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'
const apiUrl = import.meta.env.VITE_API_URL;

const Post = ({ post,userId }) => {
    const showToast= useShowToast()
    const [user, setUser] = useState({})
    const navigate = useNavigate()
    const currentUser = useRecoilValue(userAtom)
    const [posts,setPosts] = useRecoilState(postsAtom)

    // fetch the user
    useEffect(()=>{
        const getUser = async()=>{
            try {
              const res = await fetch(`${apiUrl}/users/profile/${userId}`) 
              const data = await res.json()
              if(data.error){
                showToast("Error",data.error,"error",5000)
                return;
              }
              setUser(data)

            } catch (error) {
                showToast("Error",error,"error",5000) 
                setUser(null)
            }
        }
        getUser()
    },[userId,showToast])

    const handleDeletePost = async(e)=>{
        e.preventDefault()
        if(!window.confirm("Are you sure you want to delete this post?")) return 
        try {
            const res = await fetch(`${apiUrl}/posts/${post._id}`,{
                method:"DELETE", 
                credentials:'include'
            }) 
            const data = await res.json()
            if(data.error){
              showToast("Error",data.error,"error",5000)
              return;
            }
            showToast("Post deleted successfully","","success",5000)
            setPosts(prev => prev.filter(p=>p._id !==post._id))
            

          } catch (error) {
              showToast("Error",error,"error",5000) 
              setUser(null)
          }
    }



    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar
                    onClick={(e)=>{
                        e.preventDefault();
                        navigate(`/${user.username}`)
                    }}
                        size={{ base: "sm", md: "md" }}
                        name={user?.name}
                        src={user?.profilePic} />
                    <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
                        {post.replies[0] && (
                            <Avatar
                            size="xs"
                            name={post.replies[0].username}
                            src={post.replies[0].userProfilePic}
                            position={"absolute"}
                            top={"0px"}
                            left={"15px"}
                            padding={"2px"}
                        />
                        )}
                        {post.replies[1] && (
                             <Avatar
                             size="xs"
                             name={post.replies[1].username}
                             src={post.replies[1].userProfilePic}
                             position={"absolute"}
                             bottom={"0px"}
                             right={"-5px"}
                             padding={"2px"}
                         />
                        )}
                        {post.replies[2] && (
                            <Avatar
                            size="xs"
                            name={post.replies[2].username}
                            src={post.replies[2].userProfilePic}
                            position={"absolute"}
                            bottom={"0px"}
                            left={"4px"}
                            padding={"2px"}
                        />
                        )}
    </Box>
                </Flex>

                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text 
                            onClick={(e)=>{
                                e.preventDefault();
                                navigate(`/${user.username}`)
                            }}
                            fontSize={"sm"}  
                            fontWeight={"bold"}
                            >{user?.username}</Text>
                            <Image src="/images/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"} onClick={(e) => e.preventDefault()}>
                            <Text fontSize={"xs"} width={36} textAlign={'right'} color={"gray.light"} >{formatDistanceToNowStrict(new Date(post.createdAt))} ago</Text>
                            {user._id ===currentUser?._id && (
                                <Menu>
  <MenuButton>
                                    <BsThreeDots/>
  </MenuButton>
  <MenuList bg={"gray.dark"}>
    <MenuItem bg={"gray.dark"} color={'red.400'} onClick={handleDeletePost}>Delete Post</MenuItem>
    <MenuItem bg={"gray.dark"}>Copy Post Link</MenuItem>
    <MenuItem bg={"gray.dark"}>Edit Post</MenuItem>
  </MenuList>
</Menu>        
                            )}
                            
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>
                        {post.text}
                    </Text>

                    {post.img && (
                        <Box
                            borderRadius={6}
                            overflow={"hidden"}
                            border={"1px solid"}
                            borderColor={"gray.light"}>
                            <Image src={post.img} w={"full"} />
                        </Box>
                    )}



                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>

                    
                </Flex>
            </Flex>
        </Link>
    )
}

export default Post 