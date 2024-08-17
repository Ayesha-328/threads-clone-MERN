import { Button, useToast } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import {FiLogOut} from 'react-icons/fi'
import useLogout from '../hooks/useLogout'


const LogoutButton = () => {
   const logout = useLogout()


  return (
    <Button 
    position={"fixed"}
    top={"30px"}
    right={"30px"}
    size={"sm"} 
    onClick={logout}
    >
        <FiLogOut />
    </Button>
  )
}

export default LogoutButton