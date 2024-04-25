const mongoose=require('mongoose')
require('dotenv').config()

const database=async()=>{
    await mongoose.connect(process.env.DATABASE_LINK)
    console.log("database conntect...");
}

module.exports=database