import React, {useEffect, useState} from 'react';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "../../actions";
import './ThemeChanger.css'
import {useTranslation} from "react-i18next";


export const ThemeChanger = () => {
    const { t } = useTranslation();
    const dispatch  = useDispatch();
    const { authState } = useSelector((state) => state.auth);
    const [theme, setTheme] = useState(authState.theme === "dark");
    useEffect(() => {
        setTheme(authState.theme === "dark");
    }, [authState])

    const themeChanger = (event, checked) => {
        let req = {
            isDark: checked,
            id: authState.id
        };
        dispatch(changeTheme(req))
        setTheme(!theme);
    }

    return (



        <div className={`themeChanger ${authState.theme}`}>
            <FormGroup>
                <FormControlLabel
                    className="label"
                    control={<Switch />}
                    label={t('darkMode')}
                    labelPlacement="start"
                    checked={theme}
                    onChange={themeChanger} />
            </FormGroup>
        </div>
    );
};