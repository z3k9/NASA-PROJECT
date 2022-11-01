const http = require('http');

const mongoose = require('mongoose');

const app = require('./app');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const MONGO_URL = "mongodb+srv://NASA-api:zO3OvHSlaVDZPyZY@nasacluster.ad4b3hx.mongodb.net/?retryWrites=true&w=majority";

const {loadPlanetsData} = require('./models/planets.model');

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready');
})
mongoose.connection.on('error', (err)=>{
    console.error(err);
})
async function startServer(){
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();
    server.listen(PORT, ()=>{
        console.log('server is running');
    })
}

startServer();
