import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js"

// Signup a new user
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      // All fields must require
      return res.json({ success: false, message: "Missing Details" });
    }
    const user = await User.findOne({email});
    if (user) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    return res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error.message); 
    return res.json({ success: false, message: error.message });
  }
};

// login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.json({ success: false, message: "email is required" });
    }
    if (!password) {
      return res.json({ success: false, message: "password is required" });
    }

    const userData = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalis credentials" });
    }
    const token = generateToken(userData._id);

    return res.json({
      success: true,
      userData,
      token,
      message: "Login successfull",
    });
  } catch (error) {
    console.log(error.message); 
    return res.json({ success: false, message: error.message });
  }
};

// to check if user is authenticated or not 
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// update user profile details
export const updateProfile =async (req, res) => {
   try {
        const {profilePic , bio,fullName} =req.body
        const userId =req.user._id;
        let updatedUser;

        if(!profilePic){
            updatedUser= await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})
        }
        else{
            const upload=await cloudinary.uploader.upload(profilePic)

            updatedUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true})

        }
        res.json({success:true,user:updatedUser})
   } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
   }
};

// gemini start  