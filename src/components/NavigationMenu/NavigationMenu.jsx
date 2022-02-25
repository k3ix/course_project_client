import React from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "./NavigationMenu.css"
import { LogOut } from "../LogOut";

export const NavigationMenu = () => {
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
            {!authState.status ? (
                <>
                    <Button variant="text" className="navbtn" onClick={registerClick}>Registration</Button>
                    <Button variant="text" className="navbtn" onClick={loginClick}>Log In</Button>
                </>
            ) : (
                <>
                    <Button variant="text" className="navbtn" onClick={homeClick}>Main Page</Button>
                    <LogOut />
                </>
            )
            }
        </div>
    );
};
