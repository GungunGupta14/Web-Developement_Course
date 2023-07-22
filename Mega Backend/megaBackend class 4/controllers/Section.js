const Section=require("../models/Section");
const Course= require("../models/Course");

exports.createSection= async(req,res)=>{
    try{
        //data fetch
        const{sectionName, courseId}=req.body;
        //validation
        if(!sectionName ||!courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }
        //create section
        const newSection= await Section.create({sectionName});
        //update course with section obj id
        const updatedCourse=await Course.findByIdAndUpdate(
            courseId,{$push:{courseContent:newSection._id,}},{new:true},
        );
        
        //return res
        return res.status(200).json({
            success:true,
            message:"Successfully created section",
            updatedCourseDeatils,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create section",
            error:error.message,
        })
    }
}
exports.updateSection=async(req,res)=>{
    try{

        //data input
        const{sectionName,sectionId}=req.body;
        //validation
        if(!sectionName ||!sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }
        //update data
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:"Successfully created section",
            updatedCourseDeatils,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create section",
            error:error.message,

         })
    }
}
exports.deleteSection=async (req,res)=>{
    try{
        //get id assuming that we are sending id in params
        const {sectionId}=req.params;
        //use findbyidanddelete
        await Section.findByIdAndDelete(sectionId);
        //response
        return res.status(200).json({
            success:true,
            message:"Successfully created section",
            updatedCourseDeatils,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create section",
            error:error.message,

         })

    }
}