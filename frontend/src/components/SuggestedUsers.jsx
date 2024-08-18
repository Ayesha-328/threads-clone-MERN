import { Text, Flex, Skeleton, SkeletonCircle, Box } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import SuggestedUser from './SuggestedUser'
import useShowToast from '../hooks/useShowToast'

const SuggestedUsers = () => {
    const[loading, setLoading] = useState(true)
    const[suggestedUsers, setSuggestedUsers] = useState([])
    const showToast = useShowToast()
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(()=>{
        const getSuggestedUsers = async()=>{
            setLoading(true);
            try {
                const res= await fetch(`${apiUrl}/users/suggested`,{
                    credentials: "include", // This will send cookies with the request
                });
                const data = await res.json();

                if(data.error){
                    showToast("Error", data.error, "error", 5000)
                }

                setSuggestedUsers(data)      
            } catch (error) {
                showToast("Error", error.message, "error", 5000)
            }finally{
                setLoading(false)
            }
        }
        getSuggestedUsers()

    },[showToast])
  return (
    <>
    <Text mb={4} fontWeight={'bold'}>
Suggested Users
    </Text>
    <Flex direction={'column'} gap={4}>

        {loading && [0,1,2,3,4].map((_,i)=>(
<Flex key={i} gap={2} alignItems={'center'} p={'1'} borderRadius={'md'}>
    <Box>
        <SkeletonCircle size={'10'}/>
    </Box>
    <Flex w={'full'} flexDirection={'column'} gap={2}>
        <Skeleton h={'8px'} w={'90px'} />
        <Skeleton h={'8px'} w={'90px'}/>
    </Flex>
    <Flex>
        <Skeleton h={'20px'} w={'60px'}/>
    </Flex>
</Flex>
        ))}

        {!loading && suggestedUsers.map(user=><SuggestedUser key={user._id} user={user}/>)}
    </Flex>
    </>
  )
}

export default SuggestedUsers