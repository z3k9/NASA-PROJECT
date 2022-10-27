const launches = new Map();
 let latestFlightNumber = 99;

const launch ={
    flightNumber: 99,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'), 
    target: 'Kepler-442 b', 
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success:true
}

function existsLaunchWithId(launchId){
    return launches.has(launchId)
}

function abortLaunchById(launchId){
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

function getAllLaunches(){
    return Array.from(launches.values());
}

function addNewLaunch(launch){
    latestFlightNumber++
    launches.set(latestFlightNumber, Object.assign(launch, {
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: latestFlightNumber,
        upcoming: true,
        success: true
    }));
}

module.exports = {
    existsLaunchWithId,abortLaunchById, getAllLaunches, addNewLaunch
}