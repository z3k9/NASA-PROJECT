const https = require('https');

const fs = require('fs');

require('dotenv').config();

const { mongoConnect } = require('./services/mongo');

const app = require('./app');

const PORT = process.env.PORT || 8000;

const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
},app);

const {loadPlanetsData} = require('./models/planets.model');

const { loadLaunchData } = require('./models/launches.model'); 

async function startServer(){
    await mongoConnect();

    await loadPlanetsData();

    await loadLaunchData();
    
    server.listen(PORT, ()=>{
        console.log('server is running');
    })
}

startServer();
