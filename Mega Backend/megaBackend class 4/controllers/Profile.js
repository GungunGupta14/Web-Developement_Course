const Profile= require("../models/Profile");
const User=require("../models/User");

exports.updateProfile=async (req, res)=>{
    try{
        //get data
        const {dateOfBirth="", about="", contactNumber, gender}=req.body;
        //get uder id
        const id=req.user.id;
        //validation
        if(!contactNumber ||!gender){
            return res.status(400).json({
                success:false,
                message:"All feilds are required",
            });
        }
        //find profile
        const userDetails= await User.findById(id);
        const profileId=userDetails.additionalDetails;
        const profileDetails= await profile.findById(profileId);
        //update profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success:true,
            message:"Profile Updated successfully!",
            profileDetails,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Profile not updated successfully!",
            error:error.message,
        });
    }
};
 //delete account
exports.deleteAccount= async(req,res)=>{
    try{
        //get id
        const id=req.user.id;
        //validation
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not found!",
            });
        }
        ////deelte profile of user
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //delete user
        //unenroll user from all enrolled courses
        await User.findByIdAndDelete({_id:id});
        //return response
        return res.status(200).json({
            success:true,
            message:"User deleted successfully!",
            updatedSection,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User not Deleted successfully!",
            error:error.message,
        });

    }
};
exports.getAllUsersDetails= async(req,res)=>{
    try{
        //get id
        const id=req.user.id;
        //;validation
        const userDetails=await User.findById(id).populate("additionalDeatils").exec();
        return res.status(200).json({
            success:true,
            message:"User data fetched successfully!",
            updatedSection,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            error:error.message,
        });

    }
}