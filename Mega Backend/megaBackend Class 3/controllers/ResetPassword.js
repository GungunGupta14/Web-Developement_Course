const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt");

//reset password token
exports.resetPasswordToken=async(req,res)=>{
    
try{
        //get email from req body
        const email=req.body.email;

        //check email from user, validate email
        const user=await User.findOne({email:email});
        if(!user){
            return res.json({
                success:false,
                message:'Your email is not registered',
            });
        }

        //generate token
        const token=crypto.randomUUID();

        //update user by adding token and expiration time
        const updatedDetails= await User.findOneAndUpdate({email:email},{
            token:token,
            resetPasswordExpires:Date.now()+5*60*1000,
        },
        {new:true});

        //create url
        const url=`http://localhost:3000/update-password/${token}`;

        //sendd mail containing the ul
        await mailSender(email,"Password Reset Link", `Password reset link:${url}`);

        //send response
        return res.json({
            success:true,
            message:"Email sent successfully, Please check email and change password",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reseting Password",
        });

    }
}
//resetpassword
exports.resetPassword=async(req,res)=>{
    try{
        //datafetch
        const {password,confirmPassword,token}=req.body;

        //validation
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password didn't match",
            });
        }

        //get user details from db using token
        const userDetails= await user.findOne({token:token});

        //if no entry-invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is invalid",
            });
        }

        //check token time
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({
                success:false,
                message:"token is expired, please regerate your token!",
            });
        }

        //hash password
        const hashedPassword=await bcrypt.hash(password,10);

        //update password
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );

        //return response
        return res.status(200).json({
            success:true,
            message:"Password reset successful!"
        });
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Password reset unsuccessful!",
        });
    }
}