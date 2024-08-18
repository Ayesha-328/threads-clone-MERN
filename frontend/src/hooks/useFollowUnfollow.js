import React, { useState, useEffect } from 'react'
import {useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'

const useFollowUnfollow = (user) => {
    const showToast= useShowToast()
    const currentUser = useRecoilValue(userAtom); //logged in user
const [following,setFollowing] = useState(user.followers.includes(currentUser?._id))
const [updating, setUpdating] = useState(false);
const apiUrl = import.meta.env.VITE_API_URL;

    const handleFollowUnfollow = async()=>{
        if(!currentUser){
            showToast("","Please login to follow","error",5000
            )
            return;
        }
        setUpdating(true);
        if(updating) return; //if updating and user clicks the button again then return
        try {
            const res= await fetch(`${apiUrl}/users/follow/${user._id}`,{
                method:"POST",
                credentials: "include", // This will send cookies with the request
                headers:{
"Content-Type": "application/json",
                }
            })

            const data= await res.json();
            if(data.error){
                showToast("Error",data.error,"error",5000)
                return;
              }

              if(following){
                showToast("Success",`Unfollowed ${user.name}`,"success",5000
                )
                user.followers.pop();
              }
              else{
                showToast("Success",`Followed ${user.name}`,"success",5000
                )
                user.followers.push(currentUser?._id); //simulate adding to followers
              }

            setFollowing(prev=>!prev)
            
        } catch (error) {
            showToast("Error",data.error,"error",5000)            
        } finally{
            setUpdating(false)
        }
    }
  return {handleFollowUnfollow, updating, following}
}

export default useFollowUnfollow