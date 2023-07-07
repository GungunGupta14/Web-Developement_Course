const File = require("../models/File");
const cloudinary=require("cloudinary").v2;

//localfileUpload => handler function

exports.localFileUpload = async (req,res) => {
    try{
        // fetch file 
        const file = req.files.file;
        console.log("file aagyi hai ->",file);

        let path  = __dirname + "/files/"+ Date.now()+`.${file.name.split(".")[1]}`;
        console.log("Path ->",path);
        file.mv(path,(err) => {
            console.log(err);
        });

        res.json({
            success:true,
            message:"Local file uploaded Successfully",
        });
    } catch(error){
        console.log(error);
    }
}

function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality){
    const options={folder};
    options.resource_type="auto";
    return await cloudinary.uploader.upload(file.tempFilePath,options);
    if(quality){
        options.quality=quality;
    }
}

//image upload
exports.imageUpload= async(req,res)=>{
    try{
        const{name, tags, email}=req.body;
        console.log(name,tags,email);

        const file=req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes=["jpg","jpeg","png"];
        const fileType=file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File format not supported.",
            });
        }
        const response= await uploadFileToCloudinary(file,"Gungun");
        console.log(response);
        //save entry in db
        const fileData=await File.create({
            name,
            email,
            imageUrl:response.secure_url,
            tags
        });
        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"Image Successfully Uploaded!!",
        })
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:"Something went Wrong.",
        })
    }
}

//videoUpload

exports.videoUpload=async (req,res)=>{
    try{
        const{name, tags, email}=req.body;
        console.log(name,tags,email);
        const file= req.files.videoFile;

        const supportedTypes=["mp4","mov"];
        const fileType=file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File format not supported.",
            });
        }
        const response= await uploadFileToCloudinary(file,"Gungun");
        console.log(response);

        const fileData=await File.create({
            name,
            email,
            imageUrl:response.secure_url,
            tags
        });
        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"video Successfully Uploaded!!",
        })

    }

    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:"Something went wrong",
        })
    }
}
exports.imageReducerUpload= async(req,res)=>{
    try{
        const{name, tags, email}=req.body;
        console.log(name,tags,email);

        const file=req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes=["jpg","jpeg","png"];
        const fileType=file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File format not supported.",
            });
        }
        const response= await uploadFileToCloudinary(file,"Gungun", 30);
        console.log(response);

        //save entry in db
        const fileData=await File.create({
            name,
            email,
            imageUrl:response.secure_url,
            tags
        });
        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"Image Successfully Uploaded!!",
        })
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:"Something went wrong",
        })
    }
}