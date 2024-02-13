const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const encodePassword=async(pass)=>{
    const salt=await bcrypt.genSalt(10);
    return await bcrypt.hash(pass,salt);
}
const comparePassword=async(pass,hashPass)=>{
    return await bcrypt.compare(pass,hashPass)
}
const setToken=(value)=>{
    const payload={
        val:value
    }
    return jwt.sign(payload,process.env.secret)
}
const getToken=(token)=>{
    try {
        return jwt.verify(token,process.env.secret)
    } catch (error) {
        throw new Error("Token is invalid")
    }
}
const extractIdForMiddleware=(req,res,next)=>{
    let token;
    if(re.header("x-token")){
        token=req.header("x-token")
    }
   
    if(token){
        try {
            const id=getToken(token)
            req.user=id.val
            next()
        } catch (error) {
            console.log(error)
            return res.status(400).json({success:-2,msg:"Token is invalid"})
        }
    }
    else{
        return res.status(400).json({success:-2,msg:"Token is not present"})
    }
}
const customValidatorForJwt=(tokenArr,{req})=>{
    //{req} means req.req that has req object
    console.log(tokenArr,req.body.title)
    if(req.header("x-change")==="true" && tokenArr.length<=0){
        //means no need to check the token arr as there is no need of pushing new users in collabs
        return false
    }
    else if(req.body.id && req.header("x-change")==="false"){
        return true
    }
    else{
        
        let userIds=[]
        //check each token and put into req object
        for(let token of tokenArr){
            try {
                let id=getToken(token)
                userIds.push(id.val)
            } catch (error) {
                return false
            }
        }
        req.userIds=userIds
        return true
    }

   
}

module.exports={encodePassword, setToken, comparePassword,customValidatorForJwt,extractIdForMiddleware}