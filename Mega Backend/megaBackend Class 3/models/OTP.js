const mongoose=require("mongoose");
const mailSender=require("../utils/mailSender");

const otpSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
  otp:{
    type:String,
    required:true,
  },
  createdAt:{
    type:Date,
    default:Date.now(),
    expires:5*60,
  },
});

//a function to send email
async function sendVerificationEmail(email, otp){
    try{
        const mailResponse=await mailSender(email, "Verification Email From StudyNotion", otp);
        console.log("Email send Successfully", mailResponse);
    }
    catch(error){
        console.error("Error occured while sending mail",error);
        throw error;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports= mongoose.model("OTP", otpSchema);

