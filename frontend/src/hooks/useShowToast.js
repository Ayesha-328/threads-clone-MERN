import { useToast } from '@chakra-ui/react'
import React, { useCallback } from 'react'

const useShowToast = () => {
    const toast = useToast()
    const showToast =useCallback((title,desc,status,duration)=>{
        toast({
            title:title,
            description: desc,
            status: status,
            duration: duration,
            isClosable: true,
        })
    },[toast]);
  return showToast
}

export default useShowToast