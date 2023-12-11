//entry point 
const express = require("express");
const logger = require("./middlewares/logger")
const {notfound,errorHandler} = require("./middlewares/errors")
require("dotenv").config();
const connectToDB = require("./config/db");


//connection to DataBase 
connectToDB();



//init app
 const app=express();
 

 
//apply middlewares
 app.use(express.json());
 app.use(logger)



//routes
app.use("/api/books",require("./routes/books"));
app.use("/api/authors",require("./routes/authors"));
app.use("/api/auth",require("./routes/auth"));
app.use("/api/users",require("./routes/users"));
app.use("/api/connection",require("./routes/connection"));




//error handler middleware
app.use(notfound);
app.use(errorHandler);




//running the server 
 const PORT = process.env.PORT || 3003;
 app.listen(PORT, () => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));