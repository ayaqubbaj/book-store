const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

const {Book,validatecreatebook,validateupdatebook} =require("../models/Book");
const {verifyTokenAndAdmin} =require("../middlewares/verifyToken");
/*
const books=[
    {
        id:1,
        title:"Black Swan",
        author:"Nasim Taleb",
        description:"about black swan",
        price:10,
        cover:"soft cover"
    },

    {
        id:2,
        title:"Rich Dad Poor Dad",
        author:"Robert Kiyosaki",
        description:"about Rich Dad Poor Dad",
        price:12,
        cover:"soft cover"
    },
 ]
*/


 /**
  * @desc   get all books
  * @route  /api/books
  * @method GET
  * @access public
  */
 
 router.get("/" , asyncHandler(async (req,res) => {
    //comparioson query operators
    //$in : [8,9] //$nin //$eq //$ne //$lt //$lte //$gt //$gte 
    
    
    const {minPrice,maxPrice} =req.query;
    let books;
    if(minPrice && maxPrice ){
     books=await Book.find({price: {$gte:minPrice,$lte:maxPrice}})
        .populate("author", ["_id","firstname","lastname"]);
    }else {
        books=await Book.find()
        .populate("author", ["_id","firstname","lastname"]); 
    }
    
    res.status(200).json(books);
 }));

  /**
  * @desc   get book by id
  * @route  /api/books/:id
  * @method GET
  * @access public
  */

 router.get("/:id" , asyncHandler(async (req,res) => {
   const book = await Book.findById(req.params.id).populate("author");
 if(book){
    res.status(200).json(book);
 }else{
    res.status(404).json({message: "book not found"});
 }

}));

 /**
  * @desc   creat new book
  * @route  /api/books
  * @method POST
  * @access private
  */

router.post("/",verifyTokenAndAdmin,
 asyncHandler(async(req,res) => {
     
  const {error} = validatecreatebook(req.body);

    if(error){
        return res.status(400).json({message: error.details[0].message});

    }

    const book = new Book({  
        title:req.body.title,
        author:req.body.author,
        description:req.body.description,
        price:req.body.price,
        cover:req.body.cover,
    });

   const result= await book.save();
    res.status(201).json(result);//201 means created successfully
}));

 /**
  * @desc   update a book 
  * @route  /api/books/:id
  * @method PUT
  * @access private
  */

router.put("/:id",verifyTokenAndAdmin,
asyncHandler(async (req,res) => {
    //validation
const {error} = validateupdatebook(req.body);

if(error){
    return res.status(400).json({message: error.details[0].message});
}
//untill here
const updatedbook = await Book.findByIdAndUpdate(req.params.id, {
    $set: {
        title:req.body.title,
        author:req.body.author,
        description:req.body.description,
        price:req.body.price,
        cover:req.body.cover
    }
}, { new:true });
res.status(200).json(updatedbook);

 }));

  /**
  * @desc   delete a book 
  * @route  /api/books/:id
  * @method DELETE
  * @access private
  */

  router.delete("/:id",verifyTokenAndAdmin,
  asyncHandler(async (req,res) => {
  
    const book = await Book.findById(req.params.id);
    if(book){
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "book has been deleted"});
    }else{
        res.status(404).json({message: "book not found"}); 
    }
    
     }));



module.exports = router;