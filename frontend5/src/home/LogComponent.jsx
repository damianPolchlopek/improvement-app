import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Fade,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Message as MessageIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

const LogComponent = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  const host_url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${host_url}ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Połączono z WebSocket STOMP!");
        setIsConnected(true);
        setIsConnecting(false);
        client.subscribe("/topic/messages", (message) => {
          setMessages((prevMessages) => {
            const updatedMessages = [message.body, ...prevMessages];
            return updatedMessages.slice(0, 10);
          });
        });
      },
      onStompError: (frame) => {
        console.error("❌ Błąd STOMP:", frame.headers["message"]);
        setIsConnected(false);
        setIsConnecting(false);
      },
      onWebSocketError: (error) => {
        console.error("❌ Błąd WebSocket:", error);
        setIsConnected(false);
        setIsConnecting(false);
      },
    });
    
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [host_url]);

  return (
    <Card elevation={6} sx={{ 
      borderRadius: 3,
      background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
    }}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <MessageIcon sx={{ fontSize: 32, color: '#4caf50' }} />
            <Typography variant="h5" fontWeight="600" color="white">
              Dziennik Aktywności
            </Typography>
          </Box>
          
          {/* Connection Status */}
          <Box display="flex" alignItems="center" gap={1}>
            {isConnecting ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={16} sx={{ color: '#ff9800' }} />
                <Chip 
                  label="Łączenie..." 
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255, 152, 0, 0.2)',
                    color: '#ff9800',
                    border: '1px solid rgba(255, 152, 0, 0.3)'
                  }} 
                />
              </Box>
            ) : (
              <Chip 
                icon={<CircleIcon sx={{ fontSize: 12 }} />}
                label={isConnected ? "Połączono" : "Rozłączono"}
                size="small"
                sx={{ 
                  backgroundColor: isConnected 
                    ? 'rgba(76, 175, 80, 0.2)' 
                    : 'rgba(244, 67, 54, 0.2)',
                  color: isConnected ? '#4caf50' : '#f44336',
                  border: `1px solid ${isConnected 
                    ? 'rgba(76, 175, 80, 0.3)' 
                    : 'rgba(244, 67, 54, 0.3)'}`
                }} 
              />
            )}
          </Box>
        </Box>

        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mb: 3 }}>
          Ostatnie 10 wiadomości systemowych
        </Typography>

        {/* Messages List */}
        <Box sx={{ 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            // width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.4)',
            },
          },
        }}>
          {messages.length ? (
            <List sx={{ p: 0 }}>
              {messages.map((msg, index) => (
                <Fade in={true} timeout={500} key={index}>
                  <ListItem 
                    sx={{ 
                      mb: 1,
                      p: 0,
                      '&:last-child': { mb: 0 }
                    }}
                  >
                    <Card 
                      elevation={2}
                      sx={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <ListItemText 
                          primary={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#4caf50',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                wordBreak: 'break-word'
                              }}
                            >
                              {msg}
                            </Typography>
                          }
                          secondary={
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontSize: '0.75rem',
                                mt: 0.5
                              }}
                            >
                              {new Date().toLocaleTimeString()}
                            </Typography>
                          }
                        />
                      </CardContent>
                    </Card>
                  </ListItem>
                </Fade>
              ))}
            </List>
          ) : (
            <Card 
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                py: 4
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <MessageIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: 500
                  }}
                >
                  Brak wiadomości
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.4)',
                    mt: 1
                  }}
                >
                  Wiadomości będą wyświetlane tutaj gdy pojawią się w systemie
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LogComponent;