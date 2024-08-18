import { 
    Button, 
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Textarea,
    FormControl,
    Text,
    Input,
    Flex,
    CloseButton,
    Image
 } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useDisclosure } from '@chakra-ui/react'
import { useState, useRef } from 'react'
import usePreviewImg from '../hooks/usePreviewImg'
import { BsFillImageFill } from 'react-icons/bs'
import { useRecoilState, useRecoilValue } from "recoil"
import useShowToast from '../hooks/useShowToast'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'
import { useParams } from 'react-router-dom'


const MAX_CHAR = 500;

const CreatePost = () => {
    const {username} = useParams()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState("")
    const imageRef = useRef(null)
    const {handleImageChange,imgUrl,setImgUrl} = usePreviewImg()
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR)
    const user = useRecoilValue(userAtom);
    const showToast= useShowToast()
    const [posting, setPosting] = useState(false)
const [posts, setPosts] = useRecoilState(postsAtom)
const apiUrl = import.meta.env.VITE_API_URL;

    const handleChange = (e)=>{
        const inputText = e.target.value;
        if(inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText)
            setRemainingChar(0)
        }else{
            setPostText(inputText)
            setRemainingChar(MAX_CHAR-inputText.length)

        }
    }

    const handleCreatePost = async (e)=>{
        setPosting(true)
        try {
            const res= await fetch(`${apiUrl}/posts/create/`,{
                method:"POST",
                credentials: "include",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    postedBy : user._id,
                    text: postText,
                    img: imgUrl
    
                })
            })
            const data= await res.json()
            if(data.error){
                showToast("Error",data.error,"error",5000)
                return;
            }
            showToast("Posted Successfully","","success",5000 )
            if(username === user.username){
                setPosts(prev => [data,...prev])
            }
            setPostText("")
            setImgUrl("")
            onClose()
            
        } catch (error) {
            showToast("Error",error,"error",5000)
        }finally{
            setPosting(false)
        }

    }
  return (
    <>
    <Button
    onClick={onOpen} 
    position={"fixed"}
    bottom={10}
    right={5}
    size={{base: 'sm', sm: "md"}}
    bg={useColorModeValue("gray.300","gray.dark")}
    ><AddIcon/></Button>

<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
            <Textarea
            name="postText"
            placeholder='Post content goes here...'
            onChange={handleChange}
            value={postText}
            ></Textarea>

            <Text 
            m={1}
            
            textAlign={'right'}
            color={'gray.800'} 
            fontWeight={"bold"} 
            fontSize={"xs"}>
               {remainingChar}/{MAX_CHAR} 
            </Text>

            <Input
            type="file"
            hidden
            ref={imageRef}
            onChange={handleImageChange}
            />

            <BsFillImageFill 
            style={{marginLeft: "5px", cursor:"pointer"}}
            size={16}
            onClick={()=> imageRef.current.click()}
            />

            </FormControl>
            {imgUrl && (
            <Flex mt={5} w={"full"}  maxHeight={"400px"} position={"relative"}>
                <Image rounded= {10} src={imgUrl} alt="selected img" />
                <CloseButton 
                onClick={()=>{setImgUrl("")}}
                bg={'gray.800'}
                position="absolute"
                top={2}
                right={2}
                />
            </Flex>
          ) }


            
          </ModalBody>

          
          <ModalFooter>
            <Button isLoading={posting} colorScheme='blue' mr={3} onClick={handleCreatePost}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost