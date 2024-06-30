const dotenv=require("dotenv");
dotenv.config();
const {Sequelize} =require("sequelize");

const sequelize=new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,      
    }
);

const connectDB=async()=>{
    try{
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        await sequelize.sync();
        // await sequelize.sync({alter:true});
        console.log("All models were synchronized successfully.");
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}

module.exports={sequelize,connectDB};