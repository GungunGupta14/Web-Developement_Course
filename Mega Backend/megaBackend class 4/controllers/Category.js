const Category=require("../models/Category");

//create tag handler function
exports.createCategory=async(req,res)=>{
    try{
        //fetch data
        const {name, description}=req.body;

        //validation
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"All fields are required!",
            });
        }
        //create entry in db
        const categoryDetails=await Category.create({
            name:name,
            description:description,
        });
        console.log(categoryDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:"tag created successfully",
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });

    }
};

//getalltags handler function

exports.showAllCategory=async(req,res)=>{
        try{
            const allCategory= await Tag.find({},{name:true,description:true});
            res.status(200).json({
                success:true,
                message:"All tags returned successfully!",
            });
        }
        catch(error){
            return res.status(500).json({
                success:false,
                message:error.message,
        })
    }
};