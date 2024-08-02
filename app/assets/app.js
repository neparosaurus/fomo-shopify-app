import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '@shopify/polaris/build/esm/styles.css';
import {AppProvider, SkeletonPage} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import IndexPage from './pages/IndexPage';
import * as apiService from './components/ApiService';
import './styles/app.css';
import {Toast} from "@shopify/app-bridge/actions";

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

    return (
        <AppProvider i18n={enTranslations}>
            {loading ? (
                <SkeletonPage />
            ) : !jwtToken ? (
                <div>jwtToken error</div>
            ) : (
                <IndexPage initialData={initialData} />
            )}
        </AppProvider>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);