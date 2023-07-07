// app create 
const express = require("express");
const app = express();

//Port find krna hai

require("dotenv").config();
const PORT =  process.env.PORT || 3000;

//Add middleware
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir: '/tmp/'
}));

//DB conection
const db = require("./Config/database");
db.connect();

//cloud se connection
const cloudinary = require("./Config/cloudinary");
cloudinary.cloudinaryConnect();
//api route mount
const Upload = require("./routes/fileUpload");
app.use("/api/v1/Upload",Upload);
// activate server
app.listen(PORT, () => {
    console.log(`app is running at port ${PORT}`)
})