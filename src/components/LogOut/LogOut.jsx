import React from 'react';
import { useNavigate } from "react-router-dom";
import {Button} from "@mui/material";
import './LogOut.css'
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../actions";
import { useTranslation } from "react-i18next";

export const LogOut = () => {
    const { t } = useTranslation();
    const { authState } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    let history = useNavigate();

    const logOutClick = () => {
        dispatch(logOut())
        history('/');
    }
    return (
        <div>
            <Button variant="text" className={`navbtn logoutbtn ${authState.theme}`} onClick={logOutClick}>{t('logout')}</Button>
        </div>
    );
};
