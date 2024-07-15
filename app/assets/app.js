import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '@shopify/polaris/build/esm/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import IndexPage from './pages/IndexPage';
import * as apiService from './components/ApiService';
import PropTypes from "prop-types";
import './styles/app.css';
import ImportOrders from "./components/ImportOrders";
import SSE from "./components/SSE";

const getHostFromURL = () => {
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);

    return urlParams.get('shop');
}

const host = getHostFromURL();
const shop = host.split('.')[0];

const App = () => {
    const initialData = window.INITIAL_DATA;
    const [jwtToken, setJwtToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOrdersImported, setIsOrdersImported] = useState(initialData.isOrdersImported);

    const fetchJwt = async () => {
        if (host) {
            const token = await apiService.login(host);

            setJwtToken(apiService.getJwtToken());
            setLoading(false);
        }
    };

    const refreshJwt = async () => {
        if (host) {
            await apiService.login(host);
            const token = apiService.getJwtToken();

            if (!token) {
                return;
            }

            setJwtToken(apiService.getJwtToken());
            setLoading(false);
        }
    }

    useEffect(() => {
        try {
            refreshJwt();
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            refreshJwt();
        }, 1000 * 60 * 50);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!jwtToken) {
        return <div>jwtToken error</div>;
    }

    if (!isOrdersImported) {
        return (
            <SSE eventType="Import Orders" />
        );
    }

    return (
        <IndexPage />
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);