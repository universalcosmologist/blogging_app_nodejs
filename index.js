const express=require('express');

const mongoose=require('mongoose')

const path=require('path');

const user_route=require('./routes/route');

const Blog=require('./models/blog');

const blog_route=require('./routes/blog');
const cookieParser = require('cookie-parser');

const {checkforAuthandToken,strictCheckforAuthentication}=require('./middlewares/authentication');

const app=express();
const port=8000;

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

mongoose.connect('mongodb://127.0.0.1:27017/blogify');

app.use(express.urlencoded({extended:false}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(checkforAuthandToken());

app.use('/user',user_route);

app.use('/blog',strictCheckforAuthentication(),blog_route);

app.get('/',async(req,res)=>{
    const allblogs=await Blog.find({});
    return res.render('HomePage',{
        user:req.user,
        blogs:allblogs,
    });
})

app.listen(port,()=>{
    console.log(`server started at port : ${port}`);
})