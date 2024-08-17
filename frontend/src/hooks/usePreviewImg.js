import React, { useState } from 'react'
import useShowToast from './useShowToast';

const usePreviewImg = () => {
    const [imgUrl,setImgUrl] = useState("");
    const toast = useShowToast();

    const handleImageChange = (e)=>{
        const file = e.target.files[0]
        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();

            reader.onloadend = () =>{
                setImgUrl(reader.result);
            }

            reader.readAsDataURL(file);
        }else{
            toast("Invalid File Type","Please select an image file","error", 5000 )
            setImgUrl(null);

        }
    }
  return {handleImageChange,imgUrl,setImgUrl}
}

export default usePreviewImg