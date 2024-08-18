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
  Spinner
} from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import { useEffect, useState } from 'react'
import Comment from '../components/Comment'
import useShowToast from '../hooks/useShowToast'
import { useNavigate, useParams } from 'react-router-dom'
import useGetUserProfile from '../hooks/useGetUserProfile'
import {formatDistanceToNowStrict} from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'

const PostPage = () => {
  const {user,loading} = useGetUserProfile()
  // const [post,setPost] = useState(null) 
  const [posts,setPosts] = useRecoilState(postsAtom)
  const showToast = useShowToast();
  const {pid}= useParams();
  const currentUser = useRecoilValue(userAtom)
  const navigate = useNavigate()
  const currentPost = posts[0]
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(()=>{
    const getPost = async () => {
      setPosts([])
      try {
        const res = await fetch(`${apiUrl}/posts/${pid}`);
        const data = await res.json();
        if(data.error){
          showToast('Error', error.message, 'error', 5000);
          return
        }
      
        setPosts([data]);
      } catch (error) {
        showToast('Error', error.message, 'error', 5000);
        // setCurrentPost(null);
      } 
    };

    getPost();

  },[showToast,pid, setPosts])

  const handleDeletePost = async()=>{
    if(!window.confirm("Are you sure you want to delete this post?")) return 
    try {
        const res = await fetch(`${apiUrl}/posts/${currentPost._id}`,{
            method:"DELETE", 
        }) 
        const data = await res.json()
        if(data.error){
          showToast("Error",data.error,"error",5000)
          return;
        }
        showToast("Post deleted successfully","","success",5000)
        navigate(`/${user.username}`)

      } catch (error) {
          showToast("Error",error,"error",5000) 
          setUser(null)
      }
}

  if(!user && loading){
    return (
      <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
    )
  }

  if(!currentPost ) return null;

  
 
  return (
    <Flex flexDirection={"column"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            size={{ base: "sm", md: "md" }}
            name={user.name}
            src={user.profilePic} />
          <Flex w={"full"} alignItems={"center"}>
            <Text fontSize={"md"} textTransform={"capitalize"} fontWeight={"bold"}>{user.name}</Text>
            <Image src="/images/verified.png" w={4} h={4} ml={1} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"} onClick={(e) => e.preventDefault()}>
                            <Text fontSize={"xs"} width={36} textAlign={'right'} color={"gray.light"} >{formatDistanceToNowStrict(new Date(currentPost.createdAt))} ago</Text>
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

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}>
        <Image src={currentPost.img} w={"full"} />
      </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost}/>
      </Flex>



      {!currentUser && (
        <Flex justifyContent={"space-between"} mb={4}>
          <Divider my={4}/>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>

        <Button>Get</Button>
      </Flex>
      )}

      
{currentPost.replies.map((reply)=>{
  return  <Comment 
  key={reply._id}
  reply={reply}
  />
})}

     

    </Flex>

  )
}

export default PostPage