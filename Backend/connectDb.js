const mongoose=require("mongoose")
const url="mongodb+srv://nitindbas8800:nitindbas8800@cluster0.dubdcva.mongodb.net/?retryWrites=true&w=majority"
const mongoConnect=async()=>{
    mongoose.connect(url).then(()=>{console.log("connected to DB"),(err)=>{console.log(err)}})}
module.exports=mongoConnect