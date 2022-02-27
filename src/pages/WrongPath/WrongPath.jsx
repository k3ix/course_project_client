import React from 'react';
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import './WrongPath.css'

export const WrongPath = () => {
    const { t } = useTranslation();
    const { authState } = useSelector((state) => state.auth);
    return (
        <div className={`wrongPage ${authState.theme}`}>
            <h2>{t("wrongPath.title")}</h2>
            <h3><a href="/">{t("wrongPath.subtitle")}</a></h3>
        </div>
    );
};