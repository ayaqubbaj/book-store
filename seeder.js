const {Book} = require("./models/Book");
const {Author} = require("./models/Author");
const {books,authors} = require("./data");
const connectToDB = require("./config/db");
require("dotenv").config();
const mongoose = require('mongoose');


//connection to DataBase 
connectToDB();

//seeding database

//Import Books
const importBooks = async () => {
    try{
        await Book.insertMany(books);
        console.log('Data Imported Successfully');
    }catch (error){
        console.log(error);
        process.exit(1);//Disconnect to db
    }
}


//Remove Books
const removeBooks = async () => {
    try{
        await Book.deleteMany();
        console.log('Data Removed');
    }catch (error){
        console.log(error);
        process.exit(1);//Disconnect to db
    }
}


//Import Authors
const importAuthors = async () => {
    try{
        await Author.insertMany(authors);
        console.log('Data Imported Successfully');
    }catch (error){
        console.log(error);
        process.exit(1);//Disconnect to db
    }
}

if(process.argv[2] === "-import"){
    importBooks();
}else if(process.argv[2] === "-remove"){
    removeBooks();
}else if(process.argv[2] === "-import-authors"){
    importAuthors();
}