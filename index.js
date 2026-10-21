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
        next();
    })
    // return res.json({msg:"hello from middlware 1"});
    req.myUsername="deepakKumar.dev";
    next();
    
    
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
    console.log("i am in get route",req.myUsername);
    return res.json(users);
})

app.get('/api/users/:id',(req,res)=>{
    const id = Number(req.params.id);
    const user =users.find((user)=>user.id===id);
    return res.send(user);
})

app
    .route("/api/users/:id")
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
     }
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

    app.post('/api/users',(req,res)=>{
        const body = req.body;
        // console.log("Body" ,body);
        users.push({id:users.length+1,...body});
        fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
            return res.json({status:" sucess",id:users.length});
        })
    });
    




