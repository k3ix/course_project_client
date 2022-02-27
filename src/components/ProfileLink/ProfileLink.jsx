import React from 'react';
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { AccountBox } from "@mui/icons-material";
import { useSelector } from "react-redux";
import "./ProfileLink.css";

export const ProfileLink = () => {
    const { authState } = useSelector((state) => state.auth);
    let history = useNavigate();
    const profileClick = () => {
        history(`/user/${authState.id}`)
    }

    return (
        <IconButton color="inherit" className={`profile-icon ${authState.theme}`} onClick={profileClick}>
            <AccountBox />
        </IconButton>
    );
};
