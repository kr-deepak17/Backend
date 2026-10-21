const express = require('express');
const users = require("./MOCK_DATA.json");
const app= express();
const fs = require('fs');
const { stringify } = require('querystring');
const { json } = require('stream/consumers');
const PORT=8000;

//middleware -Plugin
app.use(express.urlencoded({extended:false}));

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

app.get('/users',(req,res)=>{
    const html=`
    <ul>
    ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})



// routes
app.get('/api/users',(req,res)=>{
    console.log(req.headers);
    console.log("i am in get route",req.myUsername);
    res.setHeader("X-myname","deepak kumar");// custom header
    //always add X to custom headers;
    return res.json(users);
})



app.post('/api/users',(req,res)=>{
    const body = req.body;
    // console.log("Body" ,body);
    if(!body || !body.first_name|| !body.last_name||!body.email ||!body.gender || !body.job_title){
        return res.status(401).json({msg:"all fields are req"});
    }
    users.push({id:users.length+1,...body});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.status(201).json({status:" sucess",id:users.length});
    });
})


// REST API's
app
    .route("/api/users/:id")

    .get((req,res)=>{
        const id = Number(req.params.id);
        const user =users.find((user)=>user.id===id);
        if(!user){
            return res.status(404).json({msg:"userID not found"});
        }
        return res.send(user);

    })



    .put((req,res)=>{
        //create a new user with id
        res.json({status:"pending"});
    })


    .patch((req,res)=>{
    // edit user with id 
     const id = Number(req.params.id);
     const body = req.body;
     const user = users.find((user)=>user.id===id);
     if(!user){
        return res.status(404).json({status :"user not found"});
     };
     Object.assign(user,body);
     fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err)=>{
          return res.json({
            status:"sucess",
            id:'user.id',

        });
     })
    })


    .delete((req,res)=>{
        const id = Number(req.params.id);
        const body = req.body;
        const index = users.find((user)=>user.id===id);
        if(!index){
            return res.status(404).json({status:"user not found"})
        }
        const deletedUser =users.splice(index,1)[0];
        fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err)=>{
            return res.json({
                status:"sucess",
                id:id,
                user:deletedUser.first_name
            })
        })
        
      
    })

   
    




