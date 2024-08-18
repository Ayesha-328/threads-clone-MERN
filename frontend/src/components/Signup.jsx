import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import useShowToast from '../hooks/useShowToast'

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreenState = useSetRecoilState(authScreenAtom)
  const showToast = useShowToast()
  const [inputs, setInputs] = useState({
    name:"",
    username:"",
    email:"",
    password: ""
  })
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange=(e)=>{
    const {name,value}= e.target;
    setInputs({
        ...inputs,
        [name]: value,     
    })
  }

  const toast = useToast()

  const handleSignup = async () => {
    try {
      const res = await fetch(`${apiUrl}/users/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputs)
      });

      const data = await res.json();
      

      if(data.error){
        showToast("Error",data.error,"error",5000)
        return
      }

      localStorage.setItem("user-threads", JSON.stringify(data))

      showToast("Successfully signed up","","success",5000)
      
    } catch (error) {
      showToast("Error",error.message,"error",5000)
    }
  }

  return (
    <Flex
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={8} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl  isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input type="text" name='name' onChange={handleChange} value={inputs.name} />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" name='username' onChange={handleChange} value={inputs.username}/>
                </FormControl>
              </Box>
            </HStack>
            <FormControl  isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" name='email' onChange={handleChange} value={inputs.email} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} name='password' onChange={handleChange} value={inputs.password}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
              onClick={handleSignup}
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue('gray.600', 'gray.700')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue('gray.700', 'gray.800'),
                }}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link
                onClick={()=>setAuthScreenState("login")}
                color={useColorModeValue('gray.600', 'gray.700')}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}