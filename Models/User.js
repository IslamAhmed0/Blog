const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const customError=require('../Helpers/CustomError');
const _ = require("lodash");
const util=require('util');
const jwtSecret=process.env.JWT_SECRET;
const saltRounds=7
const UserSchema= new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    followedUsers: { type: [mongoose.Schema.Types.ObjectId], ref: "User" }


},{
    timestamps:true,
    toJSON:{
        transform:doc=>{
            return _.pick(doc ,['_id','firstname','lastname','email','password'])
        }
    }
})

const sign= util.promisify(jwt.sign);
const verify= util.promisify(jwt.verify)








sign({userId:''},jwtSecret).then((token)=>{
    console.log(token)
})
.catch(err=>{
    console.log(err)
})

UserSchema.virtual('blogs',{
    ref:"Blogs",
    localField:'_id',
    foreignField:'userId'
});

verify('token',jwtSecret).
then(req=>req.User=User)
.catch(err=>{console.error(err)})

UserSchema.pre("save",async function(){
    const userInstance=this;
    if(this.isModified('password')){
     userInstance.password= await bcrypt.hash(userInstance.password,saltRounds);
    }
})

UserSchema.methods.comparePassword= async function (plainpassword){
    const userInstance=this;
    return bcrypt.compare(plainpassword,userInstance.password)
}

UserSchema.methods.compareEmail= async function (plainemail){
    return await User.find({email:plainemail})
}
UserSchema.methods.generateToken=function(){
    const userInstance=this;
    return sign({userId:userInstance.id },jwtSecret);
};

UserSchema.statics.getUserFromToken= async function(token){
   const User=this;
   const payload= await verify(token,jwtSecret);
    const currentUser=await User.findById(payload.userId);
    if(!currentUser) throw customError("User not Found",404)
    return currentUser;
}
const User= mongoose.model('User', UserSchema);
module.exports=User;
