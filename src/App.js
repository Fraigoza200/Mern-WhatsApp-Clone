require('dotenv').config()

import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat'
import axios from './axios'


const Pusher = require('pusher-js')

function App() {
  const [messages,setMessages] = useState([])

  useEffect(() => {
    axios.get('/messages/sync')
          .then(res => {
            setMessages(res.data)
          })
  }, [])

  useEffect(() => {
    const pusher = new Pusher(process.env.PUSHER_KEYS, {
      cluster: 'us3'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage])
    });

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }

  }, [messages])

console.log(messages)
  return (
    <div className="app">
     <div className='app_body'>
     <Sidebar />
     <Chat messages={messages} />
     </div>
    </div>
  );
}

export default App;
