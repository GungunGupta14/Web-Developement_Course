
//Server start kra
const express=require('express');
const app=express();
//used to parse req.body in express -> put or post
const bodyParser=require('body-parser');
//pass json data and add it to the request.body fucntion
app.use(bodyParser.json());
//server ko port assign kra
app.listen(3000,()=>{
    console.log("Server started at port 3000");
});

//routes bna die
app.get('/',(request,response)=>{
    res.send("Hello man!");
})
app.post('/api/cars',(request,response)=>{
    const{name,brand}=request.body;
    console.log(name);
    console.log(brand);
    response.send("Car Submitted Successfully");
})
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/myDatabase',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{console.log("Connection Successful")})
.catch((error)=>{console.log("Recieved an error")})
