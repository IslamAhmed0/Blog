const mongoose=require('mongoose');
const _ = require("lodash");

const BlogsSchema=new mongoose.Schema({

    userId:{
        type:mongoose.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    tags:{
        type:[String],
        required:false,
    }
},{
    timestamps:true,
    toJSON:{
        transform:doc=>{
            return _.pick(doc ,['_id','title','body','tags','userId'])
        }
    }

})


const Blogs=mongoose.model('Blogs',BlogsSchema)
module.exports=Blogs;
