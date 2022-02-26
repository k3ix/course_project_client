import React from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "./NavigationMenu.css"
import { LogOut } from "../LogOut";
import {useTranslation} from "react-i18next";

export const NavigationMenu = () => {
    const { t } = useTranslation();
    const { authState } = useSelector((state) => state.auth);
    let history = useNavigate();
    const homeClick = () => {
        history('/');
    };

    const loginClick = () => {
        history("/login");
    };

    const registerClick = () => {
        history("/registration");
    }
    return (
        <div className={`navBar ${authState.theme}`}>
            <Button variant="text" className="navbtn" onClick={homeClick}>{t('navMenu.mainPage')}</Button>
            {!authState.status ? (
                <>
                    <Button variant="text" className="navbtn" onClick={registerClick}>{t('navMenu.register')}</Button>
                    <Button variant="text" className="navbtn" onClick={loginClick}>{t('navMenu.login')}</Button>
                </>
            ) : (
                <>
                    <LogOut />
                </>
            )
            }
        </div>
    );
};
