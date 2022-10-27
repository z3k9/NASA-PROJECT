const path = require('path');
const planets = [];
const { parse } = require('csv-parse');
const fs = require('fs');


function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData(){
    return new Promise((resolve, reject)=>{
        //readable.pipe(writeable)
        fs.createReadStream(path.join(__dirname,'..', '..', 'data', 'kepler-data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', (data)=>{
            if(isHabitablePlanet(data)){
                planets.push(data)
            }
        })
        .on('error', (err)=>{
            reject(err);
        })
        .on('end', ()=>{
            resolve(); 
        });
    })
}

function getAllPlanets(){
    return planets;
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}