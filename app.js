const express =require('express');
const app=express();
const port = process.env.PORT | 8000;
const router= require('./src/router/user_router')

require('./src/db/conn')
const Main = require('./src/model/user_model')

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get("/" , (req,res)=>{
    res.send('Hello')
})

app.use(router)

app.listen(port ,()=>{
    console.log(`Run at ${port}`);
})