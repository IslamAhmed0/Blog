const express=require('express');
const router=express.Router()
const {check}=require('express-validator');
const authenticationMiddleware=require('../Middlewares/Authentication');
const User=require('../Models/User');



const Blog=require('../Models/Blogs');




router.get('/',async (req,res,next)=>{
    const blogs=await Blog.find({})
    //     .populate({
    //     path:'userId',
    //     select:'_id firstname lastname email '
    // });
    res.render('index',{allposts:blogs})
})




router.get('/:id',async(req,res,next)=>{
const blog=await Blog.find(req.params)
res.json(blog)
})



//create post
router.post('/createpost',authenticationMiddleware,async (req,res,next)=>{
     console.log(req.body)
     const blog= new Blog(req.body);
      await blog.save();
     res.render('index',{allposts:blog});

})


//userposts
router.get('/userprofile/:id',async(req,res,next)=>{
    const {id}=req.params
    const blog= await Blog.find({userId:id});
    res.json(blog)
})




//search post
router.get('/:id',async(req,res,next)=>{
    const{id}=req.params;
    const blog= await Blog.findById(id)
    console.log(blog)
    res.json(blog)
})


//edit

router.patch('/:id',authenticationMiddleware,async(req,res,next)=>{
    const {id}=req.params;
    const editBlog= await Blog.findByIdAndUpdate(id, req.body,{
      new:true, omitUndefined:true,runValidators:true
    })
    res.json(editBlog)
})

//delete

router.delete('/:id',authenticationMiddleware,async(req,res,next)=>{
    const{id}=req.params;
    const blog= await Blog.findByIdAndDelete(id);
    res.send(blog);
    console.log(blog)

})



module.exports=router;
