import React from 'react'
import { Text,Button } from '@chakra-ui/react'
import useShowToast from '../hooks/useShowToast'
import useLogout from '../hooks/useLogout'

const SettingsPage = () => {
    const showToast = useShowToast
    const logout=useLogout()
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleFreezeAccount = async()=>{
        if(!window.confirm("Are you sure you want to freeze your account")) return 
        try {
            const res = await fetch(`${apiUrl}/users/freeze`,{
                method:"PUT",
                credentials: "include", // This will send cookies with the request
                headers:{
                    "Content-Type": "application/json"
                }
            })

            const data= await res.json()
            if(data.error){
                showToast("Error", data.error, 'error', 5000) 
                return     
            }

            if (data.success) {
				await logout();
				showToast("Success", "Your account has been frozen", "success", 5000);
			}
            
        } catch (error) {
            showToast("Error", error.message, 'error', 5000)     
        }
    }
  return (
    <>
    <Text my={1} fontWeight={"bold"}>Freeze your account</Text>
    <Text mb={3}>You can unfreeze your account anytime by logging in.</Text>
    <Button size={'sm'} colorScheme='red' onClick={handleFreezeAccount}>
        Freeze Account
    </Button>
    </>
  )
}

export default SettingsPage