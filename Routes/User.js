 const express=require('express');
 const router=express.Router()
 const {check}=require('express-validator');
 const authenticationMiddleware=require('../Middlewares/Authentication');
 const customError=require('../Helpers/CustomError');

const User=require('../Models/User');


/// validation email
let validation=[check('password')
    .isLength({min:4})
    .withMessage("Password must four"),
check('email')
    .isEmail()
    .withMessage("Incorrect Email")];

//
// router.get('/:id',async(req,res,next)=>{
//     const {id}=req.params
//     console.log(id)
//     const users= await User.findById(id)
//     res.json(users)
// })
//
//



 // registration
router.post('/register',async (req,res,next)=>{
    try{
    const{firstname,lastname,email,password}=req.body
    const user=new User({
        firstname,
        lastname,
        email,
        password
    })
    await user.compareEmail(email)
    await user.save();
    console.log(user);
    res.json(user);
}
catch(err){
    console.log(err)
}
})



//login
router.get('/loginandreg', async (req,res)=>{
    res.render('registeration')

})


 //create
 router.post('/create',async (req,res,next)=>{

     const {email,password}=req.body;
     const user= await User.findOne({email})
     if(!user){
         throw customError(404,'Invalid email or password')
     }
     const isMatch=await user.comparePassword(password);
     if(!isMatch){
         throw customError(401,'Invalid email or password')
     }
     const token= await user.generateToken();
     // res.render('registeration')
     //res.render('createposts')
     res.render('createposts',{user,token});


 })





//delete
 router.delete('/:id',authenticationMiddleware,async(req,res,next)=>{

    const {id}=req.params
    const user= await User.findByIdAndDelete(id);
    res.json(user)

})


//edit
router.patch('/:id',async(req,res,next)=>{

     const {id}=req.params
     const{firstname,lastname,email,password}=req.body
     const user= await User.findByIdAndUpdate(id,{
         firstname,
         lastname,
         email,
         password
     }
     );
     res.json(user)
     })






//profile

 router.get('/profile/:id', authenticationMiddleware, async (req, res, next) => {
     const { id } = req.params;
     const author = await User.findById(id);
     res.send(author);
 });


 // follow  User
 router.post("/follow/:id", authenticationMiddleware,(async (req, res, next) => {
         await User.updateOne({ $push: { followedUsers: req.params.id } });
         res.status(200).send({
             message: "success follow "
         });
     })
 );

 // unFollow specific User
 router.post("/unfollow/:id", authenticationMiddleware, (async (req, res, next) => {
         await User.updateOne(
             { $pull: { followedUsers: req.params.id } }
         );
         res.status(200).send({
             message: "success unfollow "
         });
     })
 );

module.exports=router;
