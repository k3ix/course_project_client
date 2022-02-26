import React from 'react';
import { useTranslation } from "react-i18next";

export const Home = () => {
    const { t, i18n } = useTranslation();
    const changeLang = (lang) => {
        i18n.changeLanguage(lang);
    }

    return (
        <div>
            <h1>{t('home')}</h1>
        </div>
    );
};