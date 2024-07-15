import React, {useEffect, useState} from "react";
import {getJwtToken} from "./ApiService";

const eventTypeToUrlMap = {
    "Import Orders": "/sse/import/orders",
};

const SSE = ({ eventType }) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const token = getJwtToken();

    useEffect(() => {
        const url = eventTypeToUrlMap[eventType];
        if (!url) {
            console.error(`Unknown event type: ${eventType}`);
            return;
        }

        const eventSource = new EventSource(`${url}?token=${token}`);

        eventSource.onopen = () => {
            console.log(`Connection to ${url} server opened.`);
            setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
            console.log(`New event from ${url} server:`, event.data);
            setMessages(prevMessages => [...prevMessages, JSON.parse(event.data)]);
        };

        eventSource.onerror = (error) => {
            console.error(`EventSource failed for ${url}.`);
            console.error(error);
            setIsConnected(false);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [eventType, token]);

    return (
        <div>
            <h1>Server-Sent Events from {eventType}</h1>
            {isConnected ? <p>Connected</p> : <p>Disconnected</p>}
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>
                        Time: {msg.time}, Index: {msg.index}, Status: {msg.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SSE;