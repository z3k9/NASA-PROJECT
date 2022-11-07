const mongoose = require('mongoose');

const MONGO_URL = "mongodb+srv://NASA-api:zO3OvHSlaVDZPyZY@nasacluster.ad4b3hx.mongodb.net/?retryWrites=true&w=majority";

mongoose.connection.once('open', ()=>{
    "Mongoose connection is ready"
});

mongoose.connection.on('error',(err)=>{
    console.error(err)
});

async function mongoConnect(){
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };