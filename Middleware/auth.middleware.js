const Islogin=async(req,res,next)=>{
    try{
        if(req.session.user){

        }else{
            res.redirect("login")
        }
        next()
    }catch(error){
        console.log(error);
    }
}
const Islogout=async(req,res,next)=>{
    try{
        if(req.session.user){
            res.redirect("dashbord")
        }
        next()
    }catch(error){
        console.log(error);
    }
}

module.exports={Islogin,Islogout}