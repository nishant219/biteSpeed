const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const dotenv=require("dotenv");
dotenv.config();

const {sequelize,connectDB}=require("./config/database");
const contactRoutes=require("./routes/contactRoutes");

const app=express();
const port=process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api',contactRoutes);

connectDB();

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
