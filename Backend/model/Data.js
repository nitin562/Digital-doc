const db=require("mongoose")
const schema=new db.Schema({
    title:{
        type:String,
        required:true
    },
    delta:{
        type:Object,
        required:true
    },
    contributor:[{
        type:db.Types.ObjectId,
        required:true,
        ref:"user"
    }]
},{timestamps:true})

const DataModel=db.model("Data",schema)
module.exports=DataModel