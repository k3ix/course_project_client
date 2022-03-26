import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import "./NavigationMenu.css"
import { LogOut } from "../LogOut";
import { useTranslation } from "react-i18next";
import { ProfileLink } from "../ProfileLink";
import { Close } from "@mui/icons-material";
import OutsideClickHandler from 'react-outside-click-handler';
import {SearchBar} from "../SearchBar";

export const NavigationMenu = ({ data }) => {
    const { t } = useTranslation();
    const { authState } = useSelector((state) => state.auth);
    let history = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

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
            <IconButton onClick={() => setMenuOpen(!menuOpen)} style={{ color: "white" }}>
                {menuOpen ?
                    <Close /> :
                    <MenuIcon />
                }
            </IconButton>
            {menuOpen &&
                <OutsideClickHandler onOutsideClick={() => setMenuOpen(!menuOpen)}>
                    <div className={`navMenuList ${authState.theme}`}>
                        <Button variant="text" className="navbtn" onClick={homeClick}>{t('navMenu.mainPage')}</Button>
                        {!authState.status &&
                            <>
                                <Button variant="text" className="navbtn" onClick={registerClick}>{t('navMenu.register')}</Button>
                                <Button variant="text" className="navbtn" onClick={loginClick}>{t('navMenu.login')}</Button>
                            </>
                        }
                    </div>
                </OutsideClickHandler>
            }
            <SearchBar data={data} />
            {authState.status &&
                <div className="prof-logo">
                    <ProfileLink />
                    <LogOut />
                </div>
            }
        </div>
            );
};