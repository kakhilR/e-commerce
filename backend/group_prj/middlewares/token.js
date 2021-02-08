const jwt = require("jsonwebtoken");

exports.requiresignin = (req,res,next)=>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token,"secret");
        req.user= user;
    }
    else{
        return res.status(401).json({message:"authorization is required"})
    }next();
}
exports.adminPermission = (req,res,next)=>{
    if(req.user.role !== "admin"){
        return res.status(400).json({message:"Sorry only admin can"})
    }
    next();
}

exports.userPermission = (req,res,next)=>{
    if(req.user.role !== 'user'){
        return res.status(400).json({message:"please signin  to upload a product"})
    }
    next()
}
