const asyncHandler = require("express-async-handler");
const {Book,validatecreatebook,validateupdatebook} =require("../models/Book");



 /**
  * @desc   get all books
  * @route  /api/books
  * @method GET
  * @access public
  */
 
const getAllBooks =  asyncHandler(async (req,res) => {
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
 })

 module.exports= {
    getAllBooks,
 }