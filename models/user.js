const {Schema,model}=require('mongoose');

const crypto=require('crypto');

const {createTokenForUser}=require('../services/authenticate');

const Userschema=new Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default:'/images/default_profile.webp',
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
        required:true,
    }
},{
    timestamps:true,
});

Userschema.pre('save',function(next){
    const user=this;

    if(!user.isModified('password')) return next();

    const salt=crypto.randomBytes(16).toString('hex');

    const hashed_password=crypto.createHmac('sha256',salt).update(user.password).digest('hex');
 
    user.salt=salt;

    user.password=hashed_password;

    next();
})

Userschema.static("matchPasswordAndGenerateToken",async function(email,password){
    const user= await this.findOne({email});
    if(!user) throw new Error('user not found');

    const salt=user.salt;
    const hashed_password=user.password;
   
    const to_be_checked_hash=crypto.createHmac('sha256',salt).update(password).digest('hex');
    
    if(to_be_checked_hash!==hashed_password) throw new Error('password not matched');

    const token=createTokenForUser(user);
    return token;
})

const User=model('user',Userschema);

module.exports=User;