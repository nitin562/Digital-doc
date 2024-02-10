const {Schema,model}=require("mongoose")
const userSchema=new Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

const user=model("user",userSchema)
module.exports=user