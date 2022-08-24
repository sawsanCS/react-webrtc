import React, { useRef, useEffect, useContext, createContext } from 'react';
import './App.css';
import io from 'socket.io-client';
const socket = io('/webRTCPeers', 
{
  path:'/webrtc'
})
const someProvider =createContext()
const Wrapper = ({children}) => {

const x = 12;
const y = 13; 
return <someProvider.Provider value={{x, y}}>{children}</someProvider.Provider>
}
const SomeDiv =({children})=>{
  const cont = useContext(someProvider)
 const { x, y} = cont;
  console.log(cont)
  console.log('x et y', cont)
  return <div>I am usgin the context thing {x} et {y}</div>

}

function App() {


  
const cropMe = () => {
  let video = localVideoRef.current;
  console.log(video)
  let canvas1 = new OffscreenCanvas(100, 1);
  canvas1= c1.current;
  let canvas2 = new OffscreenCanvas(100, 1);
  canvas2= c2.current;
 let ctx = canvas1.getContext('2d');
 let ctx2 = canvas2.getContext('2d');
    setInterval(function () {ctx.drawImage(video, 0, 0, 200, 200, 0, 0, 150, 150);
      ctx2.drawImage(video, 200, 0, 200, 200, 0, 0, 150, 150);
    },20); 
}
 const loadMePlease = () => {
   console.log("im inside load me")
  let video = localVideoRef.current;

  console.log('video', video)
  let canvas1 = c1.current;
  console.log('c1 is here', c1)
 let ctx1 = canvas1.getContext('2d');
//  context.drawImage(
//   image,

//   sliceLeft, sliceTop,
//   sliceWidth, sliceHeight,

//   drawLeft, drawTop,
//   drawWidth, drawHeight
// );
 ctx1.drawImage(video, 100, 100, 200, 200, 0, 0, 150, 150);

 console.log('c1 is here', ctx1)
 }
 

  const localVideoRef = useRef()
  const remoteVideoRef = useRef();
  const c1 =useRef();
  const c2= useRef();
  const pc = useRef( new RTCPeerConnection(null))
  const textRef = useRef();

  useEffect(()=>{ 
    const constraints = {
      audio:false,
      video: true,
    }
    console.log('%c We just started', 'color: orange');
    console.table(['element1', 'element2', 'element3'])
    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream=>{
      //display video
      localVideoRef.current.srcObject = stream;

    })
    .catch(e=>console.log(
      "Get user media error...."
    ))
    socket.on('sdp', data=>{

      console.log('received', data)

textRef.current.value = JSON.stringify(data.sdp)

    })
    socket.on('connection-success', success=> {
      console.log(success)
    })
   
    const pc = new RTCPeerConnection(null);
    pc.onicecandidate = (e) => {
      if (e.candidate) console.log(JSON.stringify(e.candidate))
    }
    pc.onconnectionstatechange = (e) => {
      console.log(e)
    }
    pc.ontrack =(e)=> {
      //we got remote stream
      remoteVideoRef.current.srcObject = e.streams[0]
    }
    pc.current = pc;
 }, [])
 const createOffer = ()=>{
   pc.current.createOffer({offerToReceiveAudio: 1, offerToReceiveVideo:1})
   .then (sdp =>{
console.log(JSON.stringify(sdp));
pc.current.setLocalDescription(sdp)
socket.emit('sdp', {sdp})
   })
   .catch(e=> console.log(e))

 }

 const createAnswer = ()=>{
  pc.current.createAnswer({offerToReceiveAudio: 1, offerToReceiveVideo:1})
  .then (sdp =>{
console.log(JSON.stringify(sdp));
pc.current.setLocalDescription(sdp)
socket.emit(sdp, {sdp})
  })
  .catch(e=> console.log(e))

}

  
  const getUserMedia = async () => {
    const constraints = {
      audio:false,
      video: true,
    }
 
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    localVideoRef.current.srcObject = stream;
  }

  const setRemoteDescription = () =>{
    //get the SDP  value from the text editor
    const sdp = JSON.parse(textRef.current.value)
    console.log(sdp)
    pc.current.setRemoteDescription(new RTCSessionDescription(sdp))
  }


  const addCandidate = () => {
    const candidate = JSON.parse(textRef.current.value)
    console.log('Adding candidate...', candidate)
    pc.current.addIceCandidate( new RTCIceCandidate(candidate))
  }
  return (<Wrapper>
    <div className="App" >
     <button onClick={()=>getUserMedia()}> Get access to camera </button>

     <br/>
     <SomeDiv />
     <div>
     <video  id="video" style={{width: 240, height: 240, margin:5, backgroundColor: 'black'}} ref={localVideoRef} autoPlay></video>
     </div>
     <div>
      <canvas ref={c1} width="160" height="96"></canvas>
      <canvas ref={c2} width="160" height="96"></canvas>
    </div>
    <>
     {/* <video style={{width: 240, height: 240, margin:5, backgroundColor: 'black'}} ref={remoteVideoRef} autoPlay></video> */}
     {/* <button onClick={createOffer} >Create Offer </button>
     <button onClick={createAnswer} >Create Answer </button>
     <br />
     <textarea ref={textRef}></textarea>
     <br />

     <button onClick={setRemoteDescription} >set remote description </button>
     <button onClick={addCandidate} >Add candidates </button>
     <button onClick={loadMePlease}>load me</button> */}
     </>
     <button onClick={cropMe}>crop the top left corner</button>
    </div>
    </Wrapper>
  );
}


export default App;
