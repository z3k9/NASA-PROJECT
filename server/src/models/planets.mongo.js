const mongoose = require('mongoose');
const planetsSchema = new mongoose.Schema({
    keplerName:{
        type: String,
        required: true
    }
});

// connects launcheSchema with the "planets" collection
module.exports =  mongoose.model('Planet', planetsSchema);