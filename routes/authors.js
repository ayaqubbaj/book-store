const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

const {Author,validatecreateauthor,validateupdateauthor} =require("../models/Author");
const {verifyTokenAndAdmin} =require("../middlewares/verifyToken");



 /**
  * @desc   get all authors
  * @route  /api/authors
  * @method GET
  * @access public
  */
 
 router.get("/" , asyncHandler(
  async(req,res) => {
    const {pageNumber} = req.query;
    const perpage=2;
    const authorlist = await Author.find()//.sort({firstname: 1}).select("firstname lastname -_id")
    .skip((pageNumber - 1)*perpage).limit(perpage);//in each page there is 2 authors
    res.status(200).json(authorlist);
    }
 ));



  /**
  * @desc   get author by id
  * @route  /api/authors/:id
  * @method GET
  * @access public
  */

 router.get("/:id" ,asyncHandler( async(req,res) => {
   
      const author = await Author.findById(req.params.id);
      if(author){
         res.status(200).json(author);
      }else{
         res.status(404).json({message: "author not found"});
      }
    }
    )

);

 /**
  * @desc   creat new author
  * @route  /api/authors
  * @method POST
  * @access private(only Admin)
  */

router.post("/",verifyTokenAndAdmin,
asyncHandler(
    async(req,res) => {
     
        const {error} = validatecreateauthor(req.body);
      
          if(error){
              return res.status(400).json({message: error.details[0].message});
          }
      
          
              const author =new Author({
                  firstname:req.body.firstname,
                  lastname:req.body.lastname,
                  nationality:req.body.nationality,
                  image:req.body.image,
              });
             const result =await author.save();
              
              res.status(201).json(result);//201 means created successfully
            }       
)

    
);



 /**
  * @desc   update a author 
  * @route  /api/authors/:id
  * @method PUT
  * @access private
  */

router.put("/:id",verifyTokenAndAdmin,
asyncHandler (
    async(req,res) => {
        //validation
    const {error} = validateupdateauthor(req.body);
    
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }
    
    
        const author= await Author.findByIdAndUpdate(req.params.id, {
            $set: {
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                nationality:req.body.nationality,
                image:req.body.image,
            },
        },
        {new:true}
        );
        res.status(200).json(author);
  
    
     }
));



  /**
  * @desc   delete a author 
  * @route  /api/authors/:id
  * @method DELETE
  * @access private
  */

  router.delete("/:id",verifyTokenAndAdmin,
  asyncHandler(
    async(req,res) => {
        
         const author= await Author.findById(req.params.id);
         
         if(author){
             await Author.findByIdAndDelete(req.params.id);
             res.status(200).json({message: "author has been deleted"});
         }else{
             res.status(404).json({message: "author not found"}); 
         }
        
         
          }
  ));



module.exports = router;
