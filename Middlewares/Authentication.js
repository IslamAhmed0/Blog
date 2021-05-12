const User=require('../Models/User');
const customError=require('../Helpers/CustomError');
module.exports=async (req,res,next)=>{
    //const base64Credentials =  req.headers.authorization.split(' ')[1];

    //The HTTP Authorization request header contains
    const token=req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }
    console.log(req.headers.authorization)
    next();

}
