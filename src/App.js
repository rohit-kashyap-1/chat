import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

const socket = io('http://192.168.0.130:8080')



function App() {

  const [messages,setMessages] = useState([])
  const [message,setMessage] = useState('')
  const [userName, setUserName] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(()=>{
    if (userName) {
      socket.emit('join', userName); // Send user's name when they join
      setIsConnected(true);
    }

    const handleMessage = (msg)=>{
      setMessages((prevMessages)=>[...prevMessages,msg])
    }
    socket.on('chat message',handleMessage)
    return () => {
      socket.off('chat message', handleMessage);
    };
  },[isConnected])

  const sendMessage  = () =>{
    if(message.trim()){
      socket.emit('chat message', { name: userName, text: message });
      setMessage('')
    }
  }

  const handleJoin = () => {
    if (userName.trim()) {
      setIsConnected(true); // Allow connection to chat
    }
  };
  return (
    <div className="App">
      <h2>Socket io chat</h2>
      {!isConnected ? (
        <div>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
          />
          <button onClick={handleJoin}>Join Chat</button>
        </div>
      ) : (
        <div>
          <div>
            {messages.map((msg, idx) => (
              <div key={idx}>
                <strong>{msg.name}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <hr />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
