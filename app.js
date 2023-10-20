const express =require('express');
const cors =require('cors');
const app=express();
const port = process.env.PORT | 5000;
const router= require('./src/router/user_router')

require('./src/db/conn')
const Main = require('./src/model/user_model')

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get("/" , (req,res)=>{
    res.send('Hello')
})

app.use(router)

app.listen(port ,()=>{
    console.log(`Run at ${port}`);
})