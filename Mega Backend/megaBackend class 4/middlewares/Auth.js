const jwt=require("jsonwebtoken");
require("dotenv").config();
const user=require("../models/User");


//auth
exports.auth=async(req,res,next)=>{
    try{
        //extract token
        const token=req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer","");
        //if token is missing, then return response
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token is missing",
            });
        }
        //verify the token
        try{
            const decode= jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:"Token is invalid!",
            });

        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",
        });
    }
}

//atudent
exports.isStudent=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Student"){
            res.status(401).json({
                success:false,
                message:"This is a protected route for students only",
            });
        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again!"
        })
    }
}

//instructor
exports.isInstructor=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only",
            });
        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again!"
        })
    }
}

//admin
exports.isAdmin=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only",
            });
        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again!"
        })
    }
}
