const {validateToken}=require('../services/authenticate')

function checkforAuthandToken(){
    return (req,res,next)=>{
        req.user=null;
        const tokenValue=req.cookies['token'];
        if(!tokenValue){
          return  next();
        }
        try{
            const payload=validateToken(tokenValue);
            req.user=payload;
        } catch(error){}
       return next();
    }
};

function strictCheckforAuthentication(){
    return (req,res,next)=>{
        if(!req.user){
            return res.render('signin');
        }
        return next();
    }
}

module.exports={
    checkforAuthandToken,
    strictCheckforAuthentication,
}