const { boolean } = require("joi");
const mongoose = require("mongoose");
const joi = require('joi');
const jwt = require("jsonwebtoken");

//user schema
const UserSchema = new mongoose.Schema({
    email:{
    type: String, 
    required: true,
    trim: true,
    minlength: 5,
    maxlength:100,
    unique: true,
    },
    username:{
        type: String, 
        required: true,
        trim: true,
        minlength: 2,
        maxlength:100,
        unique: true,
        },
    password:{
        type: String, 
        required: true,
        trim: true,
        minlength: 6,
        },
   isAdmin:{
    type: Boolean, 
   default: false,
    },
    location:{
        type: String, 
        required: true,
        trim: true,
        minlength: 2,
        maxlength:100,
    },
    threshold:{
        type: Number, 
        required: true,
        min: 0,
        },
    intrests:{
            type: String, 
            required: true,
            enum:["Ozone Layer",
                "Water pollution",
                "Air pollution",
                "Global warming"]
        },
        connections: [{
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User'
            },
          }],
    
    


}, {timestamps: true});

//Generate Token
UserSchema.methods.generateToken = function() {
  return jwt.sign({id: this._id, isAdmin: this.isAdmin},process.env.JWT_SECRET_KEY); // we can add a third one: ,{expiresIn:"4d"} 
}

//user model
const User = mongoose.model("User" , UserSchema);

//validation register user
function validateRegister(obj){
    const schema = joi.object({
        email : joi.string().trim().min(5).max(100).required().email(),
        username: joi.string().trim().min(2).max(200).required(),
        password: joi.string().trim().min(6).required(),
        location:joi.string().trim().min(2).max(100).required(),
        threshold:joi.number().min(0).required(),
        intrests:joi.string().valid("Ozone Layer",
        "Water pollution",
        "Air pollution",
        "Global warming").required(),
    });
    return schema.validate(obj);
}

//validation login user
function validatelogin(obj){
    const schema = joi.object({
        email : joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);

}

//validation update user
function validateupdate(obj){
    const schema = joi.object({
        email : joi.string().trim().min(5).max(100).email(),
        username: joi.string().trim().min(2).max(200),
        password: joi.string().trim().min(6),
        
    });
    return schema.validate(obj);

}
module.exports={
    User,
    validateRegister,
    validatelogin,
    validateupdate,
};