import React, {useEffect, useState} from 'react';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { userById } from "../../api";
import {Button, Container} from "@mui/material";
import {AccountBox} from "@mui/icons-material";
import './User.css'
import {useTranslation} from "react-i18next";

export const User = () => {
    const { t } = useTranslation();
    let history = useNavigate();
    const { authState } = useSelector((state) => state.auth);
    let { userId } = useParams();
    const [thisUser, setThisUser] = useState({});

    useEffect(() => {
        userById(userId).then(user => {
            if (user) {
                setThisUser(user);
            } else {
                history('/');
            }
        });
    }, [authState, userId])
    return (
        <Container className="userPage" fixed>
            <div className={`userInfo ${authState.theme}`}>
                <AccountBox fontSize="large" color="primary" />
                <h3 className="username">{thisUser.username}</h3>
            </div>
            <div className={`buttonBar ${authState.theme}`}>
                {authState.isAdmin &&
                    <Button
                    onClick={() => {history("/admin-panel")}}
                    className="userbtn"
                    >{t('user.adminPanel')}</Button>
                }
                {((authState.id.toString() === userId) || authState.isAdmin) &&
                    <Button
                    onClick={() => {history(`/user/${userId}/create-overview`)}}
                    className="userbtn"
                    >{t('user.createOverview')}</Button>
                }
            </div>
        </Container>
    );
};
