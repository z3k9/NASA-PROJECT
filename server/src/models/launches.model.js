const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const DEFAULT_FLIGHT_NUMBER = 99;

const launch ={
    flightNumber: 99,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'), 
    target: 'Kepler-442 b', 
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success:true
}
saveLaunch(launch);

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
    const planet = await planets.findOne({
        keplerName: launch.target
    });
    if(!planet){
        throw new Error('No matching planet was found'); 
    }
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    },launch,{upsert: true})
}

//custom async function to 
async function addNewLaunch(launch){
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
    existsLaunchWithId,abortLaunchById, getAllLaunches, addNewLaunch
}