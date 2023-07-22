const Subsection=require("../models/SubScetion");
const Section=require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubsection= async(req,res)=>{
    try{
        //fetch data from req body
        const {sectionId,title, timeDuration, description}=req.body;
        //extract video/file
        const video=req.files.videoFile;
        //validation
        if(!sectionId ||!title ||!timeDuration ||!description ||!video){
            return res.status(400).json({
                success:false,
                message:"All feilds are required",
            });
        }
        //upload video to cloudinary
        const uploadDetails= await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create subsection
        const subSectionDetails= await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videourl:uploadDetails.secure_url,
        });
        //update section with the sub section objectid
        const updatedSection= await Section.findByIdAndUpdate({_id:sectionId},{$push:{subSection:SubSectionDetails._id,}},{new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:"Subsection created successfully!",
            updatedSection,
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Subsection not created successfully!",
            error:error.message,
        });
    }
}
//update
//delete
