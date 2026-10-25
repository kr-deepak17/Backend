const express = require('express');
const users = require("./MOCK_DATA.json");
const app= express();

const mongoose =require ('mongoose');

const fs = require('fs');

const { stringify } = require('querystring');
const { json } = require('stream/consumers');
const { timeStamp } = require('console');
const PORT=8000;

//connection
mongoose.connect('mongodb://127.0.0.1:27017/youtube-app-1')
.then(()=>console.log("MongoDb connected"))
.catch((err)=>{
    console.log("Mongo error",err);

})


//schema
const userschema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    gender:{
        type:String,
        required:true,
    },
    
},{timestamps:true});
const User = mongoose.model('user',userschema);




//middleware -Plugin
app.use(express.urlencoded({extended:false}));
app.use(express.json({extended:false}));

app.use((req,res,next)=>{
    console.log("hello from middleware 1");
    fs.appendFile('./log.txt',`\n${Date.now()}:${req.ip}:${req.method} :${req.path}`,(err,data)=>{
        
    })
    req.myUsername = "deepakKumar.dev";
    next();
    // return res.json({msg:"hello from middlware 1"});
    
    
})

app.use((req,res,next)=>{
    console.log("hello from middleware 2",req.myUsername);
    next();
    
})

app.listen(PORT,()=>{
     console.log("server started at port 8000"); 
})

app.get('/users',async(req,res)=>{
    const allUsers= await User.find({});
    const html=`
    <ul>
    ${allUsers.map((user)=>`<li>${user.firstName}-${user.email}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})



// routes
app.get('/api/users',async (req,res)=>{
    const allDbUsers=await User.find({});
    console.log(req.headers);
    console.log("i am in get route",req.myUsername);
    res.setHeader("X-myname","deepak kumar");// custom header
    //always add X to custom headers;
    return res.json(allDbUsers);
})



app.post('/api/users',async(req,res)=>{
    const body = req.body;
    // console.log("Body" ,body);
    if(!body || !body.first_name|| !body.last_name||!body.email ||!body.gender || !body.job_title){
        return res.status(401).json({msg:"all fields are req"});
    }
    // users.push({id:users.length+1,...body});
    // fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
    //     return res.status(201).json({status:" sucess",id:users.length});
    // });
    const result=await User.create({
        firstName:body.first_name,
        lastName:body.last_name,
        email:body.email,
        gender:body.gender,
        job_title:body.job_title

    });
    console.log("result",result);
    return res.status(201).json({msg:"sucess"});
    
})


// REST API's
app
    .route("/api/users/:id")

    .get(async(req,res)=>{
        const id = Number(req.params.id);
        const user = await User.findById(req.params.id);
        // const user =users.find((user)=>user.id===id);
        if(!user){
            return res.status(404).json({msg:"userID not found"});
        }
        return res.send(user);

    })



    .put((req,res)=>{
        //create a new user with id
        res.json({status:"pending"});
    })


    .patch(async(req,res)=>{
    // edit user with id 
     await User.findByIdAndUpdate(req.params.id,{lastName:"changed"});
     const id = Number(req.params.id);
     const body = req.body;
    //  const user = users.find((user)=>user.id===id);
    //  if(!user){
    //     return res.status(404).json({status :"user not found"});
    //  };
    
    //  Object.assign(user,body);
    //  fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err)=>{
    //       return res.json({
    //         status:"sucess",
    //         id:'user.id',

    //     });
    //  })
     return res.send({msg:"sucess"});
    })


    .delete(async(req,res)=>{
        await User.findByIdAndDelete(req.params.id)
        res.send({msg:"user is deleted"});

        
        // const id = Number(req.params.id);
        // const body = req.body;
        // const index = users.find((user)=>user.id===id);
        // if(!index){
        //     return res.status(404).json({status:"user not found"})
        // }
        // const deletedUser =users.splice(index,1)[0];
        // fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err)=>{
        //     return res.json({
        //         status:"sucess",
        //         id:id,
        //         user:deletedUser.first_name
        //     })
        // })
        
      
    })

   
    




