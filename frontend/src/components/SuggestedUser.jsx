import React, {useEffect, useState} from 'react'
import { Text,Flex, Avatar, Box, Button, useToast } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import useFollowUnfollow from '../hooks/useFollowUnfollow'


const SuggestedUser = ({user}) => {
    const {handleFollowUnfollow, updating, following} = useFollowUnfollow(user)
   
  return (
    <Flex justifyContent={'space-between'}>
    <Flex gap={2} as={Link} to={`${user.username}`} >
        <Avatar src={user.profilePic}/>
        <Box>
            <Text fontSize={'sm'} textTransform={'capitalize'} fontWeight={'bold'}>{user.name}</Text>
            <Text color={'gray.light'}  fontSize={'sm'}>{user.username}</Text>
        </Box>
    </Flex>
    <Button
    size={'sm'}
    color={following ? 'black': 'white'}
    bg={following ? 'white': 'blue.400'}
    onClick={handleFollowUnfollow}
    isLoading={updating}
    _hover={{
        color: following ? 'black' : 'white',
        opacity: '0.8'
    }}
    >
{following ? "Unfollow" : "Follow"}
    </Button>

    </Flex>
  )
}

export default SuggestedUser