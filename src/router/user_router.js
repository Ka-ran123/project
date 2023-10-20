const express= require('express')
const router = new express.Router();
const UserController = require('../controller/user_controller')



router.post("/createUser" , UserController.createUser)

router.get("/createUser" , (req,res)=>{
    res.send("Hello World")
})

router.post("/signIn" , UserController.signIn)

router.post("/changePassword" , UserController.changePassword)

router.post("/forgetPassword" , UserController.forgetPassword)

module.exports = router