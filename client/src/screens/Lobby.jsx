import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);


  
    const [age, setAge] = React.useState('');
  
    const handleChange = (event) => {
      setAge(event.target.value);
    };
  
  return (
    <div>
      <h1> 📞 Video Meeting Now Free for Everyone </h1>
      <h3>We re-engineered the service We built for secure business meeting , to makr it free and available for all.</h3>
      <form onSubmit={handleSubmitForm}>
     
     
      <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      // You can adjust this to your needs
    >
       <Avatar src="/broken-image.jpg" />
    </Box>




      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '30ch' },
      }}
      noValidate
      autoComplete="off"
    >

       
      <div> 
        <TextField
          
          label="Gmail"
          
          type="email"
          id="email"
          sx={{ m: 10, minWidth: 400 }}
          value={email}
          placeholder="rudra@gmail.com"
          multiline
          onChange={(e) => setEmail(e.target.value)}
             />  
         </div>    
         <br />
         <div> 
        <TextField
          
          label="Room Number"  
          placeholder="Enter Your Room Nunber"
          type="text"
          id="room"
          sx={{ m: 10, minWidth: 400 }}
          value={room}
          onChange={(e) => setRoom(e.target.value)}
         />
         </div>      
    </Box>

     
        <br />

        <div>
      <FormControl variant="filled" sx={{ m: 10, minWidth: 400 }}>
        <InputLabel id="demo-simple-select-filled-label">🎬 New Meeting</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={age}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>🔗 Meeting for Later</MenuItem>
          <MenuItem value={20}>➕ Start an instant Meeting</MenuItem>
          <MenuItem value={30}>🔖 One to One Meeting</MenuItem>
        </Select>
      </FormControl>
    </div>
        
        <Button variant="contained" color="success" sx={{ m: 1, minWidth: 100 }}>
        <button><h3>Join Meeting</h3></button>
       </Button>
        
      </form>
    </div>
  );
};

export default LobbyScreen;
