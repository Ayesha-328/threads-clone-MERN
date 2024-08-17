import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d'
    })

    res.cookie("jwt" , token ,{
        httpOnly: true, //This cookie cannot be accessed by the browser(js) --> more secure
        maxAge: 15*24*36*36*1000, //15 days
        sameSite: "strict" //CSRF
    })

    return token;
}

export default generateTokenAndSetCookie;