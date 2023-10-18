const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const validator = require('validator');


const User=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Please Enter Valid E-Mail')
            }
        }
    },
    mobileNo:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    craetedat:{
        type:Date,
        default:Date.now()
    },    
})

User.methods.getData = function()
{
    return {
        name:this.name,
        email:this.email,
        mobileNo:this.mobileNo,
        id:this._id
    }
}

User.pre('save' , async function(next){
        
    if(this.isModified('password'))                        // only for password mate j
    {
        const salt = bcrypt.genSaltSync(10);
        this.password =await bcrypt.hash(this.password , salt);
        next();
    }
})


const UserModel = mongoose.model('user', User)

module.exports = UserModel;