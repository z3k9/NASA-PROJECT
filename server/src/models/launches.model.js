const axios = require('axios');
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const DEFAULT_FLIGHT_NUMBER = 99;

// launch ={
//     flightNumber: 99, //flight_number
//     mission: 'Kepler Exploration X', //name
//     rocket: 'Explorer IS1', //rocket.name
//     launchDate: new Date('December 27, 2030'), // date_local
//     target: 'Kepler-442 b', // not applicable
//     customers: ['ZTM', 'NASA'], // payload.customers for each payload
//     upcoming: true, // upcoming
//     success:true // success
// }
// saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function loadLaunchData(){
    const response = await axios.post(SPACEX_API_URL, {
        query:{}, 
        options: {
            pagination: false,  
            populate: [
            {
                path: 'rocket',
                select: {
                    name: 1}
                },
            {
                path: 'payloads',
                select: {
                    'customers' : 1
                }
            }]}
    });
    if (response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }
    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload)=>{
            return payload['customers'];
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: new Date(launchDoc['date_utc']),
            success: launchDoc['success'],
            upcoming: launchDoc['upcoming'],
            customers,
        }
        
        await saveLaunch(launch);
    }
}


async function existsLaunchWithId(launchId){
    return await launches.findOne({
        flightNumber:launchId
    })
}

async function abortLaunchById(launchId){
    const aborted = await launches.updateOne({
        flightNumber: launchId},
        {upcoming: false, success: false});
    
    return aborted.acknowledged === true && aborted.matchedCount === 1;
}
async function getLatestFlightNumber(){
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber');
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}
async function getAllLaunches(){
    return await launches.find({}, {'_id':0, '__v':0});
}

//custom async function to save our launch object to mongo atlas
async function saveLaunch(launch){
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    },launch,{upsert: true})
}

//custom async function to 
async function addNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target
    });
    if(!planet){
        throw new Error('No matching planet was found'); 
    }
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success:true,
        upcoming: true,
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber
    });
    await saveLaunch(newLaunch);
}


module.exports = {
    loadLaunchData, existsLaunchWithId,abortLaunchById, getAllLaunches, addNewLaunch
}