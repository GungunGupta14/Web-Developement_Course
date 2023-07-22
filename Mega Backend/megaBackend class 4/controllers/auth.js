const User=require("../models/User");
const OTP= require("../models/OTP");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const jwt= require("jsonwebtoken");
const mailSender=require("../utils/mailSender");

require("dotenv").config();

//otpsend
exports.sendOTP=async(req,res)=>{
    //fetch email from request key body
    try{
        const {email}=req.body;

        //check if user already exists
        const checkUserPresent= await User.findOne({email});

        //if user exits, then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already registered",
            })
        }
        //generate otp
        var otp= otpGenerator.generate(6,{
            upperCaseAlphabet:false,
            lowerCaseAlphabet:false,
            specialChars:false,
        });
        console.log("OTP Generated ",otp);

        //check unique otp or not
        const result= await OTP.findOne({otp: otp});
        while(result){
            otp=otpGenerator(6,{
                upperCaseAlphabet:false,
                lowerCaseAlphabet:false,
                specialChars:false,
            });
           let result=await OTP.findOne({otp: otp});
        }

        //otp entry in database
        const otpPayload={email,otp};
        const otpBody= await OTP.create(otpPayload);
        console.log(otpBody);
        res.status(200).json({
            success:true,
            message:'OTP sent sucessfully!',
            otp,
        })
    }
    
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//signup
exports.signUp=async(req,res)=>{
        try{
    //fetch data from req body
    const {
        firstName,
        lastName,
        email,
        password,
        confrimPassword,
        accountType,
        contactNumber,
        otp
    }=req.body;
    //validate data
    if(!firstName ||!lastName ||!password || !email||!confrimPassword ||!otp){
        return res.status(403).json({
            success:false,
            message:"All fields are required",
        })
    }

    //match both passwords
    if(password!==confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and confirm password donot match",
        })
    }
    //check user already exists or not
    const existingUser= await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User is already registered",
        });
    }

    //fing most recent otp for the user
    const recentOtp=await otp.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);

    //validate otp
    if(recentOtp.length==0){
        //otp not found
        return res.status(400).json({
            success:false,
            message:"OTP found",
        })
    }else if(otp!== recentOtp.otp){
        return res.status(400).json({
            success:false,
            message:"Invalid Otp",
        });
    }

    //hash password
    const hashedPassword= await bcrypt.hash(password,10);

    //create entry in DB
    const profileDetails= await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    })

    const user= await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image: `https://api.dicebar.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })
    //return response to user
    return res.status(200).json({
        success:true,
        message:"User is registered successfully",
    })
}
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"User cannot be registered, Please try again!",
    })
    }
}
//login
exports.login=async(req,res)=>{
    try{
        //get data from req body
        const {email,password}=req.body;

        //validate data
        if(!email ||!password){
            return res.status(403).json({
                success:false,
                message:"All feilds are required, Please try again!",
            });
        }

        //user check exist or not
        const user=await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, Signup First!!",
            });
        }

        //generate token(jwt),after matching password
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
               expiresIn:"2h", 
            });
            user.token=token;
            user.password=undefined;

            //create cookie and send response
            const options={
                expires: new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully",
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure, please try again",
        });
    }
};

//changepassword
exports.changepassword=async(req,res)=>{
    try{
        //get data from req body
        const{email,oldPassword, newPassword,confirmNewPassword}=req.body;

        //get oldpw,newpw,confirmpw

        //validation
        if (!newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "Please provide all fields" });
        }
        if(newPassword!==confirmNewPassword){
            return res.status(403).json({
                success:false,
                message:"Passwords donot match! Please try again",
            });
        }

        //update pw in db
        const user = await User.findOne({ _id: req.user.id });
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
        user.password = newPassword;
        await user.save();

        //send mail-password updated
        await mailSender(email,"Password Changed", "your password has been changed, If you didn't change the password, we are really sorry, abhi help krni nhi aati mujhe, talk to you later bye!");
        
        //return response
        return res.status(200).json({
            success:true,
            message:"password changed successfully",
        });
    }
    catch(error){
        console.error(error);
    return res.status(500).json({ message: "Internal server error" });

    }
}