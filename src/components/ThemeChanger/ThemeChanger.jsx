import React, { useState } from 'react';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "../../actions";
import './ThemeChanger.css'


export const ThemeChanger = () => {
    const dispatch  = useDispatch();
    const { authState } = useSelector((state) => state.auth);
    const [theme, setTheme] = useState(authState.theme === "dark");
    console.log(authState)
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
                    control={<Switch />}
                    label="Dark Mode:"
                    labelPlacement="start"
                    checked={theme}
                    onChange={themeChanger} />
            </FormGroup>
        </div>
    );
};