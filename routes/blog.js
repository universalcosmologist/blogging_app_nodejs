const express=require('express');

const multer=require('multer');

const path=require('path');

const Blog=require('../models/blog');

const Comment=require('../models/comment');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads/'));
    },
    filename: function (req, file, cb) {
        const filename=`${Date.now()}-${file.originalname}`;
      cb(null,filename);
    }
  })
  
const upload = multer({ storage: storage })

const router=express.Router();

router.get('/post',(req,res)=>{
    return res.render('BlogPost',{
        user:req.user,
    });
})

router.post('/post',upload.single('coverimage'),async(req,res)=>{
   const {blogtitle,blogcontent}=req.body;

   const blog=await Blog.create({
      blogtitle:blogtitle,
      blogcontent:blogcontent,
      createdBy:req.user._id,
      coverImageURL:`/uploads/${req.file.filename}`,
   })

   return res.redirect(`/blog/${blog._id}`);
})

router.post('/comment/:id',async(req,res)=>{
    const {content}=req.body;
    await Comment.create({
       content,
       blogId:req.params.id,
       createdBy:req.user._id,
    });

    return res.redirect(`/blog/${req.params.id}`);
})

router.get('/:id',async(req,res)=>{
     const blog=await Blog.findById(req.params.id).populate('createdBy');
     const comments=await Comment.find({blogId:`${req.params.id}`}).populate('createdBy');
     return res.render('BlogRead',{
        user:req.user,
        blog,
        comments,
     });
})

module.exports=router;