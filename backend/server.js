// requiring 
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Messages = require('./dbMessages')
const Pusher = require('pusher')
const cors = require('cors')
// app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: '1086849',
    key: 'aa5181e832219eea796f',
    secret: '13fea786326a310b7694',
    cluster: 'us3',
    encrypted: true
  });


// middleware 
app.use(express.json())
app.use(cors())


// DB config
const connection_url = process.env.MONGO_CONNECTION

mongoose.connect(connection_url, { 
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connectio

db.once('open', () => {
    console.log('db is connected')

    const msgCollection = db.collection("messagecontents")
    const changeStream = msgCollection.watch()

    changeStream.on('change', (change)=> {
        console.log(change)

        if(change.operationType === 'insert') {
            const messageDetail = change.fullDocument
            pusher.trigger('messages', 'inserted', {
                name: messageDetail.name,
                message: messageDetail.message,
                timestamp: messageDetail.timestamp,
                recieved: messageDetail.recieved
            })
        } else {
            console.log('Error triggered by Pusher')
        }

    })
})

// api routes
app.get('/', (req, res) => res.status(200).send('hello world'))

// Get all users
app.get('/messages/sync', (req,res) => {
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

// Post 
app.post('/messages/new', (req,res) => {
    const dbMessage = req.body 

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

//  listener
app.listen(port, ()=> {console.log( `server started on port: ${port}`)})


