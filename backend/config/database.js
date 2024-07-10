const mongoose = require('mongoose')

module.exports.connectDatabase=async()=>{


try {
    const con= await mongoose.connect(process.env.DB_LOCAL_URI)
    console.log(`mongodb connected to the host ${con.connection.host}`);
} catch (error) {
    console.log(error);
}

}