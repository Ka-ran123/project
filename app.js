const express =require('express');
const app=express();
const port = process.env.PORT | 8000;

require('./src/db/conn')
const Main = require('./src/model/user_model')

app.get("/" , (req,res)=>{
    res.send('Hello')
})


app.listen(port ,()=>{
    console.log(`Run at ${port}`);
})