const {instance}= require("../config/razorpay");
const Course=require("../models/Course");
const User= require("../models/User");
const mailSender=require("../utils/mailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");

//capture the payment and initiate the razorpay order
exports.createPayment=async(req,res)=>{
    //get course id and userid
    const {course_id}=req.body;
    const userId=req.user.id;
    //validation
    //valid course id
    if(!course_id){
        return res.json({
            success:false,
            message:"Invalid course id",
        })
    }
    //valid course details
    let course;
    try{
        course=awaitCourse.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:"Couldn't find course details",
            });
        }
        //user already paid for course
        const uid=new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.json({
                success:false,
                message:"Student is already enrolled.",
            });
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }

    //order create
    const amount=course.price;
    const currency="INR";
    const options={
        amount:amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            course_id:course_id,
            userId,
        }

    };
    try{
        //initiate the payment using razorpay
        const paymentResponse= await instance.orders.create(options);
        console.log(paymentResponse);
        console.error(error);
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        });
    }
    catch(error){
        console.error(error);
        return res.json({
            success:false,
            message:"Couldn't inititae order",
        })
    }
    
};

//verify signature od\f razorpay and server
exports.verifySignature=async (req,res)=>{
    const webhookSecret="123456";
    const signature=req.headers["x-razorpay-signature"];

    const shasum= crypto .createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest=shasum.digest("hex");

    if(signature===digest){
        console.log("Payment is authorized");

        const {courseId,userId}=req.body.payload.payment.entty.notes;
        try{
            //fulfill the action
            //find the course and enroll the student in it
            const enrolled=await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true},
            );
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found.",
                });
                
            }
            console.log(enrolledCourse);
            //find the student and add the course to their list enrolled courses 
            const enrolledStudent=await User.findOneAndUpdate({_id:userId},
                {$push:{course:courseId}},
                {new:true},);
                console.log(enrolledStudent);
                //mail send krdo confirmation vala
                const emailResponse=await mailSender(
                    enrollStudent.email,
                    "Congratulations for US!",
                    "Congratulations you are onboarded into new Gungun's Course",
                );
                console.log(emailResponse);
                return res.status(200).json({
                    success:true,
                    message:"Signature verified and course added",
                })
        }

        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });

        }
    }
    else{
        return res.status(400).json({
            success:false,
            message:"Invalid request",
        });
    }

}