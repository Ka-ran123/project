const UserModel = require('../model/user_model')
const bcrypt = require('bcryptjs')

const generateToken = require('../utils/genareteToken')

const UserController = {
    createUser:async function(req,res){
        try
        {
            const data = req.body
            // console.log(data);
            const foundUser = await UserModel.findOne({email:data.email})
            if(foundUser)
            {
                const response = {success:false , message:"Email is already exist"}
                return res.status(401).json(response)
            }
            const user=new UserModel(data)
            await user.save()

            // const userData = {
            //     name:user.name,
            //     email:user.email,
            //     mobileNo:user.mobileNo,
            //     id:user._id
            // }

            const userData = user.getData()
            const userToken = await generateToken.genarateToken(user._id)
            // console.log(userToken);
            const response = {success:true ,data:userData,message:"New User Created" , token:userToken}
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

        const userData = findUser.getData()
        const userToken = await generateToken.genarateToken(findUser._id)

         const response={success:true,data:userData,message:"Sign in successfully",token:userToken}
         return res.json(response);

        } catch (e) {
             const response={success:false,message:e.message}
             return res.status(400).json(response);
        }
     },
     changePassword:async function(req,res){
        try
        {

            _id=req.body._id
            password=req.body.password
            newPassword=req.body.newPassword

         const findUser=await UserModel.findById({_id});
        //  console.log(findUser);


        const matchPass=await bcrypt.compare(password,findUser.password);
         if(!matchPass)
         {
             const response={success:false,message:"Password is wrong"}
             return res.status(401).json(response)
         }

         findUser.password = newPassword
         await findUser.save()
         const response={success:true,message:"Password is change"}
         return res.json(response)
        }
        catch(e)
        {
            const response={success:false,message:e.message}
             return res.status(400).json(response);
        }
     }
}

module.exports = UserController