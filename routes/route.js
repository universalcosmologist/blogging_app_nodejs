const express=require('express');

const User=require('../models/user');

const router=express.Router();

router.get('/signup',(req,res)=>{
    return res.render('signup');
})

router.get('/signin',(req,res)=>{
    return res.render('signin');
})

router.get('/logout',(req,res)=>{
    return res.clearCookie('token').redirect('/');
})

router.post('/signup',async(req,res)=>{
    const {fullname,email,password}=req.body;
   await User.create({
     fullname: fullname,
     email: email,
      password: password,
   });

   return res.redirect('/');
})

router.post('/signin',async (req,res)=>{
     const {email,password}=req.body;
     try{
        const token=await User.matchPasswordAndGenerateToken(email,password);
        res.cookie('token',token);
        return res.redirect('/');
     }
     catch{
        return res.render('signin',{
            error:'incorrect email or password',
        })
     }
})

module.exports=router;