import React from 'react';
import { useTranslation } from "react-i18next";
import { MenuItem, Select} from "@mui/material";
import './LangChanger.css'
import {useSelector} from "react-redux";

export const LangChanger = () => {
    const { i18n } = useTranslation();
    const { authState } = useSelector((state) => state.auth)

    const changeLang = (event) => {
        i18n.changeLanguage(event.target.value);
    }

    return (
        <div className={`langChanger ${authState.theme}`}>
            <Select
            onChange={changeLang}
            className="menu"
            value={localStorage.getItem("i18nextLng")}
            >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ru">Русский</MenuItem>
            </Select>
        </div>
    );
};
