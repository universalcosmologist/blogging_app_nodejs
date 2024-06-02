const {Schema,model}=require('mongoose');

const blogSchema=new Schema({
   blogtitle:{
    type:String,
    required:true,
   },
   blogcontent:{
    type:String,
    required:true,
   },
   coverImageURL:{
    type:String,
    required:false,
   },
   createdBy:{
    type:Schema.Types.ObjectId,
    ref:"user",
   },
},{
  timestamps:true,
});

const Blog=model('blog',blogSchema);

module.exports=Blog;