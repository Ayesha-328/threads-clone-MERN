import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Textarea,
} from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { useState, useRef } from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import usePreviewImg from '../hooks/usePreviewImg'
import useShowToast from '../hooks/useShowToast'

export default function UpdateProfilePage() {
    const [user, setUser]=useRecoilState(userAtom)
    const[input,setInput] = useState({
        name:user.name,
        username:user.username,
        password:user.password,
        email:user.email,
        bio: user.bio
    })
    const fileRef = useRef(null);
    const showToast = useShowToast() 
    const [updating, setUpdating] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    const {handleImageChange,imgUrl} = usePreviewImg()

    const handleChange=(e)=>{
        const {name,value} = e.target;
        setInput({
            ...input,
            [name]:value
        })
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      if(updating) return;
      setUpdating(true);
      try {
        const res = await fetch(`${apiUrl}/users/update/${user._id}`, {
          method: "PUT",
          credentials: "include", // This will send cookies with the request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...input, profilePic: imgUrl }),
        });
    
        if (!res.ok) {
          const errorText = await res.text(); // Read the text response, which might be HTML
          throw new Error(`Request failed with status ${res.status}: ${errorText}`);
        }
    
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error.message, "error", 5000);
        } else {
          showToast("Success", "Profile updated successfully", "success", 5000);
          setUser(data);
          localStorage.setItem("user-threads", JSON.stringify(data));
        }
    
      } catch (error) {
        showToast("Error", error.message, "error", 5000);
        console.log('Error:', error);
      }finally{
        setUpdating(false)
      }
    };
    
  return (
    <form onSubmit={handleSubmit}>
    <Flex
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('white', 'gray.dark')} my={8}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl>
          <FormLabel>User Icon</FormLabel>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic}/>
              <Input 
              type='file' 
              hidden 
              ref={fileRef}
              onChange={handleImageChange}/>
            </Center>
            <Center w="full">
              <Button onClick={()=>fileRef.current.click()} w="full">Change Avatar</Button>
            </Center>
          </Stack>
        </FormControl>
        <FormControl >
        <FormLabel>Full Name</FormLabel>
          <Input
          name='name'
          value={input.name}
          onChange={handleChange}
            placeholder="John Doe"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl >
        <FormLabel>Username</FormLabel>
          <Input
          name='username'
          value={input.username}
          onChange={handleChange}
            placeholder="johndoe"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
          name='email'
          value={input.email}
          onChange={handleChange}
            placeholder="john@doe.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
          name='password'
          value={input. password}
          onChange={handleChange}
            placeholder="password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Textarea
          name='bio'
        value={input.bio}
        onChange={handleChange}
        placeholder='Your bio'
        _placeholder={{ color: 'gray.500' }}
        size='sm'
      />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
          isLoading={updating}
            bg={'green.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'green.500',
            }}
            type='submit'>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
    </form>
  )
}