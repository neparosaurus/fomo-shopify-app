import React, {useEffect, useState} from "react";
import {getJwtToken} from "./ApiService";

const ImportOrders = () => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const token = getJwtToken();

    useEffect(() => {
        const url = `/import?token=${token}`;
        const eventSource = new EventSource(url);

        eventSource.onopen = () => {
            setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
            setMessages(prevMessages => [...prevMessages, JSON.parse(event.data)]);
        };

        eventSource.onerror = (error) => {
            setIsConnected(false);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [token]);

    return (
        <div>
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

export default ImportOrders;