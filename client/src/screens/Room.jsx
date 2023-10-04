import React, { useEffect, useCallback, useState } from "react";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


import Navbar from "../components/Navbar.jsx";
import Slide from "../components/slide.jsx";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Message from "../components/message.jsx";




const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  return (
   
    <div >
      
      <Navbar  /> 
      
      <h3>{remoteSocketId ? "Successfully Connected ✅" : <font face="italic" size="6" color="green">"No one in room ,Atleast Two Members are required to make the Call"</font>}  
      </h3>
      <Button variant="contained">{myStream && <button onClick={sendStreams}>CONNECT  👥</button>}</Button>
  
      <Button variant="contained" color="success">
      {remoteSocketId && <button onClick={handleCallUser}>CALL 📞</button>}
       </Button>

      <br />
      
   <Box display="flex" justifyContent="space-between">

      <Card sx={{ maxWidth: 805 ,maxHeight: 600}}>
      <CardActionArea>
        <CardMedia
          
        />
        <div>
        {myStream && (
        <>
        
       <ReactPlayer
           
            playing
            height="530px"
            width="100%"
            style={{ marginLeft: 0 }} 
            url={myStream}
          />
        </>
      )}
        </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            MY STREAM 👤
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Start a video or voice call

        At the top, search contacts or dial a number. Tap the contact or enter the number. Choose an option: To make a video call, tap Call .
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>

    <Card sx={{ maxWidth: 805 ,maxHeight: 600}}>
      <CardActionArea>
        <CardMedia
          
        />
        <div>
      {remoteStream && (
        <>
          
         
          <ReactPlayer
            playing
            
            height="530px"
            width="100%"
            url={remoteStream}
          />
        </>
      )}
      </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
          REMOTE STREAM 👤
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Start a video or voice call
         At the top, search contacts or dial a number. Tap the contact or enter the number. Choose an option: To make a video call, tap Call .
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
      
        
      
      
      
     </Box> 





    
    </div>
    
  );
};

export default RoomPage;
