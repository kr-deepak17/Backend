const User=require("../models/user");
async function handleGetAllusers(req,res){
    const allDbUsers=await User.find({});
    return res.json(allDbUsers);
    

}

async function handleGetUserById(req,res){
    const id = Number(req.params.id);
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({msg:"userID not found"});
    }
    return res.send(user);
}

async function handleUpdateUserById(req,res){
    await User.findByIdAndUpdate(req.params.id,{lastName:"changed"});
    return res.json({msg:"sucess"});
}

async function handleDeleteUserById(req,res){
    await User.findByIdAndDelete(req.params.id);
    res.send({msg:"user is deleted"}); 
}

async function handleCreateUser(req,res){
    const body = req.body;
    if(!body || !body.first_name|| !body.last_name||!body.email ||!body.gender || !body.job_title){
        return res.status(401).json({msg:"all fields are req"});
    }
    
    const result=await User.create({
        firstName:body.first_name,
        lastName:body.last_name,
        email:body.email,
        gender:body.gender,
        job_title:body.job_title

    });
    console.log("result",result);
    return res.status(201).json({msg:"sucess",id:result._id});


}

module.exports={
    handleGetAllusers,handleGetUserById,handleUpdateUserById,handleDeleteUserById,handleCreateUser,
};