import mongoose from "mongoose"

// function to connect to mongodb db
export const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected',()=>console.log("DB CONNECTED"))  // event 
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch (error) {
        console.log(error);   
    }
}

 