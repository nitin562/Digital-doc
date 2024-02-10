const express=require("express")
const {check}=require("express-validator")
const { getData, getCollaboratorsAndData, Save, search } = require("../Controller/Data")
const { customValidatorForJwt } = require("../MWR/helper")
const router=express.Router()

//Save-Post
// router.post("/Save",[check("title","Empty Title").isLength({min:1}),check("tokenForSave","Token may not be correct").custom(customValidatorForJwt)],SaveData)
// getData
router.get("/data",getData)
//Save delta without changing collabs
// router.post("/SaveDelta",[check("title","Empty title").isLength({min:1}),check("id","id is not present").exists()],SaveWithIds)
//get collaborators for particular doc
router.get("/DataAndcollabs",getCollaboratorsAndData)
router.post("/Save",[check("title","Title is undefined").isLength({min:1}),check("contributor","Tokens have defect").custom(customValidatorForJwt)],Save)
//to search 
router.get("/search",search)
module.exports=router