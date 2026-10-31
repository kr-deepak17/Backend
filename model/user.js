

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
module.exports={User,}

