import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const LogComponent = () => {
    const [messages, setMessages] = useState([]); // Stan przechowujący wiadomości

    const host_url = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(`${host_url}ws`),
            reconnectDelay: 5000,
            // debug: (str) => console.log("STOMP Debug:", str),
            onConnect: () => {
                console.log("✅ Połączono z WebSocket STOMP!");
                client.subscribe("/topic/messages", (message) => {
                    setMessages((prevMessages) => {
                        const updatedMessages = [message.body, ...prevMessages];
                        return updatedMessages.slice(0, 10);
                    });
                });
            },
            onStompError: (frame) => console.error("❌ Błąd STOMP:", frame.headers["message"]),
            onWebSocketError: (error) => console.error("❌ Błąd WebSocket:", error),
        });
        
        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);

    return (
        <div style={styles.container}>
          <h2 style={styles.header}>Ostatnie 10 wiadomości:</h2>
          <ul style={styles.messageList}>
            {messages.length ? messages.map((msg, index) => (
              <li key={index} style={styles.messageItem}>
                {msg}
              </li>
            )) : <li style={styles.messageItem}>Brak wiadomości</li>}
          </ul>
        </div>
      );
};

// Stylowanie komponentu
const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#2f2f2f", // Ciemne tło
      color: "#f0f0f0", // Jasny tekst
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      maxWidth: "70%",
      margin: "20px auto",
    },
    header: {
      textAlign: "center",
      color: "#006400", // Ciemny zielony nagłówek
      fontSize: "24px",
      marginBottom: "10px",
    },
    messageList: {
      listStyleType: "none",
      paddingLeft: "0",
      marginTop: "10px",
    },
    messageItem: {
      backgroundColor: "#3c3c3c", // Ciemniejszy szary dla wiadomości
      padding: "10px",
      margin: "5px 0",
      borderRadius: "5px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      fontSize: "16px",
      color: "#008200", // Jasny tekst na ciemnym tle
    },
  };

export default LogComponent;