const { default: mongoose } = require("mongoose")

//connection to DataBase 
async function connectToDB() {
    try{
       await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected To MongoDB...");
    }catch(error){
        console.log("Connection Failed To MongoDB!", error);
    }
}

module.exports = connectToDB;

/*
mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log("Connected To MongoDB..."))
.catch((error) => console.log("Connection Failed To MongoDB!", error));
*/