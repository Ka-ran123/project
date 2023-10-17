const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');

const User=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobileno:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    craetedat:{
        type:Date,
        default:Date.now()
    }
    // confirmpassword:{
    //     type:String,
    //     required:true
    // },
    
})


User.pre('save' , async function(next){
        
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hash(this.password , salt);
    next();
})



const UserModel = new mongoose.model('user', User)

module.exports = UserModel;