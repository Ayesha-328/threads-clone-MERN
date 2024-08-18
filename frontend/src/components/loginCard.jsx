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
    Spinner
  } from '@chakra-ui/react'
  import { useState } from 'react'
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
  
  export default function LoginCard() {
    const [showPassword, setShowPassword] = useState(false)
    const setAuthScreenState = useSetRecoilState(authScreenAtom)
    const setUser = useSetRecoilState(userAtom)
    const showToast = useShowToast()
    const [loading,setLoading] = useState(false)
    const [inputs, setInputs] = useState({
      username:"",
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

    const handleLogin =async()=>{
      setLoading(true)
      try {
          const res =await fetch(`${apiUrl}/users/login`,{
              method: "POST",
              credentials: 'include',
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(inputs)
          })

          const data = await res.json()
          console.log(data)

          if(data.error){
              showToast("Error",data.error,"error",5000)
              return;
          }

          localStorage.setItem("user-threads", JSON.stringify(data))
          setUser(data);

      showToast("Successfully logged in","","success",5000)
          
      } catch (error) {
        showToast("Error",error,"error",5000)
      }finally{
        setLoading(false)
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
              Login
            </Heading>
          </Stack>
          <Box
            rounded={'lg'}
            w={{
                base: "full",
sm:"400px",
            }
                
            }
            bg={useColorModeValue('white', 'gray.dark')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl  isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" name='username' onChange={handleChange} value={inputs.username} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} name='password' onChange={handleChange} value={inputs.password} />
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
                isLoading={loading}
                onClick={handleLogin}
                  loadingText="Logging in"
                  size="lg"
                  bg={useColorModeValue('gray.600', 'gray.700')}
                  color={'white'}
                  _hover={{
                    bg: useColorModeValue('gray.700', 'gray.800'),
                  }}>
                  Login
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Don't have an user? <Link
                  onClick={()=>setAuthScreenState("signup")}
                  color={useColorModeValue('gray.600', 'gray.700')}>Sign up</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    )
  }