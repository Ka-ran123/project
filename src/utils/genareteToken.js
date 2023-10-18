const jwt=require('jsonwebtoken');

async function genarateToken(data){
    const token=await jwt.sign({_id:data} , process.env.SCRET_KEY)
    // console.log(token);
    return token;
}

module.exports.genarateToken = genarateToken;