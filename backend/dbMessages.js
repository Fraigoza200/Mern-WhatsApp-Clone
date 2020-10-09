const mongoose = require('mongoose')

const whatsappSchema = new mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    recieved: Boolean,
})

//  collection
module.exports = mongoose.model('messagecontent', whatsappSchema)