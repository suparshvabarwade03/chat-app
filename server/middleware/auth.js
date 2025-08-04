import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    // let token;
    // if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    //     token = req.headers.authorization.split(" ")[1];
    // }
    // else if(req.headers.token){
    //     token=req.headers.token
    // }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
