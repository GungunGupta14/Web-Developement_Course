//import th model
const Todo = require("../models/Todo");

//define route handler

exports.updateTodo = async(req,res) => {
    try {
        const {id}=req.params;
        const{title,description}=req.body;
        const Todo=await Todo.findByIdAndUpdate(
            {_id:id},
            {title,description, updatedAt:DataTransfer.now()},
        )
        res.status(200).json({
            success:true,
            data:Todo,
            message:'Update successfully',
        })
    }
    catch(err) {
        console.error(err);
        console.log(err);
        res.status(500)
        .json({
            success:false,
            data:"server error",
            message:err.message,
        })
    }
}