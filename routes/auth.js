const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {User,validatelogin,validateRegister}= require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


 /**
  * @desc   register new user
  * @route  /api/auth/register
  * @method post
  * @access public
  */

router.post("/register",asyncHandler(async (req,res) =>{
const {error} = validateRegister(req.body);
if(error){
return res.status(400).json({message: error.details[0].message});
}
let user = await User.findOne({email: req.body.email});
if(user){
   return res.status(400).json({message:"This User already registered"});
}

//hashing pass
const salt = await bcrypt.genSalt(10);
req.body.password =await bcrypt.hash(req.body.password, salt);


user = new User({
     email : req.body.email ,
     username : req.body.username ,
     password : req.body.password ,
     location: req.body.location ,
     threshold:req.body.threshold ,
     intrests:req.body.intrests ,
    
   });

  const result= await user.save();

  const token = user.generateToken();
  const {password, ...other} = result._doc;

  res.status(201).json({...other , token});

 }));


  /**
  * @desc   login user
  * @route  /api/auth/login
  * @method post
  * @access public
  */

  router.post("/login",asyncHandler(async (req,res) =>{
   const {error} = validatelogin(req.body);
   if(error){
   return res.status(400).json({message: error.details[0].message});
   }
   let user = await User.findOne({email: req.body.email});
   if(!user){
      return res.status(400).json({message:"invalid email or password"});
   }
   
   //compare pass
   const ispasswordmatch = await bcrypt.compare(req.body.password , user.password);
   if(!ispasswordmatch){
      return res.status(400).json({message:"invalid email or password"});
   }

   
   
   
     
   
   const token = user.generateToken();
     const {password, ...other} = user._doc;
   
     res.status(200).json({...other , token});
   
    }));

 module.exports = router;