//create course
const Course=require("../models/Course");
const Tag= require("../models/Tags");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader");

//exports course handler function
exports.createCourse= async(req,res)=>{
    try{
        //fetch data
        const {courseName, courseDescription, whatYouWillLearn,price,tag}=req.body;

        //get thumbnail
        const thumbnail=req.files/thumbnailImage;

        //validation
        if(!coursename||!courseDescription||!price||!whatYouWillLearn||!tag||!thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        //check for instructor
        const userId=req.user.id;
        const instructorDetails=await User.findById(userId);
        console.log("Instructor Details",instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor details not found",
            });
        }

        //check given tag is valid or not
        const tagDetails=await Tag.findByID(tag);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"Tag details not found",
            });
        }
        //upload images to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        });

        //add new course to user schema of instructor
        await User.findByIdAndUpdate({
            _id:instructorDetails._id
        },
        {$push:{courses:newCourse._id,}},{new:true},);

        //update tag schema
        //return response
        return res.status(200).json({
            success:true,
            message:"Course created successfully",
        })


    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Failsed to create course",
            error:error.message,
        })
    }
};

//getallcourses handler functions
exports.showAllCourses= async(req,res)=>{
    try{
        const allCourses= await Course.find({},{courseName:true,price:true,instructor:true,thumbnail:true,ratingAndReviews:true,studentsEnrolled:true,}).populate("instructor").exec();
        return res.status(200).json({
            success:true,
            message:"All courses fetched successfully",
            data:allCourses,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            succes:false,
            message:"Cannot find course data",
            error:error.message,
        });
    }
}