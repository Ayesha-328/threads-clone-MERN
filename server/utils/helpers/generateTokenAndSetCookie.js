import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set secure flag in production
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none",
	  });

	return token;
};

export default generateTokenAndSetCookie;
