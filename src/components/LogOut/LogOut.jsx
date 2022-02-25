import React from 'react';
import { useNavigate } from "react-router-dom";
import {Button} from "@mui/material";
import './LogOut.css'
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../actions";

export const LogOut = () => {
    const { authState } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    let history = useNavigate();

    const logOutClick = () => {
        dispatch(logOut())
        localStorage.removeItem("accessToken");
        history('/');
        history(0);
    }
    return (
        <div>
            <Button variant="text" className="navbtn logoutbtn" onClick={logOutClick}>Log Out</Button>
        </div>
    );
};
