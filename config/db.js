const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');


const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Succesfully connected to Mongo DB!");
    }catch(err){
        console.error(err.message);
        //exit on failure
        process.exit(1);
    }
}
module.exports = connectDB;