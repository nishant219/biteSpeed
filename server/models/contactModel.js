const {DataTypes}=require("sequelize");
const {sequelize}=require("../config/database");

const Contact=sequelize.define('Contact',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    phoneNumber:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    linkedId:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    linkPrecedence:{
        type: DataTypes.ENUM('primary', 'secondary'),
        allowNull:false,
    },
    createdAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW,
    }, 
    updatedAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW,
    },
    deletedAt:{
        type:DataTypes.DATE,
        allowNull:true,
    },
},{
    tableName:'contact',
    paranoid:true,
    timestamps:true,
    indexes: [
        {
            fields: ['phoneNumber'],
        },
        {
            fields: ['email'],
        },
        {
            fields: ['linkedId'],
        }
    ]
})

module.exports=Contact;