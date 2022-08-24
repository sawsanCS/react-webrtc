const express = require('express');
const io = require('socket.io')({
    path:'/webrtc'
})

const app = express();
const port = 8080;

app.get('/', (req, res)=> res.send('Hello to Rtc tuto'))
const server = app.listen(port, ()=> console.log('WebRtc app is listening...'))
io.listen(server)
const webRTCNamespace = io.of('webRTCPeers')
webRTCNamespace.on('connection', socket =>{
    console.log('socket id', socket.id)
    socket.emit('connection-success', {
        status: 'connection-success',
        socketId: socket.id,
    })
    socket.on('disconnect', ()=> {
        console.log(`${socket.id} has disconnected`)
    })
    socket.on('sdp', data=> { 
        console.log(data);
        socket.broadcast.emit('sdp', data)
    })
 
})