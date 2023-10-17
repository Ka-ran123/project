const UserModel = require('../model/user_model')
const bcrypt = require('bcryptjs')

const UserController = {
    createUser:async function(req,res){
        try
        {
            const data = req.body
            console.log(data);
            const foundUser = await UserModel.findOne({email:data.email})
            if(foundUser)
            {
                const response = {success:false , message:"Email is already exist"}
                return res.status(401).json(response)
            }
            const user=new UserModel(data)
            await user.save()
            const response = {success:true ,data:user,message:"New User Created"}
            return res.json(response)
        }
        catch(e)
        {
            const response = {success:false , message:e.message}
            return res.status(400).json(response)
        }
    },
    signIn:async function(req,res){
        try {
         email=req.body.email,
         password=req.body.password
 
         const findUser=await UserModel.findOne({email});
         if(!findUser)
         {
             const response={success:false,message:"Email is not exist"}
             return res.status(401).json(response)
         }
         const matchPass=await bcrypt.compare(password,findUser.password);
         if(!matchPass)
         {
             const response={success:false,message:"Password is wrong"}
             return res.status(401).json(response)
         }
 
         const response={success:true,data:findUser,message:"Sign in successfully"}
         return res.json(response);

        } catch (e) {
             const response={success:false,message:e.message}
             return res.status(400).json(response);
        }
     }
}

module.exports = UserController