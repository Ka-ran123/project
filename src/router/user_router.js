const express= require('express')
const router = new express.Router();
const UserController = require('../controller/user_controller')



router.post("/createUser" , UserController.createUser)
router.post("/signIn" , UserController.signIn)

module.exports = router